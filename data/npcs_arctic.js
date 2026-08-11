/* ============================================================
   SEA UNIVERSE: ARCTIC COVE CAST

   Same shape as data/npcs.js; kept separate because that file was
   already close to a thousand lines.

   The brief for this zone was "more unusual and eccentric", so the
   cast is built around people who are each slightly too invested in
   one specific thing. That is also useful: an obsessive is the most
   natural way to hand a student a fact they will remember.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.npcs = SU.data.npcs || {};

/* ---------------------------------------------------------
   DR ENID FROST, Arctic zone manager.
   Grades ice out of ten, in a notebook, daily. The manager who
   can be turned: she has already objected in writing.
   --------------------------------------------------------- */
SU.data.npcs.frost = {
  name: 'Dr Enid Frost', role: 'Trainer-Manager', zone: 'arctic_cove',
  at: 'beluga_deck',
  x: 36, y: 16, colour: '#7fb0c6', reactsToSuspicion: true,
  movement: {
    type: 'patrol', speed: 1.1, pause: [1.5, 3],
    points: [{ x: 33, y: 16 }, { x: 39, y: 16 }]
  },
  dialogue: [
    {
      when: { quest: { q_arctic_induction: 'not_started' } },
      lines: [
        'A woman in a heavy coat is holding a lump of ice up to the light and frowning at it like a jeweller.',
        'FROST: Six. Six and a half at best. Too many bubbles, freezes too fast, shatters instead of shearing.',
        'FROST: You are the new one. Good. Ice is the whole zone, and nobody upstairs believes me.',
        'FROST: Before you touch an animal here you need Cold Water Handling. Husbandry and a little veterinary. ' +
          'Cold does unkind things to a body and I want you able to notice.',
        'FROST: Then go and look at Nuka. Marguerite says he has stopped hauling out and the notes say he is lazy. ' +
          'I have never met a lazy walrus. I have met a great many lazy assumptions.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_arctic_induction' },
        { type: 'discoverSpecies', id: 'walrus' }
      ]
    },
    {
      when: { quest: { q_arctic_induction: 'active' }, not: { qualification: 'cold_water_cert' } },
      lines: [
        'FROST: Certificate first. Husbandry two, veterinary one.',
        'FROST: I am not being bureaucratic. I am being unwilling to explain to your mother why you went in with a walrus.'
      ]
    },
    /* HAND-IN. This entry closes the quest, so it must fire while the
       quest is still ACTIVE. It used to test `completed`, which nothing
       else could ever make true: the quest sat one step from the end
       forever and Frost had nothing to say about it. */
    {
      when: { quest: { q_arctic_induction: 'active' },
              flags: { enc_wa_haulout_solved: true, frost_debrief: false } },
      lines: [
        'FROST: The ramp. Of course it was the ramp.',
        'FROST: They resurfaced it in October for slip liability. Nobody asked whether the animal could still use it. ' +
          'Six days of a nine hundred kilogram animal failing to get out of the water, written down as a personality trait.',
        'FROST: I grade the ice every morning because it is the one thing here I can still get right. ' +
          'Everything else I ask for comes back as "noted".',
        'FROST: Right. You can see, so you are useful. I am putting you on the beluga roster, and I am ' +
          'giving you a piece of advice: write down what you see on the day you see it.'
      ],
      onEnd: [
        { type: 'completeQuest', id: 'q_arctic_induction' },
        { type: 'setFlag', flag: 'frost_debrief', value: true },
        { type: 'setStoryStage', stage: 5 },
        { type: 'discoverSpecies', id: 'beluga' },
        { type: 'addSkillPoints', amount: 1 },
        { type: 'addXP', amount: 55 },
        { type: 'toast', text: 'Beluga roster access approved.' }
      ]
    },
    /* Cleared for the walrus but has not been to see him yet. Without
       this she falls through to her generic ice line, which reads like
       the quest has forgotten about itself. */
    {
      when: { quest: { q_arctic_induction: 'active' }, qualification: 'cold_water_cert' },
      lines: [
        'FROST: Certificate in hand. Good.',
        'FROST: Then go and stand at the haul-out and watch him try to get out of the water. ' +
          'Not the session notes. Him.'
      ]
    },
    {
      when: { evidence: 'ev_transfer_ledger' },
      lines: [
        'She reads it twice. She does not sit down, which somehow makes it worse.',
        'FROST: "Valuation pending." On Nuka.',
        'FROST: I declined that beluga loan three times. I put my objection in writing precisely so that a ' +
          'sentence like this could not appear without somebody having to walk past my name to write it.',
        'FROST: I am not going to tell you to be careful, because you clearly will not be. ' +
          'I will tell you that the objection is still pinned in the store, and that a copy of it is worth having.'
      ],
      onEnd: [
        { type: 'addEvidence', id: 'ev_frost_objection', once: 'frost_objection' },
        { type: 'addXP', amount: 50, once: 'frost_ledger' },
        { type: 'setFlag', flag: 'frost_turned', value: true }
      ]
    },
    {
      /* ---- NINE YEARS OF BARRY, four of five (quest q_deep_barry, Zone 5).
         Hoisted to the top of Frost's list at load time by the block at
         the bottom of data/npcs_deep.js, see the note there for why.
         Frost's is the coldest of the five, because she never believed
         him and simply kept the correspondence. She does not need to be
         persuaded of anything, which makes her the one who can explain
         what the set of five actually is. */
      when: { quest: { q_deep_barry: 'active' }, flags: { barry_frost: false } },
      lines: [
        'FROST: The advisory board.',
        'FROST: I was overruled by a veterinary advisory board. That is the phrase, verbatim, out of ' +
          'the letter. A board of veterinary professionals had considered my recommendation and did ' +
          'not support it.',
        'FROST: Fine. I have been overruled by better people than me before and I will be again.',
        'FROST: So I wrote back and asked who they were. Not to argue. Because if there is a vet in ' +
          'this country who looked at that animal\'s file and reached a different conclusion, I would ' +
          'genuinely like to know their name, and I would like to ring them up, and I would like to ' +
          'find out what I missed.',
        'She takes a plastic wallet off a shelf and puts it on the bench.',
        'FROST: That is what came back. Letterhead. Four lines. No names.',
        'FROST: I asked again. That is the second letter. There is no third letter, because there was ' +
          'no reply.',
        'FROST: Take copies of both.',
        'FROST: And here is the thing I want you to hear, because you are clearly collecting these ' +
          'and I can see it on you.',
        'FROST: On its own, this is a man being evasive in a letter. I have not been able to do a ' +
          'single thing with it for two years. If you have found others, then it is not evasive, it ' +
          'is a habit, and a habit is a completely different animal.'
      ],
      onEnd: [
        { type: 'addEvidence', id: 'ev_barry_frost' },
        { type: 'setFlag', flag: 'barry_frost', value: true },
        { type: 'addXP', amount: 80 }
      ]
    },
    {
      when: { quest: { q_deep_barry: 'active' }, flags: { barry_frost: true } },
      lines: [
        'FROST: How many have you got now.',
        'FROST: Do not tell me. Tell me when it is all of them.'
      ]
    },
    {
      lines: [
        'FROST: Today\'s ice is a seven. Clean shear, slow melt. Write that down somewhere, it is the best news in the park.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   RUNE HALVORSEN, beluga trainer. Hums to the belugas and
   refers to them by rank. Entirely serious about it.
   --------------------------------------------------------- */
SU.data.npcs.rune = {
  name: 'Rune Halvorsen', role: 'Trainer-Peer', zone: 'arctic_cove',
  place: 'the north promenade, above the beluga pool',
  x: 36, y: 6, colour: '#9fd2c4', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 1.0, pause: [1.5, 3] },
  dialogue: [
    {
      when: { flags: { met_rune: false } },
      lines: [
        'A man is standing at the rail humming a long descending note. Below him, something white rolls over to look at him.',
        'RUNE: Quiet. She is answering.',
        'RUNE: ... That was a greeting. Roughly. My accent is terrible.',
        'RUNE: Rune. Belugas. That is Sisu, who is a Senior Colleague, and the other one is Trond, ' +
          'who is a Junior Colleague and knows what he did.',
        'RUNE: You will hear people call them sea canaries. That is not a nickname somebody invented for a poster. ' +
          'Whalers named them that because through a wooden hull it sounds like an aviary down there.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_rune', value: true },
        { type: 'discoverSpecies', id: 'beluga' },
        { type: 'addXP', amount: 20 }
      ]
    },
    {
      when: { flags: { met_rune: true }, not: { quest: { q_arctic_song: 'completed' } } },
      lines: [
        'RUNE: Something is wrong with the singing.',
        'RUNE: Not less of it. Different. There is a note in it now that is not theirs, and I want to know where they got it.',
        'RUNE: Belugas learn what they sing. That is the whole miracle and it is also the whole problem, ' +
          'because in this pool there are two of them and no elders.'
      ],
      choices: [
        { text: 'Ask him what the note sounds like',
          reply: 'RUNE: Flat. Mechanical. No breath in it. Which should be impossible, because everything they say has breath in it.',
          effects: [{ type: 'startQuest', id: 'q_arctic_song' }] },
        { text: 'Ask why the belugas can turn their heads',
          reply: 'RUNE: Unfused neck vertebrae. Alone among the whales. She turns to look at you. Actually looks. ' +
                 'It is the single most unsettling thing about working with them and I would not trade it.' }
      ]
    },
    {
      lines: [
        'RUNE: Sisu is in a mood. She has turned her back on the gate, which she is physically able to do ' +
          'and enjoys far too much.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   MARGUERITE "MAGS" PEEL, walrus keeper, former competitive
   strongwoman, unashamedly in love with a walrus.
   --------------------------------------------------------- */
SU.data.npcs.mags = {
  name: 'Mags Peel', role: 'Trainer-Peer', zone: 'arctic_cove',
  at: 'walrus_deck',
  x: 10, y: 17, colour: '#d59a6a', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 1.15, pause: [1, 2.5] },
  dialogue: [
    {
      when: { flags: { met_mags: false } },
      lines: [
        'A very large woman is sitting on an upturned crate, arm-wrestling nobody, apparently for practice.',
        'MAGS: You the new one? Sit. No, stand. Whatever you like, I am not your mother.',
        'MAGS: Mags. That is Nuka. Fourteen, nine hundred kilos, and the single most sensitive animal in this park.',
        'MAGS: People see the tusks and think weapon. They are teeth. He hauls himself out on them and he sweeps ' +
          'the bottom with his whiskers, six hundred of them, and he can find a clam in the dark by feel alone.',
        'MAGS: And before you ask: no. He is not lazy. Somebody wrote that and I have not been the same since.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_mags', value: true },
        { type: 'discoverSpecies', id: 'walrus' },
        { type: 'addXP', amount: 20 }
      ]
    },
    {
      when: { evidence: 'ev_walrus_haulout' },
      lines: [
        'MAGS: You found it. The ramp.',
        'MAGS: I have carried him. I mean that literally, I have been in that water with a sling and four other people. ' +
          'And the whole time the note said "low motivation" and I could not prove otherwise.',
        'MAGS: You wrote it down. That is the difference. Nobody argues with a note.'
      ],
      onEnd: [
        { type: 'addXP', amount: 30, once: 'mags_haulout' },
        { type: 'addSkill', skill: 'husbandry', amount: 1, once: 'mags_haulout' }
      ]
    },
    {
      lines: ['MAGS: He rolled over for a belly scratch this morning. Nine hundred kilos. I nearly cried into my thermos.']
    }
  ]
};

/* ---------------------------------------------------------
   BO TRAN, refrigeration engineer. Convinced the Cold Store
   is haunted. Is, in fact, correct about every symptom.
   --------------------------------------------------------- */
SU.data.npcs.bo = {
  name: 'Bo Tran', role: 'Maintenance', zone: 'arctic_cove',
  place: 'the east promenade, by the gate',
  x: 44, y: 19, colour: '#6f8a9a', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 0.9, pause: [2, 4] },
  dialogue: [
    {
      when: { flags: { met_bo: false } },
      lines: [
        'A man in three coats is standing very still with his head tilted, listening to a wall.',
        'BO: Do not talk for a second.',
        'BO: ... There. You hear that? That is not a compressor noise. That is a moaning.',
        'BO: I have said it in two meetings. This building is haunted and everyone keeps sending me ' +
          'a link to an article about metal fatigue.',
        'BO: Bo. Refrigeration. If you are going in the store, take a parka off the rack in the block. ' +
          'And bring it back, because the last three did not.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_bo', value: true },
        { type: 'addXP', amount: 20 },
        { type: 'toast', text: 'There are parkas on the rack in the Arctic staff block.' }
      ]
    },
    {
      when: { flags: { met_bo: true }, quest: { q_arctic_haunting: 'not_started' } },
      lines: [
        'BO: Right. You have a notebook and no opinion yet, which makes you the perfect witness.',
        'BO: Three noises. The moaning, the knocking, and the one at three in the morning that I am not going to describe.',
        'BO: Find me what makes them. If it is ghosts, I want that on record. If it is not ghosts, ' +
          'I want that on record too, because then it is a fault and faults get budget.'
      ],
      onEnd: [{ type: 'startQuest', id: 'q_arctic_haunting' }]
    },
    {
      when: { quest: { q_arctic_haunting: 'completed' } },
      lines: [
        'BO: Expansion joint. Ice fall. And a duck.',
        'BO: A DUCK. In the plant room. For a fortnight.',
        'BO: I am not embarrassed. I am vindicated. Something WAS in there.',
        'BO: And you noticed the other thing, which is that Chiller 2 has been screaming for eleven weeks ' +
          'and the answer keeps coming back "noted". Write that one down properly.'
      ]
    },
    {
      when: { quest: { q_arctic_defrost: 'not_started' }, flags: { met_bo: true } },
      lines: [
        'BO: Oh no. Oh no no no.',
        'BO: Somebody has walked the length of the zone nudging every thermostat they passed, ' +
          'because they were cold, because it is an ARCTIC EXHIBIT.',
        'BO: Three of them. North, west, plaza. If I do not get them back before the store warms through, ' +
          'we lose the whole fish stock and I have to explain it to Guest Experience.',
        'BO: Go. Now. Please. I will owe you something enormous.'
      ],
      onEnd: [{ type: 'startQuest', id: 'q_arctic_defrost' }]
    },
    {
      lines: ['BO: Chiller 2 is at a hundred and eighteen percent. That is not a number. That is a cry for help.']
    }
  ]
};

/* ---------------------------------------------------------
   SISTER AGNES LOOM, visitor. Has adopted a harp seal in her
   own mind and knits for it. Funny, then quietly not.
   --------------------------------------------------------- */
SU.data.npcs.agnes = {
  name: 'Sister Agnes Loom', role: 'Visitor', zone: 'arctic_cove',
  at: 'seal_pen',
  x: 14, y: 6, colour: '#c08ab0', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 1.5, speed: 0.6, pause: [3, 6] },
  dialogue: [
    {
      when: { flags: { met_agnes: false } },
      lines: [
        'An elderly woman is holding a small knitted jumper up against the glass of the ice pen, ' +
          'squinting between the garment and the seal, checking the fit.',
        'AGNES: A little long in the arm. Well. Flipper.',
        'AGNES: That is Barnaby. He does not know he is called Barnaby. I have decided it is not important that he knows.',
        'AGNES: He looked cold, dear. On the Tuesday. He looked cold and nobody was doing anything about it, ' +
          'so I went home and I cast on.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_agnes', value: true },
        { type: 'discoverSpecies', id: 'harp_seal' },
        { type: 'addXP', amount: 20 }
      ]
    },
    {
      when: { flags: { met_agnes: true }, quest: { q_arctic_jumper: 'not_started' } },
      lines: [
        'AGNES: Now. You work here. You can get it onto him.',
        'AGNES: I will not be fobbed off with health and safety. I have been fobbed off by professionals, dear, ' +
          'and you are not yet very good at it.'
      ],
      choices: [
        { text: '"Let me find out properly first, and I\'ll come back and explain."',
          reply: 'AGNES: ... That is a better answer than the last four I got. Go on then. Facts. I like facts.',
          effects: [{ type: 'startQuest', id: 'q_arctic_jumper' }] },
        { text: '"Seals really don\'t get cold, they\'ve got blubber."',
          reply: 'AGNES: Everybody says blubber like it settles it. WHY does it settle it? ' +
                 'Nobody ever finishes the sentence.',
          effects: [{ type: 'startQuest', id: 'q_arctic_jumper' }] }
      ]
    },
    /* HAND-IN. Same bug as Frost and Kit: nothing else closes this. */
    {
      when: { quest: { q_arctic_jumper: 'active' }, flags: { enc_hs_heat_solved: true } },
      lines: [
        'AGNES: You came back. Nobody comes back.',
        'You explain it properly: the blubber, the flippers, the heaters, and what spreading them means.',
        'AGNES: ... Ah.',
        'AGNES: So he was not cold on the Tuesday. He was too warm, and I looked at him and saw a cold ' +
          'old man because that is what I am.',
        'AGNES: Well. That is worth knowing and I am glad somebody finally finished the sentence.'
      ],
      onEnd: [
        { type: 'completeQuest', id: 'q_arctic_jumper' }
      ]
    },
    {
      when: { quest: { q_arctic_jumper: 'completed' } },
      lines: [
        'AGNES: Several centimetres thick. And the flippers let the heat OUT, which is why he holds them like that.',
        'AGNES: So when he spreads them he is not waving. He is too warm.',
        'AGNES: ... They put those heaters in for us, did they. For the people. Next to an animal built for twenty below.',
        'AGNES: You keep that notebook, dear. I shall knit for the gift shop instead. They are always freezing in there ' +
          'and none of them are insulated in the slightest.'
      ]
    },
    {
      lines: ['AGNES: Barnaby did a barrel roll earlier. I have chosen to believe it was for me.']
    }
  ]
};

/* ---------------------------------------------------------
   KIT VASQUEZ, teenage volunteer, aggressively unimpressed,
   secretly extremely good at this.
   --------------------------------------------------------- */
SU.data.npcs.kit = {
  name: 'Kit Vasquez', role: 'Volunteer Guide', zone: 'arctic_cove',
  at: 'talk_arctic',
  x: 23, y: 20, colour: '#8f9ad4', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 1.5, pause: [0.8, 2] },
  dialogue: [
    {
      when: { flags: { met_kit: false } },
      lines: [
        'A teenager in a volunteer fleece three sizes too big is staring into the middle distance with the ' +
          'expression of someone serving a sentence.',
        'KIT: Forty hours. I need forty volunteer hours for the award and then I am never coming back.',
        'KIT: I am at thirty-one.',
        'KIT: ... The walrus is alright though. He does a thing with his whiskers.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_kit', value: true },
        { type: 'addXP', amount: 20 }
      ]
    },
    {
      when: { flags: { met_kit: true }, quest: { q_arctic_script: 'not_started' } },
      lines: [
        'KIT: Okay so. Do not be weird about this.',
        'KIT: I have the two o\'clock talk. I have never done a talk. And my script went in the recycling ' +
          'because I put it down on the recycling, which is, yes, thank you, I know.',
        'KIT: It is soaked. I can read every third line. I have twenty minutes and about a third of a talk.',
        'KIT: You know people here. Go and get me the actual facts and I will do the rest. ' +
          'Quickly though, because if Guest Experience sees me stood there like this I am finished.'
      ],
      onEnd: [{ type: 'startQuest', id: 'q_arctic_script' }]
    },
    /* HAND-IN. Conditions mirror the quest's first three steps, so the
       moment you have the script and have spoken to both keepers, Kit
       will take it. Nothing else closes this quest. */
    {
      when: { quest: { q_arctic_script: 'active' },
              hasItems: { talk_script: 1 },
              flags: { met_mags: true, met_rune: true } },
      lines: [
        'KIT: Have you got it? Tell me you have got it.',
        'You give Kit the pulped script and everything Mags and Rune filled in around it.',
        'KIT: Tusks are teeth. Whiskers do the finding. Six hundred of them. They learn what they sing.',
        'KIT: ... That is actually good. That is a talk.',
        'KIT: Right. Do not watch me do it. I mean it, if I can see you I will laugh.'
      ],
      onEnd: [
        { type: 'completeQuest', id: 'q_arctic_script' }
      ]
    },
    {
      when: { quest: { q_arctic_script: 'completed' } },
      lines: [
        'KIT: So I did the talk.',
        'KIT: And a kid asked why the beluga can turn its head and I KNEW. I actually knew.',
        'KIT: Do not make it a thing. It is not a thing.',
        'KIT: ... I put my hours up to fifty.'
      ]
    },
    {
      lines: ['KIT: Thirty-four hours. Not that I am counting. I am absolutely counting.']
    }
  ]
};

/* ---------------------------------------------------------
   BARRY C., beat #3. Openly transactional about animals.
   Reuses npc_barry.svg.
   --------------------------------------------------------- */
SU.data.npcs.barry_arctic = {
  name: 'Barry C.', role: 'CEO', zone: 'arctic_cove',
  sprite: 'barry',
  place: 'the south plaza',
  x: 24, y: 30, colour: '#4a6fa5', reactsToSuspicion: true,
  spawnCondition: { storyStage: { min: 5 }, flags: { barry_gone_3: false } },
  movement: {
    type: 'patrol', speed: 0.7, pause: [2, 4], loop: 'pingpong',
    points: [{ x: 21, y: 30 }, { x: 28, y: 30 }]
  },
  dialogue: [
    {
      when: { flags: { met_barry_3: false } },
      lines: [
        'BARRY: Cold, isn\'t it. Do you know what cold costs?',
        'BARRY: Four hundred thousand a year, this zone. Before staff. To keep an animal in an environment ' +
          'that this country is actively trying to stop existing.',
        'BARRY: And I am asked, constantly, whether that is sustainable. Which is a lovely word for a question ' +
          'about money.',
        'BARRY: The walrus is our most valuable single holding. Fourteen years old, in good condition, ' +
          'and every quarter he sits here he depreciates.',
        'BARRY: I said that out loud, didn\'t I. Well. You are staff. Staff understand that a park has to run.',
        'BARRY: Frost thinks I see stock. I see a balance sheet with a pulse, and I am the only person here ' +
          'willing to look at it.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_barry_3', value: true },
        { type: 'addEvidence', id: 'ev_transfer_ledger', once: 'barry3_hint' },
        { type: 'addXP', amount: 40 },
        { type: 'addSuspicion', amount: 5 },
        { type: 'toast', text: 'He said "holding". Wren will want that.' }
      ]
    },
    {
      lines: ['BARRY: Marvellous. Keep it up. And do shut the store door behind you, that is money leaking out.']
    }
  ]
};

/* ---------------------------------------------------------
   WREN, Arctic check-in. Reuses npc_wren.svg.
   --------------------------------------------------------- */
SU.data.npcs.wren_arctic = {
  name: 'Wren Halloran', role: 'Handler', zone: 'arctic_cove',
  sprite: 'wren',
  place: 'the south plaza',
  x: 26, y: 30, colour: '#b6d7c4', reactsToSuspicion: false,
  spawnCondition: { flags: { met_barry_3: true, wren_arctic_done: false } },
  movement: { type: 'wander', radius: 2, speed: 0.8, pause: [2, 5] },
  dialogue: [
    {
      when: { evidence: 'ev_transfer_ledger' },
      lines: [
        'WREN: You look like somebody who has read a ledger.',
        'WREN: "Valuation pending." Say it out loud a few times and it stops sounding like paperwork.',
        'WREN: This is the one, you know. Welfare gets argued about. People will tell you the pool is big enough ' +
          'and the standard is met and the animal seems happy. Nobody argues with a column headed ASSET.',
        'WREN: Frost objected in writing. That matters more than she thinks it does: it means somebody inside ' +
          'the building already said no, on paper, and was overruled.',
        'WREN: Get me her objection and the chiller log with it. Then we are not alleging anything. ' +
          'We are just showing people what they already wrote down.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'wren_arctic_briefed', value: true },
        { type: 'setStoryStage', stage: 6 },
        { type: 'startQuest', id: 'q_arctic_ledger' },
        { type: 'addXP', amount: 60, once: 'wren_arctic' },
        { type: 'toast', text: 'Collect the objection and the chiller log.' }
      ]
    },
    {
      lines: [
        'WREN: Do not stand still out here, it looks deliberate. Walk with me.',
        'WREN: Whatever they are doing in this zone, it is expensive, and expensive things get decisions made about them.'
      ]
    }
  ]
};
