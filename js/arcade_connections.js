/* ============================================================
   SEA UNIVERSE: OCEAN CONNECTIONS (arcade game 6)

   Sixteen tiles, four hidden groups of four. Select four tiles and
   submit; a correct set locks in as a coloured row, a wrong one just
   bounces back. Find all four groups and the cabinet pays out.

   NO FAIL STATE, same as every other cabinet: there is no guess limit,
   a wrong submission costs nothing and the mistake count shown is a
   score, never a threshold. See data/arcade_connections.js for why the
   ten puzzles are authored as whole, closed sets rather than built
   from a shared word pool: with only 20 species in the dex, tag-based
   groups run out of members fast and start overlapping each other,
   which is the one thing this game exists to avoid.

   SELECTION IS TRACKED BY TILE KEY, NOT GRID INDEX. Shuffle re-orders
   the array of unsolved tiles in place, so an index-based selection
   would silently point at the wrong words after a shuffle. A key is
   stable across both a shuffle and a solved group being removed from
   the grid.
   ============================================================ */
window.SU = window.SU || {};

SU.Connections = (function () {
  const BOUNCE_MS = 650;   // how long a wrong guess holds before it clears

  let el, machine = null;
  let groups = [];         // this play's four { label, colour, words }
  let tiles = [];          // [{ key, word, group }] one per word, group is an index into groups
  let selected = [];        // tile keys currently selected, up to 4
  let solved = [];          // group indices found so far, in the order found
  let mistakes = 0;
  let busy = false;         // true while a wrong guess is bouncing back
  let done = false;
  let timer = null;
  /* Whether the cabinet ACTUALLY paid: it only pays once, so a second
     clear must not print a line promising money that never arrived. */
  let paid = false;

  function init() { el = document.getElementById('connections'); }

  function start(o) {
    machine = o;
    const pool = SU.data.connectionsPuzzles || [];
    if (!pool.length) { SU.UI.toast('This machine has no puzzles loaded.'); return; }

    const puzzle = pool[Math.floor(Math.random() * pool.length)];
    groups = puzzle.groups;

    const built = [];
    groups.forEach((g, gi) => {
      g.words.forEach((w, wi) => built.push({ key: gi + '_' + wi, word: w, group: gi }));
    });
    tiles     = SU.shuffle(built);
    selected  = [];
    solved    = [];
    mistakes  = 0;
    busy      = false;
    done      = false;
    paid      = false;      // reset, or a replay inherits the first run's payout
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

  function tile(key) { return tiles.find(t => t.key === key); }

  function toggle(key) {
    if (busy || done) return;
    const t = tile(key);
    if (!t || solved.indexOf(t.group) !== -1) return;

    const at = selected.indexOf(key);
    if (at !== -1) { selected.splice(at, 1); return render(); }
    if (selected.length >= 4) return;   // full hand: deselect one first
    selected.push(key);
    SU.Audio && SU.Audio.play('keypad_press');
    render();
  }

  function clearSelection() {
    if (busy || done) return;
    selected = [];
    render();
  }

  /* Reorders the UNSOLVED tiles only. Selection survives by key, so a
     shuffle mid-guess does not scramble which words are picked. */
  function shuffleTiles() {
    if (busy || done) return;
    const unsolved = tiles.filter(t => solved.indexOf(t.group) === -1);
    const rest     = tiles.filter(t => solved.indexOf(t.group) !== -1);
    tiles = rest.concat(SU.shuffle(unsolved));
    render();
  }

  function submit() {
    if (selected.length !== 4 || busy || done) return;

    const picked = selected.map(tile);
    const gi = picked[0].group;
    const allMatch = picked.every(t => t.group === gi);

    if (allMatch) {
      solved.push(gi);
      selected = [];
      SU.Audio && SU.Audio.play('care_right');

      if (solved.length === groups.length) {
        done = true;
        if (machine) paid = SU.Arcade.finish(machine, true);
      }
      return render();
    }

    mistakes++;
    busy = true;
    SU.Audio && SU.Audio.play('care_wrong');
    render();
    timer = setTimeout(() => {
      selected = [];
      busy = false;
      render();
    }, BOUNCE_MS);
  }

  /* ---------- render ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function render() {
    let h = '<nav class="tabs"><span class="shop-title">OCEAN CONNECTIONS</span>' +
            '<button class="close" data-close="1">✕</button></nav>' +
            '<div class="panel-body">';

    if (!done) {
      h += '<p class="muted">Find the four groups of four' +
           (mistakes ? '. ' + mistakes + (mistakes === 1 ? ' mistake' : ' mistakes') + ' so far.' : '.') +
           '</p>';
    }

    /* Solved groups stack above the grid, most recent last, same order
       NYT-style connections reveals them. */
    solved.forEach(gi => {
      const g = groups[gi];
      h += '<div class="conn-solved conn-' + g.colour + '">' +
           '<strong>' + esc(g.label.toUpperCase()) + '</strong>: ' +
           g.words.map(esc).join(', ') + '</div>';
    });

    if (!done) {
      h += '<div class="conn-grid">';
      tiles.filter(t => solved.indexOf(t.group) === -1).forEach(t => {
        const isSel = selected.indexOf(t.key) !== -1;
        h += '<button class="conn-tile' + (isSel ? ' sel' : '') + (busy && isSel ? ' bounce' : '') + '"' +
             ' data-tile="' + esc(t.key) + '">' + esc(t.word) + '</button>';
      });
      h += '</div>';

      h += '<div class="conn-actions">' +
           '<button data-shuffle="1"' + (busy ? ' disabled' : '') + '>Shuffle</button>' +
           '<button data-clear="1"' + (busy || !selected.length ? ' disabled' : '') + '>Deselect</button>' +
           '<button class="primary" data-submit="1"' + (busy || selected.length !== 4 ? ' disabled' : '') + '>Submit</button>' +
           '</div>';
    } else {
      h += '<p class="conn-good">All four found' +
           (mistakes ? ', ' + mistakes + (mistakes === 1 ? ' mistake' : ' mistakes') + ' along the way' : ', no mistakes') +
           '. ' + (paid ? 'The tray clunks.' : 'This machine has already paid out once.') + '</p>' +
           '<div class="conn-actions"><button data-close="1">Done</button></div>';
    }

    el.innerHTML = '<div class="conn-box">' + h + '</div></div>';
    wire();
  }

  function wire() {
    el.querySelectorAll('[data-close]').forEach(b => b.onclick = close);
    el.querySelectorAll('[data-tile]').forEach(b => b.onclick = () => toggle(b.dataset.tile));
    const sub = el.querySelector('[data-submit]');
    if (sub) sub.onclick = submit;
    const clr = el.querySelector('[data-clear]');
    if (clr) clr.onclick = clearSelection;
    const shuf = el.querySelector('[data-shuffle]');
    if (shuf) shuf.onclick = shuffleTiles;
  }

  return {
    init, start, close,
    get isOpen() { return el && !el.classList.contains('hidden'); }
  };
})();

SU.Arcade.register('connections', SU.Connections.start);
