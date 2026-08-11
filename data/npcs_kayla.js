/* ============================================================
   SEA UNIVERSE: KAYLA

   One character, five appearances, one drawing. Each appearance is
   its own NPC id pointing at the same art through `sprite:`, the
   same way barry_reef and wren_arctic do.

   NOTE THE SPRITE VALUE. `sprite: 'kayla'` and NOT 'npc_kayla'.
   js/world.js does `a.def.sprite || a.id` and adds the `npc_` prefix
   itself, so the fuller-looking name resolves to npc_npc_kayla.svg
   and silently draws nothing at all.

   SHE TURNS UP WHEN YOU HAVE EARNED HER. Every appearance is gated
   on that zone's induction being finished, so she arrives once the
   player has done a shift's real work in that region.

   WHO SHE IS. An adult visitor who comes here far too often and is
   delighted by all of it. Slightly silly, completely sincere, and
   perfectly aware that her questions sound daft. She is NOT a child
   and NOT a know-it-all: she asks because she wants to know, and
   when she gets an answer she is thrilled rather than vindicated.

   HOW TO WRITE HER. Enthusiasm first, facts second. She hedges
   ("somebody told me once", "I read about it and could not believe
   it") instead of lecturing, she lets the trainers be the experts,
   and when something lands badly she notices, goes quiet for one
   beat, then changes the subject rather than delivering a verdict.
   The sad conclusion is always left for the player to finish.

   THE ICY POLE IS A RUNNING GAG AND IT HAS A FIXED SHAPE. Every one
   of the five completions ends the same way: she snaps the twin icy
   pole in half, HESITATES over the two pieces, and hands over the
   SMALLER half. Never the bigger one, and never a whole one. The
   hesitation is the joke, so it always gets its own beat rather than
   being folded into the same line as the handover, and she never
   apologises for the outcome, she justifies it. The Deep is the
   payoff and is the only one that admits the pattern out loud, so
   keep those three lines last if the order is ever reshuffled.
   The shared reward toast in data/quests_kayla.js and the `icy_pole`
   description in data/items.js both state this too. THREE FILES,
   change them together.

   THE TRAINER ENTRIES ARE HOISTED. Dialogue takes the FIRST entry
   whose `when` matches, so an entry appended to the bottom of a
   character's list is unreachable: their own zone entries always
   match first. This file unshifts every question onto the front of
   the trainer's list at load time. That trap has bitten this project
   three times; doing it by construction means it cannot bite a
   fourth. Load order matters: this file must come AFTER every cast
   file in index.html.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.npcs = SU.data.npcs || {};

/* ---------------- the five appearances ---------------- */

SU.data.npcs.kayla_cove = {
  name: 'Kayla', role: 'Visitor', zone: 'coastal_cove', sprite: 'kayla',
  place: 'the path above the seal pool',
  x: 18, y: 15, colour: '#c2e8a0', reactsToSuspicion: false,
  spawnCondition: { quest: { q_cove_induction: 'completed' } },
  movement: { type: 'wander', radius: 2, speed: 1.1, pause: [1, 3] },
  dialogue: [
    {
      when: { quest: { q_kayla_cove: 'active' },
              flags: { kq_seal_boop: true, kq_otter_tummy: true } },
      lines: [
        'KAYLA: You asked! You actually went and asked. I did not think you would.',
        'KAYLA: A nose target. It has a NAME. Of course it has a name, everything here has a name.',
        'KAYLA: And she has to come over to it herself, that is the bit I love. She is allowed to say ' +
          'no thank you.',
        'KAYLA: Because it is the whiskers, isn\'t it. Somebody told me once they can feel where a ' +
          'fish went. Not where it is. Where it WENT.',
        'KAYLA: So it was never a cuddle at all. She is having a read of you.',
        'She looks enormously pleased about this.',
        'KAYLA: And no blubber on the otters! None at all! It is just fur and trapped air, so the ' +
          'grooming IS the day.',
        'KAYLA: A favourite rock. In a little pocket. Under the arm. I am not going to get over that ' +
          'for a while.',
        'KAYLA: Here, you have earned this.',
        'She produces a twin icy pole and snaps it in half. Then she stops, with a piece in each ' +
          'hand, and looks at them for slightly longer than the decision needs.',
        'She gives you the smaller half.',
        'KAYLA: Right. Yes. There we are.'
      ],
      onEnd: [{ type: 'completeQuest', id: 'q_kayla_cove' }]
    },
    {
      when: { quest: { q_kayla_cove: 'active' } },
      lines: [
        'KAYLA: Any luck? It has to be somebody who actually touches them, mind. Not the kiosk.',
        'KAYLA: Dana for the seals, I think. And the otter one is the chap who is always holding a ' +
          'bucket. Always. I have never once seen him without it.'
      ]
    },
    {
      when: { quest: { q_kayla_cove: 'not_started' } },
      lines: [
        'A woman in a sun hat is leaning on the rail above the seal pool with the settled look of ' +
          'somebody who has been there a long time and is not bored yet.',
        'KAYLA: Oh! You work here. Hello. Sorry. I have been waiting all morning for somebody with a ' +
          'lanyard and now there is one I have gone completely blank.',
        'KAYLA: Kayla. I come here a lot. My sister says too much. My sister is wrong.',
        'KAYLA: Right. Two questions, and they are both going to sound daft, and I would love it if ' +
          'you did not do the face.',
        'KAYLA: One. Do the seals like snoot boops? And if they do, how do you make sure they actually ' +
          'get them? You cannot just boop an animal whenever you fancy it. That would be rude.',
        'KAYLA: Two. Do the otters get their tummies scrubbed? They smash clams on there. It must get ' +
          'sticky. And I think they would love it.',
        'KAYLA: I have thought about both of these more than is normal for a grown woman.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_kayla_cove' },
        { type: 'addXP', amount: 10 }
      ]
    },
    {
      lines: [
        'KAYLA: Can I ask you something, and you are allowed to tell me I am being daft.',
        'KAYLA: The otter goes round the same way every time. Anti-clockwise, always. I have been ' +
          'watching it a while now.',
        'KAYLA: Probably nothing! Animals have habits, don\'t they. It just niggles at me a bit.'
      ]
    }
  ]
};

SU.data.npcs.kayla_coral = {
  name: 'Kayla', role: 'Visitor', zone: 'coral_kingdom', sprite: 'kayla',
  place: 'the mangrove boardwalk',
  x: 29, y: 25, colour: '#c2e8a0', reactsToSuspicion: false,
  spawnCondition: { quest: { q_reef_induction: 'completed' } },
  movement: { type: 'wander', radius: 2, speed: 1.1, pause: [1, 3] },
  dialogue: [
    {
      when: { quest: { q_kayla_coral: 'active' }, flags: { kq_turtle_sand: true } },
      lines: [
        'KAYLA: Right! My reason. Do not laugh, I have been saving it.',
        'KAYLA: When they hatch they leg it down the beach, and while they are legging it they take a ' +
          'reading. Off the actual planet. The magnetic field.',
        'KAYLA: And every beach has a slightly different one. So the little thing is writing down an ' +
          'address while it runs.',
        'KAYLA: And then years and years later it comes back to that exact beach. Not the area. The ' +
          'BEACH.',
        'She beams at you. Then the beam dips a little, on its own.',
        'KAYLA: So I suppose what I wanted to know is whether she has got one. An address.',
        'KAYLA: Anyway! Icy pole. It has gone a bit soft, I am sorry, it is the humidity in here.',
        'She snaps it in half, considers the two pieces a moment, and passes you the smaller one.',
        'KAYLA: That is the softer end. You are getting the better one, really.'
      ],
      onEnd: [{ type: 'completeQuest', id: 'q_kayla_coral' }]
    },
    {
      when: { quest: { q_kayla_coral: 'active' } },
      lines: [
        'KAYLA: The vet, I reckon. The quiet one in the rehab unit. She looks like somebody who gives ' +
          'you a real answer.'
      ]
    },
    {
      when: { quest: { q_kayla_coral: 'not_started' } },
      lines: [
        'KAYLA: You! Hello! I followed you. That sounded sinister. I bought a ticket, it is all above ' +
          'board.',
        'She shows you the ticket. It is an ordinary ticket.',
        'KAYLA: Right. The big green turtle.',
        'KAYLA: Do you ever take her out and let her have a go on the sand? Not for a show. Just a bit ' +
          'of sand, for herself.',
        'KAYLA: I have got a reason and I think it is a good one, but I am not telling you yet, ' +
          'because if I tell you first you will only agree with me to be nice.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_kayla_coral' },
        { type: 'addXP', amount: 10 }
      ]
    },
    {
      lines: [
        'KAYLA: The touch pool has not shut once. I have been here since opening and it has not shut ' +
          'once.',
        'KAYLA: I keep looking for the bit where they go if they have had enough of being touched. I ' +
          'cannot find it. It is probably there and I am missing it.'
      ]
    }
  ]
};

SU.data.npcs.kayla_arctic = {
  name: 'Kayla', role: 'Visitor', zone: 'arctic_cove', sprite: 'kayla',
  place: 'the spine path between the pools',
  x: 24, y: 22, colour: '#c2e8a0', reactsToSuspicion: false,
  spawnCondition: { quest: { q_arctic_induction: 'completed' } },
  movement: { type: 'wander', radius: 2, speed: 1.1, pause: [1, 3] },
  dialogue: [
    {
      when: { quest: { q_kayla_arctic: 'active' },
              flags: { kq_walrus_brush: true, kq_beluga_melon: true } },
      lines: [
        'KAYLA: A brush on a POLE. And he comes and presents his own face for it. On purpose!',
        'KAYLA: And they are teeth. His tusks are just his top teeth that carried on going.',
        'KAYLA: Which I think matters more than it sounds, because apparently he hooks them into the ' +
          'ice and hauls himself out with them. That is how he gets out of the water.',
        'KAYLA: There is a proper name for it. Tooth-walking something. They named the whole animal ' +
          'after the trick.',
        'KAYLA: And the head IS squishy. I KNEW it was squishy.',
        'KAYLA: It is fat, and he squashes it about to aim his sound where he wants to look. He is ' +
          'changing the shape of his own face to see better. While you are standing there!',
        'KAYLA: And everybody calls it a melon, like it is fruit. It is the best organ in the building.',
        'She produces an icy pole. It is completely solid, and breaking it takes both hands and ' +
          'most of her concentration.',
        'She weighs the two halves. There is a pause. You get the smaller one.',
        'KAYLA: That has been in my coat. Give it a minute.'
      ],
      onEnd: [{ type: 'completeQuest', id: 'q_kayla_arctic' }]
    },
    {
      when: { quest: { q_kayla_arctic: 'active' } },
      lines: [
        'KAYLA: The walrus lady, and the fellow who hums at the belugas. He hums! Constantly! I am ' +
          'very fond of him already.'
      ]
    },
    {
      when: { quest: { q_kayla_arctic: 'not_started' } },
      lines: [
        'Kayla is here, in a coat several sizes too big and a hat with a bobble on it.',
        'KAYLA: Do not.',
        'KAYLA: Two questions today.',
        'KAYLA: One. Does the walrus get his tusks brushed? With a big brush? A walrus-sized ' +
          'toothbrush? And does he enjoy it? I do need to know whether he enjoys it.',
        'KAYLA: Two. Do the belugas\' heads feel squishy? They LOOK squishy. They look like if you ' +
          'pressed one your finger would go in a bit and then it would come back out.',
        'KAYLA: Somebody who actually touches them, please. Not the sign. I have read the sign.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_kayla_arctic' },
        { type: 'addXP', amount: 10 }
      ]
    },
    {
      lines: [
        'KAYLA: The seal in the ice pen is grey. He should be going silver by now, shouldn\'t he? For ' +
          'the moult?',
        'KAYLA: He keeps getting back into the water. I do not know why that bothers me but it does.'
      ]
    }
  ]
};

SU.data.npcs.kayla_ocean = {
  name: 'Kayla', role: 'Visitor', zone: 'open_ocean', sprite: 'kayla',
  place: 'the middle promenade',
  x: 27, y: 17, colour: '#c2e8a0', reactsToSuspicion: false,
  spawnCondition: { quest: { q_ocean_induction: 'completed' } },
  movement: { type: 'wander', radius: 2, speed: 1.1, pause: [1, 3] },
  dialogue: [
    {
      when: { quest: { q_kayla_ocean: 'active' },
              flags: { kq_orca_hat: true, kq_orca_boat: true } },
      lines: [
        'KAYLA: HATS. It is true! I read about it and I genuinely could not believe it.',
        'KAYLA: One of them put a dead salmon on her head, in the eighties, and then they ALL did it. ' +
          'The whole lot. Pods that were not even related.',
        'KAYLA: And then they stopped. All of them, at about the same time, and nobody has ever worked ' +
          'out why. And then a couple of years ago they started again. Forty years later!',
        'KAYLA: That is a fashion. That is a fad. Animals are not supposed to have fads.',
        'KAYLA: And the boat business is the same thing, isn\'t it. It went round the young ones like ' +
          'a game goes round a playground.',
        'She slows down a little.',
        'KAYLA: Though I suppose you need other ones for that. You cannot start a fashion on your own.',
        'KAYLA: Anyway! Icy pole. Take it off me before I say something gloomy.',
        'She breaks it in half. There is a short silence while she establishes which half is which.',
        'KAYLA: You have the little one. You are working, you cannot be carrying a big one about.'
      ],
      onEnd: [{ type: 'completeQuest', id: 'q_kayla_ocean' }]
    },
    {
      when: { quest: { q_kayla_ocean: 'active' } },
      lines: [
        'KAYLA: The tall one with the radio. The boss. Ask her, she knows things.',
        'KAYLA: She goes a bit odd about the orca and I would love to know why.'
      ]
    },
    {
      when: { quest: { q_kayla_ocean: 'not_started' } },
      lines: [
        'KAYLA: Right, this zone has annoyed me and I will tell you why afterwards.',
        'KAYLA: Two questions, and they are both about the orca that nobody will let me look at.',
        'KAYLA: One. Do they ever turn their food into hats? Do not do the face. I am being serious.',
        'KAYLA: Two. Do you give them toy boats? Or bits of boats? Boat parts?',
        'KAYLA: Both of those sound completely mad and I am fairly sure both of them are real, and I ' +
          'would like a professional to say so out loud.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_kayla_ocean' },
        { type: 'addXP', amount: 10 }
      ]
    },
    {
      lines: [
        'KAYLA: Here is what annoyed me, since you did not ask.',
        'KAYLA: Every pool in this zone has a window. That one has a wall.',
        'KAYLA: The entire point of this place is people looking at things, and there is a wall.'
      ]
    }
  ]
};

SU.data.npcs.kayla_deep = {
  name: 'Kayla', role: 'Visitor', zone: 'the_deep', sprite: 'kayla',
  place: 'the pontoon walkway',
  x: 31, y: 22, colour: '#c2e8a0', reactsToSuspicion: false,
  spawnCondition: { quest: { q_deep_induction: 'completed' } },
  movement: { type: 'wander', radius: 2, speed: 1.1, pause: [1, 3] },
  dialogue: [
    {
      when: { quest: { q_kayla_deep: 'active' },
              flags: { kq_dugong_lettuce: true, kq_humpback_song: true } },
      lines: [
        'KAYLA: Lettuce! In the whiskers! I was RIGHT.',
        'KAYLA: Although. He said the bristles are a tool. She is supposed to be shoving that face ' +
          'into the sand and hauling seagrass up by the roots.',
        'KAYLA: And lettuce just sits there on the top. She opens her mouth and it arrives.',
        'KAYLA: So the whole face has got nothing to do. I had not thought of it like that.',
        'She sits with that for a second, and then brightens again almost immediately.',
        'KAYLA: But the SONG. The song is the best thing I have ever been told.',
        'KAYLA: They all sing the same one! All of them, in one stretch of ocean, the same song. And ' +
          'it changes a bit every week and they all change with it. Together.',
        'KAYLA: And every few years a completely new one comes across from somewhere else and they ' +
          'drop theirs and learn it. West to east. Like a song getting popular.',
        'KAYLA: So there IS a favourite. It is just whichever one is going round this year.',
        'She looks out at the water for a moment.',
        'KAYLA: He said ours has got shorter. Three years running.',
        'KAYLA: I did not have anything clever to say about that, so. Here. Have the icy pole.',
        'She snaps it in half. The pause is shorter than it was in the Cove, but it is still there, ' +
          'and you still end up with the smaller half.',
        'KAYLA: I know. I know. Five zones and I have not managed it once.'
      ],
      onEnd: [{ type: 'completeQuest', id: 'q_kayla_deep' }]
    },
    {
      when: { quest: { q_kayla_deep: 'active' } },
      lines: [
        'KAYLA: The young lad for the dugong. He actually answers you, that one.',
        'KAYLA: And the vet for the singing. He will not like the question. Ask it anyway.'
      ]
    },
    {
      when: { quest: { q_kayla_deep: 'not_started' } },
      lines: [
        'Kayla is sitting on the edge of the pontoon with her shoes off, which given where you are ' +
          'standing is quite a statement.',
        'KAYLA: Before you ask, there is a gap in a fence and I am not proud of myself.',
        'KAYLA: This place is not on the map. I checked twice. I do like a map.',
        'KAYLA: Two questions and then I will go. Probably.',
        'KAYLA: One. Does the dugong get lettuce stuck in her whiskers? Because that is a lot of ' +
          'whiskers and it is a LOT of lettuce.',
        'KAYLA: Two. Does the big one sing when she is happy? And if she does, has she got a ' +
          'favourite song?',
        'KAYLA: That second one is a real question. I know exactly how it sounds. It is a real question.'
      ],
      onEnd: [
        { type: 'startQuest', id: 'q_kayla_deep' },
        { type: 'addXP', amount: 10 }
      ]
    },
    {
      lines: [
        'KAYLA: There is a pen down the far end with a number on it instead of a name.',
        'KAYLA: Everything else here has a name. Somebody has gone round and named the pumps, in ' +
          'marker pen.',
        'KAYLA: I keep thinking about that one and I would rather not.'
      ]
    }
  ]
};

/* ============================================================
   THE NINE QUESTIONS, hoisted onto the trainers.

   Each entry is gated on its own Kayla quest being ACTIVE and on its
   own flag being unset, so it fires exactly once and then gets out
   of the way of that character's real content forever.
   ============================================================ */

SU.data.kaylaQuestions = [
  /* ---- ZONE 1 ---- */
  { npc: 'dana', flag: 'kq_seal_boop', quest: 'q_kayla_cove',
    lines: [
      'DANA: Ask me what?',
      'You ask her whether the harbour seals like snoot boops, and how she makes sure they get them.',
      'She looks at you for a moment with an expression you cannot read.',
      'DANA: ...Right. So. The thing you are describing has a name and we do it about four hundred ' +
        'times a day. It is called a nose target.',
      'DANA: She comes over, she puts her nose on the target, she gets told she is wonderful. That is ' +
        'the foundation of every single thing we ask an animal to do here.',
      'DANA: And she has to come to it. That is the whole point. If she does not fancy it today she ' +
        'does not do it and nothing happens to her.',
      'DANA: So yes. She gets them, she gets them constantly, and she can turn them down.',
      'She goes back to her clipboard and then stops.',
      'DANA: Who is asking?',
      'You tell her.',
      'DANA: Huh. Tell her it is called a nose target. Tell her properly, she sounds like somebody ' +
        'who would want the actual word.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'kq_seal_boop', value: true }, { type: 'addXP', amount: 15 }] },

  { npc: 'milo', flag: 'kq_otter_tummy', quest: 'q_kayla_cove',
    lines: [
      'You ask Milo whether the otters get their tummies scrubbed so they can smash clams properly.',
      'MILO: ...Mate.',
      'MILO: Okay, no, hang on, that is not a stupid question, give me a second.',
      'MILO: So we do not scrub them, because you cannot really scrub an otter, they are extremely ' +
        'opinionated. But grooming is the single biggest thing in their whole day and we build the ' +
        'pool around it.',
      'MILO: They have got no blubber. Nothing. All that keeps them alive is air trapped in the fur, ' +
        'so if the fur gets matted or oily they get cold and then they get sick.',
      'MILO: So we give them rough matting to roll on, and blowers, and things to rub against, and ' +
        'the whole design is basically a very expensive towel.',
      'MILO: And yes they smash things on their chest. There is a flap of loose skin under each arm ' +
        'and they keep the rock in there. The same rock. They have favourites.',
      'MILO: Actually, hold on. Nobody has asked me a nice question about the otters in about a year. ' +
        'Tell whoever it was they can come and watch a grooming session with me.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'kq_otter_tummy', value: true }, { type: 'addXP', amount: 15 }] },

  /* ---- ZONE 2 ---- */
  { npc: 'sato', flag: 'kq_turtle_sand', quest: 'q_kayla_coral',
    lines: [
      'You ask Dr Sato whether Kira ever gets taken out and put on sand.',
      'SATO: On sand.',
      'SATO: Not as a treat, no. A turtle out of water is carrying her whole weight on a body that was ' +
        'not built for it, so we do not do it for fun.',
      'SATO: But you are closer to something than you think. We do use a haul-out area in rehab, and ' +
        'for a female we would need one eventually regardless.',
      'SATO: Females come ashore. It is the only time they ever leave the water, and they do it to nest.',
      'She stops writing.',
      'SATO: Which is a question I have not been allowed to put in a report about this animal, so I ' +
        'am going to enjoy the fact that somebody asked it out loud.',
      'SATO: Who wanted to know?',
      'You tell her it was a visitor on the boardwalk.',
      'SATO: Of course it was.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'kq_turtle_sand', value: true }, { type: 'addXP', amount: 15 }] },

  /* ---- ZONE 3 ---- */
  { npc: 'mags', flag: 'kq_walrus_brush', quest: 'q_kayla_arctic',
    lines: [
      'You ask Mags whether Nuka gets his tusks brushed with a walrus-sized toothbrush, and whether ' +
        'he smiles when they do it.',
      'MAGS: Ha! Right.',
      'MAGS: Yes. Genuinely yes. Not a toothbrush the size of a walrus, that is a mental image and I ' +
        'thank you for it, but a scrubbing brush on a pole and a lot of praise.',
      'MAGS: Tusks are teeth. Canines. They keep growing his whole life and they chip and they crack ' +
        'and if one abscesses you have got a very large animal in a very great deal of pain.',
      'MAGS: So we train him to come up and present his face and hold still while somebody he trusts ' +
        'has a proper look. Voluntarily. He can leave whenever he likes.',
      'MAGS: Does he smile. He does a thing. I would not swear it is a smile in court but I know what ' +
        'it looks like.',
      'She glances at the haul-out and the humour goes out of her.',
      'MAGS: Ask me about the wear on them another time.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'kq_walrus_brush', value: true }, { type: 'addXP', amount: 15 }] },

  { npc: 'rune', flag: 'kq_beluga_melon', quest: 'q_kayla_arctic',
    lines: [
      'You ask Rune whether a beluga\'s head feels squishy.',
      'RUNE: (stops humming) Yes.',
      'RUNE: Properly squishy. Like a bag of warm oil under a very good glove.',
      'RUNE: It is called the melon and it is fat, and it is not decorative. He is changing the shape ' +
        'of it, all the time, while you watch. You can see it move.',
      'RUNE: He makes a sound in his nose and that lump focuses it, like a lens, and he points it at ' +
        'what he wants to look at. Belugas can squash it and bulge it out and pull it flat.',
      'RUNE: So the squishiness is the whole trick. A hard head would not work.',
      'RUNE: Whoever asked you that has understood something most people never bother with, which is ' +
        'that the animal is not looking at you with its eyes.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'kq_beluga_melon', value: true }, { type: 'addXP', amount: 15 }] },

  /* ---- ZONE 4 ---- */
  { npc: 'halina', flag: 'kq_orca_hat', quest: 'q_kayla_ocean',
    lines: [
      'You ask Halina whether orcas ever turn their food into hats.',
      'HALINA: Do they what.',
      'You repeat it. She puts the radio down.',
      'HALINA: ...They do, actually. It is documented. Puget Sound, in the eighties, the residents ' +
        'started carrying dead salmon around on their heads and it spread through the whole ' +
        'population and then stopped as suddenly as it started.',
      'HALINA: There is no function to it. It is a fad. Which is a word I am uncomfortable using ' +
        'about an animal and which is nonetheless the correct word.',
      'HALINA: Why are you asking me this.',
      'You explain about Kayla.',
      'HALINA: Right.',
      'She is quiet for a second longer than the question needs.',
      'HALINA: For the record, the reason it spreads is that they copy each other. That is the ' +
        'finding. Not the hat. The copying.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'kq_orca_hat', value: true }, { type: 'addXP', amount: 15 }] },

  { npc: 'halina', flag: 'kq_orca_boat', quest: 'q_kayla_ocean',
    lines: [
      'You ask Halina about giving an orca boat parts to play with.',
      'HALINA: You are going to have to stop asking me questions I cannot answer in a normal voice.',
      'HALINA: Novel object enrichment. Yes. It is standard, it is required, and for an animal like ' +
        'that it needs to be big, complicated and different every time or it is not enrichment, it ' +
        'is furniture.',
      'HALINA: And yes, I know exactly what she is referring to. The Iberian animals and the rudders. ' +
        'It went through the juveniles like a schoolyard game and the researchers are fairly sure ' +
        'that is precisely what it was.',
      'HALINA: What she is circling, and I suspect she knows it, is that all of that needs company. ' +
        'You cannot pass a game to nobody.',
      'HALINA: Is there anything else, because I would like to go and stand somewhere else now.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'kq_orca_boat', value: true }, { type: 'addXP', amount: 15 }] },

  /* ---- ZONE 5 ---- */
  { npc: 'toby', flag: 'kq_dugong_lettuce', quest: 'q_kayla_deep',
    lines: [
      'You ask Toby whether Pip gets lettuce stuck in her whiskers.',
      'TOBY: Constantly. She looks like a hedge.',
      'TOBY: Sorry, that is the fun answer. The real answer is worse.',
      'TOBY: Those bristles are not whiskers exactly, they are a tool. In the wild she would be driving ' +
        'that face into the seabed and pulling seagrass up by the root, whole plants, rhizome and all. ' +
        'It is hard physical work and it is most of what a dugong does all day.',
      'TOBY: Cos lettuce floats. She opens her mouth and it goes in.',
      'TOBY: So she gets it in her bristles, and she has got no reason to use them, and I have been ' +
        'saying that in writing for five months.',
      'He looks at you properly for the first time.',
      'TOBY: Who asked you that?',
      'You tell him.',
      'TOBY: Right. Tell her thanks. Genuinely. I had started to think I was the only one.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'kq_dugong_lettuce', value: true }, { type: 'addXP', amount: 15 }] },

  { npc: 'sunil', flag: 'kq_humpback_song', quest: 'q_kayla_deep',
    lines: [
      'You ask Sunil whether Kirra sings when happy, and what Kirra\'s favourite song is.',
      'SUNIL: (long pause) That is two questions and the second one is not the silly one.',
      'SUNIL: Humpbacks sing. Males do, at any rate, and we do not really know why, so anybody who ' +
        'tells you it means happy is guessing.',
      'SUNIL: But the favourite song part has an actual answer, which is the thing that will annoy you.',
      'SUNIL: Every male in a population sings the same song. The same one. It drifts a little every ' +
        'week and they all drift with it, in step, and then every few years an entirely new song ' +
        'arrives from another population and they all abandon theirs and learn it.',
      'SUNIL: It moves west to east across the southern oceans. It has been tracked. It is the ' +
        'closest thing to pop music outside our species.',
      'SUNIL: So yes. There is a favourite song. It is whichever one is going round this year.',
      'He does not say the next part for a while.',
      'SUNIL: Ours has been getting shorter every season for three seasons. I have the recordings. ' +
        'I have not written down what I think it means.'
    ],
    onEnd: [{ type: 'setFlag', flag: 'kq_humpback_song', value: true }, { type: 'addXP', amount: 15 }] }
];

/* Hoist every question onto the FRONT of its trainer's dialogue list.
   Appending would put them below entries that always match, which is
   the single most repeated bug in this project's history. */
(function hoistKaylaQuestions() {
  SU.data.kaylaQuestions.forEach(q => {
    const npc = SU.data.npcs[q.npc];
    if (!npc || !npc.dialogue) {
      console.warn('[SU] Kayla: cannot hoist onto missing NPC', q.npc);
      return;
    }
    const cond = { quest: {}, flags: {} };
    cond.quest[q.quest] = 'active';
    cond.flags[q.flag] = false;
    npc.dialogue.unshift({ when: cond, lines: q.lines, onEnd: q.onEnd });
  });
})();
