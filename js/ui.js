/* ============================================================
   SEA UNIVERSE: UI
   HUD, Journal (tasks / notebook / bag / dex / skills / awards),
   shop, and toasts.
   ============================================================ */
window.SU = window.SU || {};

SU.UI = (function () {
  const C = SU.config;
  let hud, journal, jbody, tabsEl, toastWrap, awardsEl, promptEl, shopEl, shopBody, transitEl, transitBody;
  let padEl, padTitle, padText, padClue, padDisplay, padMsg, padGrid;
  /* Opens on the first tab, which is now Tasks. Left as 'summary' this
     would open on the LAST tab, which reads as a bug. */
  let tab = 'tasks';

  function init() {
    hud       = document.getElementById('hud');
    journal   = document.getElementById('journal');
    jbody     = document.getElementById('journalBody');
    tabsEl    = document.getElementById('journalTabs');
    toastWrap = document.getElementById('toasts');
    awardsEl  = document.getElementById('awards');
    promptEl  = document.getElementById('prompt');
    shopEl    = document.getElementById('shop');
    shopBody  = document.getElementById('shopBody');
    transitEl   = document.getElementById('transit');
    transitBody = document.getElementById('transitBody');
    document.getElementById('transitClose').onclick = () => transitEl.classList.add('hidden');

    padEl      = document.getElementById('keypad');
    padTitle   = document.getElementById('keypadTitle');
    padText    = document.getElementById('keypadText');
    padClue    = document.getElementById('keypadClue');
    padDisplay = document.getElementById('keypadDisplay');
    padMsg     = document.getElementById('keypadMsg');
    padGrid    = document.getElementById('keypadGrid');
    document.getElementById('keypadClose').onclick = closeKeypad;

    tabsEl.querySelectorAll('button').forEach(b => {
      b.onclick = () => { tab = b.dataset.tab; renderJournal(); };
    });
    document.getElementById('journalClose').onclick = closeJournal;
    document.getElementById('shopClose').onclick = () => shopEl.classList.add('hidden');

    document.getElementById('btnJournal').onclick = toggleJournal;
    document.getElementById('btnRest').onclick = () => SU.Game.endPhase();
    document.getElementById('btnSave').onclick = () => { SU.State.save(); toast('Game saved.', 'good'); };
    document.getElementById('btnPause').onclick = () => SU.Game.togglePause();
    document.getElementById('btnResume').onclick = () => SU.Game.setPause(false);

    /* Fullscreen has to be asked for from inside a real click, and the
       button label has to follow the actual state rather than what we
       last asked for, because Esc and F11 leave fullscreen without ever
       telling us. Hence the fullscreenchange listener. */
    const btnFull = document.getElementById('btnFull');
    btnFull.onclick = () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => toast('Fullscreen was refused by the browser.'));
    };
    document.addEventListener('fullscreenchange', () => {
      const on = !!document.fullscreenElement;
      btnFull.textContent = on ? '⛶ Exit' : '⛶';
      btnFull.title = on ? 'Leave fullscreen' : 'Fullscreen';
    });
    /* The title screen buttons want this too, and it cannot be a plain
       call to btnFull.onclick: that TOGGLES, so a player already in
       fullscreen would be thrown out of it by pressing Continue. */

    /* ---- audio controls ----
       Two toggles and two sliders. The state lives in SU.Audio (and in
       its own localStorage key, not the save file), so this is a thin
       skin over it and survives a save wipe. */
    const bM = document.getElementById('btnMusic'), bS = document.getElementById('btnSfx');
    const vM = document.getElementById('volMusic'), vS = document.getElementById('volSfx');
    function paintAudio() {
      const a = SU.Audio.get();
      bM.classList.toggle('off', !a.musicOn);
      bS.classList.toggle('off', !a.sfxOn);
      bM.textContent = a.musicOn ? '♪' : '♪̸';
      bS.textContent = a.sfxOn ? '🔊' : '🔇';
      bM.title = 'Music ' + (a.musicOn ? 'on' : 'off');
      bS.title = 'Sound effects ' + (a.sfxOn ? 'on' : 'off');
      vM.value = Math.round(a.music * 100);
      vS.value = Math.round(a.sfx * 100);
      vM.disabled = !a.musicOn;
      vS.disabled = !a.sfxOn;
    }
    bM.onclick = () => { SU.Audio.set('musicOn', !SU.Audio.get().musicOn); paintAudio(); };
    bS.onclick = () => {
      const on = !SU.Audio.get().sfxOn;
      SU.Audio.set('sfxOn', on); paintAudio();
      if (on) SU.Audio.play('choice');            // so you can hear that it is back
    };
    vM.oninput = () => SU.Audio.set('music', vM.value / 100);
    /* Preview on release rather than on every pixel of the drag, or
       dragging the slider fires the sound sixty times. */
    vS.oninput   = () => SU.Audio.set('sfx', vS.value / 100);
    vS.onchange  = () => SU.Audio.play('choice');
    paintAudio();

    /* ---- walk speed ----
       One button, one job: cycle the preset list in SU.World and show
       whatever it lands on. The multiplier itself is stored and applied
       entirely in js/world.js; this is just the label. */
    const btnSpeed = document.getElementById('btnSpeed');
    function paintSpeed() { btnSpeed.textContent = SU.World.speedMult + 'x'; }
    btnSpeed.onclick = () => { SU.World.cycleSpeedMult(); paintSpeed(); };
    paintSpeed();

    SU.bus.on('state:changed', renderHUD);
    SU.bus.on('state:changed', () => { if (!journal.classList.contains('hidden')) renderJournal(); });
    SU.bus.on('zone:changed', renderHUD);
    renderHUD();
  }

  /* ---------------- HUD ---------------- */
  function renderHUD() {
    if (!SU.State.data) return;          // title screen: no game loaded yet
    const d = SU.State.data;
    const band = SU.State.suspicionBand();
    const xpNeed = C.xp.toNext(d.level);
    const zoneName = SU.World.zone ? SU.World.zone.name : '';

    /* The old Day / phase / duty-count block is gone: the day sits on the
       clock, the phase is named in the clock's caption, and the roster
       lives on the map, so it was saying everything twice. */
    hud.innerHTML =
      clockBlock() +
      block(zoneName, SU.State.rank()) +
      bar('Energy', d.energy, 100, '#6fd18a') +
      bar('XP · Lv ' + d.level, d.xp, xpNeed, '#6fa8d1') +
      bar('Suspicion · ' + band.label, d.suspicion, C.suspicion.max, suspColour(d.suspicion)) +
      block('$' + d.money, d.skillPoints > 0 ? '★ ' + d.skillPoints + ' skill pt' : 'Bag ' + SU.State.slotsUsed() + '/' + SU.State.carryLimit()) +
      timerBlock();

    renderChores();
  }

  /* ---------------- the shift clock ----------------
     Built as part of the HUD, then updated in place by tickClock() on
     every frame. Rebuilding the whole HUD sixty times a second to move
     one clock would throw away and recreate every bar and block in it. */
  function clockBlock() {
    return '<div class="hud-block clock">' +
             '<div class="clock-day">Day ' + SU.State.data.day + '</div>' +
             '<div class="hud-a" id="clockTime">' + SU.State.clockText() + '</div>' +
             '<div class="hud-b" id="clockEnds">' + clockEndsText() + '</div>' +
             '<div class="clock-bar"><span id="clockFill" style="width:' +
               (SU.State.phaseProgress() * 100).toFixed(2) + '%"></span></div>' +
           '</div>';
  }

  function clockEndsText() {
    return SU.State.phase().label + ' ends ' + SU.State.phaseEndsText();
  }

  /* THE DIGITS SHOW HOURS AND MINUTES, NOT SECONDS, and the bar is what
     actually moves smoothly. At nine in-game minutes per real minute a
     seconds field would spin nine times a second, which reads as a
     glitch rather than as time passing; minutes step about every seven
     seconds, which reads as a clock on a wall. */
  function tickClock() {
    if (!SU.State.data) return;
    const t = document.getElementById('clockTime');
    if (!t) return;                       // HUD not built yet
    const txt = SU.State.clockText();
    if (t.textContent !== txt) t.textContent = txt;
    const f = document.getElementById('clockFill');
    if (f) f.style.width = (SU.State.phaseProgress() * 100).toFixed(2) + '%';
  }

  /* ---------------- chores on the map ----------------
     The roster used to live only in the Menu, which meant the cover job
     was the one thing you had to go and look up. It sits over the map
     now, and disappears in gap windows because there is nothing rostered
     then and free time should look like free time. */
  function renderChores() {
    const el = document.getElementById('chores');
    if (!el) return;
    if (!SU.State.data || !SU.Duties) { el.classList.add('hidden'); return; }

    const roster = SU.Duties.roster();
    if (!roster.length) { el.classList.add('hidden'); return; }

    /* Only what is still OUTSTANDING. A finished job is not a reminder,
       and a list you have to read past to find the live items is worse
       than no list. */
    const todo = roster.filter(r => !r.done);
    if (!todo.length) {
      el.innerHTML = '<div class="chores-head done">Roster cleared</div>';
      el.classList.remove('hidden');
      return;
    }

    let h = '<div class="chores-head">On your roster <span>' + todo.length + '</span></div>';
    todo.forEach(r => {
      const z = SU.data.zones[r.def.atZone || r.def.zone];
      h += '<div class="chore">' +
             '<span class="chore-tick">○</span>' +
             '<span class="chore-t">' + esc(r.def.title) +
               '<em>' + esc(z ? z.name : '') + '</em></span>' +
           '</div>';
    });
    el.innerHTML = h;
    el.classList.remove('hidden');
  }

  /* Most urgent running timer only. Missing it costs nothing, so this
     stays a quiet nudge rather than an alarm until it is nearly gone. */
  function timerBlock() {
    if (!SU.Quests || !SU.Quests.timers) return '';
    const t = SU.Quests.timers()[0];
    if (!t) return '';
    const urgent = t.left <= 30;
    return '<div class="hud-block wide' + (urgent ? ' urgent' : '') + '">' +
             '<div class="hud-a">⏱ ' + t.def.title + '</div>' +
             '<div class="hud-b">' + SU.Quests.clockText(t.left) +
             (t.left > 0 ? '' : ' · bonus missed') + '</div>' +
           '</div>';
  }
  function block(a, b) {
    return '<div class="hud-block"><div class="hud-a">' + a + '</div><div class="hud-b">' + b + '</div></div>';
  }
  function bar(label, val, max, colour) {
    const pct = Math.max(0, Math.min(100, (val / max) * 100));
    return '<div class="hud-block wide"><div class="hud-a">' + label + '</div>' +
           '<div class="meter"><span style="width:' + pct + '%;background:' + colour + '"></span></div>' +
           '<div class="hud-b">' + Math.round(val) + ' / ' + Math.round(max) + '</div></div>';
  }
  function suspColour(v) {
    if (v >= 75) return '#e05c5c';
    if (v >= 50) return '#e0a34a';
    if (v >= 25) return '#e0d24a';
    return '#5ca9e0';
  }

  /* ---------------- interaction prompt ---------------- */
  function renderPrompt() {
    if (!SU.State.data) return;
    const n = SU.World.nearby;
    if (!n) { promptEl.classList.add('hidden'); return; }
    promptEl.classList.remove('hidden');
    const verb = n.kind === 'npc'  ? 'Talk to' :
                 n.kind === 'prop' ? 'Look at' :
                 ({ sign: 'Read', search: 'Search', animal: 'Care session with',
                    observe: 'Observe from', talk: 'Give a talk at',
                    shop: 'Browse', transit: 'Use' }[n.data.kind] || 'Use');
    promptEl.innerHTML = '<kbd>E</kbd> ' + verb + ' <strong>' + n.data.name + '</strong>';
  }

  /* ---------------- journal ---------------- */
  function toggleJournal() {
    journal.classList.contains('hidden') ? openJournal() : closeJournal();
  }
  /* The journal silences the music while it is open. It is the one screen
     players sit in for minutes at a time, and a looping zone track under
     a reading screen is the thing they asked to stop. `duck` is not the
     music preference, so it cannot resurrect music the player turned off
     themselves. */
  function openJournal() {
    SU.Audio && SU.Audio.play('menu_open');
    journal.classList.remove('hidden');
    SU.Audio && SU.Audio.duck(true);
    renderJournal();
  }
  function closeJournal() {
    journal.classList.add('hidden');
    SU.Audio && SU.Audio.duck(SU.Game && SU.Game.isPaused);
  }

  function renderJournal() {
    tabsEl.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    jbody.innerHTML = ({
      summary: summaryTab,
      tasks: tasksTab, transit: transitTab, notebook: notebookTab, bag: bagTab,
      dex: dexTab, skills: skillsTab, awards: awardsTab
    }[tab])();
    if (tab === 'summary') wireSummary();
    if (tab === 'skills') wireSkills();
    if (tab === 'bag') wireBag();
    // travelling from the journal has to shut the journal behind it
    if (tab === 'transit') wireTransit(jbody, closeJournal);
  }

  /* ---------------- summary ----------------
     Who you are, how far you have come, and what you have actually
     uncovered. Bars are proportion-of-possible so they stay meaningful
     as more content lands. */

  /* Named sumBar, not bar, because `bar` is already the HUD's meter and lives in
     this same scope. The player types their own name, so esc() it. */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function sumBar(label, value, max, colour, caption) {
    const pct = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;
    return '<div class="bar-row">' +
             '<div class="bar-top"><span>' + label + '</span>' +
             '<span class="muted">' + (caption || value + ' / ' + max) + '</span></div>' +
             '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:' + colour + '"></div></div>' +
           '</div>';
  }

  function summaryTab() {
    const d = SU.State.data, p = d.player;
    const sprite = 'player_' + (p.sprite || 'female');

    let h = '<div class="sum-id">' +
              '<div class="sum-portrait"><img id="sumPortrait" alt=""></div>' +
              '<div class="sum-who">' +
                '<div class="sum-name" id="sumName">' + esc(p.name) + '</div>' +
                '<div class="sum-rank">' + SU.State.rank() + ' · Level ' + d.level + '</div>' +
                '<div class="muted">Day ' + d.day + ' · $' + d.money + '</div>' +
                '<div class="sum-actions">' +
                  '<button id="btnRename">Change name</button>' +
                  '<button id="btnSwapSprite">Change trainer</button>' +
                  /* Once the story is finished the report stays available
                     here, so a student can show somebody their certificate
                     on Friday without replaying the finale. */
                  (SU.State.flag('game_completed')
                    ? '<button id="btnReport" class="primary">Final report</button>' : '') +
                '</div>' +
                '<div id="renameRow" class="hidden">' +
                  '<input id="renameInput" type="text" maxlength="' + C.nameMaxLength + '" value="' + esc(p.name) + '">' +
                  '<button id="btnRenameSave" class="primary">Save</button>' +
                  '<button id="btnRenameCancel">Cancel</button>' +
                '</div>' +
              '</div>' +
            '</div>';

    /* --- progress bars --- */
    const dexTotal = Object.keys(SU.data.species).length;
    const dexGot = Object.keys(d.species).filter(k => d.species[k].discovered).length;
    const evTotal = Object.keys(SU.data.evidence).length;
    const achTotal = Object.keys(SU.data.achievements).length;
    const qualTotal = Object.keys(SU.data.qualifications).length;

    h += '<h3>Progress</h3><div class="bars">';
    h += sumBar('Experience', d.xp, C.xp.toNext(d.level), '#4fb0c6',
                'Lv ' + d.level + ' · ' + d.xp + ' / ' + C.xp.toNext(d.level) + ' xp');
    h += sumBar('Species discovered', dexGot, dexTotal, '#5fbf7a');
    h += sumBar('Evidence gathered', d.evidence.length, evTotal, '#c98bb9');
    h += sumBar('Qualifications', d.qualifications.length, qualTotal, '#e0a34a');
    h += sumBar('Achievements', d.achievements.length, achTotal, '#f2c14e');
    h += sumBar('Suspicion', d.suspicion, C.suspicion.max, suspColour(d.suspicion),
                d.suspicion + ' / ' + C.suspicion.max + ' · ' + SU.State.suspicionBand().label);
    h += '</div>';

    /* --- skills --- */
    h += '<h3>Skills</h3><div class="bars">';
    C.skills.forEach(s => {
      const lvl = d.skills[s.id] || 0;
      h += sumBar(s.label, lvl, C.skillMax, '#3d92bc', 'Lv ' + lvl + ' / ' + C.skillMax);
    });
    h += '</div>';

    /* --- story so far --- */
    const beats = (SU.data.storyBeats || []).filter(b => SU.Rules.check(b.when));
    h += '<h3>The story so far <span class="muted">' + beats.length + ' / ' +
         (SU.data.storyBeats || []).length + '</span></h3>';
    if (!beats.length) {
      h += '<div class="card"><p class="muted">Nothing to report yet. Do your job, ' +
           'talk to people, and write down anything that does not add up.</p></div>';
    } else {
      beats.forEach(b => {
        h += '<div class="card beat"><strong>' + b.title + '</strong> ' +
             '<span class="tag">' + b.zone + '</span>' +
             '<p class="muted">' + b.summary + '</p></div>';
      });
    }
    return h;
  }

  function wireSummary() {
    const p = SU.State.data.player;
    SU.Sprites.attach(document.getElementById('sumPortrait'),
                      ['player_' + (p.sprite || 'female') + '_portrait', 'player_' + (p.sprite || 'female'), 'player']);

    const row = jbody.querySelector('#renameRow');
    const input = jbody.querySelector('#renameInput');

    jbody.querySelector('#btnRename').onclick = () => {
      row.classList.remove('hidden');
      input.focus();
      input.select();
    };
    jbody.querySelector('#btnRenameCancel').onclick = () => row.classList.add('hidden');
    const commit = () => { SU.State.setName(input.value); renderJournal(); };
    jbody.querySelector('#btnRenameSave').onclick = commit;
    input.onkeydown = e => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') row.classList.add('hidden');
    };

    /* Cycles through the available bodies. With two options this reads as
       a straight toggle, and it still works if a third is ever added. */
    jbody.querySelector('#btnSwapSprite').onclick = () => {
      const list = C.playerSprites;
      const i = list.findIndex(s => s.id === (SU.State.data.player.sprite || 'female'));
      SU.State.setSprite(list[(i + 1) % list.length].id);
      renderJournal();
    };

    const rep = jbody.querySelector('#btnReport');
    if (rep) rep.onclick = () => { closeJournal(); SU.Report.open(); };
  }

  function tasksTab() {
    const { active, done } = SU.Quests.list();
    const phase = SU.State.phase();
    let h = '';

    /* --- today's shift roster comes first: it is the job you are paid for --- */
    h += '<h2>' + phase.label + '</h2>';
    if (phase.kind === 'public') {
      const roster = SU.Duties.roster();
      if (!roster.length) {
        h += '<p class="muted">No duties assigned. Unusual, but enjoy it.</p>';
      } else {
        const left = roster.filter(r => !r.done).length;
        h += '<p class="muted">' + (left ? left + ' of ' + roster.length + ' still to do. ' +
             'Leaving them undone will be noticed.' : 'All done. The rest of the shift is yours.') + '</p>';
        roster.forEach(r => {
          h += '<div class="card duty' + (r.done ? ' done' : '') + '">';
          h += '<div><strong>' + (r.done ? '✓ ' : '') + r.def.title + '</strong>';
          /* Zone, landmark and cost. This used to be zone-only, matching
             the on-map chores panel, on the reasoning that naming the
             landmark turned the roster into a list of directions rather
             than a list of jobs. PUT BACK on the user's instruction after
             classroom testing found students lost without it - same
             reversal as `place()` in js/quests.js, and reusing it here
             rather than duplicating the zone/landmark lookup. The energy
             figure stays: it is a price, not a direction. */
          const place = SU.Quests.place(r.def.at) || SU.data.zones[r.def.atZone || r.def.zone].name;
          h += '<p class="muted">' + esc(place) + ' · ' +
               r.def.energy + ' energy</p></div>';
          if (!r.done) h += '<span class="tag">To do</span>';
          h += '</div>';
        });
      }
    } else {
      h += '<p class="muted">Off shift. Nobody is expecting anything from you right now,' +
           'which makes this the only time to go looking.</p>';
    }

    h += '<h2 style="margin-top:24px">Tasks</h2>';
    if (!active.length && !done.length) h += '<p class="muted">Nothing on your list. Go and talk to people.</p>';

    active.forEach(q => {
      h += '<div class="card"><div class="card-top"><strong>' + q.def.title + '</strong>' +
           '<span class="place">[' + esc(SU.Quests.zoneName(q.def.zone)) + ']</span>' +
           '<span class="tag t' + q.def.type + '">' + typeName(q.def.type) + '</span></div>';
      h += '<p class="muted">' + q.def.summary + '</p>';
      if (q.def.timed) {
        const left = SU.Quests.timeLeft(q.id);
        h += left > 0
          ? '<p class="timed live">⏱ ' + SU.Quests.clockText(left) + ' left · ' + q.def.timed.label + '</p>'
          : '<p class="timed">⏱ Bonus window closed. Finish it anyway, it still counts.</p>';
      }
      h += '<ol class="steps">';
      q.def.steps.forEach((s, i) => {
        const st = i < q.rec.step ? 'done' : (i === q.rec.step ? 'now' : 'later');
        const place = SU.Quests.stepPlace(q.def, s);
        h += '<li class="' + st + '">' + (st === 'done' ? '✓ ' : '') + esc(s.text) +
             (place ? ' <span class="place">[' + esc(place) + ']</span>' : '') + '</li>';
      });
      h += '</ol></div>';
    });

    if (done.length) {
      h += '<h3 class="muted">Completed (' + done.length + ')</h3>';
      done.forEach(q => h += '<div class="card done"><strong>✓ ' + q.def.title + '</strong>' +
                             '<span class="place">[' + esc(SU.Quests.zoneName(q.def.zone)) + ']</span></div>');
    }
    return h;
  }
  function typeName(t) {
    return { 1: 'Scavenger', 2: 'Errand', 3: 'Fact-finding', 4: 'Odd job', 5: 'Off the books' }[t] || 'Task';
  }

  /* ---------- the Safety Register ----------
     Hazards are declared as objects inside zone data, so the register has
     to find them by id across the whole park. Built once, on demand, and
     never rebuilt: zone data does not change at runtime. */
  let hazardIndex = null;
  function hazardDefs() {
    if (hazardIndex) return hazardIndex;
    hazardIndex = {};
    for (const zid in SU.data.zones) {
      const z = SU.data.zones[zid];
      (z.objects || []).forEach(o => {
        if (o.kind === 'hazard') hazardIndex[o.id] = { def: o, zone: z.name };
      });
    }
    return hazardIndex;
  }

  const SEV = { high: 3, medium: 2, low: 1 };
  const SEV_LABEL = { high: 'HIGH', medium: 'MEDIUM', low: 'LOW' };

  function registerSection() {
    const defs = hazardDefs();
    const logged = Object.keys(SU.State.data.hazards).filter(id => SU.State.hazardLogged(id));
    if (!logged.length) return '';

    const total = Object.keys(defs).length;
    const fixed = logged.filter(id => SU.State.hazardRepaired(id)).length;

    let h = '<h3 class="reg-head">Safety Register <span class="muted">' + logged.length +
            ' of ' + total + ' logged · ' + fixed + ' repaired</span></h3>' +
            '<p class="muted reg-note">One defect is an argument. A dozen, dated and signed, is a pattern. ' +
            'The pattern is the part somebody outside this park can act on.</p>';

    logged.sort((a, b) => {
      const A = defs[a], B = defs[b];
      const sa = SEV[(A && A.def.severity) || 'low'] || 1;
      const sb = SEV[(B && B.def.severity) || 'low'] || 1;
      return sb - sa;
    });

    logged.forEach(id => {
      const rec = defs[id];
      const st = SU.State.data.hazards[id];
      const name = rec ? rec.def.name : id;
      const sev = (rec && rec.def.severity) || 'low';
      const where = rec ? rec.zone : '';
      h += '<div class="card hz hz-' + sev + (st.repaired ? ' fixed' : '') + '">' +
           '<span class="hz-sev">' + (SEV_LABEL[sev] || 'LOW') + '</span>' +
           '<div><strong>' + name + '</strong>' +
           '<p class="muted">' + where + ' · logged day ' + st.logged +
           (st.repaired ? ' · <span class="hz-fixed">repaired</span>' : ' · still open') + '</p></div></div>';
    });
    return h;
  }

  function notebookTab() {
    const ev = SU.State.data.evidence;
    let h = '<h2>Notebook</h2><p class="muted">Everything you have written down. Contradictions are how you prove things.</p>';
    const reg = registerSection();
    if (!ev.length) return h + reg + '<p class="muted">No evidence yet. Read signs, search things, listen to people.</p>';
    h += reg;

    const groups = { welfare: [], financial: [], testimonial: [], pr: [] };
    ev.forEach(id => { const e = SU.data.evidence[id]; if (e) groups[e.type].push({ id, e }); });

    const label = { welfare: 'Welfare', financial: 'Financial / Paperwork', testimonial: 'Testimonial', pr: 'PR / Marketing' };
    for (const k in groups) {
      if (!groups[k].length) continue;
      h += '<h3 class="ev-' + k + '">' + label[k] + '</h3>';
      groups[k].forEach(({ id, e }) => {
        h += '<div class="card ev"><strong>' + e.title + '</strong><p>' + e.text + '</p>';
        if (e.contradictedBy) {
          const got = e.contradictedBy.filter(x => SU.State.hasEvidence(x));
          if (got.length) {
            h += '<p class="contradiction">⚡ Contradicted by: ' +
                 got.map(x => SU.data.evidence[x].title).join(', ') + '</p>';
          }
        }
        h += '</div>';
      });
    }
    return h;
  }

  /* The bag is grouped by what you can DO with a thing, in two columns
     split on the only rule that matters: the LEFT column is everything
     that takes up a slot, the RIGHT column is everything carried free.
     That makes the slot count at the top readable at a glance, because
     the things it counts are all in one place. */
  const BAG_COLUMNS = [
    [
      { kind: 'consumable', label: 'Supplies', note: 'Takes a slot.' },
      { kind: 'junk',       label: 'Finds',    note: 'Takes a slot. Sell these anywhere that buys.' }
    ],
    [
      { kind: 'tool', label: 'Equipment',     note: 'Kit for the job. Carried free.' },
      { kind: 'key',  label: 'Passes & Keys', note: 'Opens things. Carried free.' }
    ]
  ];
  const BAG_KINDS = BAG_COLUMNS.reduce((a, col) => a.concat(col.map(g => g.kind)), []);

  function bagTab() {
    const inv = SU.State.data.inventory;
    let h = '<h2>Bag <span class="muted">' + SU.State.slotsUsed() + ' / ' + SU.State.carryLimit() +
            ' slots · $' + SU.State.data.money + '</span></h2>';
    const keys = Object.keys(inv).filter(id => SU.data.items[id]);
    if (!keys.length) return h + '<p class="muted">Empty.</p>';

    h += '<p class="muted bag-note">Only supplies and finds take up slots. Equipment and keys are carried free.</p>';

    function itemCard(id) {
      const it = SU.data.items[id];
      let c = '<div class="card item"><span class="swatch" style="background:' + it.icon + '"></span>' +
              '<div><strong>' + it.name + '</strong> <span class="muted">×' + inv[id] + '</span>' +
              '<p class="muted">' + it.desc + '</p></div>';
      if (it.kind === 'consumable') c += '<button data-use="' + id + '">Use</button>';
      if (it.kind === 'junk') c += '<button data-sell="' + id + '">Sell $' + it.value + '</button>';
      return c + '</div>';
    }

    function groupBlock(g) {
      const ids = keys.filter(id => SU.data.items[id].kind === g.kind);
      if (!ids.length) return '';
      return '<h4 class="bag-group">' + g.label +
             ' <span class="muted">' + ids.length + ' · ' + g.note + '</span></h4>' +
             ids.map(itemCard).join('');
    }

    /* An item with an unexpected `kind` would otherwise vanish from the
       bag entirely, which is a far worse bug than an ugly heading. It
       joins the free column, since only the two known kinds are counted. */
    const rest = keys.filter(id => BAG_KINDS.indexOf(SU.data.items[id].kind) === -1);
    const columns = BAG_COLUMNS.map(col => col.map(groupBlock).join(''));
    if (rest.length) {
      columns[1] += '<h4 class="bag-group">Other</h4>' + rest.map(itemCard).join('');
    }

    h += '<div class="bag-cols">' +
         columns.map(c => '<div class="bag-col">' + (c || '<p class="muted">Nothing here.</p>') + '</div>').join('') +
         '</div>';
    return h;
  }
  function wireBag() {
    jbody.querySelectorAll('[data-use]').forEach(b => b.onclick = () => {
      const id = b.dataset.use, it = SU.data.items[id];
      SU.State.data.energy = Math.min(100, SU.State.data.energy + (it.use.energy || 0));
      SU.State.removeItem(id, 1);
      toast('Used ' + it.name + '.');
      renderJournal();
    });
    jbody.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => {
      const id = b.dataset.sell, it = SU.data.items[id];
      SU.Audio && SU.Audio.play('purchase');
      SU.State.removeItem(id, 1);
      SU.State.data.money += it.value;
      toast('Sold ' + it.name + ' for $' + it.value + '.', 'good');
      renderJournal();
    });
  }

  function dexTab() {
    let h = '<h2>Species Log</h2>';
    const all = Object.keys(SU.data.species);
    const found = all.filter(id => SU.State.sp(id).discovered);
    h += '<p class="muted">' + found.length + ' of ' + all.length + ' species logged.</p>';
    all.forEach(id => {
      const s = SU.data.species[id], st = SU.State.sp(id);
      if (!st.discovered) { h += '<div class="card locked">??? <span class="muted">not yet observed</span></div>'; return; }
      h += '<div class="card"><div class="card-top"><strong>' + s.name + '</strong>' +
           '<span class="tag">' + s.group + '</span></div>';
      h += '<div class="muted"><em>' + s.sci + '</em> · Trust ' + st.trust + '/100</div>';
      h += '<div class="meter sm"><span style="width:' + st.trust + '%;background:#6fd18a"></span></div>';
      h += '<ul class="facts">' + s.facts.map(f => '<li>' + f + '</li>').join('') + '</ul></div>';
    });
    return h;
  }

  function skillsTab() {
    const d = SU.State.data;
    let h = '<h2>Skills <span class="muted">' + d.skillPoints + ' point' + (d.skillPoints === 1 ? '' : 's') + ' to spend</span></h2>';
    C.skills.forEach(s => {
      const lvl   = d.skills[s.id] || 0;
      const maxed = lvl >= C.skillMax;
      const cost  = SU.State.skillCost(s.id);
      const broke = !maxed && d.skillPoints < cost;

      h += '<div class="card skill"><div><strong>' + s.label + '</strong> ' +
           '<span class="muted">Lv ' + lvl + ' / ' + C.skillMax + '</span>' +
           '<p class="muted">' + s.blurb + '</p>' +
           (maxed ? '<p class="muted">Fully trained.</p>'
                  : '<p class="muted">Next: Lv ' + (lvl + 1) + ' costs <strong>' + cost +
                    '</strong> point' + (cost === 1 ? '' : 's') +
                    (broke ? ', and you have ' + d.skillPoints + '.' : '.') + '</p>') +
           '</div>' +
           (maxed
             ? '<button disabled>Maxed</button>'
             : '<button data-skill="' + s.id + '"' + (broke ? ' disabled' : '') + '>' +
               'Purchase<span class="cost">' + cost + ' pt' + (cost === 1 ? '' : 's') + '</span></button>') +
           '</div>';
    });

    h += '<h3>Qualifications</h3>';
    for (const id in SU.data.qualifications) {
      const q = SU.data.qualifications[id], got = SU.State.hasQual(id);
      h += '<div class="card' + (got ? '' : ' locked') + '"><strong>' + (got ? '✓ ' : '🔒 ') + q.name + '</strong>' +
           '<p class="muted">' + q.blurb + '</p></div>';
    }

    h += '<h3>Trainer</h3><div class="card"><strong>' + SU.State.rank() + '</strong>' +
         '<p class="muted">Level ' + d.level + ' · Move speed ' +
         (C.player.baseSpeed + (d.level - 1) * C.player.speedPerLevel).toFixed(2) +
         ' · Carry ' + SU.State.carryLimit() + ' slots</p></div>';
    return h;
  }
  function wireSkills() {
    jbody.querySelectorAll('[data-skill]').forEach(b => b.onclick = () => {
      const id = b.dataset.skill;
      const cost = SU.State.skillCost(id);
      if (!SU.State.buySkill(id)) return;      // capped or cannot afford
      SU.State.save();
      SU.UI.toast(C.skills.find(s => s.id === id).label +
                  ' is now Lv ' + SU.State.data.skills[id] +
                  ' (−' + cost + ' pt' + (cost === 1 ? '' : 's') + ')', 'good');
      renderJournal();
    });
  }

  function awardsTab() {
    const got = SU.State.data.achievements;
    let h = '<h2>Achievements <span class="muted">' + got.length + ' / ' + Object.keys(SU.data.achievements).length + '</span></h2>';
    for (const id in SU.data.achievements) {
      const a = SU.data.achievements[id], has = got.indexOf(id) !== -1;
      h += '<div class="card' + (has ? '' : ' locked') + '"><strong>' + (has ? '🏅 ' : '· ') + a.name + '</strong>' +
           '<p class="muted">' + a.desc + '</p></div>';
    }
    const c = SU.State.data.counters;
    h += '<h3>Statistics</h3><div class="card"><p class="muted">' +
         'Tasks completed: ' + c.questsDone + '<br>Care sessions: ' + c.cares +
         ' (perfect: ' + c.perfectCares + ')<br>Things searched: ' + c.searches +
         '<br>Duties done: ' + (c.dutiesDone || 0) + ' · skipped: ' + (c.dutiesSkipped || 0) +
         '<br>Clean shifts: ' + (c.shiftsClean || 0) +
         '<br>Evidence collected: ' + SU.State.data.evidence.length + '</p></div>';
    return h;
  }

  /* ---------------- shop ---------------- */
  function openShop(o) {
    let h = '<h2>' + o.name + '</h2><p class="muted">' + (o.text || '') + ' · You have $' + SU.State.data.money + '</p>';
    (o.sells || []).forEach(id => {
      const it = SU.data.items[id];
      const price = it.price || 20;
      h += '<div class="card item"><span class="swatch" style="background:' + it.icon + '"></span>' +
           '<div><strong>' + it.name + '</strong><p class="muted">' + it.desc + '</p></div>' +
           '<button data-buy="' + id + '"' + (SU.State.data.money < price ? ' disabled' : '') + '>$' + price + '</button></div>';
    });
    shopBody.innerHTML = h;
    shopBody.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => {
      const id = b.dataset.buy, it = SU.data.items[id], price = it.price || 20;
      if (SU.State.data.money < price) return;
      if (!SU.State.addItem(id, 1)) return;
      SU.Audio && SU.Audio.play('purchase');
      SU.State.data.money -= price;
      toast('Bought ' + it.name + '.', 'good');
      SU.State.save();
      openShop(o);
    });
    shopEl.classList.remove('hidden');
  }

  /* ---------------- keypad (coded doors) ----------------
     A `keypad` object is a lock whose key is knowledge. The code is
     never written down anywhere in the data the player can reach.
     it is derived from facts about the animals, which is the whole
     point of the puzzle.

     Rules that keep it classroom-safe:
       · unlimited attempts, no penalty of any kind for a wrong code
       · a nudge (never the answer) appears after `hintAfter` misses
       · once solved it stays solved: reopening just says so

     TWO MODES, one implementation:
       · `mode:'digits'` (the default): a numeric pad. The Meridian gate
         in Open Ocean, whose code is four countable facts about four animals.
       · `mode:'letters'`: an alphabetic pad for a WORD. The hide in The
         Deep, whose word is spelled out by the sign-offs on nine numbered
         pieces of graffiti, read in order.

     Object shape:
       { kind:'keypad', code:'5423', mode:'digits', clue:[...lines...],
         hint:'...', solvedText:'...', effects:[...] }
     ------------------------------------------------------------- */
  let pad = null;                 // { o, entry, tries }

  function padMode(o) { return o.mode === 'letters' ? 'letters' : 'digits'; }
  function padCode(o) { return String(o.code).toUpperCase(); }

  function openKeypad(o) {
    const st = SU.State.data.objects[o.id] || (SU.State.data.objects[o.id] = {});
    pad = { o: o, entry: '', tries: st.tries || 0 };

    padTitle.textContent = o.name || 'Keypad';
    padText.textContent = o.text || '';
    padClue.innerHTML = (o.clue || []).map(l => '<p>' + esc(l) + '</p>').join('');
    padClue.classList.toggle('hidden', !(o.clue || []).length);

    if (st.solved) {
      padMsg.className = 'keypad-msg good';
      padMsg.textContent = o.solvedText || 'Already unlocked. The light stays green.';
      padGrid.innerHTML = '';
      padDisplay.textContent = maskOf(o).replace(/·/g, '✓');
    } else {
      padMsg.className = 'keypad-msg';
      padMsg.textContent = pad.tries >= (o.hintAfter || 3) && o.hint ? o.hint : '';
      buildGrid();
      drawEntry();
    }
    padEl.classList.remove('hidden');
  }

  function maskOf(o) { return new Array(padCode(o).length + 1).join('·'); }

  function buildGrid() {
    const letters = padMode(pad.o) === 'letters';
    const keys = letters
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['clr', 'del'])
      : ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clr', '0', 'del'];
    padGrid.classList.toggle('letters', letters);
    padGrid.innerHTML = keys.map(k =>
      '<button class="keypad-key' + (k === 'clr' || k === 'del' ? ' alt' : '') + '" data-key="' + k + '">' +
      (k === 'clr' ? 'CLR' : k === 'del' ? '⌫' : k) + '</button>').join('');
    padGrid.querySelectorAll('[data-key]').forEach(b => b.onclick = () => press(b.dataset.key));
  }

  function drawEntry() {
    const len = padCode(pad.o).length;
    let s = '';
    for (let i = 0; i < len; i++) s += (i < pad.entry.length ? pad.entry[i] : '·');
    padDisplay.textContent = s.split('').join(' ');
  }

  function press(k) {
    if (!pad || pad.checking) return;
    if (k === 'clr') { pad.entry = ''; padMsg.textContent = ''; return drawEntry(); }
    if (k === 'del') { pad.entry = pad.entry.slice(0, -1); return drawEntry(); }
    const ok = padMode(pad.o) === 'letters' ? /^[A-Z]$/ : /^[0-9]$/;
    if (!ok.test(k)) return;
    if (pad.entry.length >= padCode(pad.o).length) return;

    pad.entry += k;
    SU.Audio && SU.Audio.play('keypad_press');
    drawEntry();

    /* Auto-check on the last character, but only after a beat, so the
       player actually sees what they entered before it judges. */
    if (pad.entry.length === padCode(pad.o).length) {
      pad.checking = true;
      setTimeout(submit, 380);
    }
  }

  function submit() {
    if (!pad) return;
    const o = pad.o;
    const st = SU.State.data.objects[o.id];
    pad.checking = false;

    if (pad.entry === padCode(o)) {
      st.solved = true;
      SU.Audio && SU.Audio.play('unlock');
      padMsg.className = 'keypad-msg good';
      padMsg.textContent = o.solvedText || 'The bolt goes back. The light turns green.';
      padGrid.innerHTML = '';
      SU.Rules.apply(o.effects);
      SU.State.save();
      setTimeout(() => { closeKeypad(); }, 1400);
      return;
    }

    st.tries = ++pad.tries;
    SU.Audio && SU.Audio.play('keypad_wrong');
    pad.entry = '';
    drawEntry();
    padMsg.className = 'keypad-msg bad';
    padMsg.textContent = pad.tries >= (o.hintAfter || 3) && o.hint
      ? o.hint
      : 'Two short beeps, and nothing moves. Try again: the pad does not care how many goes you have.';
    SU.State.save();
  }

  /* Every key goes through here while the pad is open, so what you type
     cannot leak into the dev hotkeys, the movement keys, or the journal.
     That matters far more in letters mode: without it, spelling a word
     would walk the player across the map behind the modal. */
  function keypadKey(e) {
    if (!pad) return;
    if (e.code === 'Backspace') { press('del'); e.preventDefault(); return; }
    if (e.code === 'Delete')    { press('clr'); e.preventDefault(); return; }
    if (padMode(pad.o) === 'letters') {
      const l = /^Key([A-Z])$/.exec(e.code);
      if (l) { press(l[1]); e.preventDefault(); }
      return;
    }
    const m = /^(?:Digit|Numpad)([0-9])$/.exec(e.code);
    if (m) { press(m[1]); e.preventDefault(); }
  }

  function closeKeypad() {
    pad = null;
    padEl.classList.add('hidden');
    SU.Quests.evaluate();
  }

  /* ---------------- staff transit (fast travel) ----------------
     Destinations unlock by having visited that region on foot at least
     once. Free and instant on purpose: this is a convenience tool, and
     the tension in this game comes from suspicion triggers, not from
     walking the same promenade for the ninth time.

     TWO WAYS IN, ONE IMPLEMENTATION:
       · the `transit` terminal object in every region's staff block
       · the Journal's Travel tab, usable from anywhere

     The Journal route is the one students will actually use; the
     terminals stay because they are how the park explains itself, and
     because the PARK RULE validator still requires one per staff block.
     Arrival is always the staff block's `entry` spawn, which that same
     rule guarantees exists, so a menu can never land anyone in a wall. */

  function transitHTML(o, fromJournal) {
    const here = SU.World.zoneId;
    const blocks = Object.keys(SU.data.zones).filter(id => SU.data.zones[id].staffFor);

    let h = '<h2>Staff Transit</h2>';
    h += '<p class="muted">' + (o && o.text ? o.text + ' ' : '') +
         (fromJournal
           ? 'The service corridors run under the whole park and every access door takes your lanyard. ' +
             'You do not have to be standing at a terminal to plan a route. You just have to be staff.'
           : 'Service corridors run under the whole park. Staff only, which today includes you.') +
         '</p>';

    /* Listed in park order rather than in whatever order the zone files
       happened to load, now that the numbers are visible. */
    blocks.sort((a, b) =>
      (SU.data.zones[SU.data.zones[a].staffFor].num || 99) -
      (SU.data.zones[SU.data.zones[b].staffFor].num || 99));

    blocks.forEach(id => {
      const block = SU.data.zones[id];
      const region = SU.data.zones[block.staffFor];
      const visited = !!SU.State.data.zonesVisited[block.staffFor];
      const current = id === here;

      h += '<div class="card transit' + (visited ? '' : ' locked') + (current ? ' here' : '') + '">';
      h += '<div><strong>' + (region.num ? region.num + ' · ' : '') + esc(region.name) + '</strong>';
      h += '<p class="muted">' + esc(visited ? region.subtitle : 'No route on file. Reach this area on foot first.') + '</p></div>';
      if (current) h += '<span class="tag">You are here</span>';
      /* The cost is ON the button, never a surprise after the fact. */
      else if (visited) h += '<button data-go="' + id + '">Travel (' + C.energyCost.transit + ' energy)</button>';
      else h += '<span class="tag">🔒 Locked</span>';
      h += '</div>';
    });
    return h;
  }

  /* `close` is whichever container we were opened from. Travelling has to
     shut it, or the player lands in the new zone still reading a menu. */
  /* FAST TRAVEL COSTS ENERGY (2026-08-06). A flat charge, the same from
     anywhere to anywhere: the point is not to model distance, it is to make
     the corridor a small decision rather than a free teleport, so a player
     minding their energy walks and finds things on the way.

     Deliberately NOT gated on having the energy. Every other cost in the
     game refuses politely when you are too tired, but refusing to travel
     could leave a player unable to reach a duty on their own roster, and
     this project has no fail states. spendEnergy clamps at 0, so an
     exhausted player still gets home, just flat broke. Walking through a
     map exit stays free: the regions connect on foot and charging that
     would stop the park feeling like one place. */
  function wireTransit(root, close) {
    root.querySelectorAll('[data-go]').forEach(b => b.onclick = () => {
      const id = b.dataset.go;
      if (close) close();
      SU.Audio && SU.Audio.play('travel');
      SU.State.spendEnergy(C.energyCost.transit);
      SU.World.loadZone(id, 'entry');
      toast('Transit: ' + SU.data.zones[id].name + ' · -' + C.energyCost.transit + ' energy', 'good');
    });
  }

  function transitTab() { return transitHTML(null, true); }

  function openTransit(o) {
    transitBody.innerHTML = transitHTML(o, false);
    wireTransit(transitBody, () => transitEl.classList.add('hidden'));
    transitEl.classList.remove('hidden');
  }

  /* ---------------- achievement popup ----------------
     Awards used to share the toast rail with "Suspicion +1" and "Your bag
     is full", which is the wrong weight for the only messages in the game
     that mark something you will never be told again. This lands in the
     middle of the map instead. It is deliberately not a modal: nothing
     pauses, nothing needs dismissing, and it cannot swallow a keypress
     during a care session. Popups queue rather than stack, so earning two
     at once shows both instead of drawing one on top of the other. */
  const awardQueue = [];
  let awardShowing = false;

  function awardPopup(a) {
    awardQueue.push(a);
    if (!awardShowing) nextAward();
  }

  function nextAward() {
    const a = awardQueue.shift();
    if (!a) { awardShowing = false; return; }
    awardShowing = true;

    const el = document.createElement('div');
    el.className = 'award-pop in';
    el.innerHTML = '<div class="award-kicker">Achievement unlocked</div>' +
                   '<strong>' + esc(a.name) + '</strong>' +
                   '<p>' + esc(a.desc || '') + '</p>' +
                   (a.xp ? '<div class="award-xp">+' + a.xp + ' XP</div>' : '');
    awardsEl.appendChild(el);
    requestAnimationFrame(() => el.classList.remove('in'));

    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => { el.remove(); nextAward(); }, 450);
    }, 2600);
  }

  /* ---------------- toasts ---------------- */
  function toast(text, kind) {
    const t = document.createElement('div');
    t.className = 'toast ' + (kind || '');
    t.textContent = text;
    toastWrap.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2600);
    setTimeout(() => t.remove(), 3200);
  }

  /* Enter fullscreen, never leave it. Used by the title screen so that
     starting a game fills the screen, which is what the map wants.

     THREE THINGS THAT MATTER HERE:
     - It only ever REQUESTS. Toggling would eject a player who was
       already in fullscreen the moment they pressed Continue.
     - It must be called synchronously inside a real click. Both callers
       are click handlers, so the gesture is still in scope.
     - A refusal is SILENT. The footer button toasts when refused because
       there the player asked for fullscreen and nothing else; here they
       asked to start a game, and a browser complaint about a thing they
       did not request is noise on top of the thing they did. */
  function goFullscreen() {
    if (document.fullscreenElement) return;
    const el = document.documentElement;
    if (!el.requestFullscreen) return;
    const p = el.requestFullscreen();
    if (p && p.catch) p.catch(() => {});
  }

  return { init, toast, awardPopup, renderHUD, tickClock, renderChores, renderPrompt, goFullscreen,
           toggleJournal, closeJournal, openShop, openTransit,
           openKeypad, keypadKey, closeKeypad,
           get journalOpen() { return journal && !journal.classList.contains('hidden'); },
           get shopOpen() { return shopEl && !shopEl.classList.contains('hidden'); },
           get transitOpen() { return transitEl && !transitEl.classList.contains('hidden'); },
           get keypadOpen() { return padEl && !padEl.classList.contains('hidden'); },
           closeTransit() { transitEl.classList.add('hidden'); } };
})();
