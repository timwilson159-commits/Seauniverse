/* ============================================================
   SEA UNIVERSE: DIALOGUE
   Resolves an NPC's ordered dialogue list against current state,
   then plays the winning entry line by line.
   ============================================================ */
window.SU = window.SU || {};

SU.Dialogue = (function () {
  let el, nameEl, textEl, choiceEl, hintEl, pageEl, portraitEl, portraitImg;
  let queue = [], idx = 0, entry = null, speaker = '', open = false;

  function init() {
    el       = document.getElementById('dialogue');
    nameEl   = document.getElementById('dlgName');
    textEl   = document.getElementById('dlgText');
    choiceEl = document.getElementById('dlgChoices');
    hintEl   = document.getElementById('dlgHint');
    pageEl   = document.getElementById('dlgPage');
    portraitEl  = document.getElementById('dlgPortrait');
    portraitImg = document.getElementById('dlgPortraitImg');
    el.addEventListener('click', (e) => {
      if (e.target.closest('.dlg-choices')) return;
      advance();
    });
  }

  /* `lines` and a choice's `reply` are arrays of paragraphs. Writing one
     as a bare string is an easy mistake and used to fail INVISIBLY: a
     string has a .length and a .slice(), so the box accepted it and then
     walked through it one CHARACTER at a time, printing a screenful of
     single letters before returning to the choices. Normalise rather
     than trust the data: both spellings now behave identically. */
  function asLines(v) {
    if (v == null) return [];
    return Array.isArray(v) ? v.slice() : [String(v)];
  }

  /* Pick the first dialogue entry whose `when` passes. */
  function resolve(npc) {
    const list = npc.dialogue || [];
    for (let i = 0; i < list.length; i++) {
      if (SU.Rules.check(list[i].when)) return list[i];
    }
    return { lines: ['...'] };
  }

  /* Accepts either a raw NPC definition or a live actor instance
     (which carries the definition on `.def`). */
  function talkTo(who) {
    const def = who.def || who;
    const id = who.id;
    const chosen = resolve(def);
    if (!def.dialogue) console.warn('[SU] talkTo: no dialogue on', id);
    const st = SU.State.data.npcs[id] || (SU.State.data.npcs[id] = {});
    st.talked = true;
    // a dedicated portrait wins, otherwise reuse the overworld sprite.
    // `sprite` lets a returning character point at art it already has.
    const art = def.sprite || id;
    show(chosen, def.name || who.name, ['npc_' + art + '_portrait', 'npc_' + art]);
  }

  /* Generic opener used by signs, props, locked doors, duties.
     `portrait` is optional: most of these have no speaker. */
  function openLines(entries, title, portrait) {
    show(Array.isArray(entries) ? entries[0] : entries, title || '', portrait);
  }

  function show(e, who, portrait) {
    if (!open) SU.Audio && SU.Audio.play('dialogue_open');   // not on every line
    entry = e;
    speaker = who || '';
    queue = asLines(e.lines);
    idx = 0;
    open = true;
    setPortrait(portrait);
    el.classList.remove('hidden');
    render();
  }

  function setPortrait(names) {
    if (!names) { portraitEl.classList.add('hidden'); return; }
    SU.Sprites.attach(portraitImg, names, ok => {
      portraitEl.classList.toggle('hidden', !ok);
    });
  }

  function render() {
    nameEl.textContent = speaker;
    nameEl.style.display = speaker ? 'block' : 'none';
    textEl.textContent = queue[idx] || '';
    choiceEl.innerHTML = '';
    pageEl.textContent = queue.length > 1 ? (idx + 1) + '/' + queue.length : '';

    const last = idx >= queue.length - 1;
    const choices = (entry.choices || []).filter(c => SU.Rules.check(c.condition));

    if (last && choices.length) {
      hintEl.style.display = 'none';
      choices.forEach(c => {
        const b = document.createElement('button');
        b.className = 'choice';
        b.textContent = c.text;
        b.onclick = (ev) => { ev.stopPropagation(); SU.Audio && SU.Audio.play('choice'); pick(c); };
        choiceEl.appendChild(b);
      });
    } else {
      hintEl.style.display = 'block';
      hintEl.textContent = last ? 'Space / click to close' : 'Space / click to continue';
    }
  }

  function pick(choice) {
    SU.Rules.apply(choice.effects);

    // Code-built dialogues (duty prompts) can hand back control directly.
    if (typeof choice.action === 'function') {
      const act = choice.action;
      close();
      act();
      return;
    }

    const reply = asLines(choice.reply);
    if (reply.length) {
      entry = { lines: reply, onEnd: entry.onEnd };
      queue = reply;
      idx = 0;
      render();
    } else {
      close();
    }
  }

  function advance() {
    SU.Audio && SU.Audio.play('dialogue_next');
    if (!open) return;
    const choices = (entry.choices || []).filter(c => SU.Rules.check(c.condition));
    if (idx >= queue.length - 1 && choices.length) return;   // must choose
    idx++;
    if (idx >= queue.length) close();
    else render();
  }

  function close() {
    if (!open) return;
    open = false;
    el.classList.add('hidden');
    choiceEl.innerHTML = '';        // don't leave stale buttons in the DOM
    portraitEl.classList.add('hidden');
    const e = entry;
    entry = null;
    if (e && e.onEnd) SU.Rules.apply(e.onEnd);
    SU.Quests.evaluate();
    SU.State.save();
  }

  return {
    init, talkTo, advance, close,
    open: openLines,
    get isOpen() { return open; }
  };
})();
