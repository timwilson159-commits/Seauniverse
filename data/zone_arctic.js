/* ============================================================
   SEA UNIVERSE, ZONE 3: ARCTIC COVE

   Kept in its own file rather than bolted onto zones.js, which was
   already long. Same shape as everything in there: rectangles painted
   over a base tile, in order.

   Deliberately a little SMALLER than Coral Kingdom (48x34 against
   56x40) and only two interiors against Coral's four. The layout is
   three east-west promenades crossed by one spine, so it loops instead
   of branching into dead ends.

   The cold is this zone's gameplay filter: the Cold Store will not let
   you in without a parka off the rack in the staff block.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.zones = SU.data.zones || {};

SU.data.zones.arctic_cove = {
  name: 'Arctic Cove',
  subtitle: 'Walruses, belugas, and a refrigeration bill nobody wants to discuss',
  num: 3,
  kind: 'region',
  w: 48, h: 34,
  base: 'snow',
  music: null,

  onArrive: [
    { type: 'achievement', id: 'cold_open' },
    { type: 'toast', text: 'Arctic Cove. The air bites, and the plant room never stops humming.' }
  ],

  rects: [
    // outer fence
    { t: 'fence', x: 0,  y: 0,  w: 48, h: 1  },
    { t: 'fence', x: 0,  y: 33, w: 48, h: 1  },
    { t: 'fence', x: 0,  y: 0,  w: 1,  h: 34 },
    { t: 'fence', x: 47, y: 0,  w: 1,  h: 34 },

    // three promenades and the spine that ties them together
    { t: 'path', x: 1,  y: 5,  w: 46, h: 2  },
    { t: 'path', x: 1,  y: 18, w: 46, h: 2  },
    { t: 'path', x: 1,  y: 29, w: 46, h: 2  },
    { t: 'path', x: 22, y: 5,  w: 3,  h: 27 },

    // harp seal ice pen, north strip
    { t: 'ice',       x: 6,  y: 1,  w: 14, h: 4 },
    { t: 'coldwater', x: 9,  y: 2,  w: 8,  h: 2 },

    // walrus haul-out, west
    { t: 'ice',       x: 3,  y: 8,  w: 16, h: 9 },
    { t: 'coldwater', x: 5,  y: 10, w: 12, h: 5 },

    // beluga pool and its viewing deck, east
    { t: 'deck',      x: 28, y: 8,  w: 17, h: 9 },
    { t: 'coldwater', x: 31, y: 10, w: 11, h: 5 },

    // buildings in the southern band
    { t: 'staffwall', x: 3,  y: 21, w: 11, h: 6 },
    { t: 'wall', x: 33, y: 21, w: 12, h: 6 },

    // entry plaza
    { t: 'path', x: 18, y: 31, w: 12, h: 2 },

    // openings, painted last so nothing covers them
    { t: 'door', x: 8,  y: 26, w: 1, h: 1 },
    { t: 'door', x: 38, y: 26, w: 1, h: 1 },
    { t: 'gate', x: 47, y: 18, w: 1, h: 2 },   // east gate back to Coral Kingdom
    { t: 'gate', x: 22, y: 33, w: 2, h: 1 }    // south gate down to Open Ocean (Zone 4)
  ],

  spawns: {
    from_east:  { x: 45, y: 18 },
    from_staff: { x: 8,  y: 27 },
    from_cold:  { x: 38, y: 27 },
    from_south: { x: 22, y: 32 }
  },

  exits: [
    { x: 47, y: 18, w: 1, h: 2, to: 'coral_kingdom', spawn: 'from_west', label: 'Coral Kingdom' },
    { x: 8,  y: 26, to: 'staff_arctic', spawn: 'entry', label: 'Arctic Staff Block' },
    /* Zone 3 → Zone 4. The park branches DOWNWARD here rather than
       stacking further north: Coastal to Coral runs south-to-north,
       Coral to Arctic runs east-to-west, and Arctic to Open Ocean runs
       north-to-south, so the place reads as a park with corners rather
       than a corridor. Opens when the Arctic case is made: the old
       `arctic_case_made` flag is accepted too, so a save from before
       Zone 4 existed is not stranded. */
    {
      x: 22, y: 33, w: 2, h: 1, to: 'open_ocean', spawn: 'from_north', label: 'Open Ocean',
      condition: { any: [{ flags: { zone_ocean_unlocked: true } }, { flags: { arctic_case_made: true } }] },
      lockedText: 'A service gate in the south fence, and beyond it the top of something enormous ' +
                  'and blue. The Open Ocean Wing. Your lanyard does not open this yet, and Wren has ' +
                  'not said the word.'
    },

    {
      x: 38, y: 26, to: 'cold_store', spawn: 'entry', label: 'Cold Store',
      condition: { hasItems: { thermal_parka: 1 } },
      lockedText: 'The Cold Store runs at minus twenty. The door opens, the cold falls out of it, ' +
                  'and something sensible in you says not without a parka.\n\n' +
                  'There is a rack of them in the Arctic staff block, in the corner past the partition.'
    }
  ],

  props: [
    // harp seal pen surrounds
    { t: 'drift', x: 4,  y: 2 }, { t: 'drift', x: 21, y: 3 }, { t: 'drift', x: 5, y: 4 },
    { t: 'iceblock', x: 7, y: 4 }, { t: 'iceblock', x: 18, y: 2 },
    { t: 'spruce', x: 27, y: 3 }, { t: 'spruce', x: 31, y: 2 },
    { t: 'spruce', x: 36, y: 3 }, { t: 'spruce', x: 41, y: 2 }, { t: 'spruce', x: 45, y: 3 },
    { t: 'lamp', x: 26, y: 1 }, { t: 'lamp', x: 44, y: 1 },

    // walrus haul-out
    { t: 'iceblock', x: 4,  y: 9  }, { t: 'iceblock', x: 17, y: 9 },
    { t: 'iceblock', x: 4,  y: 15 }, { t: 'iceblock', x: 17, y: 15 },
    { t: 'rock', x: 3, y: 12 }, { t: 'rock', x: 18, y: 12 },
    { t: 'lifering', x: 8, y: 16 }, { t: 'lifering', x: 14, y: 8 },
    { t: 'barrel', x: 2,  y: 8  }, { t: 'crate', x: 2, y: 16 },
    { t: 'trolley', x: 20, y: 10,
      text: 'A feed trolley, insulated. The crate lid is labelled NUKA in marker, then again in ' +
            'much neater printed letters, as if somebody official redid it.' },
    { t: 'heater', x: 20, y: 14 }, { t: 'cone', x: 19, y: 17 },

    // beluga deck
    { t: 'bench', x: 29, y: 16 }, { t: 'bench', x: 32, y: 16 },
    { t: 'bench', x: 40, y: 16 }, { t: 'bench', x: 43, y: 16 },
    { t: 'heater', x: 30, y: 9  }, { t: 'heater', x: 43, y: 9 },
    { t: 'pillar', x: 28, y: 8  }, { t: 'pillar', x: 44, y: 8 },
    { t: 'buoy', x: 33, y: 9 }, { t: 'buoy', x: 40, y: 15 },
    { t: 'pipe', x: 46, y: 12,
      text: 'Chiller pipework, lagged in silver wrap. Somebody has written a small "sorry" on the ' +
            'insulation in permanent marker, next to a patch of frost that should not be there.' },
    { t: 'crate', x: 46, y: 16 }, { t: 'bin', x: 27, y: 16 },

    // promenades and plaza dressing
    { t: 'drift', x: 2,  y: 20 }, { t: 'drift', x: 46, y: 20 }, { t: 'drift', x: 16, y: 20 },
    { t: 'drift', x: 31, y: 20 }, { t: 'drift', x: 2, y: 28 }, { t: 'drift', x: 46, y: 28 },
    { t: 'lamp', x: 12, y: 20 }, { t: 'lamp', x: 27, y: 20 }, { t: 'lamp', x: 38, y: 20 },
    { t: 'lamp', x: 19, y: 28 }, { t: 'lamp', x: 30, y: 28 },
    { t: 'bench', x: 17, y: 21 }, { t: 'bench', x: 30, y: 21 },
    { t: 'bin', x: 21, y: 20 }, { t: 'bin', x: 26, y: 28 },
    { t: 'heater', x: 20, y: 31 }, { t: 'heater', x: 28, y: 31 },
    { t: 'spruce', x: 17, y: 32 }, { t: 'spruce', x: 30, y: 32 },
    { t: 'planter', x: 19, y: 32 }, { t: 'planter', x: 29, y: 32 },
    { t: 'crate', x: 15, y: 27 }, { t: 'barrel', x: 32, y: 27 },
    { t: 'iceblock', x: 24, y: 32,
      text: 'A carved ice sculpture of a walrus, melting unevenly. A small sign asks guests not to ' +
            'lick it. The sign has been laminated, which suggests it stopped being a joke.' },
    { t: 'cone', x: 14, y: 28 }, { t: 'cone', x: 33, y: 28 },
    { t: 'bush', x: 2, y: 22 }, { t: 'bush', x: 46, y: 22 }
  ],

  objects: [
    /* Sits by the east gate, which is now the way in, so the zone still
       introduces itself to anyone arriving from Coral Kingdom. */
    { id: 'sign_arctic', x: 44, y: 20, kind: 'sign', name: 'Park Sign',
      text: 'ARCTIC COVE. Step into the polar world.\n\n' +
            'Home to Nuka the walrus, our beluga pair, and the harp seals of the Ice Pen. ' +
            'Every animal here is an ambassador for a habitat that is disappearing.\n\n' +
            'Sea Universe offsets 100% of the energy used to keep Arctic Cove cold.' },

    { id: 'walrus_deck', x: 10, y: 16, kind: 'animal', name: 'Walrus Haul-Out',
      species: 'walrus',
      requires: { qualification: 'cold_water_cert' },
      deniedText: 'Nuka is nine hundred kilograms of animal with two tusks. You are not cleared for him yet.' },

    { id: 'beluga_deck', x: 36, y: 17, kind: 'animal', name: 'Beluga Pool',
      species: 'beluga',
      requires: { qualification: 'cold_water_cert' },
      deniedText: 'The beluga pool is cetacean work and cold-water work at once. Not without the certificate.' },

    { id: 'seal_pen', x: 13, y: 5, kind: 'animal', name: 'Ice Pen',
      species: 'harp_seal',
      requires: { qualification: 'pinniped_basic' },
      deniedText: 'Even the friendly end of the park needs Pinniped Handling I.' },

    { id: 'obs_walrus', x: 3, y: 17, kind: 'observe', name: 'Haul-Out Rail',
      species: 'walrus' },

    { id: 'obs_beluga', x: 45, y: 17, kind: 'observe', name: 'Beluga Viewing Rail',
      species: 'beluga' },

    { id: 'talk_arctic', x: 21, y: 19, kind: 'talk', name: 'Ice Talk Point',
      pool: 'arctic_plaza' },

    { id: 'hose_arctic', x: 19, y: 16, kind: 'station', name: 'Melt Hose',
      text: 'A hose for washing down the haul-out apron. In this zone it mostly moves slush around.' },

    { id: 'feed_arctic', x: 34, y: 17, kind: 'station', name: 'Beluga Feed Station',
      text: 'Scales, buckets, and a laminated card of hand signals.' },

    { id: 'kiosk_arctic', x: 27, y: 32, kind: 'shop', name: 'Frostbite Kiosk',
      text: 'Hot chocolate, souvenir snow globes, and, inexplicably, ice cream.',
      sells: ['hot_chocolate', 'energy_bar', 'coffee'] },

    /* The three thermostats for the timed defrost run. Spread to the far
       corners on purpose: the clock is the walk, not the puzzle. */
    { id: 'thermo_north', x: 33, y: 6, kind: 'search', name: 'Thermostat A (North)', once: true,
      text: 'A wall thermostat in a scratched perspex box, nudged four degrees out of range. ' +
            'You put it back and the vent above you changes note almost immediately.',
      effects: [
        { type: 'setFlag', flag: 'thermo_north_set', value: true },
        { type: 'toast', text: 'Thermostat A reset.' }
      ] },

    { id: 'thermo_west', x: 2, y: 19, kind: 'search', name: 'Thermostat B (West)', once: true,
      text: 'The west thermostat, behind a drift nobody has cleared in days. You dig it out with your ' +
            'sleeve pulled over your hand and set it back.',
      effects: [
        { type: 'setFlag', flag: 'thermo_west_set', value: true },
        { type: 'toast', text: 'Thermostat B reset.' }
      ] },

    { id: 'thermo_plaza', x: 31, y: 30, kind: 'search', name: 'Thermostat C (Plaza)', once: true,
      text: 'The plaza thermostat, mounted at guest height, which was always going to end this way. ' +
            'A child watches you reset it with open contempt.',
      effects: [
        { type: 'setFlag', flag: 'thermo_plaza_set', value: true },
        { type: 'toast', text: 'Thermostat C reset. That is the lot.' }
      ] },

    /* The two identifiable "hauntings". The third is the plant log. */
    { id: 'ghost_joint', x: 46, y: 15, kind: 'search', name: 'Expansion Joint', once: true,
      text: 'The moaning is a steel expansion joint behind the beluga deck, flexing as the chiller cycles. ' +
            'It is a deeply unpleasant sound and it is entirely structural.\n\n' +
            'It is also cycling far more often than it should be.',
      effects: [
        { type: 'setFlag', flag: 'ghost_moan', value: true },
        { type: 'toast', text: 'One noise accounted for.' }
      ] },

    { id: 'drift_search', x: 4, y: 18, kind: 'search', name: 'Cleared Drift',
      text: 'You kick through the packed snow at the edge of the promenade.',
      loot: [{ item: 'lost_glove', chance: 0.5 }, { item: 'coffee', chance: 0.5 }] },

    { id: 'script_bin', x: 20, y: 19, kind: 'search', name: 'Recycling Bin', once: true,
      text: 'Half a keeper-talk script, pulped by slush. You can read maybe every third line.',
      effects: [
        { type: 'giveItem', id: 'talk_script' },
        { type: 'toast', text: 'Got: Soggy Talk Script' }
      ] },

    { id: 'plant_log', x: 45, y: 19, kind: 'search', name: 'Plant Room Log', once: true,
      requires: { phase: 'gap' },
      deniedText: 'The plant room log is clipped to the wall in full view of the promenade. Not during a shift.',
      text: 'The refrigeration log, kept by hand because the digital one "kept losing entries".\n\n' +
            'Chiller 2 has been running at 118% duty for eleven weeks. In the margin, in a careful ' +
            'engineer\'s hand: "Told them. Told them again. Logged it. B.T."',
      effects: [
        { type: 'addEvidence', id: 'ev_chiller_overrun' },
        { type: 'addSuspicion', amount: 4 },
        { type: 'toast', text: 'Refrigeration log copied into your Notebook.' }
      ] }
  ]
};

/* ==========================================================
   ARCTIC STAFF BLOCK, the PARK RULE staff block for Zone 3
   ========================================================== */
SU.data.zones.staff_arctic = {
  name: 'Arctic Staff Block',
  subtitle: 'Six kettles and a permanent argument about the heating',
  kind: 'interior',
  staffFor: 'arctic_cove',
  w: 20, h: 14,
  base: 'floor',
  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 20, h: 1  },
    { t: 'wall', x: 0,  y: 13, w: 20, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 14 },
    { t: 'wall', x: 19, y: 0,  w: 1,  h: 14 },
    { t: 'wall', x: 2,  y: 2,  w: 5,  h: 1  },
    { t: 'wall', x: 12, y: 2,  w: 6,  h: 1  },
    { t: 'wall', x: 7,  y: 7,  w: 5,  h: 1  },
    { t: 'door', x: 9,  y: 13, w: 2,  h: 1  }
  ],
  spawns: { entry: { x: 9, y: 12 } },
  exits: [
    { x: 9, y: 13, w: 2, h: 1, to: 'arctic_cove', spawn: 'from_staff', label: 'Arctic Cove' }
  ],
  props: [
    { t: 'crate', x: 2, y: 11 }, { t: 'barrel', x: 17, y: 11 },
    { t: 'bin', x: 17, y: 4 }, { t: 'trolley', x: 15, y: 7 },
    { t: 'heater', x: 3, y: 5,
      text: 'A patio heater dragged indoors. Someone has taped a note to it: ' +
            '"THIS IS NOT A JOKE. THE THERMOSTAT IS BROKEN. LEAVE IT ON."' },
    /* This used to be described as a rack of parkas, four tiles from the
       door, telling the player to take one. It hands out nothing: the
       real Parka Rack object is at 3,3 in the far corner behind the
       partition. Players read this, pressed E, got a paragraph, and
       concluded the parka did not exist. It is now a signpost to the
       real thing instead of a decoy for it. */
    { t: 'bench', x: 6, y: 10,
      text: 'An empty drying rack, still dripping onto the floor. A handwritten sign hangs off it: ' +
            '"PARKAS ARE ON THE RACK IN THE FAR CORNER. TAKE ONE IF YOU ARE GOING IN THE STORE. ' +
            'BRING IT BACK. I MEAN IT. Bo"' }
  ],
  objects: [
    { id: 'transit_arctic', x: 14, y: 3, kind: 'transit', name: 'Transit Terminal',
      text: 'The Arctic terminal. It takes a moment to wake up, like everything in this building.' },

    { id: 'arctic_roster', x: 16, y: 3, kind: 'sign', name: 'Roster Board',
      text: 'ARCTIC ROSTER: Walrus session 1100. Beluga presentation 1330. Ice Pen feeds 0800 & 1700.\n\n' +
            'NOTE FROM PLANT: if you hear the chillers change pitch, TELL SOMEONE. Do not assume it ' +
            'is the building settling. Buildings do not settle at 3kHz. B. Tran' },

    { id: 'parka_rack', x: 3, y: 3, kind: 'search', name: 'Parka Rack', once: true,
      text: 'A rack of enormous insulated parkas, one of them yours if you want it.',
      effects: [
        { type: 'giveItem', id: 'thermal_parka' },
        { type: 'toast', text: 'Got: Thermal Parka' }
      ] },

    { id: 'coffee_arctic', x: 9, y: 8, kind: 'search', name: 'The Good Kettle',
      text: 'Six kettles. Only one works. Everybody knows which one and nobody will say it out loud.',
      loot: [{ item: 'coffee', chance: 1 }] },

    { id: 'ice_bench', x: 3, y: 8, kind: 'station', name: 'Ice Quality Bench',
      text: 'Sample trays and a refractometer. Dr Frost grades the ice here daily, in a notebook, out of ten.' }
  ]
};

/* ==========================================================
   COLD STORE, gated on the parka. Where the paperwork lives.
   ========================================================== */
SU.data.zones.cold_store = {
  name: 'Cold Store',
  subtitle: 'Minus twenty, and the only quiet room in the park',
  kind: 'interior',
  w: 18, h: 12,
  base: 'floor',
  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 18, h: 1  },
    { t: 'wall', x: 0,  y: 11, w: 18, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 12 },
    { t: 'wall', x: 17, y: 0,  w: 1,  h: 12 },
    { t: 'wall', x: 3,  y: 3,  w: 4,  h: 1  },
    { t: 'wall', x: 11, y: 3,  w: 4,  h: 1  },
    { t: 'door', x: 8,  y: 11, w: 2,  h: 1  }
  ],
  spawns: { entry: { x: 8, y: 10 } },
  exits: [
    { x: 8, y: 11, w: 2, h: 1, to: 'arctic_cove', spawn: 'from_cold', label: 'Arctic Cove' }
  ],
  props: [
    { t: 'crate', x: 2, y: 6 }, { t: 'crate', x: 3, y: 6 }, { t: 'crate', x: 2, y: 8 },
    { t: 'crate', x: 15, y: 6 }, { t: 'crate', x: 15, y: 8 },
    { t: 'iceblock', x: 6, y: 8 }, { t: 'iceblock', x: 11, y: 8 },
    { t: 'barrel', x: 15, y: 2 },
    { t: 'pipe', x: 16, y: 5,
      text: 'The chiller feed. Standing next to it you can feel the compressor working far harder ' +
            'than a compressor should have to.' }
  ],
  objects: [
    { id: 'cold_crates', x: 5, y: 5, kind: 'search', name: 'Stacked Crates',
      text: 'Frozen capelin, herring, squid. Everything labelled, weighed and dated. ' +
            'Whatever else is wrong here, the food is not it.',
      loot: [{ item: 'fish_bucket', chance: 1 }] },

    { id: 'transfer_ledger', x: 12, y: 5, kind: 'search', name: 'Transfer Ledger', once: true,
      text: 'A bound ledger on a shelf between two crates, kept in the cold because paper does not ' +
            'rot at minus twenty and nobody comes in here to read.\n\n' +
            'It lists movements. Not of fish.\n\n' +
            '"NUKA (walrus, m, 14y): VALUATION PENDING, hold for OO WING transfer."\n' +
            '"BELUGA PAIR: breeding loan enquiry, declined by Frost x3, escalated."\n\n' +
            'Against each line, in the same hand, a column headed simply ASSET.',
      effects: [
        { type: 'addEvidence', id: 'ev_transfer_ledger' },
        { type: 'setFlag', flag: 'found_ledger', value: true },
        { type: 'addSuspicion', amount: 8 },
        { type: 'addXP', amount: 60, once: 'arctic_ledger' },
        { type: 'toast', text: 'Transfer ledger copied into your Notebook.' }
      ] },

    { id: 'ghost_rack', x: 3, y: 5, kind: 'search', name: 'Racking Ice Fall', once: true,
      text: 'The knocking is ice. It builds on the top rail of the racking, lets go in sheets, ' +
            'and hits the crates below like somebody wanting in.\n\n' +
            'Ice should not be building there at all. Something is running too cold, too hard, too often.',
      effects: [
        { type: 'setFlag', flag: 'ghost_knock', value: true },
        { type: 'toast', text: 'Two noises accounted for.' }
      ] },

    { id: 'frost_objection', x: 8, y: 2, kind: 'sign', name: 'Pinned Objection',
      text: 'A memo pinned to the racking, gone brittle with cold.\n\n' +
            '"I have been asked three times to sign off a breeding loan for the beluga pair. ' +
            'I have declined three times and I will decline a fourth. They are not stock.\n\n' +
            'If this is overruled above me, I want it in writing that I objected. E. Frost"',
      effects: [
        { type: 'addEvidence', id: 'ev_frost_objection' },
        { type: 'toast', text: 'Objection copied into your Notebook.', once: 'frost_obj_copy' }
      ] }
  ]
};
