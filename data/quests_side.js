/* ============================================================
   SEA UNIVERSE: SIDE QUESTS

   Eight favours for people who are not part of the conspiracy and
   never will be. They exist for variety, humour and humanity, and
   every one of them teaches something true on the way past.

   RULES FOR THIS FILE, so it stays out of the story's way:
     · no evidence, no story stages, no suspicion, no skill points
     · rewards are money and XP only, and one-off, never farmable
     · nothing here gates anything, and nothing here is required
     · the giver stays put afterwards with something new to say

   Placement is Cove 2, Coral 2, Arctic 2, Ocean 2, Deep 1, and one
   of the Coral pair sends you across the whole park.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.quests = SU.data.quests || {};

/* --- COASTAL COVE --------------------------------------------- */

SU.data.quests.q_side_child = {
  title: 'He Is Fine, Actually',
  zone: 'coastal_cove', giver: 'gareth', type: 2,
  summary: 'A father has lost sight of his son at the otter habitat. The son is not lost. The son ' +
           'is on the wrong side of the fence and having the best day of his life.',
  steps: [
    { id: 's1', text: 'Find the boy at the otter habitat', at: 'otter_deck',
      done: { flags: { sq_child_found: true } } },
    { id: 's2', text: 'Get Milo to fish him out', at: 'milo',
      done: { flags: { sq_child_out: true } } },
    { id: 's3', text: 'Return him to his father', at: 'gareth', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 45 },
    { type: 'money', amount: 18 }
  ],
  repeatable: false
};

SU.data.quests.q_side_ring = {
  title: 'Vic And Maureen',
  zone: 'coastal_cove', giver: 'vic', type: 2,
  summary: 'A wedding ring went over the rail at the sea lion stadium. Somebody down there has it ' +
           'and is not what you would call cooperative.',
  steps: [
    { id: 's1', text: 'Ask Dana whether anything can be done', at: 'dana',
      done: { flags: { sq_ring_found: true } } },
    { id: 's2', text: 'Give the ring back to Vic', at: 'vic', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 40 },
    { type: 'money', amount: 15 }
  ],
  repeatable: false
};

/* --- CORAL KINGDOM -------------------------------------------- */

SU.data.quests.q_side_eggcase = {
  title: 'The Corkscrew Thing',
  zone: 'coral_kingdom', giver: 'vernon', type: 2,
  summary: 'Vernon Slee saw something in a rock pool in 1974 and his family have spent fifty years ' +
           'telling him he imagined it. He would like that settled today.',
  steps: [
    { id: 's1', text: 'Ask Jarrah what a seaweed corkscrew might have been', at: 'jarrah',
      done: { flags: { sq_eggcase_id: true } } },
    { id: 's2', text: 'Tell Vernon what it was', at: 'vernon', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 30 },
    { type: 'money', amount: 12 }
  ],
  repeatable: false
};

SU.data.quests.q_side_calls = {
  title: 'Three Voices',
  zone: 'coral_kingdom', giver: 'ama', type: 1,
  summary: 'A visiting researcher needs three different marine mammal species recorded, and the park ' +
           'has said yes in the way institutions say yes when they hope you will go away.',
  steps: [
    { id: 's1', text: 'Record the bottlenose dolphins', at: 'rec_coral',
      done: { flags: { sq_call_bottlenose: true } } },
    { id: 's2', text: 'Record the belugas in Arctic Cove', at: 'rec_arctic',
      done: { flags: { sq_call_beluga: true } } },
    { id: 's3', text: 'Record the pilot whales in Open Ocean', at: 'rec_ocean',
      done: { flags: { sq_call_pilot: true } } },
    { id: 's4', text: 'Take the recordings back to Dr Osei', at: 'ama', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 60 },
    { type: 'money', amount: 25 }
  ],
  repeatable: false
};

/* --- ARCTIC COVE ---------------------------------------------- */

SU.data.quests.q_side_beluga = {
  title: 'She Said My Name',
  zone: 'arctic_cove', giver: 'bev', type: 2,
  summary: 'Bev Nkemelu is certain the beluga said her name. Bev Nkemelu would like this on the record.',
  steps: [
    { id: 's1', text: 'Ask Rune whether that is even possible', at: 'rune',
      done: { flags: { sq_beluga_mimic: true } } },
    { id: 's2', text: 'Report back to Bev', at: 'bev', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 30 },
    { type: 'money', amount: 12 }
  ],
  repeatable: false
};

SU.data.quests.q_side_sheet = {
  title: 'Thirty-One Wrong Answers',
  zone: 'arctic_cove', giver: 'denny', type: 2,
  summary: 'A scout leader is holding thirty-one completed worksheets and has just been told that ' +
           'question four is wrong. He is taking it about as well as can be expected.',
  steps: [
    { id: 's1', text: 'Get Mags to put the correction in writing', at: 'mags',
      done: { flags: { sq_sheet_signed: true } } },
    { id: 's2', text: 'Take the signed correction to Denny', at: 'denny', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 30 },
    { type: 'money', amount: 12 }
  ],
  repeatable: false
};

/* --- OPEN OCEAN ----------------------------------------------- */

SU.data.quests.q_side_manta = {
  title: 'Not A Duck',
  zone: 'open_ocean', giver: 'ros', type: 2,
  summary: 'A honeymooning couple have been arguing for an hour about what the manta\'s belly spots ' +
           'look like. They would like photographic evidence. They will not get agreement.',
  steps: [
    { id: 's1', text: 'Photograph the manta\'s belly (needs the Pocket Camera)', at: 'manta_belly_spot',
      done: { flags: { sq_manta_photo: true } } },
    { id: 's2', text: 'Show Ros the photo', at: 'ros', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 35 },
    { type: 'money', amount: 14 }
  ],
  repeatable: false
};

/* --- THE DEEP -------------------------------------------------- */

SU.data.quests.q_side_painting = {
  title: 'Bin Provenance',
  zone: 'the_deep', giver: 'lulu', type: 2,
  summary: 'An artist threw a painting away in a bad five minutes and has spent the hour since ' +
           'deciding it was the best thing she has ever done.',
  steps: [
    { id: 's1', text: 'Find the painting in the bin by the rail', at: 'deep_bin',
      done: { hasItems: { binned_painting: 1 } } },
    { id: 's2', text: 'Give it back to Lulu', at: 'lulu', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 35 },
    { type: 'money', amount: 14 }
  ],
  repeatable: false
};
