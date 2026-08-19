/* ============================================================
   SEA UNIVERSE: AQUAWORD (arcade game 1)

   Wordle, then one comprehension question. Guess the hidden marine
   word in six tries, then pick what it actually means. Get both and
   the cabinet pays out.

   REBUILT 2026-08-11 TO LOOK AND FEEL LIKE AN ACTUAL WORDLE. The
   original version used a plain text `<input>` below the grid: type
   a full guess, press a Guess button, watch it land as a finished row.
   Students found that unfamiliar. This version types INTO the grid
   itself, live, the same way the real game does: the active row fills
   letter by letter as you type or click, remaining rows stay blank,
   and there is a clickable on-screen QWERTY keyboard underneath that
   colours itself as letters are ruled in or out. Both physical typing
   and clicking the on-screen keys work, at the same time, for the
   same guess.

   NO TEXT INPUT MEANS NO ESCAPE TRAP. The previous version needed
   special handling because a browser text input steals every keydown
   from the page while it has focus, which is why Escape used to have
   to be caught INSIDE the panel. There is no input element anymore,
   so physical keys are read the normal way every other click-driven
   panel in this project already uses: js/main.js's one global keydown
   handler calls `SU.Aquaword.keyPress(e)` early, before the
   KeyM/KeyE/KeyP hotkey branches, same reasoning and same place as
   RESCUE!'s equivalent hook.

   SHARES ITS KEYBOARD CSS WITH RESCUE! (.kb-row / .kb-key in
   style.css), which was renamed from Rescue-only names to generic
   ones for exactly this reuse, rather than duplicating a QWERTY
   layout a second time.

   NO FAIL STATE, same rule as always. Running out of guesses reveals
   the word AND its definition, because the lesson always shows; it
   simply does not pay. The machine stays playable afterwards.

   WHY THE MATCHING ROUND EXISTS: solving a word puzzle proves you can
   spell, not that you know what a fluke is. The second round is the
   teaching, and it is why the payout is gated on it rather than on
   the grid. The three wrong options are other entries' definitions,
   so the content maintains itself: add a word to
   data/arcade_aquaword.js and it becomes both a puzzle and a
   distractor, with no extra authoring.

   ONLY 4 AND 5 LETTER WORDS NOW (see the data file for why): the grid
   and keyboard no longer need to cope with anything longer, so the
   variable-width grid logic stays but the practical range is narrow.
   ============================================================ */
window.SU = window.SU || {};

SU.Aquaword = (function () {
  const MAX_GUESSES = 6;
  const KB_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

  let el, machine = null;
  let entry = null;          // the chosen { word, def }
  let answer = '';
  let guesses = [];          // strings already submitted
  let currentGuess = '';     // the row being typed right now
  let phase = 'guess';       // 'guess' | 'define' | 'over'
  let options = [];          // definition choices for the second round
  let solved = false;
  let message = '';
  /* Whether the cabinet ACTUALLY paid: it only pays once, so a second
     win must not print a line promising money that never arrived. */
  let paid = false;

  function init() { el = document.getElementById('aquaword'); }

  function start(o) {
    machine = o;
    const pool = SU.data.aquawordWords || [];
    if (!pool.length) { SU.UI.toast('This machine has no words loaded.'); return; }

    entry   = pool[Math.floor(Math.random() * pool.length)];
    answer  = entry.word.toUpperCase();
    guesses = [];
    currentGuess = '';
    phase   = 'guess';
    solved  = false;
    message = '';
    paid    = false;        // reset, or a replay inherits the first run's payout

    /* Built once, here, and NEVER in render(): options rebuilt on every
       draw would reshuffle under the player's cursor between clicks.
       Same rule the care sessions and the hearing already follow. */
    const others = pool.filter(w => w.word !== entry.word);
    options = SU.shuffle([entry.def].concat(SU.shuffle(others).slice(0, 3).map(w => w.def)));

    el.classList.remove('hidden');
    SU.Audio && SU.Audio.play('care_start');
    render();
  }

  function close() {
    el.classList.add('hidden');
    machine = null;
    /* Guarded: `state:changed` runs the quest evaluator, which reads
       SU.State.data and throws on null. Closing a panel should never be
       able to crash on the title screen, where there is no game yet.
       The payout emits its own change anyway, so this only refreshes
       the HUD after a quit. */
    if (SU.State.data) SU.bus.emit('state:changed');
  }

  /* ---------- scoring ----------
     TWO PASSES, and it has to be two. Marking greens and yellows in a
     single sweep double-counts repeated letters: guess ALGAL against
     BALEEN would light both Ls when the answer holds one. Pass one
     takes the exact positions and spends those letters, pass two hands
     out "present" only from what is left. */
  function score(guess) {
    const res = new Array(guess.length).fill('absent');
    const left = {};
    for (const ch of answer) left[ch] = (left[ch] || 0) + 1;

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) { res[i] = 'correct'; left[guess[i]]--; }
    }
    for (let i = 0; i < guess.length; i++) {
      if (res[i] === 'correct') continue;
      if (left[guess[i]] > 0) { res[i] = 'present'; left[guess[i]]--; }
    }
    return res;
  }

  /* Best-known state of every letter guessed so far, for colouring the
     on-screen keyboard. correct beats present beats absent. */
  function letterStates() {
    const rank = { absent: 0, present: 1, correct: 2 };
    const best = {};
    guesses.forEach(g => {
      const s = score(g);
      for (let i = 0; i < g.length; i++) {
        const cur = best[g[i]];
        if (cur === undefined || rank[s[i]] > rank[cur]) best[g[i]] = s[i];
      }
    });
    return best;
  }

  /* ---------- typing into the active row ---------- */
  function typeLetter(ch) {
    if (phase !== 'guess' || currentGuess.length >= answer.length) return;
    currentGuess += ch;
    message = '';
    render();
  }

  function backspace() {
    if (phase !== 'guess' || !currentGuess.length) return;
    currentGuess = currentGuess.slice(0, -1);
    render();
  }

  function submitGuess() {
    if (phase !== 'guess') return;
    if (currentGuess.length !== answer.length) { message = 'Not enough letters.'; return render(); }

    /* Deliberately NOT checked against a dictionary. A word list big
       enough to judge real English is a lot of weight for a cabinet in
       a staff room, and rejecting a student's honest attempt teaches
       nothing. Any letter string of the right length is allowed. */
    const guess = currentGuess;
    guesses.push(guess);
    currentGuess = '';
    message = '';

    if (guess === answer) {
      solved = true;
      phase = 'define';
      SU.Audio && SU.Audio.play('care_right');
    } else if (guesses.length >= MAX_GUESSES) {
      phase = 'over';
      SU.Audio && SU.Audio.play('care_wrong');
    } else {
      SU.Audio && SU.Audio.play('keypad_press');
    }
    render();
  }

  /* Routed here from js/main.js's global keydown handler. Only reads
     keys while a guess is actually being typed, so it is inert (and
     safely ignorable) during the definition round or the end screen,
     which are click-only by design. */
  function keyPress(e) {
    if (phase !== 'guess') return;
    const m = /^Key([A-Z])$/.exec(e.code);
    if (m) { e.preventDefault(); typeLetter(m[1]); return; }
    if (e.code === 'Backspace') { e.preventDefault(); backspace(); return; }
    if (e.code === 'Enter') { e.preventDefault(); submitGuess(); return; }
  }

  function chooseDef(i) {
    const right = options[i] === entry.def;
    phase = 'over';
    solved = right;
    SU.Audio && SU.Audio.play(right ? 'care_right' : 'care_wrong');
    if (right && machine) paid = SU.Arcade.finish(machine, true);
    render();
  }

  /* ---------- render ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function gridHTML() {
    let h = '<div class="aqua-grid">';
    for (let r = 0; r < MAX_GUESSES; r++) {
      const g = guesses[r];
      const s = g ? score(g) : null;
      const isActive = !g && r === guesses.length;
      h += '<div class="aqua-row">';
      for (let c = 0; c < answer.length; c++) {
        let cls = '', ch = '';
        if (g) { cls = s[c]; ch = g[c]; }
        else if (isActive && c < currentGuess.length) { cls = 'filled'; ch = currentGuess[c]; }
        h += '<span class="aqua-cell' + (cls ? ' ' + cls : '') + '">' + (ch ? esc(ch) : '') + '</span>';
      }
      h += '</div>';
    }
    return h + '</div>';
  }

  function keyboardHTML() {
    /* Wrapped in its own container for the same reason RESCUE!'s
       keyboard is: the `.kb-row:nth-child` stagger in style.css needs
       these three rows counted against each other, not against
       whatever else `panel-body` contains. */
    const st = letterStates();
    let h = '<div class="kb">';
    KB_ROWS.forEach((row, i) => {
      h += '<div class="aqua-strip kb-row">';
      if (i === 2) h += '<button class="aqua-key kb-key kb-wide" data-back="1">⌫</button>';
      row.split('').forEach(ch => {
        h += '<button class="aqua-key kb-key ' + (st[ch] || '') + '" data-letter="' + ch + '">' + ch + '</button>';
      });
      if (i === 2) h += '<button class="aqua-key kb-key kb-wide" data-enter="1">Enter</button>';
      h += '</div>';
    });
    return h + '</div>';
  }

  function render() {
    let h = '<nav class="tabs"><span class="shop-title">AQUAWORD</span>' +
            '<button class="close" data-close="1">✕</button></nav>' +
            '<div class="panel-body">';

    if (phase === 'guess') {
      h += '<p class="muted">A marine word, ' + answer.length + ' letters. ' +
           (MAX_GUESSES - guesses.length) + ' of ' + MAX_GUESSES + ' guesses left.</p>';
      h += gridHTML();
      if (message) h += '<p class="aqua-msg">' + esc(message) + '</p>';
      h += keyboardHTML();
    }

    if (phase === 'define') {
      h += '<p class="muted">Solved in ' + guesses.length +
           (guesses.length === 1 ? ' guess' : ' guesses') + '. One more thing:</p>';
      h += '<h3 class="aqua-word">' + esc(answer) + '</h3>';
      h += '<p class="muted">What does it mean?</p><div class="aqua-opts">';
      options.forEach((d, i) => {
        h += '<button class="aqua-opt" data-def="' + i + '">' + esc(d) + '</button>';
      });
      h += '</div>';
    }

    if (phase === 'over') {
      h += gridHTML();
      h += '<h3 class="aqua-word">' + esc(answer) + '</h3>';
      h += '<p class="aqua-def">' + esc(entry.def) + '</p>';
      h += '<p class="' + (solved ? 'aqua-good' : 'aqua-bad') + '">' +
           (solved
             ? (paid ? 'Both halves. The tray clunks and the machine pays out.'
                     : 'Both halves. This machine has already paid out once.')
             : (guesses.indexOf(answer) === -1
                 ? 'Out of guesses. No payout, but now you know the word.'
                 : 'Not that one. No payout this time, but the word was yours.')) +
           '</p>';
      h += '<div class="aqua-entry"><button data-close="1">Done</button></div>';
    }

    el.innerHTML = '<div class="aqua-box">' + h + '</div></div>';
    wire();
  }

  function wire() {
    el.querySelectorAll('[data-close]').forEach(b => b.onclick = close);
    el.querySelectorAll('[data-letter]').forEach(b => b.onclick = () => typeLetter(b.dataset.letter));
    const back = el.querySelector('[data-back]');
    if (back) back.onclick = backspace;
    const ent = el.querySelector('[data-enter]');
    if (ent) ent.onclick = submitGuess;
    el.querySelectorAll('[data-def]').forEach(b =>
      b.onclick = () => chooseDef(parseInt(b.dataset.def, 10)));
  }

  return {
    init, start, close, keyPress,
    get isOpen() { return el && !el.classList.contains('hidden'); }
  };
})();

SU.Arcade.register('aquaword', SU.Aquaword.start);
