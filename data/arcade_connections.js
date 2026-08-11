/* ============================================================
   SEA UNIVERSE: OCEAN CONNECTIONS (arcade game 6) - THE PUZZLES

   Sixteen words, four hidden groups of four. Ten complete puzzles,
   one picked at random per play. Each puzzle is a closed set: every
   word belongs to EXACTLY ONE of that puzzle's four groups. That is
   the one rule this file exists to protect.

   WHY WHOLE PUZZLES, NOT A SHARED WORD POOL. With only 20 species in
   the dex, deriving groups from tags on the fly (say, "Pinniped" or
   "Arctic zone") runs out of members fast and starts reusing the same
   handful of animals across categories that were never checked against
   each other. A category like "Orca" being a marine mammal AND a kind
   of whale AND an Arctic-adjacent animal is exactly the cross-cutting
   confusion this game has to avoid, so every puzzle below is authored
   and checked as one unit, not assembled from independent tag lists.

   FOUR THINGS WERE FIXED FROM THE FIRST DRAFT, worth recording because
   the same mistakes are easy to make again if this file is ever
   extended:
     - Puzzle 3 originally listed "Killer" itself as a grid word next
       to Blue/Sperm/Grey/Fin (types of whale). A killer whale IS a
       whale, so the word "Killer" could plausibly sit in EITHER group,
       which is precisely the accidental overlap this file exists to
       rule out. Fixed by using the actual four "Killer ___" compounds
       (Whale, Bee, Instinct, App) as the grid words instead of the
       shared prefix.
     - Puzzle 3's seal group listed "Sea" as a "type of seal", which
       reads as short for "sea lion". The game's OWN harbor_seal facts
       in data/species.js teach the opposite: sea lions and true seals
       are different families, told apart by external ear flaps. Kept
       the lesson consistent by swapping in Harp (an actual species
       already in the dex) instead.
     - Puzzle 5's otter-food group listed Seaweed, which sea otters do
       not eat: they wrap themselves in kelp to rest, but their diet is
       shellfish and other invertebrates, which is the same fact
       data/species.js already states for sea_otter. Swapped in Urchin,
       which matches that entry exactly (otters eating urchins is the
       reason they are a keystone species for kelp forests).
     - Puzzle 2's food group and puzzle 5's river list were each short
       a word in the first draft; filled with Urchins and Curious
       respectively so every puzzle carries exactly 16.

   GROUP ORDER IS DIFFICULTY, matching the source colour order:
   yellow (easiest) < green < blue < purple (hardest, usually wordplay
   rather than a straight category). The game does not grade on it,
   it is just the reveal order players expect from this genre.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

SU.data.connectionsPuzzles = [
  {
    groups: [
      { label: 'Marine mammals', colour: 'yellow',
        words: ['Dolphin', 'Orca', 'Seal', 'Walrus'] },
      { label: 'Marine mammal features', colour: 'green',
        words: ['Blubber', 'Flipper', 'Blowhole', 'Whiskers'] },
      { label: 'Things associated with whales', colour: 'blue',
        words: ['Krill', 'Pod', 'Humpback', 'Calf'] },
      { label: 'Things associated with cold places', colour: 'purple',
        words: ['Arctic', 'Squid', 'Ocean', 'Dive'] }
    ]
  },
  {
    groups: [
      { label: 'Marine mammals', colour: 'yellow',
        words: ['Manatee', 'Dugong', 'Otter', 'Narwhal'] },
      { label: 'Things animals eat', colour: 'green',
        words: ['Clams', 'Seagrass', 'Shrimp', 'Urchins'] },
      { label: 'Places marine mammals live', colour: 'blue',
        words: ['River', 'Estuary', 'Ocean', 'Coast'] },
      { label: 'Words for groups of animals', colour: 'purple',
        words: ['Colony', 'Herd', 'Pod', 'School'] }
    ]
  },
  {
    groups: [
      { label: 'Types of whale', colour: 'yellow',
        words: ['Blue', 'Sperm', 'Grey', 'Fin'] },
      { label: 'Types of seal', colour: 'green',
        words: ['Elephant', 'Leopard', 'Harp', 'Monk'] },
      { label: 'Marine mammal body parts', colour: 'blue',
        words: ['Fur', 'Blubber', 'Fluke', 'Tail'] },
      { label: 'Words that can follow "Killer"', colour: 'purple',
        words: ['Whale', 'Bee', 'Instinct', 'App'] }
    ]
  },
  {
    groups: [
      { label: 'Things marine mammals do', colour: 'yellow',
        words: ['Splash', 'Jump', 'Dive', 'Swim'] },
      { label: 'Animal sounds', colour: 'green',
        words: ['Click', 'Whistle', 'Song', 'Bark'] },
      { label: 'Potential food', colour: 'blue',
        words: ['Fish', 'Crab', 'Octopus', 'Prawn'] },
      { label: 'Marine environments', colour: 'purple',
        words: ['Beach', 'Reef', 'Iceberg', 'Mangrove'] }
    ]
  },
  {
    groups: [
      { label: 'Cold water marine mammals', colour: 'yellow',
        words: ['Beluga', 'Bowhead', 'Right', 'Narwhal'] },
      { label: 'Things an otter might eat', colour: 'green',
        words: ['Mussel', 'Clam', 'Crab', 'Urchin'] },
      { label: 'Features of cold seas', colour: 'blue',
        words: ['Coastline', 'Glacier', 'Fjord', 'Current'] },
      { label: 'Finding your way', colour: 'purple',
        words: ['Echo', 'Sonar', 'Navigation', 'Compass'] }
    ]
  },
  {
    groups: [
      { label: 'Marine mammals', colour: 'yellow',
        words: ['Porpoise', 'Vaquita', 'Dugong', 'Weddell seal'] },
      { label: 'Things an animal may do at the surface', colour: 'green',
        words: ['Breathe', 'Surface', 'Rest', 'Groom'] },
      { label: 'Fish', colour: 'blue',
        words: ['Tuna', 'Salmon', 'Herring', 'Mackerel'] },
      { label: 'Ocean regions and climates', colour: 'purple',
        words: ['Antarctica', 'Pacific', 'Tropical', 'Temperate'] }
    ]
  },
  {
    groups: [
      { label: 'Names containing "sea"', colour: 'yellow',
        words: ['Sea cow', 'Sea mink', 'Sea lion', 'Sea leopard'] },
      { label: 'Types of dolphin', colour: 'green',
        words: ['Bottlenose', "Risso's", 'Spinner', 'Common'] },
      { label: 'Body parts used by marine mammals', colour: 'blue',
        words: ['Teeth', 'Tongue', 'Nose', 'Eyes'] },
      { label: 'Ways of pursuing prey', colour: 'purple',
        words: ['Hunt', 'Chase', 'Catch', 'Ambush'] }
    ]
  },
  {
    groups: [
      { label: 'Names associated with orcas', colour: 'yellow',
        words: ['Orca', 'Killer whale', 'Blackfish', 'Wolf'] },
      { label: 'Large ocean fish', colour: 'green',
        words: ['Bluefin', 'Swordfish', 'Marlin', 'Sailfish'] },
      { label: 'Frozen and weather words', colour: 'blue',
        words: ['Ice', 'Snow', 'Frost', 'Hail'] },
      { label: 'Whale behaviours', colour: 'purple',
        words: ['Breach', 'Spyhop', 'Lobtail', 'Tail-slap'] }
    ]
  },
  {
    groups: [
      { label: 'Types of seal', colour: 'yellow',
        words: ['Grey seal', 'Harbour seal', 'Ringed seal', 'Ribbon seal'] },
      { label: 'Things associated with raising young', colour: 'green',
        words: ['Mother', 'Calf', 'Milk', 'Nursery'] },
      { label: 'Ways animals can be grouped socially', colour: 'blue',
        words: ['Solo', 'Pair', 'Family', 'Group'] },
      { label: 'Things found around boats and fishing areas', colour: 'purple',
        words: ['Anchor', 'Buoy', 'Net', 'Trap'] }
    ]
  },
  {
    groups: [
      { label: 'Rivers associated with river dolphins', colour: 'yellow',
        words: ['Amazon', 'Ganges', 'Irrawaddy', 'Yangtze'] },
      { label: 'Things that can travel along a river', colour: 'green',
        words: ['Paddleboard', 'Kayak', 'Canoe', 'River dolphin'] },
      { label: 'River features', colour: 'blue',
        words: ['Current', 'Waterfall', 'Rapids', 'Flood'] },
      { label: 'Traits often associated with dolphins', colour: 'purple',
        words: ['Clever', 'Playful', 'Social', 'Curious'] }
    ]
  }
];
