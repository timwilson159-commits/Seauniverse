/* ============================================================
   SEA UNIVERSE: SORTING STATION (arcade game 4)

   Eight rounds. One animal on the table; pick which group it belongs
   to from four options. Six right out of eight pays out.

   THE ORIGINAL CONCEPT WAS "DRAG ANIMALS INTO CATEGORIES AGAINST A
   TIMER". Dropped both halves on purpose. The engine has no drag and
   drop input and no real-time modal (the arcade's own design notes
   flagged both as expensive, engine-lacking asks when the six games
   were chosen), and a punishing countdown is a fail state, which this
   project has never had anywhere else. FIXED ROUNDS, NOT SUDDEN DEATH,
   same shape as BIGGER OR SMALLER: all eight always play out, the
   correct group is shown either way, and the score is what decides
   the payout. data/arcade.js's blurb was rewritten to match; it used
   to promise a clock this game does not have.

   NO NEW CONTENT FILE. The categories are `SU.data.species[id].group`,
   already on every dex entry (Pinniped, Cetacean, Mustelid, Reptile,
   Elasmobranch, Cephalopod, Ray, Sirenian). Same precedent as
   MATCH THE POD: reuse the dex rather than author a parallel list that
   can drift out of sync with it.

   DISTRACTORS ARE OTHER GROUPS THAT ACTUALLY EXIST IN THE DEX, not
   invented category names, so a wrong option is still a real answer to
   a different animal rather than a made-up trap.
   ============================================================ */
window.SU = window.SU || {};

SU.Sorting = (function () {
  const ROUNDS = 8;
  const TO_WIN = 6;

  let el, machine = null;
  let picked = [];          // this run's ROUNDS species ids, no repeats
  let allGroups = [];       // every distinct group value in the dex
  let round = 0;            // rounds completed
  let correct = 0;
  let currentId = null;
  let correctGroup = '';
  let options = [];
  let answered = false;
  let lastRight = false;
  let done = false;
  /* Whether the cabinet ACTUALLY paid: it only pays once, so a second
     passing run must not print a line promising money that never
     arrived. */
  let paid = false;

  function init() { el = document.getElementById('sorting'); }

  function start(o) {
    machine = o;

    const ids = Object.keys(SU.data.species || {}).filter(id => SU.data.species[id].group);
    allGroups = SU.shuffle(Array.from(new Set(ids.map(id => SU.data.species[id].group))));
    if (ids.length < ROUNDS || allGroups.length < 4) {
      SU.UI.toast('This machine has no data loaded.');
      return;
    }

    picked  = SU.shuffle(ids).slice(0, ROUNDS);
    round   = 0;
    correct = 0;
    done    = false;
    paid    = false;        // reset, or a replay inherits the first run's payout
    setupRound();

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

  /* Built once per round, never per render, or the options would
     reshuffle under the player's cursor between clicks. Same rule the
     care sessions, the hearing and every other quiz-shaped panel in
     this game already follow. */
  function setupRound() {
    currentId = picked[round];
    correctGroup = SU.data.species[currentId].group;
    const distractors = SU.shuffle(allGroups.filter(g => g !== correctGroup)).slice(0, 3);
    options = SU.shuffle([correctGroup].concat(distractors));
    answered = false;
  }

  function choose(group) {
    if (answered || done) return;
    lastRight = group === correctGroup;
    if (lastRight) correct++;
    answered = true;
    SU.Audio && SU.Audio.play(lastRight ? 'care_right' : 'care_wrong');
    render();
  }

  function next() {
    round++;
    if (round >= ROUNDS) {
      done = true;
      /* finish() handles its own sound and toast. */
      if (correct >= TO_WIN && machine) paid = SU.Arcade.finish(machine, true);
      return render();
    }
    setupRound();
    render();
  }

  /* ---------- render ----------
     Reuses .big-box / .big-actions / .big-good / .big-bad from
     BIGGER OR SMALLER's stylesheet: same panel chrome, same scored-quiz
     shape, no reason to duplicate the CSS for it. Only the card and the
     option buttons are this game's own. */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function render() {
    let h = '<nav class="tabs"><span class="shop-title">SORTING STATION</span>' +
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
             : 'You needed ' + TO_WIN + '. No payout, but the animals are yours to keep.') +
           '</p>';
      h += '<div class="big-actions"><button data-close="1">Done</button></div>';
    } else {
      const sp = SU.data.species[currentId];
      h += '<p class="muted">Round ' + (round + 1) + ' of ' + ROUNDS + ' · ' + correct + ' correct</p>';
      h += '<p class="sort-ask">Which group does this animal belong to?</p>';
      h += '<div class="sort-card">' +
             '<img class="sort-art" data-species="' + esc(currentId) + '" alt="">' +
             '<div class="sort-name">' + esc(sp.name) + '</div>' +
           '</div>';

      if (!answered) {
        h += '<div class="sort-opts">';
        options.forEach(g => {
          h += '<button class="sort-opt" data-group="' + esc(g) + '">' + esc(g) + '</button>';
        });
        h += '</div>';
      } else {
        h += '<p class="' + (lastRight ? 'big-good' : 'big-bad') + '">' +
             (lastRight ? 'Correct. ' : 'Not this time. ') +
             esc(sp.name) + ' is a ' + esc(correctGroup) + '.</p>';
        h += '<div class="big-actions"><button data-next="1">' +
             (round + 1 >= ROUNDS ? 'See score' : 'Next') + '</button></div>';
      }
    }

    el.innerHTML = '<div class="big-box">' + h + '</div></div>';
    wire();
  }

  function wire() {
    el.querySelectorAll('[data-close]').forEach(b => b.onclick = close);
    el.querySelectorAll('[data-group]').forEach(b => b.onclick = () => choose(b.dataset.group));
    const n = el.querySelector('[data-next]');
    if (n) n.onclick = next;
    const img = el.querySelector('.sort-art');
    if (img) {
      const id = img.dataset.species;
      SU.Sprites.attach(img, ['animal_' + id], ok => { if (!ok) img.remove(); });
    }
  }

  return {
    init, start, close,
    get isOpen() { return el && !el.classList.contains('hidden'); }
  };
})();

SU.Arcade.register('sorting', SU.Sorting.start);
