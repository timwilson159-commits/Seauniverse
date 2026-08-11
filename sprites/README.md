# Sea Universe: Sprite Brief

Drop a file in this folder and it replaces the placeholder automatically.
No code changes, no registration. Missing files fall back to coloured shapes,
so you can add art one piece at a time.

**Format: `.svg`.** (`.png` and `.webp` also load, as a fallback, if you ever
mix in raster art.)

**`player.svg` is already here as a working style reference.** Match its
construction: flat fills, hard edges, contact shadow, feet on the bottom edge.

---

## The two rules that matter

**1. Aspect ratio, and art on the bottom edge.**

> Transparent background, subject resting on the **bottom edge** of the canvas.

The game scales every sprite so its **width equals one tile**, then anchors the
bottom-centre to the bottom-centre of the tile. That is what makes a tall palm stand
up out of its tile and correctly sort in front of / behind the player. So only the
*ratio* matters: a 128×256 palm and a 32×64 palm render identically.

**2. Get the viewBox ratio right, and prefer explicit `width`/`height`.**

```xml
BEST   <svg xmlns="http://www.w3.org/2000/svg" width="128" height="192" viewBox="0 0 128 192">
OK     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 192">
```

Only the **ratio** actually matters. I tested the viewBox-only case: the browser
reports a default intrinsic size that still preserves the viewBox ratio
(a 128×192 viewBox measures as 100×150), and since the loader scales by width it
renders correctly either way. Setting `width`/`height` explicitly just removes any
dependence on that default behaviour, so it is worth doing.

What *does* break a sprite is getting the **viewBox proportions wrong**: a palm
authored in a square viewBox will render squat, because the game trusts the ratio.

Sizes below are the recommended **coordinate space** (4× the 32 px display size).
Vectors rescale losslessly, so this is purely about having room for detail without
fractional coordinates.

---

## MASTER STYLE PROMPT

Paste this at the top of every generation, then append one SUBJECT line.

```
Produce a single self-contained SVG file. Output ONLY valid SVG markup, starting
with <svg> and ending with </svg>. No explanation, no markdown fences.

TECHNICAL REQUIREMENTS:
- The root element must carry explicit width and height attributes matching the
  viewBox, e.g. <svg xmlns="http://www.w3.org/2000/svg" width="128" height="192"
  viewBox="0 0 128 192">
- Transparent background. Do NOT add a background rectangle.
- Use only <path>, <rect>, <circle>, <ellipse>, <polygon> and <g>.
- No <image>, no external references, no <filter>, no CSS classes, no <style>
  blocks, no gradients, no embedded fonts, no text of any kind.
- Keep it under roughly 120 shapes so it stays readable and light.

ART STYLE: Game Boy Advance era sprite art, in the visual style of Pokémon Emerald
and Pokémon FireRed overworld graphics, reproduced as clean flat vector shapes.

PERSPECTIVE: top-down three-quarter view, camera looking down at roughly 60 degrees.
The viewer sees the top and the front face of objects, never the underside.

RENDERING: flat colour fills only: one base tone plus one darker shade for form and
one lighter shade for the top-left highlight. Hard edges, no gradients, no blur, no
soft shading. Selective outlining in the Pokémon manner: outline the outer silhouette
using a darker shade of the object's own colour, never pure black. Light source is
top-left, so shading and the contact shadow fall to the bottom-right.

SILHOUETTE: bold and instantly readable when shrunk to 32 pixels wide. Chunky,
simplified, generous forms. Omit fine interior detail: it disappears at display size.

COMPOSITION: one subject only, centred horizontally, resting on the BOTTOM edge of
the canvas. Include a small soft contact shadow ellipse directly beneath it so it
sits on the ground. No ground plane, no scenery, no frame, no border, no drop shadow
outside the silhouette, no turnarounds or multiple views.

MOOD: bright, warm, family-friendly marine theme park. Saturated but not garish.

PALETTE: use these hex values and closely related shades only:
  water        #1d5f8a  #2a7fa8  #4fb0c6
  foliage      #2f7a45  #3a7a4a  #5a8f5e
  grass        #3f6b4a  #4f7d57
  sand         #c9b787  #e0d2a8
  timber deck  #b8a487  #8a6a45  #5a4632
  concrete     #9a9384  #b5aea0
  dark trim    #2b3a3f  #1b2b34
  staff blue   #2f7fa8  #3d92bc
  accent gold  #e0a34a  #f2c14e
  alert red    #e05c5c  #c85a5a
  skin tones   #e8bb96  #dcae89  #a9764f  #6f4a30
```

Then append:

```
SUBJECT: <one line from the tables below>
CANVAS: <size from the tables below>
```

---

## SPRITE LIST

### Priority 1: characters

All **128 × 192** (displays at 32 × 48), front-facing.

Optional extras the loader picks up automatically, no code changes needed:
- **Facing variants**: `npc_dana_up.svg`, `_down`, `_left`, `_right`.
- **Dialogue portraits**: `npc_dana_portrait.svg`, shown above the text box when
  you talk to someone. Falls back to the overworld sprite if absent, so this is
  purely optional. A portrait can afford more detail: use a **3 × 4 ratio**
  (e.g. 384 × 512), head-and-shoulders, facing the viewer.

**One drawing, two appearances.** A character who turns up in a second location is
a separate NPC with its own id, but it can point at art that already exists using
`sprite:` in `data/npcs.js`. `barry_reef` and `wren_reef` both do this, so
`npc_barry.svg` and `npc_wren.svg` cover all four appearances: do not draw them twice.

| Filename | SUBJECT line |
|---|---|
| `player.svg` | *(reference already shipped, replace only if you want a different look)* A young marine park trainer in a blue staff polo shirt and dark trousers, staff lanyard with ID card around the neck, short brown hair, neutral friendly expression, standing facing the viewer. |
| `npc_dana.svg` | A woman in her forties, senior marine mammal trainer, weathered and capable, sun-faded orange-tan work polo shirt, whistle on a cord around the neck, hair tied back tightly, arms slightly away from the body, standing facing the viewer. |
| `npc_milo.svg` | A young man in his twenties, junior trainer, teal staff polo shirt, wetsuit tied around the waist by its sleeves, cheerful open posture, messy dark hair, standing facing the viewer. |
| `npc_wren.svg` | A woman in her fifties in casual visitor clothes deliberately blending in: wide-brimmed sun hat, pale green shirt, tote bag over one shoulder, watchful expression, standing facing the viewer. |
| `npc_sable.svg` | A woman in her thirties, animal rights campaigner, purple-pink jacket, holding a small stack of leaflets, determined expression, standing facing the viewer. |
| `npc_ollie.svg` | An excited boy about nine years old, bright yellow t-shirt, shorts, small backpack, arms mid-gesture as if talking fast, standing facing the viewer. |
| `npc_nan.svg` | An elderly woman visitor, dusty rose cardigan, sensible shoes, handbag held in front with both hands, warm smile, slightly stooped, standing facing the viewer. |
| `npc_barry.svg` | A tall confident man in his fifties, theme park CEO, expensive navy blazer over an open-collar shirt, hands clasped behind his back, polished salesman smile that does not reach the eyes, standing facing the viewer. |

**Coral Kingdom cast**: same 128 × 192.

| Filename | SUBJECT line |
|---|---|
| `npc_priya.svg` | A woman in her late thirties, head dolphin trainer, navy wetsuit top over board shorts, whistle and stopwatch on a lanyard, hair in a tight bun, arms folded, confident and unsmiling, standing facing the viewer. |
| `npc_margo.svg` | A polished woman in her forties, corporate guest experience manager, tailored plum blazer over a park-branded blouse, tablet held against her chest, professional fixed smile, standing facing the viewer. |
| `npc_ibrahim.svg` | A dignified man in his seventies, volunteer guide, pale blue volunteer polo shirt with a name badge, wide-brimmed sun hat, walking stick in one hand, warm and unhurried, standing facing the viewer. |
| `npc_jarrah.svg` | A young man in his twenties, aquarist and diver, black wetsuit peeled to the waist with the sleeves knotted, one dive glove on and one hand bare, wet hair, grinning, standing facing the viewer. |
| `npc_dessie.svg` | A woman in her fifties, schoolteacher on an excursion, sensible green cardigan and lanyard, clipboard of permission slips under one arm, slightly harried expression, standing facing the viewer. |
| `npc_tosh.svg` | A wiry man in his thirties, aquarist, faded teal staff t-shirt, rubber apron, long waterproof gauntlets, holding a test tube up to eye level, absorbed and unbothered, standing facing the viewer. |
| `npc_sato.svg` | A woman in her forties, veterinarian, white clinical scrub top over dark trousers, stethoscope around the neck, hair tied back, exhausted but steady, standing facing the viewer. |
| `npc_corey.svg` | A solid man in his fifties, maintenance worker, grey coveralls with the sleeves rolled, tool belt, cap pushed back, one hand resting on a pipe wrench, unimpressed, standing facing the viewer. |

### Priority 2: props

| Filename | Canvas | SUBJECT line |
|---|---|---|
| `prop_palm.svg` | 128 × 256 | A single palm tree, slender curved trunk, five or six broad fronds fanning out at the top, tropical theme park planting. |
| `prop_umbrella.svg` | 128 × 256 | A large red and white parasol on a thin pole, canopy open, café shade umbrella. |
| `prop_lamp.svg` | 128 × 256 | A slim park lamp post, dark metal pole, single rounded frosted lamp head glowing warm at the top. |
| `prop_bench.svg` | 128 × 160 | A wooden park bench with a slatted seat and backrest, dark metal legs, viewed from the front. |
| `prop_bin.svg` | 128 × 144 | A cylindrical dark grey public litter bin with a swing lid and a lighter rim. |
| `prop_barrel.svg` | 128 × 144 | A blue-grey plastic feed barrel with a sealed lid and a hoop rib around the middle. |
| `prop_planter.svg` | 128 × 144 | A square timber planter box filled with bright green ornamental foliage. |
| `prop_cone.svg` | 128 × 144 | An orange traffic safety cone with a single white reflective band. |
| `prop_bush.svg` | 128 × 128 | A rounded low shrub, three overlapping clusters of dense foliage, dark green. |
| `prop_rock.svg` | 128 × 128 | A single weathered grey coastal boulder, angular faceted surfaces. |
| `prop_crate.svg` | 128 × 128 | A wooden supply crate with plank seams and a darker banding strap around the middle. |
| `prop_buoy.svg` | 128 × 128 | An orange marker buoy ring floating flat, viewed from directly above, slight water ripple around it. |
| `prop_lifering.svg` | 128 × 128 | A red and white life ring buoy lying flat on decking, rope loops around the outside. |

**Coral Kingdom props.**

| Filename | Canvas | SUBJECT line |
|---|---|---|
| `prop_mangrove.svg` | 128 × 256 | A young mangrove tree standing in shallow water, dense dark green canopy, pale arching stilt roots lifting the trunk clear of the waterline. |
| `prop_kelp.svg` | 128 × 192 | A cluster of three tall kelp fronds rising from a holdfast, broad rippled blades leaning to one side as if in current, deep blue-green. |
| `prop_coral.svg` | 128 × 160 | A branching coral display piece, rounded knobbly branches in coral pink with pale tips, sitting on a low sand base. |
| `prop_reed.svg` | 128 × 128 | A low tuft of estuary reeds, a dozen thin olive-green blades fanning up from a single point. |
| `prop_tank.svg` | 128 × 192 | A cylindrical lit display tank on a dark plinth, glowing blue-violet water column, chrome rim at the top. |
| `prop_pillar.svg` | 128 × 256 | A square concrete support pillar, plain grey, with a slightly wider base and a scuff plate at floor level. |
| `prop_pipe.svg` | 128 × 176 | Two vertical grey filtration standpipes of different heights joined by a horizontal crossover pipe, with flanged joints and a valve wheel. |
| `prop_trolley.svg` | 128 × 144 | A stainless steel feed trolley on castors, a lidded fish crate on the top shelf, a coiled hose on the lower shelf. |

### Priority 3: interactive objects

All **128 × 176**.

| Filename | SUBJECT line |
|---|---|
| `obj_sign.svg` | A wooden park information sign on a single post, blank cream board, no text or lettering of any kind. |
| `obj_station.svg` | A coiled green deck hose on a wall-mounted reel with a scrubbing brush leaning against it. |
| `obj_search.svg` | A weathered storage container that looks worth rummaging through, lid slightly ajar. |
| `obj_animal.svg` | A poolside trainer station: a stainless steel bucket of fish on a low stand beside a target pole. |
| `obj_shop.svg` | A small gift kiosk counter with a striped awning and souvenirs on the counter. |
| `obj_transit.svg` | A wall-mounted staff transit terminal, dark screen with a glowing blue map graphic, chunky buttons below. |
| `obj_observe.svg` | A viewing rail with a mounted spotting scope and a small weatherproof notes box on the post beside it. |
| `obj_talk.svg` | A low presentation podium with a microphone on a short gooseneck and a park-branded panel on the front, no text or lettering. |

### Priority 4: animal portraits

All **512 × 512**, whole animal visible, centred. These appear as the portrait in
Care Sessions, so the anatomy is the teaching payload: the listed features are not
optional detail. An `animal_<id>_portrait.svg` is also picked up if you want
separate, more detailed art for that panel.

| Filename | SUBJECT line |
|---|---|
| `animal_harbor_seal.svg` | A harbour seal (Phoca vitulina), grey mottled coat, rounded head, large dark eyes, prominent whiskers, **no external ear flaps**, hauled out resting on its belly, side-on three-quarter view. |
| `animal_california_sea_lion.svg` | A Californian sea lion (Zalophus californianus), sleek dark brown, **visible external ear flaps**, long fore-flippers propping the chest upright, hind flippers rotated forward under the body, alert upright posture. |
| `animal_sea_otter.svg` | A southern sea otter (Enhydra lutris), dense brown fur, pale face and throat, floating on its back with forepaws held up over the chest, whiskers prominent. |
| `animal_bottlenose_dolphin.svg` | An Indo-Pacific bottlenose dolphin (Tursiops aduncus), sleek grey with a paler underside, **prominent rounded melon on the forehead** and a short thick beak, tall curved dorsal fin, swimming level, side-on view. |
| `animal_green_turtle.svg` | A green sea turtle (Chelonia mydas), broad low olive-brown shell with a pattern of large flat scutes, **long flattened front flippers held out like wings**, small blunt head, swimming, three-quarter view from above and in front. |
| `animal_grey_nurse_shark.svg` | A grey nurse shark (Carcharias taurus), stocky bronze-grey body with rust-coloured spots on the rear half, **two dorsal fins of nearly equal size set well back**, ragged needle teeth visible in a slightly open mouth, hovering motionless, side-on view. |
| `animal_giant_cuttlefish.svg` | A giant Australian cuttlefish (Sepia apama), broad oval mantle with a **frilled fin running the entire length of both sides**, eight short arms and two longer tentacles held together in front, W-shaped pupil, banded red-brown and cream, side-on view. |
| `animal_port_jackson_shark.svg` | A Port Jackson shark (Heterodontus portusjacksoni), sandy brown with a **dark harness-shaped band across the head and shoulders**, blunt boxy snout, a spine at the front of each dorsal fin, resting on the bottom, side-on view. |

### Priority 5: ground tiles (optional)

All **128 × 128**. The current flat colours plus procedural detail already look
decent, so treat these as polish.

Replace the COMPOSITION paragraph in the master prompt with:
> Seamlessly tileable square ground texture. Edges must match perfectly when the tile
> is repeated in a grid. No distinct focal point, no contact shadow, subtle variation
> only, fills the entire canvas edge to edge.

`tile_grass` · `tile_path` · `tile_deck` · `tile_sand` · `tile_floor` ·
`tile_water` · `tile_fence` · `tile_wall` · `tile_door` · `tile_gate` · `tile_glass` ·
`tile_board` (boardwalk timber, planks running one way) ·
`tile_shallow` (clear ankle-deep water over pale sand) ·
`tile_hall` (polished dark indoor floor with a faint grid)

---

## Zone 4: Open Ocean (added with the zone)

Four animals, six characters, three props and three tiles. Everything else in the
zone reuses art that already exists. `barry_ocean` and `wren_ocean` need **no new
art**: they point at `npc_barry` and `npc_wren` through the `sprite:` field.

The sprite mapper (`tools/sprite-mapper.html`) already lists all of these and will
generate the rename commands once you have assigned images to them.

### Characters: 128 × 192 (ratio 1.5, same as every other character)

| File | Subject |
|---|---|
| `npc_halina.svg` | A zone manager in her forties, close-cropped hair, weathered ex-field-researcher look, park polo under an unzipped weatherproof jacket, a tablet held down at her side, tired and direct. |
| `npc_noor.svg` | A young cheerful trainer mid-stride, hijab under a park cap, carrying two feed buckets with a clipboard tucked under one arm, sleeves pushed up, permanently in a hurry. |
| `npc_dags.svg` | A heavyset maintenance man in his fifties, grubby hi-vis vest over a t-shirt, heavy toolbelt, unshaven, eyes half shut, radiating a man who has been on night shift since March. |
| `npc_vaughn.svg` | A security officer standing at parade rest, hands behind his back, neat dark uniform with epaulettes and a shoulder radio, absolutely immovable expression. |
| `npc_trixie.svg` | A woman in her sixties in a wide sun hat and a floral shirt, camera round her neck, homemade lanyard heavy with eleven stacked season passes. |
| `npc_ferris.svg` | A contractor in his thirties, band t-shirt under an open work shirt, ear defenders slung round his neck, coiling a cable around one elbow. |

### Animals: 512 × 512 (ratio 1.0, same as the other animal portraits)

The **bold** feature in each line is the diagnostic one the game teaches, and for
three of these it is also the answer to a line of the Meridian gate riddle. Get it
visibly right.

| File | Subject |
|---|---|
| `animal_orca.svg` | An orca (Orcinus orca), glossy black above and crisp white below, **white oval eye patch and grey saddle behind a tall straight upright dorsal fin**, side-on view. The fin must be upright, not folded: the game makes a point of the difference. |
| `animal_pilot_whale.svg` | A short-finned pilot whale (Globicephala macrorhynchus), uniform charcoal-black, **bulbous rounded melon forehead and a low broad swept-back dorsal fin set well forward**, short pectoral fins, side-on view. |
| `animal_common_dolphin.svg` | A common dolphin (Delphinus delphis), slender with a long slim beak, carrying the **four-panel hourglass flank pattern: dark cape on top, tan-gold panel forward, pale grey panel behind, white belly**, side-on view. |
| `animal_reef_manta.svg` | A reef manta ray (Mobula alfredi) seen from below, huge flat diamond wings, **two cephalic lobes ("horns") unrolled forward beside a wide rectangular mouth**, dark spot pattern scattered across the white belly, whip-thin tail. |

### Props

| File | Size | Subject |
|---|---|---|
| `prop_hoarding.svg` | 128 × 192 | A construction site hoarding panel, deep blue, with a faded artist's impression of a marine park printed on it and a scuffed timber batten frame along the bottom. No readable lettering. |
| `prop_mast.svg` | 128 × 256 | A tall slim stadium lighting mast, dark grey lattice pole with a small cluster of floodlights angled at the top. |
| `prop_pallet.svg` | 128 × 128 | A stack of three timber pallets, planks and corner blocks clearly visible, the top one slightly askew. |

### Tiles: 128 × 128, seamless (optional polish)

`tile_oceanwater` (deep navy show-pool water, faint surface movement) ·
`tile_terrace` (pale poured-concrete stadium seating deck with shallow expansion joints) ·
`tile_steel` (dark industrial steel chequer plate, raised diamond tread)

---

## Zone 5: The Deep (added with the zone)

Five animals, five characters, four props and four tiles. **Four returning
characters need no new art at all**: `wren_deep`, `barry_deep`, `ferris_deep` and
`vaughn_gate` point at `npc_wren`, `npc_barry`, `npc_ferris` and `npc_vaughn`
through the `sprite:` field.

Tonal note for the characters, because it is different from every other zone: The
Deep is an unfinished construction site with no guests on it. **Nobody here is
dressed for the public.** Weatherproofs, hi-vis, harnesses and steel toecaps, not
park polos and whistles. The one person in smart clothes is the auditor, and she is
wearing entirely the wrong shoes.

### Characters: 128 × 192 (ratio 1.5, same as every other character)

| File | Subject |
|---|---|
| `npc_marisol.svg` | A woman in her fifties, site manager and ex-navy salvage diver, heavy weatherproof site jacket over a fleece, steel-capped boots, a folded drawing under one arm, short greying hair, the flat unhurried stare of somebody who has seen worse. |
| `npc_toby.svg` | A young man in his mid twenties, night keeper, park polo under an unzipped hi-vis jacket, a head torch pushed up on his forehead in daylight, work gloves stuffed in a pocket, tired and cheerful at the same time. |
| `npc_sunil.svg` | A man in his forties, veterinarian, dark clinical fleece with the sleeves pushed up, stopwatch in one hand and a waterproof notebook in the other, watchful. Pointedly dry: no wetsuit, no waders, and that is the character. |
| `npc_ondine.svg` | A woman in her thirties, rope access technician, full climbing harness worn over practical work clothes, karabiners and a descender racked at the hip, helmet clipped to a shoulder strap, paint on her fingers. |
| `npc_delia.svg` | A woman in her fifties, external auditor, a good dark wool coat entirely wrong for a construction site, sensible shoes, a stiff document folder held against her chest with both hands, polite and unimpressed. |

### Animals: 512 × 512 (ratio 1.0, same as the other animal portraits)

Four of these are great whales and they are easy to confuse at a glance, so the
**bold** feature in each line is doing real work: it is the silhouette cue that
tells them apart, and students are asked to reason about each animal's body
against the size of its enclosure. Get it visibly right.

| File | Subject |
|---|---|
| `animal_blue_whale.svg` | A blue whale (Balaenoptera musculus), mottled blue-grey, **long and slender with a broad flat U-shaped head and a very small dorsal fin set far back near the tail**, pleated throat grooves running back past the flippers, swimming level, side-on. The proportions are the point: this is the largest animal that has ever lived. |
| `animal_humpback_whale.svg` | A humpback whale (Megaptera novaeangliae), dark above and white below, **enormous knobbly white pectoral fins almost a third of the body length, held out wide**, knobbly tubercles on the head and jaw, low stubby dorsal fin on a hump, three-quarter view so the fin span reads. |
| `animal_sperm_whale.svg` | A sperm whale (Physeter macrocephalus), dark wrinkled grey-brown, **a huge square block-shaped head making up a third of the body**, narrow underslung lower jaw, single blowhole offset to the front left, low rounded dorsal hump followed by a ridge of knuckles, side-on. |
| `animal_false_killer_whale.svg` | A false killer whale (Pseudorca crassidens), slender all-dark charcoal body, rounded head with **no beak at all**, tall slightly hooked dorsal fin at mid-body, and the diagnostic feature: **pectoral fins with a distinct elbow bend in the leading edge**. It must NOT read as an orca. |
| `animal_dugong.svg` | A dugong (Dugong dugon), solid grey-brown rounded body, **broad downturned bristly snout facing the seabed, no dorsal fin at all, and a whale-like fluked tail** rather than a paddle, paddle-shaped fore-flippers, grazing just above a seagrass meadow, side-on. |

### Props

| File | Size | Subject |
|---|---|---|
| `prop_gantry.svg` | 128 × 256 | A galvanised steel gantry frame, two braced uprights joined by a cross beam with a lifting eye hanging from the centre, bolted base plates, rust bleeding from the fixings. |
| `prop_netpost.svg` | 128 × 256 | A heavy galvanised net stanchion set into concrete, a taut braided rope net laced to eyelets down one side, weed and salt staining the lower third. |
| `prop_barrier.svg` | 128 × 128 | A bright orange water-filled plastic site barrier, two interlocking sections, one reflective white band, a cable-tied laminated notice hanging off the front. |
| `prop_deckplate.svg` | 128 × 96 | A flat galvanised chequer-plate deck section laid over a gap in a pontoon walkway, four countersunk bolt heads. Drawn at a low angle so it clearly reads as lying flat, not standing up. |

### Tiles: 128 × 128, seamless (optional polish)

`tile_deepwater` (very dark blue-black quarry water, almost no light returning, faint slow surface movement) ·
`tile_quarry` (cut grey stone rim, drill scars and rubble dust) ·
`tile_pontoon` (weathered timber floating walkway decking, greyed planks with dark gaps between them) ·
`tile_seagrass` (shallow blue-green water over a dense seagrass meadow, visible grazing trails)

---

## Checking your work

Load the game with `?dev` and run this in the browser console:

```js
SU.Sprites.report()
```

It lists `loaded`, `pending` and `missing`, so you can see exactly which files the
game found and which are still placeholders.

**If a sprite looks wrong, check in this order:**
1. A background rectangle was included, so the sprite renders as a coloured box.
2. The art floats above the bottom edge, so the object appears to hover.
3. The viewBox proportions do not match the intended shape, so it renders squat
   or stretched.
4. The generator wrapped the SVG in markdown fences or added prose: the file must
   start with `<svg` and nothing else.
