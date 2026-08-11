/* ============================================================
   SEA UNIVERSE: AUDIO

   Same forgiving contract as the sprite pipeline: a missing file is
   silent and never throws, so sound can land one file at a time and
   the game is fully playable with none of it.

   THE THREE THINGS THAT MAKE BROWSER AUDIO ANNOYING, handled here:

   1. AUTOPLAY IS BLOCKED until the user has interacted with the page.
      Music cannot start on load. `unlock()` is wired to the first
      real gesture and starts whatever track was waiting.

   2. THE TRACK MUST NOT RESTART when you walk into a staff block.
      Zones map to a TRACK id (data/audio.js), and changing zone only
      changes the music if the track id actually changed.

   3. CROSS-FADING needs two elements, not one. `<audio>` cannot fade
      itself, so there is a pair and they swap roles on each change.

   Volumes are stored outside the save file, in their own localStorage
   key, because a volume setting belongs to the machine rather than to
   the character: wiping your save should not make the game loud again.
   ============================================================ */
window.SU = window.SU || {};

SU.Audio = (function () {
  const MUSIC_DIR = 'Sounds/';
  const FX_DIR    = 'Sounds/';
  const PREFS_KEY = 'seaUniverse.audio';
  const FADE_MS   = 700;

  let deck = [];            // two <audio> elements that swap
  let live = 0;             // index of the one currently playing
  let track = null;         // ZONE track id, current or pending
  let overrideTrack = null; // non-zone track (the arcade) temporarily replacing it
  let unlocked = false;
  let fadeTimer = null;
  let retryTrack = null;    // a track whose play() was refused, to try again

  /* What SHOULD be audible right now: the override if one is active,
     the zone track otherwise. `track` itself is never touched by an
     override, so clearing it always lands back on the right zone even
     if the zone changed underneath the override (impossible today,
     since a modal freezes movement, but cheap to get right anyway). */
  function wantedTrack() { return overrideTrack || track; }

  const missing = {};       // files we already know are not there
  const fx = {};            // filename -> HTMLAudioElement (preloaded)

  let prefs = { music: 0.5, sfx: 0.7, musicOn: true, sfxOn: true };

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) prefs = Object.assign(prefs, JSON.parse(raw));
    } catch (e) { /* defaults are fine */ }
  }
  function savePrefs() {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) {}
  }

  function init() {
    loadPrefs();
    deck = [new Audio(), new Audio()];
    deck.forEach(a => { a.loop = true; a.preload = 'auto'; a.volume = 0; });

    /* Any of these counts as the gesture that unlocks audio. */
    ['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
      addEventListener(ev, unlock, { once: false, passive: true }));

    SU.bus.on('zone:changed', z => {
      const id = SU.World && SU.World.zoneId;
      setZone(id);
    });

    /* Anything the event bus already announces is wired here rather than
       by editing the system that announces it. Only events with no bus
       signal get an explicit play() call in their own module. */
    SU.bus.on('level:up',       () => play('level_up'));
    SU.bus.on('evidence:added', () => play('evidence_new'));
    SU.bus.on('day:new',        () => play('day_new'));
    SU.bus.on('phase:changed',  () => play('phase_change'));
    SU.bus.on('game:saved',     () => play('save'));
    SU.bus.on('hazard:logged',  () => play('hazard_log'));
    SU.bus.on('hazard:repaired',() => play('unlock'));
    SU.bus.on('quest:started',  () => play('quest_start'));
    SU.bus.on('quest:step',     () => play('quest_step'));
    SU.bus.on('quest:completed',() => play('quest_done'));
    SU.bus.on('qualification:earned', () => play('achievement'));
  }

  /* Runs on EVERY gesture, not just the first, so a track the browser
     refused earlier gets another go the next time the player clicks
     something. Cheap, because it does nothing once the music is running. */
  function unlock() {
    const first = !unlocked;
    unlocked = true;
    const want = wantedTrack();
    if (first && want) return reallyPlay(want);
    if (retryTrack && retryTrack === want) {
      const a = deck[live];
      if (!a || a.paused) { retryTrack = null; reallyPlay(want); }
      else retryTrack = null;
    }
  }

  /* ---------- music ---------- */

  function trackForZone(zoneId) {
    const map = (SU.data && SU.data.zoneMusic) || {};
    return Object.prototype.hasOwnProperty.call(map, zoneId) ? map[zoneId] : null;
  }

  function setZone(zoneId) {
    const want = trackForZone(zoneId);
    if (want === track) return;            // same track: do not restart it
    track = want;
    if (overrideTrack) return;             // an override is playing; it picks this up when cleared
    if (!unlocked) return;                 // it will start on the first gesture
    reallyPlay(want);
  }

  /* ---------- override (the arcade) ----------
     A non-zone track that temporarily replaces whatever the zone is
     playing, for exactly as long as an arcade cabinet is in use.
     `track` itself is never touched, so `clearOverride` always lands
     back on the correct zone theme without either side needing to
     remember what it was. */
  function playOverride(id) {
    if (overrideTrack === id) return;      // already playing it: do not restart
    overrideTrack = id;
    if (!unlocked) return;                 // picked up by unlock() on the first gesture
    reallyPlay(id);
  }

  function clearOverride() {
    if (!overrideTrack) return;
    overrideTrack = null;
    if (unlocked) reallyPlay(track);
  }

  function reallyPlay(id) {
    if (!id) return fadeOutAll();
    const src = MUSIC_DIR + 'music_' + id + '.mp3';
    if (missing[src]) return;

    const next = deck[1 - live];
    next.src = src;
    next.currentTime = 0;
    next.volume = 0;

    /* A MISSING FILE and a REFUSED PLAY are different things, and
       conflating them is a real bug: play() rejects whenever the browser
       feels like it (autoplay policy, a backgrounded tab, a gesture that
       has not landed yet), and treating that as "the file is not there"
       permanently blacklists a track that is perfectly fine.

       Only the element's own `error` event means the file is absent. A
       rejected play just means "not yet", so it is remembered and retried
       on the next gesture. */
    next.onerror = () => { missing[src] = true; };

    const p = next.play();
    if (p && p.catch) {
      p.catch(() => { retryTrack = id; });
    }
    crossfade(1 - live);
  }

  /* DUCKING is separate from the music preference on purpose. Silencing
     the journal by flipping `musicOn` would write the player's own
     setting, so closing the journal would restore music they had
     deliberately turned off. This multiplies the target instead and
     never touches prefs. */
  let duckLevel = 1;

  function duck(on) {
    const want = on ? 0 : 1;
    if (want === duckLevel) return;
    duckLevel = want;
    const a = deck[live];
    if (a) a.volume = targetMusicVolume();
  }

  function targetMusicVolume() { return (prefs.musicOn ? prefs.music : 0) * duckLevel; }

  function crossfade(toIndex) {
    clearInterval(fadeTimer);
    const from = deck[live], to = deck[toIndex];
    const start = performance.now();
    const fromV = from.volume, toV = targetMusicVolume();
    fadeTimer = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / FADE_MS);
      from.volume = fromV * (1 - t);
      to.volume   = toV * t;
      if (t >= 1) {
        clearInterval(fadeTimer);
        try { from.pause(); } catch (e) {}
        live = toIndex;
      }
    }, 40);
  }

  function fadeOutAll() {
    clearInterval(fadeTimer);
    const from = deck[live];
    const start = performance.now(), fromV = from.volume;
    fadeTimer = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / FADE_MS);
      from.volume = fromV * (1 - t);
      if (t >= 1) { clearInterval(fadeTimer); try { from.pause(); } catch (e) {} }
    }, 40);
  }

  /* ---------- sound effects ---------- */

  /* Preloaded and cloned on play, so the same sound can overlap itself
     without cutting off (two achievements at once, for instance). */
  function play(eventId) {
    if (!prefs.sfxOn || !unlocked) return;
    const file = (SU.data.sfxMap || {})[eventId];
    if (!file) return;                      // unassigned events are silent
    const src = FX_DIR + file;
    if (missing[src]) return;

    let base = fx[src];
    if (!base) {
      base = fx[src] = new Audio(src);
      base.preload = 'auto';
      base.addEventListener('error', () => { missing[src] = true; }, { once: true });
    }
    const shot = base.cloneNode();
    shot.volume = prefs.sfx;
    const p = shot.play();
    if (p && p.catch) p.catch(() => {});
  }

  /* ---------- settings ---------- */

  function get() { return Object.assign({}, prefs); }

  function set(k, v) {
    prefs[k] = v;
    savePrefs();
    if (k === 'music' || k === 'musicOn') {
      const a = deck[live];
      if (a) a.volume = targetMusicVolume();
      if (prefs.musicOn && wantedTrack() && unlocked && (!a || a.paused)) reallyPlay(wantedTrack());
      if (!prefs.musicOn) deck.forEach(x => { try { x.pause(); } catch (e) {} });
    }
    SU.bus.emit('audio:changed');
  }

  return {
    init, unlock, play, setZone, get, set, duck, playOverride, clearOverride,
    get ducked() { return duckLevel === 0; },
    get currentTrack() { return wantedTrack(); },
    get isUnlocked() { return unlocked; },
    /* for the console and for tests */
    report() {
      return {
        track: track, overrideTrack: overrideTrack, unlocked: unlocked, prefs: get(),
        assigned: Object.keys(SU.data.sfxMap || {}).length,
        events: (SU.data.sfxEvents || []).length,
        missing: Object.keys(missing),
        /* The music decks are created with `new Audio()` and never enter
           the DOM, so this is the only way to see what is actually making
           noise. Invaluable when a track will not change. */
        live: live,
        decks: deck.map((a, i) => ({
          i: i, live: i === live,
          src: (a.src || '').split('/').pop(),
          volume: +a.volume.toFixed(2),
          paused: a.paused
        }))
      };
    }
  };
})();
