/* ============================================================
   SEA UNIVERSE: THE ARCADE

   An arcade machine in every building. Investigate one to see what
   game it runs, then Play or Leave. Finish a game and it pays out.

   EIGHTEEN MACHINES, SIX GAMES, THREE OF EACH. The count is exact
   and deliberate: there are 19 interiors, and `the_room` (the
   finale venue outside the park) is the one that does not get a
   cabinet, which brings it to a tidy 18. The user chose to keep
   machines everywhere else, including the Post-Mortem Room, having
   been asked about the tone: "doesn't matter if they undermine the vibe."

   SELF-CONTAINED, the same way data/plaques.js is: the table below
   is walked at load time and pushes one object into each zone, so
   no interior file is edited and a new machine is a new ROW.

   THE SPRITE IS `obj_arcade.svg`, NOT `arcade.svg`. js/world.js
   draws objects as `['obj_' + o.id, 'obj_' + o.kind]`, adding the
   prefix itself, so a file called arcade.svg is never requested and
   would silently draw nothing. One file covers all 18 because they
   share the `arcade` KIND, and no machine sets its own art.

   THE MACHINES ARE ALL ON A BOTTOM WALL TILE with the player
   standing above them. Two reasons, both learned the hard way while
   placing the building plaques: a solid tile means the cabinet never
   sits in the middle of a walkable floor, and the BOTTOM wall means
   the sprite draws upward INTO the room. On the top wall (y=0) a
   tall cabinet would extend past the top edge of the map and be
   clipped by the camera.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

/* The six games, chosen by the user from a list of 19 candidates.
   `title` is what the cabinet calls itself and is revealed when the
   player investigates it, which is why the OBJECT is only ever named
   "Arcade Machine": the title is the thing you walk over to find out.

   Each game is implemented in its own file and registers itself with
   SU.Arcade.register(). Until one does, its cabinets are honest about
   being out of service rather than pretending to work. */
SU.data.arcadeGames = {
  aquaword: {
    title: 'AQUAWORD',
    blurb: 'Six guesses at a hidden marine word, then match it to what it means.'
  },
  rescue: {
    title: 'RESCUE!',
    blurb: 'Uncover the animal one letter at a time, then answer one question about it.'
  },
  match_pod: {
    title: 'MATCH THE POD',
    blurb: 'Flip the cards two at a time and find every matching pair.'
  },
  sorting: {
    title: 'SORTING STATION',
    blurb: 'One animal at a time. Pick which group it belongs to. Six of eight scores a win.'
  },
  bigger: {
    title: 'BIGGER OR SMALLER',
    blurb: 'One animal, then another. Guess which way the number goes.'
  },
  connections: {
    title: 'OCEAN CONNECTIONS',
    blurb: 'Sixteen words, four hidden groups. Find all four.'
  }
};

/* zone, tile, and which game that cabinet runs.

   THE GAMES ARE SPREAD ACROSS REGIONS ON PURPOSE. Each of the six
   appears in at least two different parts of the park, so a player
   working in one region is never shown the same cabinet three times,
   and no game is locked behind late-game travel. Coastal Cove has
   only ONE interior in the whole zone, so exactly one game is
   reachable on day one; that is a property of the map, not a choice. */
SU.data.arcadeMachines = [
  // --- Coastal Cove (1 interior) ---
  { zone: 'staff_cove',       x: 1,  y: 13, game: 'aquaword'    },

  // --- Coral Kingdom (4) ---
  { zone: 'staff_coral',      x: 1,  y: 15, game: 'rescue'      },
  { zone: 'reef_hall',        x: 1,  y: 19, game: 'match_pod'   },
  { zone: 'turtle_unit',      x: 1,  y: 13, game: 'sorting'     },
  { zone: 'service_corridor', x: 9,  y: 9,  game: 'bigger'      },

  // --- Arctic Cove (2) ---
  { zone: 'staff_arctic',     x: 1,  y: 13, game: 'connections' },
  { zone: 'cold_store',       x: 1,  y: 11, game: 'aquaword'    },

  // --- Open Ocean (4) ---
  { zone: 'staff_ocean',      x: 1,  y: 13, game: 'rescue'      },
  { zone: 'ocean_stadium',    x: 1,  y: 15, game: 'match_pod'   },
  /* x is 5, not the 1 every other room uses. A solid prop walls off the
     bottom-left corner of this room, so a cabinet at (1,13) had a free
     tile above it that the player cannot actually walk to. The validator
     caught it as unreachable. When placing a machine, "is the next tile
     open" is not the same question as "can the player get there". */
  { zone: 'meridian_pool',    x: 5,  y: 13, game: 'sorting'     },
  { zone: 'ocean_admin',      x: 1,  y: 11, game: 'bigger'      },

  // --- The Deep (7) ---
  { zone: 'deep_service',     x: 1,  y: 11, game: 'connections' },
  { zone: 'staff_deep',       x: 2,  y: 11, game: 'aquaword'    },
  { zone: 'deep_pump',        x: 1,  y: 13, game: 'rescue'      },
  { zone: 'deep_grandstand',  x: 1,  y: 15, game: 'match_pod'   },
  { zone: 'deep_hide',        x: 1,  y: 9,  game: 'sorting'     },
  { zone: 'deep_gatehouse',   x: 1,  y: 11, game: 'bigger'      },
  { zone: 'deep_necropsy',    x: 10, y: 11, game: 'connections' }
];

/* Push one object per machine. The id carries the ZONE, not the game,
   because the payout ledger is keyed on the object id and each cabinet
   should pay once on its own terms even where two run the same game. */
(function installArcade() {
  const Z = SU.data.zones;
  SU.data.arcadeMachines.forEach(m => {
    const z = Z[m.zone];
    if (!z) { console.warn('[SU] arcade machine in unknown zone', m.zone); return; }
    if (!SU.data.arcadeGames[m.game]) { console.warn('[SU] arcade machine with unknown game', m.game); return; }

    (z.objects = z.objects || []).push({
      id: 'arcade_' + m.zone,
      x: m.x, y: m.y,
      kind: 'arcade',
      game: m.game,
      /* Generic on purpose. The title is the reward for investigating. */
      name: 'Arcade Machine'
    });
  });
})();
