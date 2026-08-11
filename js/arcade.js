/* ============================================================
   SEA UNIVERSE: ARCADE SHELL

   The cabinet, not the games. This file owns the bit every machine
   shares: investigate, read the title, Play or Leave, and the payout
   when a game reports a win. The games themselves land one per file
   and register with SU.Arcade.register().

   ADDING A GAME, in full:
     1. write js/arcade_<id>.js
     2. call SU.Arcade.register('<id>', open) at the foot of it
     3. call SU.Arcade.finish(machine, won) when the player is done
     4. add the <script> to index.html
     5. IF IT OPENS A PANEL, add that panel to the TWO hand-maintained
        lists in js/main.js: `modalOpen` in handlePress, and `paused`
        in the frame loop. Miss the first and keys leak through to the
        map; miss the second and the player walks around underneath
        the game. Both are literal enumerations, not a registry.

   Until a game registers, its cabinets say so instead of pretending.
   ============================================================ */
window.SU = window.SU || {};

SU.Arcade = (function () {
  const games = {};

  function register(id, open) { games[id] = open; }

  function def(id) { return (SU.data.arcadeGames || {})[id] || null; }

  /* The Play / Leave prompt. Deliberately the same shape as the duty
     offer in js/interact.js: lines then two choices, no new panel. */
  function open(o) {
    const g = def(o.game);
    if (!g) {
      SU.Dialogue.open({ lines: ['The screen is dark and the coin slot is taped over.'] }, o.name);
      return;
    }

    const paid = alreadyPaid(o);
    const pay  = SU.config.arcade.pay;

    SU.Dialogue.open({
      lines: [
        'An arcade cabinet, boxed in scratched blue plastic. The attract screen loops a title: ' +
          g.title + '.',
        g.blurb + (paid
          ? '\n\nThe payout tray is empty. This one has already given up its $' + pay + '.'
          : '\n\nA sticker under the screen: FINISH THE GAME, WIN $' + pay + '.')
      ],
      choices: [
        { text: '▸ Play ' + g.title, action: () => play(o) },
        { text: 'Leave it' }
      ]
    }, o.name);
  }

  function play(o) {
    const g = def(o.game);
    const launch = games[o.game];

    /* Honest about an unbuilt game. The machines are all placed before
       the games are written, so this is the normal state for most of
       them for a while, and it must not look like a bug. */
    if (!launch) {
      SU.Audio && SU.Audio.play('blocked');
      SU.Dialogue.open({ lines: [
        'The screen flickers, thinks about it, and settles on two words.',
        'OUT OF ORDER.\n\nSomebody has written under it in marker: "coming soon (allegedly)".'
      ] }, g.title);
      return;
    }
    /* One switch here covers all six games rather than one per file:
       every cabinet launches through this function, so this is the
       single point where "a game is being played" is true. Each game's
       own close() clears it again (SU.Audio.clearOverride()) - see the
       note there for why that could not be centralised the same way. */
    SU.Audio && SU.Audio.playOverride('arcade');
    launch(o);
  }

  /* ---------- payout ----------
     A CLAIM RULE IS NOT OPTIONAL HERE. Eighteen machines paying $3
     every day would be $54 a day against a clean shift's $10, which
     would undo the 2026-08-06 money rebalance on its own. The default
     is therefore once per machine, ever: $54 across the whole game,
     which sits sensibly beside the $373 of money effects in the world.
     Switch config.arcade.claim to 'daily' if that is ever wanted. */
  function claimKey(o) { return 'arcade_' + o.id; }

  function alreadyPaid(o) {
    return SU.config.arcade.claim === 'daily'
      ? SU.State.claimedToday(claimKey(o))
      : SU.State.claimed(claimKey(o));
  }

  /* Call with won:false and the game still ends cleanly and pays
     nothing. NO FAIL STATE: losing costs nothing, it just does not
     pay, and the machine stays playable. */
  function finish(o, won) {
    if (!won) return false;

    const first = SU.config.arcade.claim === 'daily'
      ? SU.State.claimDaily(claimKey(o))
      : SU.State.claimOnce(claimKey(o));

    if (!first) {
      SU.UI.toast('Finished. This machine has already paid out.', 'good');
      return false;
    }

    SU.Rules.apply([{ type: 'money', amount: SU.config.arcade.pay }]);
    SU.Audio && SU.Audio.play('item_get');
    SU.UI.toast('The tray clunks. $' + SU.config.arcade.pay + '.', 'good');
    return true;
  }

  return { open, play, finish, register, def };
})();
