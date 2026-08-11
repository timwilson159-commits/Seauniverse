/* ============================================================
   SEA UNIVERSE: ENDGAME PROGRESSION

   Achievements and story beats for the finale. No new evidence: the
   whole point of the hearing is that it uses documents the player
   already gathered, and adding a magic exhibit at the end would undo
   four zones of collecting.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

Object.assign(SU.data.achievements, {
  out_the_gate:   { name: 'Out the Gate',       desc: 'Leave the park for the first time.', xp: 40 },
  got_them_out:   { name: 'Nobody Blindsided',  desc: 'Warn all three of them before the crews arrive.', xp: 120 },
  the_gap:        { name: 'Show Her the Gap',   desc: 'Put the case to a journalist with Barry Cuda in the room.', xp: 200 },
  clean_case:     { name: 'Not One of Them Argued', desc: 'Answer every point in the hearing first time.', xp: 250 },
  the_whole_thing:{ name: 'Five Animals',       desc: 'Finish the story.', xp: 300 },
  not_a_number:   { name: 'Asked After',        desc: 'Document 41-B well enough that somebody can still look for him.', xp: 150 }
});

/* `clean_case` is a STATE (every round answered first time), so it needs
   a rule rather than an effect: there is no single place it happens. */
SU.data.achievementRules.push(
  { id: 'clean_case', when: { hearingDone: true, hearingPerfect: true } }
);

SU.data.storyBeats.push(
  {
    id: 'end_night',
    title: 'The Last Night',
    zone: 'The Deep',
    summary: 'The transport was booked a fortnight ago and nobody had told the three people who ' +
             'would be standing in it. A manager who signed for the site, a technician with a room ' +
             'full of copies, and a boy who would have walked out into the dark to see what the ' +
             'noise was.',
    when: { flags: { warned_marisol: true, warned_ondine: true, warned_toby: true } }
  },
  {
    id: 'end_hearing',
    title: 'Show Her the Gap',
    zone: 'The Room',
    summary: 'Six claims the park had made in public, answered with its own paperwork, in front of ' +
             'a journalist who would only print what could be stood up. He never lied once. He ' +
             'had never had to, and that was always the story.',
    when: { flags: { hearing_held: true } }
  },
  {
    id: 'end_five',
    title: 'Five Animals',
    zone: 'The Room',
    summary: 'Three going to a bay nine hours south, one going back to the group she was taken ' +
             'from, and one staying, in a managed lagoon, because she had never foraged and saying ' +
             'so was the harder and better answer. Barry Cuda was entirely fine. The next drawing ' +
             'is already being coloured in.',
    when: { flags: { game_completed: true } }
  }
);
