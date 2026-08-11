/* ============================================================
   SEA UNIVERSE: THE HEARING (endgame)

   The game's boss fight, and it is the whole thesis turned into a
   mechanic. There is no combat anywhere in this game and there is
   none here either: Barry Cuda answers every accusation with a
   statement that is TRUE, and the player has to produce the document
   from their own notebook that closes the gap between what the
   sentence means to a family on a day out and what it means in a
   licence application.

   Each point offers FIVE documents drawn from what the player is
   carrying, each shown with its full description, and one of them
   closes the gap. See buildOptions() for why it is five and not the
   whole notebook.

   It runs on content that has existed since Zone 1. Six PR claims,
   one per major beat of the story, each already carrying its
   `contradictedBy` list in data/progression.js. Nothing here invents
   an argument; it just finally asks the player to make one.

   CLASSROOM RULES, same as the Care Session:
     - You cannot lose. A round can be lost, the hearing cannot.
     - Wrong answers explain themselves and you may try again, and
       the same five stay on the table when you do.
     - A player who never found the document can CONCEDE the point
       and move on, so nobody is stuck on a round whose answer was
       never in their notebook. Conceding is recorded, not punished.
     - The lesson is shown either way, win or lose, so no student
       misses the teaching payload.
     - What is scored is getting it RIGHT FIRST TIME, which is the
       only thing worth chasing and the thing the report card prints.

   OBJECT SHAPE
     { kind:'hearing', id:'the_hearing', name:'...',
       intro:  [ lines before the first round ],
       outro:  [ lines after the last round ],
       rounds: [ { id, claim, barry:[], accept:[], win:[], lose:[],
                   lesson:'', concede:[] } ],
       effects:[ fired once, when the hearing is finished ] }
   ============================================================ */
window.SU = window.SU || {};

SU.Hearing = (function () {
  const OPTION_COUNT = 5;

  let el, box;
  let obj = null, rounds = [], idx = 0, wrongThisRound = 0;
  let phase = 'intro';          // intro | claim | reply | outro
  let lastOutcome = null;       // 'first' | 'later' | 'conceded'
  let options = [];             // the five evidence ids offered this round

  function init() {
    el = document.getElementById('hearing');
    box = document.getElementById('hearingBody');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function start(o) {
    obj = o;
    rounds = o.rounds || [];
    idx = 0;
    wrongThisRound = 0;
    lastOutcome = null;
    options = [];
    phase = 'intro';
    SU.State.hearingReset();
    el.classList.remove('hidden');
    render();
  }

  function round() { return rounds[idx]; }

  /* Everything the player is holding that could serve as an exhibit.
     PR claims are excluded because they are what is being answered,
     not what answers it: offering the brochure as proof against the
     brochure is not a move. */
  function exhibits() {
    return SU.State.data.evidence
      .filter(id => SU.data.evidence[id] && SU.data.evidence[id].type !== 'pr');
  }

  /* A ROUND OFFERS FIVE DOCUMENTS, NOT THE WHOLE NOTEBOOK.

     The first build listed every exhibit the player held, by title. By the
     finale that is 80-odd entries with names like "Cetacean Breeding
     Studbook" and "Movements Folder", which turns the game's argument into
     a feat of recall: the student who UNDERSTOOD the point but cannot
     remember which folder it was filed in scores worse than one who
     memorised a list. That is the wrong skill and the opposite of the
     intent. Five options, each shown with the description that is already
     written on the evidence, asks the question the game actually means to
     ask, and matches the Care Session format students have been answering
     since Zone 1.

     Options come from what the player is HOLDING, so exploring still
     decides whether the answer is on the table at all. That is why
     conceding survives: a notebook without the document has to have a way
     out, and it is recorded rather than punished. */

  /* Seeded so the five stay put across a retry, a reload or a re-read.
     A set that reshuffles under the player looks broken and quietly
     rewards guessing. */
  function rngFor(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return function () {
      h += 0x6D2B79F5;
      let t = Math.imul(h ^ (h >>> 15), 1 | h);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildOptions(r) {
    const held = exhibits();
    const accept = r.accept || [];
    const rand = rngFor(r.id + '|' + held.length);
    const shuffle = (arr) => {
      const c = arr.slice();
      for (let i = c.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const t = c[i]; c[i] = c[j]; c[j] = t;
      }
      return c;
    };

    /* Exactly one right answer on the table. `accept` lists several valid
       documents, and offering two of them would make "pick the one" a lie
       even though pick() would mark either correct. */
    const right = shuffle(held.filter(id => accept.indexOf(id) !== -1))[0] || null;

    /* Fillers of the SAME TYPE first. Welfare notes against a financial
       answer would let a player sort by category instead of by argument. */
    const rest = shuffle(held.filter(id => accept.indexOf(id) === -1));
    const type = right && SU.data.evidence[right] ? SU.data.evidence[right].type : null;
    const fillers = rest.filter(id => SU.data.evidence[id].type === type)
      .concat(rest.filter(id => SU.data.evidence[id].type !== type))
      .slice(0, OPTION_COUNT - (right ? 1 : 0));

    return shuffle((right ? [right] : []).concat(fillers));
  }

  function render() {
    const total = rounds.length;
    let h = '';

    /* --- header --- */
    h += '<div class="hear-head">';
    h += '  <div><h2>' + esc(obj.name || 'The Hearing') + '</h2>';
    h += '    <div class="hear-sub">' +
         (phase === 'intro' ? 'Before it starts'
          : phase === 'outro' ? 'Afterwards'
          : 'Point ' + (idx + 1) + ' of ' + total) + '</div></div>';
    h += '  <div class="hear-score">' + SU.State.hearingWon() + ' / ' + total +
         '<span>answered first time</span></div>';
    h += '</div>';

    if (phase === 'intro' || phase === 'outro') {
      const lines = (phase === 'intro' ? obj.intro : obj.outro) || [];
      h += '<div class="hear-scene">' + lines.map(l => '<p>' + esc(l) + '</p>').join('') + '</div>';
      h += '<div class="hear-actions"><button id="hearGo" class="primary">' +
           (phase === 'intro' ? 'Begin' : 'Finish') + '</button></div>';
      box.innerHTML = h;
      document.getElementById('hearGo').onclick = () => (phase === 'intro' ? toClaim() : finish());
      return;
    }

    const r = round();
    const claim = SU.data.evidence[r.claim];

    /* --- what Barry says --- */
    h += '<div class="hear-claim">';
    h += '  <div class="hear-claim-tag">He is quoting the park at you</div>';
    h += '  <strong>' + esc(claim ? claim.title : r.claim) + '</strong>';
    if (claim) h += '<p class="muted">' + esc(claim.text) + '</p>';
    h += '</div>';
    h += '<div class="hear-scene">' + (r.barry || []).map(l => '<p>' + esc(l) + '</p>').join('') + '</div>';

    if (phase === 'reply') {
      const good = lastOutcome !== 'conceded' && lastOutcome !== null && lastOutcome !== 'wrong';
      const lines = lastOutcome === 'conceded' ? (r.concede || [])
                  : good ? (r.win || []) : (r.lose || []);
      h += '<div class="hear-reply ' + (good ? 'good' : 'bad') + '">' +
           lines.map(l => '<p>' + esc(l) + '</p>').join('') + '</div>';
      if (lastOutcome !== 'wrong') {
        h += '<div class="hear-lesson"><strong>The point</strong><p>' + esc(r.lesson) + '</p></div>';
        h += '<div class="hear-actions"><button id="hearNext" class="primary">' +
             (idx + 1 < rounds.length ? 'Next point' : 'That is everything') + '</button></div>';
        box.innerHTML = h;
        document.getElementById('hearNext').onclick = next;
        return;
      }
      /* a wrong pick: he rebuts it and you go again, no penalty */
      h += '<div class="hear-actions"><button id="hearRetry">Try a different document</button></div>';
      box.innerHTML = h;
      document.getElementById('hearRetry').onclick = () => { phase = 'claim'; render(); };
      return;
    }

    /* --- what you put on the table --- */
    h += '<h3 class="hear-pick">What do you put on the table?</h3>';
    if (!options.length) {
      h += '<p class="muted">Your notebook is empty. There is nothing you can show him.</p>';
    } else {
      h += '<p class="hear-picksub">' +
           (options.length === 1 ? 'One document from your notebook.'
            : options.length + ' documents from your notebook.') +
           ' Which of them answers what he just said?</p>';
      h += '<div class="hear-opts">';
      options.forEach(id => {
        const e = SU.data.evidence[id];
        h += '<button class="hear-opt" data-ev="' + id + '">' +
             '<strong>' + esc(e.title) + '</strong>' +
             '<span class="hear-opt-text">' + esc(e.text) + '</span>' +
             '</button>';
      });
      h += '</div>';
    }
    h += '<div class="hear-actions"><button id="hearConcede" class="alt">' +
         'I have nothing for this one</button></div>';

    box.innerHTML = h;
    box.querySelectorAll('[data-ev]').forEach(b => b.onclick = () => pick(b.dataset.ev));
    document.getElementById('hearConcede').onclick = concede;
  }

  /* Built ONCE per round, not per render, so a wrong answer sends the
     player back to the same five rather than a fresh draw. */
  function toClaim() {
    phase = 'claim';
    wrongThisRound = 0;
    options = buildOptions(round());
    render();
  }

  function pick(evId) {
    const r = round();
    if ((r.accept || []).indexOf(evId) !== -1) {
      lastOutcome = wrongThisRound === 0 ? 'first' : 'later';
      SU.Audio && SU.Audio.play('hearing_point');
      SU.State.hearingRecord(r.id, lastOutcome);
    } else {
      wrongThisRound++;
      lastOutcome = 'wrong';
      SU.Audio && SU.Audio.play('care_wrong');
    }
    phase = 'reply';
    render();
  }

  function concede() {
    const r = round();
    lastOutcome = 'conceded';
    SU.State.hearingRecord(r.id, 'conceded');
    phase = 'reply';
    render();
  }

  function next() {
    idx++;
    if (idx >= rounds.length) { phase = 'outro'; render(); return; }
    toClaim();
  }

  function finish() {
    SU.State.hearingFinish();
    el.classList.add('hidden');
    SU.Rules.apply(obj.effects);
    SU.State.save();
    SU.Quests.evaluate();
    obj = null;
  }

  return {
    init, start,
    get isOpen() { return el && !el.classList.contains('hidden'); }
  };
})();
