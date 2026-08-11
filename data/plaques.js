/* ============================================================
   SEA UNIVERSE: BUILDING PLAQUES

   Every building door on a region map gets a light grey plaque tile
   beside it, readable with E, that says what the building is. The
   buildings are all painted from the same handful of wall tiles and
   look alike from outside, so without this the player has to open a
   door to remember what is behind it.

   SELF-CONTAINED BY CONSTRUCTION. Nothing in here edits a zone file:
   the table below is walked at load time and each entry pushes one
   rect and one object into the region it names. That keeps all
   eighteen plaques in one place to edit, and means a new building
   only ever needs a new ROW.

   LOAD ORDER: this file must come AFTER every zone file in
   index.html, since it writes into zones those files define. It is
   also deliberately loaded after the interiors, because two doors in
   different regions lead to the SAME interior (the Service Level is
   reached from both Open Ocean and The Deep), so plaque ids are keyed
   on the region as well as the target.

   THE PLAQUE TILE IS SOLID, and it is always painted on a tile that
   was already solid wall. Never move one onto a walkable tile: it
   would become an invisible bollard in the middle of a path. Every
   position in the table was checked for three things, and any new row
   must be checked the same way:
     1. the tile there is currently wall or staffwall
     2. no object or prop already occupies it
     3. at least one walkable tile touches it, or the plaque cannot
        be read
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

/* zone, x, y, id suffix, plaque name, and the line under it.
   Keep the text SHORT. This is a sign on a wall, and its whole job is
   to answer "what is this building" from the path. */
SU.data.plaques = [
  // --- 1. Coastal Cove ---
  { zone: 'coastal_cove', x: 8, y: 20, to: 'staff_cove',
    title: 'COVE STAFF BLOCK',
    body: 'Staff only. Lockers, the roster board, and the transit terminal down to the service corridors.' },

  // --- 2. Coral Kingdom ---
  { zone: 'coral_kingdom', x: 9, y: 30, to: 'staff_coral',
    title: 'REEF STAFF BLOCK',
    body: 'Staff only. Water testing bench, roster, and the way down to the corridors.' },
  { zone: 'coral_kingdom', x: 45, y: 21, to: 'reef_hall',
    title: 'GREAT REEF HALL',
    body: 'Public aquarium hall. The big window, the filter room behind it, and most of the school groups.' },
  { zone: 'coral_kingdom', x: 46, y: 30, to: 'turtle_unit',
    title: 'REHABILITATION UNIT',
    body: 'Veterinary. Animals brought in from the wild and, in theory, returned to it. Certificate required.' },
  { zone: 'coral_kingdom', x: 48, y: 5, to: 'service_corridor',
    title: 'SERVICE CORRIDOR',
    body: 'Plant access. Locked. Not a route to anywhere the public is meant to go.' },

  // --- 3. Arctic Cove ---
  { zone: 'arctic_cove', x: 9, y: 26, to: 'staff_arctic',
    title: 'ARCTIC STAFF BLOCK',
    body: 'Staff only. The parka rack is in here, and you will want it before you try the Cold Store.' },
  { zone: 'arctic_cove', x: 39, y: 26, to: 'cold_store',
    title: 'COLD STORE',
    body: 'Frozen feed and cold plant. Kept well below zero. Do not go in dressed for the promenade.' },

  // --- 4. Open Ocean ---
  { zone: 'open_ocean', x: 11, y: 9, to: 'ocean_stadium',
    title: 'BLUE HORIZON STADIUM',
    body: 'Show pool and seating. The show is off. The building is not.' },
  { zone: 'open_ocean', x: 12, y: 35, to: 'staff_ocean',
    title: 'OPEN OCEAN STAFF BLOCK',
    body: 'Staff only. Roster, bench, and the transit terminal.' },
  { zone: 'open_ocean', x: 25, y: 27, to: 'meridian_pool',
    title: 'MERIDIAN HOLDING',
    body: 'Restricted. Keypad access. No public route beyond this point.' },
  { zone: 'open_ocean', x: 52, y: 5, to: 'ocean_admin',
    title: 'ADMINISTRATION',
    body: 'Offices. Trust business, not animal business. Somebody is usually in during a shift.' },
  /* WEST of this door, not east. Vaughn is a STATIC npc standing at
     (48,34), which is the only tile that touches an east-side plaque, and
     `findNearest` prefers whatever is closest: he would have shadowed the
     plaque permanently and it would have looked like a dead sign rather
     than an occupied one. Check for static npcs when placing any new one. */
  { zone: 'open_ocean', x: 46, y: 35, to: 'deep_service',
    title: 'SERVICE LEVEL',
    body: 'Access hatch to the tunnels under the park. They run further south than the map admits.' },

  // --- 5. The Deep ---
  { zone: 'the_deep', x: 10, y: 4, to: 'deep_service',
    title: 'SERVICE LEVEL',
    body: 'The north end of the tunnels. Comes up in Open Ocean, eventually.' },
  { zone: 'the_deep', x: 53, y: 5, to: 'deep_necropsy',
    title: 'POST-MORTEM ROOM',
    body: 'Veterinary. Where an animal goes when the paperwork on it has to be finished.' },
  { zone: 'the_deep', x: 26, y: 40, to: 'deep_pump',
    title: 'PUMP HOUSE',
    body: 'Water plant for the whole quarry. Loud, and the noise tells you more than the gauges do.' },
  { zone: 'the_deep', x: 53, y: 40, to: 'staff_deep',
    title: 'DEEP STAFF BLOCK',
    body: 'Staff only. Roster, safety register, and the transit terminal.' },
  { zone: 'the_deep', x: 61, y: 27, to: 'deep_gatehouse',
    title: 'SEA GATE HOUSE',
    body: 'Controls the sluice between the quarry and open water. Everything large arrives through it.' },
  /* x is 41 and NOT 40, which is the tile you would pick by eye. The
     condemned-stair barrier props sit across (38..40, 39) until
     hz_stair_condemned is repaired, so a plaque at 40 is sealed behind
     them and the validator correctly flagged it as unreachable. At 41 it
     reads from the open quarry floor beside the barrier, which is the
     point: you should be able to learn what a building is WITHOUT
     first being allowed inside it. */
  { zone: 'the_deep', x: 41, y: 40, to: 'deep_grandstand',
    title: 'THE GRANDSTAND',
    body: 'Old public seating from when this was a show pool. Condemned stair, so mind the barrier.' }
];

/* Push each plaque into its zone: one rect, painted after everything
   else so no later wall rect can bury it, and one readable sign.

   The id carries BOTH the region and the target, because `deep_service`
   has a door in two different regions and duplicate object ids across a
   zone would be a real bug. */
(function installPlaques() {
  const Z = SU.data.zones;
  SU.data.plaques.forEach(p => {
    const z = Z[p.zone];
    if (!z) { console.warn('[SU] plaque for unknown zone', p.zone); return; }

    (z.rects = z.rects || []).push({ t: 'plaque', x: p.x, y: p.y, w: 1, h: 1 });

    (z.objects = z.objects || []).push({
      id: 'plaque_' + p.zone + '_' + p.to,
      x: p.x, y: p.y,
      kind: 'sign',
      name: p.title,
      /* `text` is the BODY ONLY. The dialogue box already prints `name` as
         its header, and a sign whose first page repeats its own heading
         costs the player a keypress to read the same words twice. */
      text: p.body
    });
  });
})();
