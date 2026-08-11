/* ============================================================
   SEA UNIVERSE: AQUAWORD (arcade game 1) - THE WORD LIST

   Twenty words. Kept in data, not in the game code, so the list can
   be edited, trimmed or extended by anyone without touching logic.

   TWO RULES FOR ADDING A WORD:
     1. LETTERS ONLY, no spaces or hyphens, and 4 to 8 long. The grid
        is built from the word's own length, so mixed lengths are fine,
        but a very long word makes a cramped row on a phone.
     2. THE DEFINITION MUST STAND ALONE and be true. After the player
        solves the word they pick its definition out of four, and the
        three wrong ones are simply other entries' definitions. That
        means every definition here is also a distractor somewhere
        else, so a vague one ("a type of whale") makes the matching
        round unfair rather than hard.

   The biology is the point, not decoration: these are the same facts
   the care sessions and the species dex teach.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

SU.data.aquawordWords = [
  { word: 'BALEEN',
    def: 'Fringed plates of keratin hanging from the upper jaw, used to strain small prey out of the water.' },
  { word: 'BLUBBER',
    def: 'The thick fat layer under the skin that insulates the body, stores energy and adds buoyancy.' },
  { word: 'FLUKE',
    def: 'One of the two horizontal tail lobes a whale beats up and down to drive itself forward.' },
  { word: 'MELON',
    def: 'The fatty forehead organ a toothed whale reshapes to aim the sound it sends out.' },
  { word: 'SONAR',
    def: 'Locating objects by sending out sound and listening for the echo that returns.' },
  { word: 'KRILL',
    def: 'Small shrimp-like crustaceans eaten in enormous quantities by the largest whales.' },
  { word: 'CALF',
    def: 'A young whale, dolphin, dugong or walrus, still dependent on its mother.' },
  { word: 'MOULT',
    def: 'The seasonal shedding and regrowth of fur or skin, which some seals do hauled out on ice.' },
  { word: 'WALRUS',
    def: 'A large Arctic pinniped whose upper canine teeth grow into tusks it hauls out with.' },
  { word: 'BELUGA',
    def: 'A white Arctic toothed whale with a flexible forehead and an unusually varied voice.' },
  { word: 'DUGONG',
    def: 'A seagrass-grazing sirenian with a broad downturned snout, found in warm shallow coastal water.' },
  { word: 'FLIPPER',
    def: 'A flattened steering limb that contains the same arm and finger bones as a human hand.' },
  { word: 'PINNIPED',
    def: 'The group containing seals, sea lions and the walrus: carnivores with four flippers.' },
  { word: 'CETACEAN',
    def: 'The group containing every whale, dolphin and porpoise.' },
  { word: 'SIRENIAN',
    def: 'The group containing dugongs and manatees, the only plant-eating marine mammals.' },
  { word: 'BREACH',
    def: 'Leaping clear of the surface and landing back on the water with a slam.' },
  { word: 'SPYHOP',
    def: 'Rising vertically to hold the head above the surface and look around.' },
  { word: 'STRAND',
    def: 'To come ashore alive and be unable to get back out to sea.' },
  { word: 'WHISKER',
    def: 'A stiff facial hair sensitive enough to feel the trail a swimming fish left behind.' },
  { word: 'ROOKERY',
    def: 'A crowded stretch of shore where seals or sea lions gather to breed.' }
];
