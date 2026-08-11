/* ============================================================
   SEA UNIVERSE: SIDE QUEST CAST

   Eight visitors who want a favour. None of them know anything about
   the conspiracy and none of them ever find out, which is the point:
   the park is also just a place where people have a day out.

   Every one of them is right about something. The dad's panic is
   misplaced but his instinct is not, the old man's memory is
   accurate to the decade, the scout leader's worksheet really is
   wrong, and the woman who says the beluga said her name is closer
   to the truth than anybody standing near her.

   SELF-CONTAINED BY CONSTRUCTION. The objects these missions need
   are injected into their zones at the bottom of this file, and the
   trainers' answers are unshifted onto the front of their dialogue
   lists, exactly as data/npcs_kayla.js does. Nothing in any zone
   file or cast file had to be edited. Load order matters: this file
   must come AFTER every cast file in index.html.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.npcs = SU.data.npcs || {};

/* ================= COASTAL COVE ================= */

SU.data.npcs.gareth = {
  name: 'Gareth Ogilvie', role: 'Visitor', zone: 'coastal_cove',
  place: 'the otter habitat rail',
  x: 29, y: 20, colour: '#c4a882', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 1.5, speed: 1.0, pause: [0.5, 1.5] },
  dialogue: [
    {
      when: { quest: { q_side_child: 'active' }, flags: { sq_child_out: true } },
      lines: [
        'GARETH: OSCAR.',
        'He does the thing parents do, where the hug and the telling-off happen at the same time and ' +
          'neither one lands properly.',
        'GARETH: You do not go over a fence. You do not ever go over a fence.',
        'OSCAR: There was a rock and he wanted it.',
        'GARETH: I do not care about the rock.',
        'OSCAR: He DID want it though.',
        'Gareth looks at you over the top of his son\'s head with an expression of total exhaustion ' +
          'and total relief.',
        'GARETH: Thank you. Genuinely. I had got to the bit where you start thinking about the water.',
        'He presses a folded note into your hand before you can decline it.'
      ],
      onEnd: [{ type: 'completeQuest', id: 'q_side_child' }]
    },
    {
      when: { quest: { q_side_child: 'active' } },
      lines: [
        'GARETH: Have you found him? Blue shirt. Dinosaur on it. Answers to Oscar, or does not, ' +
          'depending entirely on his mood.'
      ]
    },
    {
      when: { quest: { q_side_child: 'not_started' } },
      lines: [
        'A man is walking the rail at the otter habitat in the way people walk when they are trying ' +
          'very hard not to run.',
        'GARETH: Sorry. Sorry. You work here? My son. He was right here.',
        'GARETH: Six. Blue shirt, dinosaur on it. He was asking me why the otter keeps a rock and I ' +
          'said I did not know, and I looked at my phone for one second.',
        'GARETH: I am not that parent. I want you to know I am not that parent.',
        'He is very obviously about to become that parent.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_side_child' },
        { type: 'addXP', amount: 5 }
      ]
    },
    {
      lines: [
        'GARETH: He has asked me about the rock four more times.',
        'GARETH: I have told him it is the otter\'s favourite and he has accepted that completely, ' +
          'which is more than he does for anything I say about bedtime.'
      ]
    }
  ]
};

SU.data.npcs.oscar = {
  name: 'Oscar', role: 'Visitor', zone: 'coastal_cove',
  place: 'inside the otter habitat, regrettably',
  x: 30, y: 19, colour: '#7fb3e0', reactsToSuspicion: false,
  spawnCondition: { quest: { q_side_child: 'active' }, flags: { sq_child_out: false } },
  movement: { type: 'wander', radius: 1, speed: 0.9, pause: [1, 2] },
  dialogue: [
    {
      /* Tests the flag it sets, so the XP cannot be farmed by walking
         away and talking to him again. The validator enforces this.
         The plain entry below is the fallback once he has been found. */
      when: { flags: { sq_child_found: false } },
      lines: [
        'There is a six-year-old sitting on the wrong side of the otter habitat fence, perfectly calm, ' +
          'with his arms round his knees.',
        'OSCAR: I am not stuck. I want to say that first.',
        'OSCAR: I climbed over on purpose and I can climb back but the bit on this side is higher and ' +
          'I have decided to wait.',
        'An otter is sitting about two metres away, entirely unbothered, holding a rock.',
        'OSCAR: That is his rock. He has had it the whole time. He keeps it under his arm.',
        'OSCAR: I wanted to see if he had a different one and he does not. It is the same one.',
        'He is, annoyingly, correct, and it is the most interesting thing anybody has said to you today.',
        'OSCAR: Do not tell my dad I said the fence was easy.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'sq_child_found', value: true },
        { type: 'addXP', amount: 10 }
      ]
    },
    {
      lines: [
        'OSCAR: I already said. I am not coming out until someone comes and gets me properly.'
      ]
    }
  ]
};

SU.data.npcs.vic = {
  name: 'Vic Trelawney', role: 'Visitor', zone: 'coastal_cove',
  place: 'the sea lion stadium rail',
  x: 8, y: 13, colour: '#9aa8b4', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 1.5, speed: 0.9, pause: [1.5, 3] },
  dialogue: [
    {
      when: { quest: { q_side_ring: 'active' }, hasItems: { wedding_ring: 1 } },
      lines: [
        'You hand it over. He does not put it on straight away. He holds it for a bit first.',
        'VIC: Forty-one years.',
        'VIC: She would have found this very funny. She would have wanted to know the sea lion\'s name.',
        'VIC: Did they say the name?',
        'You tell him it was Bruno.',
        'VIC: Bruno. Right.',
        'He puts it back on and gives the rail a small pat, as if concluding some business with it.',
        'VIC: Let me give you something for your trouble and do not argue with me about it, because ' +
          'I have been arguing about things for forty-one years and I am extremely good at it.'
      ],
      onEnd: [
        { type: 'takeItem', id: 'wedding_ring' },
        { type: 'completeQuest', id: 'q_side_ring' }
      ]
    },
    {
      when: { quest: { q_side_ring: 'active' } },
      lines: [
        'VIC: Any joy? I have been leaning on this rail so long the paint has come off on my jacket.'
      ]
    },
    {
      when: { quest: { q_side_ring: 'not_started' } },
      lines: [
        'An older man is standing at the stadium rail being extremely calm in the way people are when ' +
          'they are not calm at all.',
        'VIC: I have done something stupid and I would like to do it quietly.',
        'VIC: My ring. It came off over the rail. My hands have got thinner, apparently, which is news ' +
          'to me and not welcome news.',
        'VIC: I have been told by a young man with a mop that it is gone and that things go down the ' +
          'drain and that is that.',
        'VIC: I do not want to make a fuss. But it is forty-one years and I would like somebody to at ' +
          'least have a look.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_side_ring' },
        { type: 'addXP', amount: 5 }
      ]
    },
    {
      lines: [
        'VIC: Still here. I have decided to watch a whole show, which she would also have found funny, ' +
          'because I have never once sat through anything voluntarily.'
      ]
    }
  ]
};

/* ================= CORAL KINGDOM ================= */

SU.data.npcs.vernon = {
  name: 'Vernon Slee', role: 'Visitor', zone: 'coral_kingdom',
  place: 'the mangrove boardwalk',
  x: 18, y: 22, colour: '#b0a08c', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 1.5, speed: 0.8, pause: [2, 4] },
  dialogue: [
    {
      when: { quest: { q_side_eggcase: 'active' }, flags: { sq_eggcase_id: true } },
      lines: [
        'VERNON: Say it again.',
        'You say it again. A Port Jackson shark egg case. A spiral, so the mother can screw it down ' +
          'into a crack in the rock and the sea cannot take it.',
        'VERNON: A shark.',
        'VERNON: It was a SHARK.',
        'He turns round and says it to his granddaughter, at some volume, twice.',
        'VERNON: Fifty-one years I have been saying I saw a corkscrew in a rock pool and fifty-one ' +
          'years everybody has been very kind to me about it.',
        'VERNON: Right. Where is it. You said there is one in there now.',
        'He is already walking. He is quite fast for a man of eighty-four.',
        'VERNON: Here. Take this. Buy yourself something. I am going to go and look at a shark egg.'
      ],
      onEnd: [{ type: 'completeQuest', id: 'q_side_eggcase' }]
    },
    {
      when: { quest: { q_side_eggcase: 'active' } },
      lines: [
        'VERNON: The diver lad. The one with the wetsuit half off. He will know.'
      ]
    },
    {
      when: { quest: { q_side_eggcase: 'not_started' } },
      lines: [
        'An elderly man is standing very still on the boardwalk with his hands behind his back. A ' +
          'younger woman beside him has the expression of somebody thirty minutes into a conversation.',
        'VERNON: You work here. Good. Settle something.',
        'VERNON: 1974. I was here on the coast with my brother and there was a thing in a rock pool. ' +
          'Like a corkscrew. Like a screw made out of seaweed, about so big, wedged down in a crack.',
        'VERNON: And I have said this for fifty years and everybody says lovely, Grandad.',
        'GRANDDAUGHTER: Nobody says lovely, Grandad.',
        'VERNON: You say it with your face.',
        'VERNON: Find me somebody who works with the fish and ask them. That is all I want.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_side_eggcase' },
        { type: 'addXP', amount: 5 }
      ]
    },
    {
      lines: [
        'VERNON: I have been back twice. They let me look at it for as long as I want.',
        'VERNON: My brother died in \'09 and he never believed me either. That is the only bit that ' +
          'is a shame.'
      ]
    }
  ]
};

SU.data.npcs.ama = {
  name: 'Dr Ama Osei', role: 'Researcher', zone: 'coral_kingdom',
  place: 'the lagoon viewing rail',
  x: 28, y: 17, colour: '#8fc4b0', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 1.1, pause: [1, 2.5] },
  dialogue: [
    {
      when: { quest: { q_side_calls: 'active' },
              flags: { sq_call_bottlenose: true, sq_call_beluga: true, sq_call_pilot: true } },
      lines: [
        'AMA: All three? In one day?',
        'She plugs the recorder in and listens to about nine seconds of each, and her whole face changes.',
        'AMA: Right. So. What you have got there is three completely different solutions to the same ' +
          'problem, which is that water is dark and sound is not.',
        'AMA: The bottlenose are doing signature whistles. Each animal has one, it is effectively a ' +
          'name, and they use each other\'s. They call for one another by name.',
        'AMA: The belugas are doing everything. That is the polite way of putting it. Enormous range, ' +
          'and they copy what they hear, including things that are not belugas.',
        'AMA: And the pilot whales are the interesting one, because the calls run in the family. ' +
          'Different pods have different repertoires and they learn them from their mothers.',
        'AMA: Which is culture. I am not allowed to write culture in a funding application but that ' +
          'is what it is.',
        'She takes the recorder back and hands you the fee she was never going to get to spend on a ' +
          'research assistant.'
      ],
      onEnd: [
        { type: 'takeItem', id: 'field_recorder' },
        { type: 'completeQuest', id: 'q_side_calls' }
      ]
    },
    {
      when: { quest: { q_side_calls: 'active' } },
      lines: [
        'AMA: Three different species. Not three recordings of the same animal being loud.',
        'AMA: The dolphins here, the belugas up in the cold one, and the pilot whales in the big new ' +
          'wing. Drop the hydrophone in and give it a minute.'
      ]
    },
    {
      when: { quest: { q_side_calls: 'not_started' } },
      lines: [
        'A woman is crouched at the rail with a coil of cable and an expression of contained fury.',
        'AMA: Do not worry, I have permission. I have a letter. The letter took four months.',
        'AMA: Ama Osei. I study marine mammal vocal communication, which everybody here has decided ' +
          'means I am here to make the dolphins talk.',
        'AMA: I am not. I am here because three species in this park have completely different ways of ' +
          'organising sound and I have one afternoon.',
        'AMA: And I have hurt my knee getting down here, which is not in the letter.',
        'She looks at your lanyard for slightly too long.',
        'AMA: You can walk. Would you like a job? It does not pay. It pays a little.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_side_calls' },
        { type: 'giveItem', id: 'field_recorder' },
        { type: 'addXP', amount: 10 }
      ]
    },
    {
      lines: [
        'AMA: I have written it up. Nobody here has asked to read it.',
        'AMA: The pilot whale material is the part that will matter in ten years. Remember I said that.'
      ]
    }
  ]
};

/* ================= ARCTIC COVE ================= */

SU.data.npcs.bev = {
  name: 'Bev Nkemelu', role: 'Visitor', zone: 'arctic_cove',
  place: 'the beluga viewing rail',
  x: 35, y: 19, colour: '#d4a0c0', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 1.5, speed: 1.0, pause: [1, 3] },
  dialogue: [
    {
      when: { quest: { q_side_beluga: 'active' }, flags: { sq_beluga_mimic: true } },
      lines: [
        'BEV: I am listening.',
        'You tell her what Rune said. That belugas are vocal learners. That they copy what is around ' +
          'them. That there was one in the United States recorded imitating human speech so well that ' +
          'a diver surfaced because he thought he had been told to get out of the water.',
        'BEV: (very quietly) Ha.',
        'BEV: Say the diver bit again.',
        'You say the diver bit again.',
        'BEV: Right. I want you to understand that I am not going to be normal about this.',
        'BEV: I have been coming here on Thursdays for two years and I have told exactly nobody, ' +
          'because when you say a whale said your name people take your cup off you.',
        'She looks at the pool for a while.',
        'BEV: He will not say it was my name, will he.',
        'BEV: No. Good. I would not trust him if he did.'
      ],
      onEnd: [{ type: 'completeQuest', id: 'q_side_beluga' }]
    },
    {
      when: { quest: { q_side_beluga: 'active' } },
      lines: [
        'BEV: The one who hums. Ask the one who hums. He has heard it, I can tell he has heard it.'
      ]
    },
    {
      when: { quest: { q_side_beluga: 'not_started' } },
      lines: [
        'A woman at the beluga rail turns round the moment you are within range, as though she has ' +
          'been waiting for a lanyard for some time.',
        'BEV: Right. I am going to say a thing and I need you to not do the face.',
        'BEV: That one said my name.',
        'BEV: Bev. It said Bev. Not a noise like Bev. It said Bev, twice, and then went and did a ' +
          'circuit and came back and did it again.',
        'BEV: My daughter says it is the filtration.',
        'BEV: It is not the filtration. I know what the filtration sounds like. I have been coming ' +
          'here on Thursdays for two years.',
        'BEV: Ask somebody. Ask somebody who actually knows and come back and tell me I am mad.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_side_beluga' },
        { type: 'addXP', amount: 5 }
      ]
    },
    {
      lines: [
        'BEV: Thursdays. Same bench. He knows the coat, I reckon, more than the face.',
        'BEV: I have started saying good morning back. I am aware of how that sounds and I have made ' +
          'my peace with it.'
      ]
    }
  ]
};

SU.data.npcs.denny = {
  name: 'Denny Fairbairn', role: 'Visitor', zone: 'arctic_cove',
  place: 'the entry plaza',
  x: 21, y: 28, colour: '#9ab87f', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 1.5, speed: 1.2, pause: [0.5, 1.5] },
  dialogue: [
    {
      when: { quest: { q_side_sheet: 'active' }, flags: { sq_sheet_signed: true } },
      lines: [
        'You hand over the correction. Signed, dated, and considerably more detailed than required.',
        'DENNY: (reading) "The tusks are not used for digging. Walruses locate buried clams with their ' +
          'vibrissae and extract the flesh by suction. The tusks are used for hauling out onto ice and ' +
          'in display."',
        'DENNY: Suction.',
        'DENNY: It sucks them out of the shell.',
        'He looks up at the haul-out with the expression of a man whose afternoon has been redeemed.',
        'DENNY: That is better than the wrong answer. That is so much better than the wrong answer.',
        'DENNY: Right, you lot, question four is CANCELLED, and I am going to read you something.',
        'A distant groan of eleven-year-olds, which shortly afterwards becomes interested noise.',
        'DENNY: Take this. It is scout funds and I will square it with the treasurer, who is me.'
      ],
      onEnd: [{ type: 'completeQuest', id: 'q_side_sheet' }]
    },
    {
      when: { quest: { q_side_sheet: 'active' } },
      lines: [
        'DENNY: The walrus keeper. In writing, please. If it is not in writing it is my word against ' +
          'a printed sheet and I lose that one every time.'
      ]
    },
    {
      when: { quest: { q_side_sheet: 'not_started' } },
      lines: [
        'A man in a fleece is holding a thick stack of worksheets and staring at the top one as though ' +
          'it has personally wronged him.',
        'DENNY: Denny. Scouts. Thirty-one of them and I can see four.',
        'DENNY: Question four. "The walrus uses its tusks to dig for food. True or false."',
        'DENNY: The answer sheet says true. A woman who works here has just told me, very nicely, ' +
          'that it is false.',
        'DENNY: Thirty-one of them have written true. Because I told them to. Because it is on the sheet.',
        'DENNY: I cannot stand up in front of them and say I was wrong with nothing in my hand. They ' +
          'are eleven. They will eat me.',
        'DENNY: Get me it in writing. Signed. From somebody who touches the walrus.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_side_sheet' },
        { type: 'addXP', amount: 5 }
      ]
    },
    {
      lines: [
        'DENNY: Four of them have asked me what vibrissae means. FOUR.',
        'DENNY: I have printed the correction on the back of next term\'s sheet. It is staying on ' +
          'there permanently now.'
      ]
    }
  ]
};

/* ================= OPEN OCEAN ================= */

SU.data.npcs.ros = {
  name: 'Ros Cardew', role: 'Visitor', zone: 'open_ocean',
  place: 'the manta lagoon rail',
  x: 40, y: 20, colour: '#e0b48f', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 1.5, speed: 1.1, pause: [1, 2.5] },
  dialogue: [
    {
      when: { quest: { q_side_manta: 'active' }, flags: { sq_manta_photo: true } },
      lines: [
        'ROS: Let me see. Let me SEE.',
        'She holds the camera at arm\'s length, then close, then at arm\'s length again.',
        'ROS: That is a duck.',
        'HAMISH: (from several metres away, without turning round) It is not a duck.',
        'ROS: It has got a beak and an eye and it is a duck.',
        'ROS: Hang on. What is that writing on the tank sign.',
        'She reads it. She reads it again.',
        'ROS: Every one of them is different? Like a fingerprint? And they photograph the bellies to ' +
          'tell them apart, and the photographs go in a catalogue?',
        'ROS: So this is DATA now. My holiday photo is data.',
        'ROS: Hamish. HAMISH. We are in a catalogue.',
        'HAMISH: We are not in a catalogue, the fish is in a catalogue.',
        'ROS: It is a ray, Hamish.',
        'She gives you twenty dollars in a way that suggests she has not thought about it at all.'
      ],
      onEnd: [{ type: 'completeQuest', id: 'q_side_manta' }]
    },
    {
      when: { quest: { q_side_manta: 'active' } },
      lines: [
        'ROS: Have you got it? You need to be under her. The spots are on the underneath.',
        'ROS: And you will need an actual camera, my phone just does a white smudge.'
      ]
    },
    {
      when: { quest: { q_side_manta: 'not_started' } },
      lines: [
        'A woman at the lagoon rail spots your lanyard with the speed of a hawk.',
        'ROS: You. Official person. We need a ruling.',
        'ROS: We are on our honeymoon. Day nine. We have been standing here for an hour.',
        'ROS: The spots on the bottom of that ray look like a duck. My husband says they look like ' +
          '"nothing, Ros, they look like spots".',
        'HAMISH: (distantly) They look like spots.',
        'ROS: We need a photograph. A proper one, of the underneath, so I can win.',
        'ROS: This is the only thing we have disagreed about since the wedding and I would like to ' +
          'settle it before we get to the ten day mark.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_side_manta' },
        { type: 'addXP', amount: 5 }
      ]
    },
    {
      lines: [
        'ROS: I have emailed them. The catalogue people. I have not heard back.',
        'ROS: If they name her Duck I will consider the honeymoon a complete success.'
      ]
    }
  ]
};

/* ================= THE DEEP ================= */

SU.data.npcs.lulu = {
  name: 'Lulu Grange', role: 'Visitor', zone: 'the_deep',
  place: 'the east rail',
  x: 31, y: 24, colour: '#c48fb0', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 1.5, speed: 1.0, pause: [1.5, 3] },
  dialogue: [
    {
      when: { quest: { q_side_painting: 'active' }, hasItems: { binned_painting: 1 } },
      lines: [
        'LULU: Oh thank God. Oh, it is damp. That is fine. That is character now.',
        'She holds it up against the actual animal, which is a thing you have never seen anybody do.',
        'LULU: There. Look at the trailing edge. Everybody paints a fluke like a smooth heart shape ' +
          'and it is not, it is notched all the way along, and the notches are individual.',
        'LULU: That is how the whale people tell them apart. The pattern on the underside and the ' +
          'shape of the nicks. It is a face, essentially. I was painting her face.',
        'LULU: And I binned it because I thought the water was muddy. The water IS muddy. The water ' +
          'is meant to be muddy, it is a flooded quarry.',
        'She is quiet for a moment.',
        'LULU: I do this. I make a thing and then I have twenty minutes of certainty that it is ' +
          'rubbish, and if there is a bin within reach that is the end of the thing.',
        'LULU: You have interrupted twenty minutes. Let me pay you for the twenty minutes.'
      ],
      onEnd: [
        { type: 'takeItem', id: 'binned_painting' },
        { type: 'completeQuest', id: 'q_side_painting' }
      ]
    },
    {
      when: { quest: { q_side_painting: 'active' } },
      lines: [
        'LULU: The bin by the rail. The one with the lid that does not shut.',
        'LULU: If somebody has emptied it I am going to sit down on the ground.'
      ]
    },
    {
      when: { quest: { q_side_painting: 'not_started' } },
      lines: [
        'A woman with paint on three fingers and a folding stool under one arm is standing at the ' +
          'rail looking at a bin.',
        'LULU: Do not judge me.',
        'LULU: I have thrown a painting in that bin. About an hour ago. I have been standing here ' +
          'since and I am now certain it was the best thing I have ever done.',
        'LULU: It was the fluke. The tail. I got the bumps right, the notches along the back edge, ' +
          'and I have never once got them right before.',
        'LULU: I cannot reach it. I have tried. There is a woman in a hi-vis who has already watched ' +
          'me try and I am not doing it in front of her again.',
        'LULU: You have got a lanyard. A lanyard can go in a bin. That is the whole system.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_side_painting' },
        { type: 'addXP', amount: 5 }
      ]
    },
    {
      lines: [
        'LULU: I have started another one. I am not throwing this one anywhere.',
        'LULU: I have given the stool to the woman in the hi-vis. She has been standing up since March.'
      ]
    }
  ]
};

/* ============================================================
   OBJECTS these missions need, injected into their zones so no
   zone file had to be edited. Pushed at load time, before the
   validator runs.
   ============================================================ */

SU.data.sideObjects = [
  { zone: 'coral_kingdom', o: {
    id: 'rec_coral', x: 30, y: 14, kind: 'station', name: 'Hydrophone Drop: Dolphin Lagoon',
    requires: { hasItems: { field_recorder: 1 } },
    deniedText: 'You would need something to record with, and a reason.',
    text: 'You feed the hydrophone over the rail and let it hang.\n\n' +
          'It is not what you expected. Not song, not chatter. Short flat whistles, each one ' +
          'repeated, each one different, and every so often another animal answers with the same ' +
          'shape of whistle back.\n\n' +
          'It sounds, unavoidably, like people saying names across a car park.',
    effects: [
      { type: 'setFlag', flag: 'sq_call_bottlenose', value: true },
      { type: 'addXP', amount: 10, once: 'rec_coral' }
    ] } },

  { zone: 'arctic_cove', o: {
    id: 'rec_arctic', x: 33, y: 16, kind: 'station', name: 'Hydrophone Drop: Beluga Pool',
    requires: { hasItems: { field_recorder: 1 } },
    deniedText: 'You would need something to record with, and a reason.',
    text: 'The hydrophone goes in and the needle immediately pins.\n\n' +
          'Whistles, clicks, a descending moan, something that is almost a creaking door, and then ' +
          'a run of notes so close to a person humming that you take the headphones off and look ' +
          'around.\n\n' +
          'Nobody is humming. Rune is at the far end of the deck with his back to you.',
    effects: [
      { type: 'setFlag', flag: 'sq_call_beluga', value: true },
      { type: 'addXP', amount: 10, once: 'rec_arctic' }
    ] } },

  { zone: 'open_ocean', o: {
    id: 'rec_ocean', x: 12, y: 22, kind: 'station', name: 'Hydrophone Drop: Pod Pool',
    requires: { hasItems: { field_recorder: 1 } },
    deniedText: 'You would need something to record with, and a reason.',
    text: 'Long rising calls, and underneath them a rattle of clicks so fast it reads as a single ' +
          'tone.\n\n' +
          'The two animals in the pool call and answer, call and answer, in a pattern that repeats ' +
          'and repeats.\n\n' +
          'Then one of them stops, and the other one carries on doing both halves for a while.',
    effects: [
      { type: 'setFlag', flag: 'sq_call_pilot', value: true },
      { type: 'addXP', amount: 10, once: 'rec_ocean' }
    ] } },

  { zone: 'open_ocean', o: {
    id: 'manta_belly_spot', x: 38, y: 19, kind: 'station', name: 'Under the Manta',
    requires: { hasItems: { camera: 1 } },
    deniedText: 'You could see the pattern from here if you had something to photograph it with.',
    text: 'You wait until she banks over the viewing panel and take the shot from underneath.\n\n' +
          'The belly comes out crisp: a scatter of dark spots between the gill slits, in a pattern ' +
          'that belongs to her and to no other manta anywhere.\n\n' +
          'It does look a bit like a duck.',
    effects: [
      { type: 'setFlag', flag: 'sq_manta_photo', value: true },
      { type: 'discoverSpecies', id: 'reef_manta' },
      { type: 'addXP', amount: 10, once: 'manta_photo' }
    ] } },

  { zone: 'the_deep', o: {
    id: 'deep_bin', x: 25, y: 25, kind: 'search', name: 'Bin By The Rail', once: true,
    text: 'The lid does not shut, which is how the rain got in and how you can see the corner of ' +
          'heavy paper down the side.\n\n' +
          'You fish it out. Watercolour, damp on one corner, of a humpback fluke going down.',
    loot: [{ item: 'binned_painting', qty: 1 }] } }
];

/* ============================================================
   THE TRAINERS' ANSWERS, hoisted. Same construction as Kayla's:
   gated on the quest being ACTIVE and the flag being unset, so
   each fires once and then leaves the character alone forever.
   ============================================================ */

SU.data.sideQuestions = [
  { npc: 'milo', flag: 'sq_child_out', quest: 'q_side_child',
    when: { flags: { sq_child_found: true, sq_child_out: false } },
    lines: [
      'You tell Milo there is a six-year-old in the otter habitat.',
      'MILO: Right. Yep. Walking, not running, because running makes it a Thing.',
      'He is already moving, and he is already very calm, which tells you this is not the first time.',
      'MILO: They are not dangerous to him, before you ask. They are extremely dangerous to a clam. ' +
        'But they are wild animals with a very good set of teeth and they have not agreed to any ' +
        'of this.',
      'MILO: The bigger problem is the other way round. He is enormous and loud and he is standing ' +
        'in the one bit of the habitat they go to when they want to be left alone.',
      'He lifts Oscar out over the fence in one movement, sets him down, and crouches to his level.',
      'MILO: Good climbing. Genuinely. Never do it again.',
      'OSCAR: He has a favourite rock.',
      'MILO: He does have a favourite rock. He has had it since March and he will fight you for it.',
      'MILO: Come round the front and I will show you where he keeps it.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'sq_child_out', value: true }, { type: 'addXP', amount: 15 }] },

  { npc: 'dana', flag: 'sq_ring_found', quest: 'q_side_ring',
    lines: [
      'You ask Dana whether anything can be done about a ring that went over the stadium rail.',
      'DANA: Down the drain, or down a sea lion?',
      'She says it completely flatly, and then registers your expression.',
      'DANA: I am not joking. They pick things up. Everything goes in the mouth first, that is how ' +
        'they find out what a thing is, and if they like it they keep it.',
      'DANA: Bruno has a collection. I have had two phones, a hair clip and a set of car keys out ' +
        'of him and he has never once been pleased about it.',
      'She walks out onto the stage, holds out a flat hand, and says nothing at all.',
      'DANA: We ask. That is the whole job. I cannot take it off him and I would not, because the ' +
        'day I start taking things is the day he stops bringing them.',
      'A long pause. A very long pause. Bruno considers his position.',
      'DANA: There we are. Good lad. That was hard and you did it.',
      'She drops a warm, extremely slobbery gold band into your palm.',
      'DANA: Tell him it took thirty seconds. It did not take thirty seconds.'
    ],
    onEnd: [
      { type: 'setFlag', flag: 'sq_ring_found', value: true },
      { type: 'giveItem', id: 'wedding_ring' },
      { type: 'addTrust', species: 'california_sea_lion', amount: 5 },
      { type: 'addXP', amount: 15 }
    ] },

  { npc: 'jarrah', flag: 'sq_eggcase_id', quest: 'q_side_eggcase',
    lines: [
      'You describe it to Jarrah. A corkscrew, in a rock pool, about the size of a hand.',
      'JARRAH: Oh, that is a Port Jackson egg. That is a shark.',
      'JARRAH: Sorry, you have gone a bit still. Is that a big deal?',
      'You explain about the fifty-one years.',
      'JARRAH: Ohhh. Oh, that is brilliant.',
      'JARRAH: Right, so: Port Jackson sharks lay eggs, which already surprises people, and the case ' +
        'is a spiral. An actual screw thread.',
      'JARRAH: And the mother takes it in her mouth and screws it down into a crack in the rock. On ' +
        'purpose. So the surf cannot roll it away.',
      'JARRAH: It is the only shark I know of that does building work.',
      'JARRAH: And tell him there is one in the touch pool right now, back left, behind the ledge. ' +
        'I put it there myself.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'sq_eggcase_id', value: true }, { type: 'addXP', amount: 15 }] },

  { npc: 'rune', flag: 'sq_beluga_mimic', quest: 'q_side_beluga',
    lines: [
      'You ask Rune whether a beluga could say a person\'s name.',
      'RUNE: (stops humming) Who has heard it.',
      'You tell him about Bev. He does not laugh, which you were half expecting.',
      'RUNE: Belugas are vocal learners. They copy. Not just each other, whatever is around them, ' +
        'and they have the range to do it.',
      'RUNE: There was one in America called NOC. He copied people so well that a diver came up out ' +
        'of the water because he was certain somebody had told him to get out.',
      'RUNE: It was the whale. They recorded it. You can hear it and it is genuinely unsettling.',
      'RUNE: So can this one make a noise shaped like Bev? Yes. Easily.',
      'RUNE: Does he know it is her? That I cannot tell you, and I am not going to pretend I can.',
      'He goes quiet for a moment.',
      'RUNE: I will say this. He is at that rail on a Thursday and he is not at it on a Tuesday.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'sq_beluga_mimic', value: true }, { type: 'addXP', amount: 15 }] },

  { npc: 'mags', flag: 'sq_sheet_signed', quest: 'q_side_sheet',
    lines: [
      'You ask Mags to put the tusk correction in writing.',
      'MAGS: For the scout man? He has already been over. He took it very hard.',
      'MAGS: Right, the actual answer, and then I will write it down properly.',
      'MAGS: He does not dig with them. People think he does because they are enormous and they ' +
        'point at the ground, but the tusks would snap.',
      'MAGS: He finds the clams with his face. Those whiskers are not decoration, they are one of ' +
        'the most sensitive things going, and he sweeps the bottom with them in the dark.',
      'MAGS: And then he does not crack the shell. He puts his mouth over it, pulls his tongue back ' +
        'like a piston, and sucks the animal straight out of it.',
      'MAGS: Thousands of them. In a day.',
      'MAGS: The tusks are for getting out of the water and for arguing with other walruses about ' +
        'who is the biggest walrus.',
      'She writes it out, signs it, dates it, and adds her position underneath without being asked.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'sq_sheet_signed', value: true }, { type: 'addXP', amount: 15 }] }
];

/* Inject the objects, then hoist the answers. */
(function wireSideQuests() {
  SU.data.sideObjects.forEach(entry => {
    const z = SU.data.zones[entry.zone];
    if (!z) { console.warn('[SU] side quests: no zone', entry.zone); return; }
    (z.objects = z.objects || []).push(entry.o);
  });

  SU.data.sideQuestions.forEach(q => {
    const npc = SU.data.npcs[q.npc];
    if (!npc || !npc.dialogue) {
      console.warn('[SU] side quests: cannot hoist onto missing NPC', q.npc);
      return;
    }
    /* Default gate: quest active and this answer not yet given. An entry
       can override with its own `when` if it needs a further condition,
       as the lost-child one does. */
    let cond = q.when;
    if (!cond) { cond = { flags: {} }; cond.flags[q.flag] = false; }
    cond.quest = cond.quest || {};
    cond.quest[q.quest] = 'active';
    npc.dialogue.unshift({ when: cond, lines: q.lines, onEnd: q.onEnd });
  });
})();
