# LAB5 project audit and browser acceptance checklist

## Source project audit

- Original archive contains 3 scenes: **TLScene1** (`2185910.json`, 175 entities), **TLScene2** (`2185916.json`, 20 entities), and **TLScene3** (`2185922.json`, 21 entities).
- 139 assets registered in `config.json`, including 7 GLB containers, 1 compressed PLY splat (276,842 Gaussians), 42 textures, 29 materials, 8 templates, 19 scripts, 1 ambient sound and 1 Ammo WASM engine.
- All **77 configured local asset URLs** exist in the archive. Scene IDs in the router map to the actual scene files.
- Scene 1 native script behaviors: first-person/character movement and jump; desktop/mobile input; physics/colliders; ambient waves/seagulls; GSplat; splash/multimedia panels; bike project external portfolio link; HTML HUD toggle; in-world `Next Scene` to TLScene2.
- Scene 2 native script behaviors: 360 photograph and look controls; clickable first hotspot into TLScene3; HUD; informational overlay; optional portfolio link.
- Scene 3 native script behaviors: 360 photo/look controls; one return hotspot into TLScene2; a second hotspot that linked to a **separately hosted project not in the ZIP**. This second hotspot now launches an optional **self-hosted MP4** dialog, or explains missing media if no file has been supplied.
- Scene 1 → 2, Scene 2 → 3 and Scene 3 → 2 original links stay connected. New top navigation adds 3 → 1 and 2 → 1, plus direct scene deep links.
- Engine v1.77.0 is bundled and served locally; no third-party JS, CSS, SDK or server required. No PlayCanvas online account/editor dependency.

## Functional regression checklist (on your published URL)

- [ ] Desktop Chromium/Edge: scene 1 loads without JS console error, scenery renders and ambient sound plays after user interaction.
- [ ] Desktop: click view, move W/A/S/D, mouse look, Space jump, Esc unlock; check collider boundaries and camera.
- [ ] Scene 1: compressed bike splat displays in its location, 3D text/boards render, character and other GLB models display, and original BikeButton opens portfolio.
- [ ] Scene 1: existing in-world Next Scene button loads Scene 2.
- [ ] Scene 2: 360 image can be rotated by dragging; hotspot loads Scene 3.
- [ ] Scene 3: 360 rotates; return hotspot loads Scene 2; video hotspot opens local dialog (or plays the configured local MP4).
- [ ] Navigation: top buttons switch to all 3 scenes, URL changes, browser Back returns to previous scene, and direct `?scene=panorama-2` loads Scene 3.
- [ ] HUD H toggle hides/shows the original in-world information panels in each scene.
- [ ] Squarespace embed: scene controls remain usable, ↗ opens full view, fullscreen works where the browser permits it.
- [ ] Android touch/mobile orientation: left move/right look, panorama swiping, touch hotspot hit targets, responsive navigation.
- [ ] iPhone Safari: panorama swipes, GSplat render performance, fullscreen fallback and audio after tap.
- [ ] Network inspector: all JS and assets load from your **GitHub Pages origin**, with no PlayCanvas API/publishing website requests during normal app operation.

**Limitations:** The custom shell and asset integrity have been statically validated, but end-to-end 3D gameplay in a real browser/device cannot be certified from a file inspection alone. The external immersive-video project is not part of the supplied source data.
