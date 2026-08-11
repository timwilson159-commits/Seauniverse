/* ============================================================
   SEA UNIVERSE: AUDIO CONTENT

   Two tables and nothing clever:

     zoneMusic  which theme plays in which zone. Interiors point at
                their own region so walking into a staff block does
                not restart the track.

     sfxEvents  the catalogue of moments in the game that CAN carry a
                sound, with a plain-English description of when each
                one fires. This is the list the sound mapper shows.

     sfxMap     which file is assigned to which event. Starts empty
                and is filled in by tools/sound-mapper.html.

   NOTHING BREAKS IF A SOUND IS MISSING. An event with no assignment,
   or an assignment whose file is not on disk, is silent and logs
   nothing. That is the same contract the sprite pipeline has, and it
   is what lets audio land one file at a time.
   ============================================================ */
window.SU = window.SU || {};
SU.data = SU.data || {};

/* --- MUSIC ---------------------------------------------------
   Files live at Sounds/music_<track>.mp3. Five tracks, one per
   region, and every interior inherits its region's so the music is
   continuous while you are "in" a place. */
SU.data.zoneMusic = {
  // Zone 1
  coastal_cove: 'coastal_cove',
  staff_cove:   'coastal_cove',
  // Zone 2
  coral_kingdom:    'coral_kingdom',
  staff_coral:      'coral_kingdom',
  reef_hall:        'coral_kingdom',
  turtle_unit:      'coral_kingdom',
  service_corridor: 'coral_kingdom',
  // Zone 3
  arctic_cove:  'arctic_cove',
  staff_arctic: 'arctic_cove',
  cold_store:   'arctic_cove',
  // Zone 4
  open_ocean:    'open_ocean',
  staff_ocean:   'open_ocean',
  ocean_stadium: 'open_ocean',
  meridian_pool: 'open_ocean',
  ocean_admin:   'open_ocean',
  deep_service:  'open_ocean',
  // Zone 5
  the_deep:        'the_deep',
  staff_deep:      'the_deep',
  deep_pump:       'the_deep',
  deep_grandstand: 'the_deep',
  deep_hide:       'the_deep',
  deep_gatehouse:  'the_deep',
  deep_necropsy:   'the_deep',
  /* The endgame room is outside the park, and the silence is the
     point: it is the only place in the game with no theme. */
  the_room: null
};

/* --- SOUND EFFECTS -------------------------------------------
   Deliberately a short list. The aim is a game that feels lived in,
   not one that chirps at every keystroke, so there is no footstep
   sound and no per-character voice.

     id     the key used by SU.Audio.play('id')
     label  what the mapper shows
     when   plain English, so a person assigning sounds can tell
            two similar events apart without reading code
     group  how the mapper sorts them
   ------------------------------------------------------------- */
SU.data.sfxEvents = [
  /* ---- moving around ---- */
  { id: 'door_in',    group: 'World', label: 'Enter a building',
    when: 'You step through a door into any interior: a staff block, the reef hall, the pump house.' },
  { id: 'door_out',   group: 'World', label: 'Leave a building',
    when: 'You come back out of an interior into the open air.' },
  { id: 'gate',       group: 'World', label: 'Move between regions',
    when: 'You walk through a gate from one of the five park regions into another.' },
  { id: 'travel',     group: 'World', label: 'Fast travel',
    when: 'You use a transit terminal or the Menu travel tab and arrive somewhere else.' },
  { id: 'blocked',    group: 'World', label: 'Locked or not allowed',
    when: 'A locked door bounces you back, or an object refuses you because you lack a qualification.' },

  /* ---- talking and menus ---- */
  { id: 'dialogue_open', group: 'Interface', label: 'Start a conversation',
    when: 'A dialogue box opens: talking to a character, reading a sign, searching something.' },
  { id: 'dialogue_next', group: 'Interface', label: 'Advance a line',
    when: 'Pressing space to move to the next line. Keep this one very short and quiet.' },
  { id: 'menu_open',     group: 'Interface', label: 'Open the menu',
    when: 'The menu opens, or any full-screen panel such as the shop or a keypad.' },
  { id: 'choice',        group: 'Interface', label: 'Pick an option',
    when: 'You click one of the choices in a conversation, or a care session action.' },

  /* ---- getting on ---- */
  { id: 'quest_start',  group: 'Progress', label: 'New mission',
    when: 'A mission is added to your task list.' },
  { id: 'quest_step',   group: 'Progress', label: 'Mission step done',
    when: 'One step of a mission ticks off, with more still to do.' },
  { id: 'quest_done',   group: 'Progress', label: 'Mission complete',
    when: 'A whole mission finishes. Should feel bigger than a step.' },
  { id: 'level_up',     group: 'Progress', label: 'Level up',
    when: 'You gain a level, which also gives a skill point.' },
  { id: 'achievement',  group: 'Progress', label: 'Achievement earned',
    when: 'Any achievement pops. There are 59 of them, so this fires reasonably often.' },
  { id: 'skill_buy',    group: 'Progress', label: 'Buy a skill level',
    when: 'You spend skill points on the Skills tab.' },
  { id: 'evidence_new', group: 'Progress', label: 'New evidence filed',
    when: 'A document goes into your notebook. This is the sound of the game\'s actual plot advancing.' },

  /* ---- the animals, and the job ---- */
  { id: 'care_start',  group: 'Animals & work', label: 'Care session begins',
    when: 'You start a care session with an animal.' },
  { id: 'care_right',  group: 'Animals & work', label: 'Correct care decision',
    when: 'You choose the right action in a care session.' },
  { id: 'care_wrong',  group: 'Animals & work', label: 'Wrong care decision',
    when: 'You choose a wrong action. Should be gentle: this game never punishes a wrong answer.' },
  { id: 'species_new', group: 'Animals & work', label: 'New species logged',
    when: 'An animal is added to your species log for the first time.' },
  { id: 'observe',     group: 'Animals & work', label: 'Field note logged',
    when: 'You log an observation at a viewing rail.' },
  { id: 'duty_done',   group: 'Animals & work', label: 'Daily task done',
    when: 'You finish one of your rostered shift duties.' },
  { id: 'hazard_log',  group: 'Animals & work', label: 'Defect written into the register',
    when: 'You log a safety defect into the Safety Register in The Deep.' },

  /* ---- things and money ---- */
  { id: 'item_get',  group: 'Things', label: 'Pick something up',
    when: 'Any ordinary item goes into your bag.' },
  { id: 'key_item',  group: 'Things', label: 'Find something important',
    when: 'A key item or a one-off discovery. Should feel notably different from an ordinary pickup.' },
  { id: 'purchase',  group: 'Things', label: 'Buy or sell',
    when: 'A transaction at a kiosk or the mess cupboard.' },

  /* ---- the day, and being watched ---- */
  { id: 'phase_change', group: 'The day', label: 'Shift changes',
    when: 'The day moves on: morning shift to break, break to afternoon, and so on.' },
  { id: 'day_new',      group: 'The day', label: 'A new day starts',
    when: 'The clock rolls over into the next day.' },
  { id: 'save',         group: 'The day', label: 'Game saved',
    when: 'The save button, and the automatic save on each phase change.' },
  { id: 'suspicion_up', group: 'The day', label: 'Suspicion rises',
    when: 'You do something that gets you noticed. Should be uneasy rather than alarming.' },

  /* ---- puzzles and the finale ---- */
  { id: 'keypad_press', group: 'Puzzles & finale', label: 'Keypad key',
    when: 'Each digit or letter entered on a coded door. Must be very short.' },
  { id: 'keypad_wrong', group: 'Puzzles & finale', label: 'Wrong code',
    when: 'A code is rejected. There is no penalty in the game, so keep it light.' },
  { id: 'unlock',       group: 'Puzzles & finale', label: 'Something unlocks',
    when: 'A code is accepted, a gate opens, a repair opens a route. The reward sound.' },
  { id: 'hearing_point', group: 'Puzzles & finale', label: 'Point answered in the hearing',
    when: 'In the endgame, you produce the document that closes the gap.' },
  { id: 'report',       group: 'Puzzles & finale', label: 'Final report appears',
    when: 'The end-of-game report and certificate opens. Plays once, at the very end.' }
];

/* --- ASSIGNMENTS ---------------------------------------------
   event id -> filename inside Sounds/. Written by the sound mapper
   (tools/sound-mapper.html); anything not listed here is silent.

   The files are named after the EVENT rather than after the sound, so
   swapping which noise an event makes is a matter of replacing one
   file and touching nothing else. Assigned 2026-08-05, all 35 events
   covered. */
SU.data.sfxMap = {
  /* world */
  door_in:       'sfx_door_in.mp3',
  door_out:      'sfx_door_out.mp3',
  gate:          'sfx_gate.mp3',
  travel:        'sfx_travel.mp3',
  blocked:       'sfx_blocked.mp3',

  /* interface */
  dialogue_open: 'sfx_dialogue_open.mp3',
  dialogue_next: 'sfx_dialogue_next.mp3',
  menu_open:     'sfx_menu_open.mp3',
  choice:        'sfx_choice.mp3',

  /* progress */
  quest_start:   'sfx_quest_start.mp3',
  quest_step:    'sfx_quest_step.mp3',
  quest_done:    'sfx_quest_done.mp3',
  level_up:      'sfx_level_up.mp3',
  achievement:   'sfx_achievement.mp3',
  skill_buy:     'sfx_skill_buy.mp3',
  evidence_new:  'sfx_evidence_new.mp3',

  /* animals and work */
  care_start:    'sfx_care_start.mp3',
  care_right:    'sfx_care_right.mp3',
  care_wrong:    'sfx_care_wrong.mp3',
  species_new:   'sfx_species_new.mp3',
  observe:       'sfx_observe.mp3',
  duty_done:     'sfx_duty_done.mp3',
  hazard_log:    'sfx_hazard_log.mp3',

  /* things */
  item_get:      'sfx_item_get.mp3',
  key_item:      'sfx_key_item.mp3',
  purchase:      'sfx_purchase.mp3',

  /* the day */
  phase_change:  'sfx_phase_change.mp3',
  day_new:       'sfx_day_new.mp3',
  /* `save` is deliberately unassigned. Autosave fires from 16 places
     (every dialogue close, every quest step, every zone change), so any
     sound on it plays constantly and reads as a bug. Left silent
     2026-08-05; sfx_save.mp3 was deleted. */
  suspicion_up:  'sfx_suspicion_up.mp3',

  /* puzzles and finale */
  keypad_press:  'sfx_keypad_press.mp3',
  keypad_wrong:  'sfx_keypad_wrong.mp3',
  unlock:        'sfx_unlock.mp3',
  hearing_point: 'sfx_hearing_point.mp3',
  report:        'sfx_report.mp3'
};
