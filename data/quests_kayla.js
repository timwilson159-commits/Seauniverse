/* ============================================================
   SEA UNIVERSE: KAYLA'S QUESTIONS

   One quest per zone, unlocked when Kayla turns up, which is when
   that zone's induction is finished. Every one has the same shape:

     ask trainer A  ->  ask trainer B (if the zone has two)
                    ->  report back to Kayla

   THE JOKE ONLY WORKS IF SHE IS RIGHT. Each question sounds daft,
   the trainer is briefly thrown, and then confirms that the daft
   thing is real husbandry with a proper name. Then Kayla explains
   why she asked, and the reason is always genuinely correct biology.

   She is an ADULT visitor: over-invested, cheerful, slightly silly,
   and perfectly aware her questions sound ridiculous. She is not a
   know-it-all. Keep her delighted rather than vindicated, and let
   the trainers be the experts. See the tone note at the top of
   data/npcs_kayla.js before writing any more of her.

   Reward is the same everywhere: an icy pole and twenty energy. See
   the note on `icy_pole` in data/items.js for why it is not one of
   the four kiosk snacks.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.quests = SU.data.quests || {};

/* Shared, so retuning the payout is one edit rather than five. */
SU.data.kaylaReward = [
  { type: 'addXP', amount: 45 },
  { type: 'giveItem', id: 'icy_pole' },
  { type: 'energy', amount: 20 },
  { type: 'toast', text: 'Kayla broke an icy pole in half, hesitated, and gave you the smaller half.', kind: 'good' }
];

/* --- ZONE 1: snoot boops, and scrubbed otter tummies ----------- */
SU.data.quests.q_kayla_cove = {
  title: 'Two Very Important Questions',
  zone: 'coastal_cove', giver: 'kayla_cove', type: 2,
  summary: 'A visitor by the seal pool has two questions nobody who works here has ever been asked, ' +
           'and she would like proper answers to both.',
  steps: [
    { id: 's1', text: 'Ask Dana whether the harbour seals get snoot boops',
      at: 'dana', done: { flags: { kq_seal_boop: true } } },
    { id: 's2', text: 'Ask Milo whether the otters get their tummies scrubbed',
      at: 'milo', done: { flags: { kq_otter_tummy: true } } },
    { id: 's3', text: 'Take both answers back to Kayla', at: 'kayla_cove', done: null }
  ],
  rewards: SU.data.kaylaReward,
  repeatable: false
};

/* --- ZONE 2: does Kira ever get to be on sand ------------------ */
SU.data.quests.q_kayla_coral = {
  title: 'A Turtle On A Beach',
  zone: 'coral_kingdom', giver: 'kayla_coral', type: 2,
  summary: 'Kayla wants to know whether the green turtle ever gets taken out and put on sand, and ' +
           'she has a reason that is much better than the question sounds.',
  steps: [
    { id: 's1', text: 'Ask Dr Sato whether Kira ever gets to be on sand',
      at: 'sato', done: { flags: { kq_turtle_sand: true } } },
    { id: 's2', text: 'Take the answer back to Kayla', at: 'kayla_coral', done: null }
  ],
  rewards: SU.data.kaylaReward,
  repeatable: false
};

/* --- ZONE 3: the toothbrush, and the squishy head -------------- */
SU.data.quests.q_kayla_arctic = {
  title: 'A Walrus-Sized Toothbrush',
  zone: 'arctic_cove', giver: 'kayla_arctic', type: 2,
  summary: 'Two questions this time. One is about dental care for a two-tonne animal. The other is ' +
           'about whether a beluga\'s forehead is squishy.',
  steps: [
    { id: 's1', text: 'Ask Mags whether Nuka\'s tusks get brushed',
      at: 'mags', done: { flags: { kq_walrus_brush: true } } },
    { id: 's2', text: 'Ask Rune whether a beluga\'s head is squishy',
      at: 'rune', done: { flags: { kq_beluga_melon: true } } },
    { id: 's3', text: 'Take both answers back to Kayla', at: 'kayla_arctic', done: null }
  ],
  rewards: SU.data.kaylaReward,
  repeatable: false
};

/* --- ZONE 4: hats, and boats ----------------------------------- */
SU.data.quests.q_kayla_ocean = {
  title: 'Hats And Boats',
  zone: 'open_ocean', giver: 'kayla_ocean', type: 2,
  summary: 'Kayla has two questions about an orca almost nobody in this park will discuss, and she ' +
           'does not appear to have noticed that this is awkward.',
  steps: [
    { id: 's1', text: 'Ask Halina whether orcas ever wear their food',
      at: 'halina', done: { flags: { kq_orca_hat: true } } },
    { id: 's2', text: 'Ask Halina about giving an orca boat parts to play with',
      at: 'halina', done: { flags: { kq_orca_boat: true } } },
    { id: 's3', text: 'Take both answers back to Kayla', at: 'kayla_ocean', done: null }
  ],
  rewards: SU.data.kaylaReward,
  repeatable: false
};

/* --- ZONE 5: lettuce, and favourite songs ---------------------- */
SU.data.quests.q_kayla_deep = {
  title: 'Her Favourite Song',
  zone: 'the_deep', giver: 'kayla_deep', type: 2,
  summary: 'Kayla has got herself down here, which should not be possible, and she has two more ' +
           'questions. The second one is the hardest thing anybody asks you in this park.',
  steps: [
    { id: 's1', text: 'Ask Toby whether Pip gets lettuce in her whiskers',
      at: 'toby', done: { flags: { kq_dugong_lettuce: true } } },
    { id: 's2', text: 'Ask Sunil whether Kirra sings when she is happy',
      at: 'sunil', done: { flags: { kq_humpback_song: true } } },
    { id: 's3', text: 'Take both answers back to Kayla', at: 'kayla_deep', done: null }
  ],
  rewards: SU.data.kaylaReward,
  repeatable: false
};
