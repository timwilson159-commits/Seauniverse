/* ============================================================
   SEA UNIVERSE: ITEMS
   Add new items by copying a block. `kind` drives how it's used.
     tool      = enables interactions (kept, not consumed)
     consumable= used up
     key       = opens gated areas
     evidence  = goes to the Notebook instead of the bag (see evidence.js style tags)
     junk      = sellable / collectible flavour
   ============================================================ */
window.SU = window.SU || {};

SU.data = SU.data || {};

SU.data.items = {
  // --- Tools ---
  fish_bucket: {
    name: 'Fish Bucket', kind: 'tool', icon: '#6fb3d2',
    desc: 'Standard-issue bucket of thawed herring. Heavier than it looks.'
  },
  whistle: {
    name: 'Trainer Whistle', kind: 'tool', icon: '#e3e3e3',
    desc: 'A bridge signal: marks the exact moment an animal did the right thing.'
  },
  clipboard: {
    name: 'Clipboard', kind: 'tool', icon: '#d9c59a',
    desc: 'Lets you check an animal\'s records during a care session.'
  },
  enrichment_kit: {
    name: 'Enrichment Kit', kind: 'tool', icon: '#8bd17c',
    desc: 'Floats, puzzle feeders, ice blocks. Boredom is a welfare problem.'
  },
  medkit: {
    name: 'Field Medkit', kind: 'tool', icon: '#e08b8b',
    desc: 'Basic first aid and sample vials. Requires Veterinary training to use well.'
  },
  camera: {
    name: 'Pocket Camera', kind: 'tool', icon: '#c9a0dc', price: 30,
    desc: 'Takes photos. Tourists love it. So do investigators.'
  },

  // --- Keys / access ---
  staff_lanyard: {
    name: 'Staff Lanyard', kind: 'key', icon: '#f2c14e',
    desc: 'Your ID. Opens the staff block. Wearing it means people expect you to be working.'
  },
  service_key: {
    name: 'Service Corridor Key', kind: 'key', icon: '#b08d57',
    desc: 'Opens maintenance doors. Not on your official equipment list.'
  },

  // --- Consumables ---
  energy_bar: {
    name: 'Kelp Energy Bar', kind: 'consumable', icon: '#7fbf7f', price: 12,
    desc: 'Restores 15 energy. Tastes like a swimming pool.', use: { energy: 15 }
  },
  coffee: {
    name: 'Staff Room Coffee', kind: 'consumable', icon: '#8a6142', price: 4,
    desc: 'Restores 10 energy. Free, and it shows.', use: { energy: 10 }
  },

  test_kit: {
    name: 'Water Test Kit', kind: 'tool', icon: '#7fd1c0', price: 35,
    desc: 'Reagents and vials. Lets you draw a usable sample from a sampling port.'
  },
  water_sample: {
    name: 'Water Sample', kind: 'tool', icon: '#4fb0c6',
    desc: 'A sealed, dated vial. Worthless to anyone except the person who reads the numbers.'
  },
  plastic_debris: {
    name: 'Plastic Debris', kind: 'tool', icon: '#d9d2c4',
    desc: 'Soft plastic fragments from a park drain. A green turtle cannot tell this from a jellyfish.'
  },
  dive_glove: {
    name: 'Dive Glove', kind: 'tool', icon: '#3d92bc',
    desc: 'One left-hand dive glove, size medium, chewed at the cuff. Property of J. Nolan.'
  },

  // --- Consumables ---
  smoothie: {
    name: 'Reef Smoothie', kind: 'consumable', icon: '#e07fa0', price: 16,
    desc: 'Restores 20 energy. Nine dollars of fruit and seven dollars of cup.', use: { energy: 20 }
  },

  // --- Collectibles / junk ---
  sea_glass: {
    name: 'Sea Glass', kind: 'junk', icon: '#a6dcd2', value: 4,
    desc: 'Tumbled smooth. The gift shop sells these for eleven dollars.'
  },
  lost_sunglasses: {
    name: 'Lost Sunglasses', kind: 'junk', icon: '#5b5b6b', value: 2,
    desc: 'Someone is squinting their way around the park right now.'
  },
  souvenir_pin: {
    name: 'Sea Universe Pin', kind: 'junk', icon: '#4aa3df', value: 6,
    desc: 'A smiling cartoon orca. The real ones do not smile.'
  },
  reef_plush: {
    name: 'Plush Dolphin', kind: 'junk', icon: '#9fc7dc', value: 7,
    desc: 'Gift shop stock, dropped in the plaza. The tag says "adopt me" and lists no adoption scheme.'
  },
  coral_fragment: {
    name: 'Coral Fragment', kind: 'junk', icon: '#e08a9a', value: 5,
    desc: 'A broken piece of hard coral from the drain. Taking coral from a reef is illegal in Australia,' +
          'this one came out of a display, which is its own kind of answer.'
  },

  /* --- Arctic Cove --- */
  thermal_parka: {
    name: 'Thermal Parka', kind: 'key', icon: '#3f6f9a',
    desc: 'Borrowed from the rack in the Arctic staff block. Enormous, smells faintly of fish, and is the ' +
          'only reason the Cold Store is survivable.'
  },
  talk_script: {
    name: 'Soggy Talk Script', kind: 'tool', icon: '#c9c2a8',
    desc: 'A keeper-talk script recovered from a recycling bin. Every third line is legible, which is ' +
          'somehow worse than none of them.'
  },
  seal_jumper: {
    name: 'Knitted Seal Jumper', kind: 'junk', icon: '#c08ab0', value: 2,
    desc: 'Hand-knitted, seal-sized, in a bold raspberry. Made with real love and a total misunderstanding ' +
          'of how blubber works.'
  },
  lost_glove: {
    name: 'Lost Glove', kind: 'junk', icon: '#7f8a92', value: 2,
    desc: 'A single insulated glove dug out of a drift. There is a lost property box in Coral Kingdom ' +
          'containing, at last count, eleven of these.'
  },
  /* --- THE FOUR KIOSK SIGNATURES ---------------------------------
     One consumable per park kiosk, each sold at exactly one of them:

       cove_doughnut  → Coastal Cove, Gift Kiosk
       smoothie       → Coral Kingdom, Reef Kiosk       (defined above)
       hot_chocolate  → Arctic Cove, Frostbite Kiosk
       blue_slushie   → Open Ocean, Deep Blue Kiosk

     Dags in Zone 4 asks for all four by name and never says where any
     of them come from. If you ever add one of these to a second kiosk's
     `sells` list, that puzzle quietly stops working. */
  hot_chocolate: {
    name: 'Hot Chocolate', kind: 'consumable', icon: '#8a5a3a', price: 9, value: 6,
    desc: 'From the Frostbite Kiosk in Arctic Cove. Up there this is less a treat than a piece of ' +
          'safety equipment. Restores 25 energy.',
    use: { energy: 25 }
  },
  cove_doughnut: {
    name: 'Sea Salt Doughnut', kind: 'consumable', icon: '#d9b06a', price: 10, value: 4,
    desc: 'From the Gift Kiosk in Coastal Cove. Salt on top, salt in the air, salt in the queue. ' +
          'Restores 18 energy.',
    use: { energy: 18 }
  },
  blue_slushie: {
    name: 'Deep Blue Slushie', kind: 'consumable', icon: '#3a8ad9', price: 12, value: 5,
    desc: 'From the Deep Blue Kiosk in Open Ocean. Dyed a blue that does not occur anywhere in the ' +
          'actual ocean. Restores 22 energy and turns your tongue a colour.',
    use: { energy: 22 }
  },

  /* KAYLA'S ICY POLE. Deliberately NOT one of the four kiosk snacks and
     deliberately not sold anywhere: Dags demands all four of those at
     once and takes them, and working out that they come from four
     different zones is the whole of that puzzle. Handing the player a
     real kiosk snack as a quest reward would solve a quarter of it for
     free. Kayla gives this instead, in every zone, because a woman who
     follows you across five zones always has a spare. */
  icy_pole: {
    name: 'Blue Horizon Icy Pole', kind: 'consumable', icon: '#4ab8e0',
    desc: 'Half a twin icy pole, in a blue that has never occurred in nature. The smaller half, ' +
          'handed over after a pause, by somebody who considers this a serious transaction. ' +
          'Restores 20 energy.',
    use: { energy: 20 }
  },

  /* --- SIDE QUEST PROPS ---------------------------------------
     All `key` kind, which in this game means weightless and unsellable
     (see SU.State.countsAgainstCarry). None of them touch the story;
     they exist so a favour has something to hand over at the end. */
  wedding_ring: {
    name: 'Wedding Ring', kind: 'key', icon: '#e0c24a',
    desc: 'A worn gold band, retrieved from a sea lion who had formed views about ownership. ' +
          'Inscribed inside, in letters almost worn flat: VIC & MAUREEN.'
  },
  field_recorder: {
    name: 'Field Recorder', kind: 'key', icon: '#6d7a82',
    desc: 'A hydrophone on a coiled lead and a recorder older than you are. Lent by a visiting ' +
          'researcher on the strict condition that you do not drop the wet end in the dry bit.'
  },
  binned_painting: {
    name: 'A Painting Of A Fluke', kind: 'key', icon: '#8fb0c4',
    desc: 'Watercolour on heavy paper, rescued from a bin and slightly damp at one corner. The ' +
          'trailing edge of the fluke is exactly right, notches and all, which is the part ' +
          'everybody else gets wrong.'
  },

  winch_key: {
    name: 'Lagoon Winch Key', kind: 'key', icon: '#9a8258',
    desc: 'A cut copy of the manta lagoon cover winch key, handed over by a maintenance man who ' +
          'decided you had earned it. Officially this does not exist.'
  },

  /* --- The Deep --- */
  head_torch: {
    name: 'Head Torch', kind: 'tool', icon: '#e0c24a',
    desc: 'A decent head torch with a fresh set of batteries. Every night keeper in The Deep has ' +
          'bought their own, because the walkway lighting has been out since March.'
  },
  mesh_gauge: {
    name: 'Net Mesh Gauge', kind: 'tool', icon: '#8fa8b8',
    desc: 'A laminated card of net mesh sizes with a measuring slot cut into it. Holding it against ' +
          'a repair tells you in one second whether the rope is the right gauge, which is the ' +
          'difference between an opinion and a measurement.'
  },
  survey_photos: {
    name: 'Survey Photographs', kind: 'key', icon: '#c8d0d8',
    desc: 'Your own photographs of the sea gate net repair, the mast in the water and the empty ' +
          'life ring station, each with the gauge card or a scale in frame. Boring, methodical, ' +
          'and much harder to argue with than anything you could say out loud.'
  }
};
