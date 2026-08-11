/* ============================================================
   SEA UNIVERSE: SHIFT SYSTEM

   Turns the day cycle from decoration into the game's central
   tension: public shifts are your cover job, gap windows are the
   only time you can investigate.

   Flow per phase change:
     settle()  scores the shift you are leaving (skipped duties
                 raise suspicion)
     assign()  rolls a fresh roster from the duty pool, if the new
                 phase is a public shift

   Nothing here is hardcoded per zone: the pool is data, filtered
   by which regions the player has actually reached.
   ============================================================ */
window.SU = window.SU || {};

SU.Duties = (function () {
  const C = SU.config;

  function shift() {
    const d = SU.State.data;
    if (!d.shift) d.shift = { assigned: [], done: [], phaseId: null };
    return d.shift;
  }

  function def(id) { return SU.data.duties[id]; }

  /* Which duties could be handed out for this shift right now. */
  function eligible(phaseId) {
    return Object.keys(SU.data.duties).filter(id => {
      const d = def(id);
      if (!SU.State.data.zonesVisited[d.zone]) return false;       // region not reached yet
      if (d.phases && d.phases.indexOf(phaseId) === -1) return false;
      if (d.condition && !SU.Rules.check(d.condition)) return false;
      return true;
    });
  }

  /* How many REGIONS the player has unlocked.

     COUNTS REGIONS, NOT `zonesVisited` KEYS, and that distinction is the
     whole trap here: `zonesVisited` also holds interiors, and there are 24
     zones in total, so counting its keys would push the roster to five
     duties while the player was still learning Coastal Cove. Only the five
     region maps carry a `num` (added for the fast-travel numbering), so
     that field is the test. No new data was needed for this. */
  function regionsUnlocked() {
    const visited = SU.State.data.zonesVisited || {};
    return Object.keys(visited).filter(id => {
      const z = SU.data.zones[id];
      return visited[id] && z && z.num;
    }).length;
  }

  /* The ladder from data/config.js, clamped at both ends so a save with no
     regions recorded still gets a playable roster and a sixth region (if
     one is ever added) keeps the last value rather than reading undefined
     and slicing a roster of zero. */
  function dutiesPerShift() {
    const ladder = C.shift.dutiesByRegions;
    const i = Math.max(0, Math.min(ladder.length - 1, regionsUnlocked() - 1));
    return ladder[i];
  }

  /* Roll a roster for the current phase. */
  function assign() {
    const s = shift();
    const ph = SU.State.phase();

    if (ph.kind !== 'public') {
      s.assigned = [];
      s.done = [];
      s.phaseId = ph.id;
      return;
    }

    /* Fair shuffle, not the sort-comparator trick: this picks which duties
       you are given, so a bias would quietly make some chores rarer. */
    const pool = SU.shuffle(eligible(ph.id));
    s.assigned = pool.slice(0, dutiesPerShift());
    s.done = [];
    s.phaseId = ph.id;

    if (s.assigned.length) {
      SU.UI.toast(s.assigned.length + ' duties assigned for the ' + ph.label.toLowerCase() + '.');
    }
    SU.bus.emit('state:changed');
  }

  /* Score the shift being left behind. */
  function settle() {
    const s = shift();
    if (!s.assigned.length) return;

    const skipped = s.assigned.filter(id => s.done.indexOf(id) === -1);

    if (!skipped.length) {
      SU.State.addSuspicion(-C.shift.suspicionAllDone);
      SU.Rules.apply([
        { type: 'addXP', amount: C.shift.bonusXP },
        { type: 'money', amount: C.shift.bonusPay }
      ]);
      SU.UI.toast('Full shift completed. Nobody has any questions for you.', 'good');
      SU.State.data.counters.shiftsClean = (SU.State.data.counters.shiftsClean || 0) + 1;
      if (SU.State.data.counters.shiftsClean >= 5) SU.State.award('reliable_hand');
    } else {
      let susp = 0;
      skipped.forEach(id => { susp += (def(id).skip || 4); });
      SU.State.addSuspicion(susp);
      SU.UI.toast(skipped.length + ' duty' + (skipped.length > 1 ? ' items' : '') +
                  ' left undone. Someone noticed.', 'bad');
      SU.State.data.counters.dutiesSkipped = (SU.State.data.counters.dutiesSkipped || 0) + skipped.length;
    }

    s.assigned = [];
    s.done = [];
  }

  /* Is there an outstanding duty at this object right now? */
  function atObject(objectId) {
    const s = shift();
    const id = s.assigned.find(d =>
      def(d) && def(d).at === objectId && s.done.indexOf(d) === -1);
    return id ? Object.assign({ id: id }, def(id)) : null;
  }

  /* Perform one. Returns false if it could not be done. */
  function perform(id) {
    const s = shift();
    const d = def(id);
    if (!d || s.done.indexOf(id) !== -1) return false;

    if (SU.State.data.energy < d.energy) {
      SU.Dialogue.open({
        lines: ['You are running on empty. Get something to eat, or let the shift end.']
      }, d.title);
      return false;
    }

    SU.Audio && SU.Audio.play('duty_done');
    SU.State.spendEnergy(d.energy);
    s.done.push(id);
    SU.State.data.counters.dutiesDone = (SU.State.data.counters.dutiesDone || 0) + 1;
    if (SU.State.data.counters.dutiesDone === 1) SU.State.award('on_the_clock');

    SU.Rules.apply(d.rewards);

    const remaining = s.assigned.filter(x => s.done.indexOf(x) === -1).length;
    SU.Dialogue.open({
      lines: [
        d.flavour,
        '✓ ' + d.title + ': done.  (' + d.fact + ')',
        remaining ? remaining + ' duty item(s) still outstanding this shift.'
                  : 'That is the whole roster done. The rest of the shift is yours.'
      ]
    }, d.title);

    SU.State.save();
    return true;
  }

  /* For the Journal. */
  function roster() {
    const s = shift();
    return s.assigned.map(id => ({
      id: id,
      def: def(id),
      done: s.done.indexOf(id) !== -1
    }));
  }

  function outstanding() {
    const s = shift();
    return s.assigned.filter(id => s.done.indexOf(id) === -1).length;
  }

  return { assign, settle, atObject, perform, roster, outstanding, eligible,
           regionsUnlocked, dutiesPerShift };
})();
