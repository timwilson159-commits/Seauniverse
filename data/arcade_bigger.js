/* ============================================================
   SEA UNIVERSE: BIGGER OR SMALLER (arcade game 3) - THE NUMBERS

   The only game of the six that needed new content. Nothing in the
   species dex carried a measurement, so these 60 figures are new.

   WHAT THESE NUMBERS ARE, and it matters for a teaching game:
   TYPICAL ADULT values, rounded, not records. A blue whale is listed
   at 26 m because that is a normal large adult, not because none has
   ever been longer. Where males and females differ sharply (sea lion,
   walrus, orca) the figure is a representative adult rather than an
   average of the two, because a number a student can picture is worth
   more here than a statistically tidy one nobody would recognise.

   THREE STATS ON PURPOSE. Length and mass are universal, unambiguous
   and well documented for every animal in the park. Lifespan is the
   one that earns its place pedagogically: it breaks the assumption
   the other two build, that bigger always means more. A giant
   cuttlefish is a substantial animal that lives about two years; a
   Port Jackson shark is small and lives thirty.

   Dive depth, swimming speed and gestation were considered and left
   out: none of them is meaningful for all twenty, and a stat that has
   to be skipped for the cuttlefish, the turtle and both sharks makes
   the round-picking code more complicated than the game is worth.

   TWO CAVEATS WORTH KEEPING:
   - `reef_manta` length is DISC WIDTH, which is how mantas are always
     measured. Its label says so.
   - `green_turtle` length is CARAPACE length, likewise.

   ADDING A SPECIES: give it all three stats or leave it out entirely.
   The game filters to species that carry a full set, so a half-filled
   entry silently disappears rather than breaking a round.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

/* The three stats. `ask` is the question wording, `more`/`less` are
   the button labels, and `fmt` turns a raw number into something a
   student reads rather than parses. */
SU.data.biggerStats = {
  length: {
    label: 'Length',
    ask: 'Longer or shorter?',
    more: 'Longer', less: 'Shorter',
    note: 'typical adult',
    fmt: v => (v < 1 ? (v * 100).toFixed(0) + ' cm' : v + ' m')
  },
  mass: {
    label: 'Mass',
    ask: 'Heavier or lighter?',
    more: 'Heavier', less: 'Lighter',
    note: 'typical adult',
    fmt: v => (v >= 1000 ? (v / 1000).toLocaleString() + ' tonnes' : v.toLocaleString() + ' kg')
  },
  lifespan: {
    label: 'Lifespan',
    ask: 'Lives longer or shorter?',
    more: 'Longer', less: 'Shorter',
    note: 'typical maximum',
    fmt: v => v + ' years'
  }
};

/* length: metres. mass: kilograms. lifespan: years. */
SU.data.biggerStatsBySpecies = {
  harbor_seal:         { length: 1.7,  mass: 90,     lifespan: 30 },
  california_sea_lion: { length: 2.2,  mass: 300,    lifespan: 25 },
  sea_otter:           { length: 1.2,  mass: 27,     lifespan: 20 },
  bottlenose_dolphin:  { length: 2.8,  mass: 250,    lifespan: 45 },
  green_turtle:        { length: 1.1,  mass: 160,    lifespan: 70 },
  grey_nurse_shark:    { length: 2.7,  mass: 160,    lifespan: 25 },
  giant_cuttlefish:    { length: 0.6,  mass: 10,     lifespan: 2  },
  port_jackson_shark:  { length: 1.1,  mass: 18,     lifespan: 30 },
  walrus:              { length: 3.1,  mass: 1200,   lifespan: 40 },
  beluga:              { length: 4.2,  mass: 1400,   lifespan: 50 },
  harp_seal:           { length: 1.7,  mass: 130,    lifespan: 35 },
  orca:                { length: 7.0,  mass: 5000,   lifespan: 60 },
  pilot_whale:         { length: 5.5,  mass: 2500,   lifespan: 45 },
  common_dolphin:      { length: 2.3,  mass: 90,     lifespan: 35 },
  reef_manta:          { length: 4.0,  mass: 700,    lifespan: 40 },
  blue_whale:          { length: 26,   mass: 140000, lifespan: 85 },
  humpback_whale:      { length: 14,   mass: 30000,  lifespan: 50 },
  sperm_whale:         { length: 16,   mass: 40000,  lifespan: 65 },
  false_killer_whale:  { length: 5.0,  mass: 1500,   lifespan: 60 },
  dugong:              { length: 3.0,  mass: 400,    lifespan: 70 }
};

/* Where a measurement is not the obvious one, say so on the card. */
SU.data.biggerStatNotes = {
  reef_manta:   { length: 'disc width' },
  green_turtle: { length: 'carapace' }
};
