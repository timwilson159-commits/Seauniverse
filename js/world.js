/* ============================================================
   SEA UNIVERSE: WORLD
   Tile grid, props, collision, exits, camera and all drawing.

   ART IS PLACEHOLDER ON PURPOSE, but shapes are distinct enough
   that the world reads at a glance. When real SVGs arrive, only
   drawProp/drawActor/drawObject need replacing.

   Drawing is DEPTH SORTED by y, so you walk behind a palm tree
   that is further down the screen than you and in front of one
   that is further up.
   ============================================================ */
window.SU = window.SU || {};

SU.World = (function () {
  const C = SU.config;
  const T = C.tile;

  let zone = null, zoneId = null;
  let grid = null;
  let propSolid = null;      // Set of "x,y" tiles blocked by props
  let cam = { x: 0, y: 0 };
  let onExitTile = false;
  let nearby = null;

  /* ---------- walk speed ----------
     A device preference, same as the audio volumes: its own localStorage
     key, not the save file, so it survives a wipe and does not need to
     be a per-character choice. Affects WALKING ONLY - nothing else
     (shift clock, animations, quest timers) reads this. */
  const SPEED_PRESETS = [1, 1.25, 1.5, 0.75];
  const SPEED_KEY = 'seaUniverse.walkSpeed';
  let speedMult = loadSpeedMult();

  function loadSpeedMult() {
    try {
      const v = parseFloat(localStorage.getItem(SPEED_KEY));
      return SPEED_PRESETS.indexOf(v) !== -1 ? v : SPEED_PRESETS[0];
    } catch (e) { return SPEED_PRESETS[0]; }
  }

  function cycleSpeedMult() {
    const i = SPEED_PRESETS.indexOf(speedMult);
    speedMult = SPEED_PRESETS[(i + 1) % SPEED_PRESETS.length];
    try { localStorage.setItem(SPEED_KEY, String(speedMult)); } catch (e) {}
    return speedMult;
  }

  /* ---------- deterministic noise, so scenery never shimmers ---------- */
  function hash(x, y) {
    let h = (x | 0) * 374761393 + (y | 0) * 668265263;
    h = (h ^ (h >> 13)) * 1274126177;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
  }

  /* ---------- zone loading ---------- */

  function buildGrid(z) {
    const g = [];
    for (let y = 0; y < z.h; y++) {
      g[y] = [];
      for (let x = 0; x < z.w; x++) g[y][x] = z.base;
    }
    (z.rects || []).forEach(r => {
      for (let y = r.y; y < r.y + (r.h || 1); y++)
        for (let x = r.x; x < r.x + (r.w || 1); x++)
          if (y >= 0 && y < z.h && x >= 0 && x < z.w) g[y][x] = r.t;
    });
    return g;
  }

  /* A prop may carry a `when` condition. That is how a repaired hazard
     opens a walkway: the barrier across the deck simply stops existing,
     and the plate that replaces it starts existing. Conditions are
     re-evaluated on every state change rather than only on zone load, so
     a repair agreed in a conversation takes effect under your feet. */
  function propActive(p) { return !p.when || SU.Rules.check(p.when); }

  function buildPropSolids(z) {
    const s = new Set();
    (z.props || []).forEach(p => {
      const def = SU.data.props[p.t];
      if (def && def.solid && propActive(p)) s.add(p.x + ',' + p.y);
    });
    return s;
  }

  /* Rebuild after a state change, then make sure we have not just closed a
     solid prop around the player. Nothing in the current content turns a
     barrier ON, but a future author will, and standing inside a solid tile
     blocks all four movement checks at once, a silent soft-lock. Freeing
     the tiles under the player costs one comparison and removes the whole
     failure mode. */
  function refreshProps() {
    if (!zone) return;
    propSolid = buildPropSolids(zone);
    const p = SU.State.data.player;
    if (!isBlocked(p.x, p.y)) return;
    const r = C.player.radius;
    [[-r, -r], [r, -r], [-r, r], [r, r]].forEach(([dx, dy]) =>
      propSolid.delete(Math.floor(p.x + dx) + ',' + Math.floor(p.y + dy)));
  }

  function loadZone(id, spawnName) {
    const z = SU.data.zones[id];
    if (!z) { console.error('[SU] no such zone', id); return; }
    zone = z;
    zoneId = id;
    grid = buildGrid(z);
    propSolid = buildPropSolids(z);

    const p = SU.State.data.player;

    /* NO SPAWN NAME MEANS "CARRY ON WHERE YOU WERE".
       Only the boot-from-save path calls this without a spawn, and it used
       to fall through to `start`, which no interior defines, and then to a
       hard-coded 2,2, so quitting inside any building and reloading put
       you in the corner of the room. The saved coordinates were written to
       the file every time and never read back.

       Guarded rather than trusted: the position has to be inside this map
       and not inside something solid, because a save can predate a layout
       change that walled the spot in. Anything that fails a check falls
       back to the old chain. */
    const keep = !spawnName && p.zone === id &&
                 Number.isFinite(p.x) && Number.isFinite(p.y) &&
                 p.x > 0 && p.y > 0 && p.x < z.w && p.y < z.h &&
                 !isBlocked(p.x, p.y);

    if (!keep) {
      const sp = (z.spawns && z.spawns[spawnName]) || (z.spawns && z.spawns.start) || { x: 2, y: 2 };
      p.x = sp.x + 0.5;
      p.y = sp.y + 0.5;
    }
    p.zone = id;
    onExitTile = true;

    SU.State.data.zonesVisited[id] = true;
    if (z.staffFor) SU.State.data.zonesVisited[z.staffFor] = true;

    SU.Actors.load(id);

    /* `onArrive` effects fire the first time you ever set foot in a zone.
       They share one claim key, so the whole list is a single one-shot. */
    if (z.onArrive) {
      SU.Rules.apply(z.onArrive.map(e => Object.assign({ once: 'arrive_' + id }, e)));
    }
    SU.bus.emit('zone:changed', z);
    SU.State.save();
  }

  /* ---------- collision ---------- */

  function tileAt(tx, ty) {
    if (ty < 0 || ty >= zone.h || tx < 0 || tx >= zone.w) return 'fence';
    return grid[ty][tx];
  }
  function solidAt(tx, ty) {
    if (propSolid.has(tx + ',' + ty)) return true;
    const def = SU.data.tiles[tileAt(tx, ty)];
    return !def || def.solid;
  }
  function isBlocked(px, py, radius) {
    const r = radius === undefined ? C.player.radius : radius;
    return solidAt(Math.floor(px - r), Math.floor(py - r)) ||
           solidAt(Math.floor(px + r), Math.floor(py - r)) ||
           solidAt(Math.floor(px - r), Math.floor(py + r)) ||
           solidAt(Math.floor(px + r), Math.floor(py + r));
  }

  /* ---------- update ---------- */

  function update(dt) {
    if (!zone) return;
    const p = SU.State.data.player;
    const k = SU.Input.keys;

    let dx = 0, dy = 0;
    if (k.left) dx -= 1;
    if (k.right) dx += 1;
    if (k.up) dy -= 1;
    if (k.down) dy += 1;

    if (dx || dy) {
      const len = Math.hypot(dx, dy) || 1;
      const speed = (C.player.baseSpeed + (SU.State.data.level - 1) * C.player.speedPerLevel) * speedMult;
      const s = speed * dt;
      const nx = p.x + (dx / len) * s;
      const ny = p.y + (dy / len) * s;
      if (!isBlocked(nx, p.y)) p.x = nx;
      if (!isBlocked(p.x, ny)) p.y = ny;
      p.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left')
                                             : (dy > 0 ? 'down' : 'up');
    }

    SU.Actors.update(dt);
    checkExits();
    nearby = findNearest();
    updateCamera();
  }

  function checkExits() {
    const p = SU.State.data.player;
    const tx = Math.floor(p.x), ty = Math.floor(p.y);
    const hit = (zone.exits || []).find(e => {
      const w = e.w || 1, h = e.h || 1;
      return tx >= e.x && tx < e.x + w && ty >= e.y && ty < e.y + h;
    });

    if (!hit) { onExitTile = false; return; }
    if (onExitTile) return;
    onExitTile = true;

    if (hit.condition && !SU.Rules.check(hit.condition)) {
      SU.Audio && SU.Audio.play('blocked');
      SU.Dialogue.open({ lines: [hit.lockedText || 'This way is closed.'] }, 'Locked');
      bounceOff(hit);
      return;
    }
    /* Three different transitions, three different sounds: into a
       building, out of one, and between two regions of the park. */
    const from = zone, to = SU.data.zones[hit.to];
    SU.Audio && SU.Audio.play(
      to && to.kind === 'interior' ? 'door_in'
      : from && from.kind === 'interior' ? 'door_out'
      : 'gate');
    loadZone(hit.to, hit.spawn);
    SU.UI.toast('Entering: ' + SU.data.zones[hit.to].name);
  }

  /* Step back off a locked doorway onto solid ground.
     Naively nudging in a fixed direction can push the player INTO the
     building the locked door belongs to, so try every direction and take
     the first that is walkable and not still on the exit. */
  function bounceOff(exit) {
    const p = SU.State.data.player;
    const w = exit.w || 1, h = exit.h || 1;
    const onExit = (x, y) => {
      const tx = Math.floor(x), ty = Math.floor(y);
      return tx >= exit.x && tx < exit.x + w && ty >= exit.y && ty < exit.y + h;
    };
    const back = { up: [0, 1], down: [0, -1], left: [1, 0], right: [-1, 0] }[p.facing] || [0, 1];
    const tries = [back, [0, 1], [0, -1], [1, 0], [-1, 0]];

    for (let i = 0; i < tries.length; i++) {
      const nx = p.x + tries[i][0] * 0.9, ny = p.y + tries[i][1] * 0.9;
      if (!isBlocked(nx, ny) && !onExit(nx, ny)) { p.x = nx; p.y = ny; return; }
    }
    onExitTile = false;                     // nowhere to go: let them try again
  }

  function updateCamera() {
    const p = SU.State.data.player;
    const vw = C.view.w, vh = C.view.h;
    const mapW = zone.w * T, mapH = zone.h * T;
    cam.x = mapW <= vw ? -(vw - mapW) / 2 : Math.max(0, Math.min(mapW - vw, p.x * T - vw / 2));
    cam.y = mapH <= vh ? -(vh - mapH) / 2 : Math.max(0, Math.min(mapH - vh, p.y * T - vh / 2));
  }

  /* ---------- interaction targeting ---------- */

  function findNearest() {
    const p = SU.State.data.player;
    let best = null, bestD = C.player.interactRange;

    (zone.objects || []).forEach(o => {
      const d = Math.hypot((o.x + 0.5) - p.x, (o.y + 0.5) - p.y);
      if (d < bestD) { bestD = d; best = { kind: 'object', data: o }; }
    });
    SU.Actors.list.forEach(a => {
      const d = Math.hypot(a.x - p.x, a.y - p.y);
      if (d < bestD) { bestD = d; best = { kind: 'npc', data: a }; }
    });
    (zone.props || []).forEach(pr => {
      const def = SU.data.props[pr.t];
      if (!def || !pr.text || !propActive(pr)) return;     // only props with flavour text
      const d = Math.hypot((pr.x + 0.5) - p.x, (pr.y + 0.5) - p.y);
      if (d < bestD) { bestD = d; best = { kind: 'prop', data: Object.assign({ name: def.name }, pr) }; }
    });
    return best;
  }

  function interact() {
    if (!nearby) return;
    const p = SU.State.data.player;
    if (nearby.kind === 'npc') {
      SU.Actors.faceTowards(nearby.data.id, p.x, p.y);
      SU.Dialogue.talkTo(nearby.data);
    } else if (nearby.kind === 'prop') {
      SU.Dialogue.open({ lines: [nearby.data.text] }, nearby.data.name);
    } else {
      SU.Interact.object(nearby.data);
    }
  }

  /* ---------- drawing ---------- */

  function draw(ctx) {
    if (!zone) return;
    ctx.clearRect(0, 0, C.view.w, C.view.h);
    ctx.fillStyle = '#0b1016';
    ctx.fillRect(0, 0, C.view.w, C.view.h);

    drawTiles(ctx);

    /* Depth-sorted layer: everything that should overlap correctly. */
    const items = [];
    (zone.objects || []).forEach(o =>
      items.push({ y: o.y + 0.9, fn: () => drawObject(ctx, o) }));
    (zone.props || []).forEach(p => {
      if (propActive(p)) items.push({ y: p.y + 0.9, fn: () => drawProp(ctx, p) });
    });
    SU.Actors.list.forEach(a =>
      items.push({ y: a.y, fn: () => drawActor(ctx, a) }));
    const pl = SU.State.data.player;
    items.push({ y: pl.y, fn: () => drawPlayer(ctx, pl) });

    items.sort((a, b) => a.y - b.y);
    items.forEach(i => i.fn());

    drawHighlight(ctx);
    if (C.dev) drawDevOverlay(ctx);
  }

  function drawTiles(ctx) {
    const x0 = Math.max(0, Math.floor(cam.x / T));
    const y0 = Math.max(0, Math.floor(cam.y / T));
    const x1 = Math.min(zone.w, Math.ceil((cam.x + C.view.w) / T));
    const y1 = Math.min(zone.h, Math.ceil((cam.y + C.view.h) / T));

    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const id = grid[y][x];
        const def = SU.data.tiles[id];
        const sx = Math.round(x * T - cam.x), sy = Math.round(y * T - cam.y);
        const n = hash(x, y);

        if (SU.Sprites.drawTile(ctx, 'tile_' + id, sx, sy, T)) continue;

        ctx.fillStyle = def.colour;
        ctx.fillRect(sx, sy, T, T);

        // per-tile brightness variation, breaks up flat colour fields
        ctx.fillStyle = n > 0.5 ? 'rgba(255,255,255,' + ((n - 0.5) * 0.09).toFixed(3) + ')'
                                : 'rgba(0,0,0,' + ((0.5 - n) * 0.11).toFixed(3) + ')';
        ctx.fillRect(sx, sy, T, T);

        // scattered detail so ground doesn't look like graph paper
        if (id === 'grass' && n > 0.72) {
          ctx.fillStyle = 'rgba(120,180,120,0.22)';
          const gx = sx + 5 + n * 18, gy = sy + 6 + hash(y, x) * 18;
          ctx.fillRect(gx, gy, 2, 4);
          ctx.fillRect(gx + 4, gy + 2, 2, 3);
        } else if (id === 'sand' && n > 0.8) {
          ctx.fillStyle = 'rgba(255,255,255,0.16)';
          ctx.fillRect(sx + 4 + n * 20, sy + 5 + hash(y, x) * 20, 2, 2);
        } else if (id === 'deck') {
          ctx.fillStyle = 'rgba(0,0,0,0.12)';       // decking planks
          ctx.fillRect(sx, sy + (n > 0.5 ? 10 : 21), T, 1);
        } else if (id === 'board') {
          ctx.fillStyle = 'rgba(0,0,0,0.18)';       // boardwalk runs across you
          ctx.fillRect(sx, sy + 7, T, 1);
          ctx.fillRect(sx, sy + 16, T, 1);
          ctx.fillRect(sx, sy + 25, T, 1);
        } else if (id === 'hall') {
          ctx.fillStyle = 'rgba(255,255,255,0.05)'; // polished floor, faint grid
          ctx.fillRect(sx, sy, T, 1);
          ctx.fillRect(sx, sy, 1, T);
        } else if (id === 'shallow') {
          const t = performance.now() / 1100;
          ctx.fillStyle = 'rgba(255,255,255,0.10)';
          const wob = Math.sin(t + x * 0.9 + y * 0.6) * 2;
          ctx.fillRect(sx + 3, sy + 9 + wob, T - 6, 2);
          ctx.fillStyle = 'rgba(255,255,255,0.07)';
          ctx.fillRect(sx + 7, sy + 20 - wob, T - 14, 2);
        } else if (id === 'water') {
          const t = performance.now() / 900;
          ctx.fillStyle = 'rgba(255,255,255,0.055)';
          const wob = Math.sin(t + x * 0.7 + y * 0.4) * 3;
          ctx.fillRect(sx + 4, sy + 12 + wob, T - 8, 2);
        }
      }
    }
  }

  function screen(tx, ty) { return { x: tx * T - cam.x, y: ty * T - cam.y }; }

  function shadow(ctx, cx, cy, rx) {
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, rx * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /* `topY` is the top of the ART, not the tile: labels are lifted clear
     of it so they never sit on a character's face.

     Long names WRAP rather than being cut off with an ellipsis, and the
     box grows UPWARD from the same anchor, so extra lines never eat into
     the gap that keeps the label off the sprite's head. */
  const LABEL_GAP  = 7;
  const LABEL_LINE = 13;   // px per line
  const LABEL_MAXW = 92;   // px, roughly three tiles

  /* Greedy word wrap. A single word wider than the limit is hard-broken,
     so a long unspaced name can never blow out the box. */
  function wrapLabel(ctx, text, maxW) {
    const fits = s => ctx.measureText(s).width + 8 <= maxW;
    const lines = [];
    let line = '';

    String(text).split(/\s+/).filter(Boolean).forEach(word => {
      while (!fits(word)) {                       // break an over-long word
        let cut = 1;
        while (cut < word.length && fits(word.slice(0, cut + 1))) cut++;
        if (line) { lines.push(line); line = ''; }
        lines.push(word.slice(0, cut));
        word = word.slice(cut);
      }
      const test = line ? line + ' ' + word : word;
      if (line && !fits(test)) { lines.push(line); line = word; }
      else line = test;
    });

    if (line) lines.push(line);
    return lines.length ? lines : [''];
  }

  function label(ctx, cx, topY, text) {
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'center';

    const lines = wrapLabel(ctx, text, LABEL_MAXW);
    const h = lines.length * LABEL_LINE;
    const w = Math.max.apply(null, lines.map(l => ctx.measureText(l).width)) + 8;
    const boxTop = topY - LABEL_GAP - h;

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(cx - w / 2, boxTop, w, h);
    ctx.fillStyle = '#fff';
    lines.forEach((l, i) => ctx.fillText(l, cx, boxTop + 10 + i * LABEL_LINE));

    /* Returns the top of the box so a caller can stack something above it
       without recomputing the wrap. Nothing needed this until the watching
       eye; the label box is a variable height, so guessing an offset from
       `topY` would sit on top of a two-line name. */
    return boxTop;
  }

  /* ---------- the watching eye ----------
     Draws over the head of a member of staff who has noticed you.

     THIS IS WHAT `reactsToSuspicion` IS FOR. The field sat on all 68 NPCs
     from the very first cast file and NO CODE HAS EVER READ IT: 16 staff
     are marked true, 52 visitors and one-off characters false. It is now
     the switch for who notices, which is what the name always promised.

     The condition is deliberately IDENTICAL to the watched gate in
     js/interact.js: suspicion at or above the threshold, and only during
     a public shift. So the eye is not decoration, it is the rule made
     visible. If you can see eyes you cannot snoop, and when they close
     you can. A player who has just been refused can look up and see who
     is doing the refusing, which teaches the mechanic without a tutorial
     line. Keep the two conditions in step if either ever changes. */
  function isWatching(a) {
    return a.def.reactsToSuspicion === true &&
           SU.State.data.suspicion >= C.suspicion.watchedAt &&
           SU.State.phase().kind === 'public';
  }

  function watchMarker(ctx, cx, bottomY) {
    /* Slow pulse off accumulated PLAY time, the same clock the shift runs
       on, so it stops with everything else when the game is paused or a
       menu is open. A marker that carried on breathing behind a modal
       would be the only moving thing on a frozen screen. */
    const t = (SU.State.data.meta.playMs || 0) / 520;
    const pulse = 0.72 + Math.sin(t) * 0.24;
    const cy = bottomY - 9;

    ctx.save();
    ctx.globalAlpha = pulse;

    ctx.fillStyle = '#f2c14b';                 // same amber as the travel button
    ctx.beginPath();
    ctx.ellipse(cx, cy, 7, 4.4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1a1206';
    ctx.beginPath();
    ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* --- props: distinct silhouettes, no labels (they'd clutter) --- */
  function drawProp(ctx, p) {
    const def = SU.data.props[p.t];
    if (!def) return;
    const s = screen(p.x, p.y);
    if (s.x < -80 || s.y < -100 || s.x > C.view.w + 80 || s.y > C.view.h + 80) return;

    const cx = s.x + T / 2, base = s.y + T - 4;

    // real art wins if it has been dropped into /sprites
    if (SU.Sprites.draw(ctx, 'prop_' + p.t, cx, base + 4, def.tilesWide || 1)) return;

    const n = hash(p.x * 7, p.y * 13);
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1.5;

    switch (def.shape) {
      case 'tree': {
        shadow(ctx, cx, base, 11);
        ctx.fillStyle = '#5a4632';
        ctx.fillRect(cx - 3, s.y + 6, 6, T - 10);
        ctx.fillStyle = def.colour;
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2 + n;
          ctx.beginPath();
          ctx.ellipse(cx + Math.cos(a) * 10, s.y + 2 + Math.sin(a) * 7, 9, 5, a, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'bush': {
        shadow(ctx, cx, base, 10);
        ctx.fillStyle = def.colour;
        [[-6, 2, 7], [6, 3, 7], [0, -3, 9]].forEach(b => {
          ctx.beginPath();
          ctx.arc(cx + b[0], base - 8 + b[1], b[2], 0, Math.PI * 2);
          ctx.fill();
        });
        break;
      }
      case 'rock': {
        shadow(ctx, cx, base, 10);
        ctx.fillStyle = def.colour;
        ctx.beginPath();
        const pts = 7;
        for (let i = 0; i < pts; i++) {
          const a = (i / pts) * Math.PI * 2;
          const r = 8 + hash(p.x + i, p.y) * 5;
          const px = cx + Math.cos(a) * r, py = base - 7 + Math.sin(a) * r * 0.7;
          i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }
      case 'bench': {
        shadow(ctx, cx, base, 12);
        ctx.fillStyle = def.colour;
        ctx.fillRect(cx - 13, base - 12, 26, 7);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(cx - 13, base - 6, 26, 4);
        ctx.fillStyle = def.colour;
        ctx.fillRect(cx - 12, base - 20, 24, 5);
        break;
      }
      case 'cyl': {
        shadow(ctx, cx, base, 8);
        ctx.fillStyle = def.colour;
        ctx.fillRect(cx - 7, base - 18, 14, 17);
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(cx - 7, base - 18, 14, 3);
        ctx.strokeRect(cx - 7, base - 18, 14, 17);
        break;
      }
      case 'post': {
        shadow(ctx, cx, base, 5);
        ctx.fillStyle = def.colour;
        ctx.fillRect(cx - 2, base - 26, 4, 25);
        ctx.fillStyle = '#f0e0a0';
        ctx.beginPath(); ctx.arc(cx, base - 28, 5, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'umbrella': {
        shadow(ctx, cx, base, 12);
        ctx.fillStyle = '#6b6b6b';
        ctx.fillRect(cx - 1.5, base - 24, 3, 23);
        ctx.fillStyle = def.colour;
        ctx.beginPath();
        ctx.moveTo(cx - 16, base - 22);
        ctx.quadraticCurveTo(cx, base - 34, cx + 16, base - 22);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }
      case 'box': {
        shadow(ctx, cx, base, 10);
        ctx.fillStyle = def.colour;
        ctx.fillRect(cx - 10, base - 17, 20, 16);
        ctx.strokeRect(cx - 10, base - 17, 20, 16);
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.moveTo(cx - 10, base - 9); ctx.lineTo(cx + 10, base - 9); ctx.stroke();
        break;
      }
      case 'ring': {
        ctx.fillStyle = def.colour;
        ctx.beginPath(); ctx.arc(cx, base - 8, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f0f0f0';
        ctx.beginPath(); ctx.arc(cx, base - 8, 4.5, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'cone': {
        ctx.fillStyle = def.colour;
        ctx.beginPath();
        ctx.moveTo(cx, base - 20); ctx.lineTo(cx + 8, base - 1); ctx.lineTo(cx - 8, base - 1);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillRect(cx - 5.5, base - 11, 11, 3);
        break;
      }
      case 'coral': {
        shadow(ctx, cx, base, 10);
        ctx.fillStyle = def.colour;
        [[-7, 0, 6], [7, 1, 6], [0, -6, 7], [-4, -10, 4], [5, -9, 4]].forEach(b => {
          ctx.beginPath();
          ctx.arc(cx + b[0], base - 8 + b[1], b[2], 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.fillStyle = 'rgba(255,255,255,0.22)';   // branching highlights
        ctx.fillRect(cx - 1, base - 20, 2, 8);
        ctx.fillRect(cx - 8, base - 13, 2, 6);
        ctx.fillRect(cx + 6, base - 12, 2, 6);
        break;
      }
      case 'kelp': {
        shadow(ctx, cx, base, 7);
        ctx.strokeStyle = def.colour;
        ctx.lineWidth = 3;
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.moveTo(cx + i * 5, base - 1);
          ctx.quadraticCurveTo(cx + i * 11 + n * 4, base - 16, cx + i * 6, base - 27 - i * i * 4);
          ctx.stroke();
        }
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        break;
      }
      case 'tank': {
        shadow(ctx, cx, base, 11);
        ctx.fillStyle = '#2b3a3f';                  // plinth
        ctx.fillRect(cx - 11, base - 8, 22, 7);
        ctx.fillStyle = def.colour;                 // lit water column
        ctx.fillRect(cx - 9, base - 28, 18, 20);
        ctx.fillStyle = 'rgba(255,255,255,0.20)';
        ctx.fillRect(cx - 9, base - 28, 18, 3);
        ctx.fillRect(cx - 6, base - 24, 3, 14);
        ctx.strokeRect(cx - 9, base - 28, 18, 20);
        break;
      }
      case 'pillar': {
        shadow(ctx, cx, base, 9);
        ctx.fillStyle = def.colour;
        ctx.fillRect(cx - 7, base - 30, 14, 29);
        ctx.fillStyle = 'rgba(255,255,255,0.14)';
        ctx.fillRect(cx - 7, base - 30, 4, 29);
        ctx.strokeRect(cx - 7, base - 30, 14, 29);
        break;
      }
      case 'pipe': {
        shadow(ctx, cx, base, 8);
        ctx.fillStyle = def.colour;
        ctx.fillRect(cx - 8, base - 22, 5, 21);     // two standpipes
        ctx.fillRect(cx + 3, base - 26, 5, 25);
        ctx.fillRect(cx - 8, base - 22, 16, 4);     // crossover
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(cx - 8, base - 22, 2, 21);
        ctx.strokeRect(cx - 8, base - 22, 5, 21);
        ctx.strokeRect(cx + 3, base - 26, 5, 25);
        break;
      }
      default: {
        shadow(ctx, cx, base, 9);
        ctx.fillStyle = def.colour;
        ctx.fillRect(cx - 9, base - 15, 18, 14);
      }
    }
  }

  function drawObject(ctx, o) {
    const s = screen(o.x, o.y);
    if (s.x < -80 || s.y < -80 || s.x > C.view.w + 80 || s.y > C.view.h + 80) return;
    const colour = { sign: '#c8c2b0', station: '#9fb0a8', search: '#a88b5c',
                     animal: '#4fb0c6', shop: '#d9a441', transit: '#8ea9c9',
                     observe: '#8fd1b0', talk: '#e0b070', keypad: '#b06ad1',
                     arcade: '#5f6fd6' }[o.kind] || '#bbb';
    const cx = s.x + T / 2, base = s.y + T - 4;

    const drawnH = SU.Sprites.draw(ctx, ['obj_' + o.id, 'obj_' + o.kind], cx, base + 4, o.tilesWide || 1);
    if (drawnH) {
      label(ctx, cx, base + 4 - drawnH, o.name);
      return;
    }

    shadow(ctx, cx, base, 10);
    if (o.kind === 'sign') {
      ctx.fillStyle = '#5a4632';
      ctx.fillRect(cx - 2, base - 12, 4, 11);
      ctx.fillStyle = colour;
      ctx.fillRect(cx - 12, base - 26, 24, 15);
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.strokeRect(cx - 12, base - 26, 24, 15);
    } else {
      ctx.fillStyle = colour;
      ctx.fillRect(cx - 11, base - 22, 22, 21);
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.strokeRect(cx - 11, base - 22, 22, 21);
    }
    label(ctx, cx, base - 26, o.name);
  }

  function drawActor(ctx, a) {
    const cx = a.x * T - cam.x, cy = a.y * T - cam.y;
    if (cx < -80 || cy < -80 || cx > C.view.w + 80 || cy > C.view.h + 80) return;

    // facing-specific art first (npc_dana_up.svg), then a single all-angles sprite.
    // `sprite` lets a second appearance of the same character (Barry in the cove,
    // Barry at the reef) reuse one drawing instead of needing its own file.
    const art = a.def.sprite || a.id;
    const drawnH = SU.Sprites.draw(ctx, ['npc_' + art + '_' + a.facing, 'npc_' + art], cx, cy + T * 0.5);
    if (drawnH) {
      const top = label(ctx, cx, cy + T * 0.5 - drawnH, a.name);
      if (isWatching(a)) watchMarker(ctx, cx, top);
      return;
    }

    shadow(ctx, cx, cy + T * 0.34, T * 0.3);
    ctx.fillStyle = a.colour || '#ddd';
    ctx.beginPath();
    ctx.arc(cx, cy, T * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[a.facing] || [0, 1];
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.arc(cx + d[0] * T * 0.19, cy + d[1] * T * 0.19, 3, 0, Math.PI * 2);
    ctx.fill();

    const top = label(ctx, cx, cy - T * 0.34, a.name);
    if (isWatching(a)) watchMarker(ctx, cx, top);
  }

  function drawPlayer(ctx, p) {
    const cx = p.x * T - cam.x, cy = p.y * T - cam.y;

    /* Most specific art wins: the chosen body facing this way, then that
       body, then the generic player art. So player_female.svg alone is
       enough, and facing variants are a free upgrade if they ever land. */
    const body = p.sprite || 'female';
    const drawnH = SU.Sprites.draw(ctx,
      ['player_' + body + '_' + p.facing, 'player_' + body, 'player_' + p.facing, 'player'],
      cx, cy + T * 0.5);
    if (drawnH) {
      label(ctx, cx, cy + T * 0.5 - drawnH, 'YOU');
      return;
    }

    shadow(ctx, cx, cy + T * 0.36, T * 0.3);
    ctx.fillStyle = '#f5f0e6';
    ctx.beginPath();
    ctx.arc(cx, cy, T * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1d3f52';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[p.facing] || [0, 1];
    ctx.fillStyle = '#1d3f52';
    ctx.beginPath();
    ctx.arc(cx + d[0] * T * 0.2, cy + d[1] * T * 0.2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    label(ctx, cx, cy - T * 0.34, 'YOU');
  }

  /* THE RING TELLS YOU WHETHER IT IS WORTH PRESSING E.
     Searchable things are the only ones that go empty, and the only ones
     the player was previously made to remember. Green means there is
     something here now; red means you have had it and it is not back yet.
     Everything else keeps the neutral yellow, because "have you used
     this" is not a question that applies to a person or a noticeboard.

     Restocking objects (no `once`) go red for the rest of the day and
     green again tomorrow, which is exactly what `st.day` already
     records: the state existed, nothing was ever drawn from it. */
  function searchRingColour(o) {
    const st = SU.State.data.objects[o.id];
    if (!st) return '#6fd18a';
    if (o.once) return st.searched ? '#e08a8a' : '#6fd18a';
    return st.day === SU.State.data.day ? '#e08a8a' : '#6fd18a';
  }

  function drawHighlight(ctx) {
    if (!nearby) return;
    const e = nearby.data;
    const cx = (nearby.kind === 'npc' ? e.x * T : e.x * T + T / 2) - cam.x;
    const cy = (nearby.kind === 'npc' ? e.y * T : e.y * T + T / 2) - cam.y;
    ctx.strokeStyle = (nearby.kind === 'object' && e.kind === 'search')
      ? searchRingColour(e) : '#ffe08a';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(cx - T / 2 - 3, cy - T / 2 - 3, T + 6, T + 6);
    ctx.setLineDash([]);
  }

  function drawDevOverlay(ctx) {
    const p = SU.State.data.player;
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(6, 6, 230, 60);
    ctx.fillStyle = '#9ef';
    ctx.fillText('zone ' + p.zone, 12, 20);
    ctx.fillText('tile ' + Math.floor(p.x) + ',' + Math.floor(p.y), 12, 34);
    ctx.fillText('stage ' + SU.State.data.storyStage + '  susp ' + SU.State.data.suspicion, 12, 48);
    ctx.fillText('actors ' + SU.Actors.list.length, 12, 62);
  }

  /* Conditional props have to re-evaluate when the world changes, not just
     when a zone loads, or a repair would not appear until you left the
     region and came back. */
  SU.bus.on('state:changed', refreshProps);

  return {
    loadZone, update, draw, interact,
    isBlocked, solidAt, tileAt, refreshProps,
    cycleSpeedMult,
    get zone() { return zone; },
    get zoneId() { return zoneId; },
    get nearby() { return nearby; },
    get speedMult() { return speedMult; }
  };
})();
