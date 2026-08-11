/* ============================================================
   SEA UNIVERSE: GAME STATE + SAVE/LOAD
   Single source of truth. Every other system reads and writes here.

   Expandability note: new story content should almost always use
   `flags` rather than adding new fields, so old saves keep working.
   ============================================================ */
window.SU = window.SU || {};

/* --- tiny event bus so UI can react without tight coupling --- */
SU.bus = (function () {
  const map = {};
  return {
    on(evt, fn) { (map[evt] = map[evt] || []).push(fn); },
    emit(evt, payload) { (map[evt] || []).forEach(fn => fn(payload)); }
  };
})();

SU.State = (function () {
  const C = SU.config;

  /* Species-dex milestones. Adding a zone = adding a row here and a
     matching achievement in data/progression.js. */
  let checkingRules = false;      // re-entrancy guard for checkAchievementRules

  const DEX_TIERS = [
    { at: 3,  id: 'dex_three'   },
    { at: 7,  id: 'dex_seven'   },
    { at: 10, id: 'dex_ten'     },
    { at: 15, id: 'dex_fifteen' },
    { at: 20, id: 'dex_twenty'  }
  ];

  function fresh() {
    const skills = {};
    C.skills.forEach(s => skills[s.id] = 0);

    return {
      saveVersion: C.saveVersion,
      buildVersion: C.buildVersion,

      // `sprite` picks which player art is drawn: player_<sprite>.svg
      player: { name: 'Trainer', sprite: 'female', zone: 'coastal_cove', x: 20.5, y: 23.5, facing: 'down' },

      day: 1,
      phaseIndex: 0,
      energy: C.phases[0].energy,

      money: 40,
      storyStage: 0,
      suspicion: 0,

      level: 1,
      xp: 0,
      skillPoints: 1,          // one to spend immediately, so the stats screen matters on day 1
      skills: skills,

      flags: {},
      inventory: {},           // { itemId: qty }
      quests: {},              // { questId: { status, step } }
      evidence: [],
      qualifications: [],
      achievements: [],
      species: {},             // { speciesId: { discovered, trust, solved:{} } }
      objects: {},             // { objectId: { searched:true } }
      hazards: {},             // { hazardId: { logged:day, repaired:true } }, see the Safety Register
      hearing: { done: false, rounds: {} },   // { roundId: 'first'|'later'|'conceded' }, the endgame
      npcs: {},                // { npcId: { talked:true } }
      rewards: {},             // { claimKey: dayClaimed }, see claimOnce/claimDaily
      zonesVisited: { coastal_cove: true },   // gates fast-travel destinations
      shift: { assigned: [], done: [], phaseId: null },   // today's cover-job roster

      counters: { searches: 0, cares: 0, questsDone: 0, perfectCares: 0,
                  dutiesDone: 0, dutiesSkipped: 0, shiftsClean: 0,
                  observations: 0, talksCorrect: 0 },
      meta: { created: Date.now(), lastSaved: null, playMs: 0, phaseMs: 0 }
    };
  }

  const S = {
    data: null,

    /* ---------- lifecycle ---------- */
    init() {
      if (!this.load()) { this.data = fresh(); this.save(); }
      return this.data;
    },

    /* `opts` comes from the character-select screen: { name, sprite }. */
    newGame(opts) {
      this.data = fresh();
      if (opts) {
        if (opts.name)   this.data.player.name   = S.cleanName(opts.name);
        if (opts.sprite) this.data.player.sprite = opts.sprite;
      }
      this.save();
      SU.bus.emit('state:changed');
      return this.data;
    },

    /* Trims, collapses runs of whitespace and caps the length, so a name
       typed by a bored fourteen-year-old still fits in a label and a save.
       Falls back to 'Trainer' rather than ever being blank. */
    cleanName(raw) {
      const n = String(raw == null ? '' : raw).replace(/\s+/g, ' ').trim().slice(0, C.nameMaxLength);
      return n || 'Trainer';
    },

    setName(raw) {
      this.data.player.name = S.cleanName(raw);
      this.save();
      SU.bus.emit('state:changed');
      return this.data.player.name;
    },

    setSprite(id) {
      if (!C.playerSprites.some(s => s.id === id)) return false;
      this.data.player.sprite = id;
      this.save();
      SU.bus.emit('state:changed');
      return true;
    },

    save() {
      try {
        this.data.meta.lastSaved = Date.now();
        localStorage.setItem(C.saveKey, JSON.stringify(this.data));
        SU.bus.emit('game:saved');
        return true;
      } catch (e) {
        console.error('[SU] save failed', e);
        return false;
      }
    },

    load() {
      try {
        const raw = localStorage.getItem(C.saveKey);
        if (!raw) return false;
        let d = JSON.parse(raw);
        d = migrate(d);
        // merge over a fresh state so newly added fields always exist
        this.data = Object.assign(fresh(), d);
        return true;
      } catch (e) {
        console.warn('[SU] save corrupt, starting fresh', e);
        return false;
      }
    },

    hasSave() { return !!localStorage.getItem(C.saveKey); },
    wipe() { localStorage.removeItem(C.saveKey); },

    /* ---------- flags ---------- */
    flag(k) { const v = this.data.flags[k]; return v === undefined ? false : v; },
    setFlag(k, v) { this.data.flags[k] = v; SU.bus.emit('state:changed'); },

    /* ---------- reward ledger (anti-farming) ----------
       Repeatable content is a feature; repeatable *payouts* are a bug.
       Anything that hands out XP, money, items or trust from something the
       player can trigger more than once books its payout here first.

       claimOnce  pays out exactly once per save.
       claimDaily pays out once per in-game day.
       Both return true only if the payout should actually happen. */
    claimOnce(key) {
      if (this.data.rewards[key] !== undefined) return false;
      this.data.rewards[key] = this.data.day;
      return true;
    },
    claimDaily(key) {
      if (this.data.rewards[key] === this.data.day) return false;
      this.data.rewards[key] = this.data.day;
      return true;
    },
    claimed(key) { return this.data.rewards[key] !== undefined; },
    claimedToday(key) { return this.data.rewards[key] === this.data.day; },

    /* ---------- the Safety Register ----------
       A hazard is a maintenance or safety defect you can find, write down,
       and eventually get fixed. Three reasons it is its own store rather
       than more flags:

         · a defect has two independent states (you logged it / somebody
           repaired it) and content wants to test either one,
         · the register is a COUNT as much as a list: one broken handrail
           proves nothing, twelve of them is a pattern, and the pattern is
           what an inspector can act on,
         · a repaired hazard can un-block a walkway, so props ask about it
           every frame and that wants a cheap lookup.

       Logging is one-way and permanent: nothing in the game removes a
       hazard from the register, which is why the payout needs no claim key. */
    hz(id) { return this.data.hazards[id] || (this.data.hazards[id] = {}); },

    hazardLogged(id)   { return !!(this.data.hazards[id] && this.data.hazards[id].logged); },
    hazardRepaired(id) { return !!(this.data.hazards[id] && this.data.hazards[id].repaired); },

    /* Returns true only the first time, so the caller can pay for it. */
    logHazard(id) {
      const h = this.hz(id);
      if (h.logged) return false;
      h.logged = this.data.day;
      SU.bus.emit('hazard:logged', id);
      SU.bus.emit('state:changed');
      return true;
    },

    /* Repairing implies logging: you cannot get a defect fixed that you
       never reported, and a save that somehow has one is better off
       self-correcting than leaving a hole in the register. */
    repairHazard(id) {
      const h = this.hz(id);
      if (!h.logged) h.logged = this.data.day;
      if (h.repaired) return false;
      h.repaired = true;
      SU.bus.emit('hazard:repaired', id);
      SU.bus.emit('state:changed');
      return true;
    },

    hazardCount()         { return Object.keys(this.data.hazards).filter(k => this.data.hazards[k].logged).length; },
    hazardRepairedCount() { return Object.keys(this.data.hazards).filter(k => this.data.hazards[k].repaired).length; },

    /* ---------- the hearing (endgame) ----------
       Kept as its own store rather than flags because the report card
       needs the SHAPE of the result, not just whether it happened: how
       many points were answered first time is the one number that
       separates a student who collected everything from one who did not,
       and it is the thing the certificate prints.

       Replaying the hearing resets the scoreboard, which is deliberate.
       The finale is replayable like everything else in this game, and a
       second run with a fuller notebook SHOULD be able to beat the first. */
    hearingReset() {
      this.data.hearing = { done: !!(this.data.hearing && this.data.hearing.done), rounds: {} };
      SU.bus.emit('state:changed');
    },
    hearingRecord(roundId, outcome) {
      const h = this.data.hearing || (this.data.hearing = { done: false, rounds: {} });
      h.rounds[roundId] = outcome;
      SU.bus.emit('state:changed');
    },
    hearingFinish() {
      const h = this.data.hearing || (this.data.hearing = { done: false, rounds: {} });
      h.done = true;
      SU.bus.emit('state:changed');
    },
    hearingWon() {
      const h = this.data.hearing;
      if (!h || !h.rounds) return 0;
      return Object.keys(h.rounds).filter(k => h.rounds[k] === 'first').length;
    },
    hearingAnswered() {
      const h = this.data.hearing;
      if (!h || !h.rounds) return 0;
      return Object.keys(h.rounds).filter(k => h.rounds[k] !== 'conceded').length;
    },
    hearingDone() { return !!(this.data.hearing && this.data.hearing.done); },

    /* How many points the hearing actually has, read from the content so
       nothing has to hard-code six. */
    hearingRoundCount() {
      for (const z in SU.data.zones) {
        const o = (SU.data.zones[z].objects || []).find(x => x.kind === 'hearing');
        if (o) return (o.rounds || []).length;
      }
      return 0;
    },

    /* ---------- inventory ---------- */
    carryLimit() {
      return C.player.baseCarry + Math.floor((this.data.level - 1) / 2) * C.player.carryPerTwoLevels;
    },
    /* WHAT ACTUALLY WEIGHS ANYTHING.
       Only what the player CHOSE to pick up counts: supplies they drink
       and finds they sell. Tools and passes are handed over by the job,
       cannot be dropped or sold, and are needed for duties, so counting
       them meant the further into the game you got the less room you had
       for anything you wanted. */
    countsAgainstCarry(id) {
      const k = (SU.data.items[id] || {}).kind;
      return k === 'consumable' || k === 'junk';
    },
    slotsUsed() {
      return Object.keys(this.data.inventory).filter(id => this.countsAgainstCarry(id)).length;
    },
    count(id) { return this.data.inventory[id] || 0; },
    has(id, qty) { return this.count(id) >= (qty || 1); },
    addItem(id, qty) {
      qty = qty || 1;
      /* A weightless item can never be refused. A quest that hands you a
         key must not fail because you are carrying five doughnuts. */
      if (this.countsAgainstCarry(id) && !this.data.inventory[id] && this.slotsUsed() >= this.carryLimit()) {
        SU.UI && SU.UI.toast('Your bag is full.');
        return false;
      }
      this.data.inventory[id] = this.count(id) + qty;
      const kind = (SU.data.items[id] || {}).kind;
      SU.Audio && SU.Audio.play(kind === 'key' ? 'key_item' : 'item_get');
      SU.bus.emit('state:changed');
      return true;
    },
    removeItem(id, qty) {
      qty = qty || 1;
      const have = this.count(id);
      if (have <= qty) delete this.data.inventory[id];
      else this.data.inventory[id] = have - qty;
      SU.bus.emit('state:changed');
    },

    /* ---------- progression ---------- */
    addXP(n) {
      const d = this.data;
      d.xp += n;
      let leveled = false;
      while (d.level < C.xp.maxLevel && d.xp >= C.xp.toNext(d.level)) {
        d.xp -= C.xp.toNext(d.level);
        d.level++;
        d.skillPoints++;
        leveled = true;
      }
      if (leveled) {
        SU.bus.emit('level:up', d.level);
        SU.UI && SU.UI.toast('Level ' + d.level + '! +1 skill point. ' + S.rank());
      }
      SU.bus.emit('state:changed');
    },

    rank() {
      let t = SU.data.ranks[0].title;
      SU.data.ranks.forEach(r => { if (this.data.level >= r.at) t = r.title; });
      return t;
    },

    /* Free grant: quest rewards and `addSkill` effects come through here
       and never touch skill points. Purchases go through buySkill(). */
    addSkill(id, n) {
      const d = this.data;
      d.skills[id] = Math.min(C.skillMax, (d.skills[id] || 0) + n);
      this.refreshQualifications();
      SU.bus.emit('state:changed');
    },

    /* Points needed to raise `id` one level; 0 once it is capped. */
    skillCost(id) {
      const lvl = this.data.skills[id] || 0;
      return lvl >= C.skillMax ? 0 : C.skillCost(lvl + 1);
    },

    /* The only path that SPENDS points. Returns false and changes nothing
       if the skill is capped or the player cannot afford it, so the UI can
       stay a thin layer over this. */
    buySkill(id) {
      const cost = this.skillCost(id);
      if (!cost || this.data.skillPoints < cost) return false;
      this.data.skillPoints -= cost;
      this.addSkill(id, 1);
      SU.Audio && SU.Audio.play('skill_buy');
      return true;
    },

    /* Qualifications are re-derived whenever skills change, so they can
       never get out of sync with the requirements listed in data. */
    refreshQualifications() {
      Object.keys(SU.data.qualifications).forEach(id => {
        if (this.data.qualifications.indexOf(id) !== -1) return;
        if (SU.Rules.check(SU.data.qualifications[id].req)) {
          this.data.qualifications.push(id);
          SU.UI && SU.UI.toast('Qualification earned: ' + SU.data.qualifications[id].name);
          SU.bus.emit('qualification:earned', id);
        }
      });
      if (this.hasQual('cetacean_basic') && this.hasQual('aquarist_basic')) this.award('reef_certified');
    },
    hasQual(id) { return this.data.qualifications.indexOf(id) !== -1; },

    /* ---------- suspicion ---------- */
    addSuspicion(n) {
      const d = this.data;
      const before = d.suspicion;
      d.suspicion = Math.max(0, Math.min(C.suspicion.max, d.suspicion + n));
      if (n > 0 && d.suspicion > before) {
        SU.Audio && SU.Audio.play('suspicion_up');
        SU.UI && SU.UI.toast('Suspicion +' + (d.suspicion - before), 'bad');
      }
      if (n < 0 && d.suspicion < before) SU.UI && SU.UI.toast('Suspicion ' + (d.suspicion - before), 'good');
      SU.bus.emit('state:changed');
    },
    suspicionBand() {
      let band = C.suspicion.bands[0];
      C.suspicion.bands.forEach(b => { if (this.data.suspicion >= b.at) band = b; });
      return band;
    },

    /* ---------- evidence / species / achievements ---------- */
    addEvidence(id) {
      if (this.data.evidence.indexOf(id) !== -1) return;
      this.data.evidence.push(id);
      SU.bus.emit('evidence:added', id);
      if (this.data.evidence.length === 1) this.award('first_evidence');
      SU.bus.emit('state:changed');
    },
    hasEvidence(id) { return this.data.evidence.indexOf(id) !== -1; },

    sp(id) {
      if (!this.data.species[id]) this.data.species[id] = { discovered: false, trust: 0, solved: {} };
      return this.data.species[id];
    },
    discover(id) {
      const s = this.sp(id);
      if (!s.discovered) {
        s.discovered = true;
        SU.Audio && SU.Audio.play('species_new');
        SU.UI && SU.UI.toast('New species logged: ' + SU.data.species[id].name);
        const n = Object.keys(this.data.species).filter(k => this.data.species[k].discovered).length;
        /* Table rather than a stack of ifs: Zone 3 added dex_ten to
           progression.js and it was never awarded, because the awarding
           lived here as hard-coded lines nobody thought to extend. A new
           tier is now one row. */
        DEX_TIERS.forEach(t => { if (n >= t.at) this.award(t.id); });
      }
      SU.bus.emit('state:changed');
    },
    addTrust(id, n) {
      const s = this.sp(id);
      s.trust = Math.max(0, Math.min(100, s.trust + n));
      if (s.trust >= 50) this.award('trusted');
      SU.bus.emit('state:changed');
    },

    /* State achievements (see SU.data.achievementRules). Guarded because
       award() emits state:changed, which lands us straight back here. */
    checkAchievementRules() {
      if (checkingRules || !this.data) return;
      checkingRules = true;
      try {
        (SU.data.achievementRules || []).forEach(r => {
          if (this.data.achievements.indexOf(r.id) === -1 && SU.Rules.check(r.when)) this.award(r.id);
        });
      } finally { checkingRules = false; }
    },

    award(id) {
      if (this.data.achievements.indexOf(id) !== -1) return;
      const a = SU.data.achievements[id];
      if (!a) { console.warn('[SU] unknown achievement', id); return; }
      this.data.achievements.push(id);
      SU.Audio && SU.Audio.play('achievement');
      /* An award gets the on-map popup rather than a toast. Falls back to
         a toast if the UI has not booted yet, since achievements can fire
         from a migration or an onArrive before the first frame. */
      if (SU.UI && SU.UI.awardPopup) SU.UI.awardPopup(Object.assign({ id: id }, a));
      else SU.UI && SU.UI.toast('Achievement: ' + a.name, 'good');
      if (a.xp) this.addXP(a.xp);
      SU.bus.emit('state:changed');
    },

    /* ---------- day cycle ---------- */
    phase() { return SU.config.phases[this.data.phaseIndex]; },

    /* ---------- the shift clock ----------
       Everything below is DERIVED from `meta.phaseMs`. Nothing stores a
       time of day, which means the clock cannot drift out of step with
       the phase, and a save that lands mid-shift resumes at exactly the
       minute it left off. */
    phaseDurationMs() { return this.phase().real * 60000; },
    phaseElapsedMs()  { return Math.min(this.data.meta.phaseMs || 0, this.phaseDurationMs()); },
    phaseProgress()   { return this.phaseElapsedMs() / this.phaseDurationMs(); },
    phaseOver()       { return (this.data.meta.phaseMs || 0) >= this.phaseDurationMs(); },

    /* In-game minutes past midnight, as a float so the display moves
       continuously instead of stepping once per in-game minute. */
    clockMinutes() {
      const p = this.phase();
      return p.from + (p.to - p.from) * this.phaseProgress();
    },

    /* 24-hour, because this is a workplace and every sign, roster and
       log in the game is already written that way. */
    clockText(mins) {
      const m = Math.floor(mins === undefined ? this.clockMinutes() : mins);
      const h = Math.floor(m / 60) % 24;
      return (h < 10 ? '0' : '') + h + ':' + (m % 60 < 10 ? '0' : '') + (m % 60);
    },

    phaseEndsText() { return this.clockText(this.phase().to); },

    advancePhase() {
      const d = this.data;

      // score the shift you are walking away from, before the clock moves
      if (SU.Duties) SU.Duties.settle();

      d.phaseIndex++;
      if (d.phaseIndex >= C.phases.length) {
        d.phaseIndex = 0;
        d.day++;
        this.addSuspicion(-C.suspicion.decayPerDay);
        if (d.day === 2) this.award('first_day');
        if (d.day >= 3 && d.suspicion === 0) this.award('clean_record');
        SU.bus.emit('day:new', d.day);
      }
      d.energy = this.phase().energy;
      d.meta.phaseMs = 0;                         // the new shift starts at its own opening time
      if (SU.Duties) SU.Duties.assign();          // hand out the new roster
      if (C.autosaveOnPhaseChange) this.save();
      SU.bus.emit('phase:changed', this.phase());
      SU.bus.emit('state:changed');
    },

    spendEnergy(n) {
      this.data.energy = Math.max(0, this.data.energy - n);
      SU.bus.emit('state:changed');
    }
  };

  /* ---------- save migrations ----------
     Each block upgrades a save one version. Never delete an old block:
     a student's save from two weeks ago has to walk through all of them. */
  function migrate(d) {
    if (!d.saveVersion) d.saveVersion = 1;

    if (d.saveVersion < 2) {
      // v2: every region got its own staff block, so the single generic
      // 'staff_block' zone became 'staff_cove'.
      if (d.player && d.player.zone === 'staff_block') {
        d.player.zone = 'staff_cove';
        const sp = SU.data.zones.staff_cove.spawns.entry;
        d.player.x = sp.x + 0.5;
        d.player.y = sp.y + 0.5;
      }
      d.zonesVisited = d.zonesVisited || {};
      d.zonesVisited.coastal_cove = true;
      if (d.flags && d.flags.zone_coral_unlocked) d.zonesVisited.coral_kingdom = true;
      d.saveVersion = 2;
    }

    if (d.saveVersion < 3) {
      // v3: shifts got real duties.
      d.shift = { assigned: [], done: [], phaseId: null };
      d.counters = d.counters || {};
      d.counters.dutiesDone = d.counters.dutiesDone || 0;
      d.counters.dutiesSkipped = d.counters.dutiesSkipped || 0;
      d.counters.shiftsClean = d.counters.shiftsClean || 0;
      d.saveVersion = 3;
    }

    if (d.saveVersion < 4) {
      // v4: repeat rewards are booked in a ledger so they can't be farmed.
      d.rewards = d.rewards || {};
      // An old save may already have talked Wren through the manifest scene
      // and banked that XP; don't hand it out a second time on load.
      if (d.flags && d.flags.zone_coral_unlocked) d.rewards.wren_manifest = d.day || 1;
      // Searchable props now restock daily rather than being infinite.
      for (const oid in (d.objects || {})) {
        if (d.objects[oid].searched && d.objects[oid].day === undefined) {
          d.objects[oid].day = d.day || 1;
        }
      }
      // Zone 2 added observation posts and keeper talks.
      d.counters = d.counters || {};
      d.counters.observations = d.counters.observations || 0;
      d.counters.talksCorrect = d.counters.talksCorrect || 0;
      d.saveVersion = 4;
    }

    if (d.saveVersion < 5) {
      // v5: character select. `player` is copied over wholesale by the
      // Object.assign in load(), so an old save's player object has no
      // `sprite` at all, so fill it in rather than leaving it undefined.
      d.player = d.player || {};
      if (!d.player.sprite) d.player.sprite = 'female';
      if (!d.player.name)   d.player.name   = 'Trainer';
      d.saveVersion = 5;
    }

    if (d.saveVersion < 6) {
      // v6: The Deep added hazards and the Safety Register. Nothing to
      // backfill: a save from before Zone 5 has found no defects, and an
      // empty register is the honest starting position.
      d.hazards = d.hazards || {};
      d.saveVersion = 6;
    }

    if (d.saveVersion < 7) {
      // v7: the endgame added the hearing. Nothing to backfill: a save
      // from before it has not had the conversation.
      d.hearing = d.hearing || { done: false, rounds: {} };
      d.saveVersion = 7;
    }

    if (d.saveVersion < 8) {
      /* v8: the shift clock. An older save is mid-phase with no record of
         how long it has been there, so it starts the phase again from the
         top rather than being dumped straight into an end-of-shift. */
      d.meta = d.meta || {};
      d.meta.phaseMs = 0;
      d.saveVersion = 8;
    }

    return d;
  }

  return S;
})();

/* State achievements are checked on every state change, the same way
   quest steps are. Subscribed out here so it runs after SU.Rules exists.

   `zone:changed` matters as much as `state:changed`: walking into a room
   updates zonesVisited but does NOT emit state:changed, so a rule using
   `zoneVisited` would sit unfired until something unrelated happened. */
SU.bus.on('state:changed', () => SU.State.checkAchievementRules());
SU.bus.on('zone:changed',  () => SU.State.checkAchievementRules());
