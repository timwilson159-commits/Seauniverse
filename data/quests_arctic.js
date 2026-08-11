/* ============================================================
   SEA UNIVERSE: ARCTIC COVE QUESTS

   Same shape as data/quests.js.

   NEW IN THIS ZONE: `timed`.

     timed: { playSeconds: 240,
              label: 'Before the store warms through',
              onTime: [ ...effects... ] }

   Beat the clock and `onTime` fires on top of the normal rewards.
   That is where the suspicion refunds live: doing a visible, public,
   useful job quickly is exactly what makes a member of staff look
   like a member of staff.

   Miss it and nothing bad happens. The quest does not fail, does not
   close, and still pays its normal reward. The clock only ever adds.
   That is deliberate and it matches the rest of the game: pressure is
   soft, and no student loses progress to a timer.

   The clock runs on accumulated PLAY time, so it stops while a dialogue
   box, the journal or a care session is open, and closing the tab does
   not burn it down.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.quests = SU.data.quests || {};

/* --- TYPE 3: the zone's main-thread fact-finding quest --------- */
SU.data.quests.q_arctic_induction = {
  title: 'Not Lazy',
  zone: 'arctic_cove', giver: 'frost', type: 3,
  summary: 'Nuka has stopped hauling out. The session notes call it low motivation. Dr Frost has never met a lazy walrus.',
  steps: [
    { id: 's1', text: 'Earn Cold Water Handling (Husbandry 2, Veterinary 1)',
      where: 'Menu · Skills tab',
      done: { qualification: 'cold_water_cert' } },
    { id: 's2', text: 'Run a care session at the walrus haul-out',
      at: 'walrus_deck',
      done: { flags: { enc_wa_haulout_solved: true } } },
    { id: 's3', text: 'Take what you found back to Dr Frost', at: 'frost', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 90 },
    { type: 'addSkillPoints', amount: 2 },
    { type: 'achievement', id: 'tusk_truth' }
  ],
  repeatable: false,
  mainThread: true
};

/* --- TYPE 3: the belugas, and what they have started copying --- */
SU.data.quests.q_arctic_song = {
  title: 'The Wrong Song',
  zone: 'arctic_cove', giver: 'rune', type: 3,
  summary: 'Rune says there is a note in the beluga song that is not theirs. He wants to know where they got it.',
  steps: [
    { id: 's1', text: 'Earn Cold Water Handling so you can work the beluga pool',
      where: 'Menu · Skills tab',
      done: { qualification: 'cold_water_cert' } },
    { id: 's2', text: 'Run a care session at the beluga pool and work out the source',
      at: 'beluga_deck',
      done: { flags: { enc_be_song_solved: true } } }
  ],
  rewards: [
    { type: 'addXP', amount: 70 },
    { type: 'addSkill', skill: 'observation', amount: 1 },
    { type: 'achievement', id: 'sea_canary' }
  ],
  repeatable: false,
  mainThread: false
};

/* --- TYPE 4: TIMED. The thermostat run. -----------------------
   Three stations at opposite corners of the zone, so the timer is
   spent walking, not waiting. Beating it is public, visible, useful
   work in front of guests, which is why it buys suspicion back. */
SU.data.quests.q_arctic_defrost = {
  title: 'Three Thermostats',
  zone: 'arctic_cove', giver: 'bo', type: 4,
  summary: 'A guest has walked the zone nudging every thermostat they passed. Bo has minutes before the Cold Store warms through.',
  timed: {
    playSeconds: 210,
    label: 'Before the store warms through',
    onTime: [
      { type: 'addSuspicion', amount: -14 },
      { type: 'addXP', amount: 50 },
      { type: 'money', amount: 20 },
      { type: 'achievement', id: 'beat_the_thaw' },
      { type: 'toast', text: 'Half the promenade watched you fix it. That is the best kind of cover.' }
    ]
  },
  steps: [
    { id: 's1', text: 'Reset Thermostat A at the north promenade',
      at: 'thermo_north',
      done: { flags: { thermo_north_set: true } } },
    { id: 's2', text: 'Reset Thermostat B on the west walk',
      at: 'thermo_west',
      done: { flags: { thermo_west_set: true } } },
    { id: 's3', text: 'Reset Thermostat C in the plaza',
      at: 'thermo_plaza',
      done: { flags: { thermo_plaza_set: true } } }
  ],
  rewards: [
    { type: 'addXP', amount: 40 },
    { type: 'giveItem', id: 'hot_chocolate' },
    { type: 'toast', text: 'Bo owes you something enormous.' }
  ],
  repeatable: false,
  mainThread: false
};

/* --- TYPE 2: TIMED. Kit's talk. -------------------------------
   A find-the-people errand with a deadline that is a scheduled public
   event, so again: finishing in time is you being seen doing the job. */
SU.data.quests.q_arctic_script = {
  title: 'Every Third Line',
  zone: 'arctic_cove', giver: 'kit', type: 2,
  summary: 'Kit has the two o\'clock keeper talk, no script, and a rising sense of doom. Get the facts from people who know them.',
  timed: {
    playSeconds: 300,
    label: 'Before the two o\'clock talk',
    onTime: [
      { type: 'addSuspicion', amount: -10 },
      { type: 'addXP', amount: 45 },
      { type: 'toast', text: 'Guest Experience saw a volunteer nail a talk. Nobody looked at you twice.' }
    ]
  },
  steps: [
    { id: 's1', text: 'Fish the ruined script out of the recycling bin',
      at: 'script_bin',
      done: { hasItems: { talk_script: 1 } } },
    { id: 's2', text: 'Get the walrus facts from Mags',
      at: 'mags',
      done: { flags: { met_mags: true } } },
    { id: 's3', text: 'Get the beluga facts from Rune',
      at: 'rune',
      done: { flags: { met_rune: true } } },
    { id: 's4', text: 'Take it all back to Kit', at: 'kit', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 55 },
    { type: 'addSkill', skill: 'discretion', amount: 1 },
    { type: 'money', amount: 12 }
  ],
  repeatable: false,
  mainThread: false
};

/* --- TYPE 1: the haunting. Scavenger hunt, played straight. ---- */
SU.data.quests.q_arctic_haunting = {
  title: 'Something In The Plant Room',
  zone: 'arctic_cove', giver: 'bo', type: 1,
  summary: 'Bo wants three noises identified. He would genuinely prefer ghosts, because ghosts are not his department.',
  steps: [
    { id: 's1', text: 'Find what is moaning near the beluga deck',
      at: 'ghost_joint',
      done: { flags: { ghost_moan: true } } },
    { id: 's2', text: 'Find what is knocking in the Cold Store',
      at: 'ghost_rack',
      done: { flags: { ghost_knock: true } } },
    { id: 's3', text: 'Find the third one, and read the plant room log',
      at: 'plant_log',
      done: { evidence: 'ev_chiller_overrun' } }
  ],
  rewards: [
    { type: 'addXP', amount: 60 },
    { type: 'money', amount: 15 },
    { type: 'addSkill', skill: 'observation', amount: 1 },
    { type: 'toast', text: 'It was an expansion joint, an ice fall, and a duck.' }
  ],
  repeatable: false,
  mainThread: false
};

/* --- TYPE 4: the jumper. Funny, then quietly not. -------------- */
SU.data.quests.q_arctic_jumper = {
  title: 'A Little Long In The Flipper',
  zone: 'arctic_cove', giver: 'agnes', type: 4,
  summary: 'Sister Agnes has knitted a jumper for a harp seal. She will not be fobbed off. She will, however, accept facts.',
  steps: [
    { id: 's1', text: 'Observe the harp seals properly at the Ice Pen',
      at: 'seal_pen',
      done: { flags: { enc_hs_heat_solved: true } } },
    { id: 's2', text: 'Go back and explain it to her properly', at: 'agnes', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 50 },
    { type: 'giveItem', id: 'seal_jumper' },
    { type: 'addSkill', skill: 'training', amount: 1 },
    { type: 'toast', text: 'She kept the jumper. You have been given the jumper.' }
  ],
  repeatable: false,
  mainThread: false
};

/* --- TYPE 5: subversive / main thread. The ledger. ------------- */
SU.data.quests.q_arctic_ledger = {
  title: 'Valuation Pending',
  zone: 'arctic_cove', giver: 'wren_arctic', type: 5,
  summary: 'Wren wants the ledger backed up with the two documents the park wrote itself: Frost\'s objection and the chiller log.',
  steps: [
    { id: 's1', text: 'Copy Dr Frost\'s pinned objection in the Cold Store',
      at: 'frost_objection',
      done: { evidence: 'ev_frost_objection' } },
    { id: 's2', text: 'Copy the refrigeration log from the plant room wall',
      at: 'plant_log',
      done: { evidence: 'ev_chiller_overrun' } },
    { id: 's3', text: 'Show the ledger to Dr Frost and get her on the record',
      at: 'frost',
      done: { flags: { frost_turned: true } } }
  ],
  rewards: [
    { type: 'addXP', amount: 110 },
    { type: 'addSkillPoints', amount: 2 },
    { type: 'setFlag', flag: 'arctic_case_made', value: true },
    { type: 'unlockZone', id: 'ocean' },
    { type: 'toast', text: 'A manager who objected in writing, and a machine that proves the cost. That is a case.' },
    { type: 'toast', text: 'Wren: the south gate is yours. Go and look at the Open Ocean Wing.' }
  ],
  repeatable: false,
  mainThread: true
};
