/* ============================================================
   SEA UNIVERSE: BOOT, INPUT, GAME LOOP
   ============================================================ */
window.SU = window.SU || {};

/* ---------------- input ---------------- */
SU.Input = (function () {
  const keys = { up: false, down: false, left: false, right: false };
  const map = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right'
  };

  /* TYPING BEATS WALKING.
     The movement keys are letters, so while a text box has focus the game
     must keep its hands off the keyboard entirely: W, A, S and D were
     being swallowed as movement and E, J, P and Space as hotkeys, which
     meant a player literally could not type the name "Wade" on the
     character select screen, or rename themselves later. Checked live
     rather than tracked with a flag, because focus can move by mouse,
     by Tab, or by a script. */
  function typing() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  function init() {
    addEventListener('keydown', e => {
      if (typing()) return;
      if (map[e.code]) { keys[map[e.code]] = true; e.preventDefault(); }
      handlePress(e);
    });
    /* keyup is NOT gated on `typing()`. If a key goes down while walking
       and the player clicks into a text box before letting go, the keyup
       still has to land or they walk forever. */
    addEventListener('keyup', e => { if (map[e.code]) keys[map[e.code]] = false; });
    addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
    /* Focusing a field mid-stride drops any held direction, so the player
       does not drift across the map while typing. */
    addEventListener('focusin', () => { if (typing()) for (const k in keys) keys[k] = false; });
  }

  function handlePress(e) {
    const modalOpen = SU.Dialogue.isOpen || SU.Care.isOpen || SU.UI.journalOpen ||
                      SU.UI.shopOpen || SU.UI.transitOpen || SU.UI.keypadOpen ||
                      SU.Hearing.isOpen || SU.Report.isOpen ||
                      SU.Aquaword.isOpen || SU.MatchPod.isOpen || SU.Bigger.isOpen ||
                      SU.Connections.isOpen || SU.Sorting.isOpen || SU.Rescue.isOpen;

    /* Pause outranks everything except the modals, and while it is up it
       swallows the rest of the keyboard so a paused game cannot be walked
       around in. Esc lifts it, same as every other overlay. */
    if (SU.Game.isPaused) {
      if (e.code === 'KeyP' || e.code === 'Escape') { SU.Game.togglePause(); e.preventDefault(); }
      return;
    }

    if (e.code === 'Escape') {
      /* The hearing deliberately has NO escape. It is the one scene in
         the game you cannot walk out of halfway through, and letting Esc
         abandon it mid-round would leave a half-scored scoreboard. */
      if (SU.Hearing.isOpen) return;
      if (SU.Report.isOpen) { SU.Report.close(); return; }
      /* An arcade game CAN be walked out of: it is a distraction in a
         staff room, not a scene. Quitting simply forfeits the payout. */
      if (SU.Aquaword.isOpen) { SU.Aquaword.close(); return; }
      if (SU.MatchPod.isOpen) { SU.MatchPod.close(); return; }
      if (SU.Bigger.isOpen)   { SU.Bigger.close(); return; }
      if (SU.Connections.isOpen) { SU.Connections.close(); return; }
      if (SU.Sorting.isOpen)     { SU.Sorting.close(); return; }
      if (SU.Rescue.isOpen)      { SU.Rescue.close(); return; }
      if (SU.Dialogue.isOpen) SU.Dialogue.close();
      else if (SU.Care.isOpen) SU.Care.close();
      else if (SU.UI.keypadOpen) SU.UI.closeKeypad();
      else if (SU.UI.shopOpen) document.getElementById('shop').classList.add('hidden');
      else if (SU.UI.transitOpen) SU.UI.closeTransit();
      else SU.UI.closeJournal();
      return;
    }

    /* The keypad swallows everything while it is up, so typing a code
       cannot also fire the dev hotkeys or open the journal. */
    if (SU.UI.keypadOpen) { SU.UI.keypadKey(e); return; }
    /* RESCUE! reads physical letter keys the same way, and for the same
       reason: M, E and P are all guessable letters, and the hotkey
       branches below would otherwise fire on them first (toggle the
       menu, try to interact, toggle pause) instead of guessing. */
    if (SU.Rescue.isOpen) { SU.Rescue.keyPress(e); return; }
    if (e.code === 'Space' || e.code === 'Enter') {
      if (SU.Dialogue.isOpen) { SU.Dialogue.advance(); e.preventDefault(); return; }
    }
    /* M for Menu since the journal was renamed. Tab stays bound to it as
       well, and J is kept as a silent alias so muscle memory and older
       screenshots still work. */
    if (e.code === 'KeyM' || e.code === 'KeyJ' || e.code === 'Tab') {
      if (!SU.Dialogue.isOpen && !SU.Care.isOpen) { SU.UI.toggleJournal(); e.preventDefault(); }
      return;
    }
    if (e.code === 'KeyE' || e.code === 'Space') {
      if (!modalOpen) { SU.World.interact(); e.preventDefault(); }
      return;
    }
    if (e.code === 'KeyP') {
      if (!modalOpen) { SU.Game.togglePause(); e.preventDefault(); }
      return;
    }
    if (SU.config.dev) devKeys(e);
  }

  function devKeys(e) {
    if (e.code === 'Digit1') SU.Rules.apply([{ type: 'addXP', amount: 200 }]);
    if (e.code === 'Digit2') SU.Rules.apply([{ type: 'addSkillPoints', amount: 5 }]);
    if (e.code === 'Digit3') SU.Rules.apply([{ type: 'money', amount: 200 }]);
    if (e.code === 'Digit4') SU.State.data.storyStage++;
    if (e.code === 'Digit0') { SU.State.wipe(); location.reload(); }
  }

  return { init, keys };
})();

/* ---------------- game ---------------- */
SU.Game = (function () {
  let canvas, ctx, last = 0, running = false;

  function boot() {
    canvas = document.getElementById('view');
    canvas.width = SU.config.view.w;
    canvas.height = SU.config.view.h;
    ctx = canvas.getContext('2d');

    SU.Dialogue.init();
    SU.Care.init();
    SU.Hearing.init();
    SU.Report.init();
    SU.Aquaword.init();
    SU.MatchPod.init();
    SU.Bigger.init();
    SU.Connections.init();
    SU.Sorting.init();
    SU.Rescue.init();
    SU.Audio.init();
    SU.UI.init();
    SU.Input.init();

    const report = SU.Validate.report();
    if (SU.config.dev) showDevReport(report);

    showTitle();
  }

  function showTitle() {
    const t = document.getElementById('title');
    const cont = document.getElementById('btnContinue');
    const btns = document.getElementById('titleBtns');
    const cs = document.getElementById('charSelect');
    cont.style.display = SU.State.hasSave() ? 'inline-block' : 'none';

    /* BOTH TITLE BUTTONS ENTER FULLSCREEN. The map is the whole game and
       it wants the screen, so the moment the player commits to playing is
       the moment to ask. It has to happen inside the click itself, which
       is why it is here and not inside startGame(): a browser only grants
       fullscreen from a real user gesture.

       New Game asks here rather than at Begin so the character select is
       already fullscreen, and it asks AFTER the confirm below, so a player
       who cancels is not left in fullscreen having done nothing. Leaving
       fullscreen is unchanged: Esc, F11, or the footer button. */
    cont.onclick = () => { SU.UI.goFullscreen(); SU.State.init(); startGame(false); };

    document.getElementById('btnNew').onclick = () => {
      if (SU.State.hasSave() && !confirm('Start a new game? Your current save will be erased.')) return;
      SU.UI.goFullscreen();
      buildCharSelect();
      btns.classList.add('hidden');
      cs.classList.remove('hidden');
      document.getElementById('csName').focus();
    };

    document.getElementById('btnBack').onclick = () => {
      cs.classList.add('hidden');
      btns.classList.remove('hidden');
    };

    t.classList.remove('hidden');
  }

  /* Character select. The chosen sprite id is just a filename fragment
     (player_female.svg), so offering another body = one more entry in
     SU.config.playerSprites, no code change here. */
  let chosenSprite = null;

  function buildCharSelect() {
    const host = document.getElementById('csSprites');
    chosenSprite = SU.config.playerSprites[0].id;
    host.innerHTML = '';

    SU.config.playerSprites.forEach(sp => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cs-sprite' + (sp.id === chosenSprite ? ' on' : '');
      b.dataset.sprite = sp.id;
      b.innerHTML = '<img alt=""><span>' + sp.label + '</span>';
      // falls back to the generic player art if that body has no file yet
      SU.Sprites.attach(b.querySelector('img'), ['player_' + sp.id, 'player'], ok => {
        if (!ok) b.querySelector('img').classList.add('missing');
      });
      b.onclick = () => {
        chosenSprite = sp.id;
        host.querySelectorAll('.cs-sprite').forEach(x => x.classList.toggle('on', x.dataset.sprite === sp.id));
      };
      host.appendChild(b);
    });

    const name = document.getElementById('csName');
    name.value = '';
    name.onkeydown = e => { if (e.key === 'Enter') document.getElementById('btnBegin').click(); };

    document.getElementById('btnBegin').onclick = () => {
      SU.State.newGame({ name: name.value, sprite: chosenSprite });
      startGame(true);
    };
  }

  function startGame(isNew) {
    document.getElementById('title').classList.add('hidden');
    if (!SU.State.data) SU.State.init();
    SU.State.refreshQualifications();

    const p = SU.State.data.player;
    const savedX = p.x, savedY = p.y;
    SU.World.loadZone(p.zone, isNew ? 'start' : null);
    if (!isNew) { p.x = savedX; p.y = savedY; }        // resume exactly where you left off

    if (!SU.State.data.shift.assigned.length && SU.State.phase().kind === 'public') {
      SU.Duties.assign();
    }

    SU.UI.renderHUD();
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);

    if (isNew) {
      SU.Dialogue.open({
        lines: [
          'Day one at Sea Universe.',
          'You have a lanyard waiting in the staff block, a shift starting in twenty minutes, and a reason for being here that is not on your application form.',
          'Do the job properly. Watch everything. Write it down.',
          'Move with WASD or the arrow keys. Press E to interact. Press M for the menu.'
        ]
      }, 'Sea Universe');
    }
  }

  let hudTick = 0;

  /* MANUAL PAUSE. The loop already froze for every modal, so this is the
     same freeze with a deliberate switch on it rather than a new concept.
     It stops `playMs` too, which is what makes it honest: every quest
     timer in the game runs on accumulated play time, so pausing cannot be
     used to beat a clock and cannot cost you one either. */
  let manualPause = false;

  function setPause(on) {
    manualPause = !!on;
    document.getElementById('pauseVeil').classList.toggle('hidden', !manualPause);
    SU.Audio && SU.Audio.duck(manualPause || SU.UI.journalOpen);
  }
  function togglePause() { setPause(!manualPause); }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    const paused = manualPause ||
                   SU.Dialogue.isOpen || SU.Care.isOpen || SU.UI.journalOpen ||
                   SU.UI.shopOpen || SU.UI.transitOpen || SU.UI.keypadOpen ||
                   SU.Hearing.isOpen || SU.Report.isOpen ||
                   SU.Aquaword.isOpen || SU.MatchPod.isOpen || SU.Bigger.isOpen ||
                   SU.Connections.isOpen || SU.Sorting.isOpen || SU.Rescue.isOpen;
    if (!paused) {
      SU.World.update(dt);
      /* Quest timers run off playMs, so they stop while a menu is open.
         That is deliberate: reading a dialogue box should never cost you
         the bonus. */
      SU.State.data.meta.playMs += dt * 1000;

      /* THE SHIFT CLOCK runs on the same accumulated play time, so it
         stops dead for dialogue, menus and pause. A phase that runs out
         ends itself, which is the whole point of the feature: shifts come
         round on their own instead of waiting for the player to press a
         button. It can only ever fire out here in free play, because
         phaseMs does not advance while anything is open. */
      SU.State.data.meta.phaseMs += dt * 1000;
      if (SU.State.phaseOver()) endPhase();

      SU.UI.tickClock();

      // the HUD normally only redraws on state changes, so a running
      // countdown needs its own nudge
      if (SU.Quests.timers().length) {
        hudTick += dt;
        if (hudTick >= 0.25) { hudTick = 0; SU.UI.renderHUD(); }
      }
    }
    SU.World.draw(ctx);
    SU.UI.renderPrompt();
    requestAnimationFrame(loop);
  }

  /* Ends the current shift/phase. */
  function endPhase() {
    const before = SU.State.data.day;
    SU.State.advancePhase();
    const d = SU.State.data;

    if (d.day !== before) {
      SU.Dialogue.open({
        lines: [
          'You sign out and the park empties.',
          'Day ' + before + ' summary: Level ' + d.level + ' (' + SU.State.rank() + '), ' +
          d.evidence.length + ' piece(s) of evidence, suspicion ' + d.suspicion + '.',
          'Day ' + d.day + ' begins.'
        ]
      }, 'End of Day');
    } else {
      SU.UI.toast('Now: ' + SU.State.phase().label);
    }
    SU.State.save();
  }

  function showDevReport(res) {
    const box = document.getElementById('devReport');
    if (!box) return;
    if (!res.errors.length && !res.warnings.length) {
      box.innerHTML = '<strong style="color:#6fd18a">Content OK</strong>';
    } else {
      box.innerHTML =
        (res.errors.length ? '<strong style="color:#e05c5c">' + res.errors.length + ' error(s)</strong><br>' + res.errors.slice(0, 6).join('<br>') : '') +
        (res.warnings.length ? '<br><strong style="color:#e0a34a">' + res.warnings.length + ' warning(s)</strong><br>' + res.warnings.slice(0, 6).join('<br>') : '');
    }
    box.classList.remove('hidden');
  }

  return {
    boot, endPhase, togglePause, setPause,
    get isPaused() { return manualPause; }
  };
})();

addEventListener('DOMContentLoaded', () => SU.Game.boot());
