/* ============================================================
   SEA UNIVERSE: ACTORS (live NPC instances)

   NPC data in data/npcs.js describes WHO someone is. This file
   handles WHERE they are right now: live positions, wandering,
   patrol routes.

   MOVEMENT TYPES (set `movement` on an NPC in data/npcs.js):

     { type:'static' }                          // default, stays put
     { type:'wander', radius:3 }                // drifts around home
     { type:'patrol', points:[{x,y},{x,y}] }    // walks a fixed route

   Optional on any of them:
     speed  : tiles per second (default 1.1, noticeably slower than you)
     pause  : [min,max] seconds to wait on arrival (default [1,3])
     loop   : 'cycle' (default, walks route then restarts) | 'pingpong'

   Positions are CENTRE-OF-TILE floats, so an NPC written as x:27,y:11
   in the data file starts life at 27.5, 11.5.

   Designed so a future `schedule` field (different home per day phase,
   per the design doc's relocating-NPC mechanic) slots in without
   touching anything else: it just changes `home` and lets the existing
   movement carry on.
   ============================================================ */
window.SU = window.SU || {};

SU.Actors = (function () {

  let list = [];
  let zoneId = null;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function make(id, def) {
    const m = def.movement || { type: 'static' };
    const home = { x: def.x + 0.5, y: def.y + 0.5 };
    return {
      id: id,
      def: def,
      name: def.name,
      colour: def.colour,
      x: home.x,
      y: home.y,
      home: home,
      move: m,
      speed: m.speed || 1.1,
      pause: m.pause || [1, 3],
      target: null,
      wait: rand(0.2, 1.6),      // stagger so they don't all set off together
      wp: 0,                     // patrol waypoint index
      dir: 1,                    // pingpong direction
      stuck: 0,
      facing: 'down'
    };
  }

  /* Rebuild the roster for a zone. */
  function load(zid) {
    zoneId = zid;
    list = [];
    for (const id in SU.data.npcs) {
      const def = SU.data.npcs[id];
      if (def.zone !== zid) continue;
      if (def.spawnCondition && !SU.Rules.check(def.spawnCondition)) continue;
      list.push(make(id, def));
    }
  }

  /* Re-check spawn conditions without teleporting everyone home.
     Lets NPCs like Barry appear and leave mid-play. */
  function refresh() {
    if (!zoneId) return;
    for (const id in SU.data.npcs) {
      const def = SU.data.npcs[id];
      if (def.zone !== zoneId) continue;
      const present = list.some(a => a.id === id);
      const should = !def.spawnCondition || SU.Rules.check(def.spawnCondition);
      if (should && !present) list.push(make(id, def));
      if (!should && present) list = list.filter(a => a.id !== id);
    }
  }

  /* ---------- movement ---------- */

  function update(dt) {
    for (let i = 0; i < list.length; i++) step(list[i], dt);
  }

  function step(a, dt) {
    if (a.move.type === 'static') return;

    if (a.wait > 0) { a.wait -= dt; return; }

    if (!a.target) {
      a.target = pickTarget(a);
      if (!a.target) { a.wait = 1; return; }
    }

    const dx = a.target.x - a.x;
    const dy = a.target.y - a.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 0.12) {                       // arrived
      a.target = null;
      a.wait = rand(a.pause[0], a.pause[1]);
      a.stuck = 0;
      return;
    }

    const s = a.speed * dt;
    const nx = a.x + (dx / dist) * s;
    const ny = a.y + (dy / dist) * s;

    let moved = false;
    if (!SU.World.isBlocked(nx, a.y, 0.28)) { a.x = nx; moved = true; }
    if (!SU.World.isBlocked(a.x, ny, 0.28)) { a.y = ny; moved = true; }

    if (moved) {
      a.stuck = 0;
      a.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left')
                                             : (dy > 0 ? 'down' : 'up');
    } else {
      a.stuck += dt;
      if (a.stuck > 0.6) { a.target = null; a.stuck = 0; a.wait = rand(0.3, 1); }
    }
  }

  function pickTarget(a) {
    if (a.move.type === 'wander') {
      const r = a.move.radius || 2;
      for (let tries = 0; tries < 12; tries++) {
        const p = {
          x: a.home.x + rand(-r, r),
          y: a.home.y + rand(-r, r)
        };
        if (!SU.World.isBlocked(p.x, p.y, 0.28)) return p;
      }
      return null;
    }

    if (a.move.type === 'patrol') {
      const pts = a.move.points || [];
      if (!pts.length) return null;

      if (a.move.loop === 'pingpong') {
        a.wp += a.dir;
        if (a.wp >= pts.length) { a.wp = pts.length - 2; a.dir = -1; }
        if (a.wp < 0) { a.wp = 1; a.dir = 1; }
      } else {
        a.wp = (a.wp + 1) % pts.length;
      }
      a.wp = Math.max(0, Math.min(pts.length - 1, a.wp));
      return { x: pts[a.wp].x + 0.5, y: pts[a.wp].y + 0.5 };
    }

    return null;
  }

  /* Turn to face the player, called when you start a conversation. */
  function faceTowards(id, px, py) {
    const a = list.find(n => n.id === id);
    if (!a) return;
    const dx = px - a.x, dy = py - a.y;
    a.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left')
                                           : (dy > 0 ? 'down' : 'up');
    a.target = null;
    a.wait = 2.5;                            // stand still for a beat afterwards
  }

  /* Story progress can make NPCs appear or leave (e.g. Barry). */
  SU.bus.on('state:changed', refresh);

  return {
    load, refresh, update, faceTowards,
    get list() { return list; }
  };
})();
