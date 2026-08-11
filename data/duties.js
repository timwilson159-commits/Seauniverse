/* ============================================================
   SEA UNIVERSE: SHIFT DUTIES

   These are the jobs you are actually paid to do: your cover.
   At the start of each PUBLIC shift a few are assigned from this
   pool. Doing them keeps management happy and suspicion low.
   Skipping them to go snooping is exactly the trade-off the game
   is about.

   Duties are deliberately QUICK: walk over, press E, done. The
   deep interaction is the Care Session; this is the routine work
   around it. Each one carries a one-line husbandry fact so the
   teaching continues even in the filler.

     zone    : which region's roster it belongs to (also gates whether
               it can be assigned: you must have reached that region)
     at      : id of the object you perform it at
     atZone  : optional, if the object lives somewhere else, e.g. the
               region's staff block. Defaults to `zone`.
     phases  : which shift ids it can be assigned in
     condition : MUST cover any `requires` gate on the target object,
               or the player can be handed a duty they cannot perform
               and then punished for skipping it
     energy  : energy cost
     fact    : shown on completion
     skip    : suspicion added if the shift ends with it undone
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

SU.data.duties = {

  duty_cove_feed_seals: {
    title: 'Morning feed: harbour seals',
    zone: 'coastal_cove', at: 'seal_pool_edge',
    phases: ['morning_shift'],
    condition: { qualification: 'pinniped_basic' },   // matches the pool's own gate
    verb: 'Run the feed',
    energy: 10, skip: 6,
    flavour: 'You weigh out the herring, record the intake, and watch who eats and who does not.',
    fact: 'Intake is weighed and logged every feed: a drop in appetite is often the first sign of illness.',
    rewards: [{ type: 'addXP', amount: 20 }, { type: 'money', amount: 9 }]
  },

  duty_cove_show_prep: {
    title: 'Prep the stadium',
    zone: 'coastal_cove', at: 'sealion_stage',
    phases: ['morning_shift', 'afternoon_shift'],
    condition: { qualification: 'pinniped_basic' },   // matches the stadium's own gate
    verb: 'Set up for the show',
    energy: 10, skip: 6,
    flavour: 'Buckets staged, targets positioned, gates checked twice. The crowd will never see any of it.',
    fact: 'Trained behaviours are built with positive reinforcement: the animal chooses to take part, or the session ends.',
    rewards: [{ type: 'addXP', amount: 20 }, { type: 'money', amount: 9 }]
  },

  duty_cove_feed_otters: {
    title: 'Afternoon feed: otters',
    zone: 'coastal_cove', at: 'otter_deck',
    phases: ['afternoon_shift'],
    condition: { flags: { otter_access: true } },
    verb: 'Run the feed',
    energy: 10, skip: 6,
    flavour: 'Kelpie takes each urchin, rolls onto her back, and gets to work.',
    fact: 'Sea otters eat around a quarter of their body weight daily: they have no blubber, so food is their heating bill.',
    rewards: [{ type: 'addXP', amount: 20 }, { type: 'money', amount: 9 }]
  },

  duty_cove_deck_wash: {
    title: 'Hose down the pool decks',
    zone: 'coastal_cove', at: 'hose_point',
    phases: ['morning_shift', 'afternoon_shift'],
    verb: 'Wash the decks',
    energy: 8, skip: 4,
    flavour: 'Fish scales, gull mess, sunscreen. You work backwards towards the gate so you do not walk it all through again.',
    fact: 'Hygiene protocols exist because marine mammals share several infections with humans, and it runs both ways.',
    rewards: [{ type: 'addXP', amount: 14 }, { type: 'money', amount: 6 }]
  },

  duty_cove_guest_talk: {
    title: 'Guest questions at the plaza',
    zone: 'coastal_cove', at: 'sign_cove',
    phases: ['morning_shift', 'afternoon_shift'],
    verb: 'Answer questions',
    energy: 8, skip: 5,
    flavour: 'Twenty minutes of "is that one a boy or a girl" and one genuinely excellent question from a nine-year-old.',
    fact: 'Harbour seals have no external ear flaps; sea lions do. It is the quickest way to tell them apart.',
    rewards: [{ type: 'addXP', amount: 14 }, { type: 'money', amount: 6 }]
  },

  duty_cove_records: {
    title: 'File the daily intake records',
    zone: 'coastal_cove', at: 'feed_prep', atZone: 'staff_cove',
    phases: ['morning_shift', 'afternoon_shift'],
    verb: 'File the records',
    energy: 6, skip: 4,
    flavour: 'Weights, intake, behaviour notes. You notice how many of the boxes are pre-filled before the day starts.',
    fact: 'Daily records build a baseline: you cannot spot an abnormal animal without knowing its normal.',
    rewards: [{ type: 'addXP', amount: 12 }, { type: 'money', amount: 5 }]
  },

  /* ==========================================================
     CORAL KINGDOM ROSTER
     Bigger park, bigger roster. These only enter the pool once
     the player has actually reached Coral Kingdom.
     ========================================================== */

  duty_coral_deck_wash: {
    title: 'Hose down the reef decks',
    zone: 'coral_kingdom', at: 'hose_reef',
    phases: ['morning_shift', 'afternoon_shift'],
    verb: 'Wash the decks',
    energy: 8, skip: 4,
    flavour: 'The reef complex decks are twice the size of the cove and nobody has ever thanked anyone for doing this.',
    fact: 'Salt water is corrosive to everything humans build. Half of marine park maintenance is simply rinsing.',
    rewards: [{ type: 'addXP', amount: 14 }, { type: 'money', amount: 6 }]
  },

  duty_coral_feed_dolphins: {
    title: 'Midday feed: dolphin lagoon',
    zone: 'coral_kingdom', at: 'dolphin_deck',
    phases: ['morning_shift', 'afternoon_shift'],
    condition: { qualification: 'cetacean_basic' },     // matches the lagoon's own gate
    verb: 'Run the feed',
    energy: 10, skip: 6,
    flavour: 'Four buckets, four animals, four separate record cards. Tuk takes his fish and gives you back a rock.',
    fact: 'Dolphins are fed by individual, weighed ration: group feeding hides which animal is eating and which is not.',
    rewards: [{ type: 'addXP', amount: 20 }, { type: 'money', amount: 9 }]
  },

  duty_coral_show_prep: {
    title: 'Set up the presentation',
    zone: 'coral_kingdom', at: 'show_desk',
    phases: ['morning_shift', 'afternoon_shift'],
    verb: 'Run the setup',
    energy: 8, skip: 5,
    flavour: 'Cue sheets, targets, sound check. The running order has been pencilled two minutes longer than it was printed.',
    fact: 'Presentations are built from behaviours the animal already offers. A session where nothing is offered should simply end.',
    rewards: [{ type: 'addXP', amount: 16 }, { type: 'money', amount: 7 }]
  },

  duty_coral_touch_pool: {
    title: 'Supervise the touch pool',
    zone: 'coral_kingdom', at: 'touch_pool',
    phases: ['morning_shift', 'afternoon_shift'],
    condition: { qualification: 'aquarist_basic' },     // matches the touch pool's own gate
    verb: 'Take the rail',
    energy: 8, skip: 5,
    flavour: 'Two fingers, wet hands, back of the animal only. You say it four hundred times and mean it every time.',
    fact: 'Supervised touch pools work only with session limits and a refuge the animal can always reach.',
    rewards: [{ type: 'addXP', amount: 16 }, { type: 'money', amount: 7 }]
  },

  duty_coral_guest_talk: {
    title: 'Keeper talk at the plaza',
    zone: 'coral_kingdom', at: 'talk_plaza',
    phases: ['morning_shift', 'afternoon_shift'],
    verb: 'Give the talk',
    energy: 8, skip: 5,
    flavour: 'Eleven minutes on dolphins for a crowd of forty, two of whom ask something you have to think about.',
    fact: 'Public education is the main justification zoos and aquariums give for existing, which makes what is said at the rail the product.',
    rewards: [{ type: 'addXP', amount: 14 }, { type: 'money', amount: 6 }]
  },

  duty_coral_tank_service: {
    title: 'Service the reef hall filtration',
    zone: 'coral_kingdom', at: 'filter_room', atZone: 'reef_hall',
    phases: ['morning_shift', 'afternoon_shift'],
    verb: 'Service the filters',
    energy: 10, skip: 5,
    flavour: 'Backwash, rinse, check the skimmer cup, write the number on the board. Thirty-eight pumps and Tosh knows all their names.',
    fact: 'A closed aquarium system is a managed nitrogen cycle: bacteria convert ammonia to nitrite to nitrate, and water changes remove the rest.',
    rewards: [{ type: 'addXP', amount: 18 }, { type: 'money', amount: 8 }]
  },

  duty_coral_water_test: {
    title: 'Run the morning water panel',
    zone: 'coral_kingdom', at: 'water_bench', atZone: 'staff_coral',
    phases: ['morning_shift'],
    verb: 'Run the panel',
    energy: 6, skip: 4,
    flavour: 'pH, salinity, ammonia, nitrite, nitrate. You write the numbers you actually get.',
    fact: 'Ammonia is the number that kills. Even low levels burn gill tissue, and it climbs fastest when a filter has been off.',
    rewards: [{ type: 'addXP', amount: 12 }, { type: 'money', amount: 5 }]
  },

  duty_coral_turtle_feed: {
    title: 'Rehab unit feed round',
    zone: 'coral_kingdom', at: 'turtle_pool', atZone: 'turtle_unit',
    phases: ['afternoon_shift'],
    condition: { any: [{ qualification: 'rehab_cert' }, { flags: { turtle_access: true } }] },
    verb: 'Run the feed',
    energy: 8, skip: 5,
    flavour: 'Weighed seagrass and squid, offered in the water, and every gram not eaten is recorded.',
    fact: 'Rehabilitation animals are fed the wild diet wherever possible: an animal taught to take fish from a bucket is harder to release.',
    rewards: [{ type: 'addXP', amount: 18 }, { type: 'money', amount: 8 }]
  },

  /* ---------- Arctic Cove ---------- */
  duty_arctic_feed_seals: {
    title: 'Ice Pen feed',
    zone: 'arctic_cove', at: 'seal_pen',
    phases: ['morning_shift'],
    condition: { qualification: 'pinniped_basic' },
    verb: 'Run the feed',
    energy: 10, skip: 6,
    flavour: 'Capelin, weighed out cold, thrown wide so they have to work for it.',
    fact: 'Harp seals are fed a high-fat cold-water diet; the blubber it builds is insulation and energy store in one.',
    rewards: [{ type: 'addXP', amount: 20 }, { type: 'money', amount: 9 }]
  },

  duty_arctic_beluga_show: {
    title: 'Beluga presentation support',
    zone: 'arctic_cove', at: 'feed_arctic',
    phases: ['afternoon_shift'],
    condition: { qualification: 'cold_water_cert' },
    verb: 'Support the presentation',
    energy: 12, skip: 7,
    flavour: 'Buckets, hand signals, and standing where the microphone is not.',
    fact: 'Presentation behaviours are trained on cue and reward only; an animal that declines a cue is meant to be allowed to decline it.',
    rewards: [{ type: 'addXP', amount: 24 }, { type: 'money', amount: 11 }]
  },

  duty_arctic_apron: {
    title: 'Wash down the haul-out apron',
    zone: 'arctic_cove', at: 'hose_arctic',
    phases: ['morning_shift', 'afternoon_shift'],
    verb: 'Wash it down',
    energy: 8, skip: 5,
    flavour: 'Slush, mostly. You move it from one end of the apron to the other and call it progress.',
    fact: 'Haul-out surfaces need grip and a shallow gradient; a smooth steep apron can stop a heavy pinniped leaving the water at all.',
    rewards: [{ type: 'addXP', amount: 16 }, { type: 'money', amount: 7 }]
  },

  duty_arctic_ice_grade: {
    title: 'Grade the morning ice',
    zone: 'arctic_cove', at: 'ice_bench', atZone: 'staff_arctic',
    phases: ['morning_shift'],
    verb: 'Grade the ice',
    energy: 6, skip: 4,
    flavour: 'You hold a sample to the light and score it out of ten, exactly as Dr Frost does, and feel oddly serious about it.',
    fact: 'Ice that freezes too fast traps air, shatters rather than shears, and is a poorer surface for animals to rest on.',
    rewards: [{ type: 'addXP', amount: 14 }, { type: 'money', amount: 6 }]
  },

  duty_arctic_talk: {
    title: 'Give the Ice Talk',
    zone: 'arctic_cove', at: 'talk_arctic',
    phases: ['afternoon_shift'],
    verb: 'Give the talk',
    energy: 10, skip: 6,
    flavour: 'A dozen guests, one microphone, and a walrus behind you doing something distracting with his whiskers.',
    fact: 'Keeper talks are the park\'s main teaching moment, which makes the wording of them a decision somebody makes on purpose.',
    rewards: [{ type: 'addXP', amount: 20 }, { type: 'money', amount: 9 }]
  },

  /* ---------- Open Ocean ----------
     Every `condition` here matches the `requires` gate on the object it
     targets, so the roster can never hand out a job the player is not
     cleared to do. The validator errors if that ever stops being true. */

  duty_ocean_pod_feed: {
    title: 'Morning feed: Pod Pool',
    zone: 'open_ocean', at: 'feed_ocean',
    phases: ['morning_shift'],
    verb: 'Run the feed',
    energy: 11, skip: 6,
    flavour: 'Three animals, three buckets, three sets of intake figures, and one of them barely touched.',
    fact: 'Intake is weighed per animal rather than per pool, because a group figure hides the one individual who has stopped eating.',
    rewards: [{ type: 'addXP', amount: 22 }, { type: 'money', amount: 10 }]
  },

  duty_ocean_deck_wash: {
    title: 'Wash down the bay decks',
    zone: 'open_ocean', at: 'wash_ocean',
    phases: ['morning_shift', 'afternoon_shift'],
    verb: 'Wash them down',
    energy: 8, skip: 5,
    flavour: 'Twenty metres of deck, one squeegee, and a dolphin watching you with what is unmistakably amusement.',
    fact: 'Poolside hygiene is animal husbandry: what gets walked onto a deck ends up in the water the animals breathe at.',
    rewards: [{ type: 'addXP', amount: 16 }, { type: 'money', amount: 7 }]
  },

  duty_ocean_talk: {
    title: 'Give the Open Ocean talk',
    zone: 'open_ocean', at: 'talk_ocean',
    phases: ['morning_shift', 'afternoon_shift'],
    verb: 'Give the talk',
    energy: 10, skip: 6,
    flavour: 'A good crowd, and the first question is always about the orca nobody can see.',
    fact: 'The approved answer and the true answer are not always the same sentence, and the guest cannot tell which one they got.',
    rewards: [{ type: 'addXP', amount: 20 }, { type: 'money', amount: 9 }]
  },

  duty_ocean_records: {
    title: 'Photo ID filing',
    zone: 'open_ocean', at: 'ocean_bench', atZone: 'staff_ocean',
    phases: ['morning_shift'],
    verb: 'File the ID photos',
    energy: 6, skip: 4,
    flavour: 'Transparencies on a light box, belly spots matched by eye. It is slow and it is oddly restful.',
    fact: 'Photo identification turns a population into a list of named individuals, which is what makes a movement record checkable.',
    rewards: [{ type: 'addXP', amount: 14 }, { type: 'money', amount: 6 }]
  },

  duty_ocean_lagoon_check: {
    title: 'Lagoon cover check',
    zone: 'open_ocean', at: 'cover_winch',
    phases: ['morning_shift'],
    verb: 'Check the cover',
    energy: 6, skip: 5,
    flavour: 'On, off, and the time it happened. Forty seconds of work that has not been done properly in five weeks.',
    fact: 'A day book is only evidence of anything if it is written on the day: a month completed in one sitting records nothing but the writer.',
    rewards: [{ type: 'addXP', amount: 14 }, { type: 'money', amount: 6 }]
  },

  duty_ocean_acoustic: {
    title: 'Acoustic check: bay deck',
    zone: 'open_ocean', at: 'wash_ocean',
    phases: ['afternoon_shift'],
    condition: { qualification: 'sound_aware' },
    verb: 'Take the readings',
    energy: 9, skip: 6,
    flavour: 'Meter at the rail, meter at the water line, both written down. Nobody has ever asked to see these.',
    fact: 'Sound travels about four and a half times faster in water than in air and carries much further, so a poolside speaker is an exposure, not a background noise.',
    rewards: [{ type: 'addXP', amount: 24 }, { type: 'money', amount: 11 }]
  },

  /* --- The Deep ---
     There are no guests here, so none of these are front-of-house.
     Every one of them is a job that exists because somebody decided
     the site did not need a second person on it. */
  duty_deep_walkround: {
    title: 'Walkway inspection',
    zone: 'the_deep', at: 'deep_plant', atZone: 'deep_pump',
    phases: ['morning_shift'],
    verb: 'Sign the walk round',
    energy: 8, skip: 6,
    flavour: 'Down one side, across, back up the other, and initial the sheet. It takes twenty minutes and you notice four things.',
    fact: 'A documented inspection walk is worth more than an attentive one, because only the documented walk still exists tomorrow.',
    rewards: [{ type: 'addXP', amount: 20 }, { type: 'money', amount: 9 }]
  },

  duty_deep_pip_feed: {
    title: 'Seagrass drop: lagoon',
    zone: 'the_deep', at: 'obs_pip',
    phases: ['morning_shift'],
    condition: { qualification: 'sirenian_cert' },
    verb: 'Put the seagrass in',
    energy: 8, skip: 5,
    flavour: 'Weighted bundles, spread across the lagoon rather than dropped in one place, so she has to go and find them.',
    fact: 'Dugongs graze seagrass and leave visible feeding trails; scattering feed makes an animal forage rather than simply eat.',
    rewards: [{ type: 'addXP', amount: 22 }, { type: 'money', amount: 9 }]
  },

  duty_deep_gatecheck: {
    title: 'Sea gate and net check',
    zone: 'the_deep', at: 'gate_console', atZone: 'deep_gatehouse',
    phases: ['afternoon_shift'],
    verb: 'Check the gate',
    energy: 7, skip: 6,
    flavour: 'Tide state, gate position, net condition. Three boxes. The third one you now tick differently.',
    fact: 'A containment barrier is only as strong as its weakest section, which is why repairs have to match the original specification rather than merely hold.',
    rewards: [{ type: 'addXP', amount: 20 }, { type: 'money', amount: 9 }]
  },

  duty_deep_slipway: {
    title: 'Slipway and cradle check',
    zone: 'the_deep', at: 'deep_slipway',
    phases: ['afternoon_shift'],
    verb: 'Check the slipway',
    energy: 6, skip: 4,
    flavour: 'Rails, winch head, cradle straps. Everything on it is rated for an animal, and everything on it is out of date.',
    fact: 'Large animal transport equipment is inspected on a fixed schedule because the load it is rated for cannot be tested any other way.',
    rewards: [{ type: 'addXP', amount: 16 }, { type: 'money', amount: 7 }]
  },

  duty_deep_intake: {
    title: 'Intake sheets',
    zone: 'the_deep', at: 'deep_roster', atZone: 'staff_deep',
    phases: ['afternoon_shift'],
    verb: 'Write up the intake',
    energy: 5, skip: 4,
    flavour: 'What was offered, what was taken, by whom, in kilograms. Halcyon\'s line has a target on it that has been rubbed out and rewritten twice.',
    fact: 'Recording what an animal ate is only useful alongside what it was offered; a sheet that logs only intake can never show a shortfall.',
    rewards: [{ type: 'addXP', amount: 14 }, { type: 'money', amount: 6 }]
  }
};
