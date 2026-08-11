/* ============================================================
   SEA UNIVERSE: CARE SESSION
   This is the "battle replacement": observe the animal, read the
   cues, choose the right care action.

   Design rules (classroom):
     - You can never hard-fail. Wrong answers explain themselves
       and you try again.
     - A perfect solve (no wrong answers) is the thing worth chasing.
     - The lesson is shown either way, so nobody misses the content.
     - Sessions stay replayable forever, because re-reading a case is
       how you learn it. The REWARD does not repeat: the first solve
       pays in full, practice pays once per in-game day, and after
       that you get the lesson and nothing else. Starting a session
       always costs energy, so spamming one burns the shift you need
       for everything else.
   ============================================================ */
window.SU = window.SU || {};

SU.Care = (function () {
  let el, box;
  let sp = null, spId = null, enc = null;
  let revealed = [], pool = [], actionsLeft = 0, wrongCount = 0, finished = false;
  let optOrder = [];        // display order of enc.options, shuffled per session

  function init() {
    el = document.getElementById('care');
    box = document.getElementById('careBody');
  }

  /* New cases first, in order. Once they are all solved, sessions become
     practice, so prefer a case you have not already been paid for today,
     and otherwise pick any of them at random rather than always replaying
     the first one. */
  function pickEncounter(id) {
    const s = SU.data.species[id];
    const state = SU.State.sp(id);
    const unsolved = s.encounters.filter(e => !state.solved[e.id]);
    if (unsolved.length) return unsolved[0];
    const fresh = s.encounters.filter(e => !SU.State.claimedToday('practice_' + e.id));
    const from = fresh.length ? fresh : s.encounters;
    return from[Math.floor(Math.random() * from.length)];
  }

  function start(speciesId) {
    spId = speciesId;
    sp = SU.data.species[speciesId];
    enc = pickEncounter(speciesId);

    SU.State.discover(speciesId);

    const obs = SU.State.data.skills.observation || 0;
    actionsLeft = 2 + Math.floor(obs / 2);
    revealed = [];
    wrongCount = 0;
    finished = false;
    pool = SU.shuffle(enc.cues);

    /* THE ANSWER IS NOT ALWAYS THE TOP BUTTON.
       Encounters are authored with the correct option first, which is
       convenient to read and hopeless to play: a student could score every
       case in the game by clicking the top button without reading a word.
       The display order is shuffled here instead of in the data, so the
       files stay readable and `need`/`correct` keep matching.

       Shuffled ONCE per session, not per render, because render() runs
       again after every observation and a list that reshuffles under the
       cursor is unusable. `optOrder` holds original indices, so `choose`
       still receives the real index and nothing downstream changes. */
    optOrder = SU.shuffle(enc.options.map((o, i) => i));

    el.classList.remove('hidden');
    render();
  }

  function render() {
    const state = SU.State.sp(spId);
    const alreadySolved = !!state.solved[enc.id];

    let h = '';
    h += '<div class="care-head">';
    // uses sprites/animal_<id>.svg if present, otherwise falls back to initials
    h += '  <div class="care-avatar" style="background:' + sp.colour + '">' +
         '<img id="carePortraitImg" alt="">' +
         '<span>' + sp.name.split(' ').map(w => w[0]).join('') + '</span></div>';
    h += '  <div>';
    h += '    <h2>' + enc.title + '</h2>';
    h += '    <div class="care-sub">' + sp.name + ' <em>(' + sp.sci + ')</em> · Trust ' + state.trust + '</div>';
    h += '  </div>';
    h += '  <button class="care-close" id="careClose">✕</button>';
    h += '</div>';

    h += '<p class="care-prompt">' + enc.prompt + '</p>';

    h += '<div class="care-cols">';

    /* --- observation column --- */
    h += '<div class="care-col">';
    h += '<h3>What you can see <span class="pill">' + actionsLeft + ' observations left</span></h3>';
    h += '<ul class="cue-list">';
    if (!revealed.length) h += '<li class="cue empty">Nothing noted yet. Observe her first.</li>';
    revealed.forEach(c => {
      h += '<li class="cue' + (c.points ? ' key' : '') + '">' + c.text + '</li>';
    });
    h += '</ul>';
    h += '<div class="care-tools">';
    h += '<button id="btnObserve"' + (actionsLeft <= 0 || pool.length === 0 || finished ? ' disabled' : '') + '>👁 Observe</button>';
    const hasClip = SU.State.has('clipboard');
    h += '<button id="btnRecords"' + (!hasClip || finished || SU.State.flag('rec_' + enc.id) ? ' disabled' : '') + '>📋 Check records' + (hasClip ? '' : ' (need clipboard)') + '</button>';
    h += '</div>';
    h += '</div>';

    /* --- action column --- */
    h += '<div class="care-col">';
    h += '<h3>Your call</h3>';
    h += '<div class="care-options">';
    optOrder.forEach(i => {
      const o = enc.options[i];
      const dead = finished ? ' disabled' : '';
      h += '<button class="opt" data-i="' + i + '"' + dead + '>' + o.label + '</button>';
    });
    h += '</div>';
    h += '<div id="careFeedback" class="care-feedback"></div>';
    h += '</div>';

    h += '</div>';

    if (alreadySolved && !finished) {
      h += '<div class="care-note">' + (SU.State.claimedToday('practice_' + enc.id)
        ? 'You have already practised this case today. Run it again if you want: for the reading, not the rewards.'
        : 'You have solved this one before: practising gives reduced rewards, once a day.') + '</div>';
    }

    box.innerHTML = h;

    // portrait: dedicated art first, then the overworld sprite
    const pimg = document.getElementById('carePortraitImg');
    if (pimg) {
      SU.Sprites.attach(pimg, ['animal_' + spId + '_portrait', 'animal_' + spId], ok => {
        if (!ok) pimg.remove();          // falls back to the initials behind it
      });
    }

    document.getElementById('careClose').onclick = close;
    const ob = document.getElementById('btnObserve');
    if (ob) ob.onclick = observe;
    const rc = document.getElementById('btnRecords');
    if (rc) rc.onclick = records;
    box.querySelectorAll('.opt').forEach(b => {
      b.onclick = () => choose(parseInt(b.dataset.i, 10));
    });
  }

  function observe() {
    if (actionsLeft <= 0 || !pool.length) return;
    revealed.push(pool.shift());
    actionsLeft--;
    SU.State.spendEnergy(SU.config.energyCost.observe);
    render();
  }

  function records() {
    // Clipboard shortcut: surfaces a cue that actually points at the answer.
    const i = pool.findIndex(c => c.points);
    if (i === -1) { observe(); return; }
    revealed.push(pool.splice(i, 1)[0]);
    SU.State.setFlag('rec_' + enc.id, true);
    SU.State.spendEnergy(SU.config.energyCost.observe);
    render();
  }

  function choose(i) {
    if (finished) return;
    const opt = enc.options[i];
    const fb = document.getElementById('careFeedback');

    if (!opt.correct) {
      wrongCount++;
      SU.Audio && SU.Audio.play('care_wrong');
      SU.State.addTrust(spId, -3);
      fb.className = 'care-feedback bad';
      fb.innerHTML = '<strong>Not quite.</strong> ' + opt.feedback;
      return;
    }

    SU.Audio && SU.Audio.play('care_right');
    finished = true;
    const state = SU.State.sp(spId);
    const first = !state.solved[enc.id];
    state.solved[enc.id] = true;
    SU.State.setFlag('enc_' + enc.id + '_solved', true);

    /* Payout: full the first time, a daily practice rate after that,
       nothing at all for the third run of the same case in one day. */
    const P = SU.config.practice;
    const paid = first || SU.State.claimDaily('practice_' + enc.id);
    const effects = [];
    let gainedXP = 0, gainedPoint = false;   // reported back in the summary below
    if (first) {
      /* XP IS THE ONLY THING A WRONG FIRST GUESS COSTS YOU (2026-08-06).
         Get it right first time and the payout goes up; fumble it and the
         XP is zero.

         EVIDENCE IS GRANTED EITHER WAY, AND THAT IS LOAD-BEARING: a care
         encounter's evidence feeds the endgame hearing, so withholding it
         would leave a player who misread one animal permanently short of a
         document in the finale, with no way of ever knowing why. Trust and
         the skill point are unconditional for the same reason: they are
         progress, not score. */
      gainedXP = wrongCount === 0 ? 70 : 0;
      effects.push({ type: 'addXP', amount: gainedXP });
      effects.push({ type: 'addTrust', species: spId, amount: 15 });

      /* One point every Nth first solve rather than one every time. */
      const c = SU.State.data.counters;
      c.firstSolves = (c.firstSolves || 0) + 1;
      gainedPoint = c.firstSolves % (SU.config.skillPointEveryNthCare || 1) === 0;
      if (gainedPoint) effects.push({ type: 'addSkillPoints', amount: 1 });

      if (enc.evidence) effects.push({ type: 'addEvidence', id: enc.evidence });
    } else if (paid) {
      effects.push({ type: 'addXP', amount: P.xp });
      effects.push({ type: 'addTrust', species: spId, amount: P.trust });
    }
    SU.Rules.apply(effects);

    // Counters drive achievements and the stats screen, so only sessions that
    // actually counted for something are counted.
    if (paid) {
      SU.State.data.counters.cares++;
      SU.State.award('first_care');
      if (wrongCount === 0) {
        SU.State.data.counters.perfectCares++;
        SU.State.award('perfect_care');
      }
    }

    let h = '<div class="care-result">';
    h += '<h3>' + (wrongCount === 0 ? 'Clean read.' : 'Got there.') + '</h3>';
    h += '<p class="fb-good">' + opt.feedback + '</p>';
    h += '<div class="lesson"><span class="lesson-tag">WHY IT MATTERS</span><p>' + enc.lesson + '</p></div>';
    if (first && enc.evidence) {
      h += '<p class="ev-note">📓 Evidence added to your Notebook: <strong>' +
           SU.data.evidence[enc.evidence].title + '</strong></p>';
    }
    /* Says what actually happened, including the nothing. A player who
       fumbled the first guess is told plainly that the XP was the cost,
       and told just as plainly that the evidence was not. */
    let rewardLine;
    if (first) {
      const bits = [];
      bits.push(gainedXP ? '+' + gainedXP + ' XP' : 'No XP: the first answer was wrong');
      bits.push('+15 Trust');
      if (gainedPoint) bits.push('+1 Skill Point');
      rewardLine = bits.join(' · ');
      if (!gainedXP) rewardLine += '<br><span class="muted">The case is still solved and the ' +
                                   'notebook still gets its document. Only the XP was lost.</span>';
    } else if (paid) {
      rewardLine = '+' + P.xp + ' XP · +' + P.trust + ' Trust (daily practice)';
    } else {
      rewardLine = 'Practice only: you already logged this case today. No further rewards until tomorrow.';
    }
    h += '<p class="rewards">' + rewardLine + '</p>';
    h += '<button id="careDone" class="primary">Finish session</button>';
    h += '</div>';
    box.innerHTML = h;
    document.getElementById('careDone').onclick = close;

    SU.State.save();
  }

  function close() {
    el.classList.add('hidden');
    finished = true;
    SU.Quests.evaluate();
    SU.bus.emit('state:changed');
  }

  return { init, start, close, get isOpen() { return el && !el.classList.contains('hidden'); } };
})();
