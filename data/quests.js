/* ============================================================
   SEA UNIVERSE: QUESTS

   Steps auto-complete when their `done` condition becomes true, so
   quest logic is data, never code. A quest finishes when its last
   step completes (or when an NPC calls completeQuest directly).

   type: 1 scavenger | 2 find-npc | 3 fact-finding | 4 fun | 5 subversive
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

SU.data.quests = {

  /* --- TYPE 3: Fact-finding. The zone's main-thread quest. ---- */
  q_cove_induction: {
    title: 'Off Her Food',
    zone: 'coastal_cove', giver: 'dana', type: 3,
    summary: 'Dana wants a second opinion on Pearl, the harbour seal who has stopped eating.',
    steps: [
      { id: 's1', text: 'Collect your lanyard from the staff block',
        at: 'my_locker',
        done: { hasItems: { staff_lanyard: 1 } } },
      { id: 's2', text: 'Earn Pinniped Handling I (spend a skill point on Husbandry)',
        where: 'Menu · Skills tab',
        done: { qualification: 'pinniped_basic' } },
      { id: 's3', text: 'Run a care session with Pearl at the seal pool',
        at: 'seal_pool_edge',
        done: { flags: { enc_hs_offfeed_solved: true } } }
    ],
    rewards: [
      { type: 'addXP', amount: 80 },
      { type: 'addSkillPoints', amount: 2 },
      { type: 'toast', text: 'Dana wants to hear what you found.' }
    ],
    repeatable: false,
    mainThread: true
  },

  /* --- TYPE 1: Scavenger hunt ---------------------------------- */
  q_cove_seaglass: {
    title: 'Unapproved Apparatus',
    zone: 'coastal_cove', giver: 'milo', type: 1,
    summary: 'Milo builds enrichment toys off the books and needs three pieces of sea glass.',
    steps: [
      { id: 's1', text: 'Find 3 pieces of sea glass around the cove',
        where: 'Coastal Cove · the rock pools and the drain grate',
        done: { hasItems: { sea_glass: 3 } } },
      { id: 's2', text: 'Bring them back to Milo', at: 'milo', done: null }   // closed by dialogue
    ],
    rewards: [
      { type: 'giveItem', id: 'whistle' },
      { type: 'addXP', amount: 45 },
      { type: 'addSkill', skill: 'husbandry', amount: 1 }
    ],
    repeatable: false,
    mainThread: false
  },

  /* --- TYPE 3: second fact-finding, unlocks welfare evidence ---- */
  q_cove_bruno: {
    title: 'Being Difficult',
    zone: 'coastal_cove', giver: 'milo', type: 3,
    summary: 'Bruno the sea lion refuses to enter the show pool. Milo does not believe animals are ever "just being difficult".',
    steps: [
      { id: 's1', text: 'Run a care session with Bruno at the stadium',
        at: 'sealion_stage',
        done: { flags: { enc_csl_showstress_solved: true } } }
    ],
    rewards: [
      { type: 'addXP', amount: 60 },
      { type: 'addSkillPoints', amount: 1 },
      { type: 'addSkill', skill: 'observation', amount: 1 }
    ],
    repeatable: false,
    mainThread: false
  },

  /* --- TYPE 4: random fun adventure ---------------------------- */
  q_cove_photo: {
    title: 'Hands Like a Seagull',
    zone: 'coastal_cove', giver: 'nan', type: 4,
    summary: 'Nan wants a photo with her granddaughter at the seal pool railing.',
    steps: [
      { id: 's1', text: 'Get a camera (the kiosk sells them)',
        at: 'kiosk_counter',
        done: { hasItems: { camera: 1 } } },
      { id: 's2', text: 'Take the photo for Nan', at: 'nan', done: null }
    ],
    rewards: [
      { type: 'addXP', amount: 35 },
      { type: 'money', amount: 12 },
      { type: 'achievement', id: 'first_quest' }
    ],
    repeatable: false,
    mainThread: false
  },

  /* --- TYPE 2: find/observe to deliver a fact ------------------ */
  q_cove_ollie: {
    title: 'Not Water Cats',
    zone: 'coastal_cove', giver: 'ollie', type: 2,
    summary: 'A kid needs a genuinely good otter fact to defeat his sister with.',
    steps: [
      { id: 's1', text: 'Observe a sea otter to learn a real fact',
        at: 'otter_deck',
        done: { species: { sea_otter: { discovered: true } } } },
      { id: 's2', text: 'Report back to Ollie', at: 'ollie', done: null }
    ],
    rewards: [
      { type: 'giveItem', id: 'souvenir_pin' },
      { type: 'addXP', amount: 30 },
      { type: 'addSkill', skill: 'observation', amount: 1 }
    ],
    repeatable: false,
    mainThread: false
  },

  /* --- TYPE 5: subversive NPC, main conspiracy thread ---------- */
  q_cove_manifest: {
    title: 'Manifest 4471',
    zone: 'coastal_cove', giver: 'sable', type: 5,
    summary: 'Sable says a transfer manifest in the staff block contradicts the park\'s own brochure.',
    steps: [
      { id: 's1', text: 'Read transfer manifest 4471 in the staff block',
        at: 'manifest_clipboard',
        done: { evidence: 'ev_transfer_manifest' } },
      { id: 's2', text: 'Tell Sable what it said', at: 'sable', done: null }
    ],
    rewards: [
      { type: 'addXP', amount: 70 },
      { type: 'addSkill', skill: 'discretion', amount: 1 },
      { type: 'toast', text: 'Take this to Wren.' }
    ],
    repeatable: false,
    mainThread: true
  },

  /* ==========================================================
     ZONE 2: CORAL KINGDOM
     ========================================================== */

  /* --- TYPE 3: the zone's main-thread fact-finding quest ------ */
  q_reef_induction: {
    title: 'Rake Marks',
    zone: 'coral_kingdom', giver: 'priya', type: 3,
    summary: 'Priya wants your read on Nyari, a dolphin who came up with fresh tooth-rake injuries.',
    steps: [
      { id: 's1', text: 'Earn Cetacean Handling I (spend a skill point on Training)',
        where: 'Menu · Skills tab',
        done: { qualification: 'cetacean_basic' } },
      { id: 's2', text: 'Run a care session with Nyari at the dolphin lagoon',
        at: 'dolphin_deck',
        done: { flags: { enc_bd_rakes_solved: true } } }
    ],
    rewards: [
      { type: 'addXP', amount: 90 },
      { type: 'addSkillPoints', amount: 2 },
      { type: 'toast', text: 'Priya wants to hear what you concluded.' }
    ],
    repeatable: false,
    mainThread: true
  },

  /* --- TYPE 1: scavenger hunt, with a paper trail at the end -- */
  q_reef_samples: {
    title: 'Three Samples',
    zone: 'coral_kingdom', giver: 'tosh', type: 1,
    summary: 'Tosh wants water samples drawn by someone whose name is not already on the logs.',
    steps: [
      { id: 's1', text: 'Get a water test kit (spare locker in the staff block, or the kiosk)',
        at: 'reef_locker',
        done: { hasItems: { test_kit: 1 } } },
      { id: 's2', text: 'Draw 3 water samples from the sampling points',
        where: 'Coral Kingdom · Lagoon Sample Port, Hall Sump Tap and the Touch Pool',
        done: { hasItems: { water_sample: 3 } } },
      { id: 's3', text: 'Take them to Tosh in the reef hall', at: 'tosh', done: null }
    ],
    rewards: [
      { type: 'addXP', amount: 55 },
      { type: 'addSkill', skill: 'husbandry', amount: 1 },
      { type: 'money', amount: 12 }
    ],
    repeatable: false,
    mainThread: false
  },

  /* --- TYPE 3: the rehab thread, and the point of the job ----- */
  q_reef_turtle: {
    title: 'Floating',
    zone: 'coral_kingdom', giver: 'sato', type: 3,
    summary: 'Dr Sato wants a fresh pair of eyes on Kira, a green turtle who cannot get her back end down.',
    steps: [
      { id: 's1', text: 'Run a care session with Kira in the rehabilitation unit',
        at: 'turtle_pool',
        done: { flags: { enc_gt_floating_solved: true } } },
      { id: 's2', text: 'Collect 2 pieces of plastic debris from the promenade drain',
        at: 'drain_reef',
        done: { hasItems: { plastic_debris: 2 } } },
      { id: 's3', text: 'Show Dr Sato what came out of the drain', at: 'sato', done: null }
    ],
    rewards: [
      { type: 'addXP', amount: 70 },
      { type: 'addSkill', skill: 'veterinary', amount: 1 },
      { type: 'grantQualification', id: 'rehab_cert' }
    ],
    repeatable: false,
    mainThread: true
  },

  /* --- TYPE 4: odd job. Pays in access, not money ------------- */
  q_reef_glove: {
    title: 'Glove Overboard',
    zone: 'coral_kingdom', giver: 'jarrah', type: 4,
    summary: 'Jarrah has lost a third dive glove in the touch pool filter and would rather Margo did not find out.',
    steps: [
      { id: 's1', text: 'Find the dive glove in the touch pool filter basket',
        at: 'touch_filter',
        done: { hasItems: { dive_glove: 1 } } },
      { id: 's2', text: 'Give it back to Jarrah', at: 'jarrah', done: null }
    ],
    rewards: [
      { type: 'giveItem', id: 'service_key' },
      { type: 'addXP', amount: 40 },
      { type: 'money', amount: 8 }
    ],
    repeatable: false,
    mainThread: false
  },

  /* --- TYPE 2: find the person who remembers ------------------ */
  q_reef_ibrahim: {
    title: 'What It Was Like Before',
    zone: 'coral_kingdom', giver: 'dessie', type: 2,
    summary: 'A teacher wants to know what the park was like twenty years ago. Somebody here was here.',
    steps: [
      { id: 's1', text: 'Find someone who has worked here long enough to remember, and ask them',
        done: { flags: { ibrahim_told: true } } },
      /* No `at` on step 1 on purpose: this is a find-the-person quest and
         naming the boardwalk would solve it for the player. The quest zone
         still shows, so they know which region to look in. */
      { id: 's2', text: 'Take the answer back to Dessie', at: 'dessie', done: null }
    ],
    rewards: [
      { type: 'addXP', amount: 40 },
      { type: 'addSkill', skill: 'discretion', amount: 1 },
      { type: 'money', amount: 10 }
    ],
    repeatable: false,
    mainThread: false
  },

  /* --- TYPE 5: subversive. The zone's conspiracy payload ------ */
  q_reef_studbook: {
    title: 'The Fifth Calf',
    zone: 'coral_kingdom', giver: 'corey', type: 5,
    summary: 'A locked shelf in the records room holds the park\'s cetacean breeding book. Corey fitted the lock ' +
             'and has not felt right about it since.',
    steps: [
      { id: 's1', text: 'Get into the service corridor behind the reef hall',
        where: 'Coral Kingdom · the alley behind the Great Reef Hall',
        done: { zoneVisited: 'service_corridor' } },
      { id: 's2', text: 'Read the breeding studbook (off shift: there are contractors in there during shifts)',
        at: 'studbook',
        done: { evidence: 'ev_dolphin_studbook' } },
      { id: 's3', text: 'Leave copies at the drop behind the loose wall panel',
        at: 'dead_drop',
        done: { flags: { dead_drop_left: true } } }
    ],
    rewards: [
      { type: 'addXP', amount: 90 },
      { type: 'addSkill', skill: 'discretion', amount: 1 },
      { type: 'toast', text: 'Wren will collect tonight.' }
    ],
    repeatable: false,
    mainThread: true
  }
};
