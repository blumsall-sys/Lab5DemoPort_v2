pc.script.createLoadingScreen((app) => {
  const div = document.createElement('div');
  div.setAttribute('aria-label','Loading interactive environment');
  div.setAttribute('role','status');
  Object.assign(div.style, { position:'absolute', zIndex:'69', inset:'0',
    background:'linear-gradient(135deg,#0c1922,#244351)',display:'flex',
    justifyContent:'center',alignItems:'center',color:'#faf6e4',fontFamily:'system-ui,sans-serif' });
  const card = document.createElement('div');
  Object.assign(card.style,{textAlign:'center',width:'min(310px,78vw)'});
  card.innerHTML = '<div style="font-size:32px;font-weight:900;letter-spacing:.24em;margin-bottom:8px">LAB5</div>' +
    '<div style="color:#c5cdd0;font-size:11px;letter-spacing:.19em;margin-bottom:22px">INTERACTIVE EXPERIENCE</div>' +
    '<div style="width:100%;height:6px;background:rgba(255,255,255,.19);border-radius:10px;overflow:hidden"><div id="lab5-progress" style="height:100%;width:0;background:#e6c75a;transition:width .18s"></div></div>' +
    '<div id="lab5-percent" style="padding-top:13px;color:#c7d6da;font-size:12px">Preparing the experience…</div>';
  div.appendChild(card);
  document.body.appendChild(div);
  const progress = card.querySelector('#lab5-progress');
  const pct = card.querySelector('#lab5-percent');
  app.on('preload:progress', v => { progress.style.width=Math.round(100*v)+'%';pct.textContent='Loading local assets · '+Math.round(100*v)+'%'; });
  app.once('preload:end',()=>app.off('preload:progress'));
  app.once('start',()=>{ div.remove(); });
});
