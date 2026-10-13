# LAB5 IDM – self-hosted GitHub Pages deployment

This is a **self-contained static export** of the uploaded `Lab5_IDM_FullProj_T1.zip` with three connected scenes, improved responsive navigation, direct scene URLs and Squarespace embed controls.

**Important technical distinction:** It needs **no PlayCanvas website, cloud account, editor, project publishing, CDN or API** to run. It **does retain the bundled open-source PlayCanvas Engine v1.77.0 file** (`playcanvas-stable.min.js`) because the existing scene JSON, 3D render assets, scripts, animations, rigidbody physics, Gaussian splat and UI are authored for this engine. Converting away from the engine itself while promising identical functionality requires a separate reimplementation and QA pass; this package does **not** claim to be an engine-free rewrite.

## Deploy to GitHub Pages

1. Create a public GitHub repository (example: `lab5-demo`). Public GitHub Pages repositories are supported on the Free plan.
2. Upload **the contents of this folder**, not the enclosing folder or original ZIP, to the root of the repository. Keep all folders, filenames and `.nojekyll`.
3. GitHub → repository → **Settings → Pages** → **Build and deployment** → **Deploy from a branch**, choose `main` and `/ (root)`, then Save.
4. Open `https://YOUR_USERNAME.github.io/lab5-demo/` (replace with your repository name). The app runs as a static website. You may also use your own domain for GitHub Pages.
5. Use the snippet in **`EMBED_IN_SQUARESPACE.html.txt`** in a Squarespace **Code Block** and replace the URL. Squarespace serves the surrounding page; the interactive app is served by GitHub Pages inside the iframe.

**No build tools or server functions are necessary.** For local preview you must use an HTTP server, not double-click `index.html` (for example, run `python -m http.server 8000` in this folder and open `http://localhost:8000/`). You can also use a VS Code Live Server extension.

## Scenes & direct links

| Route | Original scene | Contents |
| --- | --- | --- |
| `?scene=world` | TLScene1 | Fully navigable 3D environment, models, splat, character/controller, collisions, sound, signs and onward scene button |
| `?scene=panorama-1` | TLScene2 | First 360 photo with look controls and hotspot to second panorama |
| `?scene=panorama-2` | TLScene3 | Second 360 photo with return hotspot and immersive-video hotspot |

The original scene buttons remain functional. A new HTML navigation bar permits users to move between **all three** scenes directly, including a return to the 3D world. Browser Back and Forward navigation are supported.

## Controls

**Desktop, 3D World:** Click the 3D view; W/A/S/D to move; mouse to look, Space to jump, Esc to unlock pointer. **Mobile, 3D World:** Left touch zone to move, right to look, double-tap to jump. **Panoramas:** click/drag or swipe; tap interactive hotspots.

Use **?** for help, **H HUD** to toggle existing in-world panels, **⛶** for fullscreen, or **↗** to open the selected scene directly in a new tab. Mobile iframe fullscreen can be limited by the browser or Squarespace; the new-tab control avoids that limitation.

## Important missing original content

The uploaded ZIP's Scene 3 contained one outbound hotspot linking to a **different published PlayCanvas project** (`playcanv.as/p/BqeM5RUC/`), which is not included in the archive. That content **cannot be recovered from the supplied project ZIP**. The external link has been replaced by a **local video dialog** so no user is unexpectedly sent to a PlayCanvas-hosted page. To supply an immersive MP4 locally, add `media/immersive-video.mp4` and change `immersiveVideo: null` to `immersiveVideo: 'media/immersive-video.mp4'` in `lab5-config.js`. The in-world video hotspot will then play it in the app without external dependencies. This is a functional placeholder **until the video is supplied**, not a replica of the separate project.

Other *optional outbound portfolio links* to `benlum.ca` remain in the original in-scene buttons. These are ordinary website links, not runtime dependencies.

## Editing and maintenance

- Change the **label, link target and local video** in `lab5-config.js`.
- Style navigation, colors and safe areas in `lab5-shell.css`.
- Adapt additional UI functions in `lab5-shell.js`.
- Original scene data remains in `2185910.json`, `2185916.json`, `2185922.json`.
- The original engine code and scene script bundle are self-hosted. Avoid deleting `playcanvas-stable.min.js`, `__modules__.js`, `__start__.js`, `__settings__.js`, `__game-scripts.js`, `__loading__.js`, `config.json` or `files/`.
- The root `.nojekyll` file is essential because GitHub Pages otherwise ignores some filenames prefixed with underscores.
- To swap out the engine in the future, plan a separate Babylon.js/Three.js migration with gaussian splat conversion and physics/animation parity tests.

## Size and licensing

This package includes all binary source-export assets (including the large compressed bike splat and GLBs) and is intended for static hosting. Because it preloads assets, first visits can take longer on mobile data. Total uncompressed assets are under GitHub's 100 MiB per-file size cap. The bundled PlayCanvas Engine code is MIT-licensed (see `LICENSES.md`); media and models may have separate third-party ownership/licensing, so review any original source licenses before public commercial publication.

## Validation

All 3 scene JSON files, scene route targets and 77 referenced local asset paths were audited. Runtime render/play interactions still need **real-device/browser acceptance testing**, particularly WebGL rendering on iOS and Android and the scene 3 content not included in the archive. `AUDIT.md` contains the specific test checklist.
