/* ============================================================
   SEA UNIVERSE: KEEPER TALKS

   The public half of the job. A `talk` object in a zone points at
   one of these pools; the game draws a question at random, once per
   day per talk point.

   You cannot fail a keeper talk. A wrong answer still ends with the
   correct fact, the crowd learns either way, which is the whole
   point of the mechanic. A right answer pays XP and buys goodwill
   (suspicion down), because the trainer who knows things is the one
   nobody looks at twice.

   SHAPE
     questions: [
       { q:       'what the guest asks',
         options: [ { text:'your answer', correct:true, reply:'what you say back' }, ... ],
         fact:    'the real answer, shown either way: this is the teaching payload' }
     ]

   Exactly one option per question should be `correct:true`; the
   validator enforces it.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

SU.data.talks = {

  /* ---------- Coastal Cove ---------- */
  cove_plaza: {
    name: 'Cove Plaza Talk',
    questions: [
      {
        q: 'A dad points at the pools. "So what\'s the difference between a seal and a sea lion? Is it just size?"',
        options: [
          { text: '"Look at the ears: sea lions have ear flaps, true seals don\'t."', correct: true,
            reply: 'Half the group immediately checks. You hear "OH YEAH" from three directions.' },
          { text: '"Size, mostly. Sea lions are the big ones."',
            reply: 'The dad nods. A teenager behind him quietly looks it up on her phone and frowns.' },
          { text: '"Sea lions are the ones that do the shows."',
            reply: '"So it\'s a job title?" he says. You have accidentally been funny.' }
        ],
        fact: 'Sea lions have visible external ear flaps and can rotate their hind flippers forward to walk on land. ' +
              'True seals have no ear flaps and bounce along on their bellies.'
      },
      {
        q: 'A kid asks how long a seal can stay underwater.',
        options: [
          { text: '"About half an hour. They slow their heart right down."', correct: true,
            reply: '"HALF AN HOUR," he repeats, to nobody, forever.' },
          { text: '"A couple of minutes, same as a good swimmer."',
            reply: 'He looks disappointed, which is the correct response to a wrong answer.' },
          { text: '"They have to come up every thirty seconds."',
            reply: '"That\'s rubbish," says his sister, who is right.' }
        ],
        fact: 'Harbour seals can dive for up to 30 minutes and reach 90 m. They drop their heart rate to around ' +
              '15 beats per minute and shunt blood away from the limbs to the brain and heart.'
      },
      {
        q: 'Someone asks why the otter never stops rubbing herself.',
        options: [
          { text: '"She\'s grooming: her fur is the only thing keeping her warm."', correct: true,
            reply: 'A woman near the front says "she has no fat?" and you get to say no, none.' },
          { text: '"She\'s just being playful."',
            reply: 'It is a nice thought and it is not what she is doing.' },
          { text: '"She\'s itchy: the water\'s a bit cold today."',
            reply: 'Somebody asks a follow-up question you can\'t answer.' }
        ],
        fact: 'Sea otters have no blubber. They survive on air trapped in the densest fur of any animal (up to' +
              'a million hairs per square inch), so grooming is not vanity, it is thermoregulation.'
      },
      {
        q: 'A woman asks, kindly, whether the animals here are happy.',
        options: [
          { text: '"We measure it: behaviour, appetite, choice. Ask me what we look for."', correct: true,
            reply: 'She listens to all of it. At the end she says "thank you for not just saying yes".' },
          { text: '"Of course! They\'ve got it better than in the wild."',
            reply: 'She smiles politely. You have said the thing on the poster.' },
          { text: '"I\'m not allowed to answer that one, sorry."',
            reply: 'Her face changes. You have told her something you did not mean to tell her.' }
        ],
        fact: 'Modern welfare science does not ask "is it happy" but "what can it choose?" Assessment covers ' +
              'behavioural variety, body condition, absence of stereotypic behaviour, and whether the animal ' +
              'can control what happens to it, including refusing.'
      }
    ]
  },

  /* ---------- Coral Kingdom plaza ---------- */
  reef_plaza: {
    name: 'Reef Plaza Talk',
    questions: [
      {
        q: 'A boy wants to know how dolphins find fish in murky water.',
        options: [
          { text: '"They shout and listen to the echo, through their jaw, not their ears."', correct: true,
            reply: 'He asks you to say the jaw part again. You say it again.' },
          { text: '"Really good eyesight."',
            reply: 'He accepts this. He should not have accepted this.' },
          { text: '"They smell it, like a shark."',
            reply: 'A parent says "do dolphins even smell?" and you realise you have wandered off a cliff.' }
        ],
        fact: 'Dolphins echolocate: clicks are focused through the fatty melon in the forehead, and returning ' +
              'echoes are received through fat channels in the lower jaw and passed to the inner ear. ' +
              'Toothed whales have essentially no sense of smell.'
      },
      {
        q: 'A guest asks whether it\'s true that a turtle\'s sex depends on the sand.',
        options: [
          { text: '"It\'s the temperature: warm nests make females, cooler nests make males."', correct: true,
            reply: 'Somebody immediately asks what happens as the climate warms. Good question. Say so.' },
          { text: '"No, they have chromosomes like us."',
            reply: 'A teacher in the group tilts her head. You have been marked.' },
          { text: '"It depends how deep the egg is buried."',
            reply: 'Close enough to sound plausible, which makes it worse.' }
        ],
        fact: 'Sea turtles have temperature-dependent sex determination. Warmer nests produce females, and on' +
              'some northern Great Barrier Reef beaches, over 99% of green turtle hatchlings are now female.'
      },
      {
        q: 'A woman asks what the dolphins do when there is no show on.',
        options: [
          { text: '"Training, enrichment, health checks, and a lot of nothing, which is the honest answer."', correct: true,
            reply: 'She appreciates the honest answer. Most people do, is the thing.' },
          { text: '"They rehearse for the next show!"',
            reply: 'You hear how it sounds as you say it.' },
          { text: '"They sleep: dolphins sleep most of the day."',
            reply: 'Not true, and you have just invented a very restful animal.' }
        ],
        fact: 'Dolphins sleep unihemispherically (one brain hemisphere at a time, one eye open), so they never ' +
              'fully switch off. Wild groups travel tens of kilometres a day, which is the number captive ' +
              'enclosure design is measured against.'
      },
      {
        q: 'A man asks why the park breeds animals if it is a rescue centre.',
        options: [
          { text: '"That\'s a fair question. Breeding and rescue are two different programmes."', correct: true,
            reply: 'You have said nothing you cannot defend, and he can tell.' },
          { text: '"We don\'t breed here. Every animal is a rescue."',
            reply: 'You have just repeated a line you personally know to be false.' },
          { text: '"It\'s for conservation: we release the calves."',
            reply: 'He asks where to. You do not have a where to.' }
        ],
        fact: 'Captive breeding only counts as conservation if animals are released to the wild or the programme ' +
              'is managed for that goal. Australian cetacean facilities have not released a captive-bred dolphin ' +
              'to the wild; calves are typically transferred between facilities.'
      },
      {
        q: 'A kid holds up a plastic bottle lid and asks if it really matters.',
        options: [
          { text: '"To a turtle, floating soft plastic looks exactly like a jellyfish."', correct: true,
            reply: 'He puts the lid in his pocket instead of the bin. You will take it.' },
          { text: '"Not really, one lid is nothing."',
            reply: 'He shrugs and drops it. That one is on you.' },
          { text: '"Only if it gets in the ocean, and ours all gets recycled."',
            reply: 'You point at a drain you personally pulled plastic out of this morning.' }
        ],
        fact: 'Ingested plastic blocks a turtle\'s gut, gas builds up behind the blockage, and the animal loses ' +
              'the ability to dive, "floating syndrome". It is one of the commonest reasons sea turtles are ' +
              'admitted to rehabilitation in Australia.'
      }
    ]
  },

  /* ---------- Reef hall ---------- */
  reef_hall: {
    name: 'Reef Hall Talk',
    questions: [
      {
        q: 'A girl presses against the glass. "Why does that shark keep going to the top?"',
        options: [
          { text: '"He\'s gulping air to float: grey nurses are the only sharks that do it."', correct: true,
            reply: 'She watches for the next one and calls it before it happens.' },
          { text: '"He\'s hungry: that\'s where the food comes in."',
            reply: 'The next feed is not for six hours and he does it anyway.' },
          { text: '"Sharks have to keep moving or they drown."',
            reply: 'True of some sharks. Not this one, and not what he is doing.' }
        ],
        fact: 'Grey nurse sharks have no swim bladder. They gulp air at the surface and hold it in the stomach ' +
              'to hover motionless, the only shark known to do this. Most sharks rely on a huge oily liver instead.'
      },
      {
        q: 'A visitor asks how the cuttlefish changes colour so fast.',
        options: [
          { text: '"Muscles pulling pigment sacs open, and she\'s colourblind while she does it."', correct: true,
            reply: 'The colourblind part lands like a magic trick. It always does.' },
          { text: '"She\'s reflecting the light in the tank."',
            reply: 'She does it in the dark too, which rather ruins the theory.' },
          { text: '"It\'s her mood: it happens automatically."',
            reply: 'Half right, which in a keeper talk is just wrong with extra steps.' }
        ],
        fact: 'Cephalopods change colour in under a second using chromatophores, pigment sacs pulled open by ' +
              'tiny muscles under direct nerve control. Cuttlefish are almost certainly colourblind, and ' +
              'appear to read their surroundings through polarised light and contrast instead.'
      },
      {
        q: 'A boy asks what the spiral thing wedged in the rocks is.',
        options: [
          { text: '"A Port Jackson shark egg: the spiral screws it into a crevice."', correct: true,
            reply: 'He calls it a "shark screw" and honestly that is better.' },
          { text: '"A piece of old rope."',
            reply: 'It is very obviously not a piece of old rope.' },
          { text: '"Coral, growing sideways."',
            reply: 'You have confidently named the wrong kingdom of life.' }
        ],
        fact: 'Port Jackson sharks lay corkscrew-shaped egg cases and wedge them into rock crevices so surge ' +
              'cannot wash them away. The pup develops inside for around 10 to 11 months.'
      },
      {
        q: 'Someone asks whether the reef tank is "like a real reef".',
        options: [
          { text: '"It\'s a good simulation of a small part of one. A real reef is mostly connections."', correct: true,
            reply: 'You get to explain what a keystone species is, to a genuinely interested adult.' },
          { text: '"Basically identical, yes."',
            reply: 'It is 1.4 million litres. The Great Barrier Reef is 344,400 square kilometres.' },
          { text: '"Better, honestly: no predators, no bleaching."',
            reply: 'The word bleaching does something to the mood of the group.' }
        ],
        fact: 'A reef is defined by its interactions (grazing, cleaning, predation and nutrient cycling), not' +
              'by its species list. Remove one keystone grazer and the whole structure shifts, which is why ' +
              'aquarium displays can teach anatomy far better than they can teach ecology.'
      }
    ]
  },

  /* ---------- Arctic Cove ---------- */
  arctic_plaza: {
    name: 'Ice Talk',
    questions: [
      {
        q: 'A boy in a puffer jacket points at Nuka. "Does he stab things with those? Like, fish?"',
        options: [
          { text: '"They\'re teeth, and he mostly uses them to haul himself out onto ice."', correct: true,
            reply: 'The boy immediately tries to haul himself onto a bench using his own front teeth. His mother intervenes.' },
          { text: '"They\'re for digging clams out of the seabed."',
            reply: 'Close enough that nobody queries it, which is somehow worse.' },
          { text: '"Mostly for fighting other walruses."',
            reply: '"Cool," he says, satisfied, and you have taught him almost nothing.' }
        ],
        fact: 'Walrus tusks are enlarged canine teeth used to haul out onto ice and to display or spar. The digging is done ' +
              'with roughly 600 stiff whiskers, which find buried clams entirely by touch.'
      },
      {
        q: 'A woman asks why the belugas are so noisy compared to the dolphins.',
        options: [
          { text: '"Whalers called them sea canaries: they whistle, click and even copy sounds they hear."', correct: true,
            reply: 'She listens for a while and says, "That one\'s copying the machine, isn\'t it." You change the subject.' },
          { text: '"They\'re just a chattier species."',
            reply: 'True, and completely unsatisfying. She waits for more. You have no more.' },
          { text: '"It\'s the shape of the pool bouncing the sound around."',
            reply: 'An honest-sounding answer about acoustics that neatly avoids saying anything about the animals.' }
        ],
        fact: 'Belugas are vocal learners: they whistle, click and creak, and they can imitate sounds around them, including ' +
              'human speech and machinery. Whalers nicknamed them sea canaries.'
      },
      {
        q: 'An older man taps the glass by the ice pen. "Poor things must be freezing in there."',
        options: [
          { text: '"Actually the risk here is the opposite: their blubber is built for twenty below."', correct: true,
            reply: 'He looks at the patio heaters. Then at the seals. Then at you. "Right," he says slowly.' },
          { text: '"They\'re used to it, they\'re Arctic animals."',
            reply: 'He nods and moves on, having learned that animals simply get used to things.' },
          { text: '"We keep the water warmer than it looks."',
            reply: 'You have reassured him and told him something that is not true, which is a trade you should notice making.' }
        ],
        fact: 'Harp seals carry several centimetres of blubber and rest on sea ice in sub-zero air. Mild temperatures are the ' +
              'real hazard: spread flippers and rapid breathing are cooling behaviours, not contentment.'
      }
    ]
  },

  /* ---------- Open Ocean ---------- */
  ocean_plaza: {
    name: 'Open Ocean Talk',
    questions: [
      {
        q: 'A teenager, arms folded: "Is an orca a whale or a dolphin? Because my brother says whale and he is wrong about everything."',
        options: [
          { text: '"Dolphin. The orca is the largest member of the dolphin family."', correct: true,
            reply: 'She turns round and shouts the word "DOLPHIN" across the plaza at a boy who does not react.' },
          { text: '"Whale. It is a killer whale, the clue is in the name."',
            reply: 'The brother, twenty metres away and apparently listening after all, punches the air.' },
          { text: '"Bit of both, really."',
            reply: 'She looks at you with the specific contempt of somebody who came here for an actual answer.' }
        ],
        fact: 'Orcas are the largest of the oceanic dolphins (family Delphinidae). Everything true of dolphins' +
              '(echolocation, complex social groups, learned vocal culture) applies to an animal that can weigh six tonnes.'
      },
      {
        q: 'A man points at a photograph of a wild orca on the hoarding. "Why is that one\'s fin all floppy? Is it sick?"',
        options: [
          { text: '"That one is upright: the bent ones are almost always animals kept in pools."', correct: true,
            reply: 'He looks at the hoarding for a long moment. "Huh," he says. It is the most honest sound you hear all day.' },
          { text: '"It happens to all older males, wild or not."',
            reply: 'He accepts it immediately, which is exactly why the line gets used.' },
          { text: '"It is just how they are built."',
            reply: 'A woman behind him says, quietly, "then why is it straight in the photo?" You do not have a follow-up.' }
        ],
        fact: 'Dorsal fin collapse is seen in around 1% of wild male orcas, and in close to 100% of adult males held ' +
              'in pools. The fin has no bone in it: time spent at the surface and a lack of deep, fast swimming let it fold.'
      },
      {
        q: 'A small girl asks how you can tell one manta from another.',
        options: [
          { text: '"By the spots on its belly: every manta\'s pattern is different, like a fingerprint."', correct: true,
            reply: 'She immediately lies down on the deck to look up through the glass, which is genuinely the correct technique.' },
          { text: '"By their size, mostly."',
            reply: 'She frowns. "But they grow." She has beaten you in one move.' },
          { text: '"We put tags on them."',
            reply: 'She looks for a tag. There is no tag. She keeps looking.' }
        ],
        fact: 'Manta belly-spot patterns are unique to the individual and do not change with age, so researchers identify ' +
              'and re-sight the same animals from photographs for decades. It is the same principle as whale fluke catalogues.'
      },
      {
        q: 'A guest asks why the pilot whales all stay so close together, "like they are stuck to each other".',
        options: [
          { text: '"A pod is three generations of one female line, and they never split up."', correct: true,
            reply: 'He watches them for a while. "So the old one is the boss." Close enough that you let him have it.' },
          { text: '"They are just being friendly."',
            reply: 'It is not wrong. It is the kind of not-wrong that teaches nobody anything.' },
          { text: '"There is not much room, so they end up bunched."',
            reply: 'True, and you hear yourself say it, and you wish you had said the other thing.' }
        ],
        fact: 'Short-finned pilot whale pods are matrilineal and neither sons nor daughters disperse: grandmother, mother ' +
              'and calf stay together for life. The species also has a true menopause, with older females leading the pod ' +
              'for decades after their last calf.'
      }
    ]
  },

  /* ---------- The Deep ----------
     There are no guests here, so the "crowd" is a contractors'
     walk-through: six people in high-vis who have been shown round by
     nobody and have started asking the only person in a park polo.
     Same mechanic, and the questions are harder, because these are
     adults who build things for a living and can read a drawing. */
  deep_pool: {
    name: 'Contractors\' Walk-Through',
    questions: [
      {
        q: 'A woman with a clipboard nods at the humpback. "She keeps whacking the water with that fin. Is she distressed? ' +
           'Because I have to write something and I would rather write the truth."',
        options: [
          { text: '"Pectoral slapping is normal humpback behaviour. Communication and play. That one is not a finding."', correct: true,
            reply: 'She writes it down word for word. "Good. Half the stuff I get told on sites like this is guff, and ' +
                   'you can always tell, because nobody will say when something is fine."' },
          { text: '"Yes, that is a distress behaviour."',
            reply: 'She writes it down, and you immediately wish you had not said it, because now it is in a report.' },
          { text: '"Hard to say, honestly."',
            reply: 'She shrugs and writes "unknown", which helps precisely nobody.' }
        ],
        fact: 'Pectoral slapping is normal humpback behaviour, used in communication and play, and is seen constantly ' +
              'in wild animals. Knowing which behaviours are normal is what makes the abnormal ones credible when you ' +
              'report them.'
      },
      {
        q: 'A site engineer squints across the pen. "That blue one. Biggest thing I have ever seen. How many of these do ' +
           'places like this normally have?"',
        options: [
          { text: '"None. No blue whale has ever been held in captivity anywhere. This is the only one."', correct: true,
            reply: 'He does not answer for a while. Then: "So there is no manual for this." No, there is not.' },
          { text: '"Two or three around the world, usually."',
            reply: 'He nods, reassured, and it is not true, and you have just made this place sound normal.' },
          { text: '"Most of the big parks have one."',
            reply: 'He accepts it completely, which is exactly how a thing like this stops being remarkable.' }
        ],
        fact: 'No blue whale has ever been held in captivity. The largest animal that has ever lived requires up to four ' +
              'tonnes of krill a day in the feeding season and travels thousands of kilometres between grounds. There is ' +
              'no husbandry literature for it because it has never been done.'
      },
      {
        q: 'A young apprentice points at the deep end. "Someone said the whale down there goes to a thousand metres. ' +
           'That is deeper than the water, obviously. So how deep is it here?"',
        options: [
          { text: '"Eleven metres. It says so on the safety plate under her information board."', correct: true,
            reply: 'He looks at the board, then the plate, then the board again. "They put both of them on the same post," ' +
                   'he says, to nobody.' },
          { text: '"Deep enough for what she needs."',
            reply: 'He looks at you for a second too long. He is nineteen and he already knows what that sentence is.' },
          { text: '"About a hundred, I think."',
            reply: 'He whistles, impressed, and you have just told a lie you will keep thinking about.' }
        ],
        fact: 'Sperm whales routinely dive past 1,000 m and have been recorded beyond 2,000 m, on breath holds of up to ' +
              'an hour. Depth is where almost the whole of their life happens, which is why enclosure depth is a welfare ' +
              'measurement and not a detail.'
      },
      {
        q: 'A rigger, gesturing at the net across the channel: "Is that repair the same rope as the rest of it? ' +
           'Because from here it is not."',
        options: [
          { text: '"It is not. Lighter rope, wider mesh, cable-tied in. It is worth writing down."', correct: true,
            reply: 'He grins without any humour in it at all. "Thought so. Twenty-two years on nets. You can see it from ' +
                   'the shore." He gives you his card.' },
          { text: '"It is a temporary repair, it is signed off."',
            reply: 'He looks at it a moment longer. "By who," he says, and goes back to his coffee.' },
          { text: '"That is not really my area."',
            reply: 'He accepts that, which is fair, and something you could have used just went quiet.' }
        ],
        fact: 'A repair to a containment net must match the original specification for rope gauge and mesh size, because ' +
              'the weakest section sets the strength of the whole barrier. It is one of the few things on a site like ' +
              'this that anybody can check by eye.'
      },
      {
        q: 'Somebody asks, not unkindly, why the small one in the shore lagoon cannot just be let out, since she is the ' +
           'one who could actually swim away.',
        options: [
          { text: '"She was hand raised from four months. She has never foraged and she swims towards boats. She needs a ' +
                  'managed lagoon, not open water."', correct: true,
            reply: 'A silence. Then the woman with the clipboard says: "That is the first answer today that was not the ' +
                   'answer we wanted." It was not meant as a compliment and you take it as one.' },
          { text: '"She should be released tomorrow. They all should."',
            reply: 'It gets agreement from three of them straight away, and it is wrong, and the agreement is the problem.' },
          { text: '"She is fine where she is."',
            reply: 'Which is the sentence every animal on this site got here on.' }
        ],
        fact: 'Release is not automatically the welfare answer. A hand raised animal that has never foraged, and that has ' +
              'learned people and boats are safe, will not survive open release. The defensible position is decided animal ' +
              'by animal, and being able to argue against release when it is wrong is what makes the argument for it ' +
              'credible everywhere else.'
      }
    ]
  }
};
