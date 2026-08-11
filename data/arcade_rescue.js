/* ============================================================
   SEA UNIVERSE: RESCUE! (arcade game 2) - THE WORD LIST

   Seventeen entries. Kept in data, not in the game code, same reason
   as AQUAWORD's list: anyone can edit, trim or extend this without
   touching the hangman logic.

   THREE RULES FOR ADDING AN ENTRY:
     1. LETTERS ONLY, no spaces or hyphens, same constraint AQUAWORD
        uses and for the same reason: the game guesses one letter at a
        time against the whole word, and a space or hyphen is not a
        letter a player can guess.
     2. THE QUESTION HAS EXACTLY ONE `correct: true` OPTION, same shape
        as a care encounter's `options`. The three wrong ones must be
        plausible, not jokes: a distractor that is obviously silly
        teaches nothing about telling the real answer apart from a
        close one.
     3. NONE OF THESE WORDS DUPLICATE data/arcade_aquaword.js. The two
        cabinets run the same shape of game (solve a word, then answer
        a question about it) and sharing a word between them would make
        the second cabinet feel like a rerun of the first.

   The biology is the point, not decoration, same as everywhere else:
   these are the same facts the species dex and the care sessions
   teach, just reached through a different word.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

SU.data.rescueWords = [
  { word: 'NARWHAL',
    question: 'A narwhal’s long spiral "tusk" is actually what?',
    options: [
      { text: 'An overgrown, forward-growing tooth', correct: true },
      { text: 'A modified whisker' },
      { text: 'A fused pair of ribs' },
      { text: 'A hardened fin spine' }
    ] },
  { word: 'MANATEE',
    question: 'What is a manatee’s closest living relative?',
    options: [
      { text: 'The elephant', correct: true },
      { text: 'The dolphin' },
      { text: 'The sea otter' },
      { text: 'The green turtle' }
    ] },
  { word: 'PORPOISE',
    question: 'What is the clearest way to tell a porpoise from a dolphin?',
    options: [
      { text: 'Porpoises have spade-shaped teeth and no beak', correct: true },
      { text: 'Porpoises are always bigger' },
      { text: 'Porpoises live only in rivers' },
      { text: 'Porpoises cannot make any sound' }
    ] },
  { word: 'TUSK',
    question: 'Which animal uses its tusks mainly to haul its body out onto ice, not to dig or fight?',
    options: [
      { text: 'The walrus', correct: true },
      { text: 'The narwhal' },
      { text: 'The elephant seal' },
      { text: 'The dugong' }
    ] },
  { word: 'ROSTRUM',
    question: 'What is a dolphin’s "rostrum"?',
    options: [
      { text: 'Its beak-shaped snout', correct: true },
      { text: 'Its blowhole' },
      { text: 'Its dorsal fin' },
      { text: 'The fatty melon on its forehead' }
    ] },
  { word: 'LANUGO',
    question: 'What is "lanugo" on a newborn harp seal pup?',
    options: [
      { text: 'The white coat it is born with, moulted within about two weeks', correct: true },
      { text: 'A layer of blubber it is born without' },
      { text: 'Its first set of teeth' },
      { text: 'A breathing hole it digs in the ice' }
    ] },
  { word: 'CHROMATOPHORE',
    question: 'What does a cuttlefish use chromatophores for?',
    options: [
      { text: 'Changing colour and skin texture in under a second', correct: true },
      { text: 'Detecting sound underwater' },
      { text: 'Storing extra oxygen for a dive' },
      { text: 'Filtering plankton out of the water' }
    ] },
  { word: 'ECHOLOCATION',
    question: 'Which group of marine mammals hunts using echolocation?',
    options: [
      { text: 'Toothed whales and dolphins', correct: true },
      { text: 'Baleen whales' },
      { text: 'Sirenians (dugongs and manatees)' },
      { text: 'Sea otters' }
    ] },
  { word: 'KERATIN',
    question: 'A whale’s baleen plates are made of the same material as what, in a human?',
    options: [
      { text: 'Fingernails and hair', correct: true },
      { text: 'Tooth enamel' },
      { text: 'Bone' },
      { text: 'Skin' }
    ] },
  { word: 'STEREOTYPY',
    question: 'What does repetitive "stereotypic" behaviour in a captive animal usually point to?',
    options: [
      { text: 'A barren or unsuitable environment', correct: true },
      { text: 'A calm, healthy animal' },
      { text: 'A normal breeding instinct' },
      { text: 'Ordinary play' }
    ] },
  { word: 'HAULOUT',
    question: 'Why do walruses "haul out" onto land or ice?',
    options: [
      { text: 'To rest and warm up, flushing blood back to the skin', correct: true },
      { text: 'Only to give birth' },
      { text: 'Only to escape predators' },
      { text: 'To help digest food faster' }
    ] },
  { word: 'BLOWHOLE',
    question: 'What is a whale’s blowhole?',
    options: [
      { text: 'A modified nostril on top of the head, used to breathe', correct: true },
      { text: 'An organ used for hearing' },
      { text: 'A gland that produces oil' },
      { text: 'A hole used to filter food' }
    ] },
  { word: 'MATRILINE',
    question: 'What is special about an orca "matriline"?',
    options: [
      { text: 'It has its own dialect of calls, learned from the mother', correct: true },
      { text: 'It refers to a lone male travelling alone' },
      { text: 'It is the name for a pod’s territory' },
      { text: 'It only forms during migration' }
    ] },
  { word: 'SIGNATURE',
    question: 'What is a dolphin’s "signature whistle"?',
    options: [
      { text: 'A unique sound that works like the dolphin’s own name', correct: true },
      { text: 'A warning call given only before an attack' },
      { text: 'A sound made only by calves' },
      { text: 'A whistle used only during storms' }
    ] },
  { word: 'SPERMACETI',
    question: 'What does the spermaceti organ in a sperm whale’s head do?',
    options: [
      { text: 'Focuses echolocation clicks into a beam', correct: true },
      { text: 'Stores extra oxygen for deep dives' },
      { text: 'Produces milk for a calf' },
      { text: 'Regulates the whale’s body temperature' }
    ] },
  { word: 'CEPHALOPOD',
    question: 'Which group does a cuttlefish belong to?',
    options: [
      { text: 'Cephalopod', correct: true },
      { text: 'Crustacean' },
      { text: 'Echinoderm' },
      { text: 'Elasmobranch' }
    ] },
  { word: 'BYCATCH',
    question: 'What does "bycatch" mean?',
    options: [
      { text: 'Marine animals unintentionally caught in fishing gear meant for other species', correct: true },
      { text: 'A whale that strands itself on a beach' },
      { text: 'An animal that scavenges discarded fish' },
      { text: 'A shark that follows fishing boats for food' }
    ] }
];
