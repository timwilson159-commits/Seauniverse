/* ============================================================
   SEA UNIVERSE: OPEN OCEAN CAST

   Own file, per the Zone 3 convention.

   Tonal brief for this zone: Arctic Cove was eccentrics. Open Ocean is
   people who have been ground down. Everyone here is competent, tired
   and working around a decision made above them, which is what the
   fourth act of this story needs: the comedy comes from the bureaucracy
   rather than from the characters.

   Two of them are puzzle locks wearing a person:
     · DAGS is the only man who can take the lagoon cover off, and he is
       asleep. He wants four specific pick-me-ups. He never says where
       they come from, and he must never be made to, working out that
       they are one per park kiosk is the puzzle.
     · VAUGHN is standing on the underground stair and cannot be talked,
       bribed or reasoned off it. He can only be ROSTERED off it, which
       is why he cheerfully tells you exactly what paperwork would do it.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.npcs = SU.data.npcs || {};

/* ---------------------------------------------------------
   HALINA OKONKWO, Open Ocean zone manager, and the manager
   who can be turned in this zone. Spent nine years recording
   wild orca dialects off the shelf before the funding went,
   and now runs a stadium with nothing in it.
   --------------------------------------------------------- */
SU.data.npcs.halina = {
  name: 'Halina Okonkwo', role: 'Trainer-Manager', zone: 'open_ocean',
  place: 'the Meridian compound',
  x: 27, y: 25, colour: '#7f9ec4', reactsToSuspicion: true,
  movement: {
    type: 'patrol', speed: 1.1, pause: [1.5, 3],
    points: [{ x: 27, y: 22 }, { x: 27, y: 29 }]
  },
  dialogue: [
    {
      when: { quest: { q_ocean_induction: 'not_started' } },
      lines: [
        'A woman is standing with her back to the compound wall, holding a tablet she is not looking at.',
        'HALINA: You are the transfer from Arctic. Halina Okonkwo, I run this zone. Nominally.',
        'HALINA: Before I tell you anything else: nothing in Open Ocean is small. The animals are big, ' +
          'the pools are deep, and a mistake here is not a scratch. You need Open Water Handling before ' +
          'you go near a gate. Husbandry, training, and enough observation to notice a problem an hour ' +
          'before it becomes an incident.',
        'HALINA: Then start at the Pod Pool. Three short-finned pilot whales, one of them elderly, and ' +
          'she has stopped eating. Nothing on her chart explains it.',
        'HALINA: I spent nine years listening to wild orca off the shelf edge. I can tell you the ' +
          'difference between two matrilines by ear. What I cannot do is get anyone in this park to ' +
          'read a session note.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_ocean_induction' },
        { type: 'discoverSpecies', id: 'pilot_whale' },
        { type: 'setFlag', flag: 'met_halina', value: true }
      ]
    },
    {
      when: { quest: { q_ocean_induction: 'active' }, not: { qualification: 'pelagic_cert' } },
      lines: [
        'HALINA: Certificate. Husbandry two, training two, observation one.',
        'HALINA: I am aware that sounds like a lot. So is six tonnes.'
      ]
    },
    /* HAND-IN. Must fire while the quest is ACTIVE: this entry is the
       only thing that closes it. (Same mistake as Frost in Arctic Cove;
       the validator now errors on it.) */
    {
      when: { quest: { q_ocean_induction: 'active' },
              flags: { enc_pw_matriarch_solved: true, ocean_debrief: false } },
      lines: [
        'HALINA: Her granddaughter. Of course it was her granddaughter.',
        'HALINA: They crated that animal out on a Tuesday morning and the paperwork calls it a "collection ' +
          'management decision". Kupe stopped eating on the Tuesday afternoon. I have written that ' +
          'sentence down four times now in four different reports.',
        'HALINA: In the wild she would have led that pod for thirty years after her last calf. That is what ' +
          'the old females are FOR. We took her family apart and logged the result as an appetite issue.',
        'HALINA: Right. You can see, so you are useful. You are on my roster properly now: the bay, the' +
          'lagoon, and the stadium when there is anything in it.',
        'HALINA: And before you ask, because everybody asks: yes, there is an orca. No, you cannot see her. ' +
          'She is off-exhibit behind the Meridian gate and the man who had the code has been off sick since May.'
      ],
      onEnd: [
        { type: 'completeQuest', id: 'q_ocean_induction' },
        { type: 'setFlag', flag: 'ocean_debrief', value: true },
        { type: 'setStoryStage', stage: 7 },
        { type: 'discoverSpecies', id: 'orca' },
        { type: 'addSkillPoints', amount: 2 },
        { type: 'addXP', amount: 60 },
        { type: 'toast', text: 'Open Ocean roster access approved.' }
      ]
    },
    /* Cleared, but has not run the Pod Pool session yet. */
    {
      when: { quest: { q_ocean_induction: 'active' }, qualification: 'pelagic_cert' },
      lines: [
        'HALINA: You are signed off. Then go to the Pod Pool and look at Kupe.',
        'HALINA: Not the chart. The chart says she is fine and the chart is why nobody has done anything.'
      ]
    },
    /* The third of Vaughn's three pieces of paper. She will sign it
       once she has any reason to trust you, which the induction is. */
    {
      when: { quest: { q_ocean_underground: 'active', q_ocean_induction: 'completed' },
              flags: { vaughn_order: false } },
      lines: [
        'HALINA: Vaughn sent you. Of course he did.',
        'HALINA: That restriction notice came from the office with no name on it, which means nobody has ' +
          'to own it and nobody can lift it. He has been standing on a staircase for five weeks because ' +
          'of a piece of paper that is technically nobody\'s.',
        'HALINA: Fine. I will countermand it in my own name and let them come and find me about it. ' +
          'The plant room is animal life support. It is my zone and it is my responsibility.',
        'HALINA: Take him this. And tell him I said he can sit down.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'vaughn_order', value: true },
        { type: 'addXP', amount: 30, once: 'halina_countermand' },
        { type: 'toast', text: 'Signed countermand: the access restriction is lifted.' }
      ]
    },
    /* Turning her. She already knows; what she does not have is proof
       that the decision was financial rather than clinical. */
    {
      when: { evidence: 'ev_wing_boardpack' },
      lines: [
        'She reads the tab twice, then reads the biro note in the margin, then puts the pack down very carefully.',
        'HALINA: "Contingent on demonstrated breeding capability in the flagship species."',
        'HALINA: I was told she came off a beach. Weak, alone, unreleasable: the whole story, with ' +
          'photographs. I repeated it to three school groups a week for a year.',
        'HALINA: She is not an exhibit. She is not even an animal in this document. She is the security ' +
          'against phase two funding, and the acquisition they are waiting on is a MALE.',
        'HALINA: Write down that I said this, and put my name on it. I have spent four years being ' +
          'reasonable in reports nobody reads. I am done being reasonable.'
      ],
      onEnd: [
        { type: 'addEvidence', id: 'ev_halina_testimony', once: 'halina_turn' },
        { type: 'setFlag', flag: 'halina_turned', value: true },
        { type: 'addXP', amount: 70, once: 'halina_turn_xp' },
        { type: 'toast', text: 'Halina Okonkwo is on the record.' }
      ]
    },
    {
      lines: [
        'HALINA: If you want to be useful, go and stand at a rail and actually watch something for ten ' +
          'minutes. It is astonishing how much of this job is that.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   NOOR HADDAD, bay trainer. Cheerful, permanently behind,
   runs three animals' worth of work with two hands.
   --------------------------------------------------------- */
SU.data.npcs.noor = {
  name: 'Noor Haddad', role: 'Trainer-Peer', zone: 'open_ocean',
  at: 'bay_pool',
  x: 46, y: 30, colour: '#8fc4b0', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 1.2, pause: [1, 2.5] },
  dialogue: [
    {
      when: { flags: { met_noor: false } },
      lines: [
        'A trainer is carrying two buckets, a clipboard and a squeegee, and is somehow also waving.',
        'NOOR: New? Brilliant. Take a bucket. No, honestly, take a bucket.',
        'NOOR: Noor. I have the bay. Three common dolphins: Rill, Ana and Bright, and before you ask, ' +
          'yes, Bright is the one doing something stupid at any given moment.',
        'NOOR: Look at the flank on Rill when she turns. That hourglass has four panels to it: dark cape' +
          'on top, gold in front of it, grey behind, white underneath. Once you see the four you cannot ' +
          'unsee them and you will be identifying them at the aquarium on your day off like a sad person.',
        'NOOR: Anyway. If you have five minutes I have a thing that has been bothering me.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_noor', value: true },
        { type: 'discoverSpecies', id: 'common_dolphin' },
        { type: 'addXP', amount: 20 }
      ]
    },
    {
      when: { flags: { met_noor: true }, quest: { q_ocean_pods: 'not_started' } },
      lines: [
        'NOOR: They have started doing laps. All three, nose to tail, same line every time, for most of ' +
          'the afternoon. It looks lovely and it makes my skin crawl.',
        'NOOR: And Kupe over in the Pod Pool is off her food and nobody will tell me why. So that is two ' +
          'things and one of me.'
      ],
      choices: [
        { text: 'Offer to work both cases properly',
          reply: 'NOOR: You are my favourite person in this park and I have known you for ninety seconds.',
          effects: [{ type: 'startQuest', id: 'q_ocean_pods' }] },
        { text: 'Ask why three dolphins is a problem',
          reply: 'NOOR: Because in the wild it would not be three. It would be three hundred. They hunt by ' +
                 'herding fish together: the whole behaviour needs a crowd. Three is not a small pod. ' +
                 'Three is not a pod.' }
      ]
    },
    /* The cover thread. She points you at Dags without ever explaining
       what he wants: she genuinely does not know, she just knows he is
       impossible before lunch. */
    {
      when: { quest: { q_ocean_cover: 'not_started' }, flags: { saw_winch: true } },
      lines: [
        'NOOR: You found the winch. Then you will have found the note, and the note is right: do not ' +
          'improvise. Somebody improvised in March and we lost a fortnight of lagoon access.',
        'NOOR: The cover comes off at seven. It is not seven. It has not been seven for four hours.',
        'NOOR: Maintenance is one man on nights, and one man on nights is Dags, and Dags will be horizontal ' +
          'somewhere warm. Try the stadium. Nobody goes in it any more, which is exactly why he does.',
        'NOOR: Fair warning, he is not a morning person. He is not really an any-time-of-day person. ' +
          'He is, however, the only person with the winch key.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_ocean_cover' },
        { type: 'addXP', amount: 15, once: 'noor_cover' }
      ]
    },
    {
      when: { flags: { manta_cover_off: true } },
      lines: [
        'NOOR: The cover is off. I could kiss you and I am not going to, because you smell like a bin.',
        'NOOR: Go and look at them properly. Take the camera. Belly shots: the spots are the animal, ' +
          'they never change, and I have a horrible feeling about our lagoon records.'
      ]
    },
    {
      lines: [
        'NOOR: Bright has got the squeegee. Bright has GOT the squeegee. I will be back.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   DAGS WHITLOW, maintenance, nights, asleep in row K of an
   empty stadium. PUZZLE NPC: he wants four named pick-me-ups
   and he will not say where any of them come from.
   --------------------------------------------------------- */
SU.data.npcs.dags = {
  name: 'Dags Whitlow', role: 'Maintenance', zone: 'ocean_stadium',
  place: 'row K of the seating',
  x: 18, y: 12, colour: '#a89070', reactsToSuspicion: false,
  movement: { type: 'static' },
  dialogue: [
    {
      when: { flags: { met_dags: false } },
      lines: [
        'Row K, seat 14, with a hi-vis jacket over his face and a toolbelt still on. He is snoring in ' +
          'a way that suggests real commitment.',
        'You say his name. The jacket moves about an inch.',
        'DAGS: Nnno.',
        'DAGS: ... I did fourteen hours. I did fourteen hours and then I did the pumps. The cover is on ' +
          'the list. The cover is ON the list.',
        'DAGS: Tell you what. Tell you what. You bring me a hot chocolate, a reef smoothie, a sea salt ' +
          'doughnut and a deep blue slushie, and I will get up and winch that cover off myself.',
        'DAGS: All four, mind. Do not turn up with four of the same thing. I am not an animal.',
        'The jacket goes back over his face.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_dags', value: true },
        { type: 'addXP', amount: 20 },
        { type: 'toast', text: 'Dags wants: hot chocolate, reef smoothie, sea salt doughnut, deep blue slushie.' }
      ]
    },
    {
      when: { flags: { met_dags: true, dags_awake: false },
              hasItems: { hot_chocolate: 1, smoothie: 1, cove_doughnut: 1, blue_slushie: 1 } },
      lines: [
        'You put all four on the seat beside him. He does not open his eyes. He puts a hand out, finds ' +
          'the slushie by touch, and makes a noise like a boiler starting.',
        'DAGS: All four. You actually did all four.',
        'DAGS: Do you know how long that takes? Because I do. Nobody has ever done it. Blokes have ' +
          'promised. Blokes have brought me two.',
        'He sits up. He looks about sixty and about thirty at the same time.',
        'DAGS: Right. Cover. Come on.',
        'You follow him out to the lagoon. He unlocks the winch box, throws one lever, and forty metres ' +
          'of tarpaulin peels back off the water like a lid coming off a tin.',
        'DAGS: There. Now. Anything else in this park that has been broken for five weeks, you come and ' +
          'find me, because apparently you are the only one who will.'
      ],
      onEnd: [
        { type: 'takeItem', id: 'hot_chocolate' },
        { type: 'takeItem', id: 'smoothie' },
        { type: 'takeItem', id: 'cove_doughnut' },
        { type: 'takeItem', id: 'blue_slushie' },
        { type: 'setFlag', flag: 'dags_awake', value: true },
        { type: 'setFlag', flag: 'manta_cover_off', value: true },
        { type: 'addXP', amount: 90 },
        { type: 'addSkill', skill: 'discretion', amount: 1 },
        { type: 'achievement', id: 'four_kiosks' },
        { type: 'toast', text: 'The lagoon cover is off.' }
      ]
    },
    {
      when: { flags: { met_dags: true, dags_awake: false } },
      lines: [
        'DAGS: Four things. I said four things.',
        'DAGS: Hot chocolate. Reef smoothie. Sea salt doughnut. Deep blue slushie.',
        'DAGS: I am not being difficult. I have been on nights since March and that is the only ' +
          'combination that gets me vertical.'
      ]
    },
    /* Vaughn's second piece of paper: the open work order. */
    {
      when: { quest: { q_ocean_underground: 'active' }, flags: { vaughn_workorder: false } },
      lines: [
        'DAGS: Vaughn. Right. The hatch work order.',
        'DAGS: That job was done in April. I did it in April. I have never closed it off because closing ' +
          'it off means going into the system, and going into the system means finding my password.',
        'He signs a docket against the back of a seat, using a bolt as a straight edge.',
        'DAGS: There. Job closed, four months late, which for this park is early.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'vaughn_workorder', value: true },
        { type: 'addXP', amount: 30, once: 'dags_workorder' },
        { type: 'toast', text: 'Signed docket: the hatch work order is closed.' }
      ]
    },
    {
      lines: [
        'DAGS: Anything that hums, whines, drips or bangs, that is me. Anything that is somebody\'s ' +
          'feelings, that is not me.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   VAUGHN PETRAKIS, security, posted on the service stair.
   Cannot be talked round, and does not need to be: he will
   tell you precisely which three pieces of paper move him,
   because that is what a man who likes rules does.
   --------------------------------------------------------- */
SU.data.npcs.vaughn = {
  name: 'Vaughn Petrakis', role: 'Security', zone: 'open_ocean',
  place: 'the service stair, south plaza',
  x: 48, y: 34, colour: '#5a6a7a', reactsToSuspicion: true,
  spawnCondition: { flags: { hatch_clear: false } },
  movement: { type: 'static' },
  dialogue: [
    {
      when: { flags: { met_vaughn: false } },
      lines: [
        'A security officer is standing in front of the stair head with his hands behind his back and ' +
          'the expression of a man who has explained this several hundred times.',
        'VAUGHN: Morning. No.',
        'VAUGHN: You have not asked yet. You were going to. Everyone does. The answer is no, and I would ' +
          'like you to know it is not personal, it is a notice.',
        'VAUGHN: Restricted access until further notice, by order of the office. No name on it. No end ' +
          'date on it. Five weeks I have been standing here and the only thing down those stairs is ' +
          'a pump.',
        'VAUGHN: I am not permitted to leave a restricted point unless three conditions are satisfied. ' +
          'I am permitted to tell you what they are, and frankly I would love somebody to go and do them.'
      ],
      choices: [
        { text: 'Ask what the three conditions are',
          reply: 'VAUGHN: One. A relief officer rostered to this point, in writing, on the board in your ' +
                 'staff block. Two. The open work order on that hatch closed off by maintenance, ' +
                 'because I cannot vacate a point with live works against it. Three. Somebody with a ' +
                 'name countermands the notice. Anybody. A name is all I need.\n\n' +
                 'VAUGHN: Do those three and I walk away whistling.',
          effects: [
            { type: 'setFlag', flag: 'met_vaughn', value: true },
            { type: 'startQuest', id: 'q_ocean_underground' },
            { type: 'addXP', amount: 25 }
          ] },
        { text: 'Ask what he thinks is down there',
          reply: 'VAUGHN: A pump. I have said. That is what makes it strange, isn\'t it. Nobody posts a ' +
                 'man on a pump.',
          effects: [
            { type: 'setFlag', flag: 'met_vaughn', value: true },
            { type: 'startQuest', id: 'q_ocean_underground' },
            { type: 'addXP', amount: 25 }
          ] }
      ]
    },
    {
      when: { flags: { vaughn_relief: true, vaughn_workorder: true, vaughn_order: true } },
      lines: [
        'He reads all three, slowly, in the order he asked for them.',
        'VAUGHN: Relief rostered. Works closed. Countermanded by the zone manager, in her own name, ' +
          'in ink.',
        'VAUGHN: That is the first complete set of paperwork I have been handed in eleven years.',
        'VAUGHN: I am going to go and sit down. If anyone asks, the point was properly relieved and I ' +
          'went off shift at the correct time, which is the sort of sentence that ends a career or ' +
          'saves one and I have stopped being able to tell which.',
        'He walks off towards the plaza. He does actually whistle.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'hatch_clear', value: true },
        { type: 'completeQuest', id: 'q_ocean_underground' },
        { type: 'achievement', id: 'proper_channels' },
        { type: 'toast', text: 'The service stair is clear.' }
      ]
    },
    {
      lines: [
        'VAUGHN: Rostered relief. Closed work order. A named countermand. In that order or any order, ' +
          'I genuinely do not mind.',
        'VAUGHN: And before you try: I have been offered a coffee, a sandwich, forty dollars and, once, ' +
          'a boat.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   VAUGHN PETRAKIS, SECOND POST: the same man, at the entry
   plaza, after you have had him rostered off the stair.

   WHY THIS EXISTS (playtest bug, 2026-08-05):
   The original Vaughn carries spawnCondition {hatch_clear:false},
   so he stops existing the moment his own quest is completed.
   That was fine while he was only a lock on a door. It stopped
   being fine when Zone 5 made him one of the five witnesses in
   "Nine Years of Barry", because reaching Zone 5 at all REQUIRES
   going through the service level, which requires hatch_clear.
   Every player on that quest was guaranteed not to be able to
   find him. The quest was unfinishable.

   The fix is relocation rather than a looser spawn condition:
   he was moved by paperwork, so he is standing wherever the
   paperwork put him, and a man like Vaughn would be exactly on
   time for a post he did not choose. That also keeps the
   original scene intact: he still vanishes from the stair,
   which is the point of beating him.

   `sprite:` reuses his existing art, so this needs no drawing.
   The design doc's NPC-relocation idea is now real, and this is
   the pattern for it.
   --------------------------------------------------------- */
SU.data.npcs.vaughn_gate = {
  name: 'Vaughn Petrakis', role: 'Security', zone: 'open_ocean', sprite: 'vaughn',
  place: 'the north entry plaza',
  x: 30, y: 3, colour: '#5a6a7a', reactsToSuspicion: true,
  spawnCondition: { flags: { hatch_clear: true } },
  movement: {
    type: 'patrol', speed: 0.8, pause: [3, 6],
    points: [{ x: 26, y: 3 }, { x: 31, y: 3 }]     // not (33,3), that is a lamp post
  },
  dialogue: [
    /* ---- NINE YEARS OF BARRY, five of five (quest q_deep_barry, Zone 5).
       Hoisted to the top of this list at load time by the block at the
       bottom of data/npcs_deep.js. Vaughn is the funniest of the five
       witnesses and the most damaging, for exactly the same reason: he
       is completely uninterested in what the record MEANS. A gate log
       is a gate log. He would hand the same printout to Barry. */
    {
      when: { quest: { q_deep_barry: 'active' }, flags: { barry_vaughn: false } },
      lines: [
        'VAUGHN: Vehicle movements. Yes. That is a records request, and records requests are fine. ' +
          'They are one of the four things I am actually allowed to do.',
        'VAUGHN: Date range?',
        'He types it in with two fingers and prints it without reading it, because reading it is not ' +
          'part of the request.',
        'VAUGHN: There you are. Every badged vehicle on and off this site for that fortnight, times ' +
          'in, times out.',
        'You point at three lines.',
        'VAUGHN: Yes. Chief executive\'s vehicle. Tuesday the ninth, Thursday the eleventh, Monday ' +
          'the fifteenth. In and out each time, so those are real movements and not a scanner fault.',
        'VAUGHN: Is that a problem?',
        'You tell him what the trust was told about where Barry was that fortnight.',
        'VAUGHN: Right.',
        'He thinks about it the way he thinks about everything, which is slowly and entirely without ' +
          'drama.',
        'VAUGHN: Well. The gate does not lie. That is the whole point of the gate. It does not know ' +
          'whose car it is and it would not care if it did.',
        'VAUGHN: I would give that printout to him, if he asked me for it. Same form, same fifteen ' +
          'minutes. I want to be clear that I am not doing you a favour. I am doing the job.'
      ],
      onEnd: [
        { type: 'addEvidence', id: 'ev_barry_vaughn' },
        { type: 'setFlag', flag: 'barry_vaughn', value: true },
        { type: 'addXP', amount: 80 }
      ]
    },
    {
      when: { quest: { q_deep_barry: 'active' }, flags: { barry_vaughn: true } },
      lines: [
        'VAUGHN: The printout is logged as issued, with your name against it, because issued records ' +
          'are logged.',
        'VAUGHN: I mention it so that nobody has to be surprised later. Surprises are a security ' +
          'problem.'
      ]
    },
    {
      when: { flags: { met_vaughn_gate: false } },
      lines: [
        'The security officer from the service stair, standing at the entry plaza instead, with his ' +
          'hands behind his back and the same expression.',
        'VAUGHN: Front gate now. You did that.',
        'VAUGHN: I am not being sarcastic. Three pieces of paper, all correct, all countersigned. ' +
          'That is the system working, and I have waited eleven years to see the system work.',
        'VAUGHN: It is a worse post. More people, more questions, and a man tried to bring a python ' +
          'through here on Tuesday.',
        'VAUGHN: If you need anything from the records, ask. Same form. It does not matter to me what ' +
          'it is for.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_vaughn_gate', value: true },
        { type: 'addXP', amount: 20, once: 'met_vaughn_gate' }
      ]
    },
    {
      lines: [
        'VAUGHN: Front gate. Everything through this gate is logged, and everything logged can be ' +
          'asked for.',
        'VAUGHN: People find that reassuring or alarming depending entirely on what they have been ' +
          'doing.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   BEATRIX "TRIXIE" NG, visitor, eleven years of season
   tickets, knows the show schedule better than the staff.
   She is the one who notices the animal is missing.
   --------------------------------------------------------- */
SU.data.npcs.trixie = {
  name: 'Beatrix Ng', role: 'Visitor', zone: 'open_ocean',
  at: 'stadium_board',
  x: 14, y: 7, colour: '#d6a4b8', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 0.9, pause: [2, 4] },
  dialogue: [
    {
      when: { flags: { met_trixie: false } },
      lines: [
        'A woman in a sun hat is standing in front of the show times board, taking a photograph of it. ' +
          'She has a lanyard of her own, homemade, holding eleven consecutive season passes.',
        'TRIXIE: Eleven years. Every school holiday, and a few days that were not.',
        'TRIXIE: I have seen the eleven o\'clock four hundred and six times. I am aware of how that sounds.',
        'TRIXIE: And in that time nobody has ever cancelled a whole season. Rain, yes. Illness, once, ' +
          'for a week. Not this.',
        'TRIXIE: They keep saying "wellbeing reasons". I would believe that, I would be pleased about it, ' +
          'except that they also keep saying she is thriving. Both of those cannot be doing any work at ' +
          'the same time.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_trixie', value: true },
        { type: 'addXP', amount: 20 }
      ]
    },
    {
      when: { flags: { met_trixie: true }, quest: { q_ocean_meridian: 'not_started' } },
      lines: [
        'TRIXIE: You work here. You could go and look.',
        'TRIXIE: I am not asking you to smuggle me in. I would like somebody to actually SEE her and then ' +
          'be able to say so. That is all. One person who has been in the room.',
        'TRIXIE: The gate is round the back of that grey block. There is a keypad and there is a little ' +
          'laminated card on it, and I have read that card twenty times. It does not even try to help you, ' +
          'it just tells you the numbers were given away to "people nobody in this park takes seriously". ' +
          'Thanks very much.'
      ],
      choices: [
        { text: 'Say you will find a way in',
          reply: 'TRIXIE: Thank you. And when you have, tell me the truth, not the sentence off the board. ' +
                 'I have had eleven years of the sentence off the board.',
          effects: [{ type: 'startQuest', id: 'q_ocean_meridian' }] },
        { text: 'Ask what the card says',
          reply: 'TRIXIE: "Not written down. Not in a drawer, not in a phone, not on this card. I gave it ' +
                 'away in pieces, to people nobody in this park takes seriously." Signed J.N. I have no ' +
                 'idea who J.N. is, and no idea who counts as nobody around here.' }
      ]
    },
    {
      when: { flags: { meridian_open: true }, not: { flags: { trixie_told: true } } },
      lines: [
        'TRIXIE: You have been in. I can tell, you have got the face.',
        'You tell her. Not the sentence off the board.',
        'TRIXIE: ... Right.',
        'TRIXIE: Eleven years I have been buying a pass and telling people this was a good place. My ' +
          'niece has a poster of that animal on her wall.',
        'TRIXIE: Do not apologise to me. Write it down, whatever it is you are doing with that notebook. ' +
          'I have four hundred and six days of photographs with a date stamp on them and I will hand ' +
          'over every single one.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'trixie_told', value: true },
        { type: 'addEvidence', id: 'ev_trixie_photos', once: 'trixie_photos' },
        { type: 'addXP', amount: 55, once: 'trixie_told_xp' },
        { type: 'achievement', id: 'season_ticket' }
      ]
    },
    {
      lines: [
        'TRIXIE: The eleven o\'clock. Four hundred and six times. I could do the commentary, and on one ' +
          'occasion in 2019 I very nearly had to.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   FERRIS NAKAGAWA, contract sound engineer. The "F.N." on
   the commissioning sheet in the stadium and on the
   hydrophone trace downstairs. Callback: ev_show_noise in
   Coral Kingdom names the same contractor and the same month.
   --------------------------------------------------------- */
SU.data.npcs.ferris = {
  name: 'Ferris Nakagawa', role: 'Subversive', zone: 'open_ocean',
  place: 'the service alley',
  x: 53, y: 9, colour: '#c4a86a', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 1.0, pause: [1.5, 3] },
  dialogue: [
    {
      when: { flags: { met_ferris: false } },
      lines: [
        'A man in the alley is coiling cable around his elbow, badly, and swearing at it in a friendly way.',
        'FERRIS: Do not mind me. Contractor. Sound. I did the stadium.',
        'FERRIS: I also did the cove stadium and the reef hall, which means that if anything in this park ' +
          'is too loud, it is statistically my fault, and I would like to talk to you about that.',
        'FERRIS: I specified underwater measurement on all three. Hydrophone in the pool, take a reading, ' +
          'set the limiter to it. It is not exotic, it is what you do.',
        'FERRIS: I got told the budget did not run to it and to sign it off as per the previous install. ' +
          'So I signed it off as per the previous install. And then I went and put a hydrophone in ' +
          'anyway, on my own time, because I wanted to know.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_ferris', value: true },
        { type: 'addEvidence', id: 'ev_ferris_testimony' },
        { type: 'addXP', amount: 45 },
        { type: 'toast', text: 'Ferris is on the record.' }
      ]
    },
    {
      when: { flags: { met_ferris: true }, quest: { q_ocean_soundcheck: 'not_started' } },
      lines: [
        'FERRIS: Right, while you are here. I have a problem and it is embarrassing.',
        'FERRIS: The show is cancelled but the SHOW is not cancelled, if you follow me. The playout ' +
          'machine still fires the Ocean Giants track at half three, every day, into an empty stadium ' +
          'and, through the deck speakers, into two pools with animals in them.',
        'FERRIS: I cannot get at the playout box, it is in the office and I am a contractor. What I CAN ' +
          'do is have somebody pull the three line isolators before it fires. Stadium, lagoon, bay.',
        'FERRIS: You would be doing it for an animal that has stopped talking, so.'
      ],
      choices: [
        { text: 'Go and pull all three',
          reply: 'FERRIS: Stadium, lagoon, bay. Go. I will keep an eye on the clock and you will hear ' +
                 'about it if you are late.',
          effects: [{ type: 'startQuest', id: 'q_ocean_soundcheck' }] },
        { text: 'Ask why noise matters underwater',
          reply: 'FERRIS: Because sound travels four and a half times faster in water and it does not ' +
                 'fall off the way it does in air. A cetacean lives by sound. Putting a PA on a pool ' +
                 'is like putting a strobe in a room where everybody navigates by sight.' }
      ]
    },
    {
      lines: [
        'FERRIS: If anyone official asks, I am coiling cable. I am always coiling cable. It is a ' +
          'wonderful thing to be seen doing.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   BARRY C., BEAT #4. The name comes off.
   Reuses npc_barry.svg.
   --------------------------------------------------------- */
SU.data.npcs.barry_ocean = {
  name: 'Barry C.', role: 'CEO', zone: 'open_ocean',
  sprite: 'barry',
  place: 'the entry plaza',
  x: 27, y: 3, colour: '#4a6fa5', reactsToSuspicion: true,
  spawnCondition: { storyStage: { min: 7 }, flags: { barry_gone_4: false } },
  movement: {
    type: 'patrol', speed: 0.8, pause: [2, 4], loop: 'pingpong',
    points: [{ x: 24, y: 3 }, { x: 31, y: 3 }]
  },
  dialogue: [
    {
      when: { flags: { met_barry_4: false } },
      lines: [
        'He is standing in the entry plaza with two people in suits, pointing at the hoarding, and he ' +
          'breaks off the moment he sees the lanyard.',
        'BARRY: There you are. Arctic, weren\'t you. You get around.',
        'BARRY: This is the one. Everything else in this park is heritage. This is the future: six pools, ' +
          'a research wing, a name over the door that means something.',
        'BARRY: And it is all funded, incidentally, by people who love animals. That is not cynicism, ' +
          'that is the model. Love pays for the concrete.',
        'BARRY: The orca is the whole proposition. One animal, and the wing exists. Without her it is a ' +
          'field with planning permission.',
        'BARRY: Nobody sees her at the moment, which is a shame, but a temporary one. Enjoy the zone.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_barry_4', value: true },
        { type: 'setStoryStage', stage: 8 },
        { type: 'addEvidence', id: 'ev_barry_proposition' },
        { type: 'addXP', amount: 50 },
        { type: 'addSuspicion', amount: 4 },
        { type: 'toast', text: '"Without her it is a field with planning permission."' }
      ]
    },
    /* The reveal. Only fires once you have physically read the name. */
    {
      when: { flags: { knows_cuda_name: true, barry_unmasked: false } },
      lines: [
        'BARRY: You have been in the filing cabinet.',
        'He says it pleasantly. He does not ask.',
        'BARRY: The bottom drawer is catering invoices. Nobody gets to the bottom of catering invoices ' +
          'by accident.',
        'BARRY: Well. Since we are being formal about it.',
        'BARRY: Cuda. Barry Cuda. It is on the incorporation documents, it is on the title deeds, and ' +
          'it is on precisely nothing that faces the public, because "Barry C." fits on a badge and ' +
          'does not invite a search.',
        'BARRY: I own this park. Not the trust. Not the foundation. The holding company that owns the ' +
          'trust that owns the foundation, and I own that outright.',
        'BARRY: Now. You have not done anything yet. You have read a name. Read it, understand what it ' +
          'means about how much of this is mine to decide, and go back to work.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'barry_unmasked', value: true },
        { type: 'addEvidence', id: 'ev_cuda_admission' },
        { type: 'addSuspicion', amount: 12 },
        { type: 'addXP', amount: 100 },
        { type: 'achievement', id: 'barracuda' },
        { type: 'toast', text: 'Barry Cuda.' }
      ]
    },
    {
      lines: [
        'BARRY: Still here. Good. A park needs people who are still here.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   WREN, Open Ocean check-in. Reuses npc_wren.svg.
   --------------------------------------------------------- */
SU.data.npcs.wren_ocean = {
  name: 'Wren Halloran', role: 'Handler', zone: 'open_ocean',
  sprite: 'wren',
  place: 'the lower promenade',
  x: 28, y: 33, colour: '#b6d7c4', reactsToSuspicion: false,
  spawnCondition: { flags: { met_barry_4: true, wren_ocean_done: false } },
  movement: { type: 'wander', radius: 2, speed: 0.8, pause: [2, 5] },
  dialogue: [
    {
      when: { quest: { q_ocean_case: 'not_started' } },
      lines: [
        'WREN: I have been standing at this end of the park for two hours and nobody has asked me why. ' +
          'That is how you know it is the biggest one.',
        'WREN: Everything you have sent me so far is welfare. Welfare is arguable. There is always a vet ' +
          'somewhere who will say the pool meets the standard and the animal is in good body condition, ' +
          'and they will be telling the truth, and it will change nothing.',
        'WREN: What I need out of this zone is the money and the name.',
        'WREN: The money is in the offices: there is a board pack that says out loud what the orca is ' +
          'FOR. The paperwork is under the plaza, in the plant room, because the plant room is the only ' +
          'place in this park nobody tidies. And the name is in a filing cabinet in reception, on a ' +
          'company search somebody printed and then thought better of.',
        'WREN: Get me all three and this stops being a story about a sad animal and becomes a story ' +
          'about a company.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_ocean_case' },
        { type: 'addXP', amount: 40, once: 'wren_ocean_brief' },
        { type: 'toast', text: 'The money, the paperwork, and the name.' }
      ]
    },
    {
      when: { quest: { q_ocean_case: 'completed' } },
      lines: [
        'WREN: Barry Cuda.',
        'WREN: Nine years I worked for a man whose name I did not know. I used to bring him a coffee.',
        'WREN: Right. There is one place left, and you already know where it is, because everything in ' +
          'this park points at it. The Deep. Restricted, unlisted, and the only part of the site that ' +
          'is not on the guest map.',
        /* Playtest 2026-08-05: this used to stop here, and a player with
           every Open Ocean quest finished went and stood at the south
           fence gate instead. Wren now says which way, because she is the
           one character whose job is to tell you what to do next. */
        'WREN: Do not bother with the fence. There is a gate in the south boundary and it is bolted ' +
          'from the other side, which tells you something about who it was meant to keep out.',
        'WREN: Go underneath. The plant room below the plaza runs south under the whole zone and the ' +
          'pipework carries on past the boundary, which means there is a way through the west wall ' +
          'down there. That is how the contractors get in and out without ever crossing the park.',
        'WREN: Rest. Eat something. Then we finish it.'
      ]
    },
    {
      lines: [
        'WREN: Keep walking. People who stand still in this zone get asked what they are doing, and ' +
          'in this zone they mean it.'
      ]
    }
  ]
};

/* ============================================================
   THE TEENAGE NEON ANIMAL LIBERATION UNIFIED FRONT FOR ANIMAL
   WELFARE PROTECTION (working title, and the working title is
   itself the running joke: nobody can agree on the name either)

   Four teenagers in matching fluro yellow shirts and neon pink
   trousers. They are the ONLY route to the Meridian gate code.

   HOW THE PUZZLE WORKS NOW. Each was given one digit to memorise,
   and each remembers it by a fact about the animal they are
   standing next to, so the mnemonic can be checked on the spot:

     fennel   1st digit   5   orcas are in all five oceans
     odile    2nd digit   4   the common dolphin hourglass has four panels
     barty    3rd digit   2   a manta has two cephalic lobes
     sunny    4th digit   3   a pilot whale pod is three generations

   Code 5423. LOAD-BEARING: those four numbers now live in TWO
   places, here and `meridian_pad` in data/zone_ocean.js. They used
   to live on the four information boards as well; the boards were
   deliberately cut loose from the puzzle 2026-08-05 and are now
   general animal facts, so do not put counting facts back on them.

   They are found by TALKING TO THEM, not by being pointed at. The
   only signpost is the keypad's after-three-failures hint, which
   exists for the standing no-dead-end rule and nothing more.

   Each one stands beside the animal in their own clue, so a player
   who half-remembers the fact can look up and check it.
   ============================================================ */

/* --- 1st digit: FIVE. Outside the Meridian gate. --- */
SU.data.npcs.fennel = {
  name: 'Fennel Crisp', role: 'Founder', zone: 'open_ocean',
  place: 'outside the Meridian gate',
  x: 28, y: 26, colour: '#e8e34a', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 1.15, pause: [1, 3] },
  dialogue: [
    {
      when: { flags: { met_fennel: false } },
      lines: [
        'A teenager in a fluro yellow shirt and neon pink trousers is standing at the compound wall ' +
          'with a clipboard, looking extremely official and extremely fifteen.',
        'FENNEL: Do not be alarmed. I am with the Teenage Neon Animal Liberation Unified Front for ' +
          'Animal Welfare Protection.',
        'FENNEL: We are aware that the name is long. There is a subcommittee.',
        'FENNEL: I am Fennel. Founder. Which is a position I hold because I was the one holding the pen.',
        'FENNEL: We are staging a mass demonstration. It will be enormous. Banners. A chant. ' +
          'I have written the chant.',
        'FENNEL: We have not set a date. That is the only outstanding item.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_fennel', value: true },
        { type: 'addXP', amount: 15 }
      ]
    },
    {
      lines: [
        'FENNEL: Security-wise, I am the FIRST digit. There are four of us and I am first, which was ' +
          'not a fight, it was a discussion, and I won it.',
        'FENNEL: And I will never forget mine, because mine is the orca, and the orca is EVERYWHERE.',
        'FENNEL: Atlantic. Pacific. Indian. Southern. Arctic. That is all five oceans. Every one. ' +
          'There is no ocean on this planet without an orca in it.',
        'FENNEL: FIVE oceans. First digit. Five. Do you see it? I see it every single time.',
        'FENNEL: Except there is one in there.',
        'She points at the compound wall without looking at it.',
        'FENNEL: One orca. In a box. In the only ocean that is not an ocean.'
      ]
    }
  ]
};

/* --- 2nd digit: FOUR. Blue Water Bay, common dolphins. --- */
SU.data.npcs.odile = {
  name: 'Odile Pym', role: 'Secretary', zone: 'open_ocean',
  place: 'the Blue Water Bay rail',
  x: 43, y: 21, colour: '#f2a0c8', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 1.1, pause: [1.5, 3.5] },
  dialogue: [
    {
      when: { flags: { met_odile: false } },
      lines: [
        'Another fluro yellow shirt, another pair of neon pink trousers, this one sitting on the rail ' +
          'with a ring binder open on her knees.',
        'ODILE: Minutes of the meeting. Item one. Apologies for absence: everyone.',
        'ODILE: Odile. Secretary. I keep the minutes of a group that has never once achieved quorum.',
        'ODILE: We are called the Free Pod Collective. Fennel will tell you it is something else. ' +
          'Fennel was outvoted three to one and has not accepted the result.',
        'ODILE: The vote was on a Tuesday. Two of us were at netball. I am aware of the problem.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_odile', value: true },
        { type: 'addXP', amount: 15 }
      ]
    },
    {
      lines: [
        'ODILE: I hold the SECOND digit. Second of four. I did want first. Fennel had the pen.',
        'ODILE: Look at the flank on the one turning now. There is an hourglass down the side of her, ' +
          'and that hourglass is built out of FOUR panels.',
        'ODILE: Dark cape on top. Gold at the front. Grey behind it. White underneath. Four.',
        'ODILE: Four panels, second digit, FOUR. It is not a hard system. It is a very good system.',
        'ODILE: It is the only part of this organisation that works.'
      ]
    }
  ]
};

/* --- 3rd digit: TWO. The manta lagoon. --- */
SU.data.npcs.barty = {
  name: 'Barty Oon', role: 'Treasurer', zone: 'open_ocean',
  place: 'the manta lagoon deck',
  x: 42, y: 9, colour: '#e8e34a', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 1.05, pause: [2, 4] },
  dialogue: [
    {
      when: { flags: { met_barty: false } },
      lines: [
        'A boy in the fluro yellow and the neon pink is leaning over the lagoon rail with the deep ' +
          'calm of somebody who has been here since opening.',
        'BARTY: Barty. Treasurer. We have four dollars and sixty cents and a laminator.',
        'BARTY: The laminator was a mistake. I stand by it.',
        'BARTY: Ask me when the demonstration is. Go on. Ask me.',
        'BARTY: January, too hot. February, also too hot. March we had it locked in and then Sunny ' +
          'went to Bali.',
        'BARTY: It is going to be massive though.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_barty', value: true },
        { type: 'addXP', amount: 15 }
      ]
    },
    {
      lines: [
        'BARTY: Third digit. That is me. Third of four, which Odile says is the least important ' +
          'position, which is a thing you can only say if you are second.',
        'BARTY: Mine is the manta. Watch the front of her when she feeds.',
        'BARTY: Two horns. They are not horns, they are cephalic lobes, and they unroll into a funnel ' +
          'so she can hoover plankton through it. But everybody sees horns, which is how the whole ' +
          'family ended up called devil rays, which is frankly a slander.',
        'BARTY: TWO lobes. Third digit. Two.',
        'BARTY: Devil rays. Look at her. She could not devil anything.'
      ]
    }
  ]
};

/* --- 4th digit: THREE. The Pod Pool, pilot whales. --- */
SU.data.npcs.sunny = {
  name: 'Sunny Verge', role: 'Member', zone: 'open_ocean',
  place: 'the Pod Pool deck',
  x: 9, y: 30, colour: '#f2a0c8', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2.5, speed: 1.3, pause: [0.8, 2] },
  dialogue: [
    {
      when: { flags: { met_sunny: false } },
      lines: [
        'The fourth fluro yellow shirt of the day. This one is wearing it over a second shirt, in the ' +
          'heat, apparently on purpose.',
        'SUNNY: Sunny. Fourth member. Not fourth in importance. Fourth in the list. There is a list.',
        'SUNNY: Has anybody given you a date? Because I have been given a date four times and it has ' +
          'been a different date four times.',
        'SUNNY: Also it is thirty-one degrees. I am not demonstrating in thirty-one degrees. I will ' +
          'demonstrate at any temperature under twenty-six and I have put that in writing.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_sunny', value: true },
        { type: 'addXP', amount: 15 }
      ]
    },
    {
      lines: [
        'SUNNY: Last digit. Fourth. Which means if you have got this far you have already talked to ' +
          'three people in high-vis and you are committed now.',
        'SUNNY: Mine is the pilot whales. That is a family down there. A proper one.',
        'SUNNY: Grandmother, mother, calf. THREE generations, and none of them ever leave. Not the ' +
          'sons, not the daughters. Nobody moves out. Ever.',
        'SUNNY: Three generations, fourth digit, THREE.',
        'SUNNY: My nan lives with us, so honestly, I get it.',
        'SUNNY: There are two of them in that pool. Two. You cannot have three generations with two ' +
          'animals. Somebody is missing and nobody will tell me which one.'
      ]
    }
  ]
};
