/* ============================================================
   SEA UNIVERSE, ZONE 5 PROGRESSION: THE DEEP

   Evidence, qualifications, achievements and story beats for the
   final region. Appended to the tables in data/progression.js.

   TWO NOTES ON THE EVIDENCE BELOW

   1. The PR item `ev_phase_two_claim` is the biggest contradiction
      target in the game: the hoarding on the apron promises a natural
      sea sanctuary, and nine separate documents found on the same
      site say otherwise. That list is the payoff of the whole
      "spot the greenwashing" mechanic, so it is long on purpose.

   2. A lot of this zone's evidence is SAFETY evidence rather than
      animal welfare evidence, and it is filed as welfare anyway. That
      is deliberate. On this site the keeper walking an unlit walkway
      alone and the animal in the water underneath a live cable are
      the same failure, and splitting them into two categories would
      teach the wrong lesson.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

/* ---------- qualifications ---------- */
Object.assign(SU.data.qualifications, {

  /* The top certificate in the game. Deliberately expensive: it is the
     only gate on four of the five animals here, and by this point a
     student who has been buying skills has the points. Anyone who has
     not can still work Pip, log all twelve hazards, solve the word,
     and run the whole Barry thread, which is most of the zone. */
  abyssal_cert: {
    name: 'Large Cetacean Handling',
    blurb: 'Certified for work with great whales. The syllabus is mostly about knowing when to ' +
           'stand still, and about the fact that nothing you have been taught was written for ' +
           'animals this size.',
    req: { skill: { husbandry: 3, observation: 3, veterinary: 2 } }
  },

  /* Cheap on purpose. Pip is the animal whose case breaks the zone's
     pattern, so she has to be reachable early rather than being a
     reward for grinding. */
  sirenian_cert: {
    name: 'Sirenian Care',
    blurb: 'Certified for dugong work. A separate certificate from everything else in the park, ' +
           'because a seagrass specialist has almost nothing in common with a cetacean except ' +
           'that both of them breathe air.',
    req: { skill: { husbandry: 2, veterinary: 2 } }
  }
});

/* ---------- evidence ---------- */
Object.assign(SU.data.evidence, {

  /* --- the PR claim everything else in this zone argues with --- */
  ev_phase_two_claim: {
    type: 'pr', title: 'Phase Two: "A Natural Sea Sanctuary"',
    text: '"Our animals will live in a bay of real ocean water, on real tides, in an environment as ' +
          'close to the wild as human care can make it." Painted twelve feet high on a hoarding, ' +
          'facing a flooded quarry with a hole cut in the side of it.',
    contradictedBy: ['ev_halcyon_intake', 'ev_vesper_depth', 'ev_kirra_abrasion',
                     'ev_deep_net', 'ev_deep_alarm', 'ev_deferred_orders',
                     'ev_necropsy_reports', 'ev_sanctuary_offer', 'ev_gate_log'],
    conspiracy: true
  },

  /* --- animal findings, from the care sessions --- */
  ev_halcyon_intake: {
    type: 'welfare', title: 'Halcyon: Intake Against Target',
    text: 'A blue whale on 61% of a target that has itself been revised down twice this year. ' +
          'There is no krill supply in the country at the volume she needs, which means the ' +
          'shortfall is not a husbandry failure. It is the reason nobody has ever kept one.',
    conspiracy: true
  },
  ev_halcyon_acoustics: {
    type: 'welfare', title: 'Halcyon: Hydrophone Trace',
    text: 'The same call arriving at the hydrophone four times, milliseconds apart, off three rock ' +
          'faces and a concrete sill. A vocalisation built to cross an ocean, returning to the ' +
          'animal from six metres away. She stopped calling for nine days in March.'
  },
  ev_kirra_song: {
    type: 'welfare', title: 'Kirra: Three Seasons of Song',
    text: 'Eleven distinct phrases in season one. Four this season. Humpback song is learned and ' +
          'revised across a whole population every year, and she has been alone since she was two. ' +
          'The measurement is what makes it evidence rather than sentiment.',
    conspiracy: true
  },
  ev_kirra_abrasion: {
    type: 'welfare', title: 'Kirra: Recurrent Abrasion, Cause Known',
    text: 'Symmetrical wear on the leading edge of both pectoral fins, treated four times in ' +
          'fourteen months, filed each time as "cause unknown". Her fins span five metres. The ' +
          'north wall is quarried rock. The cause was never unknown, it was just never written down.',
    conspiracy: true
  },
  ev_vesper_depth: {
    type: 'welfare', title: 'Vesper: Dive Profile Against Enclosure',
    text: 'Forty dives to the floor of the pen in one morning, logged by the park as "diving ' +
          'enrichment behaviour". The pen is 11 m deep. Her species routinely works at 1,000 m ' +
          'and has been recorded past 2,000 m.',
    conspiracy: true
  },
  ev_kessa_transfer: {
    type: 'welfare', title: 'Kessa: Transferred for "Collection Balance"',
    text: 'Six weeks off feed after being moved out of a social group she had been part of for ' +
          'fourteen years. The stated reason on the transfer note is collection balance. False ' +
          'killer whale groups hold together for decades.',
    conspiracy: true
  },
  ev_kessa_sharing: {
    type: 'welfare', title: 'Kessa: Prey Sharing at the Rail',
    text: 'She carries a whole fish to the rail, places it, and waits until a person takes it. ' +
          'Logged by a new keeper as food rejection. It is prey sharing, a documented social ' +
          'behaviour of the species, and she is directing it at staff because there is nobody else.'
  },
  ev_pip_diet: {
    type: 'welfare', title: 'Pip: Five Months of Cos Lettuce',
    text: 'A seagrass specialist kept on lettuce and pellets since the seagrass supply contract ' +
          'lapsed in March. Every daily sheet in that period records that she ate. None of them ' +
          'record what.'
  },
  ev_pip_release: {
    type: 'welfare', title: 'Pip: Release Assessment',
    text: 'Hand raised from four months, nine years old, has never foraged and approaches boats ' +
          'without hesitation. Open release would kill her. The defensible recommendation is a ' +
          'managed seagrass lagoon with staff, and saying so is what makes the rest of the file ' +
          'worth reading.'
  },
  ev_the_acquisition: {
    type: 'welfare', title: '41-B: Photo Identification',
    text: 'Saddle patch and eye patch photographs of the young male orca in the north holding pen, ' +
          'matched against his transfer paperwork. He now has a documented identity, which makes ' +
          'him considerably harder to move quietly.',
    conspiracy: true
  },

  /* --- the Safety Register --- */
  ev_deep_handrail: {
    type: 'welfare', title: 'West Bench Handrail',
    text: 'Twenty metres of handrail over eleven metres of water, with corroded stanchions and a ' +
          'top rail that moves under load. It is the route the night keeper walks alone.'
  },
  ev_deep_mast: {
    type: 'welfare', title: 'Lighting Mast in the Pen',
    text: 'A collapsed lighting mast in the water, still connected, with contradictory isolation ' +
          'labelling at the two ends of the same circuit. One sign says isolated. The other says ' +
          'do not isolate.'
  },
  ev_deep_deckgap: {
    type: 'welfare', title: 'Main Spine: Missing Deck Sections',
    text: 'Three deck sections lifted out of the main walkway over the deepest water, with a work ' +
          'order raised and no date, and a temporary barrier tied off at one end only.'
  },
  ev_deep_lifering: {
    type: 'welfare', title: 'Life Ring Station: Empty, Signed',
    text: 'A rescue station with bracket, reel, instruction card, inspection tag and no life ring. ' +
          'The tag has been signed off monthly for seven months, most recently eleven days ago.',
    conspiracy: true
  },
  ev_deep_gate: {
    type: 'welfare', title: 'North Pen Gate: Failed Since March',
    text: 'The only access to the north holding pen, with a failed hydraulic ram, fluid on the ' +
          'walkway and a NOT IN SERVICE notice dated in March. One way in, one way out, and it ' +
          'does not work.'
  },
  ev_deep_net: {
    type: 'welfare', title: 'Sea Gate Net: Non-Specification Repair',
    text: 'A three metre square repair in the sea boundary net, in a lighter rope at a wider mesh ' +
          'than the original, laced in with cable ties. It is the only thing between the pen and ' +
          'the open Pacific.',
    conspiracy: true
  },
  ev_deep_lighting: {
    type: 'welfare', title: 'South Crosswalk: Eleven Lights Out',
    text: 'Eleven of fourteen walkway lights failed, with the three working ones at the shore end, ' +
          'so the dark section begins exactly where the walkway is furthest from anywhere a person ' +
          'could climb out.'
  },
  ev_deep_condemned: {
    type: 'welfare', title: 'Grandstand: Condemned By Nobody',
    text: 'A structure marked CONDEMNED with no engineer named, no report referenced and no date. ' +
          'The finding is not that the stair is unsafe. The finding is that a condemnation notice ' +
          'exists with nothing behind it.'
  },
  ev_deep_firstaid: {
    type: 'welfare', title: 'First Aid Point: Three Deficiencies',
    text: 'Missing burn dressings and sterile pads, eyewash a year out of date, oxygen cylinder ' +
          'reading in the red. The nearest ambulance access is through a gate that is bolted.'
  },
  ev_deep_winch: {
    type: 'financial', title: 'Sea Gate Winch: Inspection Cancelled',
    text: 'Statutory inspection certificate expired in January. A booking made in December for a ' +
          'February inspection. A printed cancellation email in the same wallet. Three documents ' +
          'that individually mean nothing.',
    conspiracy: true
  },
  ev_deep_alarm: {
    type: 'welfare', title: 'Plant Alarm Panel: Muted Since March',
    text: 'Level, flow, dissolved oxygen and chiller alarms muted since 14 March, with 3,100 events ' +
          'in the list behind it, and a note on the frame: "MUTED ON INSTRUCTION. RAISED 3x. I AM ' +
          'NOT TURNING THIS BACK ON WITHOUT IT IN WRITING."',
    conspiracy: true
  },

  /* --- documents --- */
  ev_lone_working: {
    type: 'financial', title: 'Night Handover Sheets',
    text: 'Three months of night handover sheets, every one signed by a single name, with the line ' +
          'headed SECOND PERSON PRESENT blank on all of them.'
  },
  ev_roster_vs_policy: {
    type: 'financial', title: 'The Roster and the Procedure',
    text: 'Fourteen consecutive single-person night shifts, pinned on the same wall as the park\'s ' +
          'own procedure requiring a second competent person for all waterside work at a deep-water ' +
          'facility. Both current. Both on display.',
    conspiracy: true
  },
  ev_resignation: {
    type: 'testimonial', title: 'The Unposted Resignation',
    text: 'Four lines, no name, no date, found in a cleared locker. Three of the lines are about ' +
          'the animals. The fourth is: "I am not going in that water on my own again."'
  },
  ev_deferred_orders: {
    type: 'financial', title: 'Forty-One Work Orders',
    text: 'Nine complete. Thirty-two raised, signed, costed and then stamped DEFERRED: CAPITAL' +
          'HOLD PENDING PHASE TWO. The oldest is fourteen months old and it is for the perimeter net.',
    conspiracy: true
  },
  ev_deep_plantlog: {
    type: 'financial', title: 'Plant Log: A Hundred and Forty Times',
    text: 'Four years of faultless twice-a-shift readings, and from 14 March one extra line at the ' +
          'bottom of every single entry: "ALARM PANEL REMAINS MUTED ON INSTRUCTION." Underlined. ' +
          'In the same pen. Every shift.',
    conspiracy: true
  },
  ev_stock_41b: {
    type: 'financial', title: 'Stock Sheet: 41-B',
    text: 'Eight days of daily records for a young male orca identified only by a number, with an ' +
          'arrival line naming a facility code that also appears in the Open Ocean movements folder. ' +
          'It is not a rescue centre.',
    conspiracy: true
  },
  ev_gate_log: {
    type: 'financial', title: 'Sea Gate Movement Log',
    text: 'Fourteen entries since commissioning. Twelve tests, one arrival, and one at 02:40 eight ' +
          'days ago with the reason given as "STOCK MOVEMENT: 41-B". A six tonne animal brought in ' +
          'through the sea gate in the dark, in forty minutes.',
    conspiracy: true
  },
  ev_necropsy_reports: {
    type: 'welfare', title: 'Six Post-Mortem Reports',
    text: 'Independent pathology, careful and unemotional. Four of the six list the same three ' +
          'contributing factors: enclosure dimensions, social isolation, chronic stress. The sixth ' +
          'is for an animal on no collection list, arrived and dead within eleven weeks, with a ' +
          'compliment slip attached: "Do not circulate."',
    conspiracy: true
  },
  ev_the_network: {
    type: 'testimonial', title: 'The Wall Under the Stand',
    text: 'Years of photographs, manifests and licence applications, organised, dated and cross ' +
          'referenced, and a park map with five pins in it and a name against each. One of the ' +
          'names is Sable. This was never one person with a spray can.',
    conspiracy: true
  },
  ev_sanctuary_offer: {
    type: 'financial', title: 'The Sanctuary Offer, Refused Three Times',
    text: 'A formal offer from an established marine sanctuary to receive the large cetaceans at no ' +
          'cost and fund the transport. Sent three times. The third reply is one line: "the ' +
          'collection is not available for disposal."',
    contradictedBy: ['ev_phase_two_claim'],
    conspiracy: true
  },

  /* --- the five cracks in Barry's story ---
     Each of these is one person repeating, in good faith, what he told
     them. None of them is lying. The contradiction only exists once you
     are holding all five, which is the entire point of the quest and the
     clearest statement of this game's teaching aim: a single source is
     a story, and five sources are a case. */
  ev_barry_dana: {
    type: 'testimonial', title: 'Dana: The Induction Pack',
    text: 'Barry handed her an induction pack describing the cove animals as rescues, citing a ' +
          'specific rescue by name. The pack is dated four months before that rescue happened. ' +
          'She kept it because she thought it was a nice document.',
    conspiracy: true
  },
  ev_barry_milo: {
    type: 'testimonial', title: 'Milo: The Birthday Party',
    text: 'Barry told a children\'s party that he personally swam with the first seal the park ever ' +
          'saved. Milo was standing next to him. That seal is in the studbook as captive born, and ' +
          'the story has been told to a hundred parties.'
  },
  ev_barry_priya: {
    type: 'testimonial', title: 'Priya: In a Meeting in Perth',
    text: 'On the day the calf was moved, Priya was told Barry was in a meeting in Perth and could ' +
          'not be reached. She has his signature on a transport authorisation, signed on site, ' +
          'dated that day.',
    conspiracy: true
  },
  ev_barry_frost: {
    type: 'testimonial', title: 'Frost: The Advisory Board',
    text: 'Dr Frost was overruled by a veterinary advisory board. She asked for the members\' names ' +
          'in writing, twice. What came back was a letterhead with no names on it, and no reply to ' +
          'the second request.',
    conspiracy: true
  },
  /* The fifth Barry beat, and the only thing in the game he says without
     a footnote behind it. Filed as testimonial rather than PR because
     for once it is not a claim, it is him. */
  ev_barry_admission: {
    type: 'testimonial', title: 'Barry Cuda, on the Slipway',
    text: '"Nobody has ever held a blue whale. Nobody. And I have one." And, of the sanctuary\'s ' +
          'funded offer to take all five animals at no cost: "the collection is not available for ' +
          'disposal. I wrote that sentence. It is the truest one in this entire business." He was ' +
          'not angry and he did not deny anything, because he had decided it did not matter.',
    contradictedBy: ['ev_phase_two_claim'],
    conspiracy: true
  },
  ev_barry_vaughn: {
    type: 'testimonial', title: 'Vaughn: The Gate Log',
    text: 'Security gate records place Barry\'s vehicle on site three times in a fortnight he told ' +
          'the trust he was overseas. Vaughn produced them without hesitation, because to Vaughn a ' +
          'gate log is a gate log and it does not matter whose car it is.',
    conspiracy: true
  }
});

/* ---------- achievements ---------- */
Object.assign(SU.data.achievements, {
  the_deep_end:    { name: 'The Deep',             desc: 'Reach the part of the park that is not on the map.', xp: 60 },
  the_word:        { name: 'One to Nine',          desc: 'Read the graffiti in the right order and open the hide.', xp: 90 },
  register_keeper: { name: 'The Register',         desc: 'Log eight defects into the Safety Register.', xp: 70 },
  full_register:   { name: 'All Twelve',           desc: 'Log every defect in The Deep.', xp: 110 },
  got_it_fixed:    { name: 'Somebody Fixed It',    desc: 'Get three logged defects actually repaired.', xp: 80 },
  nine_years:      { name: 'Nine Years of Barry',  desc: 'Collect all five accounts of the same man.', xp: 120 },
  knows_baseline:  { name: 'Knows the Baseline',   desc: 'Correctly identify normal behaviour instead of raising an alarm.', xp: 45 },
  hard_answer:     { name: 'The Hard Answer',      desc: 'Recommend against release, for the right reasons.', xp: 60 },
  named_him:       { name: 'Not a Number',         desc: 'Give the animal in the north holding pen a documented identity.', xp: 75 },
  abyssal:         { name: 'Out of Your Depth',    desc: 'Earn Large Cetacean Handling.', xp: 60 },
  dex_twenty:      { name: 'The Whole Collection', desc: 'Discover twenty species.', xp: 90 }
});

/* State achievements: things that are a CONDITION rather than an event,
   so there is no single place an effect could award them from. */
SU.data.achievementRules.push(
  { id: 'register_keeper', when: { hazardCount: { min: 8  } } },
  { id: 'full_register',   when: { hazardCount: { min: 12 } } },
  { id: 'got_it_fixed',    when: { hazardCount: { min: 3, repaired: true } } },
  { id: 'abyssal',         when: { qualification: 'abyssal_cert' } },
  { id: 'nine_years',      when: { evidence: ['ev_barry_dana', 'ev_barry_milo', 'ev_barry_priya',
                                              'ev_barry_frost', 'ev_barry_vaughn'] } },

  /* Solving a care encounter is an EVENT, but the care engine has no
     per-encounter effects list, so these read the state it leaves
     behind instead. All three are the zone's "the obvious answer is the
     wrong one" cases, and they are worth calling out by name. */
  { id: 'knows_baseline',  when: { species: { sperm_whale: { solved: 'sw_sleep'        } } } },
  { id: 'hard_answer',     when: { species: { dugong:      { solved: 'dg_stay'         } } } },
  { id: 'named_him',       when: { species: { orca:        { solved: 'or_acquisition'  } } } }
);

/* ---------- story beats ---------- */
SU.data.storyBeats.push(
  {
    id: 'deep_found',
    title: 'Not on the Guest Map',
    zone: 'The Deep',
    summary: 'A steel door in the west wall of the plant room under Open Ocean, and then daylight, ' +
             'and then a flooded quarry with the sea let into it. Four thousand empty seats, one ' +
             'hoarding promising a sanctuary, and five animals nobody should have been able to get.',
    when: { zoneVisited: 'the_deep' }
  },
  {
    id: 'deep_register',
    title: 'A Pattern, Not a Complaint',
    zone: 'The Deep',
    summary: 'Twelve defects, each of them individually arguable: a handrail, a light, an empty ' +
             'bracket. Written down together, dated and signed, they stopped being a list of ' +
             'grumbles and became the thing an inspector is allowed to act on.',
    when: { hazardCount: { min: 8 } }
  },
  {
    id: 'deep_sanctuary',
    title: 'Not Available for Disposal',
    zone: 'The Deep',
    summary: 'A real sanctuary with a real sea pen offered to take the whales at no cost and pay ' +
             'for the transport. Three times. The third refusal was one line long and used the ' +
             'word disposal.',
    when: { evidence: 'ev_sanctuary_offer' }
  },
  {
    id: 'deep_nine_years',
    title: 'Nine Years of Barry',
    zone: 'The Deep',
    summary: 'Five people, none of them lying, each repeating what he told them. An induction pack ' +
             'dated before its own rescue. A meeting in Perth on a day he signed a form on site. ' +
             'An advisory board with no members. Held apart they are anecdotes. Held together they ' +
             'are a habit.',
    when: {
      evidence: ['ev_barry_dana', 'ev_barry_milo', 'ev_barry_priya',
                 'ev_barry_frost', 'ev_barry_vaughn']
    }
  },
  {
    id: 'deep_41b',
    title: 'Stock Movement, 02:40',
    zone: 'The Deep',
    summary: 'The acquisition the Open Ocean board pack was waiting on, brought in through the sea ' +
             'gate in the dark and written up as stock movement. A young male orca with a number ' +
             'instead of a name, in the one pen on the site with a gate that does not open.',
    when: { evidence: 'ev_gate_log' }
  }
);
