/* ============================================================
   SEA UNIVERSE: BIGGER OR SMALLER (arcade game 3)

   Eight rounds. One animal is on the table with a number showing; a
   second arrives face down. Is it longer, heavier or longer-lived
   than the one already there? Six right out of eight pays out.

   FIXED ROUNDS, NOT SUDDEN DEATH, and that is the whole difference
   between this and the usual higher-or-lower game. A run that ends on
   the first wrong answer is a fail state, which this project does not
   have. Eight rounds always play out, every round shows both real
   numbers whether you were right or not, and the score is what
   decides the payout. Being wrong costs the payout, never the lesson.

   THE WINNER STAYS ON. The animal you just judged becomes the one on
   the table for the next round, so a run is a chain rather than eight
   unrelated pairs, and a student ends up ranking nine animals against
   each other rather than comparing pairs in isolation.

   THE STAT CHANGES EVERY ROUND on purpose. Length and mass mostly
   agree with each other, so a game of only those two rewards a single
   rule of thumb: bigger is bigger. Lifespan disagrees with both, and
   the moment a giant cuttlefish (about two years) beats a Port Jackson
   shark (about thirty) on nothing but age is the moment the game has
   taught something.
   ============================================================ */
window.SU = window.SU || {};

SU.Bigger = (function () {
  const ROUNDS = 8;
  const TO_WIN = 6;

  let el, machine = null;
  let pool = [];             // species ids that carry a full set of stats
  let current = null;        // the animal on the table
  let challenger = null;
  let statKey = 'length';
  let round = 0;             // rounds completed
  let correct = 0;
  let revealed = false;      // the challenger's number is showing
  let lastRight = false;
  let done = false;
  /* Whether the cabinet ACTUALLY paid. A machine only pays once, so a
     second winning run must not print a line promising money that never
     arrived. SU.Arcade.finish() reports this, so use it rather than
     assuming a win means a payout. */
  let paid = false;

  function init() { el = document.getElementById('bigger'); }

  function stats(id) { return SU.data.biggerStatsBySpecies[id]; }
  function stat()    { return SU.data.biggerStats[statKey]; }

  function start(o) {
    machine = o;

    /* Only species with a COMPLETE set of numbers, and which the dex
       also knows about (the card needs a name and a sprite). A
       half-filled entry drops out silently rather than producing a
       round with a blank number in it. */
    pool = Object.keys(SU.data.biggerStatsBySpecies || {}).filter(id => {
      const s = stats(id);
      return SU.data.species[id] && s &&
             typeof s.length === 'number' && typeof s.mass === 'number' && typeof s.lifespan === 'number';
    });
    if (pool.length < 3) { SU.UI.toast('This machine has no data loaded.'); return; }

    current   = SU.shuffle(pool)[0];
    round     = 0;
    correct   = 0;
    done      = false;
    paid      = false;      // reset, or a replay inherits the first run's payout
    nextRound();

    el.classList.remove('hidden');
    SU.Audio && SU.Audio.play('care_start');
    render();
  }

  function close() {
    SU.Audio && SU.Audio.clearOverride();
    el.classList.add('hidden');
    machine = null;
    if (SU.State.data) SU.bus.emit('state:changed');
  }

  /* Pick a stat and an opponent whose value actually DIFFERS on it.
     Ties would make a round unanswerable: neither button is right, and
     the player would be marked wrong for a correct reading. Several
     genuinely tie here (harbour seal and harp seal are both 1.7 m), so
     this is a real case, not a theoretical one. */
  function nextRound() {
    const keys = Object.keys(SU.data.biggerStats);
    for (let tries = 0; tries < 60; tries++) {
      const k = keys[Math.floor(Math.random() * keys.length)];
      const c = pool[Math.floor(Math.random() * pool.length)];
      if (c === current) continue;
      if (stats(c)[k] === stats(current)[k]) continue;
      statKey = k; challenger = c; revealed = false;
      return true;
    }
    /* Fallback: any opponent that differs on any stat. Only reachable
       with a pathologically small or flat data set. */
    const c = pool.find(id => id !== current && keys.some(k => stats(id)[k] !== stats(current)[k]));
    if (!c) return false;
    challenger = c;
    statKey = keys.find(k => stats(c)[k] !== stats(current)[k]);
    revealed = false;
    return true;
  }

  function answer(saidMore) {
    if (revealed || done) return;
    const isMore = stats(challenger)[statKey] > stats(current)[statKey];
    lastRight = (saidMore === isMore);
    if (lastRight) correct++;
    revealed = true;
    round++;
    SU.Audio && SU.Audio.play(lastRight ? 'care_right' : 'care_wrong');
    render();
  }

  function next() {
    if (round >= ROUNDS) {
      done = true;
      /* finish() handles its own sound and toast. */
      if (correct >= TO_WIN && machine) paid = SU.Arcade.finish(machine, true);
      return render();
    }
    current = challenger;          // the winner stays on
    nextRound();
    render();
  }

  /* ---------- render ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function noteFor(id) {
    const n = SU.data.biggerStatNotes[id];
    return n && n[statKey] ? ' <span class="big-note">(' + esc(n[statKey]) + ')</span>' : '';
  }

  function cardHTML(id, show) {
    const sp = SU.data.species[id];
    const s = stat();
    return '<div class="big-card">' +
             '<img class="big-art" data-species="' + esc(id) + '" alt="">' +
             '<div class="big-name">' + esc(sp.name) + '</div>' +
             '<div class="big-val">' +
               (show ? esc(s.fmt(stats(id)[statKey])) + noteFor(id) : '<span class="big-q">?</span>') +
             '</div>' +
           '</div>';
  }

  function render() {
    const s = stat();
    let h = '<nav class="tabs"><span class="shop-title">BIGGER OR SMALLER</span>' +
            '<button class="close" data-close="1">✕</button></nav>' +
            '<div class="panel-body">';

    if (done) {
      const won = correct >= TO_WIN;
      h += '<p class="muted">Final score.</p>';
      h += '<h3 class="big-score">' + correct + ' out of ' + ROUNDS + '</h3>';
      h += '<p class="' + (won ? 'big-good' : 'big-bad') + '">' +
           (won
             ? (paid ? 'That is a pass. The tray clunks and the machine pays out.'
                     : 'That is a pass, but this machine has already paid out once.')
             : 'You needed ' + TO_WIN + '. No payout, but the numbers are yours to keep.') +
           '</p>';
      h += '<div class="big-actions"><button data-close="1">Done</button></div>';
    } else {
      h += '<p class="muted">Round ' + Math.min(round + 1, ROUNDS) + ' of ' + ROUNDS +
           ' · ' + correct + ' correct</p>';
      h += '<p class="big-ask">' + esc(s.label) + ': ' + esc(s.ask) +
           ' <span class="big-note">(' + esc(s.note) + ')</span></p>';
      h += '<div class="big-row">' + cardHTML(current, true) +
           '<div class="big-vs">vs</div>' + cardHTML(challenger, revealed) + '</div>';

      if (!revealed) {
        h += '<div class="big-actions">' +
               '<button data-more="1">' + esc(s.more) + '</button>' +
               '<button data-more="0">' + esc(s.less) + '</button>' +
             '</div>';
      } else {
        h += '<p class="' + (lastRight ? 'big-good' : 'big-bad') + '">' +
             (lastRight ? 'Correct.' : 'Not this time.') + '</p>';
        h += '<div class="big-actions"><button data-next="1">' +
             (round >= ROUNDS ? 'See score' : 'Next') + '</button></div>';
      }
    }

    el.innerHTML = '<div class="big-box">' + h + '</div></div>';
    wire();
  }

  function wire() {
    el.querySelectorAll('[data-close]').forEach(b => b.onclick = close);
    el.querySelectorAll('[data-more]').forEach(b =>
      b.onclick = () => answer(b.dataset.more === '1'));
    const n = el.querySelector('[data-next]');
    if (n) n.onclick = next;
    el.querySelectorAll('.big-art').forEach(img => {
      const id = img.dataset.species;
      SU.Sprites.attach(img, ['animal_' + id], ok => { if (!ok) img.remove(); });
    });
  }

  return {
    init, start, close,
    get isOpen() { return el && !el.classList.contains('hidden'); }
  };
})();

SU.Arcade.register('bigger', SU.Bigger.start);
