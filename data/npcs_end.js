/* ============================================================
   SEA UNIVERSE: THE ENDGAME CAST

   Three people in a room above a cafe, plus one more conversation
   back at The Deep.

   ACT 3 LIVES HERE. The resolution is Nell's post-hearing dialogue
   and Wren's last conversation, and the report card is opened at the
   end of Wren's, by the `openReport` effect, so the epilogue always
   gets its last line before the scoreboard appears.

   THE ONE ANIMAL LOST IS SCRIPTED, NOT EARNED. Barry always gets 41-B
   out. This is not a punishment for a slow player: it is the point of
   the whole zone, which is that the animal nobody wrote down is the
   animal nobody could keep hold of. What DOES vary is his fate, and
   it varies on a CHOICE rather than a clock: whether the player ever
   ran the optional `or_acquisition` care session and gave him a
   documented photo identity. See Nell's two epilogue branches below.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.npcs = SU.data.npcs || {};

/* ---------------------------------------------------------
   NELL DRAYCOTT, freelance journalist, Wren's contact for
   six years. Not an ally: she is on the side of the bits she
   can stand up, and she says so in her first breath.
   --------------------------------------------------------- */
SU.data.npcs.nell = {
  name: 'Nell Draycott', role: 'Journalist', zone: 'the_room',
  place: 'the room above the cafe',
  x: 5, y: 4, colour: '#b58fc4', reactsToSuspicion: false,
  movement: { type: 'static' },
  dialogue: [
    {
      when: { flags: { met_nell: false } },
      lines: [
        'A woman at the table with a recorder, a notebook and no laptop, which is either old ' +
          'fashioned or careful.',
        'NELL: Nell Draycott. You are the one who has been inside for four months.',
        'NELL: Before we start: I am not on your side. I want to be clear about that because ' +
          'people in your position always assume I am, and then they are hurt later.',
        'NELL: I am on the side of the bits I can stand up. If you can show it to me, I can print ' +
          'it. If you can only tell me, it is worth nothing, and it is worth nothing in a way that ' +
          'will make you very angry.',
        'NELL: Wren says you have four months of documents. Let us find out.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'met_nell', value: true },
        /* Starting it here rather than at the gate means Barry (whose
           spawnCondition is this quest) walks in after Nell has set her
           terms, which is the order the scene wants. */
        { type: 'startQuest', id: 'q_end_hearing' },
        { type: 'completeQuest', id: 'q_end_night' },
        { type: 'addXP', amount: 40, once: 'met_nell' }
      ]
    },

    /* ---- ACT 3, part one: what she can and cannot run ---- */
    {
      when: { flags: { hearing_held: true, nell_debrief: false } },
      lines: [
        'NELL: Sit down a minute. I want to tell you what happens now, because everybody gets this ' +
          'wrong and then they think I lied to them.',
        'NELL: It runs on Sunday. Long piece. The board pack, the refusal letter, the muted alarm ' +
          'panel and the defects register, because Sarkis has lodged that one and a lodged ' +
          'enforcement notice is a fact I can print without being sued.',
        'NELL: Here is what does not happen. Nobody is arrested. There is no raid. He has not ' +
          'broken a law that I can find, and I have looked, and so has a lawyer who charges more ' +
          'than I earn.',
        'NELL: What happens is this. Sponsors read it on Sunday. On Monday two of them ask for a ' +
          'meeting they do not intend to attend. On Tuesday the trust announces a review. Within ' +
          'a month somebody senior discovers they were always uncomfortable about it.',
        'NELL: And the animals become expensive to keep and cheap to be rid of, and at that exact ' +
          'moment the sanctuary offer is sitting on the table, funded, in writing, refused three ' +
          'times.',
        'NELL: That is the whole play. It is not justice. It is economics with a deadline, and it ' +
          'is the only thing I have ever seen actually work.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'nell_debrief', value: true },
        { type: 'setStoryStage', stage: 19 },
        { type: 'addXP', amount: 150 },
        { type: 'toast', text: 'It runs on Sunday.' }
      ]
    },

    /* ---- 41-B: the scripted loss, with the fate the player decided ---- */
    {
      when: { flags: { nell_debrief: true, told_about_41b: false },
              species: { orca: { solved: 'or_acquisition' } } },
      lines: [
        'NELL: One more thing and then I have a train.',
        'NELL: They moved the young male out at twenty to three this morning. Through the sea gate, ' +
          'on the tide, same as he came in. He was gone before we sat down.',
        'NELL: I am sorry. There was never a version of today where that did not happen. It was ' +
          'booked a fortnight ago.',
        'She flicks back through the notebook.',
        'NELL: But you photographed him. Saddle patch, eye patch, and you matched it to the ' +
          'transfer paperwork, so he is not a stock number any more, he is a named individual with ' +
          'a documented identity and a date.',
        'NELL: That is the difference between an animal that vanishes and an animal that can be ' +
          'asked after. Somebody at the sanctuary is already asking after him.',
        'NELL: It will take a year and it is not certain. It is a great deal more than nothing, ' +
          'and forty minutes of your time is why.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'told_about_41b', value: true },
        { type: 'setFlag', flag: 'b41_traceable', value: true },
        { type: 'achievement', id: 'not_a_number' },
        { type: 'addXP', amount: 120 }
      ]
    },
    {
      when: { flags: { nell_debrief: true, told_about_41b: false } },
      lines: [
        'NELL: One more thing and then I have a train.',
        'NELL: They moved the young male out at twenty to three this morning. Through the sea gate, ' +
          'on the tide, same as he came in. He was gone before we sat down.',
        'NELL: I am sorry. There was never a version of today where that did not happen. It was ' +
          'booked a fortnight ago.',
        'NELL: The problem is I have nothing on him. No name, no photograph, no identification. ' +
          'Just a stock number on a daily sheet and a facility code at the other end.',
        'NELL: I cannot ask after an animal I cannot describe. Neither can the sanctuary and ' +
          'neither can a regulator.',
        'NELL: Whoever decided he did not need a name knew exactly what they were doing, and they ' +
          'did it eight days before they moved him.'
      ],
      onEnd: [
        { type: 'setFlag', flag: 'told_about_41b', value: true },
        { type: 'setFlag', flag: 'b41_traceable', value: false },
        { type: 'addXP', amount: 60 }
      ]
    },
    {
      when: { flags: { hearing_held: true } },
      lines: [
        'NELL: Sunday. Read it or do not, they are all the same to write.',
        'NELL: And keep your notebook. Not for me. Because in two years somebody is going to ' +
          'announce something with the word sanctuary in it, and you are one of about nine people ' +
          'in the country who will know what to ask.'
      ]
    },
    {
      lines: [
        'NELL: When he gets here, do not argue with him. Show me things.',
        'NELL: If I have to choose between a furious young person and a piece of paper, I take the ' +
          'paper every single time, and so does everybody who has ever been sued.'
      ]
    }
  ]
};

/* ---------------------------------------------------------
   WREN, in the room. The end of a five-zone arc, and the
   conversation that opens the report card.
   --------------------------------------------------------- */
SU.data.npcs.wren_room = {
  name: 'Wren Halloran', role: 'Handler', zone: 'the_room', sprite: 'wren',
  place: 'the room above the cafe',
  x: 9, y: 4, colour: '#7ba98f', reactsToSuspicion: false,
  dialogue: [
    {
      when: { flags: { hearing_held: false } },
      lines: [
        'WREN: Nine years I worked there. Four months you did.',
        'WREN: You have more in that notebook than I collected in the whole time, and I have been ' +
          'trying to work out whether that says something good about you or something very bad ' +
          'about me.',
        'WREN: It is both. It is fine. Sit down.',
        'WREN: When he starts, remember the one thing. He will not lie to you. He has never had to.'
      ]
    },

    /* ---- ACT 3, part two: the resolution, and the report ---- */
    {
      when: { flags: { hearing_held: true, nell_debrief: true, told_about_41b: true,
                       wren_epilogue: false } },
      lines: [
        'WREN: Come and stand by the window a minute.',
        'From up here the whole cove is laid out: the stadium, the seal pool, the kiosk, the path ' +
          'you walked every morning.',
        'WREN: Halcyon and Kirra and Vesper go south. It will take about eight months, because you ' +
          'do not move a blue whale in a fortnight, and there will be vets and a barge and an ' +
          'enormous amount of paperwork, and you are going to be part of every bit of it.',
        'WREN: Kessa goes back to her group. That was the easy one. Somebody rang the receiving ' +
          'facility and they said yes in eleven minutes.',
        'WREN: And Pip stays.',
        'WREN: A managed seagrass lagoon, up the coast, with staff and a vet and a boat. Not open ' +
          'water. Because you wrote down that she has never foraged and swims towards boats, and ' +
          'because you were willing to say the unpopular thing in a file where everything else you ' +
          'wrote said the popular one.',
        'WREN: That is the bit I want you to keep. Anybody can be against something. You worked out ' +
          'what each animal actually needed and they were not all the same answer.',
        'She is quiet for a moment.',
        'WREN: He will be fine, by the way. Barry. There is no version of this where he is not ' +
          'fine. The trust will restructure, the holding company is not going anywhere, and in ' +
          'about three years there will be a planning application on a coastline somewhere with ' +
          'a very beautiful drawing attached to it.',
        'WREN: I am telling you that now so that Sunday does not feel like a disappointment.',
        'WREN: Five animals. Three going to the ocean, one going home, one getting the right kind ' +
          'of care for the rest of a very long life.',
        'WREN: That is not everything. It is five, and it is real, and I have been at this for ' +
          'eleven years and it is more than I have ever managed.',
        'WREN: Go and get some sleep. The park is still open tomorrow, and the transfer takes ' +
          'months, and they are all still in there needing feeding in the meantime.'
      ],
      onEnd: [
        /* completeQuest FIRST, per the hand-in rule: a timed quest reads
           its clock before the status flips, and the report should open
           against a finished state. */
        { type: 'completeQuest', id: 'q_end_hearing' },
        { type: 'setFlag', flag: 'wren_epilogue', value: true },
        { type: 'setFlag', flag: 'game_completed', value: true },
        { type: 'setStoryStage', stage: 20 },
        { type: 'achievement', id: 'the_whole_thing' },
        { type: 'addXP', amount: 500 },
        { type: 'openReport' }
      ]
    },
    {
      when: { flags: { game_completed: true } },
      lines: [
        'WREN: Still here?',
        'WREN: Good. The transfer takes months and there is a great deal to do, and every one of ' +
          'them still gets fed twice a day in the meantime.',
        'WREN: Your report is in the Menu whenever you want to look at it again.'
      ]
    },
    {
      when: { flags: { hearing_held: true } },
      lines: [
        'WREN: Talk to Nell. She will tell you what actually happens next, and you should hear it ' +
          'from her rather than guess.'
      ]
    },
    { lines: ['WREN: Wait for him. He will come. Not coming would look like something.'] }
  ]
};

/* ---------------------------------------------------------
   BARRY, in the room. He has no dialogue of his own here:
   the hearing object IS his scene, and letting the player
   corner him for a normal chat beforehand would undercut it.
   He is present so the room is not empty, and he says the
   one thing a man in his position says.
   --------------------------------------------------------- */
SU.data.npcs.barry_room = {
  name: 'Barry Cuda', role: 'CEO', zone: 'the_room', sprite: 'barry',
  place: 'the room above the cafe',
  x: 7, y: 2, colour: '#c9a05a', reactsToSuspicion: false,
  spawnCondition: { quest: { q_end_hearing: 'active' } },
  movement: { type: 'static' },
  dialogue: [
    {
      when: { flags: { hearing_held: false } },
      lines: [
        'BARRY: We are all waiting on the same thing, so there is no point you and I doing this ' +
          'twice.',
        'BARRY: Sit down. Have a coffee. It is a terrible coffee.'
      ]
    },
    {
      lines: [
        'BARRY: I meant what I said about it being a good try. I do not say that to people often ' +
          'because it is not often true.',
        'He looks at his watch, and then out of the window, in the direction of the park.'
      ]
    }
  ]
};
