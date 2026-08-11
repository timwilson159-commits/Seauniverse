/* ============================================================
   SEA UNIVERSE, ZONE 5 SPECIES: THE DEEP

   Own file, per the convention set by Zone 3, and appended to the
   species table in data/species.js rather than redefining it.

   The five animals here were chosen to make one argument in five
   different registers, so read them as a set:

     BLUE WHALE     the impossible one. No blue whale has ever been
                    held anywhere, by anyone, and the park has one.
                    Everything about her is a size problem.
     HUMPBACK       the unnecessary one. The east Australian population
                    went from roughly two hundred animals to over thirty
                    thousand without a single one being put in a tank.
     SPERM WHALE    the depth one. She is built for two thousand metres
                    and she is in eleven.
     FALSE KILLER   the social one. Her problem is not the water, it is
     WHALE          that there is nobody in it with her.
     DUGONG         the counterweight, and the most important animal in
                    the zone for teaching purposes. She is small, she is
                    genuinely well kept, and releasing her would kill
                    her. If every answer in this game were "let it go",
                    the game would be propaganda rather than teaching.
                    See `dg_stay` below and do not soften it.

   TWO ENCOUNTERS DELIBERATELY HAVE A "NOTHING IS WRONG" ANSWER
   (`sw_sleep`, and the pec-slap question in the keeper talk pool). They
   exist for the same reason `gns_normal` does in Coral Kingdom: a student
   who learns that every unusual behaviour is a welfare failure has not
   learned to observe, they have learned to accuse. Knowing the baseline
   is what makes the real findings in this zone credible.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.species = SU.data.species || {};

Object.assign(SU.data.species, {

  blue_whale: {
    name: 'Blue Whale',
    sci: 'Balaenoptera musculus',
    group: 'Cetacean',
    zone: 'the_deep',
    colour: '#4a6b86',
    shape: 'fish',
    facts: [
      'The blue whale is the largest animal known to have ever lived: up to about 30 m long and 190 tonnes, bigger than any dinosaur.',
      'Its heart weighs roughly 180 kg, about the size of a golf buggy, and beats as slowly as two times a minute on a deep dive.',
      'Blue whale calls are below 20 Hz, near the bottom of human hearing, and among the loudest sounds any animal makes. In deep water they carry for hundreds of kilometres.',
      'In the feeding season a blue whale can eat close to four tonnes of krill a day. One lunge engulfs a volume of water larger than the whale itself.',
      'A blue whale calf gains around 90 kg a day on its mother\'s milk, which is the fastest growth of any animal.',
      'No blue whale has ever been held in captivity anywhere in the world. Nobody has ever built a tank that could hold one.'
    ],
    encounters: [
      {
        id: 'bw_intake',
        title: 'Four Tonnes a Day',
        prompt: 'Halcyon is being fed a manufactured krill slurry through a hopper. The sheet says she is taking 61% of target. The target was set by this park.',
        need: 'escalate_transfer',
        cues: [
          { text: 'There is no commercial supply of krill anywhere in the country at the volume she needs.', points: true },
          { text: 'Her target intake was revised down twice this year. The sheet does not say why.', points: true },
          { text: 'Photographs from her arrival, next to photographs from this week, show the change behind her blowhole.', points: true },
          { text: 'Her bloodwork was taken four months ago and is in the file marked pending.', points: false }
        ],
        options: [
          { id: 'escalate_transfer', label: 'Record that this animal cannot be adequately fed at this facility, and escalate for transfer', correct: true,
            feedback: 'Correct, and it is the only honest answer. This is not a husbandry problem you can solve with a better roster. The food does not exist here.' },
          { id: 'more_slurry', label: 'Increase the slurry and feed more often',
            feedback: 'You cannot fix a supply problem by scheduling it differently. There is no more krill to give her.' },
          { id: 'revise_target', label: 'Revise the target intake down again so the sheet reads green',
            feedback: 'This is exactly what somebody already did, twice. Moving the line is not the same as meeting it.' },
          { id: 'vitamins', label: 'Add a vitamin supplement to the slurry',
            feedback: 'Reasonable husbandry, and nowhere near the scale of the problem.' }
        ],
        lesson: 'Blue whales feed by lunging through dense krill swarms, taking in a volume of water larger than their own body and filtering it through baleen. It is a strategy that only works where krill is concentrated in enormous quantities. No facility on earth can reproduce that, which is one of several reasons no blue whale has ever been kept.',
        evidence: 'ev_halcyon_intake'
      },
      {
        id: 'bw_call',
        title: 'The Room Is the Wrong Shape',
        prompt: 'Halcyon calls at night. The hydrophone picks up the call, and then picks it up again, and again, off the pen walls.',
        need: 'acoustic_report',
        cues: [
          { text: 'The trace shows the same call arriving four times, milliseconds apart.', points: true },
          { text: 'The pen is a quarry: rock on three sides, a concrete sill on the fourth.', points: true },
          { text: 'Her calling stopped for nine days in March, then started again.', points: true },
          { text: 'The night keeper says it is the loveliest sound in the park, which is true and not the point.', points: false }
        ],
        options: [
          { id: 'acoustic_report', label: 'Log the reflections as an acoustic welfare problem the enclosure cannot solve', correct: true,
            feedback: 'Correct. A call designed to cross an ocean is coming back at her from six metres away. The shape of the pen is the problem, and you cannot re-shape a quarry.' },
          { id: 'damping', label: 'Ask maintenance to hang acoustic damping on the walls',
            feedback: 'Worth asking for, and it treats the surface of a problem that is the entire volume of water.' },
          { id: 'nothing', label: 'Note it as normal vocalisation and move on',
            feedback: 'The vocalisation is normal. What comes back at her is not.' },
          { id: 'move_hydrophone', label: 'Reposition the hydrophone so the trace is cleaner',
            feedback: 'That makes the record tidier without changing anything the animal experiences. Be careful: this is the instinct the whole park runs on.' }
        ],
        lesson: 'Baleen whale calls are infrasonic and are built for open water, where they travel for hundreds of kilometres without meeting anything. In an enclosed body of water those same low frequencies reflect off every hard surface and return to the animal. Acoustics is a welfare issue, and it is invisible unless somebody puts a hydrophone in and reads the trace.',
        evidence: 'ev_halcyon_acoustics'
      }
    ]
  },

  humpback_whale: {
    name: 'Humpback Whale',
    sci: 'Megaptera novaeangliae',
    group: 'Cetacean',
    zone: 'the_deep',
    colour: '#3d4f5c',
    shape: 'fish',
    facts: [
      'Humpbacks make one of the longest migrations of any mammal, up to about 8,000 km each way. The east Australian population passes the New South Wales coast every winter.',
      'The scientific name Megaptera means "big wing". The pectoral fins are up to a third of the animal\'s body length, the longest appendage of any animal.',
      'Males sing long, structured songs that change through a season, and every male in the population adopts the new version. It is one of the clearest examples of culture in an animal.',
      'Bubble-net feeding, where a group blows a spiral of bubbles to concentrate fish, is learned from other whales rather than instinctive, and spreads between individuals.',
      'The pattern on the underside of the tail flukes is unique to each whale, which is how researchers identify individuals without touching them.',
      'The east Australian humpback population fell to roughly 200 animals by the early 1960s and is now over 30,000. Not one of them was recovered by being put in a tank.'
    ],
    encounters: [
      {
        id: 'hb_song',
        title: 'Nothing to Learn It From',
        prompt: 'Kirra sings. The acoustics team has three seasons of recordings and says the song has got shorter every year.',
        need: 'culture_report',
        cues: [
          { text: 'Season one: eleven distinct phrases. This season: four.', points: true },
          { text: 'She arrived at two years old and has not heard another humpback since.', points: true },
          { text: 'Song in the wild is revised every season and copied across the whole population.', points: true },
          { text: 'Her body condition score is good and has been stable all year.', points: false }
        ],
        options: [
          { id: 'culture_report', label: 'Record the loss of song structure as a welfare and conservation finding', correct: true,
            feedback: 'Correct. Song is learned, and she has nobody to learn it from. What is being lost here is not one whale\'s voice, it is her share of something the population holds together.' },
          { id: 'play_recordings', label: 'Play her archive recordings of wild humpback song',
            feedback: 'A humane instinct, and the same one a keeper had for the orca in Open Ocean. A recording cannot answer, and song is a conversation.' },
          { id: 'normal_variation', label: 'Log it as normal seasonal variation',
            feedback: 'Song does change every season. It does not shrink every season. The direction is the finding.' },
          { id: 'more_enrichment', label: 'Increase environmental enrichment',
            feedback: 'Enrichment is good practice and it is not a substitute for another humpback.' }
        ],
        lesson: 'Humpback song is cultural: it is learned, revised and copied across an entire population every year. An isolated animal has no one to copy, so its song degrades. This is one of the strongest arguments against holding socially learning species alone, and it is measurable, which is what makes it evidence.',
        evidence: 'ev_kirra_song'
      },
      {
        id: 'hb_pecs',
        title: 'The Leading Edge',
        prompt: 'Both of Kirra\'s pectoral fins are grazed along the leading edge. The vet file lists it as "recurrent abrasion, cause unknown".',
        need: 'measure_pen',
        cues: [
          { text: 'The abrasions are on the leading edge only, both sides, and symmetrical.', points: true },
          { text: 'Her pectoral fins are close to five metres across, tip to tip.', points: true },
          { text: 'The north pen wall is quarried rock, not concrete, and it is rough.', points: true },
          { text: 'She has been treated for the same abrasions four times in fourteen months.', points: true }
        ],
        options: [
          { id: 'measure_pen', label: 'Measure her turning circle against the pen and log the enclosure as the cause', correct: true,
            feedback: 'Correct. Symmetrical wear on the leading edge of both fins is a contact injury, and something she hits every time she turns. "Cause unknown" was a decision, not a finding.' },
          { id: 'treat_again', label: 'Treat the abrasions again and re-check in a month',
            feedback: 'That is the fifth time. The treatment works; the cause is still there.' },
          { id: 'behaviour', label: 'Record it as self-inflicted from surface behaviour',
            feedback: 'Pectoral slapping is normal humpback behaviour and does not graze the leading edge of both fins symmetrically.' },
          { id: 'net_change', label: 'Blame the perimeter net and ask for it to be re-tensioned',
            feedback: 'The net has its own problems, and it is nowhere near where she turns.' }
        ],
        lesson: 'A humpback\'s pectoral fins can be a third of its body length, which makes its turning circle enormous. Repeated symmetrical injuries in captive animals are usually contact injuries, and contact injuries are a measurement problem: the animal is bigger than the space. "Cause unknown" in a file that has been opened four times is worth reading twice.',
        evidence: 'ev_kirra_abrasion'
      }
    ]
  },

  sperm_whale: {
    name: 'Sperm Whale',
    sci: 'Physeter macrocephalus',
    group: 'Cetacean',
    zone: 'the_deep',
    colour: '#5a5750',
    shape: 'fish',
    facts: [
      'The sperm whale is the largest toothed predator alive, and has the largest brain of any animal that has ever existed, at around 8 kg.',
      'It routinely dives past 1,000 m hunting squid, and recorded dives have gone beyond 2,000 m and lasted over an hour.',
      'Its echolocation clicks are the loudest sound produced by any animal, measured up to about 230 decibels.',
      'The spermaceti organ that fills the front of the head focuses those clicks into a beam. It is what the whaling industry hunted them for.',
      'Females and young live in stable family units for life, and share the care of calves. Males leave in adolescence and live alone or in loose bachelor groups.',
      'Sperm whales sleep vertically, head up and motionless just below the surface, in short bouts of around ten to fifteen minutes.'
    ],
    encounters: [
      {
        id: 'sw_depth',
        title: 'Eleven Metres',
        prompt: 'Vesper dives to the floor of the pen, holds there, and comes up. She has done it forty times this morning. The log calls it "diving enrichment behaviour".',
        need: 'depth_report',
        cues: [
          { text: 'The pen is 11 m at its deepest point, which is at the sill.', points: true },
          { text: 'She holds at the bottom for eight or nine seconds, then surfaces.', points: true },
          { text: 'Her species hunts at 1,000 m and can hold its breath for over an hour.', points: true },
          { text: 'She takes her fish at the surface without hesitation.', points: false }
        ],
        options: [
          { id: 'depth_report', label: 'Log the pen depth against her natural dive profile and escalate it as an enclosure finding', correct: true,
            feedback: 'Correct. Forty dives to the bottom of an eleven metre pen is not enrichment, it is an animal completing about one percent of a behaviour that defines it.' },
          { id: 'deeper_toys', label: 'Sink enrichment devices to the bottom to make the dives more interesting',
            feedback: 'Kind, and it makes eleven metres more entertaining rather than making it deeper.' },
          { id: 'normal_dive', label: 'Record it as normal foraging behaviour',
            feedback: 'It is the shape of foraging behaviour with the depth taken out. The shape is not the point of it.' },
          { id: 'reduce_feeds', label: 'Reduce surface feeding so she forages instead',
            feedback: 'There is nothing at the bottom to forage. This would just make her hungry.' }
        ],
        lesson: 'Sperm whales are extreme divers: routinely past 1,000 m, occasionally past 2,000 m, on breath holds of up to an hour. Depth is not a luxury for this species, it is where almost all of its life happens. An enclosure can be excellent in every other respect and still fail an animal on one measurement.',
        evidence: 'ev_vesper_depth'
      },
      {
        id: 'sw_sleep',
        title: 'Standing Up',
        prompt: 'A keeper radios in a suspected death. Vesper is hanging vertically just under the surface, head up, completely motionless.',
        need: 'normal_sleep',
        cues: [
          { text: 'She is head up, tail down, hanging in the water column without moving.', points: true },
          { text: 'It is 13:40. She has done this at roughly the same times for weeks.', points: true },
          { text: 'It has lasted about twelve minutes.', points: true },
          { text: 'She fed normally two hours ago and her breathing was unremarkable.', points: false }
        ],
        options: [
          { id: 'normal_sleep', label: 'Record it as normal sleep behaviour for the species and stand the call down', correct: true,
            feedback: 'Correct. Sperm whales sleep vertically, head up, in short bouts. Knowing this is the difference between a keeper who can be trusted and one who cannot.' },
          { id: 'emergency', label: 'Call a full veterinary emergency',
            feedback: 'Understandable, and a false alarm costs you something. In this zone especially, you will need people to believe you when it is real.' },
          { id: 'rouse', label: 'Rouse her with the feed whistle to check she responds',
            feedback: 'Waking a sleeping animal to confirm it is alive is stressful, and this is the fourth time this month somebody has.' },
          { id: 'stress_log', label: 'Log it as a new stress behaviour',
            feedback: 'It is not new and it is not stress. It is one of the more remarkable things this species does.' }
        ],
        lesson: 'Sperm whales sleep vertically, head up, in short bouts of ten to fifteen minutes, and were only filmed doing it in 2008. Knowing what is normal for a species is the foundation of everything else: it is what stops a keeper raising a false alarm, and it is what makes it impossible for a manager to wave away a real finding as inexperience.',
        evidence: null
      }
    ]
  },

  false_killer_whale: {
    name: 'False Killer Whale',
    sci: 'Pseudorca crassidens',
    group: 'Cetacean',
    zone: 'the_deep',
    colour: '#2f3a3f',
    shape: 'fish',
    facts: [
      'Despite the name it is not closely related to the orca. It is one of the largest members of the dolphin family, and got its name from the shape of its skull.',
      'False killer whales share food with each other routinely, passing prey between group members, and have been recorded offering fish to human divers.',
      'They live in stable social groups that can hold together for decades, with individuals recognisable to each other for life.',
      'They mass strand more readily than almost any other cetacean, and will stay with a stranded group member rather than leave.',
      'The main Hawaiian island population is listed as endangered, with only about 150 to 200 animals remaining.',
      'They can hybridise with bottlenose dolphins. The offspring, known as a wholphin, has been born in captivity more than once.'
    ],
    encounters: [
      {
        id: 'fkw_pod',
        title: 'Fourteen Years',
        prompt: 'Kessa arrived six weeks ago and has taken almost nothing since. The transfer note gives the reason for the move as "collection balance".',
        need: 'social_finding',
        cues: [
          { text: 'She was in the same group of nine for fourteen years before the transfer.', points: true },
          { text: 'She holds at the pen gate facing south, which is the direction she was brought in from.', points: true },
          { text: 'Her species maintains social bonds that last decades.', points: true },
          { text: 'Water quality in her pen is within every parameter.', points: false }
        ],
        options: [
          { id: 'social_finding', label: 'Record the separation itself as the cause and recommend she goes back', correct: true,
            feedback: 'Correct, and it is the same finding as the pilot whale matriarch in Open Ocean. For this species the group is not company. It is the animal\'s world.' },
          { id: 'appetite_stim', label: 'Start her on an appetite stimulant',
            feedback: 'Treats the symptom of a problem that has an address and a transfer date.' },
          { id: 'settle_in', label: 'Give her more time to settle in',
            feedback: 'Six weeks off feed is not settling in. Somebody has already written that sentence four times in this file.' },
          { id: 'new_group', label: 'Introduce her to the other animals in the zone',
            feedback: 'There is no other false killer whale here, and putting an unfamiliar large cetacean in with a different species has its own risks.' }
        ],
        lesson: 'False killer whales form stable social groups that hold together for decades. Moving one for "collection balance" is a paperwork decision that removes an animal from the only relationships it has. Notice how the transfer note describes it: the language of a spreadsheet, applied to a body.',
        evidence: 'ev_kessa_transfer'
      },
      {
        id: 'fkw_share',
        title: 'She Keeps Giving You Fish',
        prompt: 'Kessa brings a whole fish to the rail, drops it at your feet, and waits. She has done it every session this week. The new keeper has logged it as food rejection.',
        need: 'prey_sharing',
        cues: [
          { text: 'She carries the fish carefully and places it, rather than spitting it.', points: true },
          { text: 'She waits, watching, until somebody picks it up.', points: true },
          { text: 'She eats normally once the offered fish has been taken.', points: true },
          { text: 'Her species is known to pass prey between group members and to offer it to divers.', points: true }
        ],
        options: [
          { id: 'prey_sharing', label: 'Record it correctly as prey sharing, a social behaviour, and note who she is directing it at', correct: true,
            feedback: 'Correct. It is not rejection, it is the opposite. She is doing the thing her species does with its group, and the only candidate available is you.' },
          { id: 'rejection', label: 'Confirm the food rejection entry and change her fish supplier',
            feedback: 'The fish is fine. Read what she does after somebody takes it.' },
          { id: 'ignore_it', label: 'Stop taking the fish so the behaviour extinguishes',
            feedback: 'You could. Think about what you would be extinguishing, and why it is being directed at a person in the first place.' },
          { id: 'train_out', label: 'Train an incompatible behaviour over the top of it',
            feedback: 'A technically sound answer to a question nobody should be asking.' }
        ],
        lesson: 'Prey sharing is a real and well documented false killer whale behaviour, seen between group members in the wild and directed at human divers. A behaviour logged wrongly enters the record wrongly, and the record is what everybody downstream trusts. In this case the mistake also hides something worth knowing: she has nobody else to share with.',
        evidence: 'ev_kessa_sharing'
      }
    ]
  },

  dugong: {
    name: 'Dugong',
    sci: 'Dugong dugon',
    group: 'Sirenian',
    zone: 'the_deep',
    colour: '#7d7b6a',
    shape: 'blob',
    facts: [
      'The dugong is the only strictly herbivorous marine mammal, grazing seagrass and leaving visible feeding trails across the meadow.',
      'Its closest living relatives are elephants, not whales or seals. Sirenians and elephants share a common ancestor.',
      'Australia holds by far the world\'s largest dugong populations, with strongholds in Shark Bay, the Great Barrier Reef lagoon and Moreton Bay.',
      'Dugongs can live over 70 years. Age is read from growth layers in the tusks, in much the same way as rings in a tree.',
      'They breed extremely slowly: one calf every three to seven years, after a year of pregnancy. A population that is knocked down takes decades to come back.',
      'Orphaned dugong calves have been successfully hand raised in Australian aquaria, but a hand raised dugong has never learned to find its own seagrass.'
    ],
    encounters: [
      {
        id: 'dg_seagrass',
        title: 'Not a Cow',
        prompt: 'Pip is losing condition on a diet of cos lettuce and a formulated pellet. The keeper who set the diet left in March.',
        need: 'seagrass_supply',
        cues: [
          { text: 'She is a specialist seagrass grazer. Her whole gut is built for it.', points: true },
          { text: 'Her faecal output has changed consistency, and the change is in the file.', points: true },
          { text: 'The seagrass supply contract lapsed in March and was never renewed.', points: true },
          { text: 'She takes the lettuce readily, which is why nobody flagged it.', points: false }
        ],
        options: [
          { id: 'seagrass_supply', label: 'Get the seagrass supply reinstated and log the lapse as the cause', correct: true,
            feedback: 'Correct. An animal eating something is not the same as an animal being fed. The contract date and the change in her file are the same month.' },
          { id: 'more_lettuce', label: 'Increase the lettuce ration',
            feedback: 'More of the wrong food. Cos lettuce is a supplement that became the diet because nobody re-read the contract.' },
          { id: 'vet_workup', label: 'Refer her for a full gastrointestinal workup',
            feedback: 'Not wrong, and you already have the cause in front of you with a date on it. Do both, in that order.' },
          { id: 'weigh_weekly', label: 'Put her on weekly weights and monitor',
            feedback: 'Monitoring a decline you can explain is how a decline becomes a chart nobody acts on.' }
        ],
        lesson: 'Dugongs are the only fully herbivorous marine mammals and are seagrass specialists, not general grazers. The interesting part of this case is not the biology, it is the paperwork: a supply contract lapsed, nobody owned the consequence, and the animal quietly got worse for five months while every daily sheet said she had eaten.',
        evidence: 'ev_pip_diet'
      },
      {
        id: 'dg_stay',
        title: 'The Answer Is Not Release',
        prompt: 'Pip was found as an orphaned calf at four months old and hand raised here. She is nine. Somebody has written RELEASE? in the margin of her file and underlined it twice.',
        need: 'managed_sanctuary',
        cues: [
          { text: 'She has never foraged. She has never had to find a seagrass meadow.', points: true },
          { text: 'Dugong calves learn meadow locations from their mothers over several years.', points: true },
          { text: 'She approaches boats and people without hesitation, which in Moreton Bay would be a death sentence.', points: true },
          { text: 'She is in good condition and is the healthiest large animal in this zone.', points: false }
        ],
        options: [
          { id: 'managed_sanctuary', label: 'Recommend a managed seagrass lagoon with care staff, not open release', correct: true,
            feedback: 'Correct, and it is the harder answer. Everything else in this zone points one way. This one does not, and saying so is what makes the rest of your file trustworthy.' },
          { id: 'release_now', label: 'Recommend release into Moreton Bay',
            feedback: 'She cannot forage, she has no meadow knowledge, and she swims towards boats. Release here is not freedom, it is starvation with better scenery.' },
          { id: 'keep_exhibit', label: 'Recommend she stays exactly where she is, on exhibit',
            feedback: 'The current pen is not a seagrass habitat either, and "she is fine" is how every other animal in this zone got here.' },
          { id: 'defer', label: 'Note that it is above your pay grade and leave the margin note unanswered',
            feedback: 'Somebody asked the question in writing. An unanswered question in a file is how a decision gets made by nobody.' }
        ],
        lesson: 'Release is not automatically the welfare answer. A hand raised animal that has never foraged, and has learned that people and boats are safe, will not survive release, and a recommendation that ignores that is not conservation. The credible position is animal by animal: Pip needs a managed seagrass habitat with staff, and the whales in this zone need an ocean. Being able to tell those two cases apart is the whole skill.',
        evidence: 'ev_pip_release'
      }
    ]
  }

});

/* ------------------------------------------------------------
   ONE EXTRA ORCA ENCOUNTER, added to the Zone 4 species entry.

   Zone 4's board pack (ev_wing_boardpack) says phase two of the Open
   Ocean Wing is contingent on breeding the flagship species, and that
   the acquisition everything is waiting on is a MALE. This is him. He
   is in a holding pen in The Deep, off the guest map, and he is the
   reason the orca in Open Ocean was described as the collateral.

   Deliberately hung off the existing `orca` species rather than a new
   one: it is the same animal in the dex, it needs no new art, and the
   payoff lands harder when a student opens a species page they already
   filled in months ago and finds a second case on it.
   ------------------------------------------------------------ */
SU.data.species.orca.encounters.push({
  id: 'or_acquisition',
  title: 'The Acquisition',
  prompt: 'A young male orca in the north holding pen. No name on the board, no name in the daily sheet, no name anywhere. Just a stock number and an arrival date eight days ago.',
  need: 'identify_him',
  cues: [
    { text: 'The daily sheet identifies him by a number, not a name. Every other animal in this park has a name.', points: true },
    { text: 'His arrival date is four days after the board pack was tabled.', points: true },
    { text: 'The pen is not on the guest map, and there is no information board anywhere near it.', points: true },
    { text: 'He is in reasonable physical condition, which is not the same as being all right.', points: false }
  ],
  options: [
    { id: 'identify_him', label: 'Photograph the saddle patch and the eye patch, and match him against the transfer paperwork', correct: true,
      feedback: 'Correct. Saddle and eye patches identify an individual orca as reliably as a fingerprint, and an animal with a documented identity is much harder to move quietly.' },
    { id: 'ask_manager', label: 'Ask the zone manager who he is',
      feedback: 'She will tell you the truth, which is that she was not told either. That is worth knowing and it is not evidence.' },
    { id: 'name_him', label: 'Give him a name so the staff stop calling him a number',
      feedback: 'It would change how everybody here talks about him, which is not nothing. It changes no record.' },
    { id: 'leave_it', label: 'Leave it. He is not on your roster.',
      feedback: 'Nobody is on the roster for this pen. That is the design, not an oversight.' }
  ],
  lesson: 'Individual orcas are identified by the shape of the grey saddle patch behind the dorsal fin and the white patch above the eye, which are unique and stable for life. Photo identification is the backbone of wild cetacean research, and it works just as well against a transfer manifest: an animal that can be individually named and dated is one that cannot quietly become a different animal on a different piece of paper.',
  evidence: 'ev_the_acquisition'
});
