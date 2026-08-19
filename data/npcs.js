/* ============================================================
   SEA UNIVERSE: NPCs

   `dialogue` is an ORDERED list. The first entry whose `when`
   condition passes is the one that plays. Put the most specific
   entries first and finish with a `when`-less fallback.

     {
       when:    { ...condition... },      // optional
       lines:   [ 'first line', 'second line' ],
       choices: [ { text, effects, reply, condition } ],   // optional
       onEnd:   [ ...effects... ]         // optional, fires when talk closes
     }

   This is the `dialogue_by_stage` field from our design doc, it just
   uses the same condition language as everything else, so it can key off
   story stage, quest state, flags, suspicion, items, anything.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

SU.data.npcs = {

  /* ---------------------------------------------------------
     WREN HALLORAN, the Handler (ex-trainer, now on the outside)
     Poses as a regular visitor near the plaza.
     --------------------------------------------------------- */
  wren: {
    name: 'Wren Halloran', role: 'Handler', zone: 'coastal_cove',
    place: 'the south promenade',
    x: 24, y: 22, colour: '#b6d7c4', reactsToSuspicion: false,
    // loiters like someone pretending to enjoy a day out
    movement: { type: 'wander', radius: 2.5, speed: 0.8, pause: [2, 5] },
    dialogue: [
      {
        when: { flags: { met_wren: false } },
        lines: [
          'A visitor in a sun hat is feeding chips to a gull with real dedication.',
          'WREN: Don\'t stop walking. Just look at the gull.',
          'WREN: I worked this cove for nine years. I know every drain, every door and every excuse they use.',
          'WREN: You do the job. Do it well. Genuinely well, the animals deserve that. But keep your eyes open.',
          'WREN: Anything that doesn\'t add up goes in your notebook. Come find me when you have something.'
        ],
        onEnd: [
          { type: 'setFlag', flag: 'met_wren', value: true },
          { type: 'setStoryStage', stage: 1 },
          { type: 'addXP', amount: 20 },
          { type: 'toast', text: 'Wren is your contact. Bring her evidence.' }
        ]
      },
      {
        /* Briefing for Zone 2. Sits above the manifest entry, but can only
           fire after it: you cannot reach Coral Kingdom until she opens it. */
        when: { zoneVisited: 'coral_kingdom', flags: { wren_reef_briefed: false } },
        lines: [
          'WREN: You have been up to the reef complex. Good. Now listen, because I am only saying this once.',
          'WREN: There is a service corridor behind the reef hall. Maintenance door, north side, past the mangrove planting.',
          'WREN: Everything the park does not want on the public map runs through there. Pumps, paperwork, the records room.',
          'WREN: Halfway along it there is a wall panel with one screw missing. That is a drop. You leave copies, I collect them.',
          'WREN: You will need a key. Do not ask me for one. Ask the people who already have one and like you.'
        ],
        onEnd: [
          { type: 'setFlag', flag: 'wren_reef_briefed', value: true },
          { type: 'addXP', amount: 25, once: 'wren_reef_brief' },
          { type: 'toast', text: 'Dead drop location noted.', once: 'wren_reef_brief' }
        ]
      },
      {
        when: { evidence: 'ev_transfer_manifest' },
        lines: [
          'WREN: A transfer manifest. Captive-born, both of them.',
          'WREN: Their brochure says every animal here is a rescue that can\'t go home.',
          'WREN: Two documents, one lie. That\'s how this works: you don\'t catch them lying, you catch them contradicting themselves.',
          'WREN: Keep collecting. When you have enough of these, we can do something with it.'
        ],
        // This entry stays available (she should always have something to say
        // about the manifest) so the payout is claim-gated instead.
        onEnd: [
          { type: 'setFlag', flag: 'zone_coral_unlocked', value: true },
          { type: 'setStoryStage', stage: 2 },
          { type: 'addXP', amount: 60, once: 'wren_manifest' },
          { type: 'toast', text: 'Coral Kingdom access approved.', once: 'wren_manifest' }
        ]
      },
      {
        lines: [
          'WREN: Nothing new? Then go be a good employee for a while. That\'s not sarcasm: a trusted trainer gets left alone.',
          'WREN: Talk to people. Read the signage. Compare what they print to what you see.'
        ]
      }
    ]
  },

  /* ---------------------------------------------------------
     DANA REYES, Zone Manager, Coastal Cove
     Owns the Zone Mystery. Can eventually be swayed by evidence.
     --------------------------------------------------------- */
  dana: {
    name: 'Dana Reyes', role: 'Trainer-Manager', zone: 'coastal_cove',
    at: 'seal_pool_edge',
    x: 27, y: 11, colour: '#e0a458', reactsToSuspicion: true,
    // walks the length of her pool deck, checking on things
    movement: {
      type: 'patrol', speed: 1.25, pause: [1.5, 3],
      points: [{ x: 25, y: 11 }, { x: 33, y: 11 }, { x: 33, y: 10 }, { x: 26, y: 10 }]
    },
    dialogue: [
      /* ---- NINE YEARS OF BARRY (quest q_deep_barry, Zone 5) ----
         One of five, and FIRST IN THE LIST on purpose. Dialogue takes
         the first entry whose `when` matches, so a revisit conversation
         placed at the bottom is unreachable: this character's own zone
         entries always match before it. Every one of the five sits at
         the top of its character's list for that reason.

         It is safe there because it is gated on a quest that only
         exists in Zone 5, plus a flag it sets itself.

         The rule for all five: the character is NOT suspicious, is NOT
         hiding anything, and is repeating in good faith what Barry told
         them. The contradiction only exists once the player is holding
         all five, and no single one of these should feel like a
         revelation on its own. */
      {
        when: { quest: { q_deep_barry: 'active' }, flags: { barry_dana: false } },
        lines: [
          'DANA: Barry? God, why. Sorry. Yes. What about him.',
          'DANA: He gave me my induction pack personally. First day. I thought that was lovely, ' +
            'actually, I still sort of do.',
          'She goes and gets it out of a drawer. It is laminated and it has been kept carefully.',
          'DANA: There. "Every animal in this cove is a rescue that cannot be returned to the wild." ' +
            'And he read that bit out to me, and then told me the story about the Nannup rescue like ' +
            'he had been there.',
          'DANA: Why are you looking at the date.',
          'She looks at the date.',
          'DANA: That is four months before Nannup.',
          'DANA: No, hang on. That will be a reprint. They reprint these. That is all that is.',
          'DANA: ...There is a print run number on the back. It says one of one.',
          'She puts it down, and then picks it up again, and hands it to you without saying anything else.'
        ],
        onEnd: [
          { type: 'addEvidence', id: 'ev_barry_dana' },
          { type: 'setFlag', flag: 'barry_dana', value: true },
          { type: 'addXP', amount: 70 }
        ]
      },
      {
        when: { quest: { q_deep_barry: 'active' }, flags: { barry_dana: true } },
        lines: [
          'DANA: I have had that pack on my desk for six years.',
          'DANA: Do not tell me what it is part of. I would honestly rather not know until somebody ' +
            'makes me.'
        ]
      },
      {
        when: { quest: { q_cove_induction: 'not_started' } },
        lines: [
          'DANA: You\'re the new one. Good. I\'m short-staffed and long-tempered.',
          'DANA: Rule one at this pool: you observe before you act. Every time.',
          'DANA: Pearl, the harbour seal, has been off her food three days. I want a second pair of eyes before I escalate it.',
          'DANA: Grab your lanyard from the staff block, get your basic certification, then run a session with her.'
        ],
        onEnd: [
          { type: 'startQuest', id: 'q_cove_induction' },
          { type: 'discoverSpecies', id: 'harbor_seal' }
        ]
      },
      {
        when: { quest: { q_cove_induction: 'active' }, not: { qualification: 'pinniped_basic' } },
        lines: [
          'DANA: Lanyard first, then certification. I\'m not putting an uncertified trainer on my deck.',
          'DANA: Put one point into Husbandry. Open the Menu, the Skills tab. Then you\'re cleared for pinnipeds.'
        ]
      },
      {
        when: { quest: { q_cove_induction: 'active' } },
        lines: [
          'DANA: Certified. Go and see Pearl, and tell me what you actually see, not what you expect to see.'
        ]
      },
      {
        when: { quest: { q_cove_induction: 'completed' }, flags: { dana_debrief: false } },
        lines: [
          'DANA: Dental. You\'re sure? ... No, you\'re right. One-sided chewing. I should have caught it.',
          'DANA: I\'ve been asking for a vet visit for two weeks. The request keeps getting bounced back marked "non-urgent".',
          'DANA: Anyway. Good work. Take this. You\'ll need it more than the supply cupboard does.'
        ],
        onEnd: [
          { type: 'setFlag', flag: 'dana_debrief', value: true },
          { type: 'giveItem', id: 'enrichment_kit' },
          { type: 'addSkillPoints', amount: 1 },
          { type: 'addXP', amount: 40 },
          { type: 'setFlag', flag: 'otter_access', value: true },
          { type: 'toast', text: 'Dana has given you otter habitat access.' }
        ]
      },
      {
        when: { suspicion: { min: 50 } },
        lines: [
          'DANA: I\'ve had two people ask me where you keep disappearing to.',
          'DANA: I don\'t care what you\'re doing. I care that it looks like something. Be visible for a while.'
        ]
      },
      {
        lines: [
          'DANA: Pool\'s running. Records are up to date. That\'s about as good as a day gets around here.'
        ]
      }
    ]
  },

  /* ---------------------------------------------------------
     MILO TRAN, fellow trainer, friendly peer
     Quest type 1: scavenger hunt.
     --------------------------------------------------------- */
  milo: {
    name: 'Milo Tran', role: 'Trainer-Peer', zone: 'coastal_cove',
    at: 'sealion_stage',
    x: 10, y: 11, colour: '#7fc7b3', reactsToSuspicion: true,
    movement: {
      type: 'patrol', speed: 1.4, pause: [0.8, 2],
      points: [{ x: 6, y: 11 }, { x: 12, y: 11 }, { x: 12, y: 10 }, { x: 6, y: 10 }]
    },
    dialogue: [
      /* ---- NINE YEARS OF BARRY, two of five. First in the list, see
         the note on Dana. Milo's is the harmless one, and it is in the
         set precisely because it is harmless: it is the story a person
         tells at a party, and it is the same shape as the other four. */
      {
        when: { quest: { q_deep_barry: 'active' }, flags: { barry_milo: false } },
        lines: [
          'MILO: Barry stories? Mate, I have got one and it is a good one.',
          'MILO: Kid\'s birthday party, function room, about two years ago. He does the walk-through, ' +
            'shakes everyone\'s hand, and he tells them about swimming with the first seal this park ' +
            'ever rescued. Really tells it. The water was freezing, she came right up to him, all of it.',
          'MILO: Twenty kids, dead silent. Best thing I have ever seen anybody do with a microphone.',
          'MILO: What.',
          'MILO: ...Which seal.',
          'He works it out somewhere around the middle of the sentence and stops talking.',
          'MILO: The first one. That is Bindi. Bindi is in the studbook. Bindi was BORN here, in the ' +
            'old pool. I have seen the entry. I have literally shown it to students.',
          'MILO: He has told that story a hundred times. I have heard him do it at least nine.',
          'MILO: And the thing is, he tells it really well, which is why nobody ever goes and checks.'
        ],
        onEnd: [
          { type: 'addEvidence', id: 'ev_barry_milo' },
          { type: 'setFlag', flag: 'barry_milo', value: true },
          { type: 'addXP', amount: 70 }
        ]
      },
      {
        when: { quest: { q_deep_barry: 'active' }, flags: { barry_milo: true } },
        lines: [
          'MILO: I keep thinking about the kids at that party.',
          'MILO: Some of them will be about fifteen now. They will still think that happened.'
        ]
      },
      {
        when: { quest: { q_cove_seaglass: 'not_started' } },
        lines: [
          'MILO: Oh good, a person who has to talk to me because we work together.',
          'MILO: Listen. I make enrichment toys on my own time. Management calls it "unapproved apparatus".',
          'MILO: I need sea glass. Three pieces. Rock pools, drains, bins: anywhere water pools and people are careless.',
          'MILO: Bring them back and I\'ll make you something useful.'
        ],
        onEnd: [{ type: 'startQuest', id: 'q_cove_seaglass' }]
      },
      {
        when: { quest: { q_cove_seaglass: 'active' }, hasItems: { sea_glass: 3 } },
        lines: [
          'MILO: Three! Look at that. Right, hand them over.',
          'MILO: Give me a day and Pearl gets a puzzle feeder that isn\'t a bucket with a hole in it.'
        ],
        choices: [
          {
            text: 'Hand over the sea glass',
            effects: [
              { type: 'takeItem', id: 'sea_glass', qty: 3 },
              { type: 'completeQuest', id: 'q_cove_seaglass' }
            ],
            reply: ['MILO: You\'re alright. Here, take the spare whistle. You\'ll need one anyway.']
          },
          { text: 'Not yet, actually', effects: [], reply: ['MILO: Fair. They\'re not going anywhere.'] }
        ]
      },
      {
        when: { quest: { q_cove_seaglass: 'active' } },
        lines: ['MILO: Three pieces of sea glass. Check the rock pool by the south fence, that one always has something.']
      },
      {
        when: { quest: { q_cove_bruno: 'not_started' }, qualification: 'pinniped_basic' },
        lines: [
          'MILO: Actually, while you\'re here. Bruno.',
          'MILO: He rehearses fine and then plants himself in the holding pool at showtime. Won\'t budge.',
          'MILO: Stadium team says he\'s being difficult. I don\'t think animals are ever "being difficult", I think we\'re missing something.',
          'MILO: Have a look at him for me? You\'ve got fresher eyes.'
        ],
        onEnd: [
          { type: 'startQuest', id: 'q_cove_bruno' },
          { type: 'discoverSpecies', id: 'california_sea_lion' }
        ]
      },
      {
        when: { quest: { q_cove_bruno: 'completed' } },
        lines: [
          'MILO: The sound system. Of course it\'s the sound system.',
          'MILO: I\'ve written it up. Watch how fast that gets marked non-urgent too.'
        ]
      },
      { lines: ['MILO: Twelve more feeds and then I get to go home and think about feeds.'] }
    ]
  },

  /* ---------------------------------------------------------
     SABLE NGUYEN, the subversive (quest type 5)
     Former volunteer, now hands out leaflets at the gate.
     --------------------------------------------------------- */
  sable: {
    name: 'Sable Nguyen', role: 'Subversive', zone: 'coastal_cove',
    at: 'kiosk_counter',
    x: 16, y: 22, colour: '#c98bb9', reactsToSuspicion: false,
    // works the entrance, back and forth, leafleting
    movement: { type: 'wander', radius: 2, speed: 0.95, pause: [1.5, 3.5] },
    dialogue: [
      {
        when: { flags: { met_sable: false } },
        lines: [
          'SABLE: You\'ve got the lanyard on, so you\'ll walk past me like the others do. That\'s fine.',
          'SABLE: I volunteered here for two years. I loved it. That\'s why I stand out here now.',
          'SABLE: Ask yourself one question while you work: if every animal here is a rescue that cannot survive in the wild ...',
          'SABLE: ... then why does this park have a breeding programme at all?'
        ],
        onEnd: [
          { type: 'setFlag', flag: 'met_sable', value: true },
          { type: 'addXP', amount: 15 }
        ]
      },
      {
        when: { quest: { q_cove_manifest: 'not_started' }, evidence: 'ev_brochure_claim' },
        lines: [
          'SABLE: You\'ve read the brochure. "Rescue and conservation facility first."',
          'SABLE: There\'s a transfer manifest on the roster board clipboard in the staff block. Number 4471.',
          'SABLE: I can\'t get in there any more. You can. Just read it. That\'s all I\'m asking.'
        ],
        onEnd: [{ type: 'startQuest', id: 'q_cove_manifest' }]
      },
      {
        when: { evidence: 'ev_transfer_manifest' },
        lines: [
          'SABLE: Captive-born. Sold on. And they still print the word "rescue" on the front door.',
          'SABLE: I\'m not asking you to burn the place down. I\'m asking you to keep reading.'
        ],
        onEnd: [
          { type: 'addEvidence', id: 'ev_sable_testimony' },
          { type: 'completeQuest', id: 'q_cove_manifest' }
        ]
      },
      { lines: ['SABLE: Take a leaflet. Or don\'t. The animals can\'t hand them out themselves.'] }
    ]
  },

  /* ---------------------------------------------------------
     VISITORS, side quests, incidental teaching
     --------------------------------------------------------- */
  ollie: {
    name: 'Ollie (visitor)', role: 'Visitor', zone: 'coastal_cove',
    at: 'otter_deck',
    x: 31, y: 15, colour: '#f2d16b', reactsToSuspicion: false,
    // a child: fast, wide-ranging, never still for long
    movement: { type: 'wander', radius: 3.5, speed: 1.9, pause: [0.3, 1.2] },
    dialogue: [
      {
        when: { quest: { q_cove_ollie: 'not_started' } },
        lines: [
          'OLLIE: Are you a real trainer? My sister says otters are just water cats.',
          'OLLIE: She\'s WRONG though. Right? Tell me something about otters that will destroy her.'
        ],
        choices: [
          { text: '"Give me a minute. I\'ll find you a proper fact."',
            effects: [{ type: 'startQuest', id: 'q_cove_ollie' }],
            reply: ['OLLIE: YES. Make it a good one.'] }
        ]
      },
      {
        when: { quest: { q_cove_ollie: 'active' }, species: { sea_otter: { discovered: true } } },
        lines: ['OLLIE: Did you get one? Did you get a fact?'],
        choices: [
          { text: '"They have no blubber: a million hairs per square inch instead."',
            effects: [{ type: 'completeQuest', id: 'q_cove_ollie' }],
            reply: [
              'OLLIE: A MILLION.',
              'OLLIE: That\'s why they\'re always doing this (frantic rubbing motion). They\'re fixing their coat!',
              'OLLIE: Here, have my spare pin. I have four.'
            ] },
          { text: '"They\'re basically water cats, honestly."',
            effects: [{ type: 'addSuspicion', amount: 1 }],
            reply: ['OLLIE: ...I am telling my sister a trainer said that.'] }
        ]
      },
      {
        when: { quest: { q_cove_ollie: 'active' } },
        lines: ['OLLIE: Still waiting! Go and LOOK at one!']
      },
      { lines: ['OLLIE: A MILLION HAIRS. I\'m telling everyone.'] }
    ]
  },

  nan: {
    name: 'Nan Whitlock (visitor)', role: 'Visitor', zone: 'coastal_cove',
    place: 'the main path',
    x: 22, y: 14, colour: '#d9a3a3', reactsToSuspicion: false,
    // unhurried, stops often
    movement: { type: 'wander', radius: 1.5, speed: 0.55, pause: [3, 7] },
    dialogue: [
      {
        when: { quest: { q_cove_photo: 'not_started' } },
        lines: [
          'NAN: Excuse me, dear. You work here, don\'t you.',
          'NAN: My granddaughter has run off to the seal pool and I promised her mother a photograph of the two of us.',
          'NAN: I have a camera the size of a brick and hands like a seagull. Would you take it for us?'
        ],
        choices: [
          { text: '"Of course. I\'ll need a camera though."',
            effects: [{ type: 'startQuest', id: 'q_cove_photo' }],
            reply: ['NAN: The kiosk sells them. Robbery, but they sell them.'] },
          { text: '"Sorry, I\'m on shift."', effects: [], reply: ['NAN: Of course. You look busy, dear.'] }
        ]
      },
      {
        when: { quest: { q_cove_photo: 'active' }, hasItems: { camera: 1 } },
        lines: ['NAN: Oh, marvellous. Right, she\'s by the railing. Try to get the water in.'],
        choices: [
          { text: 'Take the photo',
            effects: [
              { type: 'setFlag', flag: 'photo_taken', value: true },
              { type: 'completeQuest', id: 'q_cove_photo' }
            ],
            reply: [
              'NAN: Perfect. Look at her face.',
              'NAN: I came here as a girl, you know. There was one pool and a man with a bucket.',
              'NAN: They said the same things then. "Rescued." "Couldn\'t survive out there." Funny how none of them ever go back out there.'
            ] }
        ]
      },
      {
        when: { quest: { q_cove_photo: 'active' } },
        lines: ['NAN: Still hunting for a camera? The kiosk, dear. By the south path.']
      },
      { lines: ['NAN: She hasn\'t stopped talking about that seal.'] }
    ]
  },

  /* ---------------------------------------------------------
     BARRY C., the CEO. Appearance #1: full PR mode.
     Appears once you're actually working (story stage 1+).
     --------------------------------------------------------- */
  barry: {
    name: 'Barry C.', role: 'CEO', zone: 'coastal_cove',
    place: 'the plaza',
    x: 20, y: 18, colour: '#4a6fa5', reactsToSuspicion: true,
    spawnCondition: { storyStage: { min: 1 }, flags: { barry_gone_1: false } },
    // surveys the plaza at an unhurried, proprietorial pace
    movement: {
      type: 'patrol', speed: 0.7, pause: [2, 4], loop: 'pingpong',
      points: [{ x: 19, y: 16 }, { x: 20, y: 19 }]
    },
    dialogue: [
      {
        when: { flags: { met_barry: false } },
        lines: [
          'A tall man in a very good jacket is watching the plaza with his hands behind his back.',
          'BARRY: New face! Marvellous. Barry, just Barry, none of the surname business, we\'re all family here.',
          'BARRY: Do you know what makes Sea Universe different? Purpose. Every animal in this park is here because it could not survive out there.',
          'BARRY: We are a conservation organisation that happens to sell ice creams. Never the other way round.',
          'BARRY: Look after them. And smile: people came a long way to feel good today.'
        ],
        onEnd: [
          { type: 'setFlag', flag: 'met_barry', value: true },
          { type: 'achievement', id: 'met_barry' },
          { type: 'addXP', amount: 25 },
          { type: 'toast', text: 'Barry heads back toward the admin block.' },
          { type: 'setFlag', flag: 'barry_gone_1', value: true }
        ]
      },
      { lines: ['BARRY: Keep smiling!'] }
    ]
  },

  /* ===========================================================
     ZONE 2: CORAL KINGDOM
     =========================================================== */

  /* ---------------------------------------------------------
     PRIYA RAMAN, Head Dolphin Trainer. The zone's Dana:
     genuinely excellent at her job, genuinely invested in the
     animals, and genuinely unwilling to look at the paperwork.
     --------------------------------------------------------- */
  priya: {
    name: 'Priya Raman', role: 'Head Dolphin Trainer', zone: 'coral_kingdom',
    at: 'dolphin_deck',
    x: 18, y: 20, colour: '#4fb0c6', reactsToSuspicion: true,
    movement: {
      type: 'patrol', speed: 1.3, pause: [1.5, 3],
      points: [{ x: 10, y: 20 }, { x: 24, y: 20 }, { x: 24, y: 19 }, { x: 11, y: 19 }]
    },
    dialogue: [
      /* ---- NINE YEARS OF BARRY, three of five. First in the list, see
         the note on Dana. Priya's is the one where the character does
         the reasoning themselves and does not like where it goes. She
         is a manager who has already been turned once, so she gets
         there fastest. */
      {
        when: { quest: { q_deep_barry: 'active' }, flags: { barry_priya: false } },
        lines: [
          'PRIYA: The day they moved the calf.',
          'PRIYA: I rang his office at ten past seven in the morning and I rang it every hour until ' +
            'four. I was told he was in a meeting in Perth and could not be reached, and I remember ' +
            'being angry about the word "reached", because everybody can be reached.',
          'PRIYA: Why.',
          'She stops.',
          'PRIYA: The transport authorisation.',
          'She goes to a filing cabinet and comes back with it, and she is already reading it before ' +
            'she sits down.',
          'PRIYA: Signed. Wet ink, not a scan. Signed at this site. That date.',
          'PRIYA: He was here. He was HERE, in this building, on the day I was ringing an office in ' +
            'Perth every hour, and somebody in that office knew it, because somebody told me he was ' +
            'in a meeting.',
          'PRIYA: Take it. Photocopy it, take the copy, leave the original in the cabinet where it is ' +
            'supposed to be, and do not tell me what you are doing with it.',
          'PRIYA: I asked for a visual barrier eleven times in four years. This is the first time I ' +
            'have found something I could hand to somebody.'
        ],
        onEnd: [
          { type: 'addEvidence', id: 'ev_barry_priya' },
          { type: 'setFlag', flag: 'barry_priya', value: true },
          { type: 'addXP', amount: 80 }
        ]
      },
      {
        when: { quest: { q_deep_barry: 'active' }, flags: { barry_priya: true } },
        lines: [
          'PRIYA: The original is still in the cabinet. I checked twice yesterday.',
          'PRIYA: I am aware of how that sounds. I checked anyway.'
        ]
      },
      {
        when: { quest: { q_reef_induction: 'not_started' } },
        lines: [
          'PRIYA: You are the one Dana sent up. She says you observe before you act. We will see.',
          'PRIYA: Four dolphins. Nyari, Bindi, Marlow and Tuk. I have known three of them since they were born, ' +
            'in that lagoon, which I am aware is a sentence with something in it.',
          'PRIYA: Nyari came up with rake marks on Friday. Fresh ones.',
          'PRIYA: Get your Cetacean Handling ticket, put a point into Training, then run a proper session with her ' +
            'and tell me what you think is happening. Not what you have read. What you think.'
        ],
        onEnd: [
          { type: 'startQuest', id: 'q_reef_induction' },
          { type: 'discoverSpecies', id: 'bottlenose_dolphin' }
        ]
      },
      {
        when: { quest: { q_reef_induction: 'active' }, not: { qualification: 'cetacean_basic' } },
        lines: [
          'PRIYA: Ticket first. Cetacean Handling I: one point of Training in the Menu and it is yours.',
          'PRIYA: Dolphin work is all consent. You ask, they answer, and sometimes the answer is no. ' +
            'If you cannot hear "no" you are not training, you are just making an animal do something.'
        ]
      },
      {
        when: { quest: { q_reef_induction: 'active' } },
        lines: ['PRIYA: Nyari is at the deep end, away from the others. That is the first thing you should notice.']
      },
      {
        when: { quest: { q_reef_induction: 'completed' }, flags: { priya_debrief: false } },
        lines: [
          'PRIYA: Nowhere to go. ... Yes. I know.',
          'PRIYA: I have put in for a visual barrier and a second holding pool eleven times in four years. ' +
            'The last response said the lagoon "meets or exceeds all applicable standards", which it does. ' +
            'The standard is the problem.',
          'PRIYA: Right. You can see, so you are useful. Dr Sato is drowning in the rehab unit and I am ' +
            'authorising you onto her roster.',
          'PRIYA: Do not make me regret it, and do not repeat what I said about the standard.'
        ],
        onEnd: [
          { type: 'setFlag', flag: 'priya_debrief', value: true },
          { type: 'setFlag', flag: 'turtle_access', value: true },
          { type: 'setStoryStage', stage: 3 },
          { type: 'addSkillPoints', amount: 1 },
          { type: 'addXP', amount: 50 },
          { type: 'toast', text: 'Rehabilitation Unit access approved.' }
        ]
      },
      {
        when: { evidence: 'ev_dolphin_studbook' },
        lines: [
          'PRIYA: Where did you ... no. Do not tell me where.',
          'PRIYA: Fourteen births. I was at eleven of them. I have hand-fed calves at three in the morning ' +
            'and I have watched two of them leave in a truck.',
          'PRIYA: I am not going to pretend I did not know. I am going to say that knowing and being able ' +
            'to do anything are different things, and then I am going to go and do my job.',
          'PRIYA: ... The fifth one was called Ripple. Nobody wrote that down anywhere. Write it down.'
        ]
      },
      {
        when: { suspicion: { min: 50 } },
        lines: [
          'PRIYA: You have been seen in places you have no roster reason to be.',
          'PRIYA: I do not care. Margo cares. Margo is the one you should worry about, and Margo talks to Barry.'
        ]
      },
      {
        lines: [
          'PRIYA: Water is on, animals are up, nobody has cried yet. That is a good morning.',
          'PRIYA: Watch Tuk when he thinks nobody is looking. He plays. Actual play, with nobody paying him for it.'
        ]
      }
    ]
  },

  /* ---------------------------------------------------------
     MARGUERITE VALE, Guest Experience Manager. The park's
     voice. Never rude, never honest, always pleasant.
     --------------------------------------------------------- */
  margo: {
    name: 'Margo Vale', role: 'Guest Experience Manager', zone: 'coral_kingdom',
    place: 'the south plaza',
    x: 32, y: 35, colour: '#c9a0dc', reactsToSuspicion: true,
    movement: { type: 'wander', radius: 2.5, speed: 1.05, pause: [1, 2.5] },
    dialogue: [
      {
        when: { flags: { met_margo: false } },
        lines: [
          'MARGO: You must be the transfer. Marvellous. I am Guest Experience, which means I am responsible ' +
            'for everything a guest sees, hears, or is told.',
          'MARGO: Including by you.',
          'MARGO: Do the talks. Guests adore a keeper who knows things. Answer the animal questions, ' +
            'answer them well, and route anything about origins, transfers or water quality to me.',
          'MARGO: That is not secrecy, it is consistency. Thank you so much.'
        ],
        onEnd: [
          { type: 'setFlag', flag: 'met_margo', value: true },
          { type: 'addXP', amount: 20 },
          { type: 'toast', text: 'Keeper talks are now worth doing: good cover, and the crowd learns something.' }
        ]
      },
      {
        when: { suspicion: { min: 50 } },
        lines: [
          'MARGO: A guest mentioned seeing a trainer in the service area. I said that was impossible.',
          'MARGO: I would hate to have said something untrue to a guest. You understand.'
        ]
      },
      {
        when: { evidence: ['ev_margo_directive', 'ev_water_falsified'] },
        lines: [
          'MARGO: You have been reading my memos. They are not secret, they are internal, which is different.',
          'MARGO: Everything in that memo is defensible. "Tested daily": we do test daily. ' +
            'Read it again and find me the lie.',
          'MARGO: That is what I do. I write things that are not lies.'
        ]
      },
      {
        lines: ['MARGO: Smile at the guests. They have paid ninety-four dollars each to be here.']
      }
    ]
  },

  /* ---------------------------------------------------------
     IBRAHIM OKONKWO, volunteer guide, twenty years on site.
     Institutional memory, which is the most dangerous thing
     a park like this can have walking around.
     --------------------------------------------------------- */
  ibrahim: {
    name: 'Ibrahim Okonkwo', role: 'Volunteer Guide', zone: 'coral_kingdom',
    at: 'obs_mangrove',
    x: 24, y: 3, colour: '#e0c48a', reactsToSuspicion: false,
    movement: { type: 'wander', radius: 2, speed: 0.7, pause: [2.5, 5] },
    dialogue: [
      {
        when: { quest: { q_reef_ibrahim: 'active' }, flags: { ibrahim_told: false } },
        lines: [
          'IBRAHIM: The teacher sent you. She asks better questions than most of the staff, that one.',
          'IBRAHIM: Twenty-one years I have stood on this boardwalk. When I started, that lagoon out there ' +
            'was a tidal inlet. Actual tide. Actual mangroves, not the ones they planted for the photograph.',
          'IBRAHIM: We had a release programme. Small: turtles mostly, the odd seal. There was a board by the ' +
            'gate with the names of every animal that went home on it.',
          'IBRAHIM: They took the board down when they drained the inlet for the Open Ocean Wing groundworks. ' +
            'The programme became part of "guest experience". Same staff, different budget line, no more names.',
          'IBRAHIM: I do not say any of this on my tours. I am saying it to you because you asked me directly, ' +
            'and because I am seventy-four and they cannot exactly sack a volunteer.'
        ],
        onEnd: [
          { type: 'setFlag', flag: 'ibrahim_told', value: true },
          { type: 'addEvidence', id: 'ev_ibrahim_testimony' },
          { type: 'addXP', amount: 35 },
          { type: 'addSkill', skill: 'observation', amount: 1 }
        ]
      },
      {
        when: { flags: { ibrahim_told: true } },
        lines: [
          'IBRAHIM: The board was cedar. Hand-painted. I know exactly which storeroom it went into.',
          'IBRAHIM: If anyone ever asks for it officially, it will be found to have been disposed of. ' +
            'So do not ask officially.'
        ]
      },
      {
        lines: [
          'IBRAHIM: Juvenile turtles come into these mangroves on the tide, you know. Wild ones. ' +
            'Nobody stocked them, nobody feeds them, and they are the healthiest animals on the property.',
          'IBRAHIM: Stand still for four minutes and you will see one.'
        ]
      }
    ]
  },

  /* ---------------------------------------------------------
     JARRAH NOLAN, junior aquarist and dive team. Zone 2's
     Milo: friendly, useful, and holds a key he should not lend.
     --------------------------------------------------------- */
  jarrah: {
    name: 'Jarrah Nolan', role: 'Aquarist / Diver', zone: 'coral_kingdom',
    at: 'touch_pool',
    x: 24, y: 31, colour: '#7fc7b3', reactsToSuspicion: true,
    movement: {
      type: 'patrol', speed: 1.5, pause: [0.8, 2],
      points: [{ x: 20, y: 31 }, { x: 28, y: 31 }, { x: 28, y: 32 }, { x: 21, y: 32 }]
    },
    dialogue: [
      {
        when: { quest: { q_reef_glove: 'not_started' } },
        lines: [
          'JARRAH: Hey. New. Excellent. Can I ask you something slightly humiliating?',
          'JARRAH: I have lost a dive glove. Again. Third one this year, and Margo has started ' +
            'putting my name in emails with a number after it.',
          'JARRAH: It went in the touch pool filter, I am almost certain, and I cannot go rummaging in there ' +
            'in front of forty children.',
          'JARRAH: Find it for me and I will owe you something better than thanks.'
        ],
        onEnd: [{ type: 'startQuest', id: 'q_reef_glove' }]
      },
      {
        when: { quest: { q_reef_glove: 'active' }, hasItems: { dive_glove: 1 } },
        lines: ['JARRAH: You absolute legend. Is that ... it is. It is chewed. Something has CHEWED it.'],
        choices: [
          {
            text: 'Hand over the glove',
            effects: [
              { type: 'takeItem', id: 'dive_glove', qty: 1 },
              { type: 'completeQuest', id: 'q_reef_glove' }
            ],
            reply: [
              'JARRAH: Right. Owed you something better than thanks.',
              'JARRAH: Service corridor key. Maintenance, pumps, the records room: all the doors that ' +
                'are not on the guest map.',
              'JARRAH: Officially you have it because you are on the tank cleaning roster. ' +
                'Unofficially I did not give it to you and this conversation did not happen.',
              'JARRAH: The door is on the north side, behind the mangrove planting. Go at break, not on shift.'
            ]
          },
          { text: 'Not yet', effects: [], reply: ['JARRAH: Fair. It has waited three weeks, it can wait.'] }
        ]
      },
      {
        when: { quest: { q_reef_glove: 'active' } },
        lines: ['JARRAH: Touch pool filter basket. Under the ledge, on the pool deck. Be quick and look official.']
      },
      {
        when: { quest: { q_reef_glove: 'completed' }, flags: { dead_drop_left: true } },
        lines: [
          'JARRAH: You have been in the corridor a lot for someone on the tank roster.',
          'JARRAH: I am not asking. I am telling you the pump room has a camera that has not worked since ' +
            'March, and the records room does not have one at all, and I have no idea why I just said that.'
        ]
      },
      {
        lines: [
          'JARRAH: Forty minutes in that tank this morning. A guest tapped the glass eleven times. I counted.',
          'JARRAH: Tapping does not hurt them, by the way. It is just spectacularly rude.'
        ]
      }
    ]
  },

  /* ---------------------------------------------------------
     DESSIE FITZGERALD, teacher on an excursion. Asks the
     question the game wants the player to be asked.
     --------------------------------------------------------- */
  dessie: {
    name: 'Dessie Fitzgerald', role: 'Visitor / Teacher', zone: 'coral_kingdom',
    at: 'talk_plaza',
    x: 26, y: 36, colour: '#d9a3a3', reactsToSuspicion: false,
    movement: { type: 'wander', radius: 2, speed: 0.9, pause: [2, 4] },
    dialogue: [
      {
        when: { quest: { q_reef_ibrahim: 'not_started' } },
        lines: [
          'DESSIE: Excuse me, you work here? Wonderful. Year 9. Twenty-eight of them. Somewhere.',
          'DESSIE: We are doing a unit on conservation claims. Marketing versus evidence. They have to ' +
            'assess whether an organisation does what it says it does.',
          'DESSIE: So one of them asked me what this place was like twenty years ago, and whether it has ' +
            'got better or worse, and I could not answer her.',
          'DESSIE: Is there anyone here who has actually been here that long?'
        ],
        choices: [
          {
            text: '"There is. Give me a bit."',
            effects: [{ type: 'startQuest', id: 'q_reef_ibrahim' }],
            reply: ['DESSIE: Thank you. Take your time. I have to find twenty-eight children.']
          },
          {
            text: '"Everything you need is on the signage."',
            effects: [{ type: 'addSuspicion', amount: 1 }],
            reply: ['DESSIE: ... Right. Thank you.', 'She writes something down. You suspect it is about you.']
          }
        ]
      },
      {
        when: { quest: { q_reef_ibrahim: 'active' }, flags: { ibrahim_told: true } },
        lines: ['DESSIE: You found someone? Go on then.'],
        choices: [
          {
            text: '"There was a board with the names of every animal released. They took it down."',
            effects: [{ type: 'completeQuest', id: 'q_reef_ibrahim' }],
            reply: [
              'DESSIE: A board. With names on it.',
              'DESSIE: That is the whole lesson, that is. You do not catch an organisation by what it says. ' +
                'You catch it by what it stopped counting.',
              'DESSIE: Here, take this. It is a spare excursion pass, it is worth about as much as a coffee, ' +
                'and it is the only thing I have got.'
            ]
          }
        ]
      },
      {
        when: { quest: { q_reef_ibrahim: 'completed' } },
        lines: [
          'DESSIE: They are writing it up as a case study. One of them has asked whether she can email the park ' +
            'to request the release figures.',
          'DESSIE: I said yes. I would very much like to see what comes back.'
        ]
      },
      { lines: ['DESSIE: Has anyone reported a lost Year 9? Slightly damp, answers to Kayla?'] }
    ]
  },

  /* ---------------------------------------------------------
     TOMAS "TOSH" BEKELE, aquarist. Runs the reef hall's life
     support and trusts numbers more than people.
     --------------------------------------------------------- */
  tosh: {
    name: 'Tosh Bekele', role: 'Aquarist', zone: 'reef_hall',
    x: 10, y: 15, colour: '#5fa8a0', reactsToSuspicion: true,
    movement: { type: 'wander', radius: 2, speed: 1.0, pause: [1.5, 3] },
    dialogue: [
      {
        when: { quest: { q_reef_samples: 'not_started' } },
        lines: [
          'TOSH: Do not touch the standpipes. Nobody has touched the standpipes, and yet.',
          'TOSH: You are the new one. Good. I need someone whose name is not already on the water logs.',
          'TOSH: Three samples. Lagoon deck sample port, the sump tap in here, and ... no, two will do to start. ' +
            'Three. Get three, one of them twice if you have to, I want spread.',
          'TOSH: You will need a test kit. There is a spare one in a locker in the staff block, or the kiosk ' +
            'sells them at a criminal markup.',
          'TOSH: Bring me three and I will show you something I would rather be wrong about.'
        ],
        onEnd: [
          { type: 'startQuest', id: 'q_reef_samples' },
          { type: 'discoverSpecies', id: 'grey_nurse_shark' }
        ]
      },
      {
        when: { quest: { q_reef_samples: 'active' }, hasItems: { water_sample: 3 } },
        lines: ['TOSH: Three. Right. Give them here and do not talk to me for ninety seconds.'],
        choices: [
          {
            text: 'Hand over the samples',
            effects: [
              { type: 'takeItem', id: 'water_sample', qty: 3 },
              { type: 'completeQuest', id: 'q_reef_samples' }
            ],
            reply: [
              'TOSH: Nitrate is high. Not dangerous. High.',
              'TOSH: Here is the thing. I have run this test myself every week for two years, and every ' +
                'week the number I write down goes into a folder in the records room.',
              'TOSH: And every week the number in the folder is lower than the number I wrote.',
              'TOSH: I am an aquarist. I do not do accusations. I do measurements. So: go and read the folder, ' +
                'and then neither of us is accusing anyone of anything.'
            ]
          },
          { text: 'Hold onto them for now', effects: [], reply: ['TOSH: They are dated. Do not sit on them.'] }
        ]
      },
      {
        when: { quest: { q_reef_samples: 'active' } },
        lines: ['TOSH: Three samples. Test kit first. The kit is not optional, this is not a vibe-based discipline.']
      },
      {
        when: { evidence: 'ev_water_falsified' },
        lines: [
          'TOSH: You read it. Same pen. Same hand. Including the four days the pumps were off.',
          'TOSH: I want to be very clear that I am not brave. I am simply extremely annoyed, ' +
            'and I have been extremely annoyed for two years.',
          'TOSH: Whatever you are doing, my numbers are dated and initialled and I keep my own copies. ' +
            'That is all I am saying.'
        ]
      },
      {
        lines: [
          'TOSH: 1.4 million litres, thirty-eight pumps, one me.',
          'TOSH: The sharks are fine, since you did not ask. The gulping is normal. Everyone reports the gulping.'
        ]
      }
    ]
  },

  /* ---------------------------------------------------------
     DR YUKI SATO, vet running the rehab unit. The one person
     in the park whose paperwork is honest.
     --------------------------------------------------------- */
  sato: {
    name: 'Dr Yuki Sato', role: 'Veterinarian', zone: 'turtle_unit',
    x: 11, y: 8, colour: '#e8e2d4', reactsToSuspicion: false,
    movement: { type: 'wander', radius: 1.5, speed: 0.85, pause: [2, 4] },
    dialogue: [
      {
        when: { quest: { q_reef_turtle: 'not_started' } },
        lines: [
          'SATO: Priya sent you. Shut the door, the shade cloth flaps.',
          'SATO: This is Kira. Green turtle, admitted fourteen months ago, and she cannot get her back end down.',
          'SATO: I know what I think it is. I want you to look at her without me telling you first, ' +
            'because I have looked at her four hundred times and I am no longer a reliable instrument.',
          'SATO: Run a session. Then find me two pieces of whatever is coming out of those drains outside, ' +
            'because I want to put it next to the radiograph when I write this up.'
        ],
        onEnd: [
          { type: 'startQuest', id: 'q_reef_turtle' },
          { type: 'discoverSpecies', id: 'green_turtle' }
        ]
      },
      {
        when: { quest: { q_reef_turtle: 'active' }, flags: { enc_gt_floating_solved: true },
                hasItems: { plastic_debris: 2 } },
        lines: ['SATO: You have both. Show me.'],
        choices: [
          {
            text: 'Hand over the plastic',
            effects: [
              { type: 'takeItem', id: 'plastic_debris', qty: 2 },
              { type: 'completeQuest', id: 'q_reef_turtle' }
            ],
            reply: [
              'SATO: Soft plastic, from a drain, forty metres from the mangroves where the wild juveniles feed.',
              'SATO: This park has a plastics education display. It is very good. It is beside a kiosk ' +
                'that sells drinks in soft plastic cups.',
              'SATO: Right. You have a rehabilitation ticket as far as I am concerned. ' +
                'Come back when Kira is diving and we will talk about the part that actually matters.'
            ]
          },
          { text: 'Give me a moment', effects: [], reply: ['SATO: She is not going anywhere. That is rather the issue.'] }
        ]
      },
      {
        when: { quest: { q_reef_turtle: 'active' }, not: { flags: { enc_gt_floating_solved: true } } },
        lines: ['SATO: Session first. Look at how she sits in the water, not at what her file says.']
      },
      {
        when: { quest: { q_reef_turtle: 'active' } },
        lines: ['SATO: Two pieces of plastic from the promenade drain. It will take you four minutes and it will ruin your afternoon.']
      },
      {
        when: { flags: { enc_gt_release_solved: true, sato_release_done: false } },
        lines: [
          'SATO: You cleared her. Good. That is the correct answer and it is the one that causes me the most trouble.',
          'SATO: I have submitted the release recommendation seven times. It comes back "under review by ' +
            'Guest Experience", which is not a clinical department.',
          'SATO: Your assessment is a second signature. It goes in the file, and the file is the only thing ' +
            'that outlasts all of us.',
          'SATO: Fourteen months. She should have been in the water off Seven Mile Beach thirteen months ago.'
        ],
        onEnd: [
          { type: 'setFlag', flag: 'sato_release_done', value: true },
          { type: 'achievement', id: 'turtle_return' },
          { type: 'addXP', amount: 60 },
          { type: 'addSkill', skill: 'veterinary', amount: 1 },
          { type: 'addEvidence', id: 'ev_turtle_origin' }
        ]
      },
      {
        lines: [
          'SATO: Everything in this room is written by hand and initialled. That is not nostalgia, ' +
            'it is so that nobody can quietly change it later.'
        ]
      }
    ]
  },

  /* ---------------------------------------------------------
     COREY PIKE, maintenance. Not an activist. Just a man who
     was asked to do something stupid and has not let it go.
     --------------------------------------------------------- */
  corey: {
    name: 'Corey Pike', role: 'Maintenance', zone: 'staff_coral',
    x: 16, y: 11, colour: '#9a8f7a', reactsToSuspicion: false,
    movement: { type: 'wander', radius: 2, speed: 0.95, pause: [2, 4] },
    dialogue: [
      {
        when: { quest: { q_reef_studbook: 'not_started' }, evidence: 'ev_water_falsified' },
        lines: [
          'COREY: You are the one who has been in my corridor.',
          'COREY: Relax. I do not care. I have been here nine years and I have never once been asked ' +
            'my opinion about anything, so my opinion is entirely available.',
          'COREY: You want to know what actually bothers me? Not the pumps. The records room.',
          'COREY: There is a book in there. Breeding records. Cetaceans. Been kept since before I started, ' +
            'and last spring somebody asked me to fit a lock to the shelf it sits on.',
          'COREY: A lock. On a shelf. In a corridor that already needs a key. You do not do that for feed orders.'
        ],
        onEnd: [{ type: 'startQuest', id: 'q_reef_studbook' }]
      },
      {
        when: { quest: { q_reef_studbook: 'active' }, not: { evidence: 'ev_dolphin_studbook' } },
        lines: [
          'COREY: Records room, end of the corridor, third shelf. Go on your break: there are contractors ' +
            'on the pump housing during shifts and they are chatty.'
        ]
      },
      {
        when: { flags: { dead_drop_left: true } },
        lines: [
          'COREY: Panel is back on straight. Nice work. Most people leave it proud on the left.',
          'COREY: I fitted that panel. I fitted the lock on the shelf, too. I am not going to pretend ' +
            'those two facts sit comfortably together.'
        ]
      },
      {
        lines: [
          'COREY: Thirty-eight pumps, and the one that fails is always the one behind the other one.',
          'COREY: Four days it was off, that time in March. Four days. Ask anyone who writes the water sheets.'
        ]
      }
    ]
  },

  /* ---------------------------------------------------------
     WREN, second appearance, at the drop. Reuses Barry-style
     `sprite` so she needs no second drawing.
     --------------------------------------------------------- */
  wren_reef: {
    name: 'Wren Halloran', role: 'Handler', zone: 'service_corridor',
    sprite: 'wren',
    x: 18, y: 5, colour: '#b6d7c4', reactsToSuspicion: false,
    spawnCondition: { evidence: 'ev_dolphin_studbook', flags: { wren_drop_met: false } },
    movement: { type: 'static' },
    dialogue: [
      {
        lines: [
          'A woman in a maintenance tabard is standing at the wall panel with a clipboard, ' +
            'looking like she has every right to be here.',
          'WREN: Do not stop walking. Read your clipboard.',
          'WREN: I collected last night. The studbook, the water sheets, the memo about which words you ' +
            'are allowed to use. That last one is the best thing you have found, by the way.',
          'WREN: A welfare failure is arguable. A document telling staff what they may not say is not.',
          'WREN: Keep going. There is one more thing in this park bigger than all of it, and it is behind ' +
            'a hoarding with three orca silhouettes on it.',
          'WREN: Do not go looking for it yet. You are not ready and neither am I.'
        ],
        onEnd: [
          { type: 'setFlag', flag: 'wren_drop_met', value: true },
          { type: 'addXP', amount: 60, once: 'wren_drop' },
          { type: 'addSkill', skill: 'discretion', amount: 1 },
          { type: 'toast', text: 'Wren has what you found.', once: 'wren_drop' }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------
     BARRY C., appearance #2. Same man, same jacket, first
     crack in the delivery. Reuses the cove Barry's artwork.
     --------------------------------------------------------- */
  barry_reef: {
    name: 'Barry C.', role: 'CEO', zone: 'coral_kingdom',
    place: 'the lagoon deck',
    sprite: 'barry',
    x: 31, y: 26, colour: '#4a6fa5', reactsToSuspicion: true,
    spawnCondition: { storyStage: { min: 3 }, flags: { barry_gone_2: false } },
    movement: {
      type: 'patrol', speed: 0.7, pause: [2, 4], loop: 'pingpong',
      points: [{ x: 31, y: 25 }, { x: 31, y: 28 }]
    },
    dialogue: [
      {
        when: { flags: { met_barry_2: false } },
        lines: [
          'BARRY: There they are! The one Dana likes. Word travels, you know. Word travels.',
          'BARRY: Come and look at this with me. Go on. Look at the hoarding.',
          'BARRY: The Open Ocean Wing. Forty million litres. Biggest in the southern hemisphere. ' +
            'Everything this park has done for thirty years has been leading here.',
          'BARRY: People will say things about it. They say things about everything. ' +
            'They said things about the dolphin lagoon and now three generations have grown up loving those animals.',
          'BARRY: You cannot make somebody care about an ocean they have never seen. That is not a slogan, ' +
            'that is the entire argument, and I have never lost it.',
          'BARRY: ... Anyway. Marvellous work. Keep it up.'
        ],
        onEnd: [
          { type: 'setFlag', flag: 'met_barry_2', value: true },
          { type: 'addXP', amount: 35 },
          { type: 'toast', text: 'Barry moves off towards the plaza.' },
          { type: 'setFlag', flag: 'barry_gone_2', value: true }
        ]
      },
      { lines: ['BARRY: Biggest in the southern hemisphere!'] }
    ]
  }
};
