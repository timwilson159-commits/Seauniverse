/* ============================================================
   SEA UNIVERSE: BARRY AFTER THE PROSECUTION

   The player noticed Barry still wandering the park after the story
   was over and correctly called it a bug. It was: the five existing
   Barry NPCs are gated on story stage and on per-beat `barry_gone_N`
   flags, and nothing ever closed those gates at the end.

   Rather than delete him, he stays and he is a wreck.

   TWO HALVES, and both are needed or you get two Barrys:
     1. every original Barry gains `not: { flags: { game_completed } }`
     2. five new post-game Barrys spawn on that same flag

   Done programmatically at the foot of this file so no cast file had
   to be edited. Load order matters: AFTER every cast file.

   HOW TO WRITE HIM. He is not redeemed and he is not sympathetic.
   He is running the exact same trick he ran for the whole game, only
   now he is running it on himself: every single thing he says is
   TRUE, and it is arranged to mean something it does not mean. He
   never once says he did anything wrong. He says he is not a bad
   person, which is a different sentence, and he says it a lot.

   IT WORKS ON AN EXISTING SAVE. `game_completed` is set by the
   ending, so a finished playthrough picks this up on the next zone
   load with no new game and no migration.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};
SU.data.npcs = SU.data.npcs || {};

/* Shared shape, so five near-identical definitions do not sprawl. */
function makeSadBarry(id, zone, x, y, flag, first, again) {
  SU.data.npcs[id] = {
    name: 'Barry Cuda', role: 'Former CEO', zone: zone, sprite: 'barry_sad',
    place: 'somewhere he no longer works',
    x: x, y: y, colour: '#6b6f78', reactsToSuspicion: false,
    spawnCondition: { flags: { game_completed: true } },
    movement: { type: 'wander', radius: 1.5, speed: 0.75, pause: [2, 5] },
    dialogue: [
      { when: (function () { const c = { flags: {} }; c.flags[flag] = false; return c; })(),
        lines: first,
        onEnd: [
          { type: 'setFlag', flag: flag, value: true },
          { type: 'addXP', amount: 10, once: flag }
        ] },
      { lines: again }
    ]
  };
}

/* --- COASTAL COVE. Where he started, and where he keeps coming back. --- */
makeSadBarry('barry_sad_cove', 'coastal_cove', 20, 18, 'barry_sad_seen_cove',
  [
    'A man in a navy blazer is standing at the seal pool. The blazer is the same one. Everything ' +
      'else about him is different.',
    'BARRY: You.',
    'BARRY: No, it is fine. I am allowed to be here. I bought a ticket. I want you to know I bought ' +
      'a ticket, I did not walk in.',
    'BARRY: I come on Wednesdays. It is quieter.',
    'He looks at the pool rather than at you.',
    'BARRY: I built this. That is not a boast, it is a fact you can check. There was a caravan park ' +
      'here and I put a marine rescue facility on it and forty people have mortgages because of me.',
    'BARRY: And I have read what she printed and there is not one sentence in it that is untrue.',
    'BARRY: That is what I cannot make anybody understand. It is all true and it is still not what ' +
      'happened.',
    'BARRY: I was trying to help. That is the part that has gone missing. Somewhere in all of it, ' +
      'the fact that I was trying to help has gone missing.'
  ],
  [
    'BARRY: Wednesdays. I told you.',
    'BARRY: The seals do not know anything has changed. I find that either very comforting or the ' +
      'worst thing in the world, depending on the hour.'
  ]);

/* --- CORAL KINGDOM. The wall with the asterisk on it. --- */
makeSadBarry('barry_sad_coral', 'coral_kingdom', 31, 26, 'barry_sad_seen_coral',
  [
    'He is standing in front of the conservation wall reading it, which he must have read a thousand ' +
      'times, since he wrote it.',
    'BARRY: One hundred per cent of our profits. With the asterisk.',
    'BARRY: The asterisk was legal advice. Do you understand that? I did not put the asterisk there ' +
      'to be clever, I put it there because a solicitor told me to put it there.',
    'BARRY: And that is the sentence they read out. That is the one that got read out.',
    'He touches the edge of the sign and then stops himself.',
    'BARRY: I am not a bad person.',
    'BARRY: I know how that sounds. I have heard myself say it now about nine hundred times and I ' +
      'know exactly how it sounds.',
    'BARRY: But there is a difference between a bad person and a person who was wrong, and nobody ' +
      'in this country is interested in that difference any more.'
  ],
  [
    'BARRY: They have not taken the wall down. Have you noticed that? Not one word of it has come down.',
    'BARRY: Because it is all still true.'
  ]);

/* --- ARCTIC COVE. He is not dressed for it and he does not leave. --- */
makeSadBarry('barry_sad_arctic', 'arctic_cove', 24, 30, 'barry_sad_seen_arctic',
  [
    'He is on the promenade in the blazer and nothing else, in the cold, and he has been there long ' +
      'enough to have stopped shivering, which is worse.',
    'BARRY: I never touched an animal. In nine years. Not once.',
    'BARRY: People think I was down there with a net. I signed things. That is what I did, I signed ' +
      'things that other people wrote and other people carried out.',
    'BARRY: There is a document with a walrus on it and the word VALUATION and my initials, and I ' +
      'could not tell you what day I signed it or what else was in the pile.',
    'BARRY: That is not a defence. I know it is not a defence. The solicitor said do not use that ' +
      'as a defence.',
    'He puts his hands in his pockets.',
    'BARRY: I am fifty-eight. Do you know what they give you for this? I have looked it up. I have ' +
      'looked it up more than once.',
    'BARRY: I do not think I would do well.'
  ],
  [
    'BARRY: You get used to the cold. That is the thing nobody tells you. You just get used to it.',
    'BARRY: I have been practising getting used to things.'
  ]);

/* --- OPEN OCEAN. The flagship, and the stadium with nothing in it. --- */
makeSadBarry('barry_sad_ocean', 'open_ocean', 27, 3, 'barry_sad_seen_ocean',
  [
    'He is standing at the top of the plaza looking down the length of the wing he built, with his ' +
      'hands folded in front of him like a man at a funeral.',
    'BARRY: Phase two was going to be extraordinary.',
    'BARRY: I am not going to pretend it was for the animals. You would not believe me and I am tired ' +
      'of the sound of it.',
    'BARRY: It was going to be the best marine facility in the southern hemisphere and my name was ' +
      'going to be on it, and both of those things were going to be true at the same time.',
    'BARRY: I do not see why that is a crime. Wanting both.',
    'A very long pause.',
    'BARRY: The board has issued a statement about me. Have you read it?',
    'BARRY: Every word of that is true as well. Every single word. They have learned it off me and ' +
      'they have done it to me, and I would admire it if it were happening to somebody else.'
  ],
  [
    'BARRY: There is nothing in that stadium. There was never going to be anything in it before ' +
      'September.',
    'BARRY: Nobody prints that bit.'
  ]);

/* --- THE DEEP. He does not perform down here. --- */
makeSadBarry('barry_sad_deep', 'the_deep', 44, 38, 'barry_sad_seen_deep',
  [
    'He is at the far end of the walkway, a long way from the gate, and he does not hear you coming.',
    'BARRY: I do not know where he is.',
    'BARRY: That is the honest answer and it is the one that is going to finish me, because nobody ' +
      'believes a man who says he does not know where an animal went.',
    'BARRY: He was a stock number. He came in as a stock number, he was on a manifest as a stock ' +
      'number, and I signed for a stock number.',
    'BARRY: I never gave him a name. That was the whole arrangement and I did not think about it once.',
    'He is quiet for a while.',
    'BARRY: I have thought about it now.',
    'BARRY: Every night, as it happens. Which does nothing for him.',
    'BARRY: You should go. There is nothing here and I would rather you did not watch me stand in it.'
  ],
  [
    'BARRY: Still here.',
    'BARRY: I keep expecting somebody to tell me I am not allowed. Nobody ever does. That is the ' +
      'part I did not expect.'
  ]);

/* ============================================================
   Close the old gates and open the new ones.
   ============================================================ */
(function retireTheOldBarrys() {
  /* The five originals now refuse to spawn once the game is finished.
     Without this you meet him twice in the same zone, in two moods. */
  ['barry', 'barry_reef', 'barry_arctic', 'barry_ocean', 'barry_deep'].forEach(id => {
    const n = SU.data.npcs[id];
    if (!n) { console.warn('[SU] sad Barry: no original called', id); return; }
    n.spawnCondition = n.spawnCondition || {};
    n.spawnCondition.not = { flags: { game_completed: true } };
  });
})();
