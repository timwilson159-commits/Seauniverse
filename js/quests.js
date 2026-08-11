/* ============================================================
   SEA UNIVERSE: QUEST SYSTEM
   Steps advance automatically whenever their `done` condition
   becomes true, so quests never need bespoke code.
   A step with `done: null` is closed by dialogue (completeQuest).
   ============================================================ */
window.SU = window.SU || {};

SU.Quests = (function () {
  let evaluating = false;   // guard: effects emit state:changed, which re-enters here

  function def(id) { return SU.data.quests[id]; }
  function rec(id) { return SU.State.data.quests[id]; }

  function status(id) { const r = rec(id); return r ? r.status : 'not_started'; }

  /* ---------- timed quests ----------
     A quest may carry:

       timed: { playSeconds: 240, label: 'Before the 2pm crowd',
                onTime: [ ...effects... ] }

     Beat the clock and `onTime` fires on top of the normal rewards;
     that is where the suspicion refunds live. Miss it and you simply
     do not get the bonus. There is NO fail state and the quest never
     closes itself, which matches the rest of the game: pressure is
     always soft, and no student loses progress to a timer.

     The clock is accumulated PLAY time, not wall clock, so closing the
     tab or leaving the game open overnight cannot burn a timer down. */
  function playSeconds() {
    const m = SU.State.data.meta;
    return (m && m.playMs ? m.playMs : 0) / 1000;
  }

  /* Seconds left, or null when the quest is not timed / not running.
     Returns 0 (not negative) once the window has closed. */
  function timeLeft(id) {
    const d = def(id), r = rec(id);
    if (!d || !d.timed || !r || r.status !== 'active') return null;
    if (r.startedAt === undefined) return null;      // pre-timer save, no clock to run
    return Math.max(0, d.timed.playSeconds - (playSeconds() - r.startedAt));
  }

  function beatTheClock(id) {
    const t = timeLeft(id);
    return t !== null && t > 0;
  }

  /* mm:ss for the HUD and the task list. */
  function clockText(secs) {
    const s = Math.max(0, Math.round(secs));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  /* Every active timed quest, most urgent first. */
  function timers() {
    const out = [];
    for (const id in SU.State.data.quests) {
      const left = timeLeft(id);
      if (left !== null) out.push({ id: id, def: def(id), left: left });
    }
    return out.sort((a, b) => a.left - b.left);
  }

  /* ---------- where a step happens ----------
     The park is four regions and sixteen maps, and a student who plays
     one lesson a week cannot be expected to remember that Rune stands
     at the beluga pool. Every step therefore carries a place, shown in
     brackets in the Tasks tab.

     A step says where it is with ONE optional field:

       at:    an OBJECT id ('beluga_deck')  -> "Arctic Cove: Beluga Pool"
              or an NPC id  ('rune')        -> "Arctic Cove: Beluga Pool"
                                               (an NPC resolves through its
                                                own `at` if it has one, else
                                                to its zone alone)
       where: free text, for anything that is not a single fixed spot
              ('Any kiosk in the park')

     With neither, it falls back to the quest's own zone. Ids are used
     rather than hand-written strings so that moving an object or a
     character cannot leave a stale direction behind, and the validator
     errors on an `at` that resolves to nothing. */
  function zoneName(id) {
    const z = SU.data.zones[id];
    return z ? z.name : id;
  }

  function findObject(objId) {
    for (const zid in SU.data.zones) {
      const o = (SU.data.zones[zid].objects || []).find(x => x.id === objId);
      if (o) return { zone: zid, obj: o };
    }
    return null;
  }

  /* Resolves an `at` id, whether it names an object or a person, and
     returns THE ZONE ONLY.

     It used to append the landmark as well ("Arctic Cove · Walrus
     Haul-Out"), which told the player exactly where to stand and left
     nothing to find. Cut back to the zone on 2026-08-06 at the user's
     request: the zone is the part you cannot reasonably guess, and
     finding the right spot within it is the game. The building name
     plaques added the same day mean a player who wants certainty can
     read it off the wall in-world instead.

     Still resolved from ids rather than hand-written strings, so moving
     an object or a character cannot leave a stale direction behind, and
     it still returns null for an unresolvable id: `js/validate.js:625`
     relies on that to catch a typo in a quest step's `at`. */
  function place(atId) {
    if (!atId) return null;
    const hit = findObject(atId);
    if (hit) return zoneName(hit.zone);

    const npc = SU.data.npcs[atId];
    if (npc) return zoneName(npc.zone);
    return null;
  }

  function stepPlace(qdef, step) {
    if (step.where) return step.where;
    return place(step.at) || (qdef && qdef.zone ? zoneName(qdef.zone) : null);
  }

  function start(id) {
    if (!def(id)) { console.warn('[SU] startQuest: unknown quest', id); return; }
    if (rec(id)) return;
    SU.State.data.quests[id] = { status: 'active', step: 0, startedAt: playSeconds() };
    SU.UI.toast('New task: ' + def(id).title, 'good');
    if (def(id).timed) {
      SU.UI.toast('⏱ ' + clockText(def(id).timed.playSeconds) + ': ' + def(id).timed.label, 'good');
    }
    SU.bus.emit('quest:started', id);
    SU.State.save();
    evaluate();
  }

  function complete(id) {
    const d = def(id), r = rec(id);
    if (!d) { console.warn('[SU] completeQuest: unknown quest', id); return; }
    if (!r) SU.State.data.quests[id] = { status: 'active', step: 0 };
    if (SU.State.data.quests[id].status === 'completed') return;

    /* Read the clock FIRST. timeLeft() only reports on an ACTIVE quest,
       so this has to happen before the status flips to completed. */
    const onTime = d.timed ? beatTheClock(id) : false;

    SU.State.data.quests[id].status = 'completed';
    SU.State.data.quests[id].step = d.steps.length;
    SU.State.data.counters.questsDone++;

    SU.UI.toast('Task complete: ' + d.title, 'good');
    SU.bus.emit('quest:completed', id);

    SU.Rules.apply(d.rewards);

    if (d.timed) {
      if (onTime) {
        SU.UI.toast('⏱ In time: ' + d.timed.label, 'good');
        SU.Rules.apply(d.timed.onTime);
      } else {
        // No penalty by design; say so plainly so the miss is legible.
        SU.UI.toast('⏱ Too late for the bonus. The task still counts.');
      }
    }

    const n = SU.State.data.counters.questsDone;
    if (n === 1) SU.State.award('first_quest');
    if (n >= 5) SU.State.award('five_quests');
    SU.State.save();
  }

  /* Called on every state change: advances any step whose condition is met. */
  function evaluate() {
    if (evaluating) return;
    evaluating = true;
    try {
      const qs = SU.State.data.quests;
      for (const id in qs) {
        const r = qs[id], d = def(id);
        if (!d || r.status !== 'active') continue;

        let guard = 0;
        while (r.step < d.steps.length && guard++ < 20) {
          const st = d.steps[r.step];
          if (!st.done) break;                    // waiting on dialogue
          if (!SU.Rules.check(st.done)) break;    // not satisfied yet
          r.step++;
          SU.bus.emit('quest:step', { id: id, step: r.step });
          if (r.step < d.steps.length) SU.UI.toast('✓ ' + st.text);
        }
        if (r.step >= d.steps.length) {
          evaluating = false;                     // allow complete() to re-evaluate
          complete(id);
          evaluating = true;
        }
      }
    } finally {
      evaluating = false;
    }
  }

  /* Quests grouped for the Journal panel. */
  function list() {
    const active = [], done = [];
    for (const id in SU.State.data.quests) {
      const d = def(id); if (!d) continue;
      const r = SU.State.data.quests[id];
      (r.status === 'completed' ? done : active).push({ id, def: d, rec: r });
    }
    return { active, done };
  }

  SU.bus.on('state:changed', evaluate);

  return { start, complete, status, evaluate, list, def,
           timeLeft, timers, clockText, beatTheClock,
           stepPlace, place, zoneName };
})();
