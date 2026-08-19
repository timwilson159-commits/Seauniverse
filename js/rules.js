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

  /* ---------- explaining a FAILED condition, in plain English ----------
     Built for locked doors: `checkExits()` in js/world.js already shows
     the in-world `lockedText` (why the door LOOKS shut), and students
     were getting stuck not knowing what actually opens it. This is the
     second page: what to do about it, same two-message shape as the
     watched-gate suspicion block (one page atmosphere, one page action).

     Only covers the condition keys actually used to gate a door today:
     flags, hasItems, qualification, quest, phase, any. An unhandled key
     is silently skipped rather than guessed at - extend FLAG_HINTS or
     this function if a new kind of gate is ever added.

     FLAGS carry no human text anywhere else in the game (unlike items,
     quests and qualifications, which all have a `name`/`title` already),
     so this table exists purely to translate the ones that currently
     gate a door. Traced by hand from the effect that sets each one:
       meeting_set          -> npcs_deep.js, Wren, after `deep_done`
       zone_coral_unlocked  -> npcs.js, Wren, on ev_transfer_manifest
       zone_arctic_unlocked -> zones.js, the dead_drop search object
       turtle_access        -> npcs.js, Priya, after q_reef_induction
       deep_gate_open       -> zone_deep.js, deep_northgate station
       meridian_open        -> the meridian_pad keypad itself
       hatch_clear          -> npcs_ocean.js, Vaughn, all 3 documents
       hide_open            -> zone_deep.js, the deep_hatch letter lock
       arctic_case_made,
       zone_ocean_unlocked  -> BOTH set together, quests_arctic.js,
                                q_arctic_ledger's reward */
  const FLAG_HINTS = {
    meeting_set:          'Finish everything in The Deep, then talk to Wren again.',
    zone_coral_unlocked:  'Find the transfer manifest, then bring it to Wren.',
    zone_arctic_unlocked: 'Copy the breeding studbook, then leave a copy at the dead drop Wren told you about.',
    turtle_access:        'Complete Priya’s induction quest, then talk to her about it.',
    deep_gate_open:       'This gate only opens from the far side. Find the service tunnel down to The Deep and unbolt it from there.',
    meridian_open:        'Solve the keypad code right here at the gate.',
    hatch_clear:          'Bring Vaughn all three pieces of paperwork: the relief roster, the closed work order, and the countermand.',
    hide_open:            'Solve the letter lock: read the numbered graffiti tags around the site in order and take the letter signed after each one.',
    /* Same wording for both on purpose: they are set by the same event
       (q_arctic_ledger's reward), so explain() dedupes them into one
       line rather than repeating the same instruction twice. */
    arctic_case_made:     'Complete Wren’s investigation in Arctic Cove: the ledger, Frost’s objection and the chiller log.',
    zone_ocean_unlocked:  'Complete Wren’s investigation in Arctic Cove: the ledger, Frost’s objection and the chiller log.'
  };

  const PHASE_HINTS = {
    gap: 'Only available off shift, not during a public shift.'
  };

  function explainOne(cond) {
    const S = SU.State, d = S.data;
    const out = [];

    if (cond.any) {
      if (!cond.any.some(c => check(c))) {
        const parts = [];
        /* De-duplicated: `zone_ocean_unlocked` and `arctic_case_made` are
           set by the same event (see FLAG_HINTS), so an `any` of both
           would otherwise repeat the same instruction twice. */
        cond.any.forEach(c => explainOne(c).forEach(p => { if (parts.indexOf(p) === -1) parts.push(p); }));
        if (parts.length === 1) out.push(parts[0]);
        else if (parts.length > 1) out.push('Either of these: ' + parts.join(' — or — '));
      }
    }
    if (cond.flags) {
      for (const k in cond.flags) {
        if (S.flag(k) !== cond.flags[k]) {
          out.push(FLAG_HINTS[k] || ('Still needed: ' + k.replace(/_/g, ' ') + '.'));
        }
      }
    }
    if (cond.hasItems) {
      for (const k in cond.hasItems) {
        const need = cond.hasItems[k];
        if (S.count(k) < need) {
          const item = SU.data.items[k];
          out.push('You need ' + (need > 1 ? need + ' x ' : '') + (item ? item.name : k) + '.');
        }
      }
    }
    if (cond.qualification) {
      asArray(cond.qualification).forEach(q => {
        if (!S.hasQual(q)) {
          const qd = SU.data.qualifications[q];
          out.push('Earn the qualification: ' + (qd ? qd.name : q) + '.');
        }
      });
    }
    if (cond.quest) {
      for (const qid in cond.quest) {
        const want = cond.quest[qid];
        const rec = d.quests[qid];
        const status = rec ? rec.status : 'not_started';
        if (status !== want) {
          const qd = SU.data.quests[qid];
          const title = qd ? qd.title : qid;
          out.push((want === 'completed' ? 'Complete the quest: ' : 'Start the quest: ') + title + '.');
        }
      }
    }
    if (cond.phase) {
      const p = S.phase();
      if (cond.phase !== p.id && cond.phase !== p.kind) {
        out.push(PHASE_HINTS[cond.phase] || ('Only available during: ' + cond.phase + '.'));
      }
    }
    return out;
  }

  /* Returns '' when there is nothing to say (condition already passes,
     or uses a key this function does not cover), never null/undefined,
     so a caller can always safely check truthiness. */
  function explain(cond) {
    if (!cond || check(cond)) return '';
    return explainOne(cond).join(' ');
  }

  return { check, explain, apply, effectTypes: Object.keys(handlers) };
})();
