/* ============================================================
   SEA UNIVERSE: CONTENT VALIDATOR
   Cross-checks every ID reference in the data files at load time.

   This exists so the game stays manageable as content grows. When
   there are 40 NPCs and 60 quests, a typo'd item id should be a
   console error at startup, not a bug someone finds in class.

   It also runs a REACHABILITY FLOOD FILL from each zone's spawn,
   which catches the failure mode scenery introduces: a decorative
   palm tree quietly sealing off a quest NPC.

   Add ?dev to the URL to see the report on screen.
   ============================================================ */
window.SU = window.SU || {};

SU.Validate = (function () {

  /* Rebuild a zone's tile grid exactly as World does. */
  function buildGrid(z) {
    const g = [];
    for (let y = 0; y < z.h; y++) { g[y] = []; for (let x = 0; x < z.w; x++) g[y][x] = z.base; }
    (z.rects || []).forEach(r => {
      for (let y = r.y; y < r.y + (r.h || 1); y++)
        for (let x = r.x; x < r.x + (r.w || 1); x++)
          if (y >= 0 && y < z.h && x >= 0 && x < z.w) g[y][x] = r.t;
    });
    return g;
  }

  /* Props can be conditional (`when`), which is how a repaired hazard opens
     a walkway. That gives every map with hazards TWO shapes, and both have
     to be checked:

       withConditional = true   the park before any repair: the most
                                blocked the map can ever be
       withConditional = false  the park after every repair: the least
                                blocked it can ever be

     A route that only exists in one of them is not a bug by itself; a
     route that exists in NEITHER is. See the double flood fill below. */
  function solidSet(z, withConditional) {
    const s = new Set();
    (z.props || []).forEach(p => {
      const d = SU.data.props[p.t];
      if (!d || !d.solid) return;
      if (p.when && !withConditional) return;
      s.add(p.x + ',' + p.y);
    });
    return s;
  }
  function hasConditionalProps(z) { return (z.props || []).some(p => !!p.when); }

  /* Flood fill from a start tile; returns a Set of reachable "x,y". */
  function flood(z, grid, props, start) {
    const seen = new Set();
    const blocked = (x, y) => {
      if (x < 0 || y < 0 || x >= z.w || y >= z.h) return true;
      if (props.has(x + ',' + y)) return true;
      const t = SU.data.tiles[grid[y][x]];
      return !t || t.solid;
    };
    if (blocked(start.x, start.y)) return seen;

    const q = [[start.x, start.y]];
    seen.add(start.x + ',' + start.y);
    while (q.length) {
      const [x, y] = q.pop();
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
        if (seen.has(k) || blocked(nx, ny)) return;
        seen.add(k);
        q.push([nx, ny]);
      });
    }
    return seen;
  }

  /* Something is usable if you can stand on it or beside it. */
  function usable(reach, x, y) {
    return reach.has(x + ',' + y) ||
           reach.has((x + 1) + ',' + y) || reach.has((x - 1) + ',' + y) ||
           reach.has(x + ',' + (y + 1)) || reach.has(x + ',' + (y - 1));
  }

  function run() {
    const errs = [], warns = [];
    const D = SU.data;
    const has = (obj, id) => Object.prototype.hasOwnProperty.call(obj, id);
    const err = (m) => errs.push(m);
    const warn = (m) => warns.push(m);

    /* ---- effects ---- */
    function checkEffects(list, where) {
      if (!list) return;
      (Array.isArray(list) ? list : [list]).forEach(e => {
        if (!e || !e.type) { err(where + ': effect with no type'); return; }
        if (SU.Rules.effectTypes.indexOf(e.type) === -1) err(where + ': unknown effect type "' + e.type + '"');
        if ((e.type === 'giveItem' || e.type === 'takeItem') && !has(D.items, e.id)) err(where + ': unknown item "' + e.id + '"');
        if (e.type === 'addEvidence' && !has(D.evidence, e.id)) err(where + ': unknown evidence "' + e.id + '"');
        if (e.type === 'achievement' && !has(D.achievements, e.id)) err(where + ': unknown achievement "' + e.id + '"');
        if (e.type === 'discoverSpecies' && !has(D.species, e.id)) err(where + ': unknown species "' + e.id + '"');
        if (e.type === 'addTrust' && !has(D.species, e.species)) err(where + ': unknown species "' + e.species + '"');
        if ((e.type === 'startQuest' || e.type === 'completeQuest') && !has(D.quests, e.id)) err(where + ': unknown quest "' + e.id + '"');
        if (e.type === 'addSkill' && !SU.config.skills.some(s => s.id === e.skill)) err(where + ': unknown skill "' + e.skill + '"');
        if (e.type === 'grantQualification' && !has(D.qualifications, e.id)) err(where + ': unknown qualification "' + e.id + '"');
        if ((e.type === 'logHazard' || e.type === 'repairHazard') && !hazardIds[e.id]) err(where + ': unknown hazard "' + e.id + '"');
      });
    }

    /* ---- repeatable payouts (the farming class of bug) ----
       Content that can be triggered over and over must not hand out value
       over and over. A payout is safe if it is claim-gated (once/perDay) or
       if the scene around it can only fire once, which in practice means
       the entry sets a flag, or changes a quest status, that its own `when`
       is testing. Heuristic, so this warns rather than errors. */
    const PAYOUT = ['addXP', 'money', 'addSkillPoints', 'addSkill', 'giveItem', 'addTrust'];

    function ungatedPayouts(list) {
      return (Array.isArray(list) ? list : list ? [list] : [])
        .filter(e => e && PAYOUT.indexOf(e.type) !== -1 && !e.once && !e.perDay);
    }

    /* `gate` is everything that decides whether this scene can play again:
       the entry's own `when`, plus the NPC's spawnCondition, an NPC who
       vanishes once a flag is set cannot be talked to twice either. */
    function selfGating(entry, npc) {
      const gate = [];
      if (entry.when) gate.push(entry.when);
      if (npc && npc.spawnCondition) gate.push(npc.spawnCondition);
      if (!gate.length) return false;                 // always matches = always repeatable
      const eff = [].concat(entry.onEnd || []);
      (entry.choices || []).forEach(c => eff.push.apply(eff, [].concat(c.effects || [])));
      const when = JSON.stringify(gate);
      const mentioned = (id) => id && when.indexOf('"' + id + '"') !== -1;
      return eff.some(e =>
        (e.type === 'setFlag' && e.value !== false && mentioned(e.flag)) ||
        ((e.type === 'startQuest' || e.type === 'completeQuest') && mentioned(e.id)) ||
        /* Hazards self-gate the same way: an entry conditioned on a defect
           being logged-but-not-repaired, which then repairs it, has made
           its own `when` false and cannot run twice. */
        ((e.type === 'logHazard' || e.type === 'repairHazard') && mentioned(e.id)));
    }

    function checkRepeatable(list, where, how) {
      ungatedPayouts(list).forEach(e => warn(
        where + ': repeatable payout: "' + e.type + '" fires every time. ' + how));
    }

    /* ---- conditions ---- */
    /* Hazards are declared inside zone data rather than in a file of their
       own, so conditions that name one need somewhere to look. */
    const hazardIds = {};
    for (const zid in D.zones) {
      (D.zones[zid].objects || []).forEach(o => {
        if (o.kind !== 'hazard') return;
        if (hazardIds[o.id]) err('hazard "' + o.id + '" is declared twice (' + hazardIds[o.id] + ' and ' + zid + ')');
        hazardIds[o.id] = zid;
      });
    }

    function checkCond(c, where) {
      if (!c) return;
      if (c.hazardLogged)   [].concat(c.hazardLogged).forEach(x => { if (!hazardIds[x]) err(where + ': condition on unknown hazard "' + x + '"'); });
      if (c.hazardRepaired) [].concat(c.hazardRepaired).forEach(x => { if (!hazardIds[x]) err(where + ': condition on unknown hazard "' + x + '"'); });
      if (c.hazardCount && c.hazardCount.min > Object.keys(hazardIds).length) {
        err(where + ': asks for ' + c.hazardCount.min + ' logged hazards, but the whole park only has ' +
            Object.keys(hazardIds).length);
      }
      if (c.hasItems) for (const k in c.hasItems) if (!has(D.items, k)) err(where + ': condition on unknown item "' + k + '"');
      if (c.quest)    for (const k in c.quest)    if (!has(D.quests, k)) err(where + ': condition on unknown quest "' + k + '"');
      if (c.species)  for (const k in c.species)  if (!has(D.species, k)) err(where + ': condition on unknown species "' + k + '"');
      if (c.skill)    for (const k in c.skill)    if (!SU.config.skills.some(s => s.id === k)) err(where + ': condition on unknown skill "' + k + '"');
      if (c.qualification) [].concat(c.qualification).forEach(q => { if (!has(D.qualifications, q)) err(where + ': condition on unknown qualification "' + q + '"'); });
      if (c.evidence)      [].concat(c.evidence).forEach(e => { if (!has(D.evidence, e)) err(where + ': condition on unknown evidence "' + e + '"'); });
      if (c.zoneVisited) [].concat(c.zoneVisited).forEach(z => { if (!has(D.zones, z)) err(where + ': condition on unknown zone "' + z + '"'); });
      if (c.any) c.any.forEach((x, i) => checkCond(x, where + '.any[' + i + ']'));
      if (c.not) checkCond(c.not, where + '.not');
    }

    /* ---- story beats (Journal → Summary) ----
       A beat is resolved only by its condition, so a typo in an evidence
       or flag name would leave it permanently unreachable with nothing
       on screen to say so. checkCond catches the id typos. */
    const beatIds = {};
    (D.storyBeats || []).forEach((b, i) => {
      const w = 'storyBeat[' + (b.id || '#' + i) + ']';
      if (!b.id) err(w + ': missing id');
      else if (beatIds[b.id]) err(w + ': duplicate story beat id');
      else beatIds[b.id] = true;
      if (!b.title)   err(w + ': missing title');
      if (!b.summary) err(w + ': missing summary');
      if (!b.when) err(w + ': no `when` condition, so it can never resolve');
      else checkCond(b.when, w);
    });

    /* ---- zones ---- */
    const reachByZone = {};
    for (const zid in D.zones) {
      const z = D.zones[zid];
      const grid = buildGrid(z);
      const props = solidSet(z, false);          // the map with every repair done
      const propsBefore = solidSet(z, true);     // the map with none of them done
      const solid = (x, y) => {
        if (y < 0 || y >= z.h || x < 0 || x >= z.w) return true;
        if (props.has(x + ',' + y)) return true;
        const t = D.tiles[grid[y][x]];
        return !t || t.solid;
      };

      (z.rects || []).forEach((r, i) => {
        if (!has(D.tiles, r.t)) err('zone ' + zid + ' rect[' + i + ']: unknown tile "' + r.t + '"');
      });

      /* props */
      const occupied = {};
      (z.props || []).forEach((p, i) => {
        const w = 'zone ' + zid + ' prop[' + i + '] (' + p.t + ' @ ' + p.x + ',' + p.y + ')';
        if (!has(D.props, p.t)) { err(w + ': unknown prop type'); return; }
        if (p.x < 0 || p.y < 0 || p.x >= z.w || p.y >= z.h) { err(w + ': outside the map'); return; }
        const t = D.tiles[grid[p.y][p.x]];
        if (t && t.solid) warn(w + ': sits on an already-solid tile, invisible behind a wall');
        const k = p.x + ',' + p.y;
        /* Two props on one tile is normally a mistake, but a barrier and
           the plate that replaces it are SUPPOSED to share a tile: they
           are never present at the same time. */
        if (occupied[k] !== undefined && !(p.when && (z.props[occupied[k]] || {}).when)) {
          warn(w + ': stacked on top of prop[' + occupied[k] + ']');
        }
        occupied[k] = i;
        checkCond(p.when, w + '.when');
      });

      /* props must not bury an object or an exit */
      (z.objects || []).forEach(o => {
        if (props.has(o.x + ',' + o.y)) err('zone ' + zid + ' object "' + o.id + '": a solid prop is placed on top of it');
      });
      (z.exits || []).forEach((e, i) => {
        if (props.has(e.x + ',' + e.y)) err('zone ' + zid + ' exit[' + i + ']: a solid prop blocks the doorway');
      });

      if (!z.spawns || !Object.keys(z.spawns).length) err('zone ' + zid + ': no spawns defined');
      for (const sname in (z.spawns || {})) {
        const s = z.spawns[sname];
        if (solid(s.x, s.y)) err('zone ' + zid + ' spawn "' + sname + '" is inside a solid tile (' + s.x + ',' + s.y + ')');
      }

      /* reachability from the primary spawn */
      const primary = (z.spawns && (z.spawns.start || z.spawns[Object.keys(z.spawns)[0]]));
      const reach = primary ? flood(z, grid, props, primary) : new Set();
      reachByZone[zid] = reach;

      if (primary) {
        for (const sname in (z.spawns || {})) {
          const s = z.spawns[sname];
          if (!reach.has(s.x + ',' + s.y)) err('zone ' + zid + ' spawn "' + sname + '": cut off from the main walkable area');
        }
        (z.objects || []).forEach(o => {
          if (!usable(reach, o.x, o.y)) err('zone ' + zid + ' object "' + o.id + '": unreachable: you cannot stand next to it');
        });
        (z.exits || []).forEach((e, i) => {
          if (!usable(reach, e.x, e.y)) err('zone ' + zid + ' exit[' + i + '] to "' + e.to + '": unreachable');
        });
        (z.props || []).forEach((p, i) => {
          if (p.text && !usable(reach, p.x, p.y)) warn('zone ' + zid + ' prop[' + i + ']: has flavour text but cannot be reached');
        });

        /* ---- the second flood fill: the map BEFORE any repair ----
           `reach` above assumes every conditional barrier is gone, which is
           the right test for "can this ever be reached". It is the wrong
           test for "can the player get stuck", because on day one none of
           those barriers have been removed yet.

           The deadlock this catches: a hazard that is itself walled off by
           the barrier its own repair removes. Logging it is the only way to
           open the route, and the route is the only way to log it. That is
           unwinnable, invisible in the data, and would only ever show up in
           a classroom. */
        if (hasConditionalProps(z)) {
          const before = flood(z, grid, propsBefore, primary);

          (z.objects || []).forEach(o => {
            if (o.kind !== 'hazard') return;
            if (!usable(before, o.x, o.y)) {
              err('zone ' + zid + ' hazard "' + o.id + '": unreachable until a repair happens, ' +
                  'but logging hazards is what causes repairs. Deadlock: move it, or remove the ' +
                  'barrier standing between the player and it.');
            }
          });

          /* A doorway behind a barrier is fine IF the author says so, for
             the same reason as the objects above. What is never fine is a
             doorway that is barriered by accident, because the player can
             be standing on the far side of it. */
          (z.exits || []).forEach((e, i) => {
            const walled = !usable(before, e.x, e.y);
            if (walled && !e.gatedByRepair) {
              err('zone ' + zid + ' exit[' + i + '] to "' + e.to + '": unreachable before repairs, ' +
                  'and not marked as deliberate. Either clear the barrier or add ' +
                  'gatedByRepair:"<hazard id>".');
            }
            if (e.gatedByRepair && !hazardIds[e.gatedByRepair]) {
              err('zone ' + zid + ' exit[' + i + ']: gatedByRepair names unknown hazard "' + e.gatedByRepair + '"');
            }
            /* The return trip. Whatever spawn the far side sends the player
               back to must be walkable in BOTH states of the map, or they
               reappear inside a barrier. */
            const back = D.zones[e.to];
            (back && back.exits || []).forEach(r => {
              if (r.to !== zid) return;
              const sp = (z.spawns || {})[r.spawn];
              if (sp && !before.has(sp.x + ',' + sp.y)) {
                err('zone ' + zid + ' spawn "' + r.spawn + '": "' + e.to + '" sends the player back ' +
                    'to a tile that is blocked before repairs. Move the spawn clear of the barrier.');
              }
            });
          });

          /* Spawns are checked through the exits that actually USE them,
             just above, rather than blanket-checked here: a spawn nobody
             sends the player to cannot strand anybody. */

          /* Anything else that only opens up after a repair has to SAY so,
             with `gatedByRepair:'hz_id'`. That turns "is this deliberate?"
             from a question the reader has to answer into one the author
             already answered, and it means a content edit that accidentally
             walls something off still shows up as a warning. */
          (z.objects || []).forEach(o => {
            if (o.kind === 'hazard') return;
            const walled = !usable(before, o.x, o.y);
            if (walled && !o.gatedByRepair) {
              warn('zone ' + zid + ' object "' + o.id + '": only reachable after a repair. ' +
                   'If that is the design, say so with gatedByRepair:"<hazard id>".');
            }
            if (o.gatedByRepair) {
              if (!hazardIds[o.gatedByRepair]) err('zone ' + zid + ' object "' + o.id + '": gatedByRepair names unknown hazard "' + o.gatedByRepair + '"');
              else if (!walled) warn('zone ' + zid + ' object "' + o.id + '": claims gatedByRepair but is reachable without any repair');
            }
          });
        }
      }

      (z.exits || []).forEach((e, i) => {
        if (!has(D.zones, e.to)) { err('zone ' + zid + ' exit[' + i + ']: unknown target zone "' + e.to + '"'); return; }
        const target = D.zones[e.to];
        if (!target.spawns || !target.spawns[e.spawn]) err('zone ' + zid + ' exit[' + i + ']: target "' + e.to + '" has no spawn "' + e.spawn + '"');
        checkCond(e.condition, 'zone ' + zid + ' exit[' + i + ']');
      });

      checkEffects(z.onArrive, 'zone ' + zid + '.onArrive');

      (z.objects || []).forEach(o => {
        const w = 'zone ' + zid + ' object "' + o.id + '"';
        if (!['sign', 'station', 'search', 'animal', 'observe', 'talk', 'shop', 'transit', 'keypad', 'hazard', 'hearing', 'arcade'].includes(o.kind)) err(w + ': unknown kind "' + o.kind + '"');

        /* An arcade cabinet must name a game that exists, or the player
           walks up to a machine that can never do anything. */
        if (o.kind === 'arcade') {
          if (!o.game) err(w + ': arcade machine with no `game`');
          else if (!(SU.data.arcadeGames || {})[o.game]) err(w + ': arcade machine names unknown game "' + o.game + '"');
        }
        if (o.kind === 'animal' && !has(D.species, o.species)) err(w + ': unknown species "' + o.species + '"');
        if (o.kind === 'observe') {
          if (!has(D.species, o.species)) err(w + ': observation post on unknown species "' + o.species + '"');
          else if (!(D.species[o.species].facts || []).length) err(w + ': observation post on a species with no facts to report');
        }
        if (o.kind === 'talk') {
          if (!has(D.talks, o.pool)) err(w + ': talk point on unknown question pool "' + o.pool + '"');
        }
        if (o.kind === 'shop') (o.sells || []).forEach(s => { if (!has(D.items, s)) err(w + ': sells unknown item "' + s + '"'); });
        /* A keypad is a lock whose key is knowledge, so the two things
           that can silently break it are a code that is not enterable on
           a numeric pad, and a correct answer that does nothing. */
        if (o.kind === 'keypad') {
          const mode = o.mode || 'digits';
          if (['digits', 'letters'].indexOf(mode) === -1) err(w + ': keypad `mode` must be "digits" or "letters"');
          const pattern = mode === 'letters' ? /^[A-Za-z]+$/ : /^[0-9]+$/;
          if (!pattern.test(String(o.code || ''))) {
            err(w + ': keypad `code` must be a string of ' + (mode === 'letters' ? 'letters' : 'digits') +
                ' to be enterable on a ' + mode + ' pad');
          }
          if (!(o.effects || []).length) err(w + ': keypad opens nothing: no `effects`');
          if (!(o.clue || []).length) warn(w + ': keypad has no `clue`, so the code is unguessable in-game');
          if (!o.hint) warn(w + ': keypad has no `hint` for a player who gets stuck');
        }
        /* A hazard is a one-way record, so the things that break one are a
           missing description (nothing to log) and a severity the register
           cannot colour. */
        if (o.kind === 'hazard') {
          if (!o.text) err(w + ': hazard has no `text`: there is nothing to read or log');
          if (!o.name) err(w + ': hazard has no `name`: the register would list a bare id');
          if (o.severity && ['low', 'medium', 'high'].indexOf(o.severity) === -1) {
            err(w + ': hazard `severity` must be "low", "medium" or "high"');
          }
          if (!o.severity) warn(w + ': hazard has no `severity`: the register will treat it as low');
          if (o.evidence && !has(D.evidence, o.evidence)) err(w + ': hazard files unknown evidence "' + o.evidence + '"');
        }
        /* The hearing is the one scene in the game that can be made
           UNWINNABLE by a data typo rather than by design: a round whose
           `accept` list names evidence that does not exist, or that the
           player could never have obtained, is a point nobody can answer.
           None of that is visible from reading the file. */
        if (o.kind === 'hearing') {
          if (!(o.rounds || []).length) err(w + ': hearing has no `rounds`');
          const seen = {};
          (o.rounds || []).forEach((r, i) => {
            const rw = w + ' round[' + (r.id || i) + ']';
            if (!r.id) err(rw + ': missing id');
            else if (seen[r.id]) err(rw + ': duplicate round id');
            else seen[r.id] = true;

            if (!has(D.evidence, r.claim)) err(rw + ': claims unknown evidence "' + r.claim + '"');
            else if (D.evidence[r.claim].type !== 'pr') {
              warn(rw + ': the claim "' + r.claim + '" is not PR evidence. The whole scene is ' +
                   'about the park being quoted back at itself, so a claim should be a `pr` item.');
            }
            if (!(r.accept || []).length) err(rw + ': no `accept` list, so the point can never be answered');
            (r.accept || []).forEach(e => {
              if (!has(D.evidence, e)) err(rw + ': accepts unknown evidence "' + e + '"');
              else if (D.evidence[e].type === 'pr') {
                warn(rw + ': accepts "' + e + '", which is itself a PR claim. Those are filtered ' +
                     'out of the player\'s exhibit list, so it can never be picked.');
              }
            });
            if (!(r.barry || []).length)  err(rw + ': Barry says nothing');
            if (!(r.win || []).length)    err(rw + ': no `win` lines');
            if (!(r.lose || []).length)   err(rw + ': no `lose` lines');
            if (!(r.concede || []).length) warn(rw + ': no `concede` lines for a player who has nothing');
            if (!r.lesson) err(rw + ': no `lesson`: the teaching payload has to show either way');
          });
          if (!(o.intro || []).length) warn(w + ': hearing has no `intro`');
          if (!(o.outro || []).length) warn(w + ': hearing has no `outro`');
          if (!(o.effects || []).length) err(w + ': finishing the hearing does nothing: no `effects`');
        }
        (o.loot || []).forEach(l => { if (!has(D.items, l.item)) err(w + ': loot has unknown item "' + l.item + '"'); });
        checkEffects(o.effects, w);
        checkCond(o.requires, w);
        if (o.kind === 'search' && !o.once) {
          checkRepeatable(o.effects, w, 'A search prop without `once:true` restocks every day. ' +
            'Add `once:true`, or gate the effect with once/perDay.');
        }
        if (o.kind === 'sign' || o.kind === 'station') {
          checkRepeatable(o.effects, w, 'A sign or station can be read again every time the player ' +
            'walks past it. Gate the payout with once:\'key\' or perDay:\'key\'.');
        }
      });
    }

    /* ---- PARK RULE: every region has exactly one staff block, that
       block has a transit terminal, and the two are connected both ways ---- */
    for (const zid in D.zones) {
      const z = D.zones[zid];
      if (z.kind !== 'region') continue;

      const blocks = Object.keys(D.zones).filter(b => D.zones[b].staffFor === zid);
      if (blocks.length === 0) {
        err('PARK RULE: region "' + zid + '" (' + z.name + ') has no staff block. ' +
            'Every region needs one: add a zone with staffFor:"' + zid + '".');
        continue;
      }
      if (blocks.length > 1) {
        err('PARK RULE: region "' + zid + '" has ' + blocks.length + ' staff blocks (' + blocks.join(', ') + '); expected exactly one');
      }

      blocks.forEach(bid => {
        const b = D.zones[bid];
        const terminals = (b.objects || []).filter(o => o.kind === 'transit');
        if (!terminals.length) err('PARK RULE: staff block "' + bid + '" has no transit terminal (kind:"transit" object)');
        if (terminals.length > 1) warn('staff block "' + bid + '" has ' + terminals.length + ' transit terminals');

        if (!b.spawns || !b.spawns.entry) err('PARK RULE: staff block "' + bid + '" needs a spawn named "entry": fast travel arrives there');

        const intoBlock = (z.exits || []).some(e => e.to === bid);
        const outOfBlock = (b.exits || []).some(e => e.to === zid);
        if (!intoBlock)  err('PARK RULE: region "' + zid + '" has no door into its staff block "' + bid + '"');
        if (!outOfBlock) err('PARK RULE: staff block "' + bid + '" has no way back out to "' + zid + '"');
      });
    }
    /* Every zone needs an entry in the music table, even if that entry is
       an explicit null. A zone that is simply absent from it is silent by
       accident rather than by choice, and silence looks identical either
       way: this caught `turtle_unit` the moment the table was written. */
    for (const zid in D.zones) {
      if (!D.zoneMusic || !Object.prototype.hasOwnProperty.call(D.zoneMusic, zid)) {
        warn('zone "' + zid + '": no entry in SU.data.zoneMusic. Add its region\'s track, ' +
             'or an explicit null if it is meant to be silent.');
      }
    }

    for (const zid in D.zones) {
      const z = D.zones[zid];
      if (!z.kind) warn('zone "' + zid + '": no `kind` set: expected "region" or "interior"');
      if (z.staffFor && !has(D.zones, z.staffFor)) err('zone "' + zid + '": staffFor points at unknown zone "' + z.staffFor + '"');
      if (z.staffFor && z.kind !== 'interior') warn('zone "' + zid + '": has staffFor but kind is not "interior"');
    }

    /* ---- npcs ---- */
    for (const nid in D.npcs) {
      const n = D.npcs[nid], w = 'npc "' + nid + '"';
      if (!has(D.zones, n.zone)) { err(w + ': unknown zone "' + n.zone + '"'); continue; }

      const z = D.zones[n.zone];
      const grid = buildGrid(z);
      const props = solidSet(z);
      const reach = reachByZone[n.zone] || new Set();
      const solid = (x, y) => {
        if (y < 0 || y >= z.h || x < 0 || x >= z.w) return true;
        if (props.has(x + ',' + y)) return true;
        const t = D.tiles[grid[y][x]];
        return !t || t.solid;
      };

      if (solid(n.x, n.y)) err(w + ': starts inside a solid tile at (' + n.x + ',' + n.y + '), unreachable');
      else if (!reach.has(n.x + ',' + n.y)) err(w + ': starts in an area cut off from the player');

      /* movement */
      const m = n.movement;
      if (m) {
        if (!['static', 'wander', 'patrol'].includes(m.type)) err(w + ': unknown movement type "' + m.type + '"');
        if (m.type === 'patrol') {
          if (!m.points || m.points.length < 2) err(w + ': patrol needs at least 2 points');
          (m.points || []).forEach((p, i) => {
            if (solid(p.x, p.y)) err(w + ' patrol point[' + i + '] (' + p.x + ',' + p.y + ') is inside a solid tile');
            else if (!reach.has(p.x + ',' + p.y)) err(w + ' patrol point[' + i + '] is cut off from the player');
          });
        }
        if (m.type === 'wander') {
          const r = m.radius || 2;
          let free = 0, total = 0;
          for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++)
            for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
              if (Math.hypot(dx, dy) > r) continue;
              total++;
              if (!solid(n.x + dx, n.y + dy)) free++;
            }
          if (total && free / total < 0.3) warn(w + ': wander radius is ' + Math.round(100 - free / total * 100) + '% blocked, will barely move');
        }
      }

      checkCond(n.spawnCondition, w + '.spawnCondition');
      (n.dialogue || []).forEach((d, i) => {
        const dw = w + ' dialogue[' + i + ']';
        checkCond(d.when, dw);
        checkEffects(d.onEnd, dw + '.onEnd');
        if (!d.lines || !d.lines.length) err(dw + ': no lines');
        (d.choices || []).forEach((c, j) => {
          checkEffects(c.effects, dw + '.choices[' + j + ']');
          checkCond(c.condition, dw + '.choices[' + j + ']');
        });
        if (!selfGating(d, n)) {
          const how = 'The player can replay this conversation. Add once:\'key\' / ' +
                      'perDay:\'key\' to the effect, or have the entry set a flag its own `when` tests.';
          checkRepeatable(d.onEnd, dw + '.onEnd', how);
          (d.choices || []).forEach((c, j) => checkRepeatable(c.effects, dw + '.choices[' + j + ']', how));
        }
        if (i === (n.dialogue || []).length - 1 && d.when) warn(w + ': last dialogue entry has a `when`: there is no fallback if nothing matches');
      });
    }

    /* ---- duties ---- */
    const publicPhases = SU.config.phases.filter(p => p.kind === 'public').map(p => p.id);
    for (const did in D.duties) {
      const d = D.duties[did], w = 'duty "' + did + '"';
      if (!has(D.zones, d.zone)) { err(w + ': unknown zone "' + d.zone + '"'); continue; }

      const azId = d.atZone || d.zone;
      if (!has(D.zones, azId)) { err(w + ': unknown atZone "' + azId + '"'); continue; }
      const az = D.zones[azId];
      const target = (az.objects || []).find(o => o.id === d.at);
      if (!target) err(w + ': `at` points at object "' + d.at + '" which does not exist in zone "' + azId + '"');
      else if (target.requires && !d.condition) {
        // The player would be handed a job they cannot do, then penalised for skipping it.
        err(w + ': target object "' + d.at + '" has a `requires` gate but the duty has no matching ' +
            '`condition`: it could be assigned while impossible to perform');
      }

      (d.phases || []).forEach(p => {
        if (publicPhases.indexOf(p) === -1)
          err(w + ': assigned to phase "' + p + '" which is not a public shift');
      });
      if (!d.phases || !d.phases.length) warn(w + ': no `phases`: will never be assigned');
      if (!d.fact) warn(w + ': no `fact`: the teaching payload is missing');
      if (d.energy === undefined) warn(w + ': no energy cost set');
      checkEffects(d.rewards, w + '.rewards');
      checkCond(d.condition, w);
    }

    /* Can each public shift actually fill a roster in the starting region? */
    publicPhases.forEach(pid => {
      const avail = Object.keys(D.duties).filter(did => {
        const d = D.duties[did];
        return d.zone === 'coastal_cove' && (d.phases || []).indexOf(pid) !== -1 && !d.condition;
      });
      /* The FIRST rung of the ladder, because this check is about the
         starting region: a new player has one region unlocked, so the
         relevant roster size is dutiesByRegions[0], not the five-region
         one. Reading the old flat `dutiesPerShift` here would compare
         against undefined, which is never less than anything, and the
         warning would silently never fire again. */
      const startingRoster = SU.config.shift.dutiesByRegions[0];
      if (avail.length < startingRoster) {
        warn('shift "' + pid + '": only ' + avail.length + ' unconditional starting-zone duties available but ' +
             startingRoster + ' are assigned per shift: early rosters will be short');
      }
    });

    /* Every flag that anything, anywhere, actually sets to true. Used by
       the despawn check below: a spawnCondition can name a flag that no
       content ever sets (a hook somebody reserved and never wired), and
       an NPC gated on one of those never actually disappears. */
    const flagsEverSet = {};
    (function () {
      const note = list => [].concat(list || []).forEach(e => {
        if (e && e.type === 'setFlag' && e.value !== false) flagsEverSet[e.flag] = true;
      });
      for (const id in D.npcs) (D.npcs[id].dialogue || []).forEach(d => {
        note(d.onEnd);
        (d.choices || []).forEach(c => note(c.effects));
      });
      for (const z in D.zones) {
        note(D.zones[z].onArrive);
        (D.zones[z].objects || []).forEach(o => note(o.effects));
      }
      for (const qq in D.quests) note(D.quests[qq].rewards);
      for (const dd in D.duties) note(D.duties[dd].rewards);
    })();

    /* ---- quests ---- */
    for (const qid in D.quests) {
      const q = D.quests[qid], w = 'quest "' + qid + '"';
      if (!has(D.zones, q.zone)) err(w + ': unknown zone "' + q.zone + '"');
      if (q.giver && !has(D.npcs, q.giver)) err(w + ': unknown giver npc "' + q.giver + '"');
      if (!q.steps || !q.steps.length) err(w + ': no steps');
      /* Every step tells the player where to go. `at` is an id rather than
         a hand-written string precisely so that it cannot rot silently, so
         an id that resolves to nothing has to be an error. */
      (q.steps || []).forEach((s, i) => {
        const sw = w + ' step[' + i + ']';
        if (s.at && !SU.Quests.place(s.at)) err(sw + ': `at` id "' + s.at + '" is not an object or an NPC anywhere in the park');
        if (s.at && s.where) warn(sw + ': has both `at` and `where`; `where` wins and `at` is dead weight');
        if (!s.at && !s.where && !q.zone) warn(sw + ': no `at`, no `where` and no quest zone: the step shows no location');

        /* THE VANISHED WITNESS. A quest step can point at an NPC who is
           not in the world any more.

           This shipped once: Vaughn guards the Open Ocean service stair
           with spawnCondition {hatch_clear:false}, so he stops existing
           the moment his own quest is done, and doing that quest is a
           prerequisite for reaching Zone 5, where a step then asked the
           player to go and talk to him. Guaranteed unfinishable, and
           invisible both in the data and in any test that calls
           Dialogue.talkTo directly, because that bypasses spawning.

           A spawnCondition requiring a flag to be FALSE is a DESPAWN
           condition: the character is on screen until something happens
           and then never again. That shape is nearly always wrong for a
           quest target, and it is the only shape that produces this bug,
           so it is worth an error rather than a warning. */
        if (s.at && has(D.npcs, s.at)) {
          const target = D.npcs[s.at];
          const sc = target.spawnCondition;
          const despawnFlags = sc && sc.flags
            ? Object.keys(sc.flags).filter(f => sc.flags[f] === false && flagsEverSet[f]) : [];

          /* It is FINE for a character to disappear as a result of the very
             step that points at them: Vaughn leaves the stair because you
             finally moved him, and Barry walks off at the end of his own
             scene. Those are endings, not dead ends.

             So the character is safe if their own dialogue both sets the
             despawn flag and closes (or is gated on) THIS quest. The real
             bug is a step in some OTHER quest, written months later,
             pointing at somebody who left the world long ago. */
          const selfCloses = (target.dialogue || []).some(entry => {
            const eff = [].concat(entry.onEnd || []);
            (entry.choices || []).forEach(c => eff.push.apply(eff, [].concat(c.effects || [])));
            const setsDespawn = eff.some(e => e.type === 'setFlag' &&
                                              despawnFlags.indexOf(e.flag) !== -1 && e.value !== false);
            const closesThis  = eff.some(e => (e.type === 'completeQuest' || e.type === 'startQuest') && e.id === qid);
            const gatedOnThis = !!(entry.when && entry.when.quest && entry.when.quest[qid]);
            return setsDespawn && (closesThis || gatedOnThis);
          });

          if (despawnFlags.length && !selfCloses) {
            err(sw + ': points at npc "' + s.at + '", who DESPAWNS for good once ' +
                despawnFlags.join(' / ') + ' is set, and nothing in this quest is what sets it. ' +
                'A player who has already done that can never reach this step. Give the ' +
                'character a second placement (see vaughn_gate in data/npcs_ocean.js) and ' +
                'point the step at that instead.');
          }
        }
      });
      (q.steps || []).forEach((s, i) => checkCond(s.done, w + ' step[' + i + ']'));
      checkEffects(q.rewards, w + '.rewards');

      /* Timed quests. The bonus is the only reason the clock exists, so a
         timer with nothing to pay out is an authoring mistake, and one the
         player can never see. */
      if (q.timed) {
        const t = q.timed;
        if (!(t.playSeconds > 0)) err(w + '.timed: playSeconds must be a positive number');
        if (!t.label) err(w + '.timed: needs a label saying what the deadline is');
        if (!t.onTime || !t.onTime.length) err(w + '.timed: no onTime effects, so beating the clock does nothing');
        else checkEffects(t.onTime, w + '.timed.onTime');
        if (t.playSeconds < 45) warn(w + '.timed: under 45s of play time is very tight for a walk-across-the-zone task');
      }

      const offered = Object.keys(D.npcs).some(nid =>
        JSON.stringify(D.npcs[nid].dialogue || []).indexOf('"' + qid + '"') !== -1);
      if (!offered) warn(w + ': no NPC dialogue ever references it: unreachable content');
    }

    /* ---- hand-in steps (the "quest sits one step from the end" class) ----
       A final step with `done: null` is closed by dialogue, so SOMETHING
       has to call completeQuest for it. Four quests shipped without one,
       and the symptom is invisible from the data: the player collects
       everything, walks back to the giver, and the giver has nothing to
       say because the entry that would close the quest was gated on the
       quest already being completed. Circular, and permanently stuck.

       Checked here rather than by eye because the completer can live in
       any NPC's dialogue, in a choice's effects, or on an object. */
    const closes = {};
    function noteClosers(list) {
      [].concat(list || []).forEach(e => {
        if (e && e.type === 'completeQuest') closes[e.id] = true;
      });
    }
    for (const nid in D.npcs) (D.npcs[nid].dialogue || []).forEach(d => {
      noteClosers(d.onEnd);
      (d.choices || []).forEach(c => noteClosers(c.effects));
    });
    for (const zid in D.zones) (D.zones[zid].objects || []).forEach(o => noteClosers(o.effects));
    for (const qid in D.quests) noteClosers(D.quests[qid].rewards);
    for (const did in D.duties) noteClosers(D.duties[did].rewards);

    for (const qid in D.quests) {
      const steps = D.quests[qid].steps || [];
      const last = steps[steps.length - 1];
      if (last && !last.done && !closes[qid]) {
        err('quest "' + qid + '": last step ("' + last.text + '") has no `done` condition, so only ' +
            'dialogue can close it, but nothing anywhere calls completeQuest for it. ' +
            'The quest can never finish. Add a hand-in dialogue entry gated on the quest being ' +
            'ACTIVE (not completed) whose onEnd completes it.');
      }
    }

    /* ---- achievements nothing can ever award ----
       dex_ten, parka_life and ice_diplomat all shipped defined and
       ungrantable. An achievement is reachable if an effect awards it
       somewhere, if a rule in SU.data.achievementRules covers it, or if
       the engine grants it in code (the list below). */
    const AWARDED_IN_CODE = ['first_day', 'first_care', 'perfect_care', 'first_quest', 'five_quests',
      'first_evidence', 'dex_three', 'dex_seven', 'dex_ten', 'dex_fifteen', 'dex_twenty', 'beachcomber',
      'clean_record', 'nosy', 'trusted', 'on_the_clock', 'reliable_hand', 'double_life',
      'bin_diver', 'field_notes', 'good_talk', 'reef_certified'];

    const grantable = {};
    AWARDED_IN_CODE.forEach(a => grantable[a] = true);
    (D.achievementRules || []).forEach(r => {
      grantable[r.id] = true;
      if (!has(D.achievements, r.id)) err('achievementRule "' + r.id + '": unknown achievement');
      if (!r.when) err('achievementRule "' + r.id + '": no `when`, so it can never fire');
      else checkCond(r.when, 'achievementRule "' + r.id + '"');
    });
    function noteAwards(list) {
      [].concat(list || []).forEach(e => { if (e && e.type === 'achievement') grantable[e.id] = true; });
    }
    for (const zid in D.zones) {
      noteAwards(D.zones[zid].onArrive);
      (D.zones[zid].objects || []).forEach(o => noteAwards(o.effects));
    }
    for (const nid in D.npcs) (D.npcs[nid].dialogue || []).forEach(d => {
      noteAwards(d.onEnd);
      (d.choices || []).forEach(c => noteAwards(c.effects));
    });
    for (const qid in D.quests) {
      noteAwards(D.quests[qid].rewards);
      if (D.quests[qid].timed) noteAwards(D.quests[qid].timed.onTime);
    }
    for (const did in D.duties) noteAwards(D.duties[did].rewards);

    Object.keys(D.achievements).forEach(a => {
      if (!grantable[a]) warn('achievement "' + a + '" (' + D.achievements[a].name +
        ') is defined but nothing ever awards it. Add an effect where it happens, or a row in ' +
        'SU.data.achievementRules if it is a state rather than an event.');
    });

    /* ---- species ---- */
    for (const sid in D.species) {
      const s = D.species[sid], w = 'species "' + sid + '"';
      if (!has(D.zones, s.zone)) err(w + ': unknown zone "' + s.zone + '"');
      if (!s.facts || s.facts.length < 2) warn(w + ': fewer than 2 facts');
      (s.encounters || []).forEach(e => {
        const ew = w + ' encounter "' + e.id + '"';
        const correct = (e.options || []).filter(o => o.correct);
        if (correct.length !== 1) err(ew + ': needs exactly one correct option (found ' + correct.length + ')');
        if (correct.length && correct[0].id !== e.need) err(ew + ': `need` ("' + e.need + '") does not match the correct option id ("' + correct[0].id + '")');
        if (!(e.cues || []).some(c => c.points)) warn(ew + ': no cue is marked points:true: the puzzle has no clue');
        if (e.evidence && !has(D.evidence, e.evidence)) err(ew + ': unknown evidence "' + e.evidence + '"');
        if (!e.lesson) warn(ew + ': no lesson text: the teaching payload is missing');
      });
    }

    /* ---- keeper talks ---- */
    for (const tid in D.talks) {
      const t = D.talks[tid], w = 'talk pool "' + tid + '"';
      if (!t.questions || !t.questions.length) { err(w + ': no questions'); continue; }
      t.questions.forEach((q, i) => {
        const qw = w + ' question[' + i + ']';
        if (!q.q) err(qw + ': no question text');
        if (!q.fact) err(qw + ': no `fact`: the teaching payload is missing');
        const opts = q.options || [];
        if (opts.length < 2) err(qw + ': needs at least two options');
        const right = opts.filter(o => o.correct);
        if (right.length !== 1) err(qw + ': needs exactly one correct option (found ' + right.length + ')');
        opts.forEach((o, j) => {
          if (!o.text) err(qw + ' option[' + j + ']: no text');
          if (!o.reply) err(qw + ' option[' + j + ']: no reply');
        });
      });
    }
    Object.keys(D.talks).forEach(tid => {
      const used = Object.keys(D.zones).some(zid =>
        (D.zones[zid].objects || []).some(o => o.kind === 'talk' && o.pool === tid));
      if (!used) warn('talk pool "' + tid + '": no talk point in any zone uses it: unreachable content');
    });

    /* ---- evidence + qualifications ---- */
    for (const eid in D.evidence) {
      const e = D.evidence[eid];
      (e.contradictedBy || []).forEach(x => { if (!has(D.evidence, x)) err('evidence "' + eid + '": contradictedBy unknown "' + x + '"'); });
      if (!['welfare', 'financial', 'testimonial', 'pr'].includes(e.type)) err('evidence "' + eid + '": bad type "' + e.type + '"');
    }
    for (const qid in D.qualifications) checkCond(D.qualifications[qid].req, 'qualification "' + qid + '"');

    return { errors: errs, warnings: warns };
  }

  function report() {
    const res = run();
    if (res.errors.length) {
      console.group('%c[Sea Universe] CONTENT ERRORS (' + res.errors.length + ')', 'color:#e05c5c;font-weight:bold');
      res.errors.forEach(e => console.error(e));
      console.groupEnd();
    }
    if (res.warnings.length) {
      console.group('%c[Sea Universe] content warnings (' + res.warnings.length + ')', 'color:#e0a34a');
      res.warnings.forEach(w => console.warn(w));
      console.groupEnd();
    }
    if (!res.errors.length && !res.warnings.length) {
      console.log('%c[Sea Universe] content OK: all references valid, everything reachable.', 'color:#6fd18a');
    }
    return res;
  }

  return { run, report };
})();
