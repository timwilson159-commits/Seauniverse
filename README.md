# Sea Universe

An undercover marine-park trainer RPG. All five zones playable end to end.

| Zone | Region | Interiors |
|---|---|---|
| 1 | Coastal Cove, seals, sea lions and otters | Cove Staff Block |
| 2 | Coral Kingdom, dolphins, the reef hall and the rehab unit | Reef Staff Block · Great Reef Hall · Rehabilitation Unit (gated) · Service Corridor (gated) |
| 3 | Arctic Cove, walrus, beluga and cold seals | Arctic Staff Block · Cold Store (gated) |
| 4 | Open Ocean, orca, pilot whales and mantas | Ocean Staff Block · Blue Horizon Stadium · Meridian Holding (keypad) · Administration (gap window only) · Service Level (gated) |
| 5 | The Deep, blue whale, humpback, sperm whale, false killer whale, dugong | Deep Staff Block · Pump House · The Grandstand (gated) · Under the Stand (word lock) · Sea Gate House · Post-Mortem Room |

## Running it

**Easiest:** double-click `index.html`. Everything is plain HTML/CSS/JS with classic
`<script>` tags, with no build step, no bundler and no modules, specifically so this works
straight off the disk.

**If your browser blocks local saving:** run the included server and open
<http://localhost:8123>:

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

**On GitHub Pages:** push the folder, enable Pages, done. No configuration needed.

Add `?dev` to the URL for the debug overlay, the content-validation report, and
hotkeys: `1` +200 XP · `2` +5 skill points · `3` +$200 · `4` advance story stage ·
`0` wipe save.

## Controls

| Key | Action |
|---|---|
| WASD / arrows | Move |
| `E` | Interact with whatever you're standing next to |
| `Space` | Advance dialogue |
| `J` | Journal (tasks, notebook, bag, species, skills, awards) |
| `Esc` | Close anything |

## What's built

- Tile map with collision, camera, zone transitions, condition-gated doors
- Scenery props as real obstacles, depth-sorted so you walk behind things
- NPCs that walk: `wander` and `patrol` movement, tuned per character
- Day cycle: 4 phases (2 public shifts = your cover, 2 gap windows = free time)
- Care Sessions, the no-combat "battle" replacement: observe cues, choose care action
- Observation posts: stand at a rail and log what an animal is actually doing
- Keeper talks: answer a guest's question in front of a crowd; right answers are good cover
- Coded doors: a numeric keypad (Zone 4) and a word lock (Zone 5), both penalty-free
- Hazards and the Safety Register: log the defects on a site, and get three of them
  repaired, which physically opens routes that were closed
- Quest system, 5 quest types, steps that auto-advance off game state
- Notebook with 4 evidence types and PR-claim contradiction matching
- Suspicion meter (soft pressure only, never a fail state)
- Levels, XP, 5 skills, auto-derived qualifications, ranks, 12 achievements
- Species log with real biology facts
- Shop, inventory with carry limit, buying and selling
- Shift system: public shifts assign duties (your cover), gap windows are the only
  time you can investigate: skipping duties costs you, clean shifts buy goodwill
- Staff block per region + fast travel between them
- Sprite pipeline: drop art into `/sprites` and it replaces placeholders (see
  [sprites/README.md](sprites/README.md) for the full brief and sizes)
- Save/load to localStorage, versioned with working migrations
- Audio: one music theme per region (interiors inherit theirs, so walking into a
  staff block does not restart the track) and a catalogue of 35 sound events.
  Music and effects each have a toggle and a volume slider in the footer, stored
  outside the save file so wiping a save does not make the game loud again.

### Sound

Music lives at `Sounds/music_<track>.mp3` and is mapped by `SU.data.zoneMusic` in
`data/audio.js`, and every zone needs an entry there, even if it is an explicit
`null`, and the validator warns about any zone that has none.

Effects are events, not files. `data/audio.js` lists 35 moments that can carry a
sound (`door_in`, `quest_done`, `care_wrong`, `evidence_new`, and so on) with a
plain-English description of when each fires. `SU.data.sfxMap` maps event id to
filename; anything unmapped is simply silent.

**A missing sound never throws and never logs.** That is the same contract the
sprite pipeline has, and it is what lets audio land one file at a time.

Assign effects with **`tools/sound-mapper.html`**: pick an event, preview sounds
with ▶, press Assign, and it generates the rename list. Serve the folder rather
than opening it off disk, or the browser will block local audio playback.

## Adding content: read this before editing

Everything in `data/` is content. Everything in `js/` is engine. **You should almost
never need to touch `js/` to add a zone, NPC, quest, item, species, or piece of evidence.**

| File | What lives here |
|---|---|
| `data/config.js` | Tuning numbers: speed, energy, XP curve, suspicion bands |
| `data/items.js` | Items (tools, keys, consumables, junk) |
| `data/species.js` | Animals, their biology facts, and their Care Session encounters |
| `data/progression.js` | Ranks, qualifications, evidence definitions, achievements |
| `data/zones.js` | Maps (painted as rectangles), objects, exits |
| `data/npcs.js` | NPCs and their stage-dependent dialogue |
| `data/quests.js` | Quests and their auto-advancing steps |
| `data/duties.js` | Shift duties, the cover job |
| `data/talks.js` | Keeper talk question pools |

Zones 3, 4 and 5 each split their content into their own files
(`zone_arctic.js`, `zone_ocean.js`, `zone_deep.js`, and the matching
`npcs_*` / `quests_*` / `species_deep.js` / `progression_deep.js`), which is
the convention for any new region.

### The two vocabularies

Every system (dialogue, quest steps, locked doors, object access, rewards) uses the
same **conditions** and **effects** language, documented at the top of `js/rules.js`.

```js
// condition: shown only when all of these are true
when: { quest: { q_cove_induction: 'completed' }, evidence: 'ev_brochure_claim' }

// effects: what happens
onEnd: [ { type:'giveItem', id:'whistle' }, { type:'addXP', amount:40 } ]
```

Adding a *new kind* of condition or effect is the only reason to open `js/rules.js`.

### Repeatable content, non-repeatable rewards

Almost everything in this game can be replayed, and that is deliberate, because
re-reading a case is how a student learns it. What must never repeat is the
**payout**. Any effect that hands out value (`addXP`, `money`, `addSkillPoints`,
`addSkill`, `giveItem`, `addTrust`) from something the player can trigger twice
needs a claim key:

```js
{ type:'addXP', amount:60, once:'wren_manifest' }   // once per save, ever
{ type:'money', amount:5,  perDay:'tip_jar' }       // once per in-game day
```

Effects that share a key inside one list fire or skip together, so a gated
reward and its toast stay in step. A payout is also safe without a key if its
scene can only fire once: the entry sets a flag, or changes a quest status,
that its own `when` is testing. The validator warns about anything else.

The engine applies the same rule to its own systems:

- **Care sessions**: first solve pays in full, practice pays once per in-game
  day per encounter, and every session costs energy to open, replay or not.
- **Search props**: `once: true` is a one-off scene (a locker, a document).
  Everything else restocks once per day, so junk loot is not an infinite money
  tap and the coffee pot is not infinite energy.

### The object kinds

Every `E`-pressable thing in a zone is an object with a `kind`. Adding a new kind
means one case in `js/interact.js`; everything below already exists.

| Kind | What it does |
|---|---|
| `sign` / `station` | Reads out text, then runs its `effects`. `station` is the same thing that duties get performed at. A sign can be re-read forever, so any payout on one needs a `once`/`perDay` key. |
| `search` | Loot and/or effects. `once:true` for a one-off scene; otherwise it restocks daily. |
| `animal` | Starts a Care Session for `species`. |
| `observe` | An observation post for `species`: costs energy, logs a field note, pays once per day. |
| `talk` | A keeper talk drawing from the question `pool` in `data/talks.js`. Once per day per point. |
| `shop` | Sells the items in `sells`. |
| `transit` | Fast-travel terminal (staff blocks only). |
| `keypad` | A lock whose key is knowledge. `mode:'digits'` (the Meridian gate, Zone 4) or `mode:'letters'` for a word (the hide, Zone 5). Unlimited attempts, no penalty, a nudge after `hintAfter` misses. |
| `hazard` | A maintenance or safety defect you can log into the **Safety Register**. See below. |
| `hearing` | The endgame. Barry states one of the park's PR claims and the player produces the document that disproves it. See below. |

### The hearing

The finale, and the only place the notebook's `contradictedBy` data is used as a
mechanic rather than a display. Each round names a `pr` claim and lists the
evidence that answers it:

```js
{ id:'r1', claim:'ev_brochure_claim',
  accept:['ev_transfer_manifest','ev_dolphin_studbook','ev_turtle_origin'],
  barry:[...], win:[...], lose:[...], concede:[...], lesson:'...' }
```

Classroom rules, same as the Care Session: a round can be lost, the hearing
cannot. Wrong answers explain themselves and you try again, a player who never
found the document can **concede** the point and move on, and the lesson shows
either way. What is scored is answering **first time**, and that number goes on
the certificate.

The validator refuses a round that can never be answered: an unknown id in
`accept`, an empty `accept`, or a document that is itself a PR claim (those are
filtered out of the player's exhibit list, so they could never be picked).

### Hazards and the Safety Register

A `hazard` is a defect the player can read and choose to write down. Logging is one
way and permanent, so the payout is engine-gated to the first log and can never be
farmed. Quests and dialogue read the register with three conditions:

```js
when: { hazardLogged:   'hz_deck_gap' }        // this one is in the register
when: { hazardRepaired: 'hz_deck_gap' }        // and somebody actually fixed it
when: { hazardCount: { min: 8 } }              // eight anywhere in the park
when: { hazardCount: { min: 3, repaired: true } }
```

Two effects go with them, `logHazard` and `repairHazard`. The second is the one that
changes the world: **any prop can carry a `when` condition**, so a barrier across a
walkway simply stops existing once its defect is repaired, and the plate that
replaces it starts existing.

```js
{ t:'barrier',   x:30, y:20, when: { not: { hazardRepaired:'hz_deck_gap' } } }
{ t:'deckplate', x:30, y:20, when: {      hazardRepaired:'hz_deck_gap'   } }
```

Conditions are re-evaluated on every state change, not just on zone load, so a repair
agreed in a conversation opens the route under the player's feet.

**The validator flood-fills any map with conditional props twice**, once with every
barrier present and once with none, and refuses to start if a hazard is walled in
behind the repair that its own logging causes, a deadlock that is invisible in the
data and would only ever show up in a classroom. Anything else that is deliberately
gated behind a repair has to say so with `gatedByRepair: '<hazard id>'`.

A zone can also carry `onArrive: [effects]`, which fire the first time the player
ever sets foot in it: that is where "you reached a new region" achievements live.

### Adding scenery

Props live in each zone's `props` array, one per tile, using the palette at the top
of `data/zones.js`:

```js
{ t:'palm', x:15, y:4 }
{ t:'bench', x:18, y:5, text:'Optional, makes it readable with E.' }
```

Solid props are obstacles. Add as many as you like; the validator will tell you if
one blocks a doorway or seals off an NPC.

### Making NPCs walk

Add a `movement` field in `data/npcs.js`:

```js
movement: { type:'wander', radius:3, speed:1.9, pause:[0.3,1.2] }   // a restless kid
movement: { type:'patrol', points:[{x:25,y:11},{x:33,y:11}] }       // walks a route
```

Speed and pause length do a lot of characterisation: Nan shuffles at 0.55 with long
pauses, Ollie tears about at 1.9. A future `schedule` field (NPCs relocating by day
phase, per the design doc) drops into this same system.

A character who appears in a second location is a second NPC entry, but `sprite:`
points it at art that already exists, so it needs no new drawing:

```js
barry_reef: { name:'Barry C.', sprite:'barry', zone:'coral_kingdom', ... }
```

### The park rule: every region has a staff block

Zones are tagged `kind: 'region'` (an outdoor park area) or `kind: 'interior'`.
**Every region must have exactly one staff block**, and the validator will refuse to
let you forget:

```js
coastal_cove: { kind:'region', ... }
staff_cove:   { kind:'interior', staffFor:'coastal_cove', ... }
```

A staff block must have:
- a `spawn` named `entry` (fast travel arrives there)
- an object with `kind:'transit'` (the terminal)
- a door in each direction between it and its region

Get any of that wrong and startup tells you exactly what is missing.

### Fast travel

Transit terminals live in staff blocks. A destination unlocks once the player has
reached that region **on foot** at least once, tracked in `state.zonesVisited`,
which `World.loadZone` maintains automatically. Travel is free and instant on
purpose: the tension in this game comes from suspicion triggers, not from walking.

### The validator is your safety net

On every load, `js/validate.js` cross-checks every ID reference in the data files,
unknown items, missing quests, NPCs standing inside walls, exits pointing at
non-existent spawns, care encounters with no correct answer or no lesson text.

It also **flood-fills each map from its spawn point** and fails if any object, exit,
NPC or patrol point has been sealed off, which is the exact way decorative scenery
breaks a level. And it warns about **repeatable payouts**: a reward handed out by
something the player can trigger again and again, which is how XP farms get in.

Open the browser console after any content edit. Green means clean.

## Art

All graphics are deliberately placeholder: labelled circles (NPCs), labelled squares
(objects), flat colour tiles. Real SVGs drop into `drawEntity()` in `js/world.js`:
that one function is the only thing that needs to change.

## Where the story is up to

Stages 0–2 are Coastal Cove: you arrive, meet your contact, and find one document
that contradicts one brochure. Stages 3–4 are Coral Kingdom: the breeding studbook,
the falsified water logs, and the "rescue" turtle that was never a rescue. Stages
5–6 are Arctic Cove, where a walrus that could not climb a ramp had been written up
as lazy. Stages 7–9 are Open Ocean: an orca alone behind a coded gate, a board pack
that says what she is for, and a name on a company search: Barry Cuda.

Stages 10–16 are The Deep, and the story runs out of places to hide. Five animals
nobody should have been able to get, twelve defects that are only a scandal once
they are in one document, nine numbered pieces of graffiti that spell what the park
calls itself, a funded sanctuary offer refused three times in writing, and five
people in four other zones who all repeated the same man's story and got it
slightly differently. Barry appears for the fifth and last time, and stops
performing.

Stage 17–20 is the endgame. The animals move overnight whatever you do, so the
last night is spent warning the three people who will be standing in it when the
story breaks. Then you walk out of the main visitor gate of the zone you started
in, for the first and only time, into a room above a cafe with a journalist, a
recorder, and Barry Cuda, who answers every accusation with something true.

## Not built yet

**Post-game free play.** The story finishes and the world stays open, but the
planned handover-period content is not built: the animals should stay on site
for the months the transfer takes, with care sessions reframed as preparing them
for it, plus a pool of repeatable non-narrative missions.

Also outstanding: audio (a `Sounds/` folder of zone themes and effects is on
disk and the `music` field on every zone is reserved and unread), NPC schedules,
and a shift clock.
