/* ============================================================
   SEA UNIVERSE: SPRITE LOADER

   Drop an SVG into /sprites and it replaces the placeholder shape
   automatically. Nothing else needs editing: no data changes, no
   registration step. If a file is missing the game falls back to
   the coloured placeholder, so you can add art one file at a time.

   NAMING (this is the whole contract):
     player.svg              the player character
     npc_<id>.svg            npc_dana.svg, npc_barry.svg …
     prop_<type>.svg         prop_palm.svg, prop_bench.svg …
     obj_<id>.svg            obj_kiosk_counter.svg   (specific)
     obj_<kind>.svg          obj_sign.svg            (fallback for a whole kind)
     animal_<id>.svg         animal_harbor_seal.svg
     tile_<id>.svg           tile_grass.svg          (optional)

   AUTHORING RULE:
     Transparent background, art sitting on the BOTTOM edge of the
     canvas, and the aspect ratio is what matters: the loader scales
     everything so its WIDTH equals one tile (or `tilesWide` tiles),
     then anchors the bottom-centre to the bottom-centre of the tile.
     A tall palm therefore stands up out of its tile and depth-sorts
     correctly, with no size data to maintain anywhere.

   SVG SIZING:
     Only the ASPECT RATIO matters. The loader measures naturalWidth and
     scales so the width equals one tile, so a 128x192 sprite and a
     32x48 sprite render identically.

     Explicit width/height on the <svg> tag is recommended but not
     required: measured behaviour is that a viewBox-only SVG reports a
     default intrinsic size that still preserves the viewBox ratio
     (a 128x192 viewBox reports 100x150), which scales correctly. Setting
     width/height simply removes any dependence on that default.

       BEST  <svg width="128" height="192" viewBox="0 0 128 192">
       OK    <svg viewBox="0 0 128 192">
       BAD   any SVG whose viewBox ratio is not the intended shape
   ============================================================ */
window.SU = window.SU || {};

SU.Sprites = (function () {
  const cache = {};
  const missing = new Set();

  /* SVG first: that is what this project ships. PNG/webp are accepted
     fallbacks so raster art can be mixed in without any code change. */
  const EXT = ['svg', 'png', 'webp'];

  function entry(name) {
    let e = cache[name];
    if (!e) {
      e = cache[name] = { img: new Image(), ready: false, failed: false, ext: 0 };
      e.img.onload = () => { e.ready = true; };
      e.img.onerror = () => {
        e.ext++;
        if (e.ext < EXT.length) e.img.src = 'sprites/' + name + '.' + EXT[e.ext];
        else { e.failed = true; missing.add(name); }
      };
      e.img.src = 'sprites/' + name + '.' + EXT[0];
    }
    return e;
  }

  /* First name that has loaded wins; null if none are available. */
  function pick(names) {
    for (let i = 0; i < names.length; i++) {
      if (!names[i]) continue;
      const e = entry(names[i]);
      if (e.ready) return e.img;
    }
    return null;
  }

  /* Draw anchored bottom-centre.
     Returns the DRAWN HEIGHT in px (truthy) so callers can place a name
     label above the actual art, or 0 if no art was found and the caller
     should fall back to its placeholder shape. */
  function draw(ctx, names, cx, bottomY, tilesWide) {
    const img = pick(Array.isArray(names) ? names : [names]);
    if (!img || !img.naturalWidth) return 0;

    const targetW = (tilesWide || 1) * SU.config.tile;
    const scale = targetW / img.naturalWidth;
    const w = targetW;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, Math.round(cx - w / 2), Math.round(bottomY - h), Math.round(w), Math.round(h));
    return h;
  }

  /* Stretch to fill exactly one tile, used for ground textures. */
  function drawTile(ctx, name, x, y, size) {
    const e = entry(name);
    if (!e.ready || !e.img.naturalWidth) return false;
    ctx.drawImage(e.img, x, y, size, size);
    return true;
  }

  /* Point a DOM <img> at the first sprite that loads, walking the same
     name/extension chain as the canvas loader. Used for dialogue
     portraits and the Care Session animal, where an <img> is simpler
     than drawing to canvas. Calls back with true/false so the caller
     can hide an empty frame. */
  function attach(imgEl, names, onDone) {
    const urls = [];
    (Array.isArray(names) ? names : [names]).forEach(n => {
      if (n) EXT.forEach(e => urls.push('sprites/' + n + '.' + e));
    });
    let i = 0;
    (function next() {
      if (i >= urls.length) { imgEl.removeAttribute('src'); if (onDone) onDone(false); return; }
      imgEl.onerror = () => { i++; next(); };
      imgEl.onload = () => { if (onDone) onDone(true); };
      imgEl.src = urls[i];
    })();
  }

  function report() {
    const keys = Object.keys(cache);
    return {
      loaded:  keys.filter(k => cache[k].ready),
      missing: Array.from(missing),
      pending: keys.filter(k => !cache[k].ready && !cache[k].failed)
    };
  }

  return { draw, drawTile, pick, attach, report };
})();
