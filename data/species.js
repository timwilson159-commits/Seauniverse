/* ============================================================
   SEA UNIVERSE: SPECIES (the "Dex")
   Each species carries: real biology facts (the teaching payload),
   and one or more `encounters` used by the Care Session mini-game.

   ENCOUNTER SHAPE
     need     : the id of the correct care action
     cues     : observable clues, revealed one at a time by "Observe"
                each cue has `points:true` if it hints at the correct answer
     options  : the care actions offered. Exactly one has correct:true
     lesson   : shown after the session, right or wrong (nobody fails silently)
     evidence : (optional) welfare evidence granted when solved
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

SU.data.species = {

  harbor_seal: {
    name: 'Harbour Seal',
    sci: 'Phoca vitulina',
    group: 'Pinniped',
    zone: 'coastal_cove',
    colour: '#8d9aa8',
    shape: 'blob',
    facts: [
      'Harbour seals can slow their heart rate to about 15 beats per minute while diving.',
      'They have no external ear flaps: a quick way to tell true seals from sea lions.',
      'Their whiskers (vibrissae) detect the water trail left behind by a swimming fish.',
      'Wild harbour seals routinely dive to 90 m and stay down for up to 30 minutes.'
    ],
    encounters: [
      {
        id: 'hs_offfeed',
        title: 'Off Her Food',
        prompt: 'Pearl has left most of her morning herring untouched for three days.',
        need: 'check_teeth',
        cues: [
          { text: 'She approaches the food, then turns away at the last moment.', points: true },
          { text: 'She is chewing on one side of her mouth only.', points: true },
          { text: 'Her coat looks normal: no wounds, no shedding.', points: false },
          { text: 'She is still active and swimming laps.', points: false }
        ],
        options: [
          { id: 'check_teeth', label: 'Ask the vet team for a dental check', correct: true,
            feedback: 'Right call. One-sided chewing plus food refusal is a classic dental pain sign.' },
          { id: 'more_fish', label: 'Offer more fish, more often',
            feedback: 'More food does not help an animal that is in pain when it eats.' },
          { id: 'ignore', label: 'Log it and wait another week',
            feedback: 'Three days off feed is already a welfare concern. Waiting is not neutral.' },
          { id: 'move_pool', label: 'Move her to a different pool',
            feedback: 'Moving an animal adds stress without addressing the cause.' }
        ],
        lesson: 'Refusing food is one of the earliest signs of illness in marine mammals. Trainers log intake every single feed precisely so a change like this gets caught fast.',
        evidence: null
      },
      {
        id: 'hs_smallpool',
        title: 'Circling',
        prompt: 'Pearl swims the same tight anticlockwise circuit for hours at a time.',
        need: 'enrichment',
        cues: [
          { text: 'The pattern is identical every lap: same line, same turn.', points: true },
          { text: 'She repeats it even with food available.', points: true },
          { text: 'The pool has no rocks, no varied depth, nothing to investigate.', points: true },
          { text: 'Her breathing rate is normal.', points: false }
        ],
        options: [
          { id: 'enrichment', label: 'Introduce enrichment and vary the environment', correct: true,
            feedback: 'Correct. Repetitive, unvarying movement is stereotypic behaviour, a barren-environment signal.' },
          { id: 'train_more', label: 'Run more training sessions to tire her out',
            feedback: 'Exercise alone does not fix an environment with nothing in it.' },
          { id: 'normal', label: 'Record it as normal swimming',
            feedback: 'Wild seals never swim identical repeated circuits. This is not normal.' },
          { id: 'sedate', label: 'Request sedation',
            feedback: 'Sedating an animal to suppress a behaviour treats the symptom, not the cause.' }
        ],
        lesson: 'Stereotypic behaviours (pacing, circling, repetitive surfacing) are recognised welfare indicators in captive animals. They point to an environment that fails to meet the animal\'s behavioural needs.',
        evidence: 'ev_pearl_stereotypy'
      }
    ]
  },

  california_sea_lion: {
    name: 'Californian Sea Lion',
    sci: 'Zalophus californianus',
    group: 'Pinniped',
    zone: 'coastal_cove',
    colour: '#6b5844',
    shape: 'blob',
    facts: [
      'Sea lions have visible external ear flaps and can rotate their hind flippers forward to walk on land.',
      'They are among the fastest pinnipeds, reaching about 40 km/h in short bursts.',
      'Males develop a raised bony crest (sagittal crest) on the skull as they mature.',
      'They are widely used in shows because they learn quickly, which raises its own ethical questions.'
    ],
    encounters: [
      {
        id: 'csl_showstress',
        title: 'Show Nerves',
        prompt: 'Bruno performed perfectly in rehearsal but is refusing to leave the holding pool before the public show.',
        need: 'reduce_pressure',
        cues: [
          { text: 'He complied fine when the stands were empty.', points: true },
          { text: 'The stadium sound system was replaced last week. It is much louder.', points: true },
          { text: 'He has eaten his full ration today.', points: false },
          { text: 'His trainer is new to him this month.', points: true }
        ],
        options: [
          { id: 'reduce_pressure', label: 'Pull him from the show and desensitise him gradually', correct: true,
            feedback: 'Correct. Refusal is communication. Forcing him would damage trust and teach him the pool is unsafe.' },
          { id: 'withhold_food', label: 'Withhold food until he cooperates',
            feedback: 'Withholding food to force compliance is coercive and is not accepted welfare practice.' },
          { id: 'push_through', label: 'Send him out anyway: the crowd is waiting',
            feedback: 'The crowd is not the welfare priority. This is exactly the pressure the park applies to its staff.' },
          { id: 'swap_animal', label: 'Swap in a different sea lion and move on',
            feedback: 'Solves today\'s show, but leaves the underlying cause unexamined.' }
        ],
        lesson: 'Modern animal training relies on positive reinforcement and the animal\'s right to decline. A refused behaviour is data about the animal\'s comfort, not disobedience.',
        evidence: 'ev_show_pressure'
      }
    ]
  },

  sea_otter: {
    name: 'Southern Sea Otter',
    sci: 'Enhydra lutris nereis',
    group: 'Mustelid',
    zone: 'coastal_cove',
    colour: '#7a5c3e',
    shape: 'blob',
    facts: [
      'Sea otters have the densest fur of any animal: up to 1 million hairs per square inch.',
      'They have no blubber, so they must eat around 25% of their body weight daily to stay warm.',
      'They use rocks as tools to crack open shellfish, one of the few tool-using marine mammals.',
      'By eating sea urchins, they protect kelp forests, making them a keystone species.'
    ],
    encounters: [
      {
        id: 'so_grooming',
        title: 'Matted Fur',
        prompt: 'Kelpie\'s fur looks flat and clumped along her flank, and she is shivering at the surface.',
        need: 'water_quality',
        cues: [
          { text: 'The clumping is worst where she rests against the pool wall.', points: true },
          { text: 'There is an oily film on the water surface near the filter outlet.', points: true },
          { text: 'She is grooming far more than usual but it is not helping.', points: true },
          { text: 'She is eating normally.', points: false }
        ],
        options: [
          { id: 'water_quality', label: 'Report a water quality fault and get her out of that pool', correct: true,
            feedback: 'Correct. Anything that coats otter fur destroys its insulation. This is an emergency, not cosmetic.' },
          { id: 'towel_dry', label: 'Towel her off and return her to the pool',
            feedback: 'Kind instinct, but you would be putting her straight back into the cause.' },
          { id: 'heat_lamp', label: 'Set up a heat lamp',
            feedback: 'Treats the shivering, ignores why she cannot keep herself warm.' },
          { id: 'feed_more', label: 'Increase her food to raise her metabolism',
            feedback: 'She needs more food when cold, but food will not restore ruined fur.' }
        ],
        lesson: 'Sea otters have no blubber layer. Their entire thermal survival depends on trapped air in clean, groomed fur, which is why oil spills are lethal to them specifically.',
        evidence: 'ev_water_quality_log'
      }
    ]
  },

  /* ==========================================================
     ZONE 2: CORAL KINGDOM
     ========================================================== */

  bottlenose_dolphin: {
    name: 'Bottlenose Dolphin',
    sci: 'Tursiops aduncus',
    group: 'Cetacean',
    zone: 'coral_kingdom',
    colour: '#7f97a8',
    shape: 'blob',
    facts: [
      'Dolphins sleep one half of the brain at a time, keeping one eye open. They never fully switch off.',
      'They hunt by echolocation: clicks are focused through the fatty melon in the forehead and the echoes are received through the lower jaw.',
      'Every dolphin develops a signature whistle that works like a name, and others copy it to address them.',
      'Wild Indo-Pacific bottlenose dolphins live in fission-fusion groups and may cover more than 50 km in a day.'
    ],
    encounters: [
      {
        id: 'bd_rakes',
        title: 'Rake Marks',
        prompt: 'Nyari has a set of parallel scratches down her flank that were not there on Friday.',
        need: 'give_retreat',
        cues: [
          { text: 'The marks are evenly spaced: the exact spacing of another dolphin\'s teeth.', points: true },
          { text: 'She holds to the far corner of the lagoon whenever the dominant female approaches.', points: true },
          { text: 'There is nowhere in the lagoon she can go that is out of sight of the others.', points: true },
          { text: 'She is eating her full ration.', points: false }
        ],
        options: [
          { id: 'give_retreat', label: 'Open the holding pool and give her somewhere to withdraw to', correct: true,
            feedback: 'Correct. Raking is normal dolphin conflict. What is not normal is having no way to leave.' },
          { id: 'normal_social', label: 'Record it as normal social behaviour and move on',
            feedback: 'Raking IS normal. In the wild the animal on the receiving end swims away. She cannot.' },
          { id: 'treat_marks', label: 'Treat the marks and return her to the lagoon',
            feedback: 'You would be treating the wound and returning her to the cause of it.' },
          { id: 'pull_from_show', label: 'Pull her from the presentation schedule',
            feedback: 'The shows are not what is hurting her. This changes nothing for the animal.' }
        ],
        lesson: 'Rake marks are ordinary dolphin communication. The welfare question is never "did it happen" but "could the animal choose to leave?" Space and escape routes are as much a welfare requirement as food.',
        evidence: 'ev_dolphin_rakes'
      },
      {
        id: 'bd_noise',
        title: 'The New Sound System',
        prompt: 'All four dolphins now refuse to station at the west gate, where they have stationed for years.',
        need: 'move_speakers',
        cues: [
          { text: 'The west gate is directly beneath the new speaker stack.', points: true },
          { text: 'The refusals started the week the stadium audio was upgraded, the same contractor as the cove.', points: true },
          { text: 'They station normally at the east gate, forty metres further away.', points: true },
          { text: 'Water quality readings for the lagoon are all within range.', points: false }
        ],
        options: [
          { id: 'move_speakers', label: 'Report the speaker placement and move the station point', correct: true,
            feedback: 'Correct. They are not being stubborn. They are avoiding a sound they cannot escape.' },
          { id: 'retrain', label: 'Retrain the west gate station with higher-value fish',
            feedback: 'Paying an animal more to endure something unpleasant does not make it less unpleasant.' },
          { id: 'louder_cue', label: 'Use a louder whistle cue so they can hear it over the music',
            feedback: 'Adding more sound to a sound problem.' },
          { id: 'ignore_noise', label: 'Note it as a training regression',
            feedback: 'Calling an avoidance behaviour a "regression" puts the blame on the animal.' }
        ],
        lesson: 'Sound travels roughly four and a half times faster in water than in air, and cetaceans navigate and communicate acoustically. Noise is not background for them. It is the environment itself.',
        evidence: 'ev_show_noise'
      }
    ]
  },

  green_turtle: {
    name: 'Green Sea Turtle',
    sci: 'Chelonia mydas',
    group: 'Reptile',
    zone: 'coral_kingdom',
    colour: '#5d7d4a',
    shape: 'blob',
    facts: [
      'Adult green turtles are herbivores: seagrass and algae. That diet is what turns their body fat green, and gives them their name.',
      'Their sex is set by the temperature of the nest, not by chromosomes: warmer sand produces more females.',
      'They cannot pull their head or flippers inside their shell the way a freshwater turtle can.',
      'Females return to nest on the same stretch of beach where they hatched, navigating back across thousands of kilometres.'
    ],
    encounters: [
      {
        id: 'gt_floating',
        title: 'Floating Syndrome',
        prompt: 'Kira cannot get down. Her tail end rides high at the surface and she is towing herself along with her front flippers.',
        need: 'radiograph',
        cues: [
          { text: 'The buoyancy is one-sided: the right rear of her shell sits highest.', points: true },
          { text: 'She has passed very little in three days.', points: true },
          { text: 'There is a fragment of soft plastic in the pool filter basket.', points: true },
          { text: 'Her eyes are clear and she is alert.', points: false }
        ],
        options: [
          { id: 'radiograph', label: 'Get radiographs and a gut assessment from the vet', correct: true,
            feedback: 'Right call. Positive buoyancy in a turtle usually means trapped gas, and trapped gas usually means an obstruction.' },
          { id: 'weight_shell', label: 'Attach a dive weight to the shell so she can submerge',
            feedback: 'Weights are used in rehab, but only after the cause is known. On its own this hides the problem.' },
          { id: 'stop_feeding', label: 'Stop feeding her until the floating settles',
            feedback: 'Starving a compromised animal does not clear an obstruction.' },
          { id: 'deeper_pool', label: 'Move her to a deeper pool',
            feedback: 'A deeper pool makes an animal that cannot dive more likely to drown, not less.' }
        ],
        lesson: 'Floating syndrome is one of the commonest reasons sea turtles are admitted to rehabilitation in Australia. Ingested plastic blocks the gut, gas builds up behind the blockage, and the animal loses the ability to dive, so it cannot feed, and it cannot escape a boat.',
        evidence: 'ev_turtle_plastic'
      },
      {
        id: 'gt_release',
        title: 'The Release Assessment',
        prompt: 'Kira is diving, feeding and holding weight. Dr Sato wants your assessment for the release file.',
        need: 'recommend_release',
        cues: [
          { text: 'She dives to the floor of the pool and stays down comfortably.', points: true },
          { text: 'She takes seagrass and algae over the offered squid, the wild diet.', points: true },
          { text: 'She moves away from people rather than towards them.', points: true },
          { text: 'She is the most photographed animal in the rehab unit.', points: false }
        ],
        options: [
          { id: 'recommend_release', label: 'Recommend release', correct: true,
            feedback: 'Correct. She meets every criterion. The purpose of rehabilitation is the moment you stop.' },
          { id: 'keep_ambassador', label: 'Recommend she stay on as an education ambassador',
            feedback: 'A releasable animal kept for education is no longer a rescue. That is the exact claim this park makes and does not keep.' },
          { id: 'more_time', label: 'Defer for another three months to be certain',
            feedback: 'Deferring a fit animal is how "temporary" becomes permanent. This file has already been deferred six times.' },
          { id: 'release_untagged', label: 'Release her immediately, no tag, no follow-up',
            feedback: 'Release is right. Releasing without tagging throws away everything her case could teach.' }
        ],
        lesson: 'Rehabilitation is measured by returns to the wild, not by animals held. Australian rehabilitation permits require a release plan from day one, precisely because a recovered animal is worth more to a facility than a released one.',
        evidence: null
      }
    ]
  },

  grey_nurse_shark: {
    name: 'Grey Nurse Shark',
    sci: 'Carcharias taurus',
    group: 'Elasmobranch',
    zone: 'reef_hall',
    colour: '#8e8b80',
    shape: 'blob',
    facts: [
      'Grey nurse sharks gulp air at the surface and hold it in the stomach to hover motionless. No other shark is known to do this.',
      'They have no swim bladder. Sharks stay up using a huge oily liver, and this species tops that up with air.',
      'In 1984 the grey nurse became the first shark species in the world to be legally protected, after Australian spearfishers nearly wiped it out.',
      'The largest embryo eats its siblings in the womb, so a female gives birth to at most two fully-formed pups.'
    ],
    encounters: [
      {
        id: 'gn_gulping',
        title: 'Coming Up For Air',
        prompt: 'A new volunteer has logged an urgent welfare report: the big male keeps surfacing and "gasping".',
        need: 'record_normal',
        cues: [
          { text: 'He rises slowly, takes a gulp at the surface, and returns to hovering perfectly still.', points: true },
          { text: 'He has done this every day since he arrived, according to three years of logs.', points: true },
          { text: 'Gill movement is slow and even. Nothing about him is laboured.', points: true },
          { text: 'Water quality on the reef hall return line is within range today.', points: false }
        ],
        options: [
          { id: 'record_normal', label: 'Record it as normal species behaviour and explain it to the volunteer', correct: true,
            feedback: 'Correct, and taking the report seriously enough to check was exactly right. This is how grey nurse sharks hover.' },
          { id: 'call_vet', label: 'Call the vet out urgently',
            feedback: 'Never wrong to be cautious. But knowing the species\' baseline would have answered this in ten seconds.' },
          { id: 'lower_water', label: 'Lower the water level so he does not have to swim so far up',
            feedback: 'This would restrict the animal to solve a problem that does not exist.' },
          { id: 'increase_oxygen', label: 'Increase aeration in the tank',
            feedback: 'He is not short of oxygen. He is adjusting his buoyancy.' }
        ],
        lesson: 'You cannot recognise abnormal behaviour without knowing what normal looks like for that species. The same surfacing that means distress in one animal is routine buoyancy control in another, which is why baseline observation logs matter more than instinct.',
        evidence: null
      }
    ]
  },

  giant_cuttlefish: {
    name: 'Giant Australian Cuttlefish',
    sci: 'Sepia apama',
    group: 'Cephalopod',
    zone: 'reef_hall',
    colour: '#c48a6a',
    shape: 'blob',
    facts: [
      'Sepia apama is the largest cuttlefish in the world, over half a metre long and found only in southern Australian waters.',
      'They change colour and skin texture in under a second using chromatophores, despite being colourblind themselves.',
      'The cuttlebone is an internal gas-filled shell used to fine-tune buoyancy.',
      'Cuttlefish live only one to two years, breed once, and then die, so an entire population turns over annually.'
    ],
    encounters: [
      {
        id: 'gc_barren',
        title: 'Nothing To Do',
        prompt: 'The cuttlefish has been pale and motionless in the same corner for four days.',
        need: 'add_complexity',
        cues: [
          { text: 'The tank contains sand, one plastic plant and nothing else.', points: true },
          { text: 'She flared and hunted normally when a live prawn was offered last month.', points: true },
          { text: 'She has no shelter to retreat into, in a gallery with constant foot traffic.', points: true },
          { text: 'Water parameters and temperature are stable and correct.', points: false }
        ],
        options: [
          { id: 'add_complexity', label: 'Add shelter, structure and varied live feeding', correct: true,
            feedback: 'Correct. Cephalopods are problem-solvers; a bare tank is a welfare problem, not just a dull display.' },
          { id: 'assume_senescence', label: 'Record it as end-of-life: cuttlefish die after breeding',
            feedback: 'A fair thought, and true of the species. But she is eighteen months into a two-year life and has not bred. Check the environment first.' },
          { id: 'more_light', label: 'Increase the lighting so visitors can see her better',
            feedback: 'This solves the visitors\' problem, not hers.' },
          { id: 'more_food', label: 'Increase the amount of frozen food offered',
            feedback: 'More dead food in a bare tank is more of what is already not working.' }
        ],
        lesson: 'Cephalopods are the only invertebrates protected by animal research law in the UK, EU and Australia, because the evidence for their cognition and capacity to suffer is strong. Environmental enrichment is a legal and ethical requirement, not decoration.',
        evidence: 'ev_cuttle_welfare'
      }
    ]
  },

  port_jackson_shark: {
    name: 'Port Jackson Shark',
    sci: 'Heterodontus portusjacksoni',
    group: 'Elasmobranch',
    zone: 'coral_kingdom',
    colour: '#a9946f',
    shape: 'blob',
    facts: [
      'Port Jackson sharks lay spiral, corkscrew-shaped egg cases and wedge them into rock crevices so they cannot wash away.',
      'They have two kinds of teeth: sharp ones at the front, flat grinding plates at the back for crushing shellfish and urchins.',
      'They can pump water over their gills while lying completely still, so unlike many sharks they do not have to keep swimming.',
      'They migrate hundreds of kilometres along the south-east Australian coast and return to the same reef year after year.'
    ],
    encounters: [
      {
        id: 'pj_touch',
        title: 'Too Many Hands',
        prompt: 'The touch pool shark has spent the whole afternoon jammed under the ledge at the back.',
        need: 'cap_sessions',
        cues: [
          { text: 'Her gill movements are noticeably faster than this morning.', points: true },
          { text: 'The touch pool has run continuously since opening: no closed periods.', points: true },
          { text: 'The ledge is the only place in the pool a hand cannot reach.', points: true },
          { text: 'She fed normally at the morning session.', points: false }
        ],
        options: [
          { id: 'cap_sessions', label: 'Cap session length and numbers, and protect a no-touch refuge', correct: true,
            feedback: 'Correct. A touch pool only works if the animal can opt out, and if opting out is respected.' },
          { id: 'lure_out', label: 'Use food to bring her back out where guests can reach her',
            feedback: 'Baiting an animal out of the one place it feels safe is the opposite of what the cues are telling you.' },
          { id: 'block_ledge', label: 'Block the ledge so she stops hiding',
            feedback: 'Removing the refuge does not remove the stress. It removes the animal\'s last option.' },
          { id: 'swap_animal', label: 'Rotate in a different shark for the rest of the day',
            feedback: 'Rotation is genuinely part of good practice, but not as a way to keep an unmanaged session running.' }
        ],
        lesson: 'Touch pools can be excellent education or straightforward stress, and the difference is entirely in the management: session limits, supervised two-finger contact, and a refuge the animal can always reach.',
        evidence: 'ev_touchpool'
      }
    ]
  },

  /* ==========================================================
     ZONE 3: ARCTIC COVE
     ========================================================== */

  walrus: {
    name: 'Walrus',
    sci: 'Odobenus rosmarus',
    group: 'Pinniped',
    zone: 'arctic_cove',
    colour: '#8a6f63',
    shape: 'blob',
    facts: [
      'Walrus tusks are enormously enlarged canine teeth, used to haul the body out onto ice and to spar, not to dig.',
      'They find clams by sweeping the seabed with a moustache of around 600 stiff whiskers, then suck the flesh out with a piston-like tongue.',
      'Blood is drawn away from the skin in cold water and flooded back on land, so a warm walrus turns pink and a cold one looks almost grey.',
      'A walrus can eat several thousand clams in a single dive session, and adults may weigh over a tonne.'
    ],
    encounters: [
      {
        id: 'wa_tusks',
        title: 'Worn Down',
        prompt: 'Nuka\'s tusks are blunt, scored and shorter than they were in his intake photograph.',
        need: 'add_substrate',
        cues: [
          { text: 'He drags his tusks along the same stretch of pool wall for hours at a time.', points: true },
          { text: 'The pool floor is sealed concrete. There is no gravel, no sand, nothing to sweep.', points: true },
          { text: 'Wild walruses use tusks to haul out and rake the seabed. His have nothing to work against but the wall.', points: true },
          { text: 'His weight and appetite are both steady.', points: false }
        ],
        options: [
          { id: 'add_substrate', label: 'Request a gravel bed and a foraging substrate he can actually use', correct: true,
            feedback: 'Correct. Give the behaviour somewhere legitimate to go and it stops going into the wall.' },
          { id: 'file_tusks', label: 'Have the tusks filed smooth so they stop catching',
            feedback: 'That treats the tusks. The tusks are not the problem; the empty pool is.' },
          { id: 'pad_wall', label: 'Pad the section of wall he rubs on',
            feedback: 'He will simply find another wall. You have moved the damage, not removed the cause.' },
          { id: 'note_normal', label: 'Record it as normal tusk wear for his age',
            feedback: 'Wear is normal. Wear from one fixed spot on a concrete wall is not.' }
        ],
        lesson: 'Tusks are tools, and whiskers are the real foraging organ. An enclosure with nothing to rake or haul out on leaves a powerful natural behaviour with only the furniture to aim at. Damage to the animal is the last step of that chain, not the first.',
        evidence: 'ev_walrus_tusks'
      },
      {
        id: 'wa_haulout',
        title: 'Just Lazy',
        prompt: 'Nuka has not hauled out for six days. The session notes say "lazy, low motivation".',
        need: 'fix_ramp',
        cues: [
          { text: 'The haul-out apron was resurfaced last month. It is now smooth and noticeably steeper.', points: true },
          { text: 'He makes three attempts each morning, slides back each time, and stops trying.', points: true },
          { text: 'His skin is grey and stays grey: he is not getting the chance to warm up on land.', points: true },
          { text: 'The water is holding steady at four degrees.', points: false }
        ],
        options: [
          { id: 'fix_ramp', label: 'Report the resurfacing and get the gradient and grip put back', correct: true,
            feedback: 'Correct. He is not refusing to haul out. He cannot.' },
          { id: 'target_train', label: 'Train the haul-out with higher-value food rewards',
            feedback: 'You would be paying him to attempt something physically beyond him, and blaming him when he fails.' },
          { id: 'winch', label: 'Assist him out with the lifting gear at session time',
            feedback: 'That gets him out once, on your schedule. Hauling out has to be his choice to be worth anything.' },
          { id: 'accept_note', label: 'Agree with the note and log low motivation',
            feedback: 'Every welfare failure that gets written down as an animal\'s personality stops being investigated.' }
        ],
        lesson: 'Walruses regulate temperature by leaving the water, flushing blood back to the skin on land. Blocking a haul-out blocks thermoregulation and rest. Note the language too: "lazy" moved the problem from the enclosure to the animal, and nobody checked the ramp for six days.',
        evidence: 'ev_walrus_haulout'
      }
    ]
  },

  beluga: {
    name: 'Beluga',
    sci: 'Delphinapterus leucas',
    group: 'Cetacean',
    zone: 'arctic_cove',
    colour: '#d8dee3',
    shape: 'blob',
    facts: [
      'Belugas are such prolific vocalists that whalers called them sea canaries; they whistle, click, creak and can imitate sounds they hear.',
      'The melon on the forehead is soft and muscular, and a beluga can visibly change its shape to steer echolocation clicks.',
      'Alone among cetaceans, belugas have unfused neck vertebrae, so they can turn their heads to look at things.',
      'Each summer wild belugas gather in warm shallow estuaries to moult, rubbing against gravel to shed a full layer of skin.'
    ],
    encounters: [
      {
        id: 'be_moult',
        title: 'Nothing To Rub On',
        prompt: 'Sisu\'s skin has gone yellow and is hanging off her in sheets. She keeps rubbing one flank raw on a single rough seam.',
        need: 'moult_substrate',
        cues: [
          { text: 'She works at the one rough patch in an otherwise smooth pool until the skin beneath is raw.', points: true },
          { text: 'The pool is held at a constant four degrees all year, by design.', points: true },
          { text: 'Wild belugas moult each summer in warm shallow estuaries, rubbing on gravel to shed the old layer.', points: true },
          { text: 'Her bloods came back clean last week.', points: false }
        ],
        options: [
          { id: 'moult_substrate', label: 'Request a gravel rubbing area and a seasonal warm shallow section', correct: true,
            feedback: 'Correct. She is trying to complete a moult in a pool that gives her no way to do it.' },
          { id: 'skin_cream', label: 'Treat the raw flank and apply a barrier ointment',
            feedback: 'Sensible for the wound. It does nothing about the moult she still has to finish.' },
          { id: 'antibiotics', label: 'Start her on antibiotics for a skin infection',
            feedback: 'You would be medicating a healthy animal for a housing problem.' },
          { id: 'block_seam', label: 'Grind the rough seam smooth so she stops injuring herself',
            feedback: 'That removes the only tool she has. The rubbing is not the fault; it is the attempt.' }
        ],
        lesson: 'Belugas moult annually and need warm shallow water and abrasive substrate to do it. A pool held at one "ideal" temperature all year round is stable, not correct. Stability is easy to measure and easy to defend, which is exactly why it gets mistaken for good welfare.',
        evidence: 'ev_beluga_moult'
      },
      {
        id: 'be_song',
        title: 'The Wrong Song',
        prompt: 'The beluga pair have started making a flat mechanical tone none of the older recordings contain.',
        need: 'quiet_and_enrich',
        cues: [
          { text: 'The tone sits at the same pitch as Chiller 2, which now runs almost constantly.', points: true },
          { text: 'Belugas are vocal learners: they copy what they hear around them.', points: true },
          { text: 'There are two belugas here and nothing else to learn from.', points: true },
          { text: 'Both animals are in good body condition.', points: false }
        ],
        options: [
          { id: 'quiet_and_enrich', label: 'Escalate the chiller noise and ask for acoustic enrichment', correct: true,
            feedback: 'Correct. They are learning the only voice in the room, and it belongs to a compressor.' },
          { id: 'play_recordings', label: 'Play wild beluga recordings over the pool speakers',
            feedback: 'Adding more sound to a pool that already has too much, and still nothing they can answer.' },
          { id: 'log_novel', label: 'Log it as a novel vocalisation, which is enrichment of a kind',
            feedback: 'Calling it novel makes it sound like curiosity. They are copying machinery because there is nothing else.' },
          { id: 'separate', label: 'Separate the pair so they stop reinforcing it',
            feedback: 'Isolating a social vocal learner to stop it vocalising is the wrong end of the problem entirely.' }
        ],
        lesson: 'Belugas learn their sounds rather than being born with them. In the wild that means a rich culture of calls learned from a large pod. In a pool with two animals and a compressor, vocal learning still happens; it just has almost nothing worth learning from.',
        evidence: 'ev_beluga_song'
      }
    ]
  },

  harp_seal: {
    name: 'Harp Seal',
    sci: 'Pagophilus groenlandicus',
    group: 'Pinniped',
    zone: 'arctic_cove',
    colour: '#b9c4cc',
    shape: 'blob',
    facts: [
      'Harp seal pups are born with the white lanugo coat that made them a hunting target, and moult it within about two weeks.',
      'Adults carry a blubber layer several centimetres thick, insulating them well enough to rest on sea ice in sub-zero air.',
      'They are pack-ice breeders: pups are weaned in around twelve days, one of the fastest weaning periods of any mammal.',
      'Harp seals can hold their breath for roughly fifteen minutes and dive to a few hundred metres while foraging.'
    ],
    encounters: [
      {
        id: 'hs_heat',
        title: 'Comfortable For Whom',
        prompt: 'The harp seals will not leave the water during the day, and two are breathing quickly with their flippers spread.',
        need: 'move_heaters',
        cues: [
          { text: 'The plaza patio heaters were moved closer to the pen last week for guest comfort.', points: true },
          { text: 'Air beside the pen now reads eighteen degrees. The seals only haul out after closing, when the heaters go off.', points: true },
          { text: 'They hold their fore-flippers away from the body: flippers shed heat, so this is a cooling posture.', points: true },
          { text: 'Water temperature in the pen is unchanged.', points: false }
        ],
        options: [
          { id: 'move_heaters', label: 'Get the guest heaters moved back and the pen-side air temperature restored', correct: true,
            feedback: 'Correct. The pen was made comfortable for the people standing next to it.' },
          { id: 'hose_down', label: 'Hose them down through the afternoon to cool them',
            feedback: 'Treating the symptom every day forever, instead of moving a heater once.' },
          { id: 'more_ice', label: 'Tip more ice into the pen each afternoon',
            feedback: 'Same problem: a daily workaround for a fixable cause, and it does not cool the air they haul out into.' },
          { id: 'log_normal', label: 'Record it as normal resting behaviour in water',
            feedback: 'Animals that only haul out after the public leaves are telling you something about the daytime.' }
        ],
        lesson: 'The blubber that lets a harp seal rest on sea ice at twenty below makes mild air genuinely dangerous. Their comfort range and ours barely overlap, and in a public park the temperature that gets protected is usually the visitors\'. Spread flippers and fast breathing are cooling behaviours, not relaxation.',
        evidence: 'ev_seal_heat'
      }
    ]
  },

  /* ============================================================
     ZONE 4: OPEN OCEAN

     FOUR FACTS IN HERE ARE LOAD-BEARING. The Meridian Gate keypad
     code is built from one countable fact per species:

       orca .................. five oceans           → 5
       common dolphin ........ four hourglass panels → 4
       reef manta ............ two cephalic lobes    → 2
       short-finned pilot .... three generations     → 3

     REDESIGNED 2026-08-05. These numbers are no longer printed on the
     information boards; the boards were cut loose from the puzzle and
     are general facts now. The only place a player can get them is the
     four teenagers at the foot of data/npcs_ocean.js, who each recite
     one of these facts as the way they remember their digit.

     So if you reword one of these facts, reword the matching character's
     dialogue with it, and check `meridian_pad` still adds up.
     ============================================================ */

  orca: {
    name: 'Orca',
    sci: 'Orcinus orca',
    group: 'Cetacean',
    zone: 'open_ocean',
    colour: '#2c3540',
    shape: 'fish',
    facts: [
      'Orcas are found in all five of the world\'s oceans, from the tropics to the edge of the pack ice. No mammal except us is spread more widely.',
      'The orca is the largest member of the dolphin family. Everything you know about dolphins applies to an animal that can weigh six tonnes.',
      'Pods are matrilineal, and each matriline has its own dialect of calls, learned from the mother rather than inherited.',
      'Different orca populations are specialists: some eat only fish, some only marine mammals, and they do not interbreed or share a language even where their ranges overlap.',
      'Wild orcas may travel over 100 km in a day and dive past 100 m. Dorsal fin collapse is seen in around 1% of wild males and in nearly every adult male held in a pool.'
    ],
    encounters: [
      {
        id: 'or_alone',
        title: 'Nobody Speaks Her Language',
        prompt: 'Tempest has stopped vocalising altogether. The log records it as "settled".',
        need: 'social_report',
        cues: [
          { text: 'She was moved here from a group of four, eleven months ago. She has been alone since.', points: true },
          { text: 'Archive recordings of her calls do not match any recording made in this park.', points: true },
          { text: 'She logs at the surface, motionless, for hours at a time.', points: true },
          { text: 'Her intake and her bloodwork are both unremarkable.', points: false }
        ],
        options: [
          { id: 'social_report', label: 'Record isolation itself as the welfare problem and escalate the social grouping', correct: true,
            feedback: 'Correct. For a matrilineal, dialect-learning animal, company is not enrichment. It is the environment.' },
          { id: 'play_audio', label: 'Play her recordings of other orcas over the pool speakers',
            feedback: 'A recording cannot answer her. It is a reasonable instinct and it is not a substitute for another animal.' },
          { id: 'more_sessions', label: 'Schedule more trainer sessions so she has company',
            feedback: 'Humans are not her species and cannot be. This buys her a few hours and calls the problem solved.' },
          { id: 'log_settled', label: 'Agree with the log: a quiet animal is a calm animal',
            feedback: 'A vocal learner who has gone silent has not calmed down. She has stopped getting an answer.' }
        ],
        lesson: 'Orca society is built on the mother\'s line, and each matriline speaks a dialect learned from her. An orca held alone is not simply an animal without friends: she is an animal with no one who speaks her language, and no way to learn a new one. Silence in a vocal learner is a finding, not a mood.',
        evidence: 'ev_orca_isolation'
      },
      {
        id: 'or_teeth',
        title: 'Wearing Down the Gate',
        prompt: 'Tempest mouths the same section of steel gate every day. The med log has a daily entry marked simply "irrigation".',
        need: 'change_environment',
        cues: [
          { text: 'The lower teeth are worn flat, and several have been drilled open and are flushed by hand each morning.', points: true },
          { text: 'The wear is on one side only, and matches the bars of the gate exactly.', points: true },
          { text: 'The holding pool is a circle with nothing in it. The gate is the only thing that is not a wall.', points: true },
          { text: 'Staff describe the mouthing as "a habit she came with".', points: false }
        ],
        options: [
          { id: 'change_environment', label: 'Report the dental damage as a consequence of the enclosure and ask for the environment to change', correct: true,
            feedback: 'Correct. The daily flush treats the hole. The bare pool and the gate are what put it there.' },
          { id: 'more_dental', label: 'Book more frequent dental work',
            feedback: 'More drilling manages the damage more efficiently. It does not stop it happening.' },
          { id: 'coat_bars', label: 'Have the gate bars coated so they are softer on her teeth',
            feedback: 'Closer, but she is chewing steel because there is nothing else. Take away the steel and she will find the wall.' },
          { id: 'log_habit', label: 'Log it as a pre-existing habit and move on',
            feedback: 'Calling a behaviour a habit is how it stops being investigated. Ask what the habit is for.' }
        ],
        lesson: 'Chewing and raking hard surfaces is one of the best documented welfare problems in captive orcas: worn and fractured teeth, drilled pulp chambers, and daily irrigation for the rest of the animal\'s life. It is a behavioural problem with a dental symptom. Treating the tooth and leaving the pool unchanged is treating the wrong end of the chain.',
        evidence: 'ev_orca_teeth'
      }
    ]
  },

  pilot_whale: {
    name: 'Short-Finned Pilot Whale',
    sci: 'Globicephala macrorhynchus',
    group: 'Cetacean',
    zone: 'open_ocean',
    colour: '#3a3f47',
    shape: 'fish',
    facts: [
      'A pilot whale pod is three generations of one female line (grandmother, mother and calf) and neither sons nor daughters leave the pod they are born into.',
      'Short-finned pilot whales are one of the very few mammals with a true menopause: females stop breeding decades before they die and spend those years leading the pod.',
      'Despite the name they are dolphins, not whales, and among the deepest-diving of them, sprinting after squid past 600 m and returning in around fifteen minutes.',
      'Their bond to the pod is so strong that a sick individual is followed by healthy animals, which is why the species mass strands more than almost any other.'
    ],
    encounters: [
      {
        id: 'pw_matriarch',
        title: 'The Grandmother',
        prompt: 'Kupe, the oldest female, has barely fed for four days. Nothing about her health has changed.',
        need: 'review_transfer',
        cues: [
          { text: 'Her nine-year-old granddaughter was crated out to another facility on Tuesday.', points: true },
          { text: 'She has spent every session since at the gate the crate left through.', points: true },
          { text: 'The two remaining animals are staying within a body length of her.', points: true },
          { text: 'Water quality and her last blood panel are both fine.', points: false }
        ],
        options: [
          { id: 'review_transfer', label: 'Report the transfer itself as the cause and ask for the decision to be reviewed', correct: true,
            feedback: 'Correct. You have a healthy animal that stopped eating the day her family got smaller.' },
          { id: 'tempt_food', label: 'Try higher-value fish until she takes something',
            feedback: 'Worth doing while you work, but a tastier herring is not an answer to what happened.' },
          { id: 'tube_feed', label: 'Move straight to assisted feeding',
            feedback: 'That is a treatment for an animal that cannot eat, not for one that will not.' },
          { id: 'log_age', label: 'Record it as an age-related drop in appetite',
            feedback: 'She is old, and the appetite stopped on a Tuesday. Those are not the same explanation.' }
        ],
        lesson: 'Short-finned pilot whales are one of the handful of mammals with a genuine post-reproductive life, and those older females are the pod. Removing an animal does not affect one animal. In a species where the social unit is the individual\'s whole world, a transfer is a clinical event for everyone left behind.',
        evidence: 'ev_pilot_matriarch'
      },
      {
        id: 'pw_dive',
        title: 'Sprinters In A Puddle',
        prompt: 'All three pilot whales dive to the floor of the pool, push at the drain grating, and surface again. Over and over.',
        need: 'depth_report',
        cues: [
          { text: 'The pool is six metres deep. Their wild dives go past six hundred.', points: true },
          { text: 'The pattern runs longest in the evening, which is when they would normally be hunting squid.', points: true },
          { text: 'They ignore the surface toys entirely and go straight back down.', points: true },
          { text: 'There is no injury and no sign of pain when they push.', points: false }
        ],
        options: [
          { id: 'depth_report', label: 'Record depth as a welfare requirement and escalate it, not the pushing', correct: true,
            feedback: 'Correct. They are performing a deep dive in the only depth available and running out of ocean.' },
          { id: 'block_drain', label: 'Fit a guard so they cannot reach the grating',
            feedback: 'Now they will push at something else. The grating is where the floor is, not what they want.' },
          { id: 'surface_toys', label: 'Add more surface enrichment to keep them up top',
            feedback: 'You are competing with a hunting behaviour by offering a ball. Enrichment is not a substitute for depth.' },
          { id: 'log_play', label: 'Log it as play behaviour',
            feedback: 'Repetitive, identical, driven and timed to their natural hunting window. That is not play.' }
        ],
        lesson: 'A short-finned pilot whale is built for sprint dives past 600 m after squid. Held in six metres of water, the dive still happens, it just ends at the floor. Enclosure DEPTH is a welfare requirement for deep-diving species in exactly the way enclosure area is for a wide-ranging one, and it is far more rarely written into a standard.',
        evidence: 'ev_pilot_depth'
      }
    ]
  },

  common_dolphin: {
    name: 'Common Dolphin',
    sci: 'Delphinus delphis',
    group: 'Cetacean',
    zone: 'open_ocean',
    colour: '#59748a',
    shape: 'fish',
    facts: [
      'The hourglass on a common dolphin\'s flank has four panels: a dark cape above, a tan-gold panel forward, a pale grey panel behind, and a white belly.',
      'They are one of the most social dolphins alive, travelling in pods of hundreds and joining herds that have been counted in the tens of thousands.',
      'Common dolphins herd fish into a tight bait ball cooperatively, taking turns to drive through it, a behaviour that needs a crowd to work at all.',
      'They are fast, wide-ranging and rarely settle: wild pods routinely cover 60 km in a day and almost never use the same patch of ocean twice in a week.'
    ],
    encounters: [
      {
        id: 'cd_podsize',
        title: 'Three Is Not A Pod',
        prompt: 'The three common dolphins have started circling the perimeter in single file, nose to tail, for most of the afternoon.',
        need: 'group_size',
        cues: [
          { text: 'Wild pods of this species run to hundreds of animals. There are three here.', points: true },
          { text: 'The circuit is identical every lap and they hold formation the whole way round.', points: true },
          { text: 'It starts once the last guest talk finishes and the deck goes quiet.', points: true },
          { text: 'All three are in good body condition and feeding normally.', points: false }
        ],
        options: [
          { id: 'group_size', label: 'Log the group size and the barren circuit as the welfare problem', correct: true,
            feedback: 'Correct. A herd species held in threes, doing laps of a wall, is a housing finding, not a quirk.' },
          { id: 'separate', label: 'Split them up so they stop reinforcing the pattern',
            feedback: 'Taking a social animal out of an already tiny group makes the underlying problem worse.' },
          { id: 'feed_more', label: 'Add a late feed to break the routine',
            feedback: 'It will break it today. Tomorrow the pool is still the same pool.' },
          { id: 'log_synchrony', label: 'Record it as natural synchronised swimming',
            feedback: 'Synchrony is real in this species. An identical repeated circuit of a boundary is stereotypy wearing its coat.' }
        ],
        lesson: 'Common dolphins are a herd animal in the strongest sense: they feed by cooperative herding, in pods that are counted in hundreds. Group size is part of an enclosure specification for a social species, and a repetitive perimeter circuit is one of the most recognised stereotypic behaviours in captive cetaceans.',
        evidence: 'ev_dolphin_podsize'
      }
    ]
  },

  reef_manta: {
    name: 'Reef Manta Ray',
    sci: 'Mobula alfredi',
    group: 'Ray',
    zone: 'open_ocean',
    colour: '#4a5a6b',
    shape: 'fish',
    facts: [
      'A manta\'s two cephalic lobes (the "horns" that got the whole family named devil rays) unroll into a funnel that channels plankton into its mouth.',
      'Every manta\'s belly carries a unique pattern of dark spots, as individual as a fingerprint, and researchers identify them from photographs for life.',
      'Reef mantas have the largest brain of any fish relative to body size, with well developed regions for learning, and they pass and repass cleaning stations they clearly remember.',
      'They cannot pump water over their gills while stationary: a manta has to keep swimming forward to breathe, which makes a tight enclosure a respiratory problem as well as a spatial one.'
    ],
    encounters: [
      {
        id: 'mr_spots',
        title: 'Fingerprints',
        prompt: 'The lagoon record lists one manta, "Halo", admitted four years ago. You have been photographing her all week.',
        need: 'flag_records',
        cues: [
          { text: 'Two of your belly shots have completely different spot patterns.', points: true },
          { text: 'Spot patterns do not change with age. They are the individual, permanently.', points: true },
          { text: 'One animal has a healed notch in the left wing. Some photos have it. Some do not.', points: true },
          { text: 'Both animals are feeding well and neither looks unwell.', points: false }
        ],
        options: [
          { id: 'flag_records', label: 'Report that two animals are being recorded as one and get both identified properly', correct: true,
            feedback: 'Correct. Two individuals under one name means one animal has no medical history at all.' },
          { id: 'ask_keeper', label: 'Assume the older photos are of a previous animal and move on',
            feedback: 'Maybe, and if so, an animal left this lagoon and no record says when or where to.' },
          { id: 'retake', label: 'Retake the photographs in case the lighting confused you',
            feedback: 'Worth checking once. But a notch in a wing is not a lighting artefact.' },
          { id: 'log_variation', label: 'Record it as normal variation in appearance',
            feedback: 'The entire point of a manta\'s spots is that they do not vary. That is why they work as identification.' }
        ],
        lesson: 'Photo identification works because a manta\'s belly spots are unique and permanent, the same principle behind whale fluke and dolphin dorsal catalogues. It also makes records checkable: if two spot patterns share a name, either the paperwork is wrong or an animal has moved and nobody wrote it down.',
        evidence: 'ev_manta_id'
      },
      {
        id: 'mr_wingtips',
        title: 'The Turning Circle',
        prompt: 'Both mantas have raw, repeatedly abraded wingtips, worst on the left.',
        need: 'space_report',
        cues: [
          { text: 'They circle the lagoon in the same direction all day, clipping the wall on every turn.', points: true },
          { text: 'A manta cannot stop: it has to keep moving forward to pass water over its gills.', points: true },
          { text: 'The lagoon is narrower than three of their wingspans at the tightest point.', points: true },
          { text: 'The water chemistry is in range and the wounds are not infected.', points: false }
        ],
        options: [
          { id: 'space_report', label: 'Report the lagoon dimensions as the cause and escalate the enclosure, not the wounds', correct: true,
            feedback: 'Correct. An animal that cannot stop swimming needs somewhere to swim that it can turn in.' },
          { id: 'pad_walls', label: 'Pad the walls where they clip',
            feedback: 'Kinder in the short term, and it leaves them circling a lagoon that is still too small to turn in.' },
          { id: 'treat_wounds', label: 'Treat the wingtips and monitor',
            feedback: 'You will be treating them forever. Ask why they are happening every single day.' },
          { id: 'log_normal', label: 'Log the abrasion as normal wear for a captive ray',
            feedback: '"Normal for captivity" is the most dangerous phrase in this building. Normal for the species is the standard.' }
        ],
        lesson: 'Mantas are ram ventilators: forward motion is how they breathe, so they never stop and never hover. That makes enclosure width a hard biological constraint, not a comfort question: the animal\'s wingspan sets a minimum turning circle, and anything tighter is paid for in wingtips.',
        evidence: 'ev_manta_wingtips'
      }
    ]
  }
};
