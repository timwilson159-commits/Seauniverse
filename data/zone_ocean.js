/* ============================================================
   SEA UNIVERSE, ZONE 4: OPEN OCEAN

   Own file, per the convention set by Zone 3. Same rectangle-painting
   shape as everything in zones.js.

   This is the biggest zone in the park (56x40, matching Coral Kingdom)
   and the first one where ANIMALS ARE LOCKED BEHIND PUZZLES rather
   than behind a qualification:

     · the ORCA is inside the Meridian compound, behind a keypad whose
       four-digit code is derived from four countable facts about four
       different animals. The riddle is laminated to the pad; the four
       numbers are printed on the information boards beside each animal.
       See the load-bearing note at the top of the Zone 4 block in
       data/species.js before rewording any of them.

     · the MANTAS are under a night cover that only maintenance can
       winch off, and the only maintenance man on site is asleep in the
       stadium. He will not get up for less than four separate
       pick-me-ups, each sold at a different park kiosk. Nothing in the
       game says "visit all four zones", that is the player's job to
       work out from what he asks for.

   Two secret layers on top of that:
     · ADMINISTRATION is reachable only from the service alley, and only
       during a gap phase. During a shift the door is simply not an option.
     · the SERVICE LEVEL is underground, and a security officer is
       standing on the stair head until you give him three reasons to be
       somewhere else.

   Layout is banded: three east-west promenades, one north-south spine,
   and a two-wide back-of-house alley down the entire east edge, which is
   how you reach the admin block and half the interesting rubbish.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.zones = SU.data.zones || {};

/* --- new tiles and props for this zone -----------------------
   Appended to the palettes in zones.js rather than redefining them.
   Both reuse existing shapes so the placeholder renderer needs no
   new code; real art drops in as tile_/prop_ files later. */
SU.data.tiles.oceanwater = { colour: '#12456b', solid: true,  label: '' };  // deep show-pool water
SU.data.tiles.terrace    = { colour: '#8d8577', solid: false, label: '' };  // stadium seating concrete
SU.data.tiles.steel      = { colour: '#4f545a', solid: false, label: '' };  // service level floor

SU.data.props.hoarding = { name: 'Site Hoarding',   shape: 'box',  colour: '#3f6f9a', solid: true };
SU.data.props.mast     = { name: 'Lighting Mast',   shape: 'post', colour: '#4a525c', solid: true };
SU.data.props.pallet   = { name: 'Pallet Stack',    shape: 'box',  colour: '#9a8258', solid: true };

SU.data.zones.open_ocean = {
  name: 'Open Ocean',
  subtitle: 'The flagship wing, one empty stadium, and an animal nobody can look at',
  num: 4,
  kind: 'region',
  w: 56, h: 40,
  base: 'grass',
  music: null,

  onArrive: [
    { type: 'achievement', id: 'open_water' },
    { type: 'toast', text: 'Open Ocean. Everything here is bigger, newer, and quieter than it should be.' }
  ],

  rects: [
    // outer fence
    { t: 'fence', x: 0,  y: 0,  w: 56, h: 1  },
    { t: 'fence', x: 0,  y: 39, w: 56, h: 1  },
    { t: 'fence', x: 0,  y: 0,  w: 1,  h: 40 },
    { t: 'fence', x: 55, y: 0,  w: 1,  h: 40 },

    // three promenades, the spine, and the back-of-house alley
    { t: 'path', x: 1,  y: 7,  w: 54, h: 2  },
    { t: 'path', x: 1,  y: 19, w: 54, h: 2  },
    { t: 'path', x: 1,  y: 31, w: 54, h: 3  },
    { t: 'path', x: 26, y: 1,  w: 3,  h: 33 },
    { t: 'path', x: 53, y: 1,  w: 2,  h: 38 },

    // north entry plaza and the cross-link through the middle band
    { t: 'path', x: 20, y: 1,  w: 15, h: 6 },
    { t: 'path', x: 18, y: 13, w: 15, h: 2 },

    // south working plaza
    { t: 'path', x: 2,  y: 34, w: 52, h: 5 },

    // Blue Horizon Stadium (west, middle band)
    { t: 'wall', x: 3,  y: 9,  w: 15, h: 10 },

    // manta lagoon (east, middle band)
    { t: 'deck',       x: 33, y: 9,  w: 20, h: 10 },
    { t: 'oceanwater', x: 36, y: 11, w: 14, h: 6  },

    // pilot whale pool (west, south band)
    { t: 'deck',       x: 3,  y: 21, w: 16, h: 10 },
    { t: 'oceanwater', x: 5,  y: 23, w: 12, h: 6  },

    // common dolphin bay (east, south band)
    { t: 'deck',       x: 34, y: 21, w: 19, h: 10 },
    { t: 'oceanwater', x: 37, y: 23, w: 14, h: 6  },

    // Meridian holding compound: the orca, behind the keypad
    { t: 'wall', x: 20, y: 22, w: 6,  h: 8 },

    // administration block (north-east). No door on the public face.
    { t: 'wall', x: 37, y: 1,  w: 16, h: 6 },

    // staff block and the life support stair head, south plaza
    { t: 'staffwall', x: 6,  y: 35, w: 12, h: 4 },
    { t: 'wall', x: 44, y: 35, w: 7,  h: 4 },

    // openings, painted last so nothing covers them
    { t: 'gate', x: 26, y: 0,  w: 2, h: 1 },   // north gate back to Arctic Cove
    { t: 'gate', x: 26, y: 39, w: 2, h: 1 },   // south gate down to The Deep (bolted from the far side)
    { t: 'door', x: 10, y: 9,  w: 1, h: 1 },   // stadium
    { t: 'door', x: 25, y: 26, w: 1, h: 1 },   // Meridian gate (keypad)
    { t: 'door', x: 52, y: 4,  w: 1, h: 1 },   // admin, off the service alley
    { t: 'door', x: 11, y: 35, w: 1, h: 1 },   // staff block
    { t: 'door', x: 47, y: 35, w: 1, h: 1 }    // stair head, down to the service level
  ],

  spawns: {
    from_north:    { x: 27, y: 2  },
    from_staff:    { x: 11, y: 34 },
    from_stadium:  { x: 10, y: 8  },
    from_meridian: { x: 26, y: 26 },
    from_admin:    { x: 53, y: 4  },
    from_service:  { x: 47, y: 34 },
    from_deep:     { x: 26, y: 38 }
  },

  exits: [
    { x: 26, y: 0, w: 2, h: 1, to: 'arctic_cove', spawn: 'from_south', label: 'Arctic Cove' },

    /* The Deep. This gate is bolted from the FAR side, so it cannot be
       opened from here at all: the first trip down is through the service
       tunnel, and you come back up and unbolt this yourself. After that it
       is an ordinary door and the walk stops being a ceremony. */
    {
      x: 26, y: 39, w: 2, h: 1, to: 'the_deep', spawn: 'from_north', label: 'The Deep',
      condition: { flags: { deep_gate_open: true } },
      /* PLAYTEST FIX (2026-08-05): a player with every Open Ocean quest
         completed stood here and concluded they had missed a mission.
         They had not. This gate is bolted from the FAR side and can only
         ever be opened from down there, which is the design, but the
         original text described the hinge line and left the player to
         infer a whole route from it.

         Project rule, set in Arctic Cove: if flavour text describes
         something the player cannot have yet, it must point at the thing
         that gives it. So this now names the tunnel without naming the
         door, which keeps the walk down there worth doing. */
      lockedText: 'A service gate in the south fence. No sign, no handle on this side, and a hinge ' +
                  'line that says it opens the other way: this is bolted from the far side, so it is ' +
                  'not a door you can open, it is a door somebody comes back and unbolts.\n\n' +
                  'Past it the ground drops away and there is a great deal of water down there that ' +
                  'is not on the guest map.\n\n' +
                  'If there is a way in at all it is not on this fence. The plant room under the ' +
                  'plaza runs south under all of this, and the pipework in it does not stop at the ' +
                  'boundary.'
    },

    { x: 10, y: 9, to: 'ocean_stadium', spawn: 'entry', label: 'Blue Horizon Stadium' },

    { x: 11, y: 35, to: 'staff_ocean', spawn: 'entry', label: 'Open Ocean Staff Block' },

    /* The keypad sets this flag. Nothing else does. */
    {
      x: 25, y: 26, to: 'meridian_pool', spawn: 'entry', label: 'Meridian Holding',
      condition: { flags: { meridian_open: true } },
      lockedText: 'A steel personnel gate with a keypad beside it and no handle on this side. ' +
                  'Somebody has laminated a card to the pad, which is either very helpful or ' +
                  'exactly as unhelpful as it looks.'
    },

    /* The offices. Not locked: occupied. During a shift there is simply
       always somebody in there, and you are supposed to be elsewhere. */
    {
      x: 52, y: 4, to: 'ocean_admin', spawn: 'entry', label: 'Administration',
      condition: { phase: 'gap' },
      lockedText: 'The back door into Administration. Through the glass you can count four people ' +
                  'at desks and one on the phone. Not during a shift. Not with a lanyard that says ' +
                  'ANIMAL CARE on it.'
    },

    /* Underground. Vaughn is standing on it until he has somewhere better to be. */
    {
      x: 47, y: 35, to: 'deep_service', spawn: 'entry', label: 'Service Level',
      condition: { flags: { hatch_clear: true } },
      lockedText: 'The stair head down to the service level, and a security officer standing ' +
                  'squarely in front of it with the patience of a man who has done this before.'
    }
  ],

  props: [
    // north-west: the Open Ocean Wing site, still half a building site
    { t: 'hoarding', x: 4,  y: 3 }, { t: 'hoarding', x: 5, y: 3 }, { t: 'hoarding', x: 6, y: 3 },
    { t: 'hoarding', x: 11, y: 3 }, { t: 'hoarding', x: 12, y: 3 },
    { t: 'cone', x: 7, y: 4 }, { t: 'cone', x: 10, y: 4 }, { t: 'cone', x: 14, y: 2 },
    { t: 'pallet', x: 3, y: 5 }, { t: 'pallet', x: 16, y: 5 }, { t: 'pallet', x: 17, y: 2 },
    { t: 'palm', x: 2, y: 2 }, { t: 'palm', x: 18, y: 5 }, { t: 'palm', x: 2, y: 6 },
    { t: 'mast', x: 19, y: 3 },

    // entry plaza
    { t: 'planter', x: 21, y: 2 }, { t: 'planter', x: 21, y: 5 },
    { t: 'planter', x: 34, y: 2 }, { t: 'planter', x: 34, y: 5 },
    { t: 'bench', x: 23, y: 5 }, { t: 'bench', x: 32, y: 2 },
    { t: 'bin', x: 24, y: 2 }, { t: 'bin', x: 33, y: 5 },
    { t: 'lamp', x: 22, y: 3 }, { t: 'lamp', x: 33, y: 3 },
    { t: 'palm', x: 35, y: 2 }, { t: 'palm', x: 35, y: 5 }, { t: 'palm', x: 36, y: 3 },

    // upper promenade dressing
    { t: 'bench', x: 20, y: 8 }, { t: 'bench', x: 24, y: 8 }, { t: 'bench', x: 44, y: 8 },
    { t: 'bin', x: 22, y: 7 }, { t: 'bin', x: 47, y: 7 },
    { t: 'lamp', x: 31, y: 7 }, { t: 'lamp', x: 40, y: 8 }, { t: 'lamp', x: 2, y: 7 },
    { t: 'umbrella', x: 42, y: 7 }, { t: 'umbrella', x: 50, y: 8 },

    // stadium frontage
    { t: 'mast', x: 2, y: 9 }, { t: 'mast', x: 2, y: 18 },
    { t: 'cone', x: 8, y: 8 }, { t: 'cone', x: 12, y: 8 },
    { t: 'crate', x: 19, y: 10 }, { t: 'crate', x: 19, y: 11 },
    { t: 'barrel', x: 19, y: 16 }, { t: 'bush', x: 20, y: 9 }, { t: 'bush', x: 24, y: 9 },
    { t: 'bush', x: 20, y: 17 }, { t: 'bush', x: 24, y: 17 }, { t: 'bush', x: 22, y: 18 },

    // manta lagoon deck
    { t: 'pillar', x: 33, y: 9 }, { t: 'pillar', x: 52, y: 9 },
    { t: 'pillar', x: 33, y: 18 }, { t: 'pillar', x: 52, y: 18 },
    { t: 'bench', x: 38, y: 18 }, { t: 'bench', x: 42, y: 18 }, { t: 'bench', x: 46, y: 18 },
    { t: 'buoy', x: 35, y: 10 }, { t: 'buoy', x: 50, y: 17 },
    { t: 'lifering', x: 35, y: 17 }, { t: 'lifering', x: 50, y: 10 },
    { t: 'trolley', x: 51, y: 12 },
    { t: 'pipe', x: 51, y: 15,
      text: 'Lagoon return pipework. A laminated card zip-tied to it reads "NIGHT COVER: WINCH ' +
            'ONLY. DO NOT DRAG. ASK MAINTENANCE." Somebody has added, in biro, "good luck".' },
    { t: 'kelp', x: 30, y: 10 }, { t: 'kelp', x: 30, y: 17 },
    { t: 'reed', x: 31, y: 12 }, { t: 'reed', x: 31, y: 16 },

    // middle band landscaping and the cross-link
    { t: 'bush', x: 29, y: 9 }, { t: 'bush', x: 32, y: 9 },
    { t: 'bush', x: 29, y: 18 }, { t: 'bush', x: 32, y: 18 },
    // beside the cross-link, never on it: it is only two tiles tall
    { t: 'lamp', x: 25, y: 12 }, { t: 'lamp', x: 25, y: 15 },
    { t: 'rock', x: 21, y: 11 }, { t: 'rock', x: 23, y: 16 },

    // middle promenade
    { t: 'bench', x: 21, y: 19 }, { t: 'bench', x: 36, y: 19 },
    { t: 'bin', x: 24, y: 20 }, { t: 'bin', x: 44, y: 19 },
    { t: 'lamp', x: 12, y: 20 }, { t: 'lamp', x: 48, y: 20 },
    { t: 'planter', x: 19, y: 19 }, { t: 'planter', x: 23, y: 19 },

    // pilot whale pool deck
    { t: 'pillar', x: 3, y: 21 }, { t: 'pillar', x: 18, y: 21 },
    { t: 'bench', x: 7, y: 30 }, { t: 'bench', x: 11, y: 30 },
    { t: 'buoy', x: 4, y: 24 }, { t: 'buoy', x: 17, y: 27 },
    { t: 'lifering', x: 4, y: 27 }, { t: 'lifering', x: 17, y: 24 },
    { t: 'barrel', x: 18, y: 30 }, { t: 'trolley', x: 3, y: 30 },

    // dolphin bay deck
    { t: 'pillar', x: 34, y: 21 }, { t: 'pillar', x: 52, y: 21 },
    { t: 'bench', x: 40, y: 30 }, { t: 'bench', x: 44, y: 30 }, { t: 'bench', x: 48, y: 30 },
    { t: 'buoy', x: 36, y: 24 }, { t: 'buoy', x: 51, y: 27 },
    { t: 'lifering', x: 36, y: 27 }, { t: 'lifering', x: 51, y: 24 },
    { t: 'umbrella', x: 38, y: 30 }, { t: 'umbrella', x: 50, y: 30 },

    // compound surrounds: you can walk right around it and see nothing
    { t: 'bush', x: 19, y: 22 }, { t: 'bush', x: 19, y: 26 }, { t: 'bush', x: 19, y: 29 },
    { t: 'crate', x: 29, y: 22 }, { t: 'pallet', x: 29, y: 23 },
    { t: 'mast', x: 30, y: 26 }, { t: 'bush', x: 32, y: 24 }, { t: 'bush', x: 32, y: 28 },
    { t: 'cone', x: 27, y: 30 },

    // service alley, east edge
    { t: 'pallet', x: 54, y: 10 }, { t: 'pallet', x: 54, y: 11 },
    { t: 'barrel', x: 54, y: 22 }, { t: 'crate', x: 54, y: 23 },
    { t: 'pipe', x: 54, y: 6,
      text: 'Bundled conduit running up the outside of the admin block, tied off with tape. ' +
            'One cable is newer than the rest and goes straight into a hole drilled through the wall.' },
    { t: 'bin', x: 54, y: 28 }, { t: 'cone', x: 53, y: 33 },

    // lower promenade and south plaza
    { t: 'lamp', x: 20, y: 32 }, { t: 'lamp', x: 33, y: 32 }, { t: 'lamp', x: 8, y: 32 },
    { t: 'bench', x: 22, y: 33 }, { t: 'bench', x: 31, y: 33 },
    { t: 'bin', x: 25, y: 33 }, { t: 'planter', x: 29, y: 33 },
    { t: 'pallet', x: 3, y: 36 }, { t: 'pallet', x: 3, y: 37 }, { t: 'crate', x: 4, y: 37 },
    { t: 'barrel', x: 19, y: 36 }, { t: 'barrel', x: 20, y: 36 },
    { t: 'trolley', x: 22, y: 37 }, { t: 'trolley', x: 41, y: 36 },
    { t: 'cone', x: 43, y: 34 }, { t: 'cone', x: 51, y: 34 },
    { t: 'pipe', x: 52, y: 36 }, { t: 'pipe', x: 52, y: 37 },
    { t: 'bush', x: 5, y: 34 }, { t: 'bush', x: 18, y: 34 },
    { t: 'palm', x: 33, y: 37 }, { t: 'palm', x: 37, y: 37 }, { t: 'palm', x: 29, y: 37 }
  ],

  objects: [
    /* --------------- signage and information boards ---------------
       The four boards are the answer key for the Meridian keypad.
       Each one prints exactly one countable fact, in plain words,
       beside the animal it belongs to. The orca's board is deliberately
       OUTSIDE her compound: you can read all about an animal you are
       not allowed to look at, which is the zone in one object. */

    { id: 'sign_ocean', x: 30, y: 2, kind: 'sign', name: 'Park Sign',
      text: 'OPEN OCEAN. Where the big ones live.\n\n' +
            'Home to Tempest, our ambassador orca; the Pod Pool pilot whales; the common dolphins ' +
            'of Blue Water Bay; and the reef mantas of the Manta Lagoon.\n\n' +
            'The Open Ocean Wing is Sea Universe\'s largest ever investment in conservation.' },

    /* THE FOUR ANIMAL BOARDS.
       These used to carry the four countable facts the Meridian code is
       built from. That job now belongs entirely to the four teenagers in
       high-vis (see data/npcs_ocean.js), so the boards were rewritten
       2026-08-05 to general facts that help with the code not at all.
       Do not put a countable fact back on one of these. They still log
       their species, which is the teaching payload they exist for. */
    { id: 'board_orca', x: 25, y: 23, kind: 'sign', name: 'Tempest: Ambassador Board',
      text: 'MEET TEMPEST\n\n' +
            'Orca · Orcinus orca · with us since last spring.\n\n' +
            'The orca is the largest member of the dolphin family. Wild orcas live in family groups ' +
            'led by the oldest female, and each group has its own dialect of calls, learned rather ' +
            'than inherited.\n\n' +
            'Tempest is currently resting off-exhibit. Show times will be announced.',
      effects: [
        { type: 'discoverSpecies', id: 'orca' },
        { type: 'setFlag', flag: 'read_board_orca', value: true }
      ] },

    { id: 'board_manta', x: 34, y: 10, kind: 'sign', name: 'Manta Lagoon Board',
      text: 'THE MANTA LAGOON\n\n' +
            'Reef manta ray · Mobula alfredi\n\n' +
            'Mantas are ram ventilators: forward motion is how they breathe, so they never stop ' +
            'swimming and never hover.\n\n' +
            'Every manta\'s belly spots are unique, like a fingerprint.',
      effects: [
        { type: 'discoverSpecies', id: 'reef_manta' },
        { type: 'setFlag', flag: 'read_board_manta', value: true }
      ] },

    { id: 'board_pilot', x: 4, y: 22, kind: 'sign', name: 'Pod Pool Board',
      text: 'THE POD POOL\n\n' +
            'Short-finned pilot whale · Globicephala macrorhynchus\n\n' +
            'Pilot whales are among the deepest divers of the dolphin family, sprinting after squid ' +
            'far below the sunlit water and returning in a matter of minutes.\n\n' +
            'Despite the name, they are dolphins.',
      effects: [
        { type: 'discoverSpecies', id: 'pilot_whale' },
        { type: 'setFlag', flag: 'read_board_pilot', value: true }
      ] },

    { id: 'board_dolphin', x: 35, y: 22, kind: 'sign', name: 'Blue Water Bay Board',
      text: 'BLUE WATER BAY\n\n' +
            'Common dolphin · Delphinus delphis\n\n' +
            'Common dolphins hunt cooperatively, herding fish into a tight ball and taking turns to ' +
            'drive through it. The behaviour only works with a crowd.\n\n' +
            'In the wild they travel in pods of hundreds.',
      effects: [
        { type: 'discoverSpecies', id: 'common_dolphin' },
        { type: 'setFlag', flag: 'read_board_dolphin', value: true }
      ] },

    /* --------------- THE KEYPAD ---------------
       Code 5423 = oceans(5), hourglass panels(4), cephalic lobes(2),
       generations(3).

       REDESIGNED 2026-08-05. The numbers used to be printed on the four
       information boards above and the card here used to be a riddle
       listing them in order. Both halves of that are gone: the boards
       are general animal facts now and give no help at all, and the only
       route to the code is the four teenagers of the Teenage Neon Animal
       Liberation Unified Front, who each hold one digit and each know
       their own position. See the block at the foot of
       data/npcs_ocean.js.

       The card is deliberately oblique, because the point is that the
       player finds those four by talking to people rather than by being
       sent. Unlimited attempts, no penalty, and the after-three-misses
       hint is the no-dead-end safety net, so THAT one names them
       plainly. */
    { id: 'meridian_pad', x: 25, y: 25, kind: 'keypad', name: 'Meridian Gate Keypad',
      code: '5423',
      hintAfter: 3,
      text: 'A steel keypad, and a card laminated to the housing in the careful block capitals of ' +
            'somebody who expected to be back at work by now.',
      clue: [
        'MERIDIAN GATE: four digits.',
        'It is not written down. Not in a drawer, not in a phone, not on this card.',
        'I gave it away in pieces, to people nobody in this park takes seriously. ' +
          'That is the entire reason it is safe.',
        'J.N.'
      ],
      hint: 'The four of them are all over this zone in the fluro yellow shirts and the pink ' +
            'trousers, and they are impossible to miss. Each one holds a single digit and each ' +
            'one knows exactly which position theirs is. They will tell absolutely anybody who ' +
            'asks. That is the flaw in the plan.',
      solvedText: 'The bolt goes back with a heavy clunk you feel through the ground.',
      effects: [
        { type: 'setFlag', flag: 'meridian_open', value: true },
        { type: 'addXP', amount: 80, once: 'meridian_code' },
        { type: 'achievement', id: 'code_breaker' },
        { type: 'toast', text: 'Meridian Gate unlocked.' }
      ] },

    /* --------------- animals --------------- */

    { id: 'pod_pool', x: 17, y: 29, kind: 'animal', name: 'Pod Pool',
      species: 'pilot_whale',
      requires: { qualification: 'pelagic_cert' },
      deniedText: 'Three pilot whales, and a gate you are not signed off to open. Open Water Handling first.' },

    { id: 'bay_pool', x: 35, y: 29, kind: 'animal', name: 'Blue Water Bay',
      species: 'common_dolphin',
      requires: { qualification: 'pelagic_cert' },
      deniedText: 'Cetacean work in open-water pools. Not without Open Water Handling.' },

    /* The cover is the gate here, not the certificate: you can hold every
       qualification in the park and still not get near these animals. */
    { id: 'manta_lagoon', x: 34, y: 17, kind: 'animal', name: 'Manta Lagoon',
      species: 'reef_manta',
      requires: { flags: { manta_cover_off: true } },
      deniedText: 'The night cover is still on: a shade tarpaulin the size of a tennis court, winched ' +
                  'across the lagoon at close and never taken off this morning. You can hear them ' +
                  'moving under it. You cannot see a thing, and you are not dragging it off by hand,' +
                  'the card on the pipework is very clear about that.' },

    /* --------------- observation posts --------------- */

    { id: 'obs_manta', x: 51, y: 17, kind: 'observe', name: 'Lagoon Viewing Rail',
      species: 'reef_manta',
      text: 'The east rail. Even under the cover you can follow the shadow of a wingtip.' },

    { id: 'obs_pod', x: 4, y: 29, kind: 'observe', name: 'Pod Pool Rail',
      species: 'pilot_whale' },

    { id: 'obs_bay', x: 51, y: 29, kind: 'observe', name: 'Bay Viewing Rail',
      species: 'common_dolphin' },

    /* --------------- public-facing work --------------- */

    { id: 'talk_ocean', x: 29, y: 20, kind: 'talk', name: 'Open Ocean Talk Point',
      pool: 'ocean_plaza' },

    { id: 'kiosk_ocean', x: 31, y: 5, kind: 'shop', name: 'Deep Blue Kiosk',
      text: 'Slushies, hats, and a wall of soft toys of an animal currently not on display.',
      sells: ['blue_slushie', 'energy_bar', 'coffee', 'camera'] },

    { id: 'feed_ocean', x: 18, y: 25, kind: 'station', name: 'Pod Pool Feed Station',
      text: 'Scales, buckets and a whiteboard of intake figures in three colours of marker.' },

    { id: 'wash_ocean', x: 33, y: 20, kind: 'station', name: 'Deck Wash Point',
      text: 'A hose reel and a squeegee on a pole. The glamour of marine mammal husbandry.' },

    { id: 'cover_winch', x: 33, y: 11, kind: 'station', name: 'Lagoon Cover Winch',
      text: 'The winch that drives the night cover. The control box is locked, the key is on a ' +
            'maintenance ring, and the maintenance ring is on a man nobody has seen since breakfast.\n\n' +
            'A note taped to the box: "IF THE COVER IS STILL ON AFTER 0900 FIND DAGS. DO NOT ' +
            'IMPROVISE." The word IMPROVISE has been underlined twice.',
      effects: [
        { type: 'setFlag', flag: 'saw_winch', value: true }
      ] },

    /* --------------- signs, searches and paperwork --------------- */

    { id: 'wing_hoarding', x: 8, y: 2, kind: 'sign', name: 'Open Ocean Wing Hoarding',
      text: 'COMING SOON: THE OPEN OCEAN WING\n\n' +
            '"The largest marine conservation facility in the southern hemisphere. Every dollar you ' +
            'spend at Sea Universe builds it. Every animal in it is an animal we saved."\n\n' +
            'An artist\'s impression shows six pools and a great many happy families. The completion ' +
            'date on the corner of the board has been covered with a sticker. Under the sticker is ' +
            'another sticker.',
      effects: [
        { type: 'addEvidence', id: 'ev_wing_promise' },
        { type: 'toast', text: 'Wing hoarding copied into your Notebook.', once: 'wing_copy' }
      ] },

    { id: 'stadium_board', x: 14, y: 8, kind: 'sign', name: 'Show Times Board',
      text: 'BLUE HORIZON PRESENTS: OCEAN GIANTS\n\n' +
            '11:00 · 13:30 · 15:30\n\n' +
            'Every time is crossed out in the same marker. Underneath, on a laminated card that has ' +
            'clearly been up for months: "TODAY\'S PRESENTATION IS CANCELLED FOR ANIMAL WELLBEING ' +
            'REASONS. Thank you for your understanding."' },

    { id: 'hatch_sign', x: 44, y: 34, kind: 'sign', name: 'Stair Head Sign',
      text: 'LIFE SUPPORT: SERVICE LEVEL\n\nAUTHORISED PERSONS ONLY. HEARING PROTECTION BEYOND ' +
            'THIS POINT. NO LONE WORKING.\n\nA second, newer sign underneath: "ACCESS RESTRICTED ' +
            'UNTIL FURTHER NOTICE, BY ORDER OF THE OFFICE."' },

    { id: 'alley_bins', x: 54, y: 20, kind: 'search', name: 'Alley Bins',
      text: 'The bins behind the lagoons. Guest rubbish on one side, park rubbish on the other, and ' +
            'a great deal of both on the ground.',
      loot: [{ item: 'plastic_debris', chance: 0.6 }, { item: 'lost_sunglasses', chance: 0.4 },
             { item: 'souvenir_pin', chance: 0.3 }] },

    { id: 'drain_grate', x: 2, y: 33, kind: 'search', name: 'Storm Drain',
      text: 'A drain grating on the low side of the promenade, where everything the park loses ends up.',
      loot: [{ item: 'plastic_debris', chance: 0.7 }, { item: 'sea_glass', chance: 0.4 }] },

    { id: 'alley_crate', x: 53, y: 12, kind: 'search', name: 'Delivery Crate', once: true,
      text: 'A shipping crate in the alley, opened and not yet broken down. The shipping label is ' +
            'still on it, addressed to the Open Ocean Wing, and the contents line reads ' +
            '"LIVE ANIMAL TRANSPORT FRAME 1 OF 3".\n\n' +
            'Three frames. There is one orca here and no wing to put her in yet.',
      effects: [
        { type: 'addEvidence', id: 'ev_transport_frames' },
        { type: 'addSuspicion', amount: 5 },
        { type: 'addXP', amount: 45, once: 'ocean_frames' },
        { type: 'toast', text: 'Shipping label copied into your Notebook.' }
      ] },

    /* Two of the three line isolators for Ferris's timed run. The third
       is inside the stadium, which is what makes the clock a walk. */
    { id: 'iso_lagoon', x: 52, y: 10, kind: 'search', name: 'Lagoon Line Isolator', once: true,
      text: 'A grey box on the lagoon deck stanchion with a single lever and a very faded label. ' +
            'You throw it and the deck speakers go from a faint hiss to nothing at all.',
      effects: [
        { type: 'setFlag', flag: 'iso_lagoon_off', value: true },
        { type: 'toast', text: 'Lagoon line isolated.' }
      ] },

    { id: 'iso_bay', x: 52, y: 22, kind: 'search', name: 'Bay Line Isolator', once: true,
      text: 'The bay isolator, behind a stanchion, with a cable tie holding the cover shut that ' +
            'somebody clearly meant to be temporary.',
      effects: [
        { type: 'setFlag', flag: 'iso_bay_off', value: true },
        { type: 'toast', text: 'Bay line isolated.' }
      ] },

    { id: 'lagoon_logbook', x: 52, y: 13, kind: 'search', name: 'Lagoon Day Book', once: true,
      requires: { phase: 'gap' },
      deniedText: 'The day book is clipped to the rail in full view of the lagoon deck. Not while ' +
                  'you are on shift and visible from three directions.',
      text: 'The lagoon day book, kept by hand.\n\n' +
            'Every entry for the last five weeks reads "cover ON overnight, cover OFF 0700". ' +
            'Every entry for the last five weeks is in the same pen, written in one sitting: ' +
            'you can see where the writer got bored and the handwriting sped up.\n\n' +
            'The cover has been on all morning, on a day the book says it came off at seven.',
      effects: [
        { type: 'addEvidence', id: 'ev_lagoon_daybook' },
        { type: 'addSuspicion', amount: 4 },
        { type: 'toast', text: 'Day book copied into your Notebook.' }
      ] }
  ]
};

/* ==========================================================
   OPEN OCEAN STAFF BLOCK, the PARK RULE staff block for Zone 4
   ========================================================== */
SU.data.zones.staff_ocean = {
  name: 'Open Ocean Staff Block',
  subtitle: 'A new building that already smells like an old one',
  kind: 'interior',
  staffFor: 'open_ocean',
  w: 20, h: 14,
  base: 'floor',
  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 20, h: 1  },
    { t: 'wall', x: 0,  y: 13, w: 20, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 14 },
    { t: 'wall', x: 19, y: 0,  w: 1,  h: 14 },
    { t: 'wall', x: 3,  y: 3,  w: 6,  h: 1  },
    { t: 'wall', x: 13, y: 3,  w: 5,  h: 1  },
    { t: 'wall', x: 8,  y: 8,  w: 6,  h: 1  },
    { t: 'door', x: 9,  y: 0,  w: 2,  h: 1  }
  ],
  spawns: { entry: { x: 9, y: 1 } },
  exits: [
    { x: 9, y: 0, w: 2, h: 1, to: 'open_ocean', spawn: 'from_staff', label: 'Open Ocean' }
  ],
  props: [
    { t: 'crate', x: 2, y: 11 }, { t: 'pallet', x: 17, y: 11 },
    { t: 'bin', x: 17, y: 5 }, { t: 'trolley', x: 15, y: 9 },
    { t: 'bench', x: 5, y: 11 },
    { t: 'bench', x: 11, y: 11,
      text: 'A noticeboard above the bench. Half of it is a rota. The other half is a printed sheet ' +
            'headed WHAT WE SAY ABOUT TEMPEST, which lists four approved sentences and no fifth one.' }
  ],
  objects: [
    { id: 'transit_ocean', x: 15, y: 2, kind: 'transit', name: 'Transit Terminal',
      text: 'The newest terminal in the park, and the only one that works first time.' },

    { id: 'ocean_roster', x: 17, y: 2, kind: 'sign', name: 'Roster Board',
      text: 'OPEN OCEAN ROSTER: Pod Pool session 0930. Bay session 1100. Lagoon cover OFF 0700 ' +
            '(maintenance). Ambassador presentation: SUSPENDED.\n\n' +
            'A handwritten line at the bottom: "Maintenance is one man on nights. Be nice to him. ' +
            'He has been on nights since March."' },

    { id: 'nolan_locker', x: 3, y: 2, kind: 'search', name: 'Locker 14: J. Nolan', once: true,
      text: 'A locker with a name strip that says J. NOLAN and a padlock hanging open on the hasp.\n\n' +
            'Inside: one right-hand dive glove, size medium, chewed at the cuff and missing its ' +
            'partner. A photograph of a keeper standing next to a pool, laughing. A stack of ' +
            'laminating pouches. And a note, in the same careful block capitals as the card on the ' +
            'Meridian pad:\n\n' +
            '"If you are reading this I am still off. The gate code is on the pad. It is not a ' +
            'security question, it is a reading question. Everything you need is on the boards. ' +
            'Do not let them tell you she is fine."',
      effects: [
        { type: 'setFlag', flag: 'found_nolan_locker', value: true },
        { type: 'addXP', amount: 35, once: 'nolan_locker' },
        { type: 'toast', text: 'You pocket the note.' }
      ] },

    /* Vaughn's first piece of paper. He is not being obstructive: a
       relieved point genuinely does have to be rostered in writing. */
    { id: 'roster_amend', x: 12, y: 2, kind: 'search', name: 'Roster Amendment Slips', once: true,
      text: 'A pad of roster amendment slips hanging off the board by a bootlace.\n\n' +
            'You put the relief officer onto the service stair point for the rest of the week, in ' +
            'writing, in the box provided, and pin it up where the board says amendments go. It takes ' +
            'about forty seconds.\n\n' +
            'Nobody has done it for five weeks.',
      effects: [
        { type: 'setFlag', flag: 'vaughn_relief', value: true },
        { type: 'addXP', amount: 25, once: 'vaughn_relief_xp' },
        { type: 'toast', text: 'Relief officer rostered to the service stair.' }
      ] },

    { id: 'kettle_ocean', x: 10, y: 9, kind: 'search', name: 'Kitchenette',
      text: 'A new kettle, a new fridge, and a passive-aggressive sign about milk that could have ' +
            'been transplanted from any building in the world.',
      loot: [{ item: 'coffee', chance: 1 }] },

    { id: 'ocean_bench', x: 5, y: 9, kind: 'station', name: 'Records Bench',
      text: 'Session sheets, ID photo folders and a light box for reading belly-spot patterns off ' +
            'transparencies. Somebody has been doing this properly at some point.' }
  ]
};

/* ==========================================================
   BLUE HORIZON STADIUM, public, and completely empty.
   The maintenance man is asleep in row K.
   ========================================================== */
SU.data.zones.ocean_stadium = {
  name: 'Blue Horizon Stadium',
  subtitle: 'Two thousand seats and nothing to look at',
  kind: 'interior',
  w: 24, h: 16,
  base: 'terrace',
  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 24, h: 1  },
    { t: 'wall', x: 0,  y: 15, w: 24, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 16 },
    { t: 'wall', x: 23, y: 0,  w: 1,  h: 16 },

    // the show pool, drained
    { t: 'floor', x: 5, y: 2, w: 14, h: 6 },
    { t: 'glass', x: 5, y: 8, w: 14, h: 1 },

    // aisles through the seating
    { t: 'path', x: 11, y: 9,  w: 2, h: 6 },
    { t: 'path', x: 1,  y: 13, w: 22, h: 1 },

    { t: 'door', x: 11, y: 15, w: 2, h: 1 }
  ],
  spawns: { entry: { x: 11, y: 14 } },
  exits: [
    { x: 11, y: 15, w: 2, h: 1, to: 'open_ocean', spawn: 'from_stadium', label: 'Open Ocean' }
  ],
  props: [
    { t: 'mast', x: 2, y: 2 }, { t: 'mast', x: 21, y: 2 },
    { t: 'pillar', x: 2, y: 8 }, { t: 'pillar', x: 21, y: 8 },
    { t: 'bench', x: 4, y: 10 }, { t: 'bench', x: 6, y: 10 }, { t: 'bench', x: 8, y: 10 },
    { t: 'bench', x: 15, y: 10 }, { t: 'bench', x: 17, y: 10 }, { t: 'bench', x: 19, y: 10 },
    { t: 'bench', x: 4, y: 12 }, { t: 'bench', x: 6, y: 12 }, { t: 'bench', x: 8, y: 12 },
    { t: 'bench', x: 17, y: 12 }, { t: 'bench', x: 19, y: 12 },
    { t: 'cone', x: 10, y: 9 }, { t: 'cone', x: 13, y: 9 },
    { t: 'pallet', x: 21, y: 14 }, { t: 'crate', x: 2, y: 14 },
    { t: 'bin', x: 3, y: 9 }, { t: 'bin', x: 20, y: 9 }
  ],
  objects: [
    { id: 'show_pool', x: 12, y: 8, kind: 'sign', name: 'Show Pool',
      text: 'The show pool, drained to a puddle, with a scrubbing brush left in the deep end.\n\n' +
            'It is very large and very blue and it has a hairline crack running the width of the ' +
            'floor that somebody has drawn a chalk box around and dated. Three times. In three ' +
            'different months.',
      effects: [
        { type: 'setFlag', flag: 'saw_show_pool', value: true }
      ] },

    { id: 'stadium_speakers', x: 4, y: 9, kind: 'search', name: 'Speaker Stack', once: true,
      text: 'A speaker stack the size of a wardrobe, still in its delivery wrap on one side.\n\n' +
            'The commissioning sheet is taped to the back: peak output figures, a contractor\'s ' +
            'signature, and a handwritten line in a different pen: "AS PER COVE + REEF. Signed off ' +
            'without underwater measurement. Not my call. F.N."',
      effects: [
        { type: 'addEvidence', id: 'ev_stadium_audio' },
        { type: 'addXP', amount: 40, once: 'ocean_audio' },
        { type: 'toast', text: 'Commissioning sheet copied into your Notebook.' }
      ] },

    { id: 'iso_stadium', x: 2, y: 10, kind: 'search', name: 'Stadium Line Isolator', once: true,
      text: 'The main isolator for the stadium PA, in a box at the foot of the west stack.',
      effects: [
        { type: 'setFlag', flag: 'iso_stadium_off', value: true },
        { type: 'toast', text: 'Stadium line isolated.' }
      ] },

    { id: 'seat_search', x: 19, y: 14, kind: 'search', name: 'Under the Seats',
      text: 'Under the seating, where two thousand people a day used to drop things.',
      loot: [{ item: 'lost_sunglasses', chance: 0.5 }, { item: 'souvenir_pin', chance: 0.4 },
             { item: 'sea_glass', chance: 0.3 }] }
  ]
};

/* ==========================================================
   MERIDIAN HOLDING, behind the keypad. One animal.
   ========================================================== */
SU.data.zones.meridian_pool = {
  name: 'Meridian Holding',
  subtitle: 'Off-exhibit, off the map, and off the show times board',
  kind: 'interior',
  w: 20, h: 14,
  base: 'floor',
  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 20, h: 1  },
    { t: 'wall', x: 0,  y: 13, w: 20, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 14 },
    { t: 'wall', x: 19, y: 0,  w: 1,  h: 14 },

    { t: 'oceanwater', x: 4, y: 3, w: 12, h: 8 },

    { t: 'door', x: 19, y: 7, w: 1, h: 1 }
  ],
  spawns: { entry: { x: 18, y: 7 } },
  exits: [
    { x: 19, y: 7, to: 'open_ocean', spawn: 'from_meridian', label: 'Open Ocean' }
  ],
  props: [
    { t: 'pipe', x: 1, y: 2 }, { t: 'pipe', x: 1, y: 11 },
    { t: 'barrel', x: 2, y: 1 }, { t: 'crate', x: 17, y: 1 }, { t: 'crate', x: 17, y: 12 },
    { t: 'trolley', x: 2, y: 12 },
    { t: 'lifering', x: 18, y: 3 }, { t: 'lifering', x: 18, y: 11 },
    { t: 'mast', x: 17, y: 6 },
    { t: 'pallet', x: 3, y: 1,
      text: 'A pallet of unopened enrichment gear: floats, puzzle feeders, a kelp-forest curtain. ' +
            'The delivery note is dated fourteen months ago and has never been signed.' }
  ],
  objects: [
    { id: 'meridian_deck', x: 10, y: 12, kind: 'animal', name: 'Meridian Pool',
      species: 'orca',
      requires: { qualification: 'pelagic_cert' },
      deniedText: 'She is six tonnes of animal in a circle of water. Open Water Handling first, ' +
                  'and even then you work from the deck.' },

    { id: 'obs_meridian', x: 2, y: 6, kind: 'observe', name: 'Holding Pool Rail',
      species: 'orca',
      text: 'A working rail, not a viewing one. Nobody built this to be stood at.' },

    { id: 'meridian_gate_log', x: 9, y: 1, kind: 'search', name: 'Gate Log', once: true,
      text: 'A clipboard by the gate: every entry to this pool, timed and initialled.\n\n' +
            'Eleven months of J.N., three or four times a day, every day. Then nothing for six ' +
            'weeks. Then a single line in a different hand:\n\n' +
            '"Access reduced to feed only pending review. Two visits daily. Presentation programme ' +
            'suspended: animal not currently suitable for guest-facing work."',
      effects: [
        { type: 'addEvidence', id: 'ev_meridian_gatelog' },
        { type: 'addSuspicion', amount: 6 },
        { type: 'addXP', amount: 50, once: 'meridian_log' },
        { type: 'toast', text: 'Gate log copied into your Notebook.' }
      ] },

    { id: 'meridian_med', x: 16, y: 12, kind: 'search', name: 'Dental Kit', once: true,
      text: 'A wall-mounted box: irrigation syringes, saline, a tally chart.\n\n' +
            'The chart is headed IRRIGATION: MERIDIAN and it is one tick per day, every day, for ' +
            'two hundred and six days. There is no space left on the sheet, so the ticks have ' +
            'started going up the margin.',
      effects: [
        { type: 'addEvidence', id: 'ev_orca_dental_tally' },
        { type: 'toast', text: 'Irrigation chart copied into your Notebook.', once: 'dental_tally' }
      ] }
  ]
};

/* ==========================================================
   ADMINISTRATION, reachable only from the alley, only off shift.
   ========================================================== */
SU.data.zones.ocean_admin = {
  name: 'Administration',
  subtitle: 'Where the park is actually run',
  kind: 'interior',
  w: 22, h: 12,
  base: 'hall',
  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 22, h: 1  },
    { t: 'wall', x: 0,  y: 11, w: 22, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 12 },
    { t: 'wall', x: 21, y: 0,  w: 1,  h: 12 },
    { t: 'wall', x: 4,  y: 3,  w: 1,  h: 6  },
    { t: 'wall', x: 4,  y: 3,  w: 6,  h: 1  },
    { t: 'wall', x: 14, y: 3,  w: 5,  h: 1  },
    { t: 'wall', x: 14, y: 3,  w: 1,  h: 5  },
    { t: 'door', x: 21, y: 5,  w: 1,  h: 1  }
  ],
  spawns: { entry: { x: 20, y: 5 } },
  exits: [
    { x: 21, y: 5, to: 'open_ocean', spawn: 'from_admin', label: 'Service Alley' }
  ],
  props: [
    { t: 'planter', x: 19, y: 1 }, { t: 'planter', x: 19, y: 10 },
    { t: 'bin', x: 2, y: 10 }, { t: 'bench', x: 17, y: 8 },
    { t: 'crate', x: 1, y: 1 },
    { t: 'bench', x: 12, y: 10,
      text: 'A framed photograph the length of the wall: the whole park from the air, taken before ' +
            'the Open Ocean Wing groundworks. There is a lagoon in it that does not exist any more.' }
  ],
  objects: [
    { id: 'admin_boardpack', x: 8, y: 2, kind: 'search', name: 'Board Pack', once: true,
      text: 'A bound board pack left on the meeting table, tabbed and highlighted.\n\n' +
            'TAB 4, OPEN OCEAN WING: PHASE 2 FUNDING. "Phase 2 is contingent on demonstrated ' +
            'breeding capability in the flagship species. Acquisition of a compatible male remains ' +
            'the single largest determinant of valuation."\n\n' +
            'Beside it, in the margin, in biro: "she is the collateral, not the exhibit".',
      effects: [
        { type: 'addEvidence', id: 'ev_wing_boardpack' },
        { type: 'addSuspicion', amount: 10 },
        { type: 'addXP', amount: 70, once: 'ocean_boardpack' },
        { type: 'setFlag', flag: 'found_boardpack', value: true },
        { type: 'toast', text: 'Board pack copied into your Notebook.' }
      ] },

    { id: 'admin_press', x: 2, y: 6, kind: 'sign', name: 'Press Wall',
      text: 'A wall of framed coverage.\n\n' +
            '"SEA UNIVERSE RESCUES STRANDED ORCA: Tempest, found weak and alone off the coast last ' +
            'spring, is thriving in her new home."\n\n' +
            'Every article carries the same photograph and the same three quotes, all of them from ' +
            'the same spokesperson, none of them from a vet.',
      effects: [
        { type: 'addEvidence', id: 'ev_orca_rescue_story' },
        { type: 'toast', text: 'Press wall copied into your Notebook.', once: 'press_wall' }
      ] },

    { id: 'admin_cabinet', x: 18, y: 2, kind: 'search', name: 'Filing Cabinet', once: true,
      text: 'The bottom drawer is the only one not locked, which is how you know it is the boring ' +
            'one. It is full of catering invoices.\n\n' +
            'Underneath the invoices, flat against the base of the drawer, is a single sheet: a ' +
            'company search printout for the holding company that owns the park. Directors listed: ' +
            'one name.\n\n' +
            'BARRY CUDA.',
      effects: [
        { type: 'addEvidence', id: 'ev_cuda_directorship' },
        { type: 'setFlag', flag: 'knows_cuda_name', value: true },
        { type: 'addSuspicion', amount: 8 },
        { type: 'addXP', amount: 90, once: 'cuda_name' },
        { type: 'toast', text: 'You read the name twice.' }
      ] },

    { id: 'admin_terminal', x: 16, y: 6, kind: 'station', name: 'Reception Desk',
      text: 'A monitor left on, showing a seating plan for an event on Friday. Forty covers, a ' +
            'marquee, and a line item reading "TEMPEST VIEWING: CONFIRM ACCESS WITH SECURITY".' }
  ]
};

/* ==========================================================
   SERVICE LEVEL, underground, behind the security officer.
   ========================================================== */
SU.data.zones.deep_service = {
  name: 'Service Level',
  subtitle: 'Under the whole zone, and loud enough that nobody follows you down',
  kind: 'interior',
  w: 24, h: 12,
  base: 'steel',
  rects: [
    { t: 'wall', x: 0,  y: 0,  w: 24, h: 1  },
    { t: 'wall', x: 0,  y: 11, w: 24, h: 1  },
    { t: 'wall', x: 0,  y: 0,  w: 1,  h: 12 },
    { t: 'wall', x: 23, y: 0,  w: 1,  h: 12 },
    { t: 'wall', x: 6,  y: 4,  w: 5,  h: 1  },
    { t: 'wall', x: 15, y: 4,  w: 5,  h: 1  },
    { t: 'wall', x: 11, y: 7,  w: 6,  h: 1  },
    /* TOP WALL, not the bottom: the hatch down from the plaza is entered
       moving DOWN, so the way back up has to be behind you when you land.
       It also reads better, since this door genuinely goes UP a level. */
    { t: 'door', x: 11, y: 0,  w: 2,  h: 1  },
    /* The tunnel south. It was always here; it was always sealed. */
    { t: 'door', x: 0,  y: 6,  w: 1,  h: 1  }
  ],
  spawns: { entry: { x: 11, y: 1 }, from_deep: { x: 1, y: 6 } },
  exits: [
    { x: 11, y: 0, w: 2, h: 1, to: 'open_ocean', spawn: 'from_service', label: 'Up to the plaza' },

    /* THE WAY INTO ZONE 5. The Deep is unlisted and has no gate you can
       open from the park side, so the only first approach is underneath
       it: you walk out of the bottom of Open Ocean without ever going
       outside. Gated on the Open Ocean case being closed, because that is
       the conversation where Wren tells you the place exists. */
    {
      x: 0, y: 6, to: 'the_deep', spawn: 'from_tunnel', label: 'The Deep',
      condition: { quest: { q_ocean_case: 'completed' } },
      lockedText: 'A steel door in the west wall with no handle and a laminated sheet: SOUTH SITE ' +
                  'ACCESS: AUTHORISED PERSONNEL. The paint around the frame is worn where people ' +
                  'have gone through it, which is more than you can say for most of the doors here.'
    }
  ],
  props: [
    { t: 'pipe', x: 1, y: 2 }, { t: 'pipe', x: 1, y: 3 }, { t: 'pipe', x: 1, y: 8 },
    { t: 'pipe', x: 22, y: 2 }, { t: 'pipe', x: 22, y: 8 }, { t: 'pipe', x: 22, y: 9 },
    { t: 'barrel', x: 3, y: 9 }, { t: 'barrel', x: 4, y: 9 },
    { t: 'pallet', x: 20, y: 9 }, { t: 'crate', x: 19, y: 9 },
    { t: 'trolley', x: 6, y: 6 }, { t: 'bin', x: 18, y: 2 },
    { t: 'mast', x: 13, y: 6 },
    { t: 'pipe', x: 8, y: 2,
      text: 'The main lagoon return. You can put your hand flat on it and feel the pumps beating ' +
            'through the steel. Somebody has chalked a wavering line along the lagging and written ' +
            '"THIS IS THE LEVEL. IT SHOULD NOT MOVE."' },

    /* Playtest signpost, 2026-08-05: the west door is the only way into
       Zone 5 and it is a single tile in the corner of a room people come
       to for the paperwork. This makes the wall itself tell you. */
    { t: 'pipe', x: 2, y: 4,
      text: 'The pipe runs do not stop at this wall. Four of them turn and go straight through it, ' +
            'heading south, under the boundary of the zone and out towards whatever is on the other ' +
            'side.\n\n' +
            'Somebody has stencilled the same three words above each one: SOUTH SITE FEED.\n\n' +
            'There is a door in this wall, further along.' }
  ],
  objects: [
    { id: 'service_plant', x: 3, y: 2, kind: 'station', name: 'Life Support Plant',
      text: 'Pumps, sand filters, ozone. The whole zone breathes through this room and it is ' +
            'immaculate: someone down here is doing their job to a standard the rest of the park ' +
            'is not being held to.' },

    { id: 'service_ledger', x: 20, y: 2, kind: 'search', name: 'Movements Folder', once: true,
      text: 'A lever arch folder on a shelf above the ozone rig, where paper stays dry and nobody ' +
            'has a reason to look.\n\n' +
            'It is the movements paperwork the office copies do not have. Every animal in and out ' +
            'of this zone for four years, with the receiving facilities named in full rather than ' +
            'by code.\n\n' +
            'Two of the codes you copied in Coral Kingdom are in here with names against them. ' +
            'Neither is a rescue centre. Both are breeding facilities.',
      effects: [
        { type: 'addEvidence', id: 'ev_movements_folder' },
        { type: 'setFlag', flag: 'found_movements', value: true },
        { type: 'addSuspicion', amount: 9 },
        { type: 'addXP', amount: 90, once: 'ocean_movements' },
        { type: 'toast', text: 'Movements folder copied into your Notebook.' }
      ] },

    { id: 'service_orcalog', x: 8, y: 9, kind: 'search', name: 'Sound Level Log', once: true,
      text: 'A dot-matrix printer chattering away to itself in the corner, logging sound levels ' +
            'from a hydrophone somebody has run into the Meridian pool.\n\n' +
            'The trace is flat for weeks. Then, three times, a spike: loud, brief, and at the exact ' +
            'time the stadium speakers were being commissioned upstairs.\n\n' +
            'A pencilled note on the fanfold: "she stopped after the third one. F.N."',
      effects: [
        { type: 'addEvidence', id: 'ev_hydrophone_trace' },
        { type: 'addXP', amount: 55, once: 'ocean_hydrophone' },
        { type: 'toast', text: 'Hydrophone trace copied into your Notebook.' }
      ] },

    { id: 'service_spares', x: 16, y: 9, kind: 'search', name: 'Spares Shelf',
      text: 'Filter cartridges, gaskets, and a coffee tin of assorted washers.',
      loot: [{ item: 'sea_glass', chance: 0.3 }, { item: 'coffee', chance: 0.6 }] }
  ]
};
