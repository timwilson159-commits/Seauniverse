/* ============================================================
   SEA UNIVERSE, ZONE 5: THE DEEP

   The last region, the largest map in the park (64x46), and the only
   one that is not a park at all. The Deep is a flooded quarry with a
   channel cut to the sea, bought for the Open Ocean Wing's phase two
   and never finished. It is not on the guest map.

   WHY THE MAP IS SHAPED LIKE THIS
   Every other region is paths and buildings. This one is one enormous
   body of deep water that you cross on floating pontoon walkways, with
   a rim of quarry stone around the edge. Most of the map is not
   walkable, which is the point: the animals here need that volume, and
   the human parts of the site are thin lines laid across it.

   THREE THINGS RUN THROUGH THE WHOLE ZONE

   1. TWELVE HAZARDS. Maintenance is not scenery here. Each `hazard`
      object is a real defect you can log into the Safety Register, and
      THREE of them physically change the map when they are repaired:

        hz_gate_hydraulic  opens the neck to the north holding pen,
                           where the unnamed male orca is
        hz_deck_gap        re-plates the main spine, which is a
                           shortcut rather than a lockout (the quarry
                           benches always get you round)
        hz_stair_condemned opens the grandstand, and therefore the hide

      The barrier props carry `when:{ not:{ hazardRepaired:'...' } }`
      and the plates that replace them carry the opposite. The
      validator flood-fills this map TWICE, before and after repairs,
      so a barrier that walls a player in fails at startup.

   2. NINE NUMBERED PIECES OF GRAFFITI. Each is a liberation message
      signed with one character. Read in number order the sign-offs
      spell the word that opens the hide under the grandstand.

        1 S · 2 A · 3 N · 4 C · 5 T · 6 U · 7 A · 8 R · 9 Y

      LOAD-BEARING: those nine letters exist in TWO places: the `text`
      of the graf_1..graf_9 objects below, and `code:'SANCTUARY'` on
      deep_hatch in the grandstand. Change one, change both. Tags 8 and
      9 sit behind repairs on purpose, so the maintenance thread and
      the puzzle thread feed each other instead of running in parallel.

   3. NOBODY HERE IS COMFORTABLE. The keepers talk about the animals
      and about their own safety in the same breath, because on this
      site those are the same subject.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.zones = SU.data.zones || {};

/* --- new tiles and props ------------------------------------- */
SU.data.tiles.deepwater = { colour: '#0d3550', solid: true,  label: '' };  // the quarry pen, not walkable
SU.data.tiles.quarry    = { colour: '#6e6a60', solid: false, label: '' };  // cut stone rim
SU.data.tiles.pontoon   = { colour: '#8a7f6d', solid: false, label: '' };  // floating walkway
SU.data.tiles.seagrass  = { colour: '#2f6f5f', solid: true,  label: '' };  // Pip's lagoon

SU.data.props.barrier   = { name: 'Barrier',      shape: 'box',  colour: '#d0762f', solid: true  };
SU.data.props.deckplate = { name: 'Deck Plate',   shape: 'box',  colour: '#7d838a', solid: false };
SU.data.props.netpost   = { name: 'Net Post',     shape: 'post', colour: '#5b6068', solid: true  };
SU.data.props.gantry    = { name: 'Gantry Frame', shape: 'post', colour: '#48505a', solid: true  };

SU.data.zones.the_deep = {
  name: 'The Deep',
  subtitle: 'A quarry with the sea let into it, and five animals nobody should have been able to get',
  num: 5,
  kind: 'region',
  w: 64, h: 46,
  base: 'deepwater',
  music: null,

  onArrive: [
    { type: 'achievement', id: 'the_deep_end' },
    { type: 'setStoryStage', stage: 10 },
    { type: 'toast', text: 'The Deep. There is no signage, because there are no guests.' }
  ],

  rects: [
    // outer fence
    { t: 'fence', x: 0,  y: 0,  w: 64, h: 1  },
    { t: 'fence', x: 0,  y: 45, w: 64, h: 1  },
    { t: 'fence', x: 0,  y: 0,  w: 1,  h: 46 },
    { t: 'fence', x: 63, y: 0,  w: 1,  h: 46 },

    /* The quarry rim. Everything not painted after this is deep water. */
    { t: 'quarry', x: 1,  y: 1,  w: 62, h: 6  },   // north apron
    { t: 'quarry', x: 1,  y: 38, w: 62, h: 7  },   // south shore
    { t: 'quarry', x: 1,  y: 7,  w: 4,  h: 31 },   // west bench
    { t: 'quarry', x: 57, y: 7,  w: 6,  h: 31 },   // east bench

    /* The walkway network. One spine, three crosswalks, five platforms
       and a neck out to the holding pen. */
    { t: 'pontoon', x: 30, y: 7,  w: 3,  h: 31 },  // main spine
    { t: 'pontoon', x: 5,  y: 14, w: 52, h: 2  },  // north crosswalk
    { t: 'pontoon', x: 5,  y: 24, w: 52, h: 2  },  // middle crosswalk
    { t: 'pontoon', x: 5,  y: 33, w: 52, h: 2  },  // south crosswalk

    { t: 'pontoon', x: 8,  y: 9,  w: 7,  h: 6  },  // Kessa's platform
    { t: 'pontoon', x: 6,  y: 20, w: 10, h: 6  },  // Halcyon's platform, the big one
    { t: 'pontoon', x: 40, y: 10, w: 8,  h: 5  },  // Kirra's platform
    { t: 'pontoon', x: 44, y: 29, w: 9,  h: 6  },  // Vesper's platform, over the deep hole
    { t: 'pontoon', x: 51, y: 9,  w: 5,  h: 4  },  // the north holding pen
    { t: 'pontoon', x: 52, y: 13, w: 2,  h: 2  },  // ...and the only way onto it

    /* The channel to the sea, cut straight through the east bench.
       It severs the bench, which is intentional: the crosswalks are
       how you get from one half of it to the other. */
    { t: 'deepwater', x: 57, y: 19, w: 6, h: 2 },

    // Pip's seagrass lagoon, cut into the south shore
    { t: 'seagrass', x: 7, y: 40, w: 8, h: 4 },

    /* Buildings. The three on the south shore START AT y=40, not 39,
       so the shore keeps a TWO tile walkway (y38 and y39) along its
       whole length. That is not decoration: y=38 is the only east-west
       route down here, and with a one tile corridor a single lamp post
       cut the map in half. The validator caught it; the fix is the
       second row. */
    { t: 'wall', x: 6,  y: 1,  w: 7,  h: 4 },   // stair head down to the service level
    { t: 'wall', x: 48, y: 1,  w: 9,  h: 5 },   // post-mortem room
    { t: 'wall', x: 20, y: 40, w: 11, h: 5 },   // pump house
    { t: 'wall', x: 34, y: 40, w: 11, h: 5 },   // the unfinished grandstand
    { t: 'staffwall', x: 48, y: 40, w: 9,  h: 5 },   // staff block
    { t: 'wall', x: 58, y: 27, w: 5,  h: 7 },   // sea gate house

    // openings, painted last so nothing covers them
    { t: 'gate', x: 30, y: 0,  w: 2, h: 1 },    // north gate, back up to Open Ocean
    { t: 'door', x: 9,  y: 4,  w: 1, h: 1 },    // stair head
    { t: 'door', x: 52, y: 5,  w: 1, h: 1 },    // post-mortem room
    { t: 'door', x: 25, y: 40, w: 1, h: 1 },    // pump house
    { t: 'door', x: 39, y: 40, w: 1, h: 1 },    // grandstand
    { t: 'door', x: 52, y: 40, w: 1, h: 1 },    // staff block
    { t: 'door', x: 60, y: 27, w: 1, h: 1 }     // gate house
  ],

  spawns: {
    from_north:      { x: 30, y: 2  },
    from_tunnel:     { x: 9,  y: 5  },
    from_necropsy:   { x: 52, y: 6  },
    from_pump:       { x: 25, y: 39 },
    /* One tile further out than the door, on purpose: (39,39) is where
       the CONDEMNED barrier stands, and coming back out of the stand
       onto a tile that is sometimes a solid prop is how you strand a
       player. Landing on y=38 is always safe. */
    from_grandstand: { x: 39, y: 38 },
    from_staff:      { x: 52, y: 39 },
    from_gatehouse:  { x: 60, y: 26 }
  },

  exits: [
    { x: 30, y: 0, w: 2, h: 1, to: 'open_ocean', spawn: 'from_deep', label: 'Open Ocean' },

    { x: 9,  y: 4,  to: 'deep_service',    spawn: 'from_deep', label: 'Service Level' },
    { x: 52, y: 5,  to: 'deep_necropsy',   spawn: 'entry',     label: 'Post-Mortem Room' },
    { x: 25, y: 40, to: 'deep_pump',       spawn: 'entry',     label: 'Pump House' },
    { x: 52, y: 40, to: 'staff_deep',      spawn: 'entry',     label: 'Deep Staff Block' },
    { x: 60, y: 27, to: 'deep_gatehouse',  spawn: 'entry',     label: 'Sea Gate House' },

    /* The grandstand is not locked. It is condemned, and there is a
       barrier across the stair to prove it. Repairing hz_stair_condemned
       removes the barrier; nothing else does. */
    { x: 39, y: 40, to: 'deep_grandstand', spawn: 'entry', label: 'The Grandstand',
      gatedByRepair: 'hz_stair_condemned' }
  ],

  props: [
    /* ---- the three route-changing repairs ----
       Each is a solid barrier that exists until its hazard is repaired,
       and a walkable plate that exists only afterwards. They share
       tiles on purpose: they are the same piece of deck in two states. */
    { t: 'barrier', x: 52, y: 13, when: { not: { hazardRepaired: 'hz_gate_hydraulic' } },
      text: 'The gate to the north holding pen, jammed half shut, with a hydraulic ram weeping ' +
            'fluid down the post. A cable tie holds a printed notice: NOT IN SERVICE. It is dated ' +
            'in March and has been rained on since.' },
    { t: 'barrier',   x: 53, y: 13, when: { not: { hazardRepaired: 'hz_gate_hydraulic' } } },
    { t: 'deckplate', x: 52, y: 13, when: { hazardRepaired: 'hz_gate_hydraulic' } },
    { t: 'deckplate', x: 53, y: 13, when: { hazardRepaired: 'hz_gate_hydraulic' } },

    { t: 'barrier', x: 30, y: 20, when: { not: { hazardRepaired: 'hz_deck_gap' } } },
    { t: 'barrier', x: 31, y: 20, when: { not: { hazardRepaired: 'hz_deck_gap' } },
      text: 'Three deck sections are simply not here. You can see straight down into water that ' +
            'stops being blue about a metre in. Somebody has run a length of orange webbing across ' +
            'it and tied the ends to nothing in particular.' },
    { t: 'barrier',   x: 32, y: 20, when: { not: { hazardRepaired: 'hz_deck_gap' } } },
    { t: 'deckplate', x: 30, y: 20, when: { hazardRepaired: 'hz_deck_gap' } },
    { t: 'deckplate', x: 31, y: 20, when: { hazardRepaired: 'hz_deck_gap' } },
    { t: 'deckplate', x: 32, y: 20, when: { hazardRepaired: 'hz_deck_gap' } },

    /* On y=39, deliberately. The barrier has to close the grandstand
       door on y=40 without closing the shore route on y=38. */
    { t: 'barrier', x: 38, y: 39, when: { not: { hazardRepaired: 'hz_stair_condemned' } } },
    { t: 'barrier', x: 39, y: 39, when: { not: { hazardRepaired: 'hz_stair_condemned' } },
      text: 'A steel barrier bolted across the grandstand stair, and a laminated sheet: STRUCTURE ' +
            'CONDEMNED. NO ACCESS. NO EXCEPTIONS. Underneath, in the same handwriting as everything ' +
            'else on this site: "condemned by who".' },
    { t: 'barrier',   x: 40, y: 39, when: { not: { hazardRepaired: 'hz_stair_condemned' } } },
    { t: 'deckplate', x: 38, y: 39, when: { hazardRepaired: 'hz_stair_condemned' } },
    { t: 'deckplate', x: 39, y: 39, when: { hazardRepaired: 'hz_stair_condemned' } },
    { t: 'deckplate', x: 40, y: 39, when: { hazardRepaired: 'hz_stair_condemned' } },

    /* ---- north apron ---- */
    { t: 'gantry', x: 14, y: 2 }, { t: 'gantry', x: 18, y: 2 },
    { t: 'pallet', x: 3, y: 2 },  { t: 'pallet', x: 3, y: 3 }, { t: 'crate', x: 4, y: 2 },
    { t: 'hoarding', x: 22, y: 1 }, { t: 'hoarding', x: 23, y: 1 }, { t: 'hoarding', x: 24, y: 1 },
    { t: 'cone', x: 26, y: 3 }, { t: 'cone', x: 35, y: 3 },
    { t: 'mast', x: 28, y: 2 }, { t: 'mast', x: 45, y: 2 },
    { t: 'bin',  x: 20, y: 3 }, { t: 'barrel', x: 44, y: 5 }, { t: 'barrel', x: 45, y: 5 },
    { t: 'drift', x: 58, y: 2 }, { t: 'rock', x: 60, y: 4 }, { t: 'rock', x: 61, y: 2 },
    { t: 'crate', x: 46, y: 1 }, { t: 'crate', x: 47, y: 1 },
    { t: 'pipe', x: 13, y: 5,
      text: 'The main return from the pen, coming up out of the rock and running away east. ' +
            'Cold to the touch, and you can feel the pumps beating through it, the same as the ' +
            'one under Open Ocean. Somebody has chalked an arrow and written "STILL OURS".' },

    /* ---- west bench ---- */
    { t: 'rock', x: 1, y: 9 },  { t: 'rock', x: 1, y: 16 }, { t: 'rock', x: 1, y: 27 },
    { t: 'rock', x: 4, y: 8 },  { t: 'rock', x: 1, y: 35 },
    { t: 'netpost', x: 4, y: 13 }, { t: 'netpost', x: 4, y: 23 }, { t: 'netpost', x: 4, y: 31 },
    { t: 'lamp', x: 2, y: 20 }, { t: 'lamp', x: 2, y: 33 },
    { t: 'lifering', x: 3, y: 15 }, { t: 'buoy', x: 4, y: 26 },
    { t: 'barrel', x: 3, y: 36 }, { t: 'crate', x: 2, y: 36 },

    /* ---- east bench ---- */
    { t: 'rock', x: 62, y: 9 }, { t: 'rock', x: 62, y: 16 }, { t: 'rock', x: 62, y: 36 },
    { t: 'netpost', x: 57, y: 11 }, { t: 'netpost', x: 57, y: 30 }, { t: 'netpost', x: 57, y: 36 },
    { t: 'gantry', x: 59, y: 18 }, { t: 'gantry', x: 61, y: 18 },
    { t: 'gantry', x: 59, y: 21 }, { t: 'gantry', x: 61, y: 21 },
    { t: 'lamp', x: 58, y: 12 }, { t: 'lamp', x: 58, y: 35 },
    { t: 'buoy', x: 62, y: 18 }, { t: 'buoy', x: 62, y: 21 },
    { t: 'crate', x: 61, y: 25 }, { t: 'pallet', x: 62, y: 25 },

    /* ---- the walkways ---- */
    { t: 'lifering', x: 30, y: 12 }, { t: 'lifering', x: 32, y: 30 },
    { t: 'lamp', x: 30, y: 9 },  { t: 'lamp', x: 32, y: 17 }, { t: 'lamp', x: 30, y: 28 },
    { t: 'lamp', x: 32, y: 36 }, { t: 'lamp', x: 10, y: 15 }, { t: 'lamp', x: 50, y: 25 },
    { t: 'buoy', x: 20, y: 14 }, { t: 'buoy', x: 27, y: 25 }, { t: 'buoy', x: 39, y: 33 },
    { t: 'trolley', x: 12, y: 24 }, { t: 'trolley', x: 46, y: 15 },
    { t: 'barrel', x: 8, y: 25 },  { t: 'barrel', x: 9, y: 25 },
    { t: 'crate', x: 42, y: 34 },  { t: 'crate', x: 43, y: 34 },
    { t: 'cone', x: 24, y: 15 }, { t: 'cone', x: 25, y: 15 }, { t: 'cone', x: 34, y: 24 },
    { t: 'cone', x: 48, y: 33 }, { t: 'cone', x: 15, y: 33 },
    { t: 'pipe', x: 33, y: 24,
      text: 'A dosing line running out along the crosswalk on brackets, one of which has let go. ' +
            'The line sags into the water and comes back out again. It has clearly been like this ' +
            'long enough for weed to grow on the wet part.' },

    /* ---- south shore ---- */
    { t: 'reed', x: 6, y: 40 }, { t: 'reed', x: 6, y: 42 }, { t: 'reed', x: 15, y: 41 },
    { t: 'reed', x: 15, y: 43 }, { t: 'reed', x: 9, y: 44 }, { t: 'reed', x: 12, y: 44 },
    { t: 'rock', x: 17, y: 41 }, { t: 'rock', x: 18, y: 43 }, { t: 'rock', x: 3, y: 42 },
    { t: 'pallet', x: 32, y: 41 }, { t: 'pallet', x: 32, y: 42 }, { t: 'crate', x: 33, y: 41 },
    { t: 'barrel', x: 46, y: 41 }, { t: 'barrel', x: 46, y: 42 }, { t: 'trolley', x: 47, y: 41 },
    { t: 'mast', x: 33, y: 38 }, { t: 'mast', x: 19, y: 38 },
    { t: 'lamp', x: 47, y: 38 }, { t: 'lamp', x: 27, y: 38 },
    { t: 'bin', x: 51, y: 38 }, { t: 'bench', x: 59, y: 42 }, { t: 'bench', x: 58, y: 41 },
    { t: 'hoarding', x: 60, y: 43 }, { t: 'hoarding', x: 61, y: 43 },
    { t: 'crate', x: 60, y: 40 }, { t: 'pallet', x: 61, y: 40 },
    { t: 'bench', x: 5, y: 38,
      text: 'A bench with a view of the whole pen. Someone has scratched a tally into the arm: ' +
            'eleven marks, then a gap, then four more. There is no key to say what is being counted.' }
  ],

  objects: [
    /* ================= the north apron ================= */
    { id: 'deep_northgate', x: 30, y: 3, kind: 'station', name: 'North Gate Bolts',
      text: 'The gate up to Open Ocean, bolted from this side. Not locked: bolted, by somebody ' +
            'who wanted to be sure nobody wandered down here by accident.\n\n' +
            'From this side it takes about four seconds to undo, which tells you everything about ' +
            'how seriously the restriction is meant, and nothing good about who it was meant to stop.',
      effects: [
        { type: 'setFlag', flag: 'deep_gate_open', value: true },
        { type: 'addXP', amount: 30, once: 'deep_gate' },
        { type: 'toast', text: 'North gate open. You can come and go from Open Ocean now.' }
      ] },

    { id: 'deep_notice', x: 20, y: 5, kind: 'sign', name: 'Site Notice Board',
      text: 'SITE NOTICE. THIS IS A CONSTRUCTION SITE AND NOT A PUBLIC AREA.\n\n' +
            'Below it, a laminated roster with four names on it. Two are crossed out. Beside the ' +
            'crossings, in biro: "left" and "left".\n\n' +
            'Beside that, a taped-up printout headed MINIMUM STAFFING FOR IN-WATER WORK: TWO. ' +
            'Somebody has drawn a box around the word TWO and written nothing at all next to it, ' +
            'which is somehow worse than a comment.' },

    { id: 'deep_prboard', x: 35, y: 5, kind: 'sign', name: 'Phase Two Hoarding',
      text: 'A full-height artist\'s impression, weathered at the corners, left over from the ' +
            'announcement.\n\n' +
            '"THE OPEN OCEAN WING: PHASE TWO. A NATURAL SEA SANCTUARY. Our animals will live in ' +
            'a bay of real ocean water, on real tides, in an environment as close to the wild as ' +
            'human care can make it."\n\n' +
            'The painting shows a curved white bay with three animals in it and a family pointing. ' +
            'You are standing in the actual place. It is a quarry with a hole cut in the side of it.',
      effects: [
        { type: 'addEvidence', id: 'ev_phase_two_claim' },
        { type: 'addXP', amount: 35, once: 'deep_prboard' }
      ] },

    { id: 'graf_1', x: 16, y: 5, kind: 'sign', name: 'Graffiti 1',
      text: 'Spray paint on the hoarding, in a careful hand, high up where it is awkward to reach.\n\n' +
            '"1) THE POOL IS NOT THE OCEAN. NO MATTER HOW BIG YOU BUILD THE POOL.  - S"',
      effects: [
        { type: 'setFlag', flag: 'graf_1', value: true },
        { type: 'addXP', amount: 20, once: 'graf_1' }
      ] },

    /* ================= the west bench ================= */
    { id: 'graf_2', x: 2, y: 11, kind: 'sign', name: 'Graffiti 2',
      text: 'On the quarry face, where the stone is smooth enough to take paint.\n\n' +
            '"2) SHE SANG FOR ELEVEN MONTHS AND NOBODY ANSWERED. THAT IS NOT AN ENCLOSURE, ' +
            'THAT IS A CELL.  - A"',
      effects: [
        { type: 'setFlag', flag: 'graf_2', value: true },
        { type: 'addXP', amount: 20, once: 'graf_2' }
      ] },

    { id: 'hz_handrail', x: 2, y: 18, kind: 'hazard', name: 'Corroded Handrail', severity: 'medium',
      text: 'Twenty metres of handrail along the west bench, above eleven metres of water. ' +
            'The top rail moves when you lean on it. Where the stanchions go into the stone the ' +
            'steel has gone brown and flaky, and one of them you can rock with one hand.\n\n' +
            'This is the side of the pen the night keeper walks, alone, in the dark.',
      logText: 'You write down the stanchion positions, the movement at the top rail, and the fact ' +
               'that this is a lone-working route after dark. Forty seconds. It has been like this ' +
               'for longer than you have worked here.',
      evidence: 'ev_deep_handrail' },

    { id: 'deep_westnotes', x: 2, y: 30, kind: 'search', once: true, name: 'Weighted Folder',
      text: 'A plastic document wallet under a rock at the base of the quarry face, put there by ' +
            'somebody who did not want to carry it back through the gate.\n\n' +
            'Inside: three months of night-shift handover sheets, photocopied. Every one of them ' +
            'is signed by a single name. The line underneath, headed SECOND PERSON PRESENT, is ' +
            'empty on all of them.',
      effects: [
        { type: 'addEvidence', id: 'ev_lone_working' },
        { type: 'addSuspicion', amount: 6 },
        { type: 'addXP', amount: 70, once: 'deep_westnotes' },
        { type: 'toast', text: 'Handover sheets copied into your Notebook.' }
      ] },

    /* ================= Kessa, north-west ================= */
    { id: 'deep_kessa', x: 11, y: 10, kind: 'animal', name: 'Kessa', species: 'false_killer_whale',
      requires: { qualification: 'abyssal_cert' },
      deniedText: 'A large dark dolphin, alone in a pen sized for nine. You are not certified for ' +
                  'large cetacean work and the sign says so twice.' },

    { id: 'board_kessa', x: 14, y: 9, kind: 'sign', name: 'Information Board',
      text: 'FALSE KILLER WHALE (Pseudorca crassidens)\n\n' +
            'One of the largest members of the dolphin family, and not closely related to the orca ' +
            'despite the name. Highly social: groups can stay together for decades.\n\n' +
            'Known for sharing food, both with each other and, occasionally, with human divers.\n\n' +
            'IN OUR CARE: KESSA. Arrived this year.\n\n' +
            'Somebody has stuck a sticky note under the last line. "From where. From WHO."' },

    { id: 'graf_3', x: 9, y: 9, kind: 'sign', name: 'Graffiti 3',
      text: 'On the pontoon decking itself, so you only see it if you look down.\n\n' +
            '"3) FOURTEEN YEARS WITH THE SAME NINE ANIMALS. SIX WEEKS ALONE. WE DID THAT. ' +
            'ON PURPOSE. FOR BALANCE.  - N"',
      effects: [
        { type: 'setFlag', flag: 'graf_3', value: true },
        { type: 'addXP', amount: 20, once: 'graf_3' }
      ] },

    { id: 'obs_kessa', x: 8, y: 14, kind: 'observe', name: 'North Rail', species: 'false_killer_whale',
      text: 'A rail at the north-west corner of the pen. She comes over almost immediately, which ' +
            'is not a good sign and is very hard to feel bad about.' },

    /* ================= Halcyon, the blue whale ================= */
    { id: 'deep_halcyon', x: 10, y: 21, kind: 'animal', name: 'Halcyon', species: 'blue_whale',
      requires: { qualification: 'abyssal_cert' },
      deniedText: 'You get to the rail and stop. There is a scale problem your eyes keep trying to ' +
                  'solve and cannot. You are nowhere near certified for this, and standing here ' +
                  'without a reason is going to get noticed.' },

    { id: 'board_halcyon', x: 15, y: 20, kind: 'sign', name: 'Information Board',
      text: 'BLUE WHALE (Balaenoptera musculus)\n\n' +
            'The largest animal known to have ever lived: up to 30 m and 190 tonnes. Feeds by ' +
            'lunging through krill swarms, taking in more water than its own body volume in a ' +
            'single mouthful, and filtering it through baleen.\n\n' +
            'Calls below 20 Hz, which in open ocean carry for hundreds of kilometres.\n\n' +
            'IN OUR CARE: HALCYON.\n\n' +
            'The board is brand new. It is the only new thing in this entire zone.' },

    { id: 'graf_5', x: 6, y: 22, kind: 'sign', name: 'Graffiti 5',
      text: 'Painted along the edge of the platform where you would stand to look at her, in ' +
            'letters big enough to read from the far bench.\n\n' +
            '"5) NOBODY HAS EVER KEPT ONE. THERE IS A REASON AND YOU ARE STANDING IN IT.  - T"',
      effects: [
        { type: 'setFlag', flag: 'graf_5', value: true },
        { type: 'addXP', amount: 20, once: 'graf_5' }
      ] },

    { id: 'obs_halcyon', x: 7, y: 25, kind: 'observe', name: 'The Long Rail', species: 'blue_whale',
      text: 'Forty metres of rail, and you still cannot see all of her at once from any point on it.' },

    { id: 'hz_mast_down', x: 22, y: 25, kind: 'hazard', name: 'Lighting Mast in the Water', severity: 'medium',
      text: 'A lighting mast has come off its base and gone into the pen. About four metres of it ' +
            'is still above the surface, held up by its own cable, which is still connected.\n\n' +
            'The cable is live. There is a sign on the isolator at the far end saying DO NOT ' +
            'ISOLATE, WORKS LIGHTING, and a different sign on the mast base saying ISOLATED.\n\n' +
            'Two signs, one circuit, and an animal in the water underneath it.',
      logText: 'You photograph both signs, the base, and the cable entry, and write down which sign ' +
               'is on which end. Contradictory isolation labelling is the kind of thing that reads ' +
               'as pedantic right up until somebody is in the water.',
      evidence: 'ev_deep_mast',
      effects: [{ type: 'addSuspicion', amount: 4 }] },

    /* ================= the main spine ================= */
    { id: 'graf_4', x: 32, y: 11, kind: 'sign', name: 'Graffiti 4',
      text: 'Sprayed across three deck boards on the spine, so you walk over it on the way to ' +
            'everything.\n\n' +
            '"4) THEY CALL IT A SANCTUARY IN THE BROCHURE AND A HOLDING FACILITY IN THE ' +
            'PAPERWORK.  - C"',
      effects: [
        { type: 'setFlag', flag: 'graf_4', value: true },
        { type: 'addXP', amount: 20, once: 'graf_4' }
      ] },

    { id: 'hz_deck_gap', x: 31, y: 19, kind: 'hazard', name: 'Missing Deck Sections', severity: 'high',
      text: 'Three sections of the main spine are gone. Not damaged: gone, lifted out, with the ' +
            'fixings still in the frame either side.\n\n' +
            'The gap is a metre and a half across, over the deepest part of the pen, on the only ' +
            'straight route between the north and south halves of the site. There is orange webbing ' +
            'across it, tied at one end to a stanchion and at the other to nothing.\n\n' +
            'A note cable-tied to the webbing says WORK ORDER RAISED. It does not say when.',
      logText: 'You measure the gap, note the missing fixings, and log that the temporary barrier ' +
               'is secured at one end only. Reporting this is what gets the plates put back.',
      evidence: 'ev_deep_deckgap',
      effects: [{ type: 'addXP', amount: 25, once: 'hz_deckgap_bonus' }] },

    { id: 'talk_deep', x: 31, y: 28, kind: 'talk', name: 'Contractors\' Walk-Through', pool: 'deep_pool',
      text: 'A group of six in high-vis with clipboards, being walked round by nobody in particular. ' +
            'One of them turns to you, because you are the only person here in a park polo.' },

    { id: 'hz_lifering', x: 36, y: 15, kind: 'hazard', name: 'Empty Life Ring Station', severity: 'low',
      text: 'A life ring station on the north crosswalk, complete with mounting bracket, throw ' +
            'line reel, inspection tag and a laminated instruction card.\n\n' +
            'There is no life ring in it. The inspection tag has been signed off monthly for seven ' +
            'months, most recently eleven days ago.',
      logText: 'You write down the station number, the empty bracket, and the date on the last ' +
               'inspection signature. Somebody signed to say they checked this eleven days ago.',
      evidence: 'ev_deep_lifering' },

    /* ================= Kirra, the humpback ================= */
    { id: 'deep_kirra', x: 43, y: 11, kind: 'animal', name: 'Kirra', species: 'humpback_whale',
      requires: { qualification: 'abyssal_cert' },
      deniedText: 'She rolls as you arrive and puts one enormous white pectoral fin out of the ' +
                  'water, which is either a greeting or coincidence. You are not certified to work ' +
                  'her and you should not be standing here long enough to decide which.' },

    { id: 'board_kirra', x: 47, y: 10, kind: 'sign', name: 'Information Board',
      text: 'HUMPBACK WHALE (Megaptera novaeangliae)\n\n' +
            'Migrates up to 8,000 km each way between polar feeding grounds and tropical breeding ' +
            'grounds. The east Australian population passes this coast every winter.\n\n' +
            'Males sing long structured songs that change every season, with the whole population ' +
            'adopting each new version.\n\n' +
            'IN OUR CARE: KIRRA.\n\n' +
            'What the board does not say, and what everybody in this park knows, is that the east ' +
            'Australian population went from about two hundred animals to over thirty thousand ' +
            'without a single one of them being put in a tank.' },

    { id: 'obs_kirra', x: 41, y: 14, kind: 'observe', name: 'East Rail', species: 'humpback_whale',
      text: 'You can hear her from here when she surfaces. It is the loudest sound on the site ' +
            'apart from the pumps.' },

    /* ================= the north holding pen (behind hz_gate_hydraulic) ================= */
    { id: 'hz_gate_hydraulic', x: 53, y: 15, kind: 'hazard', name: 'Failed Gate Hydraulics', severity: 'high',
      text: 'The personnel gate onto the north holding pen. The ram has failed, the gate sits half ' +
            'shut, and there is hydraulic fluid down the post and a slick of it on the deck.\n\n' +
            'Two things about that. It is a slip hazard on a walkway over deep water. And a gate ' +
            'that cannot be operated is a gate that cannot be opened in a hurry, on the one pen on ' +
            'this site with no second access.\n\n' +
            'The NOT IN SERVICE notice is dated in March.',
      logText: 'You log the failed ram, the fluid on the deck, and the point that matters: this pen ' +
               'has one way in and out and it does not work. That gets a fitter down here.',
      evidence: 'ev_deep_gate',
      effects: [{ type: 'addSuspicion', amount: 5 }] },

    { id: 'deep_acquisition', x: 53, y: 10, kind: 'animal', name: 'Stock 41-B', species: 'orca',
      gatedByRepair: 'hz_gate_hydraulic',
      text: 'A young male orca. No name board. No name anywhere.' },

    { id: 'graf_8', x: 54, y: 11, kind: 'sign', name: 'Graffiti 8',
      gatedByRepair: 'hz_gate_hydraulic',
      text: 'Inside the holding pen, on the gate frame, where you could only read it if you had ' +
            'got the gate open. Which nobody has since March.\n\n' +
            '"8) THEY GAVE HIM A NUMBER SO THEY WOULD NOT HAVE TO SAY HIS NAME OUT LOUD IN A ' +
            'MEETING.  - R"',
      effects: [
        { type: 'setFlag', flag: 'graf_8', value: true },
        { type: 'addXP', amount: 20, once: 'graf_8' }
      ] },

    { id: 'deep_stocksheet', x: 51, y: 12, kind: 'search', once: true, name: 'Clipboard on the Gate',
      gatedByRepair: 'hz_gate_hydraulic',
      text: 'A clipboard hanging inside the pen gate, out of the weather, filled in daily in three ' +
            'different hands.\n\n' +
            'Every entry identifies him as 41-B. Every entry. Feed, behaviour, respiration, all of ' +
            'it, for eight days, and not once a name.\n\n' +
            'The top sheet has an arrival line: transferred in, and a facility code. You have seen ' +
            'that code before, in the movements folder under the plaza in Open Ocean. It is not a ' +
            'rescue centre.',
      effects: [
        { type: 'addEvidence', id: 'ev_stock_41b' },
        { type: 'setFlag', flag: 'found_41b', value: true },
        { type: 'addSuspicion', amount: 8 },
        { type: 'addXP', amount: 90, once: 'deep_stocksheet' },
        { type: 'toast', text: 'Stock sheet copied into your Notebook.' }
      ] },

    /* ================= Vesper, the sperm whale ================= */
    { id: 'deep_vesper', x: 48, y: 30, kind: 'animal', name: 'Vesper', species: 'sperm_whale',
      requires: { qualification: 'abyssal_cert' },
      deniedText: 'The water here is darker than the rest of the pen, because this is where the ' +
                  'quarry went deepest. She is somewhere in it. You are not certified for this.' },

    { id: 'board_vesper', x: 52, y: 29, kind: 'sign', name: 'Information Board',
      text: 'SPERM WHALE (Physeter macrocephalus)\n\n' +
            'The largest toothed predator on earth, with the largest brain of any animal that has ' +
            'ever lived. Hunts squid at depth: dives past 1,000 m are routine and can last over ' +
            'an hour.\n\n' +
            'Echolocation clicks are the loudest sound produced by any animal.\n\n' +
            'IN OUR CARE: VESPER.\n\n' +
            'Under the board, on a separate plate: DEPTH AT THIS POINT: 11 M. It is there for ' +
            'diving safety. Read the two together and the board argues with itself.' },

    { id: 'graf_7', x: 45, y: 29, kind: 'sign', name: 'Graffiti 7',
      text: 'On the platform over the deepest water, painted the same night as the others.\n\n' +
            '"7) A THOUSAND METRES DOWN IS WHERE SHE LIVES. YOU GAVE HER ELEVEN AND CALLED IT ' +
            'A HABITAT.  - A"',
      effects: [
        { type: 'setFlag', flag: 'graf_7', value: true },
        { type: 'addXP', amount: 20, once: 'graf_7' }
      ] },

    /* One of Toby's three night-shift stations. All three are gated on
       the quest being active so they are invisible as busywork the rest
       of the time, and none of them can fail: a player who runs out of
       time still completes the quest, they just miss the bonus. */
    { id: 'night_hole', x: 50, y: 34, kind: 'station', name: 'Deep Hole Sounding Line',
      requires: { quest: { q_deep_nightshift: 'active' } },
      deniedText: 'A weighted sounding line coiled on a cleat, for checking the water level against ' +
                  'the sill by hand when the instruments are not talking to anybody. Not needed today.',
      text: 'You drop the line and read it off in the dark with the head torch in your teeth.\n\n' +
            'Thirty-eight centimetres down, and the sill on this side is showing about a hand\'s width ' +
            'of wet rock. Vesper is well clear of it, hanging in the middle of the hole and entirely ' +
            'unbothered, which is more than you are.\n\n' +
            'You write the number and the time on the back of your hand, because that is what there is.',
      effects: [
        { type: 'setFlag', flag: 'night_hole_done', value: true },
        { type: 'addXP', amount: 30, once: 'night_hole' }
      ] },

    { id: 'obs_vesper', x: 46, y: 34, kind: 'observe', name: 'Deep Hole Rail', species: 'sperm_whale',
      text: 'The rail over the deepest part of the quarry. She goes down, and you lose her almost ' +
            'immediately, and then she is back. It takes about nine seconds.' },

    /* ================= the sea gate and the east bench ================= */
    { id: 'hz_gate_signage', x: 58, y: 17, kind: 'hazard', name: 'Unmarked Sea Gate Approach', severity: 'low',
      text: 'The walkway runs straight up to the channel and stops. No barrier, no marking, no ' +
            'sign, and at night no light, on the edge of a six metre cut with a tidal flow through it.\n\n' +
            'There is a bracket where a sign used to be.',
      logText: 'You write down the missing edge protection, the missing sign, and the missing light. ' +
               'Three separate omissions on the same four metres of walkway.',
      evidence: null },

    { id: 'deep_seagate', x: 57, y: 18, kind: 'station', name: 'The Sea Gate',
      text: 'The channel. Six metres across, cut through the quarry wall to the open water, with ' +
            'the tide moving through it, and a sluice gate sitting in it that is taller than the ' +
            'grandstand.\n\n' +
            'It is the reason this site exists: the pen fills and empties on the tide, which is what ' +
            'lets the brochure use the phrase "real ocean water".\n\n' +
            'It is also, if you stand here long enough to think about it, a door. It is a very large ' +
            'door, between five animals and the entire Pacific, and it is operated from a building ' +
            'thirty metres from where you are standing.',
      effects: [
        { type: 'setFlag', flag: 'saw_sea_gate', value: true },
        { type: 'addXP', amount: 40, once: 'deep_seagate' }
      ] },

    { id: 'hz_net_repair', x: 57, y: 21, kind: 'hazard', name: 'Perimeter Net Repair', severity: 'high',
      text: 'The net across the channel, which is the only thing between the pen and the open sea, ' +
            'and the only thing keeping anything larger than a fish from coming the other way.\n\n' +
            'There is a repair in it about three metres square. The original net is a heavy braided ' +
            'rope at roughly 200 mm mesh. The repair is a lighter rope at a visibly wider mesh, ' +
            'laced in with cable ties.\n\n' +
            'Cable ties. On the sea boundary. Of an enclosure holding a blue whale.',
      logText: 'You photograph the repair against the original net so the difference in gauge and ' +
               'mesh is obvious in one frame, and log the cable ties. This one you would report ' +
               'even if you worked for them honestly.',
      evidence: 'ev_deep_net',
      effects: [{ type: 'addSuspicion', amount: 5 }] },

    { id: 'graf_6', x: 20, y: 33, kind: 'sign', name: 'Graffiti 6',
      text: 'On the south crosswalk, near the middle, where the light from the shore does not reach.\n\n' +
            '"6) EVERY PERSON WHO WORKS HERE KNOWS. ASK ANY OF THEM AFTER SIX. ' +
            'ASK THEM WHAT THEY WOULD DO IF THEY COULD AFFORD TO.  - U"',
      effects: [
        { type: 'setFlag', flag: 'graf_6', value: true },
        { type: 'addXP', amount: 20, once: 'graf_6' }
      ] },

    { id: 'hz_walkway_lights', x: 18, y: 34, kind: 'hazard', name: 'Walkway Lighting Out', severity: 'medium',
      text: 'Eleven of the fourteen lights on the south crosswalk are out. Not flickering: out. ' +
            'The three that work are all at the shore end, which means the dark part starts exactly ' +
            'where the walkway gets furthest from anywhere you could climb out.\n\n' +
            'The night keeper walks this route twice a shift with a head torch he bought himself.',
      logText: 'You count the failed fittings, note where the working ones stop, and log that this ' +
               'is a lone-working route after dark. The counting is what makes it a finding rather ' +
               'than a complaint.',
      evidence: 'ev_deep_lighting' },

    /* ================= the south shore ================= */
    { id: 'hz_stair_condemned', x: 42, y: 38, kind: 'hazard', name: 'Condemned Grandstand Stair', severity: 'high',
      text: 'The grandstand was poured, seated, roofed and then stopped. The access stair is ' +
            'barriered off with a CONDEMNED sheet on it.\n\n' +
            'Look at the stair. The concrete is sound, the treads are true, the handrail is bolted ' +
            'through. There is nothing structurally wrong with it that you can see, and you have ' +
            'now spent two weeks looking at things on this site that genuinely are wrong.\n\n' +
            'A structure gets condemned by a named engineer in a dated report. Ask for the report.',
      logText: 'You log it, and you log it carefully: not "the stair is unsafe" but "the stair is ' +
               'marked condemned with no report reference, no engineer named and no date". Those ' +
               'are two completely different findings and only one of them can be waved away.',
      evidence: 'ev_deep_condemned' },

    { id: 'deep_pip', x: 10, y: 39, kind: 'animal', name: 'Pip', species: 'dugong',
      requires: { qualification: 'sirenian_cert' },
      deniedText: 'A dugong, in a shallow lagoon cut into the shore, moving very slowly along the ' +
                  'bottom. You need the sirenian certificate before anybody will let you work her, ' +
                  'and for once that is a reasonable rule reasonably applied.' },

    { id: 'board_pip', x: 7, y: 39, kind: 'sign', name: 'Information Board',
      text: 'DUGONG (Dugong dugon)\n\n' +
            'The only strictly herbivorous marine mammal. Grazes seagrass, leaving visible feeding ' +
            'trails. Its closest living relatives are elephants.\n\n' +
            'Australia holds the largest dugong populations in the world.\n\n' +
            'IN OUR CARE: PIP. Rescued as an orphaned calf at four months and hand raised here.\n\n' +
            'This board is the only one in the zone that is telling the whole truth, and it is ' +
            'worth noticing which animal it belongs to.' },

    { id: 'obs_pip', x: 14, y: 39, kind: 'observe', name: 'Lagoon Rail', species: 'dugong',
      text: 'The lagoon is clear enough to see the bottom. There are grazing trails through the ' +
            'seagrass, which means it is real seagrass, which means somebody here is still trying.' },

    { id: 'deep_slipway', x: 55, y: 38, kind: 'sign', name: 'The Slipway',
      text: 'A concrete slipway running down into the pen, wide enough to take a transport cradle, ' +
            'with rails set into it and a winch head at the top.\n\n' +
            'This is how an animal arrives here, and it is how one would leave. There is one set of ' +
            'fresh scrape marks on it, eight days old by the weather on them, going down.\n\n' +
            'None going up.' },

    /* ================= the pump house door yard ================= */
    { id: 'deep_workorders', x: 29, y: 38, kind: 'search', once: true, name: 'Work Order Spike',
      text: 'A steel spike outside the pump house with paper jammed onto it, the way workshops have ' +
            'done it for a hundred years.\n\n' +
            'Forty-one work orders. You go through them. Nine are marked complete. The rest are ' +
            'raised, signed, costed, and then have a second stamp across them:\n\n' +
            'DEFERRED: CAPITAL HOLD PENDING PHASE TWO.\n\n' +
            'The oldest deferred one is fourteen months old. It is for the perimeter net.',
      effects: [
        { type: 'addEvidence', id: 'ev_deferred_orders' },
        { type: 'setFlag', flag: 'found_workorders', value: true },
        { type: 'addSuspicion', amount: 7 },
        { type: 'addXP', amount: 85, once: 'deep_workorders' },
        { type: 'toast', text: 'Deferred work orders copied into your Notebook.' }
      ] }
  ]
};

/* ============================================================
   INTERIORS
   ============================================================ */

SU.data.zones.staff_deep = {
  name: 'Deep Staff Block',
  subtitle: 'A portable building on blocks, with a kettle and a lot of unread email',
  kind: 'interior',
  staffFor: 'the_deep',
  w: 18, h: 12,
  base: 'floor',
  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 18, h: 1  },
    { t: 'wall', x: 0,  y: 11, w: 18, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 12 },
    { t: 'wall', x: 17, y: 0,  w: 1,  h: 12 },
    { t: 'wall', x: 11, y: 1,  w: 1,  h: 5  },
    /* Top wall: the door in The Deep is entered moving DOWN. */
    { t: 'door', x: 9,  y: 0,  w: 1,  h: 1  }
  ],
  spawns: { entry: { x: 9, y: 1 } },
  exits: [{ x: 9, y: 0, to: 'the_deep', spawn: 'from_staff', label: 'Out to the pen' }],
  props: [
    { t: 'bench', x: 2, y: 8 }, { t: 'bench', x: 5, y: 8 }, { t: 'bin', x: 1, y: 10 },
    { t: 'crate', x: 15, y: 9 }, { t: 'crate', x: 16, y: 9 }, { t: 'trolley', x: 14, y: 2 },
    { t: 'pipe', x: 16, y: 1 },
    { t: 'bench', x: 7, y: 2,
      text: 'A kitchen bench with a kettle, a jar of instant coffee and a mug tree with four mugs ' +
            'on it. Two of the mugs have names on the underside. The other two used to.' }
  ],
  objects: [
    { id: 'deep_transit', x: 3, y: 2, kind: 'transit', name: 'Staff Transit Terminal',
      text: 'A transit terminal, bolted to the wall of a portable building, in a part of the park ' +
            'that officially does not have staff.' },

    { id: 'deep_roster', x: 6, y: 2, kind: 'sign', name: 'Shift Roster',
      text: 'The roster for the fortnight.\n\n' +
            'Days: two names. Nights: one name. Every night. Fourteen out of fourteen.\n\n' +
            'Pinned beside it, the park\'s own In-Water and Waterside Working procedure, section 4: ' +
            '"No person shall undertake waterside duties at a deep-water facility without a second ' +
            'competent person present."\n\n' +
            'Both documents are current. Both are on the same wall. Nobody has taken either of ' +
            'them down.',
      effects: [
        { type: 'addEvidence', id: 'ev_roster_vs_policy' },
        { type: 'addXP', amount: 50, once: 'deep_roster' }
      ] },

    { id: 'hz_first_aid', x: 15, y: 2, kind: 'hazard', name: 'First Aid Point', severity: 'low',
      text: 'A first aid cabinet, an eyewash station and an oxygen kit, all correctly signed and ' +
            'all in the right place.\n\n' +
            'The cabinet is missing its burn dressings and both large sterile pads. The eyewash ' +
            'bottles expired last year. The oxygen cylinder gauge reads in the red.\n\n' +
            'The nearest ambulance access is the far side of the site, through a gate that is ' +
            'bolted.',
      logText: 'You list the three deficiencies and add the access note, because the access note is ' +
               'the one that turns a stationery problem into a survivable-or-not problem.',
      evidence: 'ev_deep_firstaid' },

    { id: 'deep_vending', x: 13, y: 8, kind: 'shop', name: 'Mess Cupboard',
      text: 'An honesty box, a jar of coffee, and a box of the cereal bars the park hands out at ' +
            'inductions. Prices written on a sticky note.',
      sells: ['coffee', 'energy_bar', 'head_torch'] },

    { id: 'deep_locker', x: 2, y: 5, kind: 'search', once: true, name: 'Cleared Locker',
      text: 'A locker with the padlock cut off and the name label scraped at until it came away.\n\n' +
            'Inside: a dry bag, a spare head torch with no batteries, and an unposted resignation ' +
            'letter with no date and no name on it.\n\n' +
            'It is four lines long. Three of them are about the animals. The fourth is: ' +
            '"I am not going in that water on my own again."',
      loot: [{ item: 'head_torch', chance: 1 }],
      effects: [
        { type: 'addEvidence', id: 'ev_resignation' },
        { type: 'addXP', amount: 60, once: 'deep_locker' }
      ] }
  ]
};

SU.data.zones.deep_pump = {
  name: 'Pump House',
  subtitle: 'The only building on this site that is doing its job properly',
  kind: 'interior',
  w: 20, h: 14,
  base: 'steel',
  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 20, h: 1  },
    { t: 'wall', x: 0,  y: 13, w: 20, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 14 },
    { t: 'wall', x: 19, y: 0,  w: 1,  h: 14 },
    { t: 'wall', x: 5,  y: 5,  w: 4,  h: 1  },
    { t: 'wall', x: 13, y: 5,  w: 4,  h: 1  },
    /* Top wall: the door in The Deep is entered moving DOWN. */
    { t: 'door', x: 9,  y: 0,  w: 1,  h: 1  }
  ],
  spawns: { entry: { x: 9, y: 1 } },
  exits: [{ x: 9, y: 0, to: 'the_deep', spawn: 'from_pump', label: 'Out to the shore' }],
  props: [
    { t: 'pipe', x: 1, y: 2 }, { t: 'pipe', x: 1, y: 3 }, { t: 'pipe', x: 1, y: 9 },
    { t: 'pipe', x: 18, y: 2 }, { t: 'pipe', x: 18, y: 9 }, { t: 'pipe', x: 18, y: 10 },
    { t: 'barrel', x: 3, y: 11 }, { t: 'barrel', x: 4, y: 11 }, { t: 'crate', x: 16, y: 11 },
    { t: 'gantry', x: 10, y: 8 }, { t: 'trolley', x: 6, y: 9 }
  ],
  objects: [
    { id: 'deep_plant', x: 3, y: 2, kind: 'station', name: 'Tidal Exchange Plant',
      text: 'Sluice controls, screening, and the exchange pumps that move a quarry full of seawater ' +
            'twice a day.\n\n' +
            'It is spotless. The log book is written up in a small neat hand, twice a shift, going ' +
            'back four years without a gap. Whoever runs this room is the best employee in this ' +
            'park and nobody outside this building knows their name.' },

    { id: 'hz_alarm_muted', x: 15, y: 2, kind: 'hazard', name: 'Muted Alarm Panel', severity: 'high',
      text: 'The plant alarm panel. Level, flow, dissolved oxygen, chiller, and a mute button with ' +
            'a small red light beside it.\n\n' +
            'The light is on. The panel has been muted since 14 March. The event list behind it ' +
            'has 3,100 entries.\n\n' +
            'A sticky note on the frame, in the same neat hand as the log book: "MUTED ON ' +
            'INSTRUCTION. RAISED 3x. I AM NOT TURNING THIS BACK ON WITHOUT IT IN WRITING."',
      logText: 'You log the mute date, the event count, and the note, and you photograph all three ' +
               'together. The note is the important part: this is not neglect, it is somebody being ' +
               'overruled and leaving a record of it where the next person would find it.',
      evidence: 'ev_deep_alarm',
      effects: [
        { type: 'addSuspicion', amount: 6 },
        { type: 'addXP', amount: 30, once: 'hz_alarm_bonus' }
      ] },

    { id: 'night_pump', x: 3, y: 10, kind: 'station', name: 'Exchange Pump Reset',
      requires: { quest: { q_deep_nightshift: 'active' } },
      deniedText: 'The reset for the exchange pumps. Both are running. Leave it alone.',
      text: 'Number two pump has tripped, exactly as Toby said it would, and because the panel is ' +
            'muted it has been sitting there tripped for nobody knows how long.\n\n' +
            'The reset is not complicated. Isolate, wait for the run light to drop out, re-energise, ' +
            'and hold the start until the flow comes up on the gauge.\n\n' +
            'It takes ninety seconds and it is the single most important thing anybody will do on ' +
            'this site tonight.',
      effects: [
        { type: 'setFlag', flag: 'night_pump_done', value: true },
        { type: 'addXP', amount: 30, once: 'night_pump' }
      ] },

    { id: 'deep_pumplog', x: 15, y: 10, kind: 'search', once: true, name: 'Plant Log Book',
      text: 'Four years of readings in one handwriting, twice a shift, no gaps.\n\n' +
            'From 14 March the entries carry on exactly as before, with one addition. At the bottom ' +
            'of every single shift, underlined: "ALARM PANEL REMAINS MUTED ON INSTRUCTION."\n\n' +
            'A hundred and forty times. In the same pen. Every shift since March.\n\n' +
            'That is not a log book. That is somebody building a case, one line a day, in case ' +
            'anybody ever came and asked.',
      effects: [
        { type: 'addEvidence', id: 'ev_deep_plantlog' },
        { type: 'setFlag', flag: 'found_plantlog', value: true },
        { type: 'addXP', amount: 95, once: 'deep_pumplog' },
        { type: 'toast', text: 'Plant log copied into your Notebook.' }
      ] }
  ]
};

SU.data.zones.deep_grandstand = {
  name: 'The Grandstand',
  subtitle: 'Four thousand seats facing a pen that was never going to be a show pool',
  kind: 'interior',
  w: 26, h: 16,
  base: 'terrace',
  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 26, h: 1  },
    { t: 'wall', x: 0,  y: 15, w: 26, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 16 },
    { t: 'wall', x: 25, y: 0,  w: 1,  h: 16 },
    { t: 'wall', x: 4,  y: 4,  w: 18, h: 1  },
    { t: 'wall', x: 4,  y: 4,  w: 1,  h: 6  },
    { t: 'wall', x: 21, y: 4,  w: 1,  h: 6  },
    /* Top wall: the condemned stair in The Deep is walked DOWN. */
    { t: 'door', x: 12, y: 0,  w: 1,  h: 1  },
    { t: 'door', x: 13, y: 4,  w: 1,  h: 1  }
  ],
  /* `from_hide` sits ABOVE the hatch, not below it. You go down into the
     hide, so you come back up out of it, and landing on the far side of
     the doorway from the one you left by would walk you straight back in
     if you were still holding the key. */
  spawns: { entry: { x: 12, y: 1 }, from_hide: { x: 13, y: 3 } },
  exits: [
    { x: 12, y: 0, to: 'the_deep', spawn: 'from_grandstand', label: 'Out to the shore' },
    {
      x: 13, y: 4, to: 'deep_hide', spawn: 'entry', label: 'Under the Stand',
      condition: { flags: { hide_open: true } },
      lockedText: 'A plant room door under the back of the stand, with a lock on it that does not ' +
                  'match anything else on this site. It is new, it is good, and it was not fitted ' +
                  'by the park.'
    }
  ],
  props: [
    { t: 'pillar', x: 2, y: 7 }, { t: 'pillar', x: 2, y: 12 },
    { t: 'pillar', x: 23, y: 7 }, { t: 'pillar', x: 23, y: 12 },
    { t: 'crate', x: 6, y: 13 }, { t: 'crate', x: 7, y: 13 }, { t: 'pallet', x: 8, y: 13 },
    { t: 'barrel', x: 18, y: 13 }, { t: 'cone', x: 10, y: 12 }, { t: 'cone', x: 15, y: 12 },
    { t: 'bench', x: 5, y: 10 }, { t: 'bench', x: 20, y: 10 },
    { t: 'bench', x: 12, y: 12,
      text: 'Row A, seat 1. Somebody has sat here, more than once: the dust is worn off it and ' +
            'there is a ring from a cup. From here you can see the whole pen through the opening, ' +
            'including the north holding pen, which you cannot see from anywhere else on the site.' }
  ],
  objects: [
    { id: 'stand_seats', x: 8, y: 9, kind: 'sign', name: 'The Seating',
      text: 'Four thousand seats, poured, bolted and never sat in. There is a laminated seating plan ' +
            'zip-tied to the rail with sections marked in four colours and a price against each.\n\n' +
            'PREMIUM SPLASH ZONE. FAMILY TERRACE. Behind them, in the smallest text on the sheet, ' +
            'the sections marked STAFF and PRESS.\n\n' +
            'The pen this stand faces has no show equipment in it of any kind. Whatever this was ' +
            'built for, it was not built for what is out there now.' },

    { id: 'graf_9', x: 19, y: 9, kind: 'sign', name: 'Graffiti 9',
      text: 'On the back wall of the stand, above the last row, where nobody could see it from ' +
            'outside and nobody could reach it without the stair.\n\n' +
            'This one is bigger than the others, and it is the only one that is not addressed to ' +
            'the park.\n\n' +
            '"9) IF YOU GOT THIS FAR YOU ARE ONE OF US. TAKE THEM TO SOMEONE WHO CAN PRINT IT.  - Y"',
      effects: [
        { type: 'setFlag', flag: 'graf_9', value: true },
        { type: 'addXP', amount: 20, once: 'graf_9' }
      ] },

    { id: 'deep_hatch', x: 13, y: 6, kind: 'keypad', name: 'Plant Room Door', mode: 'letters',
      code: 'SANCTUARY', hintAfter: 3,
      text: 'A good lock on a bad door, in a condemned building, in a part of the park with no ' +
            'guests. Nine positions on the dial.',
      clue: [
        'The tags are numbered. Nobody numbers graffiti.',
        'Nine of them, one to nine, spread across a site you are not supposed to be on.',
        'Each one is signed off with a single letter, and no two are the same letter.',
        'Somebody once said of the tagger: "he cannot even sign the same name twice."',
        'He signs the same name every time. He just does it nine pieces at a time.'
      ],
      hint: 'Read the sign-offs in number order, one to nine. Not the messages. The letters after ' +
            'the dash. Two of the tags are behind things that are broken, which is not a coincidence.',
      solvedText: 'The lock opens. Of course that is the word.',
      effects: [
        { type: 'setFlag', flag: 'hide_open', value: true },
        { type: 'achievement', id: 'the_word' },
        { type: 'addXP', amount: 180 },
        { type: 'addSkill', skill: 'observation', amount: 1 },
        { type: 'toast', text: 'The plant room door is open.' }
      ] },

    { id: 'stand_crate', x: 5, y: 13, kind: 'search', name: 'Contractor\'s Crate',
      text: 'A crate of leftovers from the fit-out: cable ties, marker pens, a roll of gaffer tape ' +
            'and half a box of spray cans.\n\n' +
            'The spray cans are the same brand as everything painted on this site.',
      loot: [{ item: 'sea_glass', chance: 0.25 }, { item: 'coffee', chance: 0.4 }] }
  ]
};

SU.data.zones.deep_hide = {
  name: 'Under the Stand',
  subtitle: 'Somebody has been working down here for a long time',
  kind: 'interior',
  w: 14, h: 10,
  base: 'steel',
  rects: [
    { t: 'wall', x: 0,  y: 0, w: 14, h: 1  },
    { t: 'wall', x: 0,  y: 9, w: 14, h: 1  },
    { t: 'wall', x: 0,  y: 0, w: 1,  h: 10 },
    { t: 'wall', x: 13, y: 0, w: 1,  h: 10 },
    /* Top wall: the hatch in the stand is dropped through, moving DOWN. */
    { t: 'door', x: 7,  y: 0, w: 1,  h: 1  }
  ],
  spawns: { entry: { x: 7, y: 1 } },
  exits: [{ x: 7, y: 0, to: 'deep_grandstand', spawn: 'from_hide', label: 'Back up into the stand' }],
  props: [
    { t: 'crate', x: 1, y: 7 }, { t: 'crate', x: 2, y: 7 }, { t: 'pallet', x: 12, y: 7 },
    { t: 'pipe', x: 1, y: 2 }, { t: 'pipe', x: 12, y: 2 }, { t: 'bin', x: 11, y: 8 },
    { t: 'bench', x: 4, y: 7,
      text: 'A camp bed, folded. A primus. A crate of tinned food with about three weeks left in ' +
            'it. Somebody is not just visiting.' }
  ],
  objects: [
    { id: 'hide_wall', x: 4, y: 2, kind: 'sign', name: 'The Wall',
      text: 'The whole back wall, covered, and organised the way somebody organises a thing they ' +
            'have been doing for years.\n\n' +
            'Photographs of every animal on this site, dated. Copies of manifests. A printout of ' +
            'the phase two brochure with the word SANCTUARY circled and a line drawn to a copy of ' +
            'a licence application in which the same water is described as a HOLDING FACILITY.\n\n' +
            'And a map of the park with five pins in it: Coastal Cove, Coral Kingdom, Arctic Cove, ' +
            'Open Ocean, and here. Beside each pin, a name. You know four of the names. One of ' +
            'them is Sable.\n\n' +
            'This was never one person spraying walls at night. This is a network, and it has been ' +
            'running for longer than you have.',
      effects: [
        { type: 'addEvidence', id: 'ev_the_network' },
        { type: 'setFlag', flag: 'found_network', value: true },
        { type: 'addXP', amount: 120, once: 'hide_wall' }
      ] },

    { id: 'hide_sanctuary', x: 9, y: 2, kind: 'search', once: true, name: 'The Folder on the Desk',
      text: 'One folder, squared up on the desk, with a sticky note on the front: "FOR WHOEVER ' +
            'WORKS OUT THE WORD."\n\n' +
            'Inside is a formal offer, on letterhead, from an established marine sanctuary with a ' +
            'coastal sea pen and a veterinary team. It offers to receive the large cetaceans held ' +
            'at this facility at no cost to the park, and to fund the transport.\n\n' +
            'It has been sent three times. Behind it are the three replies.\n\n' +
            'The first two are polite and say the animals are thriving. The third is one line long ' +
            'and says the collection is not available for disposal.\n\n' +
            'Disposal. Their word.',
      effects: [
        { type: 'addEvidence', id: 'ev_sanctuary_offer' },
        { type: 'setFlag', flag: 'found_sanctuary', value: true },
        { type: 'addXP', amount: 140, once: 'hide_sanctuary' },
        { type: 'toast', text: 'The sanctuary offer is in your Notebook.' }
      ] },

    { id: 'hide_kit', x: 2, y: 4, kind: 'search', once: true, name: 'The Kit Bag',
      text: 'A rope access bag, packed properly: harness, two lanyards, descender, a set of ' +
            'inspection callipers and a camera with a decent lens.\n\n' +
            'On top, a laminated card of net mesh gauges, the sort a person carries when they are ' +
            'checking whether a repair has been done to the right specification.\n\n' +
            'She has been surveying this site. Properly. For months.',
      loot: [{ item: 'mesh_gauge', chance: 1 }],
      effects: [
        { type: 'addXP', amount: 55, once: 'hide_kit' },
        { type: 'toast', text: 'You take the mesh gauge card. She left it out for a reason.' }
      ] }
  ]
};

SU.data.zones.deep_gatehouse = {
  name: 'Sea Gate House',
  subtitle: 'One console, one procedure, one very large door',
  kind: 'interior',
  w: 16, h: 12,
  base: 'floor',
  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 16, h: 1  },
    { t: 'wall', x: 0,  y: 11, w: 16, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 12 },
    { t: 'wall', x: 15, y: 0,  w: 1,  h: 12 },
    { t: 'door', x: 7,  y: 0,  w: 1,  h: 1  }
  ],
  spawns: { entry: { x: 7, y: 1 } },
  exits: [{ x: 7, y: 0, to: 'the_deep', spawn: 'from_gatehouse', label: 'Out to the east bench' }],
  props: [
    { t: 'gantry', x: 13, y: 3 }, { t: 'pipe', x: 14, y: 6 }, { t: 'crate', x: 1, y: 9 },
    { t: 'bin', x: 14, y: 9 }, { t: 'bench', x: 3, y: 9 },
    { t: 'trolley', x: 11, y: 9 }
  ],
  objects: [
    { id: 'gate_console', x: 7, y: 4, kind: 'station', name: 'Sluice Console',
      text: 'The console that operates the sea gate. Two keyed positions, a hold-to-run handle, and ' +
            'a procedure in a frame on the wall beside it.\n\n' +
            'The procedure is four pages and is, as far as you can tell, entirely sensible. Tide ' +
            'state. Net check. Animal position. Two authorised persons. A sign-off sheet.\n\n' +
            'The sign-off sheet in the frame has one name on it, over and over, and no ' +
            'countersignature anywhere.' },

    { id: 'hz_winch_cert', x: 3, y: 3, kind: 'hazard', name: 'Winch Out of Certification', severity: 'medium',
      text: 'The gate winch, and beside it the statutory inspection certificate in a plastic wallet.\n\n' +
            'The certificate expired in January. There is a second wallet under it with an ' +
            'inspection booking confirmation in it, dated in December, for an inspection that would ' +
            'have been in February.\n\n' +
            'Somebody booked it. Somebody else cancelled it. The cancellation email is printed and ' +
            'in the wallet too, which was either an accident or a message.',
      logText: 'You log the expiry date, the booking, and the cancellation, in that order. Three ' +
               'documents that individually mean nothing and together mean somebody made a decision.',
      evidence: 'ev_deep_winch' },

    { id: 'night_sluice', x: 10, y: 2, kind: 'station', name: 'Sluice Hold',
      requires: { quest: { q_deep_nightshift: 'active' } },
      deniedText: 'The hold-to-run handle for the sluice. Nothing to hold tonight.',
      text: 'With the level already down, the last thing anybody needs is the tide taking another ' +
            'forty centimetres out through the channel while the pump is being reset.\n\n' +
            'You put the sluice into hold. The procedure in the frame says two authorised persons.\n\n' +
            'There is one of you, and it is the right call, and both of those things are going to be ' +
            'true at the same time in the report, if anybody ever writes one.',
      effects: [
        { type: 'setFlag', flag: 'night_sluice_done', value: true },
        { type: 'addXP', amount: 30, once: 'night_sluice' }
      ] },

    { id: 'gate_log', x: 12, y: 4, kind: 'search', once: true, name: 'Gate Movement Log',
      text: 'Every operation of the sea gate since it was commissioned. It is a thin book.\n\n' +
            'Fourteen entries. Twelve are commissioning tests. The thirteenth is Halcyon\'s arrival.\n\n' +
            'The fourteenth is eight days ago, at 02:40, and the reason field reads "STOCK ' +
            'MOVEMENT: 41-B". Time in, time out, forty minutes.\n\n' +
            'Somebody brought a six tonne animal in through that gate in the dark and wrote it up ' +
            'as stock movement.',
      effects: [
        { type: 'addEvidence', id: 'ev_gate_log' },
        { type: 'setFlag', flag: 'found_gatelog', value: true },
        { type: 'addSuspicion', amount: 8 },
        { type: 'addXP', amount: 90, once: 'deep_gatelog' },
        { type: 'toast', text: 'Gate movement log copied into your Notebook.' }
      ] }
  ]
};

SU.data.zones.deep_necropsy = {
  name: 'Post-Mortem Room',
  subtitle: 'Clean, cold, and the most honest room on the site',
  kind: 'interior',
  w: 16, h: 12,
  base: 'hall',
  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 16, h: 1  },
    { t: 'wall', x: 0,  y: 11, w: 16, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 12 },
    { t: 'wall', x: 15, y: 0,  w: 1,  h: 12 },
    { t: 'wall', x: 10, y: 1,  w: 1,  h: 4  },
    { t: 'door', x: 4,  y: 11, w: 1,  h: 1  }
  ],
  spawns: { entry: { x: 4, y: 10 } },
  exits: [{ x: 4, y: 11, to: 'the_deep', spawn: 'from_necropsy', label: 'Out to the apron' }],
  props: [
    { t: 'pipe', x: 1, y: 2 }, { t: 'pipe', x: 14, y: 2 },
    { t: 'crate', x: 13, y: 9 }, { t: 'bin', x: 1, y: 9 }, { t: 'trolley', x: 7, y: 8 },
    { t: 'bench', x: 2, y: 6,
      text: 'A steel bench, hosed down, dry, with the drain grating below it scrubbed clean. ' +
            'Whoever works in here is meticulous, and this is the only room on the site that ' +
            'smells of disinfectant rather than diesel.' }
  ],
  objects: [
    { id: 'necropsy_table', x: 7, y: 3, kind: 'sign', name: 'The Table',
      text: 'A post-mortem table, sized for an animal considerably larger than a person, with a ' +
            'block and tackle over it and a drain in the floor.\n\n' +
            'This is a normal thing for a facility of this type to have. Any responsible collection ' +
            'has one, and being squeamish about it helps nobody.\n\n' +
            'What is not normal is that it is here, in a building on the apron, on a site that ' +
            'officially holds no animals and has no keepers, and that it was in the plans from ' +
            'the start.' },

    { id: 'necropsy_files', x: 12, y: 3, kind: 'search', once: true, name: 'Report Cabinet',
      requires: { phase: 'gap' },
      deniedText: 'The cabinet is in full view of the apron through the window, and the apron has ' +
                  'people on it during a shift. Not now.',
      text: 'Six post-mortem reports, written by a veterinary pathologist who does not work for ' +
            'the park, which is exactly how it should be done.\n\n' +
            'They are careful, unemotional and completely damning. Four of the six give a cause of ' +
            'death and then, under CONTRIBUTING FACTORS, list the same three words in different ' +
            'orders: enclosure dimensions, social isolation, chronic stress.\n\n' +
            'The sixth report is for an animal that does not appear on any collection list you have ' +
            'seen. Arrived and died within the same eleven weeks. Never named, never announced, ' +
            'never on the guest map.\n\n' +
            'Attached to the front of that one is a compliment slip: "Do not circulate."',
      effects: [
        { type: 'addEvidence', id: 'ev_necropsy_reports' },
        { type: 'setFlag', flag: 'found_necropsy', value: true },
        { type: 'addSuspicion', amount: 10 },
        { type: 'addXP', amount: 150, once: 'deep_necropsy' },
        { type: 'toast', text: 'Six post-mortem reports copied into your Notebook.' }
      ] },

    { id: 'necropsy_freezer', x: 13, y: 8, kind: 'station', name: 'Sample Freezer',
      text: 'A sample freezer, correctly labelled, correctly logged, correctly maintained.\n\n' +
            'The inventory sheet on the door is complete and in the same handwriting as the plant ' +
            'log book in the pump house.\n\n' +
            'It is worth noticing, on a site like this, exactly which people are still doing their ' +
            'jobs to the letter, and what that costs them.' }
  ]
};
