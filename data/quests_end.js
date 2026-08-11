/* ============================================================
   SEA UNIVERSE: THE ENDGAME QUESTS

   Two quests. The first is the last night, the second is the hearing.

   A NOTE ON THE CLOCK, because it would be very easy to build this
   wrong. The transfer happening overnight is real jeopardy, and the
   temptation is to make the finale depend on beating it. That would
   be the game's first and only fail state, in its last hour, in a
   classroom, for a student who reads slowly.

   So the clock does what every other clock in this game does: it pays
   a bonus and nothing else. The hearing happens either way. The one
   animal lost is lost either way, because that is scripted and is the
   point rather than the penalty. What the clock buys is whether the
   people who helped you are protected when the story breaks, which is
   a better thing to be racing for than a plot outcome.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.quests = SU.data.quests || {};

/* --- TYPE 5: the last night ---------------------------------------- */
SU.data.quests.q_end_night = {
  title: 'The Last Night',
  zone: 'the_deep', giver: 'wren_deep', type: 5,
  summary: 'The animals move before dawn and the story runs on Sunday. Between those two facts ' +
           'there is one night, and three people who are going to be standing in the blast when ' +
           'it goes off.',
  timed: {
    playSeconds: 420,
    label: 'Before the transport crews arrive',
    onTime: [
      { type: 'addXP', amount: 120 },
      { type: 'addSuspicion', amount: -20 },
      { type: 'setFlag', flag: 'crew_warned', value: true },
      { type: 'achievement', id: 'got_them_out' },
      { type: 'toast', text: 'All three warned, with hours to spare. Nobody gets blindsided.' }
    ]
  },
  steps: [
    { id: 's1', text: 'Warn Marisol before it breaks, so she is not the last to know', at: 'marisol',
      done: { flags: { warned_marisol: true } } },
    { id: 's2', text: 'Tell Ondine to get the network\'s copies out of the hide tonight', at: 'ondine',
      done: { flags: { warned_ondine: true } } },
    { id: 's3', text: 'Tell Toby, who will be on the pontoon alone when the crews arrive', at: 'toby',
      done: { flags: { warned_toby: true } } },
    { id: 's4', text: 'Leave the park through the main visitor gate', where: 'Coastal Cove · the south gate',
      done: { zoneVisited: 'the_room' } }
  ],
  rewards: [
    { type: 'addXP', amount: 180 },
    { type: 'addSkillPoints', amount: 2 }
  ],
  mainThread: true
};

/* --- TYPE 5: the hearing itself ------------------------------------ */
SU.data.quests.q_end_hearing = {
  title: 'Show Her the Gap',
  zone: 'the_room', giver: 'nell', type: 5,
  summary: 'Six claims the park has made in public, and a notebook four months deep. He will not ' +
           'lie to you once. He has never had to.',
  steps: [
    { id: 's1', text: 'Put the case to Nell Draycott, with Barry Cuda sitting opposite', at: 'the_hearing',
      done: { hearingDone: true } },
    { id: 's2', text: 'Hear from Nell what actually happens next', at: 'nell',
      done: { flags: { nell_debrief: true } } },
    { id: 's3', text: 'Ask her about the young male they moved overnight', at: 'nell',
      done: { flags: { told_about_41b: true } } },
    { id: 's4', text: 'Stand at the window with Wren', at: 'wren_room', done: null }
  ],
  rewards: [
    { type: 'addXP', amount: 400 },
    { type: 'addSkillPoints', amount: 5 }
  ],
  mainThread: true
};
