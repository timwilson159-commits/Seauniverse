/* ============================================================
   SEA UNIVERSE: PROGRESSION
   Ranks, qualifications, achievements, and evidence definitions.
   All of these are pure data, add freely.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

/* Cosmetic rank titles, awarded by level. */
SU.data.ranks = [
  { at: 1,  title: 'Trainee'          },
  { at: 3,  title: 'Junior Trainer'   },
  { at: 6,  title: 'Trainer'          },
  { at: 10, title: 'Senior Trainer'   },
  { at: 15, title: 'Lead Trainer'     },
  { at: 20, title: 'Head of Animal Care' }
];

/* Qualifications gate which animals you're allowed to work with.
   `req` uses the same condition language as everything else. */
SU.data.qualifications = {
  pinniped_basic: {
    name: 'Pinniped Handling I',
    blurb: 'Certified to run supervised care sessions with seals and sea lions.',
    req: { skill: { husbandry: 1 } }
  },
  observation_cert: {
    name: 'Behavioural Observation',
    blurb: 'Trained to record and interpret behavioural indicators.',
    req: { skill: { observation: 2 } }
  },
  vet_assist: {
    name: 'Veterinary Assistant',
    blurb: 'Cleared to assist with health checks and access medical records.',
    req: { skill: { veterinary: 2 } }
  },

  /* --- Coral Kingdom --- */
  cetacean_basic: {
    name: 'Cetacean Handling I',
    blurb: 'Certified to run care sessions with dolphins. Training-heavy: cetacean work is all consent and cues.',
    req: { skill: { training: 2 } }
  },
  aquarist_basic: {
    name: 'Aquarium Systems I',
    blurb: 'Cleared to work the tank gantries and the touch pool. Life support is husbandry with plumbing.',
    req: { skill: { husbandry: 2 } }
  },
  rehab_cert: {
    name: 'Marine Rehabilitation',
    blurb: 'Cleared to work rescued animals and read their clinical files. The only certificate here that ends in a release.',
    req: { skill: { veterinary: 2, observation: 1 } }
  },

  /* --- Arctic Cove ---
     These ask for BREADTH rather than depth on purpose. Skill levels 1
     and 2 are the cheap ones, so a combination keeps Zone 3 feeling like
     progression without quietly pricing students out of the story. */
  cold_water_cert: {
    name: 'Cold Water Handling',
    blurb: 'Certified for walrus and beluga work. Half the job is the animals and half is knowing when a human should get out of the water.',
    req: { skill: { husbandry: 2, veterinary: 1 } }
  },
  life_support_aware: {
    name: 'Life Support Awareness',
    blurb: 'Trained to read chiller and filtration behaviour. In a cold zone the plant room is an animal welfare system wearing a boiler suit.',
    req: { skill: { observation: 2, husbandry: 1 } }
  },

  /* --- Open Ocean ---
     Deliberately built out of levels the player has almost certainly
     already bought for Coral Kingdom and Arctic Cove. A student who did
     the earlier zones properly walks into Zone 4 already certified,
     which is the reward for having done them properly. */
  pelagic_cert: {
    name: 'Open Water Handling',
    blurb: 'Certified for orca, pilot whale and large open-water cetacean work. Everything in this zone is bigger than you and most of it is smarter than the enclosure.',
    req: { skill: { husbandry: 2, training: 2, observation: 1 } }
  },
  sound_aware: {
    name: 'Acoustic Awareness',
    blurb: 'Trained to treat sound as a welfare factor. Cetaceans live by hearing, so noise is not an inconvenience in this job, it is an exposure.',
    req: { skill: { observation: 2, veterinary: 1 } }
  }
};

/* Evidence: the Notebook contents.
   type: welfare | financial | testimonial | pr
   Set `conspiracy:true` for the pieces that build the main thread. */
SU.data.evidence = {
  ev_pearl_stereotypy: {
    type: 'welfare', title: 'Stereotypic Circling: Pearl',
    text: 'Pearl (harbour seal) performs an identical repeated swim circuit for hours. Recognised indicator of an under-stimulating environment.'
  },
  ev_show_pressure: {
    type: 'welfare', title: 'Show Refusal: Bruno',
    text: 'Bruno refused to enter the show pool. Staff were instructed to "get him out there anyway". Welfare came second to the schedule.'
  },
  ev_water_quality_log: {
    type: 'welfare', title: 'Otter Pool Water Fault',
    text: 'Oily film at the filter outlet in the otter pool. Repair request logged three times. Still open.'
  },
  ev_brochure_claim: {
    type: 'pr', title: 'Park Brochure: "Conservation First"',
    text: '"Every animal at Sea Universe is here because it cannot survive in the wild. We are a rescue and conservation facility first."',
    contradictedBy: ['ev_transfer_manifest', 'ev_dolphin_studbook', 'ev_turtle_origin'],
    conspiracy: true
  },
  ev_transfer_manifest: {
    type: 'financial', title: 'Transfer Manifest #4471',
    text: 'Movement record for two captive-BORN sea lions, listed as outbound to an overseas facility. Neither animal was ever a rescue.',
    conspiracy: true
  },
  ev_sable_testimony: {
    type: 'testimonial', title: 'Sable: What She Saw',
    text: 'A former volunteer says pool renovations were cancelled the same week a new breeding enclosure was approved.',
    conspiracy: true
  },

  /* --- Coral Kingdom --- */
  ev_conservation_wall: {
    type: 'pr', title: 'Conservation Wall: "100% of Profits"',
    text: '"127 animals rescued. 41 returned to the wild. 100% of our profits support conservation*." ' +
          'The asterisk leads to a four-point footnote: "of our designated conservation fund."',
    contradictedBy: ['ev_dolphin_studbook', 'ev_turtle_origin', 'ev_water_falsified'],
    conspiracy: true
  },
  ev_margo_directive: {
    type: 'pr', title: 'Approved Language Memo',
    text: 'Guest Experience memo listing words staff may and may not use. "If a guest asks about water quality, ' +
          'the answer is that it is tested daily and is excellent. Do not elaborate."',
    contradictedBy: ['ev_water_falsified']
  },
  ev_dolphin_studbook: {
    type: 'financial', title: 'Cetacean Breeding Studbook',
    text: 'Fourteen births on site, four surviving calves currently held, one sire throughout. Entry 14: a fifth calf, ' +
          'female, transferred out at nine months to a facility recorded only as a code.',
    conspiracy: true
  },
  ev_water_falsified: {
    type: 'financial', title: 'Water Quality Logs: Six Clean Weeks',
    text: 'Daily water quality sheets for the whole complex, all in range, all in one hand and one pen, including' +
          'four days when the pumps were offline for repair.',
    conspiracy: true
  },
  ev_turtle_origin: {
    type: 'financial', title: 'Kira\'s File: "Found Floating"',
    text: 'Admission lists Kira as a beach rescue; the source field lists hatchery stock, batch 14. Release assessment ' +
          'deferred six times. Latest note: "Retain: flagship animal for the Open Ocean Wing campaign."',
    conspiracy: true
  },
  ev_dolphin_rakes: {
    type: 'welfare', title: 'Rake Injuries: Nyari',
    text: 'Repeated tooth-rake injuries on a subordinate female in a lagoon with no visual barrier and no retreat space. ' +
          'Normal behaviour; abnormal enclosure.'
  },
  ev_show_noise: {
    type: 'welfare', title: 'Stadium Audio: Station Refusals',
    text: 'All four dolphins stopped stationing at the west gate the week the stadium sound system was upgraded. ' +
          'Same contractor, same month as the cove stadium.',
    contradictedBy: ['ev_show_pressure']
  },
  ev_turtle_plastic: {
    type: 'welfare', title: 'Plastic Ingestion: Kira',
    text: 'Positive buoyancy consistent with gas trapped behind a gut obstruction. Soft plastic fragments recovered ' +
          'from the rehab pool filter basket.'
  },
  ev_cuttle_welfare: {
    type: 'welfare', title: 'Barren Tank: Cuttlefish',
    text: 'A giant cuttlefish held in sand, one artificial plant and no shelter, in a high-traffic gallery. ' +
          'Cephalopod enrichment is a recognised welfare requirement, not decoration.'
  },
  ev_touchpool: {
    type: 'welfare', title: 'Touch Pool: No Closed Periods',
    text: 'Touch pool run continuously from opening with no session limits and no protected refuge. Elevated ' +
          'respiration and prolonged hiding in the resident Port Jackson shark.'
  },
  ev_ibrahim_testimony: {
    type: 'testimonial', title: 'Ibrahim: Twenty Years of It',
    text: 'A volunteer of twenty years: the old lagoon was drained for the Open Ocean Wing groundworks, the release ' +
          'programme was quietly folded into "guest experience", and the animals that left were never listed.',
    conspiracy: true
  },

  /* --- Arctic Cove --- */
  ev_walrus_tusks: {
    type: 'welfare', title: 'Tusk Wear: Nuka',
    text: 'Repeated tusk abrasion against a fixed section of pool wall. Sealed concrete floor, no substrate to rake ' +
          'and no legitimate outlet for a natural foraging and hauling behaviour.'
  },
  ev_walrus_haulout: {
    type: 'welfare', title: 'Haul-Out Blocked: Nuka',
    text: 'Haul-out apron resurfaced smoother and steeper. Six days of failed attempts recorded in the session notes ' +
          'as "lazy, low motivation". Thermoregulation and rest both depend on the animal being able to leave the water.'
  },
  ev_beluga_moult: {
    type: 'welfare', title: 'Interrupted Moult: Sisu',
    text: 'Pool held at a constant four degrees year round with no abrasive substrate. Annual moult cannot be completed; ' +
          'the animal has worn one flank raw on the only rough seam available to her.'
  },
  ev_beluga_song: {
    type: 'welfare', title: 'Learned Machine Tone: Beluga Pair',
    text: 'Both belugas producing a flat tone matching the frequency of Chiller 2. Belugas are vocal learners. In a pool ' +
          'of two animals, the plant room has become the loudest thing available to copy.'
  },
  ev_seal_heat: {
    type: 'welfare', title: 'Thermal Stress: Ice Pen',
    text: 'Guest patio heaters relocated beside the harp seal pen. Pen-side air at eighteen degrees, animals refusing to ' +
          'haul out until the heaters are switched off after closing. Cooling postures observed through the afternoon.'
  },
  ev_chiller_overrun: {
    type: 'financial', title: 'Chiller 2: Eleven Weeks Over Duty',
    text: 'Hand-kept refrigeration log: Chiller 2 running at 118% duty for eleven weeks, repeatedly reported by the ' +
          'plant engineer and repeatedly not actioned. The park publicly claims it offsets 100% of Arctic Cove\'s energy.',
    conspiracy: true
  },
  ev_transfer_ledger: {
    type: 'financial', title: 'Transfer Ledger: "ASSET"',
    text: 'A movements ledger kept in the Cold Store. Nuka listed as VALUATION PENDING, held for transfer to the Open Ocean ' +
          'Wing. Beluga breeding loan enquiry declined three times by the zone manager and escalated above her. Every line ' +
          'sits under a column headed ASSET.',
    conspiracy: true
  },
  ev_frost_objection: {
    type: 'testimonial', title: 'Frost: Written Objection',
    text: 'Dr Enid Frost, in writing: asked three times to sign off a beluga breeding loan, declined three times, and asked ' +
          'for her objection recorded if overruled from above. "They are not stock."',
    conspiracy: true
  },

  /* --- Open Ocean --- */
  ev_orca_isolation: {
    type: 'welfare', title: 'Held Alone: Tempest',
    text: 'An orca moved out of a group of four and held alone for eleven months. Orca society is matrilineal and each ' +
          'matriline has its own learned dialect: an isolated animal has no one who speaks her language. She has stopped ' +
          'vocalising entirely, which the session log records as "settled".'
  },
  ev_orca_teeth: {
    type: 'welfare', title: 'Dental Damage: Tempest',
    text: 'Lower teeth worn flat against one section of gate bar, several drilled open and irrigated by hand daily. ' +
          'Gate-mouthing in a bare circular pool. The damage is treated every morning; the pool has not changed.'
  },
  ev_orca_dental_tally: {
    type: 'welfare', title: 'Irrigation Chart: 206 Days',
    text: 'A tally sheet headed IRRIGATION: MERIDIAN. One tick per day for two hundred and six consecutive days, ' +
          'continuing up the margin because the sheet ran out of space.'
  },
  ev_meridian_gatelog: {
    type: 'welfare', title: 'Meridian Gate Log',
    text: 'Eleven months of a named keeper entering the holding pool three or four times a day. Then six weeks of nothing. ' +
          'Then: "Access reduced to feed only pending review. Two visits daily. Presentation programme suspended: animal' +
          'not currently suitable for guest-facing work."'
  },
  ev_pilot_matriarch: {
    type: 'welfare', title: 'Pod Broken Up: Kupe',
    text: 'The oldest female stopped feeding the day her nine-year-old granddaughter was crated out. Short-finned pilot ' +
          'whales are one of the few mammals with a true menopause; the post-reproductive females lead the pod. The ' +
          'transfer is recorded as a "collection management decision" and the effect as an appetite issue.'
  },
  ev_pilot_depth: {
    type: 'welfare', title: 'Six Metres: Pod Pool',
    text: 'Three short-finned pilot whales, a species that sprint-dives past 600 m after squid, repeatedly diving to the ' +
          'floor of a six metre pool and pushing at the drain. Strongest in the evening, which is their natural hunting window.'
  },
  ev_dolphin_podsize: {
    type: 'welfare', title: 'Perimeter Circling: Blue Water Bay',
    text: 'Three common dolphins held together, performing an identical single-file circuit of the pool boundary for hours ' +
          'once the deck goes quiet. Wild pods of this species run to hundreds of animals and feed by cooperative herding.'
  },
  ev_manta_id: {
    type: 'welfare', title: 'Two Mantas, One Record',
    text: 'Belly-spot photographs from the same lagoon show two entirely different individuals filed under a single name ' +
          'and admission date. Manta spot patterns are unique and permanent. Either the records are wrong, or an animal ' +
          'left this lagoon and nothing says when.'
  },
  ev_manta_wingtips: {
    type: 'welfare', title: 'Abraded Wingtips: Manta Lagoon',
    text: 'Both animals repeatedly abrading their wingtips on the lagoon wall. Mantas are ram ventilators and must keep ' +
          'swimming forward to breathe, so wingspan sets a minimum turning circle. The lagoon is narrower than three ' +
          'wingspans at its tightest point.'
  },
  ev_lagoon_daybook: {
    type: 'welfare', title: 'Lagoon Day Book: Written In One Sitting',
    text: 'Five weeks of daily cover on/off entries, all in one pen and one hand, the writing visibly speeding up as it ' +
          'goes. Written retrospectively. On the day it was read, the cover was still on four hours after the book said ' +
          'it came off.'
  },
  ev_stadium_audio: {
    type: 'welfare', title: 'Stadium Audio: Signed Off Blind',
    text: 'Commissioning sheet for the Blue Horizon PA: "AS PER COVE + REEF. Signed off without underwater measurement. ' +
          'Not my call." The same contractor and the same shortcut named in the Coral Kingdom stadium file.',
    contradictedBy: ['ev_show_noise']
  },
  ev_hydrophone_trace: {
    type: 'welfare', title: 'Hydrophone Trace: Meridian Pool',
    text: 'An unofficial hydrophone log from the orca holding pool: a flat trace for weeks, then three loud brief spikes ' +
          'matching the stadium speaker commissioning upstairs. Pencilled on the printout: "she stopped after the third one."'
  },
  ev_wing_promise: {
    type: 'pr', title: 'Open Ocean Wing Hoarding',
    text: '"The largest marine conservation facility in the southern hemisphere. Every dollar you spend at Sea Universe ' +
          'builds it. Every animal in it is an animal we saved." The completion date has been covered with a sticker, ' +
          'over another sticker.',
    contradictedBy: ['ev_wing_boardpack', 'ev_movements_folder', 'ev_transport_frames'],
    conspiracy: true
  },
  ev_orca_rescue_story: {
    type: 'pr', title: 'Press Wall: "Rescued Orca"',
    text: '"Tempest, found weak and alone off the coast last spring, is thriving in her new home." Every framed article ' +
          'carries the same photograph and the same three quotes, all from one spokesperson and none from a vet.',
    contradictedBy: ['ev_wing_boardpack', 'ev_meridian_gatelog', 'ev_orca_isolation'],
    conspiracy: true
  },
  ev_transport_frames: {
    type: 'financial', title: 'Shipping Label: 1 of 3 Transport Frames',
    text: 'A crate in the service alley addressed to the Open Ocean Wing: "LIVE ANIMAL TRANSPORT FRAME 1 OF 3". ' +
          'There is one orca on site and no wing built to put her in.',
    conspiracy: true
  },
  ev_wing_boardpack: {
    type: 'financial', title: 'Board Pack Tab 4: Phase 2 Funding',
    text: '"Phase 2 is contingent on demonstrated breeding capability in the flagship species. Acquisition of a compatible ' +
          'male remains the single largest determinant of valuation." Annotated in the margin: "she is the collateral, ' +
          'not the exhibit".',
    conspiracy: true
  },
  ev_movements_folder: {
    type: 'financial', title: 'Movements Folder: Receiving Facilities Named',
    text: 'Four years of animal movements kept in the plant room, with receiving facilities written out in full rather ' +
          'than by code. Two of the codes copied from the Coral Kingdom studbook resolve here. Neither is a rescue ' +
          'centre. Both are breeding facilities.',
    conspiracy: true
  },
  ev_cuda_directorship: {
    type: 'financial', title: 'Company Search: One Director',
    text: 'A company search printout for the holding company that owns the park, flat under a drawer of catering ' +
          'invoices. Directors listed: one name. BARRY CUDA.',
    conspiracy: true
  },
  ev_halina_testimony: {
    type: 'testimonial', title: 'Okonkwo: On The Record',
    text: 'The Open Ocean zone manager, in her own name: she was given the rescue story with photographs and repeated it ' +
          'to school groups for a year. "She is not an exhibit. She is the security against phase two funding, and the ' +
          'acquisition they are waiting on is a male."',
    conspiracy: true
  },
  ev_ferris_testimony: {
    type: 'testimonial', title: 'Nakagawa: Signed Off Without Measurement',
    text: 'The contract sound engineer for all three park stadiums: he specified underwater measurement on every install, ' +
          'was told the budget did not run to it, and was instructed to sign off as per the previous install. He put a ' +
          'hydrophone in on his own time anyway.'
  },
  ev_trixie_photos: {
    type: 'testimonial', title: 'Ng: Four Hundred And Six Days',
    text: 'A season ticket holder of eleven years with date-stamped photographs of every show she attended, and of the ' +
          'board on every day the season was cancelled for "wellbeing reasons" while the park simultaneously described ' +
          'the animal as thriving.',
    contradictedBy: ['ev_orca_rescue_story']
  },
  ev_barry_proposition: {
    type: 'testimonial', title: 'Barry C.: "The Whole Proposition"',
    text: 'The CEO, in the entry plaza, to a member of staff: "The orca is the whole proposition. One animal, and the ' +
          'wing exists. Without her it is a field with planning permission."',
    conspiracy: true
  },
  ev_cuda_admission: {
    type: 'testimonial', title: 'Barry Cuda: In His Own Words',
    text: '"Cuda. Barry Cuda. It is on the incorporation documents, it is on the title deeds, and it is on precisely ' +
          'nothing that faces the public." He owns the holding company that owns the trust that owns the foundation, ' +
          'outright.',
    conspiracy: true
  }
};

/* Achievements: deliberately many, small and specific. */
SU.data.achievements = {
  first_day:       { name: 'Badge and Lanyard',     desc: 'Complete your first day at Sea Universe.', xp: 0 },
  first_care:      { name: 'Hands On',              desc: 'Complete your first care session.', xp: 20 },
  perfect_care:    { name: 'Read the Room',         desc: 'Solve a care session without a wrong answer.', xp: 30 },
  first_quest:     { name: 'Useful Around Here',    desc: 'Complete your first task for another person.', xp: 15 },
  five_quests:     { name: 'Reliable',              desc: 'Complete five tasks.', xp: 40 },
  first_evidence:  { name: 'Something Isn\'t Right',desc: 'Add your first piece of evidence to the Notebook.', xp: 25 },
  dex_three:       { name: 'Getting Acquainted',    desc: 'Discover three species.', xp: 25 },
  beachcomber:     { name: 'Beachcomber',           desc: 'Find three pieces of sea glass.', xp: 20 },
  clean_record:    { name: 'Model Employee',        desc: 'Reach Day 3 with suspicion at zero.', xp: 30 },
  met_barry:       { name: 'Meet the Boss',         desc: 'Be welcomed personally by Barry C.', xp: 10 },
  nosy:            { name: 'Nosy',                  desc: 'Search 10 objects around the park.', xp: 20 },
  trusted:         { name: 'Trusted',               desc: 'Raise any animal\'s trust to 50.', xp: 35 },
  on_the_clock:    { name: 'On the Clock',          desc: 'Complete your first assigned duty.', xp: 15 },
  reliable_hand:   { name: 'Reliable Hand',         desc: 'Finish five full shifts with nothing left undone.', xp: 50 },
  double_life:     { name: 'Double Life',           desc: 'Finish a clean shift and collect evidence on the same day.', xp: 45 },

  /* --- Coral Kingdom --- */
  deep_end:        { name: 'The Deep End',          desc: 'Set foot in Coral Kingdom.', xp: 20 },
  reef_certified:  { name: 'Reef Certified',        desc: 'Hold Cetacean Handling I and Aquarium Systems I at the same time.', xp: 45 },
  dex_seven:       { name: 'Field Guide',           desc: 'Discover seven species.', xp: 45 },
  field_notes:     { name: 'Field Notes',           desc: 'Log ten observations at viewing points around the park.', xp: 40 },
  good_talk:       { name: 'Good Talk',             desc: 'Answer five guest questions correctly at a keeper talk.', xp: 40 },
  turtle_return:   { name: 'The Point Of It',       desc: 'Clear Kira for release.', xp: 60 },
  bin_diver:       { name: 'Bin Diver',             desc: 'Pull three pieces of plastic out of the park drains.', xp: 25 },
  back_of_house:   { name: 'Back of House',         desc: 'Get into the service corridor.', xp: 35 },

  /* --- Arctic Cove --- */
  cold_open:       { name: 'Cold Open',              desc: 'Set foot in Arctic Cove.', xp: 20 },
  parka_life:      { name: 'Dress For It',           desc: 'Get inside the Cold Store.', xp: 30 },
  beat_the_thaw:   { name: 'Beat the Thaw',          desc: 'Finish a timed job before the clock runs out.', xp: 45 },
  tusk_truth:      { name: 'Not Lazy',               desc: 'Work out why Nuka stopped hauling out.', xp: 45 },
  sea_canary:      { name: 'Sea Canary',             desc: 'Work out what the belugas have started copying.', xp: 45 },
  ice_diplomat:    { name: 'Ice Diplomat',           desc: 'Sort out the jumper, the haunting and the missing script.', xp: 60 },
  dex_ten:         { name: 'Polar Records',          desc: 'Discover ten species.', xp: 55 },

  /* --- Open Ocean --- */
  open_water:      { name: 'Out Of Your Depth',      desc: 'Set foot in Open Ocean.', xp: 20 },
  three_generations:{ name: 'Three Generations',     desc: 'Work out why Kupe stopped eating.', xp: 50 },
  shape_of_the_pool:{ name: 'The Shape Of The Pool', desc: 'Read both of Noor\'s cases as housing problems, not animal problems.', xp: 50 },
  four_kiosks:     { name: 'Whatever It Takes',      desc: 'Get the maintenance man out of row K.', xp: 60 },
  code_breaker:    { name: 'Ask The Animals',        desc: 'Work out the Meridian gate code.', xp: 70 },
  season_ticket:   { name: 'Four Hundred And Six',   desc: 'Tell Beatrix Ng the truth instead of the sentence off the board.', xp: 45 },
  proper_channels: { name: 'Proper Channels',        desc: 'Move a security officer using nothing but correct paperwork.', xp: 55 },
  back_of_house_two:{ name: 'Under The Plaza',       desc: 'Get down to the service level.', xp: 45 },
  silence_please:  { name: 'Silence, Please',        desc: 'Kill the ghost show before it fires.', xp: 45 },
  barracuda:       { name: 'Barracuda',              desc: 'Learn who actually owns Sea Universe.', xp: 80 },
  follow_the_money:{ name: 'Follow The Money',       desc: 'Assemble the money, the paperwork and the name.', xp: 90 },
  dex_fifteen:     { name: 'Open Water Records',     desc: 'Discover fifteen species.', xp: 70 }
};

/* ============================================================
   ACHIEVEMENT RULES

   Some achievements are an EVENT ("you completed this quest") and are
   awarded by an effect where the event happens. Others are a STATE
   ("you are now someone who has been in the Cold Store"), and awarding
   those from an effect means hunting down every place the state could
   become true. Three achievements were defined and then never granted
   because nobody found all those places: dex_ten, parka_life and
   ice_diplomat.

   A rule is one row: an id and a `when` in the usual condition language
   (js/rules.js). They are checked on every state change, so a state
   achievement fires the moment it is true, wherever that happens.
   `award()` already refuses to grant the same one twice.

   The validator warns about any achievement that neither a rule nor an
   effect nor the engine ever awards.
   ============================================================ */
SU.data.achievementRules = [
  {
    id: 'parka_life',
    when: { zoneVisited: 'cold_store' }
  },
  {
    id: 'ice_diplomat',
    when: { quest: { q_arctic_jumper: 'completed',
                     q_arctic_haunting: 'completed',
                     q_arctic_script: 'completed' } }
  }
];

/* ============================================================
   STORY BEATS: the "what have I actually uncovered so far"
   list shown on the Journal's Summary tab.

   Each beat is resolved purely by its `when` condition, using the
   same mini-language as everything else, so nothing has to remember
   to mark a beat as done. Order here is the order they display in.

     id      stable key
     title   short headline
     zone    grouping label
     summary past-tense recap, written so it still reads well weeks later
     when    condition (js/rules.js)
   ============================================================ */
SU.data.storyBeats = [
  {
    id: 'recruited',
    title: 'Recruited',
    zone: 'Coastal Cove',
    summary: 'A visitor feeding chips to a gull turned out to be Wren Halloran, who worked ' +
             'this cove for nine years. She asked you to do the job properly, and to write' +
             'down anything that did not add up.',
    when: { flags: { met_wren: true } }
  },
  {
    id: 'first_contradiction',
    title: 'Manifest 4471',
    zone: 'Coastal Cove',
    summary: 'A filed transfer manifest listed two of the harbour seals as captive-born. ' +
             'The park brochure calls every animal here a rescue that cannot go home. ' +
             'Two documents, one lie: the first thing you could actually prove.',
    when: { evidence: 'ev_transfer_manifest' }
  },
  {
    id: 'reef_access',
    title: 'Into the Reef',
    zone: 'Coral Kingdom',
    summary: 'Wren cleared you for Coral Kingdom and told you what runs behind the reef hall: ' +
             'the service corridor, the records room, and a wall panel with one screw missing.',
    when: { zoneVisited: 'coral_kingdom' }
  },
  {
    id: 'priya_turned',
    title: 'The Standard Is the Problem',
    zone: 'Coral Kingdom',
    summary: 'Priya Raman admitted she had asked for a visual barrier and a second holding ' +
             'pool eleven times in four years. The lagoon meets every applicable standard. ' +
             'She said the standard is the problem, then put you on Dr Sato\'s roster.',
    when: { storyStage: { min: 3 } }
  },
  {
    id: 'dead_drop',
    title: 'The Drop',
    zone: 'Coral Kingdom',
    summary: 'You copied the breeding studbook (the fifth calf that appears in no public' +
             'record) and folded it behind the loose wall panel for Wren to collect. ' +
             'The least dramatic thing you have ever done.',
    when: { flags: { dead_drop_left: true } }
  },
  {
    id: 'arctic_open',
    title: 'Not Lazy',
    zone: 'Arctic Cove',
    summary: 'Six days of a nine hundred kilogram animal failing to climb a resurfaced ramp had been written ' +
             'down as "low motivation". Dr Frost had never met a lazy walrus. She was right.',
    when: { flags: { frost_debrief: true } }
  },
  {
    id: 'asset_column',
    title: 'Valuation Pending',
    zone: 'Arctic Cove',
    summary: 'A ledger kept in the Cold Store because paper does not rot at minus twenty. Nuka held for transfer ' +
             'to the Open Ocean Wing. A beluga breeding loan declined three times and escalated over the manager\'s ' +
             'head. Every line under a column headed ASSET.',
    when: { evidence: 'ev_transfer_ledger' }
  },
  {
    id: 'frost_on_record',
    title: 'They Are Not Stock',
    zone: 'Arctic Cove',
    summary: 'Dr Frost had already objected in writing, and asked for it recorded if she were overruled. ' +
             'With the chiller log beside it, the case stopped being an allegation and became a set of ' +
             'documents the park wrote itself.',
    when: { flags: { arctic_case_made: true } }
  },
  {
    id: 'ocean_open',
    title: 'A Collection Management Decision',
    zone: 'Open Ocean',
    summary: 'An elderly pilot whale stopped eating on the afternoon her granddaughter was crated ' +
             'out. In the wild she would have led that pod for thirty years after her last calf. ' +
             'The transfer was paperwork; the animal was the only one who treated it as an event.',
    when: { flags: { ocean_debrief: true } }
  },
  {
    id: 'meridian',
    title: 'The One Who Is Everywhere',
    zone: 'Open Ocean',
    summary: 'The gate code was not a security question, it was a reading question: four facts about ' +
             'four animals, printed on four boards nobody stops at. Behind it was an orca who had ' +
             'been alone for eleven months and had stopped speaking.',
    when: { flags: { meridian_open: true } }
  },
  {
    id: 'the_collateral',
    title: 'The Collateral',
    zone: 'Open Ocean',
    summary: 'Tab 4 of a board pack left on a meeting table. Phase two of the Open Ocean Wing is ' +
             'contingent on breeding the flagship species, and the acquisition everything waits on ' +
             'is a male. She was never the exhibit. She was the security.',
    when: { evidence: 'ev_wing_boardpack' }
  },
  {
    id: 'barry_cuda',
    title: 'Barry Cuda',
    zone: 'Open Ocean',
    summary: 'One name on a company search printout, hidden flat under a drawer of catering invoices, ' +
             'and then the same name said out loud in the entry plaza without a flicker. Not the ' +
             'trust, not the foundation. The holding company, owned outright.',
    when: { flags: { barry_unmasked: true } }
  }
];
