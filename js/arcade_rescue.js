/* ============================================================
   SEA UNIVERSE: RESCUE! (arcade game 2)

   Hangman, then one comprehension question. Guess the hidden word one
   letter at a time; solve it and answer a question about it to make
   the cabinet pay out.

   NO FAIL STATE, same rule AQUAWORD already follows for the same
   shape of game. Classic hangman ends the run on the last wrong
   guess; here, running out of misses reveals the word AND the answer
   to its question, because the lesson always shows. It simply does
   not pay, and the machine stays playable.

   WHY THE QUESTION EXISTS: solving a hangman puzzle proves a player
   can narrow down letters, not that they know what a rostrum is. The
   question is the teaching, and the payout is gated on it rather than
   on the word, same reasoning as AQUAWORD's definition round.

   LETTER-CLICK OR PHYSICAL KEYBOARD, NOT TEXT ENTRY. AQUAWORD's
   Escape-inside-the-panel trap (the global key handler bails out
   whenever a text input has focus, so Esc never reaches the panel
   while a box has the cursor) does not apply here: there is no text
   input, only an on-screen keyboard, so Esc closes normally through
   js/main.js like every click-driven panel.

   PHYSICAL KEY PRESSES ARE ROUTED THROUGH js/main.js's ONE global
   keydown listener, not a second listener of this module's own. The
   engine only has the one (`SU.Input.init`'s `handlePress`), so
   `SU.Rescue.keyPress(e)` is called from there, EARLY, before the
   KeyM/KeyE/KeyP hotkey branches. That ordering is load bearing: M, E
   and P are all guessable letters, and those branches would otherwise
   fire first and toggle the menu, try to interact with the world, or
   toggle pause instead of guessing. (KeyP's own branch already checks
   `!modalOpen` so it was always a no-op while any modal was open;
   routing it to letter-guessing first is a behaviour change only in
   that P now guesses instead of silently doing nothing.)

   THE KEYBOARD IS LAID OUT QWERTY, not alphabetically, so it reads
   like a keyboard a player already knows rather than a lookup table.

   ALMOST NO NEW CSS. The panel reuses AQUAWORD's classes
   (.aqua-box / .aqua-key / .aqua-word / .aqua-def / .aqua-opts, etc):
   same shape of game, no reason to duplicate the styling for it. The
   miss lights (`.rescue-misses`) are the one new bit, since nothing
   else in the project needed a lives/misses indicator.
   ============================================================ */
window.SU = window.SU || {};

SU.Rescue = (function () {
  const MAX_MISSES = 8;

  let el, machine = null;
  let entry = null;          // the chosen { word, question, options }
  let answer = '';
  let guessed = [];          // letters guessed so far, right or wrong
  let misses = 0;
  let options = [];          // this round's question options, shuffled once
  let phase = 'guess';       // 'guess' | 'ask' | 'over'
  let solved = false;
  let answered = false;
  let rightAnswer = false;
  /* Whether the cabinet ACTUALLY paid: it only pays once, so a second
     win must not print a line promising money that never arrived. */
  let paid = false;

  function init() { el = document.getElementById('rescue'); }

  function start(o) {
    machine = o;
    const pool = SU.data.rescueWords || [];
    if (!pool.length) { SU.UI.toast('This machine has no words loaded.'); return; }

    entry    = pool[Math.floor(Math.random() * pool.length)];
    answer   = entry.word.toUpperCase();
    guessed  = [];
    misses   = 0;
    phase    = 'guess';
    solved   = false;
    answered = false;
    paid     = false;        // reset, or a replay inherits the first run's payout

    /* Built once, here, and NEVER in render(): shuffled options rebuilt
       on every draw would reorder under the player's cursor between
       clicks, same rule the care sessions, AQUAWORD and the hearing
       already follow. */
    options = SU.shuffle(entry.options.slice());

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

  function guessLetter(ch) {
    if (phase !== 'guess' || guessed.indexOf(ch) !== -1) return;
    guessed.push(ch);

    if (answer.indexOf(ch) === -1) {
      misses++;
      SU.Audio && SU.Audio.play('care_wrong');
      if (misses >= MAX_MISSES) phase = 'over';
    } else {
      SU.Audio && SU.Audio.play('keypad_press');
      const done = answer.split('').every(c => guessed.indexOf(c) !== -1);
      if (done) {
        solved = true;
        phase = 'ask';
        SU.Audio && SU.Audio.play('care_right');
      }
    }
    render();
  }

  /* Routed here from js/main.js's one global keydown handler. Only
     A-Z registers as a guess; everything else (digits, punctuation,
     modifier combos) is ignored rather than guessed, since a hangman
     letter is never anything but a letter. */
  function keyPress(e) {
    const m = /^Key([A-Z])$/.exec(e.code);
    if (!m) return;
    e.preventDefault();
    guessLetter(m[1]);
  }

  function chooseOption(i) {
    if (phase !== 'ask' || answered) return;
    answered = true;
    rightAnswer = !!options[i].correct;
    phase = 'over';
    SU.Audio && SU.Audio.play(rightAnswer ? 'care_right' : 'care_wrong');
    if (rightAnswer && machine) paid = SU.Arcade.finish(machine, true);
    render();
  }

  /* ---------- render ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function blanksHTML() {
    return '<h3 class="aqua-word">' +
           answer.split('').map(c => guessed.indexOf(c) !== -1 ? esc(c) : '_').join(' ') +
           '</h3>';
  }

  const KEYBOARD_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

  function keyboardHTML() {
    let h = '';
    KEYBOARD_ROWS.forEach(row => {
      h += '<div class="aqua-strip rescue-row">';
      row.split('').forEach(ch => {
        const isGuessed = guessed.indexOf(ch) !== -1;
        const st = !isGuessed ? '' : (answer.indexOf(ch) !== -1 ? 'correct' : 'absent');
        h += '<button class="aqua-key rescue-key ' + st + '" data-letter="' + ch + '"' +
             (isGuessed ? ' disabled' : '') + '>' + ch + '</button>';
      });
      h += '</div>';
    });
    return h;
  }

  /* Red lights for misses spent, dark unlit ones for misses still in
     hand: a lives indicator that reads at a glance, so a player is not
     reduced to doing the subtraction themselves from a sentence. */
  function missesHTML() {
    let h = '<div class="rescue-misses" title="' + misses + ' of ' + MAX_MISSES + ' misses used">';
    for (let i = 0; i < MAX_MISSES; i++) {
      h += '<span class="rescue-miss' + (i < misses ? ' lit' : '') + '"></span>';
    }
    return h + '</div>';
  }

  function correctText() {
    const c = entry.options.find(o => o.correct);
    return c ? c.text : '';
  }

  function render() {
    let h = '<nav class="tabs"><span class="shop-title">RESCUE!</span>' +
            '<button class="close" data-close="1">✕</button></nav>' +
            '<div class="panel-body">';

    if (phase === 'guess') {
      h += '<p class="muted">A marine word or term, ' + answer.length + ' letters.</p>';
      h += missesHTML();
      h += blanksHTML();
      h += keyboardHTML();
    }

    if (phase === 'ask') {
      h += '<p class="muted">Solved with ' + misses + (misses === 1 ? ' miss' : ' misses') +
           '. One more thing:</p>';
      h += '<h3 class="aqua-word">' + esc(answer) + '</h3>';
      h += '<p class="muted">' + esc(entry.question) + '</p><div class="aqua-opts">';
      options.forEach((o, i) => {
        h += '<button class="aqua-opt" data-opt="' + i + '">' + esc(o.text) + '</button>';
      });
      h += '</div>';
    }

    if (phase === 'over') {
      h += blanksHTML();
      h += '<p class="muted">' + esc(entry.question) + '</p>';
      h += '<p class="aqua-def">' + esc(correctText()) + '</p>';
      h += '<p class="' + ((solved && rightAnswer) ? 'aqua-good' : 'aqua-bad') + '">' +
           (!solved
             ? 'Out of misses. No payout, but now you know the word.'
             : (rightAnswer
                 ? (paid ? 'Both halves. The tray clunks and the machine pays out.'
                         : 'Both halves. This machine has already paid out once.')
                 : 'The word was yours, but not that answer. No payout this time.')) +
           '</p>';
      h += '<div class="aqua-entry"><button data-close="1">Done</button></div>';
    }

    el.innerHTML = '<div class="aqua-box">' + h + '</div></div>';
    wire();
  }

  function wire() {
    el.querySelectorAll('[data-close]').forEach(b => b.onclick = close);
    el.querySelectorAll('[data-letter]').forEach(b =>
      b.onclick = () => guessLetter(b.dataset.letter));
    el.querySelectorAll('[data-opt]').forEach(b =>
      b.onclick = () => chooseOption(parseInt(b.dataset.opt, 10)));
  }

  return {
    init, start, close, keyPress,
    get isOpen() { return el && !el.classList.contains('hidden'); }
  };
})();

SU.Arcade.register('rescue', SU.Rescue.start);
