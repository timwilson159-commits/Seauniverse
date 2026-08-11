/* ============================================================
   SEA UNIVERSE: OPEN OCEAN QUESTS

   Same shape as data/quests.js and data/quests_arctic.js, including
   the `timed` block introduced in Zone 3.

   Two of these are the zone's headline puzzles, and both deliberately
   withhold the last step of the reasoning:

     q_ocean_cover    Dags names four pick-me-ups. Nothing in the
                        quest text, the step text or any line of
                        dialogue says they come from four different
                        park kiosks. The step just says "bring him
                        what he asked for". Working out that the
                        doughnut is in Coastal Cove, the smoothie is
                        in Coral Kingdom, the hot chocolate is in
                        Arctic Cove and the slushie is here IS the
                        puzzle. Do not add a hint to this file.

     q_ocean_meridian the gate code is never stored as text anywhere
                        the player can read it. It is derived from four
                        species facts printed on four boards. See the
                        note at the top of data/zone_ocean.js.

   Steps advance strictly in order (js/quests.js), but every condition
   here is a flag that stays set, so satisfying them out of order is
   safe: the quest simply catches up in one go.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.quests = SU.data.quests || {};

/* --- TYPE 3: the zone's main-thread induction ------------------ */
SU.data.quests.q_ocean_induction = {
  title: 'A Collection Management Decision',
  zone: 'open_ocean', giver: 'halina', type: 3,
  summary: 'Kupe, the oldest pilot whale, has stopped eating and her chart says nothing is wrong. ' +
           'Halina wants somebody to work out what actually changed.',
  steps: [
    { id: 's1', text: 'Earn Open Water Handling (Husbandry 2, Training 2, Observation 1)',
      where: 'Menu · Skills tab',
      done: { qualification: 'pelagic_cert' } },
    { id: 's2', text: 'Run a care session at the Pod Pool and find out what changed',
      at: 'pod_pool',
      done: { flags: { enc_pw_matriarch_solved: true } } },
    { id: 's3', text: 'Take it back to Halina', at: 'halina', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 100 },
    { type: 'addSkillPoints', amount: 2 },
    { type: 'achievement', id: 'three_generations' }
  ],
  repeatable: false,
  mainThread: true
};

/* --- TYPE 3: Noor's two cases --------------------------------- */
SU.data.quests.q_ocean_pods = {
  title: 'Three Is Not A Pod',
  zone: 'open_ocean', giver: 'noor', type: 3,
  summary: 'Noor has three dolphins swimming laps and three pilot whales pushing at a drain, and ' +
           'no time to work out why either group is doing it.',
  steps: [
    { id: 's1', text: 'Work out why the common dolphins are circling',
      at: 'bay_pool',
      done: { flags: { enc_cd_podsize_solved: true } } },
    { id: 's2', text: 'Work out what the pilot whales are doing at the pool floor',
      at: 'pod_pool',
      done: { flags: { enc_pw_dive_solved: true } } }
  ],
  rewards: [
    { type: 'addXP', amount: 85 },
    { type: 'addSkill', skill: 'observation', amount: 1 },
    { type: 'money', amount: 20 },
    { type: 'achievement', id: 'shape_of_the_pool' }
  ],
  repeatable: false,
  mainThread: false
};

/* --- TYPE 2: the lagoon cover, and the man who can move it -----
   THE FOUR-KIOSK PUZZLE. Step two is deliberately vague. */
SU.data.quests.q_ocean_cover = {
  title: 'Still On At Eleven',
  zone: 'open_ocean', giver: 'noor', type: 2,
  summary: 'The manta lagoon\'s night cover should have come off at seven. It is still on, the winch ' +
           'is locked, and the only key is on a maintenance man nobody has seen since breakfast.',
  steps: [
    { id: 's1', text: 'Find the maintenance man',
      where: 'Open Ocean · Blue Horizon Stadium',
      done: { flags: { met_dags: true } } },
    /* `at` points at Dags, i.e. where you DELIVER. It must not name where
       the four items are bought, and that is the puzzle. */
    { id: 's2', text: 'Bring him everything he asked for',
      at: 'dags',
      done: { flags: { dags_awake: true } } },
    { id: 's3', text: 'Get in with the mantas and see what the cover has been hiding',
      at: 'manta_lagoon',
      done: { flags: { enc_mr_spots_solved: true } } }
  ],
  rewards: [
    { type: 'addXP', amount: 95 },
    { type: 'addSkill', skill: 'husbandry', amount: 1 },
    { type: 'giveItem', id: 'winch_key' },
    { type: 'toast', text: 'Dags cut you a copy of the winch key. Do not tell anyone.' }
  ],
  repeatable: false,
  mainThread: false
};

/* --- TYPE 1: the Meridian gate. Main thread. ------------------- */
SU.data.quests.q_ocean_meridian = {
  title: 'The One Who Is Everywhere',
  zone: 'open_ocean', giver: 'trixie', type: 1,
  summary: 'There is an orca in this park and nobody has seen her since May. The gate has a keypad, ' +
           'the keypad has a riddle taped to it, and the man who wrote the riddle is on sick leave.',
  steps: [
    { id: 's1', text: 'Find out who set the code',
      where: 'Open Ocean Staff Block',
      done: { flags: { found_nolan_locker: true } } },
    { id: 's2', text: 'Work out the four digits and open the Meridian gate',
      at: 'meridian_pad',
      done: { flags: { meridian_open: true } } },
    { id: 's3', text: 'Run a care session with her and find out why she has gone quiet',
      at: 'meridian_deck',
      done: { flags: { enc_or_alone_solved: true } } }
  ],
  rewards: [
    { type: 'addXP', amount: 130 },
    { type: 'addSkillPoints', amount: 2 },
    { type: 'addSkill', skill: 'observation', amount: 1 },
    { type: 'toast', text: 'One person who has been in the room.' }
  ],
  repeatable: false,
  mainThread: true
};

/* --- TYPE 1: moving security off the stair --------------------
   A scavenger hunt where the collectibles are three signatures.
   Vaughn is not an obstacle to be tricked; he is an obstacle to be
   correctly filled in, which is funnier and is also the only thing
   that would actually work. */
SU.data.quests.q_ocean_underground = {
  title: 'Anywhere But Here',
  zone: 'open_ocean', giver: 'vaughn', type: 1,
  summary: 'A security officer has been standing on the service stair for five weeks because of an ' +
           'unsigned notice. He would very much like to be moved, correctly, in writing.',
  steps: [
    { id: 's1', text: 'Get a relief officer rostered to the stair, in writing',
      at: 'roster_amend',
      done: { flags: { vaughn_relief: true } } },
    { id: 's2', text: 'Get maintenance to close off the open work order on the hatch',
      at: 'dags',
      done: { flags: { vaughn_workorder: true } } },
    { id: 's3', text: 'Get somebody with a name to countermand the restriction notice',
      at: 'halina',
      done: { flags: { vaughn_order: true } } },
    { id: 's4', text: 'Take all three back to Vaughn', at: 'vaughn', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 90 },
    { type: 'addSkill', skill: 'discretion', amount: 1 },
    { type: 'money', amount: 18 },
    { type: 'achievement', id: 'back_of_house_two' }
  ],
  repeatable: false,
  mainThread: false
};

/* --- TYPE 4: TIMED. The ghost show. ---------------------------
   Three isolators at three ends of the zone before the playout
   machine fires a cancelled show into two occupied pools. Beating
   it is quiet, invisible work that nobody thanks you for, so the
   refund is smaller than Arctic's public ones. */
SU.data.quests.q_ocean_soundcheck = {
  title: 'The Ghost Show',
  zone: 'open_ocean', giver: 'ferris', type: 4,
  summary: 'The show is cancelled. The playout machine has not been told. At half three it fires ' +
           'Ocean Giants into an empty stadium and two pools with animals in them.',
  timed: {
    playSeconds: 240,
    label: 'Before the half three playout',
    onTime: [
      { type: 'addSuspicion', amount: -8 },
      { type: 'addXP', amount: 45 },
      { type: 'addTrust', species: 'common_dolphin', amount: 6 },
      { type: 'achievement', id: 'silence_please' },
      { type: 'toast', text: 'Half three comes and goes and nothing happens at all. Perfect.' }
    ]
  },
  steps: [
    { id: 's1', text: 'Pull the stadium line isolator',
      at: 'iso_stadium',
      done: { flags: { iso_stadium_off: true } } },
    { id: 's2', text: 'Pull the lagoon line isolator',
      at: 'iso_lagoon',
      done: { flags: { iso_lagoon_off: true } } },
    { id: 's3', text: 'Pull the bay line isolator',
      at: 'iso_bay',
      done: { flags: { iso_bay_off: true } } }
  ],
  rewards: [
    { type: 'addXP', amount: 50 },
    { type: 'money', amount: 15 },
    { type: 'addSkill', skill: 'veterinary', amount: 1 },
    { type: 'toast', text: 'Ferris: that is the first thing anyone has let me fix in four years.' }
  ],
  repeatable: false,
  mainThread: false
};

/* --- TYPE 5: subversive / main thread. The money and the name. - */
SU.data.quests.q_ocean_case = {
  title: 'The Money And The Name',
  zone: 'open_ocean', giver: 'wren_ocean', type: 5,
  summary: 'Welfare is arguable. Wren wants the three documents that are not: what the orca is for, ' +
           'where the animals actually went, and who owns the company.',
  steps: [
    { id: 's1', text: 'Get into Administration off shift and copy the board pack',
      at: 'admin_boardpack',
      done: { evidence: 'ev_wing_boardpack' } },
    { id: 's2', text: 'Get under the plaza and copy the movements folder',
      at: 'service_ledger',
      done: { evidence: 'ev_movements_folder' } },
    { id: 's3', text: 'Find the company search printout and read the name on it',
      at: 'admin_cabinet',
      done: { evidence: 'ev_cuda_directorship' } },
    { id: 's4', text: 'Put the name to Barry himself',
      at: 'barry_ocean',
      done: { flags: { barry_unmasked: true } } }
  ],
  rewards: [
    { type: 'addXP', amount: 160 },
    { type: 'addSkillPoints', amount: 3 },
    { type: 'setStoryStage', stage: 9 },
    { type: 'setFlag', flag: 'ocean_case_made', value: true },
    { type: 'achievement', id: 'follow_the_money' },
    { type: 'toast', text: 'It has stopped being a story about a sad animal.' }
  ],
  repeatable: false,
  mainThread: true
};
