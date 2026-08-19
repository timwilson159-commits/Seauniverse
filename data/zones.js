/* ============================================================
   SEA UNIVERSE: ZONES / MAPS

   Maps are built from RECTANGLES painted over a base tile, in order.
   Later rectangles paint over earlier ones. This is deliberately easy
   to edit by hand: to move the seal pool, change its x/y. You can never
   break the map by miscounting characters in a row.

     { t:'water', x:25, y:5, w:9, h:5 }   // tile type, top-left, size

   Coordinates are in TILES, origin top-left, x = across, y = down.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

/* --- Tile palette. `solid:true` blocks movement. ------------- */
SU.data.tiles = {
  grass:   { colour: '#3f6b4a', solid: false, label: '' },
  path:    { colour: '#9a9384', solid: false, label: '' },
  deck:    { colour: '#b8a487', solid: false, label: '' },
  sand:    { colour: '#c9b787', solid: false, label: '' },
  floor:   { colour: '#6d6a63', solid: false, label: '' },
  water:   { colour: '#1d5f8a', solid: true,  label: '' },
  fence:   { colour: '#2b3a3f', solid: true,  label: '' },
  wall:    { colour: '#7c6f63', solid: true,  label: '' },
  glass:   { colour: '#4d7f95', solid: true,  label: '' },
  door:    { colour: '#c58b4a', solid: false, label: '' },
  gate:    { colour: '#8f7a3a', solid: false, label: '' },

  /* Staff blocks only. Every region has exactly one and you are sent to
     it constantly, so it gets its own colour rather than sharing the
     generic `wall` with the kiosk, the stadium and the admin block.
     Warm brick, chosen to stay legible against grass, sand, snow, deck
     and quarry alike. Real art drops in later as tile_staffwall.svg. */
  staffwall: { colour: '#a4614a', solid: true, label: '' },

  /* Building name plaques, one beside every outdoor door. Light grey so
     it reads as a fitting on the wall rather than as part of the wall,
     against brick staffwall and grey-brown wall alike. SOLID, because it
     is only ever painted onto a tile that was already wall: see
     data/plaques.js, which owns every one of them. */
  plaque: { colour: '#c9ccd1', solid: true, label: '' },

  /* --- added for the reef complex --- */
  board:   { colour: '#a98a63', solid: false, label: '' },   // boardwalk timber
  shallow: { colour: '#63b6bd', solid: false, label: '' },   // wadeable, you CAN walk here
  hall:    { colour: '#5d6a72', solid: false, label: '' },   // polished indoor floor

  /* --- added for Arctic Cove --- */
  snow:      { colour: '#d5e2ea', solid: false, label: '' },  // trodden snow, walkable
  ice:       { colour: '#a9cfdd', solid: false, label: '' },  // haul-out apron, walkable
  coldwater: { colour: '#17527a', solid: true,  label: '' }   // chilled pool, not walkable
};

/* --- Prop palette: scenery and obstacles. ---------------------
   `solid:true` means you walk around it, not through it. Props are
   placed one per tile in a zone's `props` array:

     { t:'palm', x:15, y:4 }
     { t:'bench', x:18, y:9, text:'Optional flavour text.' }

   A prop with `text` becomes readable with E. Without it, it is
   pure scenery and costs nothing to add.
   ------------------------------------------------------------- */
SU.data.props = {
  palm:     { name: 'Palm',            shape: 'tree',     colour: '#2f7a45', solid: true  },
  bush:     { name: 'Shrub',           shape: 'bush',     colour: '#3a7a4a', solid: true  },
  rock:     { name: 'Rock',            shape: 'rock',     colour: '#6f6a63', solid: true  },
  bench:    { name: 'Bench',           shape: 'bench',    colour: '#8a6a45', solid: true  },
  bin:      { name: 'Bin',             shape: 'cyl',      colour: '#3f4a52', solid: true  },
  barrel:   { name: 'Feed Barrel',     shape: 'cyl',      colour: '#5a6a75', solid: true  },
  lamp:     { name: 'Lamp Post',       shape: 'post',     colour: '#525c66', solid: true  },
  umbrella: { name: 'Shade Umbrella',  shape: 'umbrella', colour: '#c85a5a', solid: true  },
  crate:    { name: 'Crate',           shape: 'box',      colour: '#8a7350', solid: true  },
  planter:  { name: 'Planter',         shape: 'bush',     colour: '#4a8a5a', solid: true  },
  buoy:     { name: 'Marker Buoy',     shape: 'ring',     colour: '#d4682f', solid: false },
  lifering: { name: 'Life Ring',       shape: 'ring',     colour: '#e05c5c', solid: false },
  cone:     { name: 'Safety Cone',     shape: 'cone',     colour: '#e08a3a', solid: false },

  /* --- added for the reef complex --- */
  coral:    { name: 'Coral Display',   shape: 'coral',    colour: '#e08a9a', solid: true  },
  kelp:     { name: 'Kelp Frond',      shape: 'kelp',     colour: '#3f8f6f', solid: true  },
  reed:     { name: 'Reeds',           shape: 'kelp',     colour: '#7a9a4a', solid: false },
  mangrove: { name: 'Mangrove',        shape: 'tree',     colour: '#2f6b4a', solid: true  },
  tank:     { name: 'Display Tank',    shape: 'tank',     colour: '#2a7fa8', solid: true  },
  pillar:   { name: 'Pillar',          shape: 'pillar',   colour: '#9a9384', solid: true  },
  pipe:     { name: 'Pipework',        shape: 'pipe',     colour: '#7f8a92', solid: true  },
  trolley:  { name: 'Feed Trolley',    shape: 'box',      colour: '#6d7a82', solid: true  },

  /* --- added for Arctic Cove ---
     These reuse existing shapes on purpose, so the placeholder renderer
     needs no new code. Real art drops in as prop_<type>.svg later. */
  iceblock: { name: 'Ice Block',       shape: 'box',      colour: '#bcdde8', solid: true  },
  drift:    { name: 'Snow Drift',      shape: 'rock',     colour: '#e4eef4', solid: true  },
  heater:   { name: 'Patio Heater',    shape: 'post',     colour: '#c2683a', solid: true  },
  spruce:   { name: 'Potted Spruce',   shape: 'tree',     colour: '#2c5344', solid: true  }
};

SU.data.zones = {

  /* ==========================================================
     ZONE 1: COASTAL COVE  (starting zone)
     ========================================================== */
  coastal_cove: {
    name: 'Coastal Cove',
    subtitle: 'Seals, sea lions and otters',
    /* `num` is the order the park is meant to be seen in, shown in front
       of the name wherever a region is listed. It is presentation only:
       nothing gates on it, and the fast-travel list still keys off
       whether you have actually walked there. */
    num: 1,
    kind: 'region',              // PARK RULE: every region must have a staff block
    w: 40, h: 26,
    base: 'grass',
    music: null,
    rects: [
      // outer fence
      { t: 'fence', x: 0,  y: 0,  w: 40, h: 1 },
      { t: 'fence', x: 0,  y: 25, w: 40, h: 1 },
      { t: 'fence', x: 0,  y: 0,  w: 1,  h: 26 },
      { t: 'fence', x: 39, y: 0,  w: 1,  h: 26 },

      // main paths
      { t: 'path', x: 19, y: 1,  w: 2,  h: 24 },
      { t: 'path', x: 1,  y: 13, w: 38, h: 2  },
      { t: 'path', x: 1,  y: 21, w: 38, h: 2  },

      // sea lion stadium (west)
      { t: 'deck',  x: 3,  y: 3,  w: 11, h: 9 },
      { t: 'water', x: 5,  y: 5,  w: 7,  h: 5 },

      // harbour seal pool (east)
      { t: 'deck',  x: 23, y: 3,  w: 13, h: 9 },
      { t: 'water', x: 25, y: 5,  w: 9,  h: 5 },

      // otter habitat (south-east)
      { t: 'deck',  x: 27, y: 16, w: 9,  h: 4 },
      { t: 'water', x: 29, y: 17, w: 5,  h: 2 },

      // staff block (south-west)
      { t: 'staffwall', x: 3,  y: 16, w: 9,  h: 5 },
      { t: 'door', x: 7,  y: 20, w: 1,  h: 1 },

      // gift kiosk
      { t: 'wall', x: 13, y: 23, w: 4,  h: 2 },

      // north gate to Coral Kingdom
      { t: 'gate', x: 19, y: 0,  w: 2,  h: 1 },

      /* The main visitor gate, south. Closed for the whole game and
         opened once, at the very end: the finale is the only time the
         player ever leaves the park, and they leave through the front
         door of the zone they started in. */
      { t: 'gate', x: 19, y: 25, w: 2,  h: 1 }
    ],

    // named arrival points
    spawns: {
      start:      { x: 20, y: 23 },
      from_staff: { x: 7,  y: 21 },
      from_north: { x: 20, y: 2  },
      from_gate:  { x: 20, y: 24 }
    },

    exits: [
      { x: 7, y: 20, to: 'staff_cove', spawn: 'entry', label: 'Staff Block' },

      /* Out of the park. Opens only once Wren has set the meeting up. */
      {
        x: 19, y: 25, w: 2, h: 1, to: 'the_room', spawn: 'entry', label: 'Out of the park',
        condition: { flags: { meeting_set: true } },
        lockedText: 'The main visitor gate. You have walked past it every single day and never ' +
                    'once gone through it, because going through it means the shift is over and ' +
                    'the shift is the only reason you are here.'
      },
      {
        x: 19, y: 0, w: 2, h: 1,
        to: 'coral_kingdom', spawn: 'from_south', label: 'Coral Kingdom',
        condition: { flags: { zone_coral_unlocked: true } },
        lockedText: 'A turnstile with a card reader. The light is red. You are not cleared for Coral Kingdom yet.'
      }
    ],

    /* Scenery and obstacles. Solid props are walked around. */
    props: [
      // palms breaking up the grass verges
      { t: 'palm', x: 15, y: 4 }, { t: 'palm', x: 16, y: 8 }, { t: 'palm', x: 15, y: 11 },
      { t: 'palm', x: 22, y: 4 }, { t: 'palm', x: 21, y: 8 }, { t: 'palm', x: 22, y: 11 },
      { t: 'palm', x: 37, y: 3 }, { t: 'palm', x: 37, y: 9 },
      { t: 'palm', x: 2,  y: 16 }, { t: 'palm', x: 2, y: 19 },
      { t: 'palm', x: 14, y: 17 }, { t: 'palm', x: 25, y: 20 },
      { t: 'palm', x: 37, y: 16 }, { t: 'palm', x: 37, y: 20 },
      { t: 'palm', x: 3,  y: 24 }, { t: 'palm', x: 9, y: 24 },
      { t: 'palm', x: 21, y: 24 }, { t: 'palm', x: 30, y: 24 }, { t: 'palm', x: 35, y: 24 },

      // low planting, softens the edges
      { t: 'bush', x: 14, y: 2 }, { t: 'bush', x: 17, y: 6 }, { t: 'bush', x: 16, y: 12 },
      { t: 'bush', x: 22, y: 2 }, { t: 'bush', x: 21, y: 6 }, { t: 'bush', x: 22, y: 9 },
      { t: 'bush', x: 36, y: 5 }, { t: 'bush', x: 36, y: 11 },
      { t: 'bush', x: 1,  y: 17 }, { t: 'bush', x: 13, y: 19 },
      { t: 'bush', x: 24, y: 15 }, { t: 'bush', x: 26, y: 18 },
      { t: 'bush', x: 36, y: 18 }, { t: 'bush', x: 6, y: 24 },
      { t: 'bush', x: 24, y: 24 }, { t: 'bush', x: 33, y: 24 },
      { t: 'planter', x: 18, y: 21 }, { t: 'planter', x: 21, y: 21 },
      { t: 'planter', x: 18, y: 13 }, { t: 'planter', x: 21, y: 13 },

      // seating and street furniture along the visitor routes
      { t: 'bench', x: 18, y: 5,  text: 'A bench facing the stadium. Someone has scratched "FREE THEM" into the slats and someone else has half sanded it off.' },
      { t: 'bench', x: 18, y: 9 },
      { t: 'bench', x: 21, y: 10 },
      { t: 'bench', x: 18, y: 17 },
      { t: 'bench', x: 23, y: 17 },
      { t: 'bench', x: 12, y: 23 }, { t: 'bench', x: 27, y: 23 },
      { t: 'bin', x: 18, y: 10 }, { t: 'bin', x: 22, y: 16 },
      { t: 'bin', x: 26, y: 23 }, { t: 'bin', x: 12, y: 16 },
      { t: 'lamp', x: 18, y: 3 }, { t: 'lamp', x: 21, y: 3 },
      { t: 'lamp', x: 18, y: 12 }, { t: 'lamp', x: 21, y: 12 },
      { t: 'lamp', x: 18, y: 20 }, { t: 'lamp', x: 21, y: 20 },
      { t: 'lamp', x: 18, y: 24 }, { t: 'lamp', x: 22, y: 23 },
      { t: 'umbrella', x: 17, y: 23 }, { t: 'umbrella', x: 17, y: 24 },

      // working clutter around the pools: this is a workplace, not a garden
      { t: 'crate',  x: 4,  y: 3 }, { t: 'barrel', x: 12, y: 4 },
      { t: 'lifering', x: 4, y: 7 }, { t: 'buoy', x: 12, y: 7 },
      { t: 'barrel', x: 24, y: 3 }, { t: 'crate', x: 24, y: 4 },
      { t: 'buoy', x: 24, y: 7 }, { t: 'lifering', x: 34, y: 6 },
      { t: 'crate',  x: 35, y: 10 },
      { t: 'rock', x: 28, y: 17 }, { t: 'rock', x: 34, y: 18 },
      { t: 'crate', x: 27, y: 19 },
      { t: 'cone', x: 20, y: 15,
        text: 'A safety cone over a cracked drain cover. The maintenance tag is dated fourteen months ago.' },
      { t: 'cone', x: 33, y: 21 }
    ],

    /* Objects: things you can walk up to and press E on. */
    objects: [
      { id: 'sign_cove', x: 20, y: 20, kind: 'sign', name: 'Park Sign',
        text: 'WELCOME TO COASTAL COVE. Home to our rescued pinnipeds. Every animal here has a story of survival.' },

      { id: 'brochure_stand', x: 22, y: 21, kind: 'search', name: 'Brochure Stand',
        text: 'A rack of glossy park brochures.',
        once: true,
        effects: [
          { type: 'addEvidence', id: 'ev_brochure_claim' },
          { type: 'toast', text: 'Brochure filed in your Notebook.' }
        ] },

      { id: 'seal_pool_edge', x: 29, y: 10, kind: 'animal', name: 'Harbour Seal Pool',
        species: 'harbor_seal',
        requires: { qualification: 'pinniped_basic' },
        deniedText: 'You need Pinniped Handling I before you can run a session here.' },

      { id: 'sealion_stage', x: 8, y: 10, kind: 'animal', name: 'Sea Lion Stadium',
        species: 'california_sea_lion',
        requires: { qualification: 'pinniped_basic' },
        deniedText: 'The stadium team will not let an uncertified trainer on the deck.' },

      { id: 'otter_deck', x: 31, y: 19, kind: 'animal', name: 'Otter Habitat',
        species: 'sea_otter',
        requires: { flags: { otter_access: true } },
        deniedText: 'The otter habitat gate is keyed. Kelpie\'s keeper controls access.' },

      { id: 'rockpool_1', x: 34, y: 23, kind: 'search', name: 'Rock Pool',
        text: 'Shallow water and smooth stones.',
        loot: [{ item: 'sea_glass', chance: 0.7 }] },

      { id: 'rockpool_2', x: 5,  y: 23, kind: 'search', name: 'Drain Grate',
        text: 'Things wash down here and stay.',
        loot: [{ item: 'lost_sunglasses', chance: 0.5 }, { item: 'sea_glass', chance: 0.4 }] },

      { id: 'rockpool_3', x: 37, y: 6,  kind: 'search', name: 'Poolside Planter',
        text: 'Someone has been dropping things in the mulch.',
        loot: [{ item: 'sea_glass', chance: 0.6 }, { item: 'souvenir_pin', chance: 0.3 }] },

      /* FOUR MORE, added so q_cove_seaglass's three pieces are findable in
         one shift instead of needing several days. With only the three
         rockpools above (0.7/0.4/0.6), the chance of all three landing
         the SAME day was under 17%, which is what sent students hunting
         across multiple days without understanding why. More independent
         restocking spots raises the odds without making it a certainty,
         the same probabilistic shape every other search object uses. */
      { id: 'bin_cove_1', x: 17, y: 10, kind: 'search', name: 'Public Bin',
        text: 'A visitor bin, overflowing as usual.',
        loot: [{ item: 'sea_glass', chance: 0.6 }] },

      { id: 'bin_cove_2', x: 23, y: 16, kind: 'search', name: 'Recycling Bin',
        text: 'Bottles and wrappers, and whatever fell in with them.',
        loot: [{ item: 'sea_glass', chance: 0.6 }] },

      { id: 'bin_cove_3', x: 25, y: 23, kind: 'search', name: 'Kiosk Bin',
        text: 'Overflowing again. The kiosk queue does not believe in bins.',
        loot: [{ item: 'sea_glass', chance: 0.6 }] },

      { id: 'bin_cove_4', x: 13, y: 16, kind: 'search', name: 'Bench Bin',
        text: 'Somebody has used it as an ashtray, which is not what it is for.',
        loot: [{ item: 'sea_glass', chance: 0.6 }] },

      { id: 'hose_point', x: 23, y: 12, kind: 'station', name: 'Hose Reel',
        text: 'A coiled deck hose on a wall reel, with a scrubbing brush wedged behind it.' },

      { id: 'obs_seal_rail', x: 35, y: 11, kind: 'observe', name: 'Seal Pool Rail',
        species: 'harbor_seal',
        text: 'The far rail of the seal pool, where the crowd never bothers to walk.' },

      { id: 'talk_cove', x: 19, y: 19, kind: 'talk', name: 'Cove Talk Point',
        pool: 'cove_plaza',
        text: 'The paved circle where staff are expected to stand and be approachable.' },

      { id: 'kiosk_counter', x: 15, y: 22, kind: 'shop', name: 'Gift Kiosk',
        text: 'A tired-looking kiosk selling overpriced everything.',
        sells: ['cove_doughnut', 'energy_bar', 'coffee', 'camera'] }
    ]
  },

  /* ==========================================================
     STAFF BLOCK, interior, tutorial-ish hub
     ========================================================== */
  staff_cove: {
    name: 'Cove Staff Block',
    subtitle: 'Lockers, roster board, bad coffee',
    kind: 'interior',
    staffFor: 'coastal_cove',    // marks this as Coastal Cove's staff block
    w: 20, h: 14,
    base: 'floor',
    rects: [
      { t: 'wall', x: 0,  y: 0,  w: 20, h: 1  },
      { t: 'wall', x: 0,  y: 13, w: 20, h: 1  },
      { t: 'wall', x: 0,  y: 0,  w: 1,  h: 14 },
      { t: 'wall', x: 19, y: 0,  w: 1,  h: 14 },
      { t: 'wall', x: 2,  y: 2,  w: 6,  h: 1  },   // lockers
      { t: 'wall', x: 13, y: 2,  w: 5,  h: 1  },   // roster board wall
      { t: 'wall', x: 8,  y: 6,  w: 4,  h: 1  },   // table
      { t: 'door', x: 9,  y: 13, w: 2,  h: 1  }
    ],
    spawns: {
      entry: { x: 9, y: 12 }
    },
    exits: [
      { x: 9, y: 13, w: 2, h: 1, to: 'coastal_cove', spawn: 'from_staff', label: 'Coastal Cove' }
    ],
    props: [
      { t: 'crate', x: 2, y: 11 }, { t: 'crate', x: 3, y: 11 },
      { t: 'bin',   x: 17, y: 11 },
      { t: 'barrel', x: 17, y: 6 },
      { t: 'bench', x: 5, y: 8, text: 'A sagging staff-room couch. It has absorbed a decade of night shifts.' },
      { t: 'planter', x: 12, y: 11 }
    ],
    objects: [
      { id: 'transit_cove', x: 13, y: 3, kind: 'transit', name: 'Transit Terminal',
        text: 'A scuffed touchscreen beside the service corridor door.' },

      { id: 'roster_board', x: 15, y: 3, kind: 'sign', name: 'Roster Board',
        text: 'TODAY: Cove feeds 0900. Stadium show 1130 & 1500. NOTE FROM MANAGEMENT: guest-facing staff are reminded that questions about animal origins should be directed to Guest Relations. Do not speculate.' },
      { id: 'my_locker', x: 4, y: 3, kind: 'search', name: 'Your Locker', once: true,
        text: 'Your locker. Someone has already stuck a name label on it.',
        effects: [
          { type: 'giveItem', id: 'staff_lanyard' },
          { type: 'giveItem', id: 'clipboard' },
          { type: 'toast', text: 'Got: Staff Lanyard, Clipboard' }
        ] },
      { id: 'feed_prep', x: 3, y: 7, kind: 'station', name: 'Feed Prep Bench',
        text: 'Scales, buckets, and a wall of clipboards. The smell never leaves your hands.' },

      { id: 'coffee_pot', x: 10, y: 7, kind: 'search', name: 'Coffee Pot',
        text: 'It has been on the hotplate since before you were hired.',
        loot: [{ item: 'coffee', chance: 1 }] },

      { id: 'manifest_clipboard', x: 17, y: 3, kind: 'search', name: 'Filing Clipboard', once: true,
        requires: { phase: 'gap' },
        deniedText: 'Two supervisors are working at the bench behind you and the roster board is the busiest wall in the building. Not during a shift.',
        text: 'A clipboard of movement paperwork hanging beside the roster board. Most of it is laundry and feed orders.\n\nTRANSFER MANIFEST #4471: 2 x Zalophus californianus. Origin: ON-SITE BIRTH. Destination: overseas facility, name redacted. Value: withheld.',
        effects: [
          { type: 'addEvidence', id: 'ev_transfer_manifest' },
          { type: 'addSuspicion', amount: 4 },
          { type: 'toast', text: 'Manifest 4471 copied into your Notebook.' }
        ] }
    ]
  },

  /* ==========================================================
     ZONE 2: CORAL KINGDOM
     The park's flagship. Deliberately bigger and less linear than
     the cove: a central spine path, a promenade at two heights, a
     mangrove boardwalk loop along the north, and a service alley
     down the east side of the reef hall. There is always more than
     one way to get anywhere, which is the point: you need routes
     that are not the route everyone watches.

     Four interiors hang off it: the staff block, the public reef
     hall, the gated turtle unit, and the back-of-house corridor.
     ========================================================== */
  coral_kingdom: {
    name: 'Coral Kingdom',
    subtitle: 'Dolphins, the reef hall and the rehab unit',
    num: 2,
    kind: 'region',
    w: 56, h: 40,
    base: 'sand',
    music: null,

    /* Fires once, the first time the player sets foot here. */
    onArrive: [
      { type: 'achievement', id: 'deep_end' },
      { type: 'toast', text: 'Coral Kingdom. Everything here is twice the size and twice as watched.' }
    ],
    rects: [
      // outer fence
      { t: 'fence', x: 0,  y: 0,  w: 56, h: 1  },
      { t: 'fence', x: 0,  y: 39, w: 56, h: 1  },
      { t: 'fence', x: 0,  y: 0,  w: 1,  h: 40 },
      { t: 'fence', x: 55, y: 0,  w: 1,  h: 40 },

      // northern planted strip, mangrove boardwalk and wading shallows
      { t: 'grass',   x: 1,  y: 1,  w: 54, h: 7 },
      { t: 'board',   x: 6,  y: 3,  w: 30, h: 2 },
      { t: 'shallow', x: 6,  y: 5,  w: 30, h: 2 },

      // dolphin lagoon and stadium deck (west)
      { t: 'deck',  x: 4,  y: 9,  w: 26, h: 13 },
      { t: 'water', x: 7,  y: 11, w: 20, h: 8  },

      // touch pool (centre south): the shallow ring is walkable
      { t: 'deck',    x: 18, y: 25, w: 10, h: 6 },
      { t: 'shallow', x: 20, y: 26, w: 6,  h: 4 },

      // circulation: two promenades and a spine, so nothing is a dead end
      { t: 'path', x: 1,  y: 22, w: 54, h: 2  },
      { t: 'path', x: 1,  y: 31, w: 54, h: 2  },
      { t: 'path', x: 30, y: 7,  w: 3,  h: 32 },
      { t: 'path', x: 20, y: 33, w: 16, h: 6  },   // entry plaza

      // buildings
      { t: 'wall', x: 34, y: 8,  w: 19, h: 14 },   // reef hall (leaves a 2-wide service alley east)
      { t: 'staffwall', x: 3,  y: 25, w: 11, h: 6  },   // staff block
      { t: 'wall', x: 40, y: 25, w: 12, h: 6  },   // turtle rehab unit
      { t: 'wall', x: 44, y: 2,  w: 8,  h: 4  },   // service shed
      { t: 'wall', x: 6,  y: 34, w: 6,  h: 3  },   // kiosk

      // frontages and openings, painted last so nothing covers them
      { t: 'glass', x: 35, y: 21, w: 8, h: 1 },
      { t: 'glass', x: 46, y: 21, w: 6, h: 1 },
      { t: 'door',  x: 43, y: 21, w: 2, h: 1 },
      { t: 'door',  x: 8,  y: 30, w: 1, h: 1 },
      { t: 'door',  x: 45, y: 30, w: 1, h: 1 },
      { t: 'door',  x: 47, y: 5,  w: 1, h: 1 },
      { t: 'gate',  x: 27, y: 39, w: 2, h: 1 },
      { t: 'gate',  x: 0,  y: 14, w: 1, h: 2 }    // west gate to Arctic Cove, off the lagoon deck
    ],

    spawns: {
      from_south:  { x: 28, y: 37 },
      from_west:   { x: 2,  y: 15 },
      from_staff:  { x: 8,  y: 31 },
      from_hall:   { x: 43, y: 22 },
      from_turtle: { x: 45, y: 31 },
      from_service:{ x: 47, y: 6  }
    },

    exits: [
      { x: 27, y: 39, w: 2, h: 1, to: 'coastal_cove', spawn: 'from_north', label: 'Coastal Cove' },
      {
        x: 0, y: 14, w: 1, h: 2,
        to: 'arctic_cove', spawn: 'from_east', label: 'Arctic Cove',
        condition: { flags: { zone_arctic_unlocked: true } },
        lockedText: 'A service gate in the western fence, past the far end of the lagoon deck. ' +
                    'Cold air pours off it even in the sun. ARCTIC COVE: CLOSED FOR CONDITIONING, ' +
                    'and the card reader disagrees with your lanyard.'
      },
      { x: 8,  y: 30, to: 'staff_coral', spawn: 'entry', label: 'Reef Staff Block' },
      { x: 43, y: 21, w: 2, h: 1, to: 'reef_hall', spawn: 'entry', label: 'Reef Hall' },
      {
        x: 45, y: 30, to: 'turtle_unit', spawn: 'entry', label: 'Rehabilitation Unit',
        condition: { any: [{ qualification: 'rehab_cert' }, { flags: { turtle_access: true } }] },
        lockedText: 'REHABILITATION UNIT: AUTHORISED STAFF ONLY. The keypad is not decorative. ' +
                    'Dr Sato controls who goes in here, and she has not met you yet.'
      },
      {
        x: 47, y: 5, to: 'service_corridor', spawn: 'entry', label: 'Service Corridor',
        condition: { hasItems: { service_key: 1 } },
        lockedText: 'A maintenance door behind the mangrove planting. Locked, and not with the kind of ' +
                    'lock your lanyard opens.'
      }
    ],

    props: [
      // mangrove fringe along the wading shallows
      { t: 'mangrove', x: 7,  y: 6 }, { t: 'mangrove', x: 11, y: 5 },
      { t: 'mangrove', x: 16, y: 6 }, { t: 'mangrove', x: 22, y: 5 },
      { t: 'mangrove', x: 27, y: 6 }, { t: 'mangrove', x: 33, y: 5 },
      { t: 'reed', x: 9,  y: 5 }, { t: 'reed', x: 14, y: 6 }, { t: 'reed', x: 19, y: 5 },
      { t: 'reed', x: 25, y: 6 }, { t: 'reed', x: 29, y: 5 }, { t: 'reed', x: 35, y: 6 },
      { t: 'palm', x: 3,  y: 2 }, { t: 'palm', x: 4, y: 6 }, { t: 'palm', x: 38, y: 2 },
      { t: 'palm', x: 41, y: 6 }, { t: 'palm', x: 53, y: 2 }, { t: 'palm', x: 53, y: 6 },
      { t: 'bush', x: 2,  y: 4 }, { t: 'bush', x: 37, y: 5 }, { t: 'bush', x: 42, y: 3 },
      { t: 'lamp', x: 30, y: 6 }, { t: 'lamp', x: 5, y: 3 },

      // stadium seating and poolside working clutter
      { t: 'bench', x: 5,  y: 12 }, { t: 'bench', x: 5, y: 14 }, { t: 'bench', x: 5, y: 16 },
      { t: 'bench', x: 6,  y: 18 },
      { t: 'bench', x: 20, y: 21 }, { t: 'bench', x: 23, y: 21 }, { t: 'bench', x: 26, y: 21 },
      { t: 'lifering', x: 8, y: 10 }, { t: 'lifering', x: 26, y: 19 },
      { t: 'buoy', x: 12, y: 10 }, { t: 'buoy', x: 21, y: 10 },
      { t: 'barrel', x: 4, y: 10 }, { t: 'crate', x: 4, y: 20 },
      { t: 'trolley', x: 28, y: 12,
        text: 'A wheeled feed trolley. The fish crate on top is labelled by animal name, weighed to the gram.' },
      { t: 'trolley', x: 28, y: 15 },
      { t: 'cone', x: 29, y: 21 }, { t: 'pillar', x: 4, y: 9 }, { t: 'pillar', x: 29, y: 9 },

      // reef hall frontage
      { t: 'coral', x: 35, y: 22 }, { t: 'coral', x: 52, y: 22 },
      { t: 'planter', x: 38, y: 22 }, { t: 'planter', x: 49, y: 22 },
      { t: 'lamp', x: 41, y: 22 }, { t: 'lamp', x: 46, y: 22 },
      { t: 'bin', x: 45, y: 22 },
      { t: 'pipe', x: 54, y: 12,
        text: 'Filtration pipework running down the side of the reef hall. One joint has been wrapped in tape and left.' },
      { t: 'pipe', x: 54, y: 16 }, { t: 'crate', x: 54, y: 9 },

      // touch pool surrounds
      { t: 'rock', x: 19, y: 26 }, { t: 'rock', x: 26, y: 29 }, { t: 'rock', x: 19, y: 29 },
      { t: 'kelp', x: 26, y: 26 }, { t: 'kelp', x: 18, y: 28 },
      { t: 'cone', x: 22, y: 31 }, { t: 'crate', x: 27, y: 25 },

      // staff block and rehab unit surrounds
      { t: 'bin', x: 14, y: 30 }, { t: 'crate', x: 2, y: 31 }, { t: 'barrel', x: 15, y: 25 },
      { t: 'bush', x: 16, y: 27 }, { t: 'bush', x: 38, y: 27 },
      { t: 'cone', x: 44, y: 31 }, { t: 'crate', x: 52, y: 26 }, { t: 'barrel', x: 52, y: 29 },
      { t: 'pipe', x: 39, y: 25,
        text: 'Seawater intake pipes feeding the rehab unit. These at least look maintained.' },

      // entry plaza
      { t: 'umbrella', x: 21, y: 34 }, { t: 'umbrella', x: 21, y: 36 },
      { t: 'umbrella', x: 34, y: 34 }, { t: 'umbrella', x: 34, y: 36 },
      { t: 'bench', x: 23, y: 37 }, { t: 'bench', x: 32, y: 37 },
      { t: 'bench', x: 24, y: 33 }, { t: 'bench', x: 33, y: 33 },
      { t: 'bin', x: 26, y: 37 }, { t: 'bin', x: 20, y: 33 },
      { t: 'lamp', x: 22, y: 33 }, { t: 'lamp', x: 35, y: 33 },
      { t: 'lamp', x: 22, y: 38 }, { t: 'lamp', x: 35, y: 38 },
      { t: 'planter', x: 29, y: 33 }, { t: 'planter', x: 25, y: 38 },
      { t: 'coral', x: 33, y: 38,
        text: 'A "living coral" feature in the plaza. A small plaque admits it is resin.' },
      { t: 'palm', x: 14, y: 34 }, { t: 'palm', x: 14, y: 37 }, { t: 'palm', x: 17, y: 35 },
      { t: 'palm', x: 40, y: 34 }, { t: 'palm', x: 44, y: 36 }, { t: 'palm', x: 48, y: 34 },
      { t: 'bush', x: 5,  y: 33 }, { t: 'bush', x: 12, y: 38 }, { t: 'bush', x: 51, y: 37 },
      { t: 'crate', x: 5, y: 37 }
    ],

    objects: [
      { id: 'sign_coral', x: 27, y: 33, kind: 'sign', name: 'Park Sign',
        text: 'CORAL KINGDOM. Our flagship marine habitat. Home to the Sea Universe dolphin family, ' +
              'the Great Reef Hall, and our world-class Marine Rehabilitation Unit.\n\n' +
              'Every animal you see here has been rescued, rehabilitated, or born into our care.' },

      { id: 'pr_wall', x: 31, y: 33, kind: 'search', name: 'Conservation Wall', once: true,
        text: 'A backlit display wall of photographs and numbers.\n\n' +
              '"127 ANIMALS RESCUED. 41 RETURNED TO THE WILD. 100% OF OUR PROFITS SUPPORT CONSERVATION."\n\n' +
              'The last line has an asterisk. The footnote is set in four-point type: ' +
              '"of our designated conservation fund."',
        effects: [
          { type: 'addEvidence', id: 'ev_conservation_wall' },
          { type: 'toast', text: 'Conservation Wall copied into your Notebook.' }
        ] },

      { id: 'kiosk_reef', x: 8, y: 37, kind: 'shop', name: 'Reef Kiosk',
        text: 'A smarter kiosk than the one in the cove. Same markup.',
        sells: ['smoothie', 'energy_bar', 'coffee', 'camera', 'test_kit'] },

      { id: 'talk_plaza', x: 24, y: 35, kind: 'talk', name: 'Keeper Talk Point',
        pool: 'reef_plaza',
        text: 'A low podium with a microphone nobody uses and a semicircle of expectant visitors.' },

      { id: 'dolphin_deck', x: 16, y: 20, kind: 'animal', name: 'Dolphin Lagoon',
        species: 'bottlenose_dolphin',
        requires: { qualification: 'cetacean_basic' },
        deniedText: 'Priya stops you at the gate. "Cetacean Handling I first. No exceptions, not even for keen ones."' },

      { id: 'show_desk', x: 12, y: 20, kind: 'station', name: 'Show Control Desk',
        text: 'Cue sheets, a mixing desk and a laminated running order. Someone has pencilled ' +
              '"ADD 2 MIN: CROWD LOVES THE JUMP" beside the final behaviour.' },

      { id: 'obs_lagoon', x: 24, y: 20, kind: 'observe', name: 'Lagoon Viewing Rail',
        species: 'bottlenose_dolphin',
        text: 'A railing at the deep end, away from the stands. From here you can watch without being watched.' },

      { id: 'hose_reef', x: 20, y: 22, kind: 'station', name: 'Reef Hose Point',
        text: 'A hose reel and a stack of deck brushes. The reef complex decks are twice the size of the cove\'s.' },

      { id: 'touch_pool', x: 22, y: 25, kind: 'animal', name: 'Touch Pool',
        species: 'port_jackson_shark',
        requires: { qualification: 'aquarist_basic' },
        deniedText: 'The touch pool needs a qualified aquarist on the rail at all times. That is not you yet.' },

      { id: 'obs_mangrove', x: 20, y: 3, kind: 'observe', name: 'Mangrove Boardwalk',
        species: 'green_turtle',
        text: 'A boardwalk over the mangrove shallows. Juvenile turtles come in here on the tide.' },

      { id: 'sample_lagoon', x: 27, y: 20, kind: 'search', name: 'Lagoon Sample Port',
        text: 'A sampling port set into the lagoon deck.',
        requires: { hasItems: { test_kit: 1 } },
        deniedText: 'A sampling port. You would need a test kit to get anything useful out of it.',
        loot: [{ item: 'water_sample', chance: 1 }] },

      { id: 'drain_reef', x: 36, y: 23, kind: 'search', name: 'Promenade Drain',
        text: 'A grated storm drain. Everything the crowd drops ends up down here, and from here it goes to sea.',
        loot: [{ item: 'plastic_debris', chance: 0.8 }, { item: 'coral_fragment', chance: 0.3 }] },

      { id: 'touch_filter', x: 26, y: 30, kind: 'search', name: 'Touch Pool Filter', once: true,
        text: 'The filter basket under the touch pool ledge. Shells, a hair tie, half a bucket of sand,' +
              'and one blue dive glove, chewed at the cuff.',
        effects: [
          { type: 'giveItem', id: 'dive_glove' },
          { type: 'toast', text: 'Got: Dive Glove' }
        ] },

      { id: 'lost_property', x: 39, y: 31, kind: 'search', name: 'Lost Property Box',
        text: 'A crate of things people were sure they would miss.',
        loot: [{ item: 'lost_sunglasses', chance: 0.5 }, { item: 'reef_plush', chance: 0.4 },
               { item: 'sea_glass', chance: 0.3 }] },

      { id: 'wing_hoarding', x: 50, y: 33, kind: 'sign', name: 'Construction Hoarding',
        text: 'THE OPEN OCEAN WING: OPENING NEXT SEASON.\n\n' +
              'An artist\'s impression of a tank far larger than anything currently on site, ' +
              'with three orca-shaped silhouettes in it. No animal names. No species listed.\n\n' +
              'The hoarding is dated eighteen months ago.' }
    ]
  },

  /* ==========================================================
     REEF STAFF BLOCK, Coral Kingdom's staff block (PARK RULE)
     ========================================================== */
  staff_coral: {
    name: 'Reef Staff Block',
    subtitle: 'Wetsuits drying on every available surface',
    kind: 'interior',
    staffFor: 'coral_kingdom',
    w: 22, h: 16,
    base: 'floor',
    rects: [
      { t: 'wall', x: 0,  y: 0,  w: 22, h: 1  },
      { t: 'wall', x: 0,  y: 15, w: 22, h: 1  },
      { t: 'wall', x: 0,  y: 0,  w: 1,  h: 16 },
      { t: 'wall', x: 21, y: 0,  w: 1,  h: 16 },
      { t: 'wall', x: 2,  y: 2,  w: 6,  h: 1  },   // lockers
      { t: 'wall', x: 13, y: 2,  w: 6,  h: 1  },   // notice wall
      { t: 'wall', x: 8,  y: 8,  w: 6,  h: 1  },   // long table
      { t: 'wall', x: 2,  y: 11, w: 3,  h: 1  },   // water lab bench
      { t: 'door', x: 10, y: 15, w: 2,  h: 1  }
    ],
    spawns: { entry: { x: 10, y: 14 } },
    exits: [
      { x: 10, y: 15, w: 2, h: 1, to: 'coral_kingdom', spawn: 'from_staff', label: 'Coral Kingdom' }
    ],
    props: [
      { t: 'crate', x: 2, y: 13 }, { t: 'crate', x: 3, y: 13 }, { t: 'barrel', x: 19, y: 13 },
      { t: 'bin', x: 19, y: 4 }, { t: 'trolley', x: 17, y: 8 },
      { t: 'bench', x: 6, y: 6, text: 'A drying rack of wetsuits. All of them smell. One is labelled ' +
        'with a name that has been crossed out and written over twice.' },
      { t: 'kelp', x: 20, y: 10 }
    ],
    objects: [
      { id: 'transit_coral', x: 15, y: 3, kind: 'transit', name: 'Transit Terminal',
        text: 'The reef complex terminal. Newer than the one in the cove, and it logs every trip.' },

      { id: 'coral_roster', x: 17, y: 3, kind: 'sign', name: 'Roster Board',
        text: 'REEF ROSTER: Dolphin presentations 1000, 1230, 1500. Reef hall feeds 0830 & 1600. ' +
              'Touch pool supervised sessions all day.\n\n' +
              'REMINDER: the rehab unit is not on the public map and is not to be pointed out to guests.' },

      { id: 'margo_memo', x: 13, y: 3, kind: 'search', name: 'Pinned Memo', once: true,
        text: 'A memo pinned at eye height, printed on Guest Experience letterhead.\n\n' +
              '"TEAM: approved language for the reef complex. Say: family, habitat, ambassador, ' +
              'conservation. Do NOT say: tank, captive, bred, enclosure, culled.\n' +
              'If a guest asks about water quality, the answer is that it is tested daily and is excellent. ' +
              'Do not elaborate. M. Vale"',
        effects: [
          { type: 'addEvidence', id: 'ev_margo_directive' },
          { type: 'toast', text: 'Approved language memo copied into your Notebook.' }
        ] },

      { id: 'water_bench', x: 3, y: 12, kind: 'station', name: 'Water Lab Bench',
        text: 'Reagent bottles, a rack of sample vials and a printout tray. The lab log is open at today\'s page.' },

      { id: 'coffee_reef', x: 10, y: 9, kind: 'search', name: 'Coffee Machine',
        text: 'An actual machine, not a jug. The reef complex gets the good one.',
        loot: [{ item: 'coffee', chance: 1 }] },

      { id: 'reef_locker', x: 5, y: 3, kind: 'search', name: 'Spare Locker', once: true,
        text: 'An unclaimed locker with a spare kit inside: somebody left in a hurry.',
        effects: [
          { type: 'giveItem', id: 'test_kit' },
          { type: 'toast', text: 'Got: Water Test Kit' }
        ] }
    ]
  },

  /* ==========================================================
     REEF HALL, the public aquarium interior
     ========================================================== */
  reef_hall: {
    name: 'Great Reef Hall',
    subtitle: 'Cold air, blue light, and a queue',
    kind: 'interior',
    w: 30, h: 20,
    base: 'hall',
    rects: [
      { t: 'wall',  x: 0,  y: 0,  w: 30, h: 1  },
      { t: 'wall',  x: 0,  y: 19, w: 30, h: 1  },
      { t: 'wall',  x: 0,  y: 0,  w: 1,  h: 20 },
      { t: 'wall',  x: 29, y: 0,  w: 1,  h: 20 },
      { t: 'water', x: 2,  y: 1,  w: 26, h: 1  },   // the tank, behind glass
      { t: 'glass', x: 2,  y: 2,  w: 26, h: 1  },   // the viewing window
      { t: 'wall',  x: 9,  y: 9,  w: 5,  h: 1  },   // exhibit plinths
      { t: 'wall',  x: 17, y: 9,  w: 5,  h: 1  },
      { t: 'wall',  x: 2,  y: 15, w: 4,  h: 1  },   // filtration room frontage
      { t: 'door',  x: 14, y: 19, w: 2,  h: 1  }
    ],
    spawns: { entry: { x: 14, y: 18 } },
    exits: [
      { x: 14, y: 19, w: 2, h: 1, to: 'coral_kingdom', spawn: 'from_hall', label: 'Coral Kingdom' }
    ],
    props: [
      { t: 'pillar', x: 7,  y: 6 }, { t: 'pillar', x: 22, y: 6 },
      { t: 'pillar', x: 7,  y: 13 }, { t: 'pillar', x: 22, y: 13 },
      { t: 'tank', x: 4,  y: 7, text: 'A column tank of moon jellyfish, lit violet. Hypnotic, and very cheap to run.' },
      { t: 'tank', x: 25, y: 7 },
      { t: 'tank', x: 4,  y: 11 }, { t: 'tank', x: 25, y: 11 },
      { t: 'coral', x: 11, y: 5 }, { t: 'coral', x: 19, y: 5 },
      { t: 'kelp', x: 2,  y: 5 }, { t: 'kelp', x: 27, y: 5 },
      { t: 'bench', x: 12, y: 12 }, { t: 'bench', x: 18, y: 12 },
      { t: 'bin', x: 27, y: 17 }, { t: 'crate', x: 2, y: 17 },
      { t: 'pipe', x: 6, y: 16, text: 'Filtration standpipes. A handwritten label reads "DO NOT ADJUST. ASK TOSH".' }
    ],
    objects: [
      { id: 'tank_reef', x: 8, y: 3, kind: 'animal', name: 'Grey Nurse Tank',
        species: 'grey_nurse_shark',
        requires: { qualification: 'aquarist_basic' },
        deniedText: 'Access to the tank gantry needs Aquarium Systems I. Tosh is very clear about this.' },

      { id: 'tank_cuttle', x: 22, y: 3, kind: 'animal', name: 'Cuttlefish Tank',
        species: 'giant_cuttlefish',
        requires: { qualification: 'aquarist_basic' },
        deniedText: 'The cuttlefish tank is on the same gantry. Same rule, same qualification.' },

      { id: 'obs_reefwindow', x: 15, y: 3, kind: 'observe', name: 'Reef Window',
        species: 'grey_nurse_shark',
        text: 'Twenty-six metres of acrylic. Visitors press their foreheads against it and go quiet, ' +
              'which is the single most convincing argument this park has.' },

      { id: 'talk_hall', x: 12, y: 10, kind: 'talk', name: 'Hall Talk Point',
        pool: 'reef_hall',
        text: 'A spot on the floor marked with tape where keepers stand to answer questions.' },

      { id: 'hall_plaque', x: 20, y: 10, kind: 'sign', name: 'Exhibit Plaque',
        text: 'THE GREAT REEF HALL: 1.4 million litres. Over 3,000 animals from 60 species.\n\n' +
              'Our reef community is a living laboratory for conservation science. Research conducted here ' +
              'directly supports wild reef recovery.\n\n' +
              'No research paper is cited anywhere on the plaque.' },

      { id: 'filter_room', x: 4, y: 16, kind: 'station', name: 'Filtration Room',
        text: 'Sand filters, protein skimmers, and a wall of gauges. This room is why the hall exists.' },

      { id: 'sample_hall', x: 26, y: 16, kind: 'search', name: 'Hall Sump Tap',
        text: 'A sampling tap on the return line.',
        requires: { hasItems: { test_kit: 1 } },
        deniedText: 'A sampling tap on the return line. Useless without a test kit.',
        loot: [{ item: 'water_sample', chance: 1 }] }
    ]
  },

  /* ==========================================================
     REHABILITATION UNIT, gated interior, the turtle story
     ========================================================== */
  turtle_unit: {
    name: 'Rehabilitation Unit',
    subtitle: 'Where the rescues actually are',
    kind: 'interior',
    w: 20, h: 14,
    base: 'floor',
    rects: [
      { t: 'wall',  x: 0,  y: 0,  w: 20, h: 1  },
      { t: 'wall',  x: 0,  y: 13, w: 20, h: 1  },
      { t: 'wall',  x: 0,  y: 0,  w: 1,  h: 14 },
      { t: 'wall',  x: 19, y: 0,  w: 1,  h: 14 },
      { t: 'deck',  x: 2,  y: 2,  w: 9,  h: 7  },
      { t: 'water', x: 4,  y: 4,  w: 5,  h: 3  },
      { t: 'wall',  x: 14, y: 2,  w: 4,  h: 1  },   // records shelf
      { t: 'door',  x: 9,  y: 13, w: 1,  h: 1  }
    ],
    spawns: { entry: { x: 9, y: 12 } },
    exits: [
      { x: 9, y: 13, to: 'coral_kingdom', spawn: 'from_turtle', label: 'Coral Kingdom' }
    ],
    props: [
      { t: 'crate', x: 2, y: 11 }, { t: 'barrel', x: 17, y: 11 },
      { t: 'trolley', x: 13, y: 6 },
      { t: 'pipe', x: 18, y: 6 },
      { t: 'lifering', x: 11, y: 3 },
      { t: 'bench', x: 15, y: 9, text: 'A camp bed. Somebody has been sleeping next to a sick animal.' }
    ],
    objects: [
      { id: 'turtle_pool', x: 6, y: 8, kind: 'animal', name: 'Rehab Pool',
        species: 'green_turtle',
        text: 'A shallow rehab pool with a shade cloth over it.' },

      { id: 'med_records', x: 16, y: 3, kind: 'search', name: 'Medical Records', once: true,
        requires: { qualification: 'rehab_cert' },
        deniedText: 'Clinical records. Reading these without the rehabilitation certificate would be ' +
                    'both unprofessional and extremely obvious.',
        text: 'Kira\'s file. Admission notes, bloods, radiographs.\n\n' +
              'ADMISSION: "Found floating, Seven Mile Beach." SOURCE: hatchery stock, batch 14. ' +
              'RELEASE ASSESSMENT: deferred x6. Latest note, not in Dr Sato\'s handwriting: ' +
              '"Retain: flagship animal for the Open Ocean Wing campaign."',
        effects: [
          { type: 'addEvidence', id: 'ev_turtle_origin' },
          { type: 'addSuspicion', amount: 5 },
          { type: 'toast', text: 'Kira\'s file copied into your Notebook.' }
        ] },

      { id: 'rehab_bench', x: 13, y: 9, kind: 'station', name: 'Treatment Bench',
        text: 'Tubes, scales, a whiteboard of feed weights. Every number on it is written by hand ' +
              'and initialled, the only paperwork in this park that looks honest.' }
    ]
  },

  /* ==========================================================
     SERVICE CORRIDOR, back of house, needs the service key
     ========================================================== */
  service_corridor: {
    name: 'Service Corridor',
    subtitle: 'Behind everything',
    kind: 'interior',
    w: 32, h: 10,
    base: 'floor',
    onArrive: [
      { type: 'achievement', id: 'back_of_house' },
      { type: 'toast', text: 'You are somewhere you would struggle to explain.' }
    ],
    rects: [
      { t: 'wall', x: 0,  y: 0, w: 32, h: 1  },
      { t: 'wall', x: 0,  y: 9, w: 32, h: 1  },
      { t: 'wall', x: 0,  y: 0, w: 1,  h: 10 },
      { t: 'wall', x: 31, y: 0, w: 1,  h: 10 },
      { t: 'wall', x: 6,  y: 3, w: 4,  h: 1  },   // pump housing
      { t: 'wall', x: 20, y: 3, w: 5,  h: 1  },   // records shelving
      { t: 'door', x: 3,  y: 9, w: 1,  h: 1  }
    ],
    spawns: { entry: { x: 3, y: 8 } },
    exits: [
      { x: 3, y: 9, to: 'coral_kingdom', spawn: 'from_service', label: 'Coral Kingdom' }
    ],
    props: [
      { t: 'pipe', x: 12, y: 2 }, { t: 'pipe', x: 14, y: 2 }, { t: 'pipe', x: 16, y: 2 },
      { t: 'pipe', x: 28, y: 2 }, { t: 'pipe', x: 28, y: 6 },
      { t: 'crate', x: 11, y: 7 }, { t: 'crate', x: 12, y: 7 }, { t: 'barrel', x: 18, y: 7 },
      { t: 'trolley', x: 26, y: 7 },
      { t: 'bin', x: 6, y: 7, text: 'A wheelie bin of shredded paper. The shredder is on a timer switch.' }
    ],
    objects: [
      { id: 'pump_room', x: 8, y: 4, kind: 'station', name: 'Pump Room',
        text: 'The pumps that keep every pool in this park alive, in a room nobody has painted since ' +
              'the day it was built.' },

      { id: 'water_logs', x: 22, y: 4, kind: 'search', name: 'Water Quality Logs', once: true,
        text: 'A folder of daily water quality sheets for the whole complex.\n\n' +
              'Six weeks of readings, all within range, all in the same pen, all in the same hand,' +
              'including four days when the pumps were offline for repair.',
        effects: [
          { type: 'addEvidence', id: 'ev_water_falsified' },
          { type: 'addSuspicion', amount: 5 },
          { type: 'toast', text: 'Water quality logs copied into your Notebook.' }
        ] },

      { id: 'studbook', x: 26, y: 4, kind: 'search', name: 'Breeding Studbook', once: true,
        requires: { phase: 'gap' },
        deniedText: 'Two contractors are working on the pump housing four metres away. Not during a shift.',
        text: 'A hardbound studbook, the kind every breeding programme keeps.\n\n' +
              'SEA UNIVERSE: CETACEAN BREEDING RECORD. Fourteen births on site. Four surviving calves ' +
              'currently held. Sire: the same animal, every time.\n\n' +
              'Entry 14 is dated last spring: a fifth calf, female, transferred out at nine months. ' +
              'Destination field: a facility code, not a name.',
        effects: [
          { type: 'addEvidence', id: 'ev_dolphin_studbook' },
          { type: 'addSuspicion', amount: 6 },
          { type: 'toast', text: 'Breeding studbook copied into your Notebook.' }
        ] },

      { id: 'dead_drop', x: 15, y: 8, kind: 'search', name: 'Loose Wall Panel', once: true,
        requires: { evidence: 'ev_dolphin_studbook' },
        deniedText: 'A wall panel with one screw missing. There is a gap behind it, and nothing in it. ' +
                    'Wren told you where this was. She did not say what to put in it.',
        text: 'You fold your copies, slide them into the gap behind the panel, and press it back.\n\n' +
              'It is the least dramatic thing you have ever done and your hands will not stop shaking.',
        effects: [
          { type: 'setFlag', flag: 'dead_drop_left', value: true },
          { type: 'setFlag', flag: 'zone_arctic_unlocked', value: true },
          { type: 'setStoryStage', stage: 4 },
          { type: 'addXP', amount: 70 },
          { type: 'addSkill', skill: 'discretion', amount: 1 },
          { type: 'toast', text: 'Copies left at the drop.' }
        ] }
    ]
  }
};
