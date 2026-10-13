// Edit this file without rebuilding the 3D scenes.
// Paths are relative to the website root, including GitHub Pages project subpaths.
window.LAB5_CONFIG = Object.freeze({
  scenes: {
    world:        { name: '3D World',   engineName: 'TLScene1', path: '2185910.json', hint: 'WASD to move · Mouse to look · Space to jump' },
    'panorama-1': { name: '360° One',   engineName: 'TLScene2', path: '2185916.json', hint: 'Click and drag or swipe to explore' },
    'panorama-2': { name: '360° Two',   engineName: 'TLScene3', path: '2185922.json', hint: 'Explore the two interactive hotspots' }
  },
  // Scene 3 has an immersive-video hotspot; its destination was a different
  // online project, and that project's video was NOT supplied in the ZIP.
  // Add an MP4 to your GitHub repo, e.g. media/immersive-video.mp4, then set:
  // immersiveVideo: 'media/immersive-video.mp4'
  immersiveVideo: null,
  videoPoster: null,
  // Outbound portfolio links in the original scenes still open new tabs.
  showHelpOnFirstVisit: false
});
