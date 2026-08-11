/* ============================================================
   SEA UNIVERSE: THE DEEP QUESTS

   Same shape as the other zone quest files, including the `timed`
   block from Zone 3.

   THREE OF THESE WITHHOLD PART OF THE REASONING ON PURPOSE, in the
   same way the four-kiosk puzzle in Open Ocean does. Do not add
   hints to them:

     q_deep_tags     the steps say "find all nine" and "open the
                       door". Nothing anywhere says to read the
                       sign-off letters in number order. Ondine says
                       only that numbering implies an order. The word
                       itself appears in exactly two places in the
                       whole project: the nine graffiti texts in
                       data/zone_deep.js, and `code` on deep_hatch.

     q_deep_barry    the five steps say who to ask, and never say
                       what the answer will be, because the point is
                       that no single one of them is a revelation.
                       The contradiction is an emergent property of
                       holding all five.

     q_deep_register the threshold is eight of twelve, so there is
                       no checklist and no "you have found 7/12"
                       counter in the step text. The Safety Register
                       in the Notebook is the counter.

   EVERY STEP CARRIES A LOCATION, per the convention added 2026-08-04:
   `at` for a fixed object or NPC id, `where` for free text. Zone 5
   needs this more than any other zone, because the Barry quest sends
   the player to four other regions in one afternoon.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.quests = SU.data.quests || {};

/* --- TYPE 3: the induction, and the tutorial for hazard logging --- */
SU.data.quests.q_deep_induction = {
  title: 'Written Down, With a Date On It',
  zone: 'the_deep', giver: 'marisol', type: 3,
  summary: 'Marisol Vane runs a site she does not believe is safe, and signs for it every week. ' +
           'She wants somebody to walk it and write down what is actually wrong, because a ' +
           'conversation is deniable and a dated list is not.',
  steps: [
    { id: 's1', text: 'Walk the site and log any three defects into the Safety Register',
      where: 'The Deep · anywhere on the site',
      done: { hazardCount: { min: 3 } } },
    { id: 's2', text: 'Read the three back to Marisol', at: 'marisol', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 90 },
    { type: 'addSkill', skill: 'observation', amount: 1 }
  ],
  mainThread: true
};

/* --- TYPE 1: the Safety Register itself ---------------------------
   The scavenger hunt of this zone, except what you are collecting is
   evidence of neglect, and the collection is worth more than the sum
   of its parts. Eight of twelve, so it is achievable without a wiki. */
SU.data.quests.q_deep_register = {
  title: 'The Safety Register',
  zone: 'the_deep', giver: 'marisol', type: 1,
  summary: 'One defect is arguable. A dozen, dated and located in one document, is a pattern, and ' +
           'a pattern is the only thing an inspector is allowed to act on. There is an auditor on ' +
           'site until Thursday and she is being shown a route.',
  steps: [
    { id: 's1', text: 'Log at least eight defects into the Safety Register',
      where: 'The Deep · the walkways, the pump house, the gate house and the staff block',
      done: { hazardCount: { min: 8 } } },
    { id: 's2', text: 'Tell Marisol the register is ready', at: 'marisol',
      done: { flags: { register_handed: true } } },
    { id: 's3', text: 'Put it in the hands of the auditor', at: 'delia', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 160 },
    { type: 'addSkill', skill: 'observation', amount: 1 },
    { type: 'grantQualification', id: 'sirenian_cert' }
  ],
  mainThread: true
};

/* --- TYPE 2: NINE YEARS OF BARRY ----------------------------------
   The cross-zone quest, and the main thread of the whole zone. Five
   people in four other regions, none of whom are lying. */
SU.data.quests.q_deep_barry = {
  title: 'Nine Years of Barry',
  zone: 'the_deep', giver: 'wren_deep', type: 2,
  summary: 'Everybody in this park has met him. Nobody has the same story. Nobody has ever put the ' +
           'stories side by side, because the park is the size of a suburb and none of them talk to ' +
           'each other. Go and ask five people what he told them.',
  steps: [
    { id: 's1', text: 'Ask Dana about her induction pack', at: 'dana',
      done: { flags: { barry_dana: true } } },
    { id: 's2', text: 'Ask Milo about the birthday party', at: 'milo',
      done: { flags: { barry_milo: true } } },
    { id: 's3', text: 'Ask Priya about the day the calf was moved', at: 'priya',
      done: { flags: { barry_priya: true } } },
    { id: 's4', text: 'Ask Dr Frost who was on the advisory board', at: 'frost',
      done: { flags: { barry_frost: true } } },
    /* `vaughn_gate`, not `vaughn`: the original despawns permanently once
       you roster him off the service stair, and doing that is a
       prerequisite for reaching this zone at all. See the note above his
       second post in data/npcs_ocean.js. */
    { id: 's5', text: 'Ask Vaughn for a vehicle movement record', at: 'vaughn_gate',
      done: { flags: { barry_vaughn: true } } },
    { id: 's6', text: 'Lay all five in front of Wren', at: 'wren_deep', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 200 },
    { type: 'addSkill', skill: 'discretion', amount: 1 }
  ],
  mainThread: true
};

/* --- TYPE 5: the graffiti ------------------------------------------
   Subversive quest. The steps deliberately never mention letters,
   sign-offs, or reading anything in order. */
SU.data.quests.q_deep_tags = {
  title: 'One to Nine',
  zone: 'the_deep', giver: 'ondine', type: 5,
  summary: 'Nine pieces of graffiti across a site with no guests on it, and somebody has gone to ' +
           'the trouble of numbering them. Nobody numbers graffiti.',
  steps: [
    { id: 's1', text: 'Find all nine numbered tags. Two of them are somewhere you cannot currently get to',
      where: 'The Deep · across the whole site, inside and out',
      done: { flags: { graf_1: true, graf_2: true, graf_3: true, graf_4: true, graf_5: true,
                       graf_6: true, graf_7: true, graf_8: true, graf_9: true } } },
    { id: 's2', text: 'Open the plant room door under the grandstand', at: 'deep_hatch',
      done: { flags: { hide_open: true } } },
    { id: 's3', text: 'Tell Ondine what you found down there', at: 'ondine', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 180 },
    { type: 'addSkill', skill: 'discretion', amount: 1 }
  ],
  mainThread: true
};

/* --- TYPE 3: the three measurements -------------------------------- */
SU.data.quests.q_deep_sounding = {
  title: 'Three Numbers',
  zone: 'the_deep', giver: 'sunil', type: 3,
  summary: 'The vet has made the argument twice and is now a man with a grievance rather than a ' +
           'clinician with data. He wants three measurements taken by somebody else: a depth, an ' +
           'echo and an abrasion.',
  steps: [
    { id: 's1', text: 'Earn Large Cetacean Handling (Husbandry 3, Observation 3, Veterinary 2)',
      where: 'Menu · Skills tab',
      done: { qualification: 'abyssal_cert' } },
    { id: 's2', text: 'Put Vesper\'s dive profile next to the depth of the pen', at: 'deep_vesper',
      done: { flags: { enc_sw_depth_solved: true } } },
    { id: 's3', text: 'Read what comes back at Halcyon off the walls, not what she sends',
      at: 'deep_halcyon',
      done: { flags: { enc_bw_call_solved: true } } },
    { id: 's4', text: 'Find the actual cause of Kirra\'s recurrent abrasions', at: 'deep_kirra',
      done: { flags: { enc_hb_pecs_solved: true } } },
    { id: 's5', text: 'Read the three numbers back to Sunil', at: 'sunil', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 170 },
    { type: 'addSkill', skill: 'observation', amount: 1 }
  ],
  mainThread: true
};

/* --- TYPE 5: the sanctuary, and the hard answer --------------------
   The thematic spine of the zone. Pip's step exists so that the case
   for the whales cannot be dismissed as reflex: a file that says
   "release everything" is a leaflet, and a file that says "these
   three need an ocean and this one needs a keeper" is an argument. */
SU.data.quests.q_deep_sanctuary = {
  title: 'Not Available for Disposal',
  zone: 'the_deep', giver: 'ondine', type: 5,
  summary: 'There is a real sanctuary with a real sea pen that has offered to take the whales at no ' +
           'cost and pay for the transport. Three times. Ondine wants the offer out of the hide, and ' +
           'she wants a defensible answer on the dugong before any of it goes anywhere.',
  steps: [
    { id: 's1', text: 'Read the folder on the desk under the stand', at: 'hide_sanctuary',
      done: { evidence: 'ev_sanctuary_offer' } },
    { id: 's2', text: 'Earn the Sirenian certificate and work Pip properly',
      at: 'deep_pip',
      done: { flags: { enc_dg_seagrass_solved: true } } },
    { id: 's3', text: 'Answer the question written in the margin of Pip\'s file', at: 'deep_pip',
      done: { flags: { enc_dg_stay_solved: true } } },
    { id: 's4', text: 'Give Ondine your answer on the dugong', at: 'ondine', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 190 },
    { type: 'addSkill', skill: 'veterinary', amount: 1 },
    { type: 'giveItem', id: 'survey_photos' }
  ],
  mainThread: true
};

/* --- TYPE 4: the night shift (TIMED) -------------------------------
   Runs on accumulated PLAY time, like the Zone 3 and Zone 4 timed
   quests, never wall clock, and the journal pauses the clock. There
   is NO fail state: missing the window costs the bonus and nothing
   else. Three jobs, one person, which is the whole point of it. */
SU.data.quests.q_deep_nightshift = {
  title: 'Three Things, One Person',
  zone: 'the_deep', giver: 'toby', type: 4,
  summary: 'The exchange pumps are going to drop out tonight and the alarm panel is muted, so ' +
           'nothing will tell anybody it happened. Toby has been doing two of the three jobs and ' +
           'choosing which one to skip.',
  timed: {
    playSeconds: 300,
    label: 'Before the level reaches the sill',
    onTime: [
      { type: 'addXP', amount: 70 },
      { type: 'addSuspicion', amount: -10 },
      { type: 'addTrust', species: 'sperm_whale', amount: 8 },
      { type: 'toast', text: 'All three, in one go. Toby did not have to choose.' }
    ]
  },
  steps: [
    { id: 's1', text: 'Reset the tripped exchange pump', at: 'night_pump',
      done: { flags: { night_pump_done: true } } },
    { id: 's2', text: 'Sound the deep hole and check Vesper is clear of the sill', at: 'night_hole',
      done: { flags: { night_hole_done: true } } },
    { id: 's3', text: 'Put the sea gate sluice into hold', at: 'night_sluice',
      done: { flags: { night_sluice_done: true } } }
  ],
  rewards: [
    { type: 'addXP', amount: 120 },
    { type: 'addSkillPoints', amount: 2 },
    { type: 'addSkill', skill: 'husbandry', amount: 1 }
  ]
};

/* --- TYPE 5: the reckoning, and the setup for the ending ----------- */
SU.data.quests.q_deep_reckoning = {
  title: 'The Version Nobody Else Got',
  zone: 'the_deep', giver: 'wren_deep', type: 5,
  summary: 'The animals, the site, the company and the man, all in one place at last. Barry Cuda is ' +
           'coming down here because he has been told about the auditor. Wren wants you to say ' +
           'nothing, show him nothing, and remember every word.',
  steps: [
    { id: 's1', text: 'Let him talk. Do not accuse him of anything and do not show him any paper',
      at: 'barry_deep',
      done: { flags: { barry_deep_done: true } } },
    { id: 's2', text: 'Go back to Wren while it is still exact', at: 'wren_deep', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 260 },
    { type: 'addSkillPoints', amount: 3 },
    { type: 'addSkill', skill: 'discretion', amount: 1 }
  ],
  mainThread: true
};
