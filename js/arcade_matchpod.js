/* ============================================================
   SEA UNIVERSE: MATCH THE POD (arcade game 2)

   A plain memory game. Twelve cards, six pairs, flip two at a time
   and find every match. Clear the board and the cabinet pays out.

   IT USES THE ANIMALS THE GAME ALREADY HAS. The six species are
   drawn from SU.data.species and the faces are the existing
   animal_<id>.svg sprites, so this game ships no art and no content
   of its own: add a species to the dex and it can turn up here.

   THE NAME SHOWS ON EVERY FACE-UP CARD, not just matched ones. It
   costs nothing in difficulty (you still have to remember WHERE a
   card was) and it means the player reads twelve species names per
   game, which is the entire teaching payload. It also settles the
   case where two sprites look alike at card size.

   NO FAIL STATE, so there is no move limit and no timer. The move
   count is reported at the end as a score, never as a threshold.
   A board can always be cleared, which is the point: the payout is
   for finishing, and the cabinet only ever pays once anyway.
   ============================================================ */
window.SU = window.SU || {};

SU.MatchPod = (function () {
  const PAIRS    = 6;      // 12 cards, a 4x3 board: a short break, not a session
  const PEEK_MS  = 750;    // how long a mismatched pair stays visible

  let el, machine = null;
  let deck = [];           // [{ id, name, key }] one entry per CARD
  let flipped = [];        // indices currently face up and unmatched
  let matched = [];        // indices already solved
  let moves = 0;
  let busy = false;        // true while a mismatch is being shown
  let done = false;
  let timer = null;
  /* Whether the cabinet ACTUALLY paid: it only pays once, so a second
     clear must not print a line promising money that never arrived. */
  let paid = false;

  function init() { el = document.getElementById('matchpod'); }

  function start(o) {
    machine = o;
    const pool = Object.keys(SU.data.species || {});
    if (pool.length < PAIRS) { SU.UI.toast('This machine has no animals loaded.'); return; }

    const picked = SU.shuffle(pool).slice(0, PAIRS);
    const cards = [];
    picked.forEach(id => {
      const sp = SU.data.species[id];
      cards.push({ id, name: sp.name });
      cards.push({ id, name: sp.name });
    });

    deck    = SU.shuffle(cards);
    flipped = [];
    matched = [];
    moves   = 0;
    busy    = false;
    done    = false;
    paid    = false;        // reset, or a replay inherits the first run's payout
    clearTimeout(timer);

    el.classList.remove('hidden');
    SU.Audio && SU.Audio.play('care_start');
    render();
  }

  function close() {
    SU.Audio && SU.Audio.clearOverride();
    clearTimeout(timer);
    el.classList.add('hidden');
    machine = null;
    if (SU.State.data) SU.bus.emit('state:changed');
  }

  function flip(i) {
    /* Three things must be refused, and all three are reachable by a
       fast clicker: a card already face up, a third card while two are
       showing, and any click during the mismatch peek. Without the busy
       flag a quick double click flips a third card and the pair logic
       below compares the wrong two. */
    if (busy || done) return;
    if (matched.indexOf(i) !== -1 || flipped.indexOf(i) !== -1) return;

    flipped.push(i);
    SU.Audio && SU.Audio.play('keypad_press');

    if (flipped.length < 2) return render();

    moves++;
    const [a, b] = flipped;

    if (deck[a].id === deck[b].id) {
      matched = matched.concat(flipped);
      flipped = [];
      SU.Audio && SU.Audio.play('care_right');

      if (matched.length === deck.length) {
        done = true;
        /* finish() plays its own sound and toasts the payout, so no
           extra fanfare here: two cues at once reads as a glitch. */
        if (machine) paid = SU.Arcade.finish(machine, true);
      }
      return render();
    }

    // a miss: show both, then turn them back
    busy = true;
    render();
    timer = setTimeout(() => {
      flipped = [];
      busy = false;
      render();
    }, PEEK_MS);
  }

  /* ---------- render ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function render() {
    const left = (deck.length - matched.length) / 2;

    let h = '<nav class="tabs"><span class="shop-title">MATCH THE POD</span>' +
            '<button class="close" data-close="1">✕</button></nav>' +
            '<div class="panel-body">';

    h += '<p class="muted">' + (done
      ? 'Board cleared in ' + moves + ' moves.'
      : left + (left === 1 ? ' pair' : ' pairs') + ' left. ' +
        moves + (moves === 1 ? ' move' : ' moves') + '.') + '</p>';

    h += '<div class="pod-grid">';
    deck.forEach((c, i) => {
      const isMatched = matched.indexOf(i) !== -1;
      const isUp = isMatched || flipped.indexOf(i) !== -1;
      h += '<button class="pod-card' + (isUp ? ' up' : '') + (isMatched ? ' matched' : '') + '"' +
           (isUp ? ' disabled' : '') + ' data-card="' + i + '">';
      if (isUp) {
        /* The <img> is filled in by wire(), not by a src here: the
           sprite loader walks svg then png then webp, so it has to be
           asked rather than guessed at. */
        h += '<img class="pod-art" data-species="' + esc(c.id) + '" alt="">' +
             '<span class="pod-name">' + esc(c.name) + '</span>';
      } else {
        h += '<span class="pod-back">?</span>';
      }
      h += '</button>';
    });
    h += '</div>';

    if (done) {
      h += '<p class="pod-good">Every pair found. ' +
           (paid ? 'The tray clunks.' : 'This machine has already paid out once.') + '</p>' +
           '<div class="pod-actions"><button data-close="1">Done</button></div>';
    }

    el.innerHTML = '<div class="pod-box">' + h + '</div></div>';
    wire();
  }

  function wire() {
    el.querySelectorAll('[data-close]').forEach(b => b.onclick = close);
    el.querySelectorAll('[data-card]').forEach(b =>
      b.onclick = () => flip(parseInt(b.dataset.card, 10)));
    el.querySelectorAll('.pod-art').forEach(img => {
      const id = img.dataset.species;
      SU.Sprites.attach(img, ['animal_' + id], ok => { if (!ok) img.remove(); });
    });
  }

  return {
    init, start, close,
    get isOpen() { return el && !el.classList.contains('hidden'); }
  };
})();

SU.Arcade.register('match_pod', SU.MatchPod.start);
