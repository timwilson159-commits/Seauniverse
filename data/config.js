/* ============================================================
   SEA UNIVERSE: CONFIG
   Global tuning knobs. Safe to edit numbers here.
   ============================================================ */
window.SU = window.SU || {};

/* FISHER-YATES, and it matters that it is Fisher-Yates.
   `arr.sort(() => Math.random() - 0.5)` is the usual one-liner and it is
   not a fair shuffle: comparison sorts assume a consistent comparator, so
   a random one leaves items biased towards where they started. For answer
   options that is the whole ballgame, because a bias towards position 0 is
   exactly the thing being fixed. Returns a copy; never mutates content
   data, which is shared and must stay in authoring order. */
SU.shuffle = function (arr) {
  const c = arr.slice();
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = c[i]; c[i] = c[j]; c[j] = t;
  }
  return c;
};

SU.config = {
  buildVersion: '0.1.0',

  // --- Save ---
  saveKey: 'seaUniverse.save',
  saveVersion: 8,          // bump when save shape changes (migrations in state.js)

  /* --- Character select ---
     `id` becomes the sprite filename: player_female.svg / player_male.svg,
     falling back to player.svg if that file is not there yet. Adding a
     third option here is all it takes to offer one. */
  playerSprites: [
    { id: 'female', label: 'Female' },
    { id: 'male',   label: 'Male'   }
  ],
  nameMaxLength: 18,       // fits the on-screen name label and the Summary tab
  autosaveOnPhaseChange: true,

  // --- Rendering ---
  tile: 32,
  view: { w: 960, h: 600 },

  // --- Player ---
  player: {
    baseSpeed: 4.8,        // tiles per second (was 3.2, raised 50%)
    speedPerLevel: 0.15,   // scaled with baseSpeed so the +50% holds at every level
    /* Slots for SUPPLIES AND SELLABLE FINDS ONLY. Tools and passes are
       weightless (SU.State.countsAgainstCarry), because the job keeps
       handing you equipment you are not allowed to drop, and counting it
       meant the further you got the less you could carry. */
    baseCarry: 20,
    carryPerTwoLevels: 1,
    radius: 0.32,          // collision radius in tiles
    interactRange: 1.4     // tiles
  },

  /* --- Day cycle ---
     Phases cycle in order. 'public' = your cover job. 'gap' = free/secret time.

     THE CLOCK. `from` and `to` are in-game minutes past midnight; `real`
     is how many minutes of actual play that phase lasts. A shift is 20
     minutes and covers three in-game hours, a break is 10 minutes and
     covers ninety in-game minutes, which is the SAME RATE throughout:

         9 in-game minutes per real minute, all day, every phase.

     Keep it that way if you retime anything. A clock that speeds up and
     slows down is the sort of thing a player notices without being able
     to say why, and the day is 09:00 to 18:00 precisely because the
     numbers divide cleanly.

     It runs on ACCUMULATED PLAY TIME (`meta.phaseMs`), never wall clock,
     so it stops for dialogue, menus and pause. Same rule as the Zone 3
     quest timers: reading something must never cost you the shift. */
  /* `energy` grants were cut 10% on 2026-08-06 (was 100/70/70/50). */
  phases: [
    { id: 'morning_shift',   label: 'Morning Shift',   kind: 'public', energy: 90, from: 540, to: 720,  real: 20 },
    { id: 'midday_gap',      label: 'Midday Break',    kind: 'gap',    energy: 63, from: 720, to: 810,  real: 10 },
    { id: 'afternoon_shift', label: 'Afternoon Shift', kind: 'public', energy: 63, from: 810, to: 990,  real: 20 },
    { id: 'evening_gap',     label: 'Evening',         kind: 'gap',    energy: 45, from: 990, to: 1080, real: 10 }
  ],

  // --- Shifts (the cover job) ---
  shift: {
    /* HOW MANY JOBS YOU ARE HANDED PER PUBLIC SHIFT, indexed by how many
       REGIONS you have unlocked (index 0 = one region, index 4 = all five).
       Added 2026-08-07: a first-day roster and a five-region roster used to
       be the same size, so a day late in the game had no more of the job in
       it than a day at the start.

         regions   1   2   3   4   5
         duties    3   3   4   4   5

       Read through SU.Duties.dutiesPerShift(), which counts regions and
       clamps at both ends, so this array is the only place the ladder
       lives. Duties are drawn PARK-WIDE (see eligible() in js/duties.js),
       not per zone, so the pool grows with the roster and a five-duty
       shift has 30 duties to choose from rather than one zone's worth. */
    dutiesByRegions: [3, 3, 4, 4, 5],
    suspicionAllDone: 5,     // suspicion REMOVED for a clean shift
    bonusXP: 15,             // was 25, cut in the 2026-08-06 rebalance
    bonusPay: 10             // was 20
  },

  /* Energy costs: the budget that forces the cover-vs-investigate choice.
     RAISED 20% on 2026-08-06, alongside a 10% cut to the per-phase grants
     below. Two small squeezes rather than one large one: actions cost more
     AND the shift is shorter, which bites without making any single choice
     feel punitive. */
  energyCost: {
    search: 4,           // was 3
    observe: 4,          // was 3
    care: 6,             // was 5. Charged when a care session STARTS, solved or not
    /* Fast travel, added 2026-08-06. Flat, every route, both the Menu
       Travel tab and the staff-block terminals (they share wireTransit).
       Small on purpose: it is a nudge towards walking and finding things
       on the way, not a toll. Walking a map exit between regions is free. */
    transit: 3
  },

  // --- Repeat rewards (anti-farming) ---
  // Content is deliberately replayable: students should be able to re-run a
  // care session to learn it. What must NOT repeat is the payout. Practice
  // pays once per in-game day per encounter; after that the lesson still
  // shows, the XP does not.
  practice: {
    xp: 5,               // was 10
    trust: 4
  },

  /* --- Skill points (2026-08-06) ---
     A first-time care solve used to hand out a point every single time,
     and there are 34 encounters, so skill points arrived faster than
     anything worth spending them on. One point every SECOND first solve
     makes the choice of what to raise an actual decision. */
  skillPointEveryNthCare: 2,

  // --- Repeatable-but-capped activities ---
  // Observation posts and keeper talks are the "always something to do"
  // layer: small, honest XP for doing the job properly. Both are capped to
  // once per day per spot by the reward ledger, so they add texture without
  // becoming a grind that beats actually playing.
  observePost: { xp: 5,  trust: 2, energy: 4 },     // xp was 8
  keeperTalk:  { xp: 20, suspicion: -2, energy: 6 }, // xp was 14, energy was 5

  /* --- Hazards (the Safety Register) ---
     Writing down a defect is the job, not sabotage: nobody gets suspicious
     of the trainer who fills in the form. So logging costs almost nothing
     and raises no suspicion. It pays exactly once per hazard, ever, gated
     by the engine rather than by a claim key, because a logged hazard can
     never become unlogged. */
  hazard: { xp: 10, energy: 3 },     // xp was 16, energy was 2

  /* --- The arcade (2026-08-07) ---
     18 cabinets, one per interior except the_room. Playing is FREE:
     the machines are a break from the job, not another energy cost,
     and charging for them would make the cheapest thing in the park
     compete with running a care session.

     `claim` is the load-bearing setting. At 'daily', 18 machines at $3
     would pay $54 a day against a clean shift's $10 and would undo the
     money rebalance on its own. At 'once' the arcade is worth $54 over
     the whole game, beside $373 of money effects in the world. */
  arcade: { pay: 3, claim: 'once' },

  // --- Suspicion (soft pressure only, never a fail state) ---
  suspicion: {
    max: 100,
    decayPerDay: 8,

    /* At or above this, snooping is refused DURING A PUBLIC SHIFT only.
       See the watched gate in js/interact.js for what is and is not
       blocked. Set to the top band so the HUD label and the restriction
       arrive together: the player is told they are Under Scrutiny at the
       same moment being under scrutiny starts to mean something. */
    watchedAt: 75,

    bands: [
      { at: 0,  id: 'clear',    label: 'Unnoticed'  },
      { at: 25, id: 'noticed',  label: 'Noticed'    },
      { at: 50, id: 'watched',  label: 'Watched'    },
      { at: 75, id: 'scrutiny', label: 'Under Scrutiny' }
    ]
  },

  // --- Progression ---
  xp: {
    // XP needed to go from level N to N+1
    toNext: function (level) { return 60 + (level - 1) * 45; },
    maxLevel: 30
  },

  skills: [
    { id: 'observation', label: 'Observation', blurb: 'Spot behavioural cues and details others miss.' },
    { id: 'husbandry',   label: 'Husbandry',   blurb: 'Feeding, enrichment and daily animal care.' },
    { id: 'veterinary',  label: 'Veterinary',  blurb: 'Health checks, injuries and medical records.' },
    { id: 'training',    label: 'Training',    blurb: 'Building trust and teaching behaviours.' },
    { id: 'discretion',  label: 'Discretion',  blurb: 'Moving unseen and talking your way out of trouble.' }
  ],
  skillMax: 10,

  /* Skill points needed to raise a skill TO the given level.
     Levels 1 and 2 deliberately stay at 1 point: every qualification in
     data/progression.js asks for level 2 at most, so making the early
     levels dearer would have quietly pushed gated CONTENT further away.
     Past that the price climbs: deep specialisation is what you save for.

        to Lv   1  2  3  4  5  6  7  8  9  10
        cost    1  1  2  2  3  3  4  4  5   5     (30 points to max one skill)

     Tune here and the whole UI follows. */
  skillCost: function (level) { return Math.ceil(level / 2); },

  // --- Debug ---
  // Add ?dev to the URL to enable the debug overlay + validator report.
  dev: new URLSearchParams(location.search).has('dev')
};
