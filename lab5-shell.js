/* LAB5 static hosting shell: scene routing, accessible HTML UI, mobile fullscreen
 * fallback, and no external PlayCanvas services. All original rendering assets,
 * scripts and scenes continue running in the bundled offline engine.
 */
(function () {
  'use strict';
  const cfg = window.LAB5_CONFIG;
  const entries = Object.entries(cfg.scenes);
  const byEngineName = Object.fromEntries(entries.map(([slug, meta]) => [meta.engineName, slug]));
  let current = window.LAB5_INITIAL_SLUG || 'world';
  let app = null;
  let changing = false;
  let statusTimeout;
  let enginePatched = false;
  let pendingHistoryMode = null;
  const topbar = document.getElementById('lab5-topbar');
  const statusEl = document.getElementById('lab5-status');
  const dialog = document.getElementById('lab5-dialog');
  const title = document.getElementById('lab5-dialog-title');
  const content = document.getElementById('lab5-dialog-content');
  const sceneButtons = [...document.querySelectorAll('[data-scene]')];
  const openLink = document.getElementById('lab5-open');
  function status(message, timeout = 2800) {
    clearTimeout(statusTimeout);
    statusEl.textContent = message;
    statusEl.classList.add('lab5-visible');
    if (timeout) statusTimeout = setTimeout(() => statusEl.classList.remove('lab5-visible'), timeout);
  }
  function updateNav(slug) {
    sceneButtons.forEach(button => button.setAttribute('aria-current', button.dataset.scene === slug ? 'page' : 'false'));
    openLink.href = '?scene=' + encodeURIComponent(slug);
    document.title = 'LAB5 | ' + cfg.scenes[slug].name;
  }
  function setRoute(slug, mode) {
    current = slug;
    updateNav(slug);
    if (mode === 'push') history.pushState({scene: slug}, '', '?scene=' + encodeURIComponent(slug));
    if (mode === 'replace') history.replaceState({scene: slug}, '', '?scene=' + encodeURIComponent(slug));
    changing = false;
    status(cfg.scenes[slug].name + ' · ' + cfg.scenes[slug].hint);
  }
  function navigate(slug, mode = 'push') {
    if (!cfg.scenes[slug] || !app || !enginePatched || changing) return;
    if (current === slug) { if (mode === 'replace') setRoute(slug,mode); return; }
    changing = true;
    status('Opening ' + cfg.scenes[slug].name + '…', 0);
    try {
      // The native scene manager handles script teardown, entity cleanup,
      // physics and asset reuse. DO NOT manually destroy the AppBase.
      pendingHistoryMode = mode;
      app.scenes.changeScene(cfg.scenes[slug].engineName, function (error) {
        if (error) {
          console.error('LAB5 scene transition failed',error);
          changing = false;
          pendingHistoryMode = null;
          status('Unable to open scene. Please reload the page.', 6000);
        }
      });
    } catch (error) {
      changing = false;
      pendingHistoryMode = null;
      console.error('LAB5 scene transition exception',error);
      status('Scene loading failed. Please reload the page.', 6000);
    }
  }
  function patchSceneManager() {
    if (!app || !app.scenes || typeof app.scenes.changeScene !== 'function' || enginePatched) return;
    const nativeChange = app.scenes.changeScene.bind(app.scenes);
    app.scenes.changeScene = function (sceneName, callback) {
      const slug = byEngineName[sceneName];
      if (slug && current !== slug) {
        changing = true;
        status('Opening ' + cfg.scenes[slug].name + '…',0);
      }
      return nativeChange(sceneName, function (err, ...rest) {
        const mode = pendingHistoryMode || 'push';
        pendingHistoryMode = null;
        if (!err && slug) setRoute(slug,mode);
        if (err) { changing = false; status('Scene could not load',6500); }
        if (typeof callback === 'function') callback(err,...rest);
      });
    };
    enginePatched = true;
  }
  function escapeHTML(input) {
    return String(input).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function showDialog(heading, html) {
    title.textContent = heading;
    content.innerHTML = html;
    if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
    else dialog.setAttribute('open','');
    // Dialog buttons remain standard HTML; the underlying 3D scene is paused
    // for pointer input by the modal browser layer.
  }
  function showHelp() {
    const controls = current === 'world' ?
      '<p><strong>Desktop:</strong> Click the 3D view to focus. Use <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> to move, drag or move the mouse to look, <kbd>Space</kbd> to jump and <kbd>Esc</kbd> to release the pointer.</p><p><strong>Mobile:</strong> Drag the left side to move and the right to look around. Double tap to jump.</p>' :
      '<p>Drag the image with your mouse or swipe with your finger to look around the full 360° location. Tap the visible hotspots to travel or interact.</p>';
    showDialog('Explore ' + cfg.scenes[current].name, controls +
      '<p><strong>Scenes:</strong> Use the navigation at the top or the original in-world hotspots and next-scene buttons.</p>' +
      '<p><strong>HUD:</strong> Press <kbd>H</kbd> or use the HUD button to hide/show the original in-scene panels.</p>' +
      '<p><strong>Fullscreen:</strong> Use ⛶. For phones or Squarespace embeds that restrict fullscreen, open ↗ in a new tab.</p>');
  }
  function showVideo() {
    const path = cfg.immersiveVideo;
    if (!path) {
      showDialog('Immersive video', '<p>The Scene 3 immersive-video hotspot originally opened <strong>a different PlayCanvas-hosted project</strong>. That separate project/video was not present in the supplied ZIP.</p><p>To make this feature local, add your video file to this repository (for example, <code>media/immersive-video.mp4</code>) and set <code>immersiveVideo</code> in <code>lab5-config.js</code> to that relative path.</p><p>The hotspot now works without contacting PlayCanvas and will show your self-hosted video when one is supplied.</p>');
      return;
    }
    // Only same-origin relative files. Avoid sending users to external hosts.
    try {
      const file = new URL(path, window.location.href);
      if (file.origin !== window.location.origin || file.pathname.includes('/../')) throw Error('Local file required');
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.src = file.href;
      if (cfg.videoPoster) video.poster = new URL(cfg.videoPoster, window.location.href).href;
      showDialog('Immersive video', '<p>Local video from this GitHub Pages site:</p>');
      content.prepend(video);
      video.addEventListener('error', () => status('Video not found. Check lab5-config.js and the media folder.',7000), {once:true});
    } catch (e) {
      showDialog('Video unavailable', '<p>Set <code>immersiveVideo</code> to a relative path hosted in this repository.</p>');
    }
  }
  function toggleSceneUI() {
    if (!app) return;
    try {
      const button = app.root.findByName('ToggleButton');
      const script = button && button.script && button.script.toggleVisibilityUI;
      if (script && script.toggleVisibility) {
        script.toggleVisibility();
        status('Scene panels toggled');
      } else {
        const nodes = app.root.findByTag('hideable');
        nodes.forEach(node => node.enabled = !node.enabled);
        status(nodes.length ? 'Scene panels toggled' : 'This scene has no toggleable panels');
      }
    } catch (e) { console.warn('LAB5 HUD toggle:',e); }
  }
  async function toggleFullScreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else status('Fullscreen unavailable here. Use ↗ to open this scene in a new tab.',6500);
    } catch (e) { status('This embed blocks fullscreen. Use ↗ to open a new tab.',6500); }
  }
  sceneButtons.forEach(button => button.addEventListener('click', () => navigate(button.dataset.scene)));
  document.getElementById('lab5-home-link').addEventListener('click', event => {event.preventDefault();navigate('world');});
  document.getElementById('lab5-help').addEventListener('click',showHelp);
  document.getElementById('lab5-fullscreen').addEventListener('click',toggleFullScreen);
  document.getElementById('lab5-hud-toggle').addEventListener('click',toggleSceneUI);
  document.getElementById('lab5-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { const video = content.querySelector('video'); if (video) video.pause(); });
  window.addEventListener('lab5:video-request',showVideo);
  window.addEventListener('popstate', () => {
    const target = new URLSearchParams(location.search).get('scene') || 'world';
    if (cfg.scenes[target]) navigate(target,'pop');
  });
  window.addEventListener('lab5:ready', event => {
    app = event.detail.app;
    patchSceneManager();
    setRoute(current,'replace');
    document.body.classList.add('lab5-ready');
    if (cfg.showHelpOnFirstVisit) showHelp();
  });
  // Image failure / initial scene errors are shown on the status bar.
  window.addEventListener('error',event => {
    if (event.message && /webgl|shader|scene/i.test(event.message)) status('This device had a 3D error. See the browser console.',7000);
  });
  updateNav(current);
}());
