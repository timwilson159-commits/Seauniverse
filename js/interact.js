/* ============================================================
   SEA UNIVERSE: OBJECT INTERACTION
   Object kinds: sign, station, search, animal, observe, talk,
   shop, transit, keypad, hazard, hearing. Add a new kind by adding a
   case here plus data in zones.js.

   Two gates run before anything else:
     1. `requires`: a condition, checked for EVERY kind. This is
        how gap-window-only content is enforced (requires:{phase:'gap'}).
     2. an outstanding shift duty at this object takes priority,
        offered as a choice so you can always decline and snoop.
   ============================================================ */
window.SU = window.SU || {};

SU.Interact = (function () {

  function objState(id) {
    return SU.State.data.objects[id] || (SU.State.data.objects[id] = {});
  }

  function object(o) {
    if (o.requires && !SU.Rules.check(o.requires)) {
      SU.Audio && SU.Audio.play('blocked');
      SU.Dialogue.open({ lines: [o.deniedText || 'You are not cleared for this yet.'] }, o.name);
      return;
    }

    const duty = SU.Duties.atObject(o.id);
    if (duty) return offerDuty(o, duty);

    return dispatch(o);
  }

  /* ---------- the watched gate ----------
     Suspicion used to be a number that did nothing: three warning lines
     at 50 and no effect whatsoever at 100. It now closes the ONE thing
     it should close, and nothing else.

     WHAT IT BLOCKS: only objects that would RAISE suspicion, and only
     while you are on a public shift. Duties, care sessions, keeper
     talks, observation posts, shops, travel, signs, hazards, every
     quest and all dialogue are untouched, so nothing you are graded on
     and no story beat can ever be locked behind it.

     WHY ON-SHIFT ONLY: the game already says off-shift is when you
     investigate (see the header of js/duties.js), so a high meter
     narrows the window you snoop in rather than taking snooping away.
     It also makes the refusal message TRUE: waiting for a gap phase
     really is a way through, and so is clearing a shift.

     NO FAIL STATE, and it cannot strand anyone: a clean shift refunds
     5, keeper talks pay 2 each, and the day decays 8 on its own, so
     any lock lifts through ordinary play. Deliberately NOT applied to
     the duty offer above this: being watched is a reason to do your
     job, never a reason you cannot. */
  /* `search` ONLY, and the kind check is load bearing.

     21 objects in the game raise suspicion and FIVE OF THEM ARE HAZARDS
     (hz_mast_down, hz_gate_hydraulic, hz_net_repair, hz_alarm_muted).
     Gating on the effect alone therefore blocked the Safety Register,
     which is the job, feeds q_deep_register, and includes repairs that
     physically change the Zone 5 map. config.js says it out loud:
     writing down a defect is the job, not sabotage.

     So the test is "is this snooping", not "does this cost suspicion".
     Searching paperwork you have no roster reason to touch is the
     behaviour the meter is about, and it is the only thing closed. */
  function raisesSuspicion(o) {
    return o.kind === 'search' &&
           (o.effects || []).some(e => e && e.type === 'addSuspicion' && e.amount > 0);
  }

  /* `SU.config` in full: unlike the rest of this file there is no module
     level `C` here, every C is function local to a config sub-object. */
  function watched(o) {
    if (SU.State.data.suspicion < SU.config.suspicion.watchedAt) return false;
    if (SU.State.phase().kind !== 'public') return false;      // off shift: go ahead
    return raisesSuspicion(o);
  }

  function dispatch(o) {
    if (watched(o)) {
      SU.Audio && SU.Audio.play('blocked');
      /* Two pages on purpose: the first says why you cannot, the second
         says what to do about it. One line carrying both reads as a
         telling-off; the pair reads as options. */
      SU.Dialogue.open({ lines: [
        'Not while someone is watching you. Wait until you are off shift.',
        'Your suspicion level is high. Complete more daily duties to reduce park suspicion.'
      ] }, o.name);
      return;
    }

    switch (o.kind) {
      case 'sign':
      case 'station': return sign(o);
      case 'search':  return search(o);
      case 'animal':  return animal(o);
      case 'observe': return observe(o);
      case 'talk':    return talk(o);
      case 'shop':    return SU.UI.openShop(o);
      case 'transit': return SU.UI.openTransit(o);
      case 'keypad':  return SU.UI.openKeypad(o);
      case 'hazard':  return hazard(o);
      case 'hearing': return SU.Hearing.start(o);
      /* The cabinet only. Each game lives in its own file and registers
         with SU.Arcade; see js/arcade.js. Costs no energy on purpose. */
      case 'arcade':  return SU.Arcade.open(o);
      default:        console.warn('[SU] unknown object kind', o.kind);
    }
  }

  /* You are never forced to work: declining is the whole point. */
  function offerDuty(o, duty) {
    SU.Dialogue.open({
      lines: ['On your roster here: ' + duty.title + '.'],
      choices: [
        { text: '▸ ' + duty.verb + '   (' + duty.energy + ' energy)',
          action: () => SU.Duties.perform(duty.id) },
        { text: 'Leave it for now',
          action: () => dispatch(o) }
      ]
    }, o.name);
  }

  /* Signs and stations run their `effects` on close, the same as every
     other kind. They did not until Zone 5, which was a silent bug: nine
     objects across Zones 3 and 4 carried effects that never fired,
     including four information boards meant to log a species and the
     manta cover winch. Nothing errored, because an ignored array looks
     exactly like an absent one.

     A sign can be re-read forever, so any payout on one has to be claim
     gated. The validator enforces that now. */
  function sign(o) {
    SU.Dialogue.open({ lines: String(o.text).split('\n\n'), onEnd: o.effects }, o.name);
  }

  /* Searchable props are either `once: true` (a one-off scene: a locker, a
     document) or restocking. Restocking ones refill once per in-game day:
     a rock pool has more washed into it tomorrow, it does not have an
     infinite supply of sea glass this afternoon. Without this, junk loot is
     an unlimited money tap and the coffee pot is unlimited energy. */
  function search(o) {
    const st = objState(o.id);
    const today = SU.State.data.day;

    if (o.once && st.searched) {
      SU.Dialogue.open({ lines: ['You have already been through this. Nothing new.'] }, o.name);
      return;
    }
    if (!o.once && st.day === today) {
      SU.Dialogue.open({ lines: ['You have already picked through here today. Give it until tomorrow.'] }, o.name);
      return;                                    // costs no energy: no reward, no cost
    }
    st.day = today;

    const lines = [o.text || 'You have a look around.'];
    const found = [];

    (o.loot || []).forEach(l => {
      if (Math.random() <= (l.chance === undefined ? 1 : l.chance)) {
        if (SU.State.addItem(l.item, l.qty || 1)) found.push(SU.data.items[l.item].name);
      }
    });

    if (found.length) lines.push('Found: ' + found.join(', '));
    else if (!o.effects) lines.push('Nothing this time.');

    if (!st.searched) {
      SU.State.data.counters.searches++;
      if (SU.State.data.counters.searches >= 10) SU.State.award('nosy');
    }
    st.searched = true;

    if (SU.State.count('sea_glass') >= 3) SU.State.award('beachcomber');
    if (SU.State.count('plastic_debris') >= 3) SU.State.award('bin_diver');

    SU.State.spendEnergy(SU.config.energyCost.search);
    SU.Dialogue.open({ lines: lines, onEnd: o.effects }, o.name);
  }

  /* A care session is real work: it costs energy every time you open one,
     including a replay of a case you have already solved. That is the first
     brake on session-spamming; the reward ledger in care.js is the second. */
  function animal(o) {
    if (SU.State.data.energy < 8) {
      SU.Dialogue.open({ lines: ['You are too tired to run a proper session. Rest, or let the shift end.'] }, o.name);
      return;
    }
    SU.State.spendEnergy(SU.config.energyCost.care);
    SU.Audio && SU.Audio.play('care_start');
    SU.Care.start(o.species);
  }

  /* ---------- observation posts ----------
     A viewing rail with a species behind it. Standing and actually
     watching an animal is the job, so it pays, but once per day per
     post, because the second hour at the same railing teaches nothing
     new and the ledger is what stops it becoming a grind. */
  function observe(o) {
    const C = SU.config.observePost;
    const sp = SU.data.species[o.species];
    const first = !SU.State.sp(o.species).discovered;

    if (SU.State.data.energy < C.energy) {
      SU.Dialogue.open({ lines: ['You are too tired to concentrate on anything for long enough to be useful.'] }, o.name);
      return;
    }

    const lines = [o.text || 'A viewing point.'];
    const paid = SU.State.claimDaily('obs_' + o.id);

    SU.State.spendEnergy(C.energy);
    SU.State.discover(o.species);

    // The teaching payload: one real fact per visit, rotating.
    const fact = sp.facts[Math.floor(Math.random() * sp.facts.length)];
    lines.push('You watch ' + sp.name + ' (' + sp.sci + ') properly, for once, and write down what you see.');
    lines.push('FIELD NOTE: ' + fact);

    if (paid) {
      SU.Audio && SU.Audio.play('observe');
      SU.State.data.counters.observations = (SU.State.data.counters.observations || 0) + 1;
      if (SU.State.data.counters.observations >= 10) SU.State.award('field_notes');
      lines.push('Logged. +' + C.xp + ' XP' + (first ? ' · new species logged' : '') + ' · +' + C.trust + ' trust');
    } else {
      lines.push('You already logged an observation here today. Worth watching anyway, just not worth writing down twice.');
    }

    SU.Dialogue.open({
      lines: lines,
      onEnd: paid ? [
        { type: 'addXP', amount: C.xp },
        { type: 'addTrust', species: o.species, amount: C.trust }
      ] : null
    }, o.name);
  }

  /* ---------- keeper talks ----------
     The public half of the job. A guest asks something real, you answer
     in front of thirty people. Getting it right is good cover, and being
     the trainer who knows things is why nobody looks at you twice.
     You cannot fail: a wrong answer still ends in the correct fact. */
  function talk(o) {
    const C = SU.config.keeperTalk;
    const pool = SU.data.talks[o.pool];

    if (SU.State.data.energy < C.energy) {
      SU.Dialogue.open({ lines: ['You have nothing left in the tank for a crowd right now.'] }, o.name);
      return;
    }
    if (SU.State.claimedToday('talk_' + o.id)) {
      SU.Dialogue.open({
        lines: [(o.text || '') + ' You have already done today\'s talk here. The next crowd is somebody else\'s.']
      }, o.name);
      return;
    }

    const qs = pool.questions;
    const q = qs[Math.floor(Math.random() * qs.length)];

    SU.State.spendEnergy(C.energy);
    SU.State.claimDaily('talk_' + o.id);

    /* Shuffled for the same reason as the care sessions: every question in
       talks.js is authored with the right answer first, so an unshuffled
       list rewards clicking the top choice over listening to the question.
       Built once here, and the talk is one-shot, so there is no re-render
       to reorder it under the player. */
    SU.Dialogue.open({
      lines: [o.text || 'A small crowd gathers.', q.q],
      choices: SU.shuffle(q.options).map(opt => ({
        text: opt.text,
        action: () => answer(o, q, opt)
      }))
    }, o.name);
  }

  function answer(o, q, opt) {
    const C = SU.config.keeperTalk;
    const lines = [opt.reply];

    if (opt.correct) {
      SU.State.data.counters.talksCorrect = (SU.State.data.counters.talksCorrect || 0) + 1;
      if (SU.State.data.counters.talksCorrect >= 5) SU.State.award('good_talk');
      lines.push('THE ANSWER: ' + q.fact);
      lines.push('Somebody actually says thank you. +' + C.xp + ' XP · you look like staff today.');
    } else {
      lines.push('THE ANSWER: ' + q.fact);
      lines.push('Nobody notices you got it wrong, which is somehow worse. Read up before the next one.');
    }

    SU.Dialogue.open({
      lines: lines,
      onEnd: opt.correct ? [
        { type: 'addXP', amount: C.xp },
        { type: 'addSuspicion', amount: C.suspicion }
      ] : null
    }, o.name);
  }

  /* ---------- hazards (the Safety Register) ----------
     A defect you can find, read, and choose to write down. The choice is
     the point, exactly as it is with duties: nothing forces you to fill in
     the form, and a player who logs nothing loses no progress.

     What makes it worth its own kind rather than another `search`:
       · the payout is engine-gated to the first log and cannot repeat,
         because a logged hazard never becomes unlogged,
       · logging feeds a COUNT that quests and dialogue read, which is the
         "one defect is arguable, twelve is a pattern" lesson made mechanical,
       · some hazards, once repaired, remove a solid prop and open a route,
         so this is the one interaction that can change the map.

     Object shape:
       { kind:'hazard', id:'hz_x', name:'...', severity:'low|medium|high',
         text:'...', logText:'...', repairedText:'...',
         evidence:'ev_id',            // optional, filed on first log
         effects:[...] }              // optional, fire on first log only
     ------------------------------------------------------------- */
  function hazard(o) {
    const st = SU.State.hz(o.id);

    if (st.repaired) {
      SU.Dialogue.open({
        lines: [o.repairedText || 'Fixed, properly, by somebody who knew what they were doing. ' +
                                  'It stays in the register anyway. The register is the point.']
      }, o.name);
      return;
    }

    if (st.logged) {
      SU.Dialogue.open({
        lines: [o.text,
                'Already in your register, logged on day ' + st.logged + '. Still here. ' +
                'Writing it down twice does not fix it any faster.']
      }, o.name);
      return;
    }

    SU.Dialogue.open({
      lines: [o.text],
      choices: [
        { text: '▸ Write it into the register', action: () => log(o) },
        { text: 'Leave it. Not your job today.' }
      ]
    }, o.name);
  }

  function log(o) {
    const C = SU.config.hazard;
    if (!SU.State.logHazard(o.id)) return;          // belt and braces

    SU.State.spendEnergy(C.energy);
    const n = SU.State.hazardCount();

    const lines = [o.logText || 'You write it down: what it is, where it is, and the date. ' +
                                'It takes about forty seconds.'];
    lines.push('SAFETY REGISTER: ' + n + ' defect' + (n === 1 ? '' : 's') + ' logged.');

    SU.Dialogue.open({
      lines: lines,
      onEnd: [{ type: 'addXP', amount: C.xp }]
        .concat(o.evidence ? [{ type: 'addEvidence', id: o.evidence }] : [])
        .concat(o.effects || [])
    }, o.name);
  }

  return { object };
})();
