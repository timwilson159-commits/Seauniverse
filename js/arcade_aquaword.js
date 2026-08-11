/* ============================================================
   SEA UNIVERSE: AQUAWORD (arcade game 1)

   Wordle, then one comprehension question. Guess the hidden marine
   word in six tries, then pick what it actually means. Get both and
   the cabinet pays out.

   NO FAIL STATE, same as everything else in this game. Running out of
   guesses reveals the word AND its definition, because the lesson
   always shows; it simply does not pay. The machine stays playable
   afterwards, so a student can come back and learn the word properly.

   WHY THE MATCHING ROUND EXISTS: solving a word puzzle proves you can
   spell, not that you know what a fluke is. The second round is the
   teaching, and it is why the payout is gated on it rather than on
   the grid. The three wrong options are other entries' definitions,
   so the content maintains itself: add a word to
   data/arcade_aquaword.js and it becomes both a puzzle and a
   distractor, with no extra authoring.

   VARIABLE WORD LENGTH is deliberate. Fixed at five letters the list
   would have been padded with weak words; the grid is built from the
   answer's own length and the length is stated up front.
   ============================================================ */
window.SU = window.SU || {};

SU.Aquaword = (function () {
  const MAX_GUESSES = 6;

  let el, machine = null;
  let entry = null;          // the chosen { word, def }
  let answer = '';
  let guesses = [];          // strings already submitted
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
    SU.Audio && SU.Audio.clearOverride();
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

  /* Best-known state of every letter guessed so far, for the strip
     under the grid. correct beats present beats absent. */
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

  function submit(raw) {
    const guess = String(raw || '').trim().toUpperCase();

    if (!/^[A-Z]+$/.test(guess))        { message = 'Letters only.'; return render(); }
    if (guess.length !== answer.length) { message = 'It is ' + answer.length + ' letters.'; return render(); }

    /* Deliberately NOT checked against a dictionary. A word list big
       enough to judge real English is a lot of weight for a cabinet in
       a staff room, and rejecting a student's honest attempt teaches
       nothing. Any letter string of the right length is allowed. */
    guesses.push(guess);
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
      h += '<div class="aqua-row">';
      for (let c = 0; c < answer.length; c++) {
        const cls = s ? ' ' + s[c] : '';
        h += '<span class="aqua-cell' + cls + '">' + (g ? esc(g[c]) : '') + '</span>';
      }
      h += '</div>';
    }
    return h + '</div>';
  }

  function stripHTML() {
    const st = letterStates();
    let h = '<div class="aqua-strip">';
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(ch => {
      h += '<span class="aqua-key ' + (st[ch] || '') + '">' + ch + '</span>';
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
      h += stripHTML();
      if (message) h += '<p class="aqua-msg">' + esc(message) + '</p>';
      h += '<div class="aqua-entry">' +
             '<input id="aquaInput" maxlength="' + answer.length + '" autocomplete="off" ' +
                    'spellcheck="false" aria-label="Your guess">' +
             '<button data-go="1">Guess</button>' +
           '</div>';
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
    const go = el.querySelector('[data-go]');
    const inp = el.querySelector('#aquaInput');
    if (go && inp) {
      go.onclick = () => submit(inp.value);
      /* Enter submits. The global key handler already bails out when an
         input has focus (the `typing()` guard in js/main.js), so W, A, S
         and D reach the box instead of walking the player around. */
      inp.onkeydown = e => {
        if (e.key === 'Enter') { e.preventDefault(); submit(inp.value); return; }
        /* Escape has to be handled HERE, not left to js/main.js. That
           handler returns early whenever a text input has focus (the
           guard that stops a name like "Wade" walking the player around),
           so while this box has the cursor the global Esc branch never
           runs and the panel could only be closed with the mouse. */
        if (e.key === 'Escape') { e.preventDefault(); close(); }
      };
      inp.focus();
    }
    el.querySelectorAll('[data-def]').forEach(b =>
      b.onclick = () => chooseDef(parseInt(b.dataset.def, 10)));
  }

  return {
    init, start, close,
    get isOpen() { return el && !el.classList.contains('hidden'); }
  };
})();

/* Registered by id, so the three AQUAWORD cabinets light up at once. */
SU.Arcade.register('aquaword', SU.Aquaword.start);
