/* ============================================================
   SEA UNIVERSE, THE ENDGAME: THE ROOM

   One small interior, reached through the main visitor gate of
   Coastal Cove. It is the only place in the game that is not part of
   the park, and the only time the player ever walks out of the front
   door of the zone they started in.

   THE SCENE
   A hired meeting room above a cafe near the park gates. Three
   people, a table, a recorder. Nell Draycott, freelance, has been
   Wren's contact since before the player was recruited. Barry Cuda
   attends because he is certain he can manage it, and because not
   attending would look like something.

   THE HEARING OBJECT is the game's boss fight, and every round of it
   runs on a PR claim written months ago in another zone. See
   js/hearing.js for the mechanic and the classroom rules.

   LOAD-BEARING: each round's `accept` list is drawn from that claim's
   own `contradictedBy` array in data/progression.js. If you reword a
   PR claim or change what disproves it, come back here. The validator
   will catch an id that stops existing; it cannot catch an argument
   that stops making sense.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.zones = SU.data.zones || {};

SU.data.zones.the_room = {
  name: 'The Room Above the Cafe',
  subtitle: 'Three people, a table, and a recorder with the light on',
  kind: 'interior',
  w: 16, h: 12,
  base: 'floor',
  music: null,

  onArrive: [
    { type: 'achievement', id: 'out_the_gate' },
    { type: 'toast', text: 'You have never been outside the park before.' }
  ],

  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 16, h: 1  },
    { t: 'wall', x: 0,  y: 11, w: 16, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 12 },
    { t: 'wall', x: 15, y: 0,  w: 1,  h: 12 },
    /* DOOR ON THE TOP WALL, not the bottom. The visitor gate in Coastal
       Cove is on the southern edge of the park and is walked into moving
       DOWN, so the door here has to be the one behind you as you arrive,
       or the room opens backwards and you have to turn round to walk into
       it. Same convention as staff_ocean and deep_gatehouse. */
    { t: 'door', x: 7,  y: 0,  w: 1,  h: 1  }
  ],

  spawns: { entry: { x: 7, y: 1 } },

  exits: [
    { x: 7, y: 0, to: 'coastal_cove', spawn: 'from_gate', label: 'Back to the park' }
  ],

  props: [
    { t: 'bench', x: 3, y: 8 }, { t: 'bench', x: 11, y: 8 },
    { t: 'planter', x: 1, y: 1 }, { t: 'planter', x: 14, y: 1 },
    { t: 'bin', x: 14, y: 9 },
    { t: 'bench', x: 2, y: 3,
      text: 'A side table with a kettle on it, four mugs, and a jar of instant coffee that has ' +
            'been in this room longer than any of you.' }
  ],

  objects: [
    { id: 'room_window', x: 12, y: 2, kind: 'sign', name: 'The Window',
      text: 'From up here you can see the whole of Coastal Cove: the sea lion stadium, the seal ' +
            'pool, the kiosk, the path you have walked a hundred times.\n\n' +
            'From this distance it looks exactly like what the brochure says it is. That is not a ' +
            'trick of the light. It is the entire business model, and it works on everybody, and ' +
            'it worked on you for a while too.' },

    /* ================= THE HEARING ================= */
    { id: 'the_hearing', x: 7, y: 4, kind: 'hearing', name: 'The Hearing',
      /* Gated on the quest, NOT on beating the clock. The clock pays a
         bonus and never blocks the finale. See the note at the top of
         data/quests_end.js. */
      requires: { quest: { q_end_hearing: 'active' } },
      deniedText: 'Nell is here and the recorder is on the table, but the chair opposite is empty. ' +
                  'Nothing starts until he arrives.',

      intro: [
        'The room is above a cafe and smells of it. Four chairs, three of them used.',
        'NELL: Nell Draycott. Freelance. I have been taking Wren\'s calls for six years and this ' +
          'is the first time she has ever brought me anything I could run.',
        'NELL: Ground rules, because I say them to everybody. I am not on your side. I am on the ' +
          'side of the bits I can stand up. If you tell me something you cannot show me, it does ' +
          'not go in.',
        'The door opens without a knock.',
        'BARRY: Ms Draycott. Barry Cuda. I came myself, which I hope tells you something about how ' +
          'seriously we take this.',
        'BARRY: I am not going to be difficult. I am going to answer everything.',
        'NELL: (to you) That is the bit to worry about.',
        'WREN: Put it on the table. One at a time. He will have an answer for every single one and ' +
          'every answer will be true. Your job is not to catch him lying.',
        'WREN: Your job is to show her the gap.'
      ],

      outro: [
        'Nell turns the recorder off, and then sits looking at it for a moment without picking it up.',
        'NELL: Right.',
        'BARRY: Is that everything?',
        'NELL: For today.',
        'BARRY: Then I will say one last thing, and I would like it recorded, so turn it back on if ' +
          'you like.',
        'BARRY: Every document you have been shown is real. I have not disputed one of them. Not one.',
        'BARRY: What you have is a collection of true things arranged to look like a crime, and I ' +
          'have a collection of true things arranged to look like a conservation charity, and the ' +
          'only difference between us is that mine is on a hoarding and yours is in a folder.',
        'NELL: The difference is that yours took ticket money off people who believed it.',
        'Barry considers this properly, which is somehow the worst thing he does all afternoon.',
        'BARRY: Yes. That is the difference.',
        'He gathers his coat and goes, and he is entirely calm, and at the door he stops.',
        'BARRY: The animals move tonight regardless. That was booked a fortnight ago. Whatever you ' +
          'print on Sunday, it will be about animals that are already somewhere else.',
        'And then he is gone, and the three of you sit in a room above a cafe with a recorder on ' +
          'the table.'
      ],

      rounds: [
        /* ---- 1. Coastal Cove: where the whole thing started ---- */
        {
          id: 'r1', claim: 'ev_brochure_claim',
          accept: ['ev_transfer_manifest', 'ev_dolphin_studbook', 'ev_turtle_origin'],
          barry: [
            'BARRY: "Every animal at Sea Universe is a rescue that could not be returned to the wild."',
            'BARRY: I wrote that line. I am proud of it. And I would like you to notice that it is ' +
              'not a claim about where an animal was BORN. It is a claim about whether it can be ' +
              'released. Which is a veterinary judgement, and ours are all documented.',
            'NELL: (to you) Well?'
          ],
          win: [
            'You put it on the table and turn it round so it is the right way up for her.',
            'NELL: This is a movement record. And these two are listed as captive born.',
            'BARRY: Which does not contradict the sentence.',
            'NELL: No. It contradicts what a family reading the sentence thinks it means, which is ' +
              'what I am going to print.'
          ],
          lose: [
            'BARRY: I am not sure what that shows, and I do not think Ms Draycott is either.',
            'NELL: He is right. That is not about where the animals came from.'
          ],
          concede: [
            'NELL: Nothing? Then I cannot run it. That is not me being difficult, that is me not ' +
              'having a document.',
            'BARRY: (pleasantly) Quite.'
          ],
          lesson: 'The claim is literally defensible and functionally false. "A rescue that cannot ' +
                  'be returned" describes a decision, not an origin, and it is written to be heard ' +
                  'as an origin. That gap between the sentence and its reading is the single thing ' +
                  'this whole game has been about.'
        },

        /* ---- 2. Coral Kingdom: the money ---- */
        {
          id: 'r2', claim: 'ev_conservation_wall',
          accept: ['ev_dolphin_studbook', 'ev_turtle_origin', 'ev_water_falsified'],
          barry: [
            'BARRY: "100% of our profits support conservation." With an asterisk, which leads to a ' +
              'footnote, which defines the conservation fund. Every word of that is auditable.',
            'BARRY: I have never once been asked about the asterisk by a member of the public. Not ' +
              'in nine years.'
          ],
          win: [
            'NELL: So the fund is real.',
            'BARRY: The fund is real.',
            'NELL: And this says the breeding programme runs at a profit and the calves are sold on.',
            'BARRY: Sold is your word.',
            'NELL: Transferred, then, for a consideration. I will use the form of words on your own ' +
              'paperwork, which is worse.'
          ],
          lose: [
            'BARRY: That is a welfare document. Nobody is disputing welfare today. We are discussing ' +
              'the accounts.'
          ],
          concede: [
            'NELL: Then the wall stands. It is a true sentence with a footnote, and true sentences ' +
              'with footnotes are how this entire industry works.'
          ],
          lesson: 'An asterisk is a legal defence, not an explanation. A claim engineered so that ' +
                  'the honest version lives in six-point type at the bottom is designed to be ' +
                  'misread, and being technically accurate is exactly what makes it effective.'
        },

        /* ---- 3. Coral Kingdom: the words themselves ---- */
        {
          id: 'r3', claim: 'ev_margo_directive',
          accept: ['ev_water_falsified'],
          barry: [
            'BARRY: A staff language guide. Every organisation on earth has one. Yours will have one.',
            'BARRY: "If a guest asks about water quality, the answer is that it is tested daily and ' +
              'is excellent." It IS tested daily. Show me a day it was not.'
          ],
          win: [
            'You put the water logs down next to the memo.',
            'NELL: Six clean weeks. All in one hand. All in one pen.',
            'NELL: Including four days the pumps were off for repair.',
            'Barry does not answer immediately, and for the first time the pause is real rather ' +
              'than performed.',
            'BARRY: I did not write those sheets.',
            'NELL: No. You wrote the sentence that meant nobody ever asked to see them.'
          ],
          lose: [
            'BARRY: That does not touch the water testing, and Ms Draycott has noticed that it does not.'
          ],
          concede: [
            'NELL: Then it is a style guide. Every organisation has one, he is right about that, ' +
              'and I cannot print a style guide.'
          ],
          lesson: 'Controlling the answer is how you make sure the question is never asked twice. ' +
                  'The memo is not the offence; it is the thing that kept the offence from being ' +
                  'found, and those two are worth being able to tell apart.'
        },

        /* ---- 4. Open Ocean: what the building is for ---- */
        {
          id: 'r4', claim: 'ev_wing_promise',
          accept: ['ev_wing_boardpack', 'ev_movements_folder', 'ev_transport_frames'],
          barry: [
            'BARRY: "Every animal in it is an animal we saved." Future tense, on a hoarding, about ' +
              'a building that is not finished. It is an aspiration. Nobody has ever been ' +
              'prosecuted for an aspiration.',
            'BARRY: And it raised four million pounds, which is four million pounds that exists.'
          ],
          win: [
            'NELL: Tab four.',
            'NELL: "Phase two is contingent on breeding the flagship species." That is not an ' +
              'aspiration, that is a board paper with a date on it.',
            'BARRY: Board papers consider options.',
            'NELL: This one costs the option. There is a number next to it.'
          ],
          lose: [
            'BARRY: A welfare finding, again. I keep saying: I am not contesting the welfare ' +
              'findings. They will be addressed in the refurbishment.'
          ],
          concede: [
            'NELL: An unfinished building with an optimistic sign on it. There is one of those in ' +
              'every town in the country.'
          ],
          lesson: 'Watch what a promise is made OF. "Every animal we saved" is unfalsifiable while ' +
                  'the building is empty, which is precisely when the money is raised. The board ' +
                  'pack is damning because it is in the past tense and has a cost attached.'
        },

        /* ---- 5. Open Ocean: the animal on the press wall ---- */
        {
          id: 'r5', claim: 'ev_orca_rescue_story',
          accept: ['ev_wing_boardpack', 'ev_meridian_gatelog', 'ev_orca_isolation'],
          barry: [
            'BARRY: She was found in difficulty and she was taken in. That is a rescue. It is on ' +
              'the press wall because it is the best thing this park has ever done.',
            'BARRY: You have met her. You have been in that compound. Tell Ms Draycott she is not ' +
              'well cared for and I will not even argue with you, I will just wait.'
          ],
          win: [
            'NELL: Nobody is saying she is thin.',
            'NELL: This says she has been alone for eleven months and stopped vocalising, and this ' +
              'says the acquisition the whole wing is waiting on is a male.',
            'NELL: She is not the exhibit. She is the collateral for the next one.',
            'BARRY: That is an interpretation.',
            'NELL: It is your interpretation. It is your document.'
          ],
          lose: [
            'BARRY: Which says nothing whatever about the orca.',
            'NELL: (to you) He is right. Try again.'
          ],
          concede: [
            'NELL: Then she is a rescue in good body condition, and that is a photograph, not a story.'
          ],
          lesson: 'The strongest greenwashing does not hide an animal, it puts one on the wall. ' +
                  '"Well cared for" and "should be here at all" are different questions, and being ' +
                  'able to concede the first while pressing the second is what makes the argument ' +
                  'credible instead of shrill.'
        },

        /* ---- 6. The Deep: the last and biggest ---- */
        {
          id: 'r6', claim: 'ev_phase_two_claim',
          accept: ['ev_sanctuary_offer', 'ev_halcyon_intake', 'ev_vesper_depth',
                   'ev_kirra_abrasion', 'ev_deep_net', 'ev_deep_alarm',
                   'ev_deferred_orders', 'ev_necropsy_reports', 'ev_gate_log'],
          barry: [
            'BARRY: "A natural sea sanctuary. Real ocean water, real tides."',
            'BARRY: It is a tidal enclosure. It fills and empties on the tide. Every word is a ' +
              'description of the plumbing and every word is accurate.',
            'NELL: It is a quarry.',
            'BARRY: It is a quarry with the sea let into it, which is what a sea pen is. Ask any ' +
              'engineer.'
          ],
          win: [
            'You put it down, and this time you do not turn it round for her, because she has ' +
              'already leaned over to read it upside down.',
            'NELL: ...Say the word out loud, Mr Cuda.',
            'BARRY: I would rather not.',
            'NELL: "The collection is not available for disposal." An established sanctuary offered ' +
              'to take all five animals at no cost, and to pay for the transport, three times, and ' +
              'you called them a disposal.',
            'BARRY: It is a term of art.',
            'NELL: It is going to be the headline.'
          ],
          lose: [
            'BARRY: I do not think that is what you meant to hand her.',
            'NELL: No. And I have a train.'
          ],
          concede: [
            'NELL: A tidal enclosure described as a tidal enclosure. He is not wrong, and I have ' +
              'nothing to put next to it.'
          ],
          lesson: 'The word SANCTUARY is doing all the work: it is technically a description of ' +
                  'the plumbing and is heard as a promise about the animals\' future. The refusal ' +
                  'letter is what breaks it, because it is the park itself, in writing, calling ' +
                  'five living animals a collection that is not available for disposal.'
        }
      ],

      effects: [
        { type: 'setFlag', flag: 'hearing_held', value: true },
        { type: 'setStoryStage', stage: 18 },
        { type: 'achievement', id: 'the_gap' },
        { type: 'addXP', amount: 400 },
        { type: 'toast', text: 'The recorder is off. Nell has what she has.' }
      ] }
  ]
};
