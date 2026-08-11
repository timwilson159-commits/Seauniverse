/* ============================================================
   SEA UNIVERSE: THE DEEP CAST

   Own file, per the Zone 3 convention.

   TONAL BRIEF, which is different from every other zone:
     Coastal Cove was cheerful. Coral Kingdom was professional.
     Arctic Cove was eccentrics. Open Ocean was people ground down by
     bureaucracy. The Deep is people who are FRIGHTENED, and who talk
     about the animals and about themselves in the same breath, because
     on this site those are one subject. Nobody here is a martyr and
     nobody here is stupid. They have mortgages.

   THE ONE RULE FOR WRITING THESE PEOPLE: no keeper in this zone
   speaks about animal welfare without at some point mentioning their
   own safety, and none of them apologise for it. A student should
   finish this zone understanding that the person who cannot afford to
   quit is not the villain of the story.

   MARISOL is the manager who turns, and she is turned by the SAFETY
   REGISTER rather than by an argument: she is ex-salvage, she thinks
   in load ratings and inspection dates, and a documented list is the
   only thing she is professionally able to act on. Her three repair
   conversations are what physically change the map.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.npcs = SU.data.npcs || {};

/* ---------------------------------------------------------
   MARISOL VANE, site manager. Twenty-two years in navy
   salvage and commercial diving before this. She is the most
   competent person in the park and she is quietly terrified,
   and those two facts are the same fact.
   --------------------------------------------------------- */
SU.data.npcs.marisol = {
  name: 'Marisol Vane', role: 'Trainer-Manager', zone: 'the_deep',
  place: 'the north apron',
  x: 30, y: 4, colour: '#8fa7b5', reactsToSuspicion: true,
  movement: {
    type: 'patrol', speed: 1.1, pause: [1.5, 3.5],
    points: [{ x: 24, y: 4 }, { x: 36, y: 4 }]
  },
  dialogue: [
    {
      when: { quest: { q_deep_induction: 'not_started' } },
      lines: [
        'A woman in a site jacket and steel-capped boots is standing on the apron with a folded ' +
          'drawing under one arm, looking at the pen the way a surveyor looks at a bridge.',
        'MARISOL: You came up through the tunnel. Nobody comes up through the tunnel.',
        'MARISOL: Marisol Vane. I run this site, and before you ask: no, it is not open, no, it was ' +
          'never finished, and yes, there are five animals in it.',
        'MARISOL: Twenty-two years I did salvage and commercial diving. Deep water, bad weather, ' +
          'things that will kill you if you stop paying attention for eleven seconds. I know what a ' +
          'well run deep-water site looks like.',
        'MARISOL: This is not one. And I am the person who signs for it, which I would like you to ' +
          'hold on to, because it means when I tell you something is wrong here I am telling on myself.',
        'MARISOL: So. You want to be useful? Walk the site. All of it. And write down every single ' +
          'thing you find that is broken, missing, expired or lying.',
        'MARISOL: Not to me. Not verbally. Written down, with a date on it.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_deep_induction' },
        { type: 'setFlag', flag: 'met_marisol', value: true },
        { type: 'addXP', amount: 40, once: 'met_marisol' }
      ]
    },

    /* ---- THE THREE REPAIRS ----
       Each fires once the matching hazard is in the register and is not
       yet repaired. These are the conversations that physically change
       the map, and they are conversations rather than switches on
       purpose: the point is that somebody with authority acts BECAUSE
       it was documented. Ordered ahead of the general entries so they
       always win, and each self-gates (the repair it performs makes its
       own `when` false), so their payouts cannot be farmed. */
    {
      when: { hazardLogged: 'hz_gate_hydraulic', not: { hazardRepaired: 'hz_gate_hydraulic' } },
      lines: [
        'MARISOL: The north pen gate. Say the last part again.',
        'MARISOL: One access. One. On the only pen on this site you cannot swim out of, with a ram ' +
          'that failed in March.',
        'She is already on the radio. She does not raise her voice at any point, which is somehow worse.',
        'MARISOL: Fitter is coming down this afternoon. He was going to be here Thursday to look at a ' +
          'sign. He can look at the sign next week.',
        'MARISOL: You will be able to get onto that pen by tonight. And when you do, you are going to ' +
          'find out why nobody has been on it since March, and I would like you to tell me, because ' +
          'I have asked twice and been told it is empty.'
      ],
      onEnd: [
        { type: 'repairHazard', id: 'hz_gate_hydraulic' },
        { type: 'addXP', amount: 80 },
        { type: 'toast', text: 'The north pen gate has been repaired.' }
      ]
    },
    {
      when: { hazardLogged: 'hz_deck_gap', not: { hazardRepaired: 'hz_deck_gap' } },
      lines: [
        'MARISOL: Three sections. Lifted out, you said. Not broken. Lifted.',
        'MARISOL: They went up to the stadium in Open Ocean. In April. For a photograph.',
        'MARISOL: Somebody needed matching deck for a press shoot, so they took it off the only ' +
          'through route on a deep water site, over the deepest part of it, and tied a bit of ' +
          'webbing across the hole at one end.',
        'MARISOL: I have four spare sections in the pump house. It is twenty minutes of work. The ' +
          'reason it has not been done is that the work order needs a cost code and the cost code ' +
          'is on capital hold.',
        'She writes something on the back of the drawing, folds it, and puts it in her pocket.',
        'MARISOL: I will do it myself and argue about the code afterwards. Give me until the end of ' +
          'the shift.'
      ],
      onEnd: [
        { type: 'repairHazard', id: 'hz_deck_gap' },
        { type: 'addXP', amount: 80 },
        { type: 'toast', text: 'The main spine has been re-plated.' }
      ]
    },
    {
      when: { hazardLogged: 'hz_stair_condemned', not: { hazardRepaired: 'hz_stair_condemned' } },
      lines: [
        'MARISOL: Say that again slowly. No engineer named, no report number, no date.',
        'MARISOL: I have condemned structures. You do not do it with a laminated sheet. There is a ' +
          'report, and it has an engineer\'s name on it and their registration number under it, ' +
          'because they are putting their licence behind the words.',
        'MARISOL: So either that report exists and nobody will show it to me, or somebody put a sign ' +
          'on a perfectly sound stair to stop people going up there.',
        'MARISOL: And there is only one thing up there. A view. From the top of that stand you can ' +
          'see the north holding pen, which you cannot see from anywhere else on this site.',
        'MARISOL: I am taking the barrier off. If somebody wants it back on, they can bring me the ' +
          'report.'
      ],
      onEnd: [
        { type: 'repairHazard', id: 'hz_stair_condemned' },
        { type: 'setFlag', flag: 'stand_open', value: true },
        { type: 'addXP', amount: 90 },
        { type: 'toast', text: 'The grandstand barrier has been removed.' }
      ]
    },

    /* Induction hand-in: log any three defects. Gated on `active`, and
       this entry is the thing that closes it. */
    {
      when: { quest: { q_deep_induction: 'active' }, hazardCount: { min: 3 } },
      lines: [
        'MARISOL: Three already. Read them to me.',
        'She listens with her arms folded and does not interrupt once.',
        'MARISOL: Right. That is a register. Do you know why that matters and a conversation does not?',
        'MARISOL: Because I have had the conversation. I have had it eleven times, with four different ' +
          'people, and every single time it ended with somebody agreeing with me and nothing happening. ' +
          'A conversation is deniable. A dated list with a name on it is a document.',
        'MARISOL: Keep going. All of it. And when you find the ones that are structural, come and get ' +
          'me personally, because those I can actually do something about today.'
      ],
      onEnd: [
        { type: 'completeQuest', id: 'q_deep_induction' },
        { type: 'startQuest', id: 'q_deep_register' },
        { type: 'setFlag', flag: 'marisol_briefed', value: true },
        { type: 'addSkillPoints', amount: 2 },
        { type: 'addXP', amount: 70 },
        { type: 'toast', text: 'Safety Register opened.' }
      ]
    },
    {
      when: { quest: { q_deep_induction: 'active' } },
      lines: [
        'MARISOL: Three things written down. Then come back.',
        'MARISOL: And I mean written down. If it is in your head it is worth nothing to either of us.'
      ]
    },

    /* Register hand-off. Eight defects is the threshold; there are
       twelve, so a player can miss four and still land this. */
    {
      when: { quest: { q_deep_register: 'active' }, hazardCount: { min: 8 },
              flags: { register_handed: false } },
      lines: [
        'MARISOL: How many?',
        'She takes it and reads the whole thing standing up, which takes a while.',
        'MARISOL: Right.',
        'MARISOL: I am going to say something to you properly and then I want you to go away, because ' +
          'this is not a conversation I can be seen having twice.',
        'MARISOL: Individually, every one of these is arguable. A handrail is maintenance. A light is ' +
          'maintenance. An empty life ring bracket is somebody being lazy. Any one of them, I raise ' +
          'it, it goes on a list, the list goes on hold, and I am the manager who made a fuss about ' +
          'a handrail.',
        'MARISOL: All of them together, dated, in one document, is a pattern. And a pattern is the ' +
          'only thing a regulator is allowed to act on, because a regulator cannot act on a feeling ' +
          'either, whatever anybody thinks.',
        'MARISOL: There is an auditor on site this week. Delia Sarkis. She is being walked round the ' +
          'nice bits by somebody from head office, and she knows it, because she has done this for ' +
          'twenty years and she is not an idiot.',
        'MARISOL: I cannot hand her this. I signed the roster that put one person on nights. Do you ' +
          'understand? The first thing in that document is my own name.',
        'MARISOL: You can hand it to her. You have been here five minutes and you have nothing to lose.',
        'MARISOL: Which is a filthy thing to say to somebody, and I am saying it anyway.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'register_handed', value: true },
        { type: 'setStoryStage', stage: 11 },
        { type: 'addEvidence', id: 'ev_roster_vs_policy' },
        { type: 'addXP', amount: 120 },
        { type: 'toast', text: 'Delia Sarkis is on the south shore.' }
      ]
    },
    {
      when: { quest: { q_deep_register: 'active' }, not: { hazardCount: { min: 8 } } },
      lines: [
        'MARISOL: Keep walking it. There are more than you have found.',
        'MARISOL: And do the inside of the buildings too. The pump house especially. The man who runs ' +
          'that room has been writing the same sentence at the bottom of every shift since March and ' +
          'nobody has read a single one of them.'
      ]
    },

    /* ---- THE LAST NIGHT. Ahead of the register entries so it wins
       while the endgame quest is running. Self-gates on its own flag. ---- */
    {
      when: { quest: { q_end_night: 'active' }, flags: { warned_marisol: false } },
      lines: [
        'MARISOL: You have got a face on you.',
        'You tell her. All of it: the journalist, Sunday, the long piece, and that her name is in ' +
          'the first paragraph of the register because she signed the roster.',
        'She does not say anything for a while.',
        'MARISOL: Right.',
        'MARISOL: Thank you for coming and saying it to my face. Do you know how I would otherwise ' +
          'have found out? A phone call on a Sunday morning from somebody in head office asking me ' +
          'what I had done.',
        'MARISOL: I am going home to write my own account tonight, dated tonight, before any of it ' +
          'is public. Not to get ahead of it. So that there is a version in my handwriting that ' +
          'was written before I knew how it turned out.',
        'MARISOL: Twenty-two years in salvage taught me one thing worth passing on. When it is ' +
          'going wrong, the people who survive it are the ones who wrote things down at the time.',
        'MARISOL: Go. You have others to see and you are burning the night.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'warned_marisol', value: true },
        { type: 'addXP', amount: 80 }
      ]
    },

    /* Turned, and stays useful afterwards. */
    {
      when: { flags: { register_filed: true } },
      lines: [
        'MARISOL: Sarkis has it. She read the first page standing on the walkway and then went and ' +
          'sat in her car for ten minutes.',
        'MARISOL: Fourteen months I have been here. I have written nine reports. That is the first ' +
          'time anything I have said has left the site.',
        'MARISOL: Whatever happens to me over it, that is the job. That is what signing means. I would ' +
          'rather be the manager who is in the document than the manager who is not in the document ' +
          'because there was not one.'
      ]
    },
    {
      lines: [
        'MARISOL: Walk the site. Write it down. Come and find me for anything structural.',
        'MARISOL: And do not go out on the west bench after dark on your own, whatever anybody tells ' +
          'you about it being fine. It is not fine. I have the handrail in writing now and it is ' +
          'still not fine.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   TOBY FERREIRA, twenty-four, second year, and the entire
   night shift. Funny in the specific way of somebody who is
   managing something. Gives the timed quest.
   --------------------------------------------------------- */
SU.data.npcs.toby = {
  name: 'Toby Ferreira', role: 'Trainer-Peer', zone: 'the_deep',
  place: 'the main spine',
  x: 31, y: 27, colour: '#c98f5a', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 1.3, pause: [0.8, 2] },
  dialogue: [
    {
      when: { flags: { met_toby: false } },
      lines: [
        'A young keeper with a head torch pushed up on his forehead in broad daylight, which suggests ' +
          'he has forgotten it is there.',
        'TOBY: You are the one who came out of the tunnel. Everyone is talking about it. There are ' +
          'six of us, so that took about four minutes.',
        'TOBY: Toby. I do nights. All of them.',
        'TOBY: There is supposed to be two of us on the pontoon. It says so on the wall in the mess. ' +
          'There has been one of us since March and the one is me.',
        'TOBY: And before you do the face: I know. I have done the maths on the face. I have got ' +
          'eleven months left on a two year contract and a landlord.',
        'TOBY: The animals are unbelievable, though. Genuinely. I know exactly what this place is and ' +
          'I still get to stand three metres from a blue whale at four in the morning, and there are ' +
          'about nine people alive who can say that.',
        'TOBY: That is the trap, by the way. In case you were wondering how they get people like me ' +
          'to do this.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_toby', value: true },
        { type: 'discoverSpecies', id: 'blue_whale' },
        { type: 'addXP', amount: 35, once: 'met_toby' }
      ]
    },
    /* ---- THE LAST NIGHT ---- */
    {
      when: { quest: { q_end_night: 'active' }, flags: { warned_toby: false } },
      lines: [
        'The night keeper, on the spine with a head torch, doing the round nobody else is rostered ' +
          'for. Whether or not you have spoken before, he knows exactly who you are, because there ' +
          'are six people on this site.',
        'TOBY: You are here late. Nobody is ever here late.',
        'You tell him: four transport crews, before dawn, tonight, and nobody put it on the roster.',
        'TOBY: Four crews.',
        'TOBY: On my shift. With me. And the walkway lights.',
        'He laughs, once, and it does not sound like a laugh.',
        'TOBY: Do you know what I would have done? I would have gone out to see what the noise was. ' +
          'On the south walk, in the dark, on my own, towards four vehicles I was not expecting.',
        'TOBY: Right. I am ringing Marisol and I am ringing the agency and if neither of them will ' +
          'put a second person on I am standing at the top of the slipway with the gate shut and ' +
          'they can explain to me in writing why they are here.',
        'TOBY: That is allowed. I checked. I checked months ago and never had a reason.',
        'He stops on his way out.',
        'TOBY: Whatever happens Sunday, they are going to say people like me did not know. ' +
          'Remember that I knew. I just could not afford to be the one who said it.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'warned_toby', value: true },
        { type: 'addXP', amount: 80 }
      ]
    },
    {
      when: { flags: { met_toby: true }, quest: { q_deep_nightshift: 'not_started' },
              hazardCount: { min: 4 } },
      lines: [
        'TOBY: You have been writing things down. Marisol told me. She said it like it was normal and ' +
          'her voice went funny.',
        'TOBY: Right, then here is one you cannot write down, because it is not broken yet.',
        'TOBY: The exchange pumps drop out about twice a month. Nothing dramatic. The level in the pen ' +
          'falls maybe forty centimetres before the standby picks it up, and normally that is fine.',
        'TOBY: It is not fine now, because the alarm panel is muted, so nothing tells you it has ' +
          'happened. You find out because you notice the sill is showing.',
        'TOBY: It is going to happen tonight. I can hear it in the number two pump. It has been singing ' +
          'all week.',
        'TOBY: So when it goes: three things, fast. Reset the plant in the pump house. Get eyes on the ' +
          'deep hole, because Vesper is down there and the sill comes up hard on that side. And get ' +
          'the gate house to hold the sluice, or it drains while you are fixing the rest of it.',
        'TOBY: I cannot do three things. I have been doing two of them and picking which one to skip, ' +
          'and I would quite like to stop doing that.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_deep_nightshift' },
        { type: 'addXP', amount: 45, once: 'toby_brief' },
        { type: 'toast', text: 'Pump, deep hole, sluice. In any order. Quickly.' }
      ]
    },
    {
      when: { quest: { q_deep_nightshift: 'active' } },
      lines: [
        'TOBY: Go. Pump house, deep hole, gate house. I will take whichever one you do not get to.',
        'TOBY: This is already better than every other time this has happened.'
      ]
    },
    {
      when: { quest: { q_deep_nightshift: 'completed' } },
      lines: [
        'TOBY: All three. In one go.',
        'TOBY: Do you know what the actual difference was? Not the level. The level was always coming ' +
          'back. The difference is that I did not have to choose which animal to not look at.',
        'TOBY: I have chosen four times. I remember all four.'
      ]
    },
    {
      lines: [
        'TOBY: If you are out here after dark, take a torch. Not the park one. A real one.',
        'TOBY: Eleven of the fourteen lights on the south walk are out, and the three that work are ' +
          'all at the shore end, which means the dark starts exactly where you would least want it to.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   SUNIL ACHTERBERG, the vet. Stopped getting in the water
   eighteen months ago, and will tell you exactly why if you
   ask, which almost nobody does.
   --------------------------------------------------------- */
SU.data.npcs.sunil = {
  name: 'Dr Sunil Achterberg', role: 'Trainer-Peer', zone: 'the_deep',
  place: 'the deep hole rail', at: 'obs_vesper',
  x: 47, y: 33, colour: '#9a8fc4', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 0.85, pause: [2, 4.5] },
  dialogue: [
    {
      when: { flags: { met_sunil: false } },
      lines: [
        'A man in a vet\'s fleece is standing at the rail over the deepest water with a stopwatch, ' +
          'counting under his breath.',
        'SUNIL: Eight. Nine. Up. Forty-one this morning.',
        'SUNIL: Sunil Achterberg. I am the vet, in the sense that I am the only vet, which is a ' +
          'different job.',
        'SUNIL: I am counting her dives. She goes to the floor of the pen, holds for about nine ' +
          'seconds, and comes up. Forty-one times since seven o\'clock.',
        'SUNIL: The daily sheet calls that diving enrichment behaviour. I did not write that. I have ' +
          'asked for it to be changed twice.',
        'SUNIL: And yes, before you ask, because you will look at the water and then look at me: I do ' +
          'not go in. Not since eighteen months ago. I will do everything else and I will do it ' +
          'properly, and I will not get into that water with one other person on site and an alarm ' +
          'panel that is muted.',
        'SUNIL: Some people here think that makes me a coward. Marisol thinks it makes me the only ' +
          'other person reading the same procedure she is.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_sunil', value: true },
        { type: 'discoverSpecies', id: 'sperm_whale' },
        { type: 'addXP', amount: 35, once: 'met_sunil' }
      ]
    },
    {
      when: { flags: { met_sunil: true }, quest: { q_deep_sounding: 'not_started' },
              qualification: 'abyssal_cert' },
      lines: [
        'SUNIL: You are certified. Good. Then I want three measurements, and I want them from you ' +
          'rather than from me, because I have made this argument twice and I am now a man with a ' +
          'grievance rather than a clinician with data.',
        'SUNIL: Vesper. Count the dives, and put the depth of this pen next to her species dive profile.',
        'SUNIL: Halcyon. There is a hydrophone in her end of the pen. Look at what comes BACK off the ' +
          'walls, not at what she sends.',
        'SUNIL: And Kirra. Both pectoral fins, leading edge, and then her turning circle against the ' +
          'north wall. Her file says cause unknown four times and it was never unknown.',
        'SUNIL: Three animals, three numbers. Numbers are the only thing that has ever worked on ' +
          'anybody above me.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_deep_sounding' },
        { type: 'addXP', amount: 45, once: 'sunil_brief' }
      ]
    },
    {
      when: { flags: { met_sunil: true }, quest: { q_deep_sounding: 'not_started' } },
      lines: [
        'SUNIL: I would put you on the three big ones, but you are not certified, and I do not sign ' +
          'anybody onto a great whale who is not.',
        'SUNIL: Husbandry three, observation three, veterinary two. It is a lot. So is a humpback.'
      ]
    },
    /* Hand-in for the three measurement cases. */
    {
      when: { quest: { q_deep_sounding: 'active' },
              flags: { enc_sw_depth_solved: true, enc_bw_call_solved: true, enc_hb_pecs_solved: true } },
      lines: [
        'SUNIL: Read me the three.',
        'He writes them into a hardback notebook, in pen, with the date.',
        'SUNIL: Eleven metres against a thousand. Four reflections off three rock faces. Five metres ' +
          'of pectoral fin against a wall she has to turn at.',
        'SUNIL: Those are not opinions, and that is the entire point of them. Nobody can tell me I am ' +
          'being emotional about a tape measure.',
        'SUNIL: I have had "the animals are in good body condition" said to me in four separate ' +
          'meetings. It is true every time, and it is the most dishonest true sentence in this ' +
          'industry. A body condition score cannot tell you an animal is in the wrong shaped room.',
        'SUNIL: Take them to whoever it is you actually work for.',
        'He does not look up when he says it, and he does not ask.'
      ],
      onEnd: [
        { type: 'completeQuest', id: 'q_deep_sounding' },
        { type: 'setFlag', flag: 'sunil_measured', value: true },
        { type: 'addSkill', skill: 'veterinary', amount: 1 },
        { type: 'addSkillPoints', amount: 2 },
        { type: 'addXP', amount: 130 },
        { type: 'toast', text: 'Three measurements, in pen, with a date.' }
      ]
    },
    {
      when: { quest: { q_deep_sounding: 'active' } },
      lines: [
        'SUNIL: Vesper, Halcyon, Kirra. Depth, acoustics, abrasion.',
        'SUNIL: Take your time over Kirra. Everybody looks at the fins and stops there. The ' +
          'measurement is the pen, not the animal.'
      ]
    },
    {
      lines: [
        'SUNIL: If you are working an animal out here and something changes, you stop, and you come ' +
          'and get me. You do not manage it yourself because it is nearly the end of the shift.',
        'SUNIL: That is not me being careful. That is me having been the person who managed it ' +
          'himself, once, at this site, eighteen months ago.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   ONDINE MARSH, rope access technician, and the tagger. She
   is not a vandal with a cause, she is a surveyor with a
   spray can, and that distinction is most of her character.
   --------------------------------------------------------- */
SU.data.npcs.ondine = {
  name: 'Ondine Marsh', role: 'Subversive', zone: 'the_deep',
  place: 'the east bench', at: 'deep_seagate',
  x: 58, y: 15, colour: '#6fbfa8', reactsToSuspicion: false,
  movement: { type: 'wander', radius: 2, speed: 1.0, pause: [1.5, 3] },
  dialogue: [
    {
      when: { flags: { met_ondine: false } },
      lines: [
        'A woman in a climbing harness is sitting on the edge of the bench with her boots hanging ' +
          'over eleven metres of water, eating a sandwich.',
        'ONDINE: You are the tunnel one.',
        'ONDINE: Ondine. Rope access. I do the bits of this site nobody else can reach, which is most ' +
          'of it, because it was built by people who never once asked how it would be inspected.',
        'ONDINE: Contractor, before you check. I am not staff. That is deliberate, and it is the only ' +
          'reason I am still here.',
        'She nods at the quarry face, where something is painted in careful letters.',
        'ONDINE: Somebody has been decorating.',
        'ONDINE: I have heard three different people say he cannot even sign the same name twice. ' +
          'Which I thought was a bit unfair, personally.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_ondine', value: true },
        { type: 'addXP', amount: 40, once: 'met_ondine' }
      ]
    },
    /* ---- THE LAST NIGHT ---- */
    {
      when: { quest: { q_end_night: 'active' }, flags: { warned_ondine: false } },
      lines: [
        'ONDINE: Say it quickly.',
        'You do.',
        'ONDINE: Sunday. Right.',
        'ONDINE: Then that room has to be empty by four in the morning, because the first thing ' +
          'anybody does on Sunday afternoon is walk this site looking for whoever talked, and the ' +
          'second thing they do is find a camp bed under a grandstand.',
        'ONDINE: Eleven years of that wall. Photographs, manifests, licence applications. It goes ' +
          'in a van tonight and it goes to four different addresses, because you never keep it all ' +
          'in one place, which is a thing Sable taught me and I have never once had to use.',
        'She is already coiling rope while she talks.',
        'ONDINE: You came and told me. You did not have to. Most people in your position would have ' +
          'let it break and worried about us afterwards.',
        'ONDINE: The bay is still there, by the way. The one I go and look at. There is nothing in ' +
          'it yet.',
        'ONDINE: Go on. Go and be in a room with him.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'warned_ondine', value: true },
        { type: 'addXP', amount: 80 }
      ]
    },
    {
      when: { flags: { met_ondine: true }, quest: { q_deep_tags: 'not_started' } },
      lines: [
        'ONDINE: You keep looking at them.',
        'ONDINE: Most people do not. They see spray paint and their eyes slide straight off it, which ' +
          'is genuinely useful if you want to put something somewhere in plain sight.',
        'ONDINE: Here is one for free. Nobody numbers graffiti. There is no reason on earth to number ' +
          'graffiti. If a thing is numbered, it is because the order matters.',
        'ONDINE: There are nine. Two of them you cannot currently get to, which is also not an accident.',
        'ONDINE: I am not going to tell you any more than that, and it is not because I am being coy. ' +
          'It is because if you cannot work it out, you are not somebody I can afford to be wrong about.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_deep_tags' },
        { type: 'addXP', amount: 50, once: 'ondine_brief' }
      ]
    },
    {
      when: { quest: { q_deep_tags: 'active' }, flags: { hide_open: true } },
      lines: [
        'She sees your face before you say anything.',
        'ONDINE: Ah.',
        'ONDINE: Then you have seen the wall, and the map with five pins in it, and you have read the ' +
          'folder, and you know this is not one angry woman with a spray can.',
        'ONDINE: Sable recruited me. Eleven years ago, at the cove, when I was doing an anchor ' +
          'inspection and asked why the pool renovation had been cancelled.',
        'ONDINE: The offer in that folder is real. I have stood in the sanctuary they are talking ' +
          'about. It is a bay with a net across the mouth, a vet team and a boat, it is nine hours ' +
          'from here, and they have said yes three times and put the transport cost in the offer.',
        'ONDINE: "The collection is not available for disposal." Read that sentence again and notice ' +
          'that they are not arguing about welfare. They are not even pretending to. They are saying ' +
          'the animals are property and property is not for giving away.',
        'ONDINE: That is the whole thing. That is what the nine of them add up to.'
      ],
      onEnd: [
        { type: 'completeQuest', id: 'q_deep_tags' },
        { type: 'startQuest', id: 'q_deep_sanctuary' },
        { type: 'setFlag', flag: 'ondine_revealed', value: true },
        { type: 'setStoryStage', stage: 12 },
        { type: 'addSkillPoints', amount: 3 },
        { type: 'addXP', amount: 150 },
        { type: 'toast', text: 'The network has been running for longer than you have.' }
      ]
    },
    {
      when: { quest: { q_deep_tags: 'active' } },
      lines: [
        'ONDINE: Nine of them. In order.',
        'ONDINE: And if two of them are behind something broken, then the way to reach them is to get ' +
          'the broken thing fixed, which you are apparently already doing, which is the only reason ' +
          'I am talking to you at all.'
      ]
    },
    /* The sanctuary quest: she wants the Pip judgement made honestly. */
    {
      when: { quest: { q_deep_sanctuary: 'active' }, flags: { enc_dg_stay_solved: true },
              evidence: 'ev_sanctuary_offer' },
      lines: [
        'ONDINE: And the dugong?',
        'ONDINE: Careful. This is the one I actually care about your answer to.',
        'She listens to the whole thing without interrupting.',
        'ONDINE: Good. Right answer.',
        'ONDINE: There are people in this with me who would have said release her, because release is ' +
          'the word that feels correct, and Pip would be dead in a fortnight, and there would be a ' +
          'photograph of it in every paper in the country with our names underneath.',
        'ONDINE: Three whales need an ocean. One dugong needs a managed lagoon and a keeper. If you ' +
          'cannot say both of those out loud then you are not campaigning, you are just shouting, and ' +
          'the difference between those is that one of them works.',
        'ONDINE: Take all of it to your handler. She is on the apron. Yes, I know who she is. I knew ' +
          'before you did.'
      ],
      onEnd: [
        { type: 'completeQuest', id: 'q_deep_sanctuary' },
        { type: 'setFlag', flag: 'sanctuary_case', value: true },
        { type: 'addXP', amount: 140 },
        { type: 'toast', text: 'Wren is on the north apron.' }
      ]
    },
    {
      when: { quest: { q_deep_sanctuary: 'active' } },
      lines: [
        'ONDINE: Two things before you take it anywhere. The offer out of the folder, and a ' +
          'defensible answer on the dugong.',
        'ONDINE: The second one is not a formality. The second one is the entire credibility of the ' +
          'first one.'
      ]
    },
    {
      lines: [
        'ONDINE: Nine hours south there is a bay with a net across the mouth of it and nothing in it ' +
          'yet.',
        'ONDINE: I go and look at it about once a month. It is a very stupid thing to do and I do it ' +
          'anyway.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   FERRIS NAKAGAWA, second appearance. He is already an NPC
   in Open Ocean, so this entry reuses his art via `sprite`
   and needs no new drawing. He put the hydrophone in the
   Meridian pool, and he has put one in here too.
   --------------------------------------------------------- */
SU.data.npcs.ferris_deep = {
  name: 'Ferris Nakagawa', role: 'Subversive', zone: 'the_deep', sprite: 'ferris',
  place: 'Halcyon\'s platform', at: 'obs_halcyon',
  x: 9, y: 24, colour: '#c4a86a', reactsToSuspicion: false,
  spawnCondition: { flags: { met_ferris: true } },
  dialogue: [
    {
      when: { flags: { ferris_deep_met: false } },
      lines: [
        'The cable coiler from the Open Ocean service alley, sitting on a flight case with a pair of ' +
          'headphones over one ear.',
        'FERRIS: Do not look so surprised. I go where the work is, and the work is wherever somebody ' +
          'has put an animal next to a rock face.',
        'FERRIS: You found my trace upstairs. The pencil note. "She stopped after the third one."',
        'FERRIS: I have put a hydrophone in this pen as well. Same reason. Nobody asked me to, and ' +
          'nobody has asked me to take it out, because nobody has asked me anything.',
        'FERRIS: Here is what I will tell you for nothing, and then I have to get on. In Coral ' +
          'Kingdom they had a noise problem and it was a speaker. In Open Ocean they had a noise ' +
          'problem and it was a commissioning schedule. Both of those are fixable. I have fixed ' +
          'them before.',
        'FERRIS: In here, the noise problem is the shape of the hole. Rock on three sides, a concrete ' +
          'sill on the fourth, and an animal whose entire vocal range is built for water with nothing ' +
          'in it.',
        'FERRIS: You cannot acoustically treat a quarry. I have priced it. It is not that it is ' +
          'expensive. It is that there is nothing to buy.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'ferris_deep_met', value: true },
        { type: 'addEvidence', id: 'ev_halcyon_acoustics' },
        { type: 'addXP', amount: 70, once: 'ferris_deep' }
      ]
    },
    {
      lines: [
        'FERRIS: Listen to it at four in the morning some time. When the pumps are on standby and the ' +
          'site has gone quiet.',
        'FERRIS: You hear her, and then you hear her three more times, and every single one of those ' +
          'is her own voice coming back at her off a wall.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   DELIA SARKIS, the external auditor. She is not a saviour
   and she is not a fool. She is a professional being managed,
   she knows it, and there is nothing she can do about it
   without a document. Which is what the register is.
   --------------------------------------------------------- */
SU.data.npcs.delia = {
  name: 'Delia Sarkis', role: 'Visitor', zone: 'the_deep',
  place: 'the slipway', at: 'deep_slipway',
  x: 53, y: 38, colour: '#b8b0a0', reactsToSuspicion: true,
  spawnCondition: { flags: { register_handed: true } },
  movement: { type: 'wander', radius: 2, speed: 0.9, pause: [2, 4] },
  dialogue: [
    {
      when: { flags: { register_filed: false } },
      lines: [
        'A woman in a good coat is standing on the slipway entirely alone, holding a folder she has ' +
          'clearly been given rather than asked for.',
        'DELIA: I have been walked past four things today that I was not walked up to.',
        'DELIA: Delia Sarkis. Independent, before you ask, and I know exactly how that word sounds ' +
          'when the fee comes from the people being audited.',
        'DELIA: I am going to be honest with you, because I am tired. I have done this for twenty ' +
          'years. I know when I am being shown a route. I know when a gate is locked on the day I ' +
          'happen to be here. I cannot write down one word of that.',
        'DELIA: What I can write down is a defect, with a location and a date. That is the entire ' +
          'scope of my power. It is not nothing, and it depends completely on somebody handing me one.',
        'She looks at what you are carrying.',
        'DELIA: Is that what I think it is.'
      ],
      choices: [
        {
          text: '▸ Hand her the Safety Register',
          condition: { hazardCount: { min: 8 } },
          reply: [
            'She reads the first page standing up. Then she stops, and reads it again from the top, ' +
              'more slowly.',
            'DELIA: Muted since March. Three thousand one hundred events.',
            'DELIA: Statutory inspection cancelled after being booked. A life ring station signed off ' +
              'monthly with no ring in it. Single-person night working at a deep water facility, ' +
              'against their own written procedure, pinned on the same wall as the roster.',
            'DELIA: Do you understand what you have actually given me? Not a complaint. Not a ' +
              'whistleblower. A dated register of defects with locations, compiled on site, half of ' +
              'which I can verify myself in the next two hours before anybody has time to move ' +
              'anything.',
            'DELIA: That is enforceable. Most of what is wrong with this place is not mine and never ' +
              'will be. This is.',
            'DELIA: It needs a name on it. It has to have a name on it, or it is an anonymous ' +
              'allegation and I am required to treat it as one.',
            'She waits. She does not push. That is somehow the hardest part of it.'
          ],
          effects: [
            { type: 'setFlag', flag: 'register_filed', value: true },
            { type: 'completeQuest', id: 'q_deep_register' },
            { type: 'addSkillPoints', amount: 3 },
            { type: 'addXP', amount: 200 },
            { type: 'addSuspicion', amount: 15 },
            { type: 'toast', text: 'The register has left the site.' }
          ]
        },
        {
          text: 'Not yet. There is more of it to find.',
          reply: ['DELIA: Then go and find it. I am here until Thursday, and after Thursday I am ' +
                  'just somebody who was shown round a site and wrote that it was fine.']
        }
      ]
    },
    {
      lines: [
        'DELIA: It is lodged. It has a reference number, which means it exists now whatever anybody ' +
          'does to either of us.',
        'DELIA: I will tell you the part nobody says out loud. I cannot do anything about the animals. ' +
          'Not one thing. Enclosure size, social grouping, whether an animal should be here at all: ' +
          'none of that is a defect, none of it is in my scope, and there is no line on my form for it.',
        'DELIA: What I can do is make this site cost them money and attention until somebody senior ' +
          'has to explain the whole thing in public.',
        'DELIA: Take the animal case to somebody who can print it. That is a different job and it is ' +
          'not mine.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   WREN HALLORAN, the handler, fifth and last appearance.
   Reuses her art. She gives the cross-zone Barry quest, which
   is the main thread of this zone, and she closes it.
   --------------------------------------------------------- */
SU.data.npcs.wren_deep = {
  name: 'Wren Halloran', role: 'Handler', zone: 'the_deep', sprite: 'wren',
  place: 'the north apron', at: 'deep_prboard',
  x: 37, y: 4, colour: '#7ba98f', reactsToSuspicion: false,
  spawnCondition: { flags: { deep_gate_open: true } },
  dialogue: [
    {
      when: { quest: { q_deep_barry: 'not_started' } },
      lines: [
        'She is standing in front of the phase two hoarding with her hands in her pockets, looking up ' +
          'at a painting of a bay that does not exist.',
        'WREN: I worked here for nine years and I did not know this was down here.',
        'WREN: Right. Everything you have sent me is about a PLACE. Enclosure dimensions, acoustics, ' +
          'a net repaired with cable ties. All of it good, all of it true, and all of it survivable ' +
          'for them, because a place can be fixed. They will announce a refurbishment and it will go ' +
          'away in a fortnight.',
        'WREN: What does not go away is a person.',
        'WREN: Barry Cuda has stood in front of every one of us for nine years and told us all a ' +
          'story, and the stories are not the same. Nobody has ever put them side by side, because we ' +
          'work in different parts of a park the size of a suburb and we do not talk to each other.',
        'WREN: So go and talk to them. Five people. You know all five.',
        'WREN: Dana at the cove, who still has the induction pack he handed her. Milo, who was ' +
          'standing next to him at a birthday party. Priya in Coral Kingdom, who was told he was in ' +
          'Perth. Enid Frost, who asked an advisory board for the names of its members. And Vaughn on ' +
          'the Open Ocean gate, who keeps a log because keeping the log is the job.',
        'WREN: None of them are lying to you. That is the thing I want you to notice. Every one of ' +
          'them will tell you the truth, and the truth will be a different shape each time.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_deep_barry' },
        { type: 'setFlag', flag: 'wren_deep_brief', value: true },
        { type: 'addXP', amount: 60, once: 'wren_deep_brief' },
        { type: 'toast', text: 'Five people, four zones, one man.' }
      ]
    },
    /* Hand-in for Nine Years of Barry. */
    {
      when: { quest: { q_deep_barry: 'active' },
              evidence: ['ev_barry_dana', 'ev_barry_milo', 'ev_barry_priya',
                         'ev_barry_frost', 'ev_barry_vaughn'] },
      lines: [
        'She lays them out on the flat top of a pallet, in date order, and steps back.',
        'WREN: An induction pack citing a rescue four months before the rescue happened.',
        'WREN: A signature on site, on a form, on the day he was in a meeting in Perth.',
        'WREN: A veterinary advisory board with no members.',
        'WREN: A story about swimming with a rescued seal, told to a hundred children, about an ' +
          'animal that was born in a pool here.',
        'WREN: And a gate log with his car on it three times in a fortnight he was overseas.',
        'WREN: Any one of these on its own is a man misremembering. I would not print any one of ' +
          'them. I would be embarrassed to.',
        'WREN: Five, from five people who have never met each other, across nine years, all pointing ' +
          'the same way, is not memory. That is a method.',
        'WREN: And now I will tell you the part I have been sitting on since Open Ocean, because you ' +
          'have earned it and because you are about to meet him.',
        'WREN: I did not leave. I was managed out, over eleven months, by a process that had my own ' +
          'signature at the bottom of every stage of it. And the entire time, I thought it was about me.',
        'WREN: It was a method then too. I just did not have four other people to put next to it.'
      ],
      onEnd: [
        { type: 'completeQuest', id: 'q_deep_barry' },
        { type: 'setFlag', flag: 'nine_years_done', value: true },
        { type: 'setStoryStage', stage: 13 },
        { type: 'addSkillPoints', amount: 3 },
        { type: 'addXP', amount: 220 },
        { type: 'toast', text: 'Five accounts. One method.' }
      ]
    },
    {
      when: { quest: { q_deep_barry: 'active' } },
      lines: [
        'WREN: Dana. Milo. Priya. Frost. Vaughn.',
        'WREN: Use the transit and do it in one afternoon. And do not go in telling them what you are ' +
          'looking for, because they will helpfully give you the version they think you want, and ' +
          'that is worth nothing to anybody.'
      ]
    },
    /* The final brief: everything in one place, pointed at the confrontation. */
    {
      when: { flags: { nine_years_done: true, sanctuary_case: true, register_filed: true,
                       wren_final: false } },
      lines: [
        'WREN: Right. Say it back to me. All of it, in one go, the way you would say it to somebody ' +
          'who does not want to hear it.',
        'You do. It takes a while.',
        'WREN: The animals. The site. The company. The man.',
        'WREN: Sarkis has the defects, and that will cost them a fortune and buy us the one thing we ' +
          'have never had, which is a reason for a journalist to already be looking.',
        'WREN: The sanctuary offer is the piece I did not expect. Everything else we have says this ' +
          'is wrong. That one says here is where they go instead, it is funded, and it has been ' +
          'refused three times in writing. You cannot answer that with a refurbishment.',
        'WREN: He is on his way down here. He has been told about the auditor.',
        'WREN: Do not accuse him of anything. Do not show him a single piece of paper. Let him talk, ' +
          'and remember it, because the version of himself he is about to show you is the one none ' +
          'of the other five ever got.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'wren_final', value: true },
        { type: 'setStoryStage', stage: 14 },
        { type: 'startQuest', id: 'q_deep_reckoning' },
        { type: 'addXP', amount: 120 },
        { type: 'toast', text: 'Barry Cuda is on the south shore.' }
      ]
    },
    /* Hand-in for the reckoning. Gated on `active`, and this entry is
       the only thing that closes it. */
    {
      when: { quest: { q_deep_reckoning: 'active' }, flags: { barry_deep_done: true } },
      lines: [
        'WREN: You went quiet. I could see your face from up here.',
        'WREN: He said the quiet part, then. They do that eventually, once they have decided you do ' +
          'not matter. It is almost a compliment, and it is the most useful thing that has happened ' +
          'all year.',
        'WREN: Write it down tonight, while it is exact. Not the gist. The words.',
        'WREN: We have the site, the company, the man, and somewhere to put five animals. That is ' +
          'everything except the ending.',
        'WREN: Go home. Eat something. It starts properly tomorrow.'
      ],
      onEnd: [
        { type: 'completeQuest', id: 'q_deep_reckoning' },
        { type: 'setFlag', flag: 'deep_done', value: true },
        { type: 'setStoryStage', stage: 16 },
        { type: 'addXP', amount: 150 },
        { type: 'toast', text: 'Everything except the ending.' }
      ]
    },
    /* ---- THE ENDGAME STARTS HERE ---- */
    {
      when: { flags: { deep_done: true }, quest: { q_end_night: 'not_started' } },
      lines: [
        'She is already standing when you arrive, and she has her bag over her shoulder.',
        'WREN: It is tonight.',
        'WREN: The transport is booked for the small hours. He told you himself on the slipway and ' +
          'I did not believe him, and then I rang somebody, and it is booked.',
        'WREN: And Nell can run it. Sunday, long piece, everything. She needs it in her hands by ' +
          'morning, and she wants you in the room, because I can tell her what I saw nine years ago ' +
          'and you can show her a document from Tuesday.',
        'WREN: But before any of that, three people.',
        'WREN: Marisol signed for this site. Ondine has a room full of copies under a condemned ' +
          'grandstand. And Toby is going to be alone on that pontoon at two in the morning when ' +
          'four transport crews he was not told about come through the gate.',
        'WREN: None of them know. When this breaks on Sunday, every one of them is standing in it.',
        'WREN: Go and tell them. Then come out through the main gate, the visitor one, and I will ' +
          'be on the other side of it.',
        'WREN: You have until the crews arrive. After that the site fills up with people and you ' +
          'will not get near any of them.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_end_night' },
        { type: 'setFlag', flag: 'meeting_set', value: true },
        { type: 'setStoryStage', stage: 17 },
        { type: 'addXP', amount: 100 },
        { type: 'toast', text: 'Marisol, Ondine, Toby. Then out through the main gate.' }
      ]
    },
    {
      when: { quest: { q_end_night: 'active' } },
      lines: [
        'WREN: Marisol, Ondine, Toby. Then the main visitor gate at the cove, and I will be on the ' +
          'other side of it.',
        'WREN: I have not been through that gate in nine years either. We can do it together and ' +
          'both feel ridiculous.'
      ]
    },
    {
      when: { flags: { deep_done: true } },
      lines: [
        'WREN: Rest. I mean it. There is nothing you can usefully do tonight that you will not do ' +
          'better tomorrow.',
        'WREN: And do not go back down there on your own until this is public. He knows your name now, ' +
          'and he was polite about it, which from him is not the reassuring version.'
      ]
    },
    {
      lines: [
        'WREN: Five people. Do not lead them. Ask them what he told them, and write down exactly ' +
          'what they say.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   BARRY CUDA, beat five of five, and the only one where he
   stops performing. He does not shout and he does not threaten
   anybody: he explains, patiently, because he has decided you
   are not a risk. That is the escalation.
   --------------------------------------------------------- */
SU.data.npcs.barry_deep = {
  name: 'Barry Cuda', role: 'CEO', zone: 'the_deep', sprite: 'barry',
  place: 'the slipway', at: 'deep_slipway',
  x: 44, y: 38, colour: '#c9a05a', reactsToSuspicion: false,
  spawnCondition: { flags: { wren_final: true } },
  movement: {
    type: 'patrol', speed: 0.9, pause: [2, 4],
    points: [{ x: 42, y: 38 }, { x: 50, y: 38 }]
  },
  dialogue: [
    {
      when: { flags: { barry_deep_done: false } },
      lines: [
        'He is standing on the slipway in a suit and entirely the wrong shoes, looking out at the ' +
          'pen. He does not turn round when you arrive, and he knows you are there.',
        'BARRY: You have been busy.',
        'BARRY: No. Please do not. We are past it and it is beneath both of us.',
        'BARRY: I know what you have got. I have known roughly since Open Ocean, and certainly since ' +
          'a company search went missing out of a filing cabinet in reception.',
        'BARRY: Can I tell you the thing nobody in your position ever believes? I have not lied to ' +
          'anybody. I have never once said a false sentence in public. Every animal in this park is ' +
          'legally held, every permit is current, every claim on every board has a footnote, and ' +
          'every footnote is accurate.',
        'BARRY: What you have found is a gap. The gap between what a sentence means to a person ' +
          'reading it on a day out with their children, and what the same sentence means in a licence ' +
          'application. That gap is not a crime. It is the industry. It is most industries.',
        'He nods out at the water.',
        'BARRY: You want me to say I do not care about them. I do, actually. In the way you care about ' +
          'something enormously valuable that you are responsible for. That is a real feeling. It is ' +
          'just not the feeling you would like it to be.',
        'BARRY: Nobody has ever held a blue whale. Nobody. And I have one.',
        'BARRY: Do you understand what that is worth? Not in ticket sales. In being the only place on ' +
          'earth. Every institution that has ever refused us a breeding loan will be on the telephone ' +
          'inside a year, and they will pretend they always supported us, and I will let them.',
        'BARRY: Your sanctuary would like them for nothing. They would take five animals off my hands ' +
          'and give me a photograph and a press release, and in ten years nobody would remember this ' +
          'park had existed.',
        'BARRY: "The collection is not available for disposal." I wrote that sentence. It is the ' +
          'truest one in this entire business.',
        'BARRY: Now. Your auditor will cost me about four hundred thousand and one bad quarter, and ' +
          'she is welcome to it, and you should know that not one line of what she is holding is ' +
          'about an animal.',
        'He turns round for the first time.',
        'BARRY: I am not going to threaten you. I have read your file. You are twenty-three and you ' +
          'have a lanyard. Nothing you do next is going to be the thing that stops this.',
        'BARRY: But it was a good try, and I mean that, and I am going to have a very long conversation ' +
          'with somebody about how you got down here at all.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'barry_deep_done', value: true },
        { type: 'setStoryStage', stage: 15 },
        { type: 'addEvidence', id: 'ev_barry_admission' },
        { type: 'addSuspicion', amount: 20 },
        { type: 'addXP', amount: 250 },
        { type: 'toast', text: 'He said it out loud. Go and tell Wren.' }
      ]
    },
    {
      lines: [
        'BARRY: We are finished. Go back to work.',
        'He says it pleasantly, and he has already stopped looking at you.'
      ]
    }
  ]
};

/* ============================================================
   THE LAST NIGHT: dialogue priority

   Same trap as the Barry witnesses below, hit again for a slightly
   different reason. Marisol, Ondine and Toby each have an
   introduction entry gated on `met_<them>: false`, and Toby's whole
   quest chain is OPTIONAL, so a player can finish the story having
   never spoken to him. Their "the crews are coming tonight" entry
   would then sit below an introduction that still matches, the step
   could never complete, and the finale would stall on a character
   the player was never required to meet.

   Hoisted, so warning somebody at one in the morning always beats
   being introduced to them. Safe because each entry is gated on a
   quest that exists only in the endgame plus a flag it sets itself.
   ============================================================ */
(function hoistLastNight() {
  ['marisol', 'ondine', 'toby'].forEach(id => {
    const npc = SU.data.npcs[id];
    if (!npc || !npc.dialogue) { console.warn('[SU] last night: no such character', id); return; }
    const isNight = e => e.when && e.when.quest && e.when.quest.q_end_night;
    const night = npc.dialogue.filter(isNight);
    if (!night.length) { console.warn('[SU] last night: ' + id + ' has no warning entry'); return; }
    npc.dialogue = night.concat(npc.dialogue.filter(e => !isNight(e)));
  });
})();

/* ============================================================
   NINE YEARS OF BARRY: dialogue priority

   The five revisit conversations live in the files of the characters
   who speak them (npcs.js, npcs_arctic.js, npcs_ocean.js), because
   that is where anybody editing Dana or Frost will look for them.

   THE PROBLEM THIS SOLVES, which cost a debugging pass to find:
   js/dialogue.js takes the FIRST entry whose `when` matches. Dana,
   Milo, Priya and Frost all have several entries about their own
   zone that match in an ordinary late-game save, so a revisit entry
   added at the bottom of the list is simply never reached. The quest
   sends you across four regions and every conversation gives you the
   character's normal line instead. Nothing errors; the chain just
   cannot be completed.

   So the five are hoisted to the front of their character's list on
   load. That is safe because each is gated on a quest that only
   exists in Zone 5 plus a flag it sets itself, so outside that window
   none of them can match anything.

   The hoist also survives future edits: somebody adding a new entry
   to Dana next year cannot silently break a quest in another zone.

   To add a sixth witness: write the entry in that character's own
   file, gated the same way, and add their id here.
   ============================================================ */
(function hoistBarryRevisits() {
  const witnesses = ['dana', 'milo', 'priya', 'frost', 'vaughn_gate'];
  const isRevisit = e => e.when && e.when.quest && e.when.quest.q_deep_barry;

  witnesses.forEach(id => {
    const npc = SU.data.npcs[id];
    if (!npc || !npc.dialogue) { console.warn('[SU] Nine Years of Barry: no such witness', id); return; }
    const revisits = npc.dialogue.filter(isRevisit);
    if (!revisits.length) { console.warn('[SU] Nine Years of Barry: ' + id + ' has no revisit entry'); return; }
    npc.dialogue = revisits.concat(npc.dialogue.filter(e => !isRevisit(e)));
  });
})();
