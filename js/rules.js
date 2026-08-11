/* ============================================================
   SEA UNIVERSE: CONDITIONS + EFFECTS
   The single mini-language used by NPC dialogue, quest steps,
   doors, objects, qualifications and rewards.

   Adding new content = writing data in these two vocabularies.
   Adding a new *kind* of condition or effect is the only time this
   file needs touching.

   ---- CONDITION KEYS (all must pass; omit what you don't need) ----
     flags:        { met_wren: true }
     hasItems:     { sea_glass: 3 }
     quest:        { q_id: 'not_started'|'active'|'completed' }
     storyStage:   2   |  { min: 1, max: 3 }
     level:        { min: 4 }
     skill:        { husbandry: 2 }            // minimum values
     suspicion:    { min: 50 }  |  { max: 24 }
     day:          { min: 3 }
     money:        { min: 20 }
     qualification:'pinniped_basic' | ['a','b']
     evidence:     'ev_id' | ['ev_a','ev_b']
     species:      { sea_otter: { discovered: true, trustMin: 20 } }
     phase:        'gap' | 'public' | 'morning_shift'
     zoneVisited:  'service_corridor' | ['a','b']   // reached it at least once
     hazardLogged:   'hz_id' | ['a','b']       // written into the Safety Register
     hazardRepaired: 'hz_id' | ['a','b']       // reported AND actually fixed
     hazardCount:    { min: 8 }  |  { min: 3, repaired: true }
     hearingDone:    true                      // the endgame hearing has been held
     hearingPerfect: true                      // ...and every point answered first time
     any:          [ cond, cond ]              // OR
     not:          cond

   ---- EFFECT GATES (anti-farming; put on the effect itself) ----
     { type:'addXP', amount:60, once:'wren_manifest' }    // ever, per save
     { type:'money', amount:5,  perDay:'tip_jar' }        // once per game day

   Any effect the player can trigger more than once (repeatable dialogue,
   re-runnable care sessions, restocking props) must gate its payout, or it
   is a farm. Effects sharing a key inside one list fire or skip together.
   The validator warns about ungated repeatable payouts.
   ============================================================ */
window.SU = window.SU || {};

SU.Rules = (function () {

  function asArray(v) { return Array.isArray(v) ? v : [v]; }

  function check(cond) {
    if (!cond) return true;                    // no condition = always
    const S = SU.State, d = S.data;

    if (cond.any) {
      if (!cond.any.some(c => check(c))) return false;
    }
    if (cond.not) {
      if (check(cond.not)) return false;
    }
    if (cond.flags) {
      for (const k in cond.flags) if (S.flag(k) !== cond.flags[k]) return false;
    }
    if (cond.hasItems) {
      for (const k in cond.hasItems) if (S.count(k) < cond.hasItems[k]) return false;
    }
    if (cond.quest) {
      for (const q in cond.quest) {
        const want = cond.quest[q];
        const rec = d.quests[q];
        const status = rec ? rec.status : 'not_started';
        if (status !== want) return false;
      }
    }
    if (cond.storyStage !== undefined) {
      const c = cond.storyStage;
      if (typeof c === 'number') { if (d.storyStage !== c) return false; }
      else {
        if (c.min !== undefined && d.storyStage < c.min) return false;
        if (c.max !== undefined && d.storyStage > c.max) return false;
      }
    }
    if (cond.level) {
      if (cond.level.min !== undefined && d.level < cond.level.min) return false;
      if (cond.level.max !== undefined && d.level > cond.level.max) return false;
    }
    if (cond.skill) {
      for (const k in cond.skill) if ((d.skills[k] || 0) < cond.skill[k]) return false;
    }
    if (cond.suspicion) {
      if (cond.suspicion.min !== undefined && d.suspicion < cond.suspicion.min) return false;
      if (cond.suspicion.max !== undefined && d.suspicion > cond.suspicion.max) return false;
    }
    if (cond.day) {
      if (cond.day.min !== undefined && d.day < cond.day.min) return false;
      if (cond.day.max !== undefined && d.day > cond.day.max) return false;
    }
    if (cond.money) {
      if (cond.money.min !== undefined && d.money < cond.money.min) return false;
    }
    if (cond.qualification) {
      if (!asArray(cond.qualification).every(q => S.hasQual(q))) return false;
    }
    if (cond.evidence) {
      if (!asArray(cond.evidence).every(e => S.hasEvidence(e))) return false;
    }
    if (cond.species) {
      for (const k in cond.species) {
        const want = cond.species[k], got = S.sp(k);
        if (want.discovered !== undefined && got.discovered !== want.discovered) return false;
        if (want.trustMin !== undefined && got.trust < want.trustMin) return false;
        if (want.solved && !got.solved[want.solved]) return false;
      }
    }
    if (cond.phase) {
      const p = S.phase();
      if (cond.phase !== p.id && cond.phase !== p.kind) return false;
    }
    if (cond.zoneVisited) {
      if (!asArray(cond.zoneVisited).every(z => !!d.zonesVisited[z])) return false;
    }
    if (cond.hazardLogged) {
      if (!asArray(cond.hazardLogged).every(h => S.hazardLogged(h))) return false;
    }
    if (cond.hazardRepaired) {
      if (!asArray(cond.hazardRepaired).every(h => S.hazardRepaired(h))) return false;
    }
    if (cond.hazardCount) {
      const c = cond.hazardCount;
      const n = c.repaired ? S.hazardRepairedCount() : S.hazardCount();
      if (c.min !== undefined && n < c.min) return false;
      if (c.max !== undefined && n > c.max) return false;
    }
    if (cond.hearingDone !== undefined) {
      if (S.hearingDone() !== cond.hearingDone) return false;
    }
    /* Every point answered first time. Needs the round count from the
       content, so it asks the hearing object rather than a magic number. */
    if (cond.hearingPerfect) {
      const total = S.hearingRoundCount();
      if (!total || S.hearingWon() < total) return false;
    }
    return true;
  }

  /* ---------- EFFECTS ---------- */
  const handlers = {
    giveItem:    (e) => SU.State.addItem(e.id, e.qty || 1),
    takeItem:    (e) => SU.State.removeItem(e.id, e.qty || 1),
    addXP:       (e) => SU.State.addXP(e.amount),
    addSkill:    (e) => SU.State.addSkill(e.skill, e.amount),
    addSkillPoints: (e) => { SU.State.data.skillPoints += e.amount; SU.bus.emit('state:changed'); },
    setFlag:     (e) => SU.State.setFlag(e.flag, e.value === undefined ? true : e.value),
    addSuspicion:(e) => SU.State.addSuspicion(e.amount),
    addEvidence: (e) => SU.State.addEvidence(e.id),
    grantQualification: (e) => {
      if (!SU.State.hasQual(e.id)) {
        SU.State.data.qualifications.push(e.id);
        SU.UI && SU.UI.toast('Qualification earned: ' + SU.data.qualifications[e.id].name);
      }
    },
    startQuest:    (e) => SU.Quests.start(e.id),
    completeQuest: (e) => SU.Quests.complete(e.id),
    setStoryStage: (e) => {
      if (e.stage > SU.State.data.storyStage) {
        SU.State.data.storyStage = e.stage;
        SU.bus.emit('story:stage', e.stage);
      }
    },
    achievement:     (e) => SU.State.award(e.id),
    discoverSpecies: (e) => SU.State.discover(e.id),
    addTrust:        (e) => SU.State.addTrust(e.species, e.amount),
    money:           (e) => { SU.State.data.money = Math.max(0, SU.State.data.money + e.amount); SU.bus.emit('state:changed'); },

    /* Energy, capped at the usual 100. Negative amounts work, so this can
       cost as well as pay, and it is the only way content can hand energy
       back without going through an item the player has to remember to
       use. Added for Kayla's rewards. */
    energy: (e) => {
      SU.State.data.energy = Math.max(0, Math.min(100, SU.State.data.energy + e.amount));
      SU.bus.emit('state:changed');
    },

    toast:           (e) => SU.UI && SU.UI.toast(e.text),
    unlockZone:      (e) => SU.State.setFlag('zone_' + e.id + '_unlocked', true),

    /* The end of game report. Content decides when it opens, so an
       epilogue can run its last line first. */
    openReport: () => SU.Report && SU.Report.open(),

    /* Hazards. `logHazard` is normally fired by the hazard object itself,
       but exists as an effect so a keeper can point one out in dialogue.
       `repairHazard` is the one that changes the map: any prop carrying
       `when:{ hazardRepaired:'id' }` stops existing the moment it fires. */
    logHazard:    (e) => SU.State.logHazard(e.id),
    repairHazard: (e) => SU.State.repairHazard(e.id)
  };

  function apply(effects) {
    if (!effects) return;
    const claims = {};        // one decision per key per list, so a gated
                              // payout and its toast stay in step
    asArray(effects).forEach(e => {
      if (e.once) {
        if (!(e.once in claims)) claims[e.once] = SU.State.claimOnce(e.once);
        if (!claims[e.once]) return;
      }
      if (e.perDay) {
        if (!(e.perDay in claims)) claims[e.perDay] = SU.State.claimDaily(e.perDay);
        if (!claims[e.perDay]) return;
      }
      const h = handlers[e.type];
      if (!h) { console.warn('[SU] unknown effect type:', e.type, e); return; }
      h(e);
    });
    SU.State.save();
    SU.bus.emit('state:changed');
  }

  return { check, apply, effectTypes: Object.keys(handlers) };
})();
