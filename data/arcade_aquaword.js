/* ============================================================
   SEA UNIVERSE: AQUAWORD (arcade game 1) - THE WORD LIST

   REBUILT 2026-08-11 to be an actual Wordle: every word is 4 OR 5
   LETTERS, no exceptions. The original 20-word list ran from 4 to 8
   letters, and the longer entries (PINNIPED, CETACEAN, SIRENIAN,
   WHISKER, ROOKERY...) were the ones students got stuck on, since a
   real Wordle-shaped grid and keyboard only reads correctly at a
   fixed, familiar length. Six of the original twenty already fit
   (CALF, KRILL, FLUKE, MELON, SONAR, MOULT) and are kept as-is; the
   rest were dropped for being too long, which left the list too
   short on its own, so it was bulked back out to 22 with broader
   OCEAN vocabulary rather than only marine-mammal terms (ORCA, SEAL,
   SQUID, ALGAE, KELP, REEF, TUSK, GILL, TIDE, SPOUT, OTTER, SHARK,
   WHALE, ATOLL, BRINE, CORAL) - still the same subject, just not
   gatekept to mammals specifically.

   TWO RULES FOR ADDING A WORD:
     1. LETTERS ONLY, no spaces or hyphens, and EXACTLY 4 OR 5 LONG.
        The grid and the on-screen keyboard are both sized for that
        range; a 6+ letter word would run off the row.
     2. THE DEFINITION MUST STAND ALONE and be true. After the player
        solves the word they pick its definition out of four, and the
        three wrong ones are simply other entries' definitions. That
        means every definition here is also a distractor somewhere
        else, so a vague one ("a type of whale") makes the matching
        round unfair rather than hard.

   The biology is the point, not decoration: these are the same facts
   the care sessions and the species dex teach. Several definitions
   deliberately match an existing species.js fact word for word (ORCA,
   SEAL, OTTER) so a player who has met that fact once recognises it
   again here rather than meeting a second, subtly different claim.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

SU.data.aquawordWords = [
  { word: 'CALF',
    def: 'A young whale, dolphin, dugong or walrus, still dependent on its mother.' },
  { word: 'KRILL',
    def: 'Small shrimp-like crustaceans eaten in enormous quantities by the largest whales.' },
  { word: 'FLUKE',
    def: 'One of the two horizontal tail lobes a whale beats up and down to drive itself forward.' },
  { word: 'MELON',
    def: 'The fatty forehead organ a toothed whale reshapes to aim the sound it sends out.' },
  { word: 'SONAR',
    def: 'Locating objects by sending out sound and listening for the echo that returns.' },
  { word: 'MOULT',
    def: 'The seasonal shedding and regrowth of fur or skin, which some seals do hauled out on ice.' },
  { word: 'ORCA',
    def: 'The largest member of the dolphin family, found in every ocean on Earth.' },
  { word: 'SEAL',
    def: 'A pinniped with no external ear flaps, one way to tell it apart from a sea lion.' },
  { word: 'SQUID',
    def: 'A fast-swimming, tentacled mollusc that jets through the water and can change colour in an instant.' },
  { word: 'ALGAE',
    def: 'Simple, mostly aquatic organisms that photosynthesise, from single cells to giant kelp.' },
  { word: 'KELP',
    def: 'A large brown seaweed that grows in dense underwater forests along cool coastlines.' },
  { word: 'REEF',
    def: 'A ridge of coral, rock or sand lying at or just under the surface of the sea.' },
  { word: 'TUSK',
    def: 'An enlarged tooth that grows outside the mouth, as seen on a walrus or a narwhal.' },
  { word: 'GILL',
    def: 'The organ a fish uses to pull dissolved oxygen out of the water.' },
  { word: 'TIDE',
    def: 'The regular rise and fall of sea level caused by the pull of the Moon and Sun.' },
  { word: 'SPOUT',
    def: 'The visible burst of air and moisture a whale exhales through its blowhole.' },
  { word: 'OTTER',
    def: 'A carnivorous mammal; the sea otter is one of the few marine mammals known to use tools.' },
  { word: 'SHARK',
    def: 'A cartilaginous fish, with a skeleton made of cartilage rather than bone.' },
  { word: 'WHALE',
    def: 'A large marine mammal; some species filter feed with baleen, others hunt with teeth.' },
  { word: 'ATOLL',
    def: 'A ring-shaped coral reef or string of islands surrounding a central lagoon.' },
  { word: 'BRINE',
    def: 'Water heavily saturated with salt, far saltier than ordinary seawater.' },
  { word: 'CORAL',
    def: 'A colonial animal that builds a hard skeleton, which together with countless others forms a reef.' }
];
