/* ============================================================
   SETUP
   ============================================================ */
const root = document.documentElement;
const $ = (s,el=document) => el.querySelector(s), $$ = (s,el=document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const hasG = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
const tok = n => getComputedStyle(root).getPropertyValue(n).trim();
const arrow = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
const closeIcon = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" stroke-width="1.4"/></svg>';
if (hasG) gsap.registerPlugin(ScrollTrigger);

/* Smooth scroll */
let lenis = null;
if (!reduced && typeof Lenis !== 'undefined'){
  lenis = new Lenis({ lerp:.09, smoothWheel:true });
  if (hasG){ lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0); }
  else (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
}
const goTo = hash => { const el = document.querySelector(hash); if (!el) return; lenis ? lenis.scrollTo(el, { duration:1.6 }) : el.scrollIntoView(); };
document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return; e.preventDefault(); const h = a.getAttribute('href'); if ($('#menu').open) { $('#menu').close(); setTimeout(() => goTo(h), 250); } else goTo(h); });

/* Theme */
const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;
const syncTheme = () => $('#themeBtn').textContent = isDark() ? 'Light theme' : 'Dark theme';
$('#themeBtn').addEventListener('click', () => { const n = isDark() ? 'light' : 'dark'; root.dataset.theme = n; try { localStorage.setItem('ab2-theme', n); } catch(e){} syncTheme(); });
syncTheme();

/* Menu */
$('#menuOpen').addEventListener('click', () => { $('#menu').showModal(); if (hasG && !reduced) gsap.from('.menu-links a', { yPercent:60, opacity:0, stagger:.05, duration:.9, ease:'expo.out' }); });
$('#menuClose').addEventListener('click', () => $('#menu').close());
/* The bar floats over the hero, then takes a backdrop so it never collides with text */
const syncBar = () => $('.bar').classList.toggle('solid', scrollY > 40);
addEventListener('scroll', syncBar, { passive:true }); syncBar();

/* Clocks: Bengaluru is home, Manchester is the heart */
function tick(){
  const f = tz => { try { return new Intl.DateTimeFormat('en-GB',{ timeZone:tz, hour:'2-digit', minute:'2-digit' }).format(new Date()); } catch(e){ return '--:--'; } };
  const b = f('Asia/Kolkata'), m = f('Europe/London');
  $('#tBlr').textContent = b; $('#tMcr').textContent = m; $('#tBlr2').textContent = b; $('#tMcr2').textContent = m;
}
tick(); setInterval(tick, 30000);

/* Cursor */
if (fine && !reduced){
  const c = $('#cursor'), lbl = $('#cursorLbl'); let x = innerWidth/2, y = innerHeight/2, tx = x, ty = y;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; c.classList.add('on'); });
  document.addEventListener('pointerover', e => {
    const t = e.target.closest('[data-cursor], .tile button, .bro, .mrow, .flip-stage');
    const label = t ? (t.dataset.cursor || (t.closest('.tile') ? 'Open' : t.classList.contains('bro') ? 'Read' : t.classList.contains('mrow') ? 'Open' : t.classList.contains('flip-stage') ? 'Turn' : '')) : '';
    c.classList.toggle('big', !!label); lbl.textContent = label;
  });
  (function f(){ x += (tx-x)*.2; y += (ty-y)*.2; c.style.transform = `translate3d(${x}px,${y}px,0)`; requestAnimationFrame(f); })();
}

/* ============================================================
   HERO: the name, and the bronze form behind it
   ============================================================ */
$$('.hname .row').forEach(r => { r.innerHTML = [...r.textContent].map(ch => `<span class="ch">${ch}</span>`).join(''); });
/* THE FIELD: liquid bronze silk. Layered, domain-warped noise flows slowly;
   the cursor bends and lights it, a click sends a ripple through it, scrolling dims it. */
const FIELD = { mx:.5, my:.5, tmx:.5, tmy:.5, rx:.5, ry:.5, rage:9, scroll:0, visible:true };
(function field(){
  const cv = $('#form'); if (!cv) return;
  const gl = cv.getContext('webgl', { premultipliedAlpha:false, alpha:false, antialias:false });
  if (!gl){ cv.parentElement.style.background = `radial-gradient(60% 60% at 50% 45%,${tok('--bronze-2')},${tok('--cine-bg')} 70%)`; return; }
  const vs = 'attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }';
  const fs = `
    precision highp float;
    uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform vec3 uRipple; uniform float uScroll;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3. - 2.*f);
      return mix(mix(hash(i), hash(i + vec2(1.,0.)), u.x), mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), u.x), u.y); }
    float fbm(vec2 p){ float v = 0., a = .5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6); for (int i = 0; i < 5; i++){ v += a*noise(p); p = m*p; a *= .5; } return v; }
    void main(){
      float s = min(uRes.x, uRes.y); vec2 asp = uRes / s;
      vec2 p = (gl_FragCoord.xy - .5*uRes) / s;
      vec2 m = (uMouse - .5) * asp;
      vec2 d = p - m; float near = exp(-dot(d, d) * 3.2);
      p -= d * near * .32;
      vec2 rp = (uRipple.xy - .5) * asp; float rd = length(p - rp);
      float ring = sin(rd*26. - uRipple.z*9.) * exp(-uRipple.z*1.4) * exp(-abs(rd - uRipple.z*.55)*7.);
      float t = uTime * .07;
      vec2 q = vec2(fbm(p*1.3 + t), fbm(p*1.3 + vec2(5.2, 1.3) - t));
      vec2 r = vec2(fbm(p*1.3 + 4.*q + vec2(1.7, 9.2) + t*1.3), fbm(p*1.3 + 4.*q + vec2(8.3, 2.8) - t*1.1));
      float f = fbm(p*1.3 + 4.*r + ring*.35);
      float silk = .5 + .5*sin(f*13. + t*5. + ring*2.);
      vec3 dark = vec3(.031, .025, .02), mid = vec3(.30, .19, .11), bronze = vec3(.79, .62, .43), cream = vec3(.96, .89, .77);
      vec3 col = mix(dark, mid, smoothstep(.2, .62, f));
      col = mix(col, bronze, smoothstep(.42, .78, f) * smoothstep(.3, .8, length(q)) * .95);
      col += cream * pow(silk, 12.) * smoothstep(.32, .72, f) * .7;
      col += bronze * near * .22 + cream * max(ring, 0.) * .12;
      col *= .62 + .38*smoothstep(1.5, .2, length(p*vec2(.62, 1.)));
      col *= 1. - uScroll*.55;
      gl_FragColor = vec4(col, 1.);
    }`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s)); return s; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr); gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n), uRes = U('uRes'), uTime = U('uTime'), uMouse = U('uMouse'), uRipple = U('uRipple'), uScroll = U('uScroll');
  function size(){ const r = cv.getBoundingClientRect(), k = Math.min(devicePixelRatio || 1, 1.5) * .5; cv.width = Math.max(2, Math.round(r.width*k)); cv.height = Math.max(2, Math.round(r.height*k)); gl.viewport(0, 0, cv.width, cv.height); }
  let last = performance.now();
  function draw(t){
    const dt = Math.min(.05, (t - last)/1000); last = t;
    FIELD.mx += (FIELD.tmx - FIELD.mx)*.06; FIELD.my += (FIELD.tmy - FIELD.my)*.06; FIELD.rage += dt;
    gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uTime, t/1000); gl.uniform2f(uMouse, FIELD.mx, FIELD.my);
    gl.uniform3f(uRipple, FIELD.rx, FIELD.ry, FIELD.rage); gl.uniform1f(uScroll, FIELD.scroll);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  size(); addEventListener('resize', size);
  const hero = $('.hero');
  hero.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); FIELD.tmx = (e.clientX - r.left)/r.width; FIELD.tmy = 1 - (e.clientY - r.top)/r.height; });
  hero.addEventListener('pointerdown', e => { const r = cv.getBoundingClientRect(); FIELD.rx = (e.clientX - r.left)/r.width; FIELD.ry = 1 - (e.clientY - r.top)/r.height; FIELD.rage = 0; });
  new IntersectionObserver(([en]) => FIELD.visible = en.isIntersecting).observe(cv);
  addEventListener('scroll', () => { FIELD.scroll = Math.min(1, Math.max(0, scrollY/hero.offsetHeight)); }, { passive:true });
  if (reduced){ draw(18000); return; }
  (function loop(t){ if (FIELD.visible && !document.hidden) draw(t); requestAnimationFrame(loop); })(performance.now());
})();

/* The name: letters rise, a bronze light runs through them once, then each letter leans toward the cursor */
(function nameMotion(){
  if (!hasG || reduced) return;
  const chars = $$('.hname .ch'), white = tok('--white'), bronze = tok('--bronze');
  const tl = gsap.timeline({ delay:.15 });
  tl.from(chars, { yPercent:110, rotate:6, duration:1.6, ease:'expo.out', stagger:.04 })
    .to(chars, { color:bronze, duration:.3, ease:'power1.out', stagger:.045 }, 1.2)
    .to(chars, { color:white, duration:.7, ease:'power1.inOut', stagger:.045 }, 1.5);
  gsap.from('#heroForm', { scale:1.12, opacity:0, duration:2.4, ease:'expo.out' });
  gsap.from('.hero-meta > *', { y:24, opacity:0, duration:1.2, ease:'expo.out', stagger:.08, delay:.6 });
  gsap.to('.hname .l1', { xPercent:-14, ease:'none', scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true } });
  gsap.to('.hname .l2', { xPercent:14, ease:'none', scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true } });
  gsap.to('#heroForm', { yPercent:18, ease:'none', scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true } });
  if (!fine) return;
  let ready = false; tl.eventCallback('onComplete', () => ready = true);
  const hero = $('.hero');
  hero.addEventListener('pointermove', e => {
    if (!ready) return;
    chars.forEach(ch => {
      const r = ch.getBoundingClientRect(), dx = e.clientX - (r.left + r.width/2), dy = e.clientY - (r.top + r.height/2);
      const pull = Math.max(0, 1 - Math.hypot(dx, dy)/260);
      gsap.to(ch, { y:-pull*pull*34, rotate:-dx/260*pull*10, duration:.7, ease:'expo.out', overwrite:'auto' });
    });
  });
  hero.addEventListener('pointerleave', () => gsap.to(chars, { y:0, rotate:0, duration:1.2, ease:'expo.out', overwrite:'auto' }));
})();

/* Statement: words settle as they enter; each drawn mark plays once in view and again on hover */
(function statement(){
  const p = $('#stText'); if (!p) return;
  [...p.childNodes].forEach(n => { if (n.nodeType !== 3) return; const f = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) f.append(' '); else { const s = document.createElement('span'); s.className = 'w'; s.textContent = w; f.append(s); } }); n.replaceWith(f); });
  if (hasG && !reduced) gsap.fromTo('#stText .w, #stText .glyph', { opacity:.12, y:18 }, { opacity:1, y:0, stagger:.03, ease:'none', scrollTrigger:{ trigger:p, start:'top 80%', end:'bottom 55%', scrub:true } });
  const glyphs = $$('.glyph', p);
  if (reduced){ glyphs.forEach(g => g.classList.add('play')); return; }
  const io = new IntersectionObserver(ens => ens.forEach(en => { if (en.isIntersecting){ setTimeout(() => en.target.classList.add('play'), 250); io.unobserve(en.target); } }), { threshold:1 });
  glyphs.forEach(g => { io.observe(g); g.addEventListener('pointerenter', () => { g.classList.remove('play'); requestAnimationFrame(() => requestAnimationFrame(() => g.classList.add('play'))); }); });
})();

/* ============================================================
   SIX SIGNALS FLY-THROUGH (CSS 3D)
   ============================================================ */
(function fly(){
  const world = $('#world'), stage = $('#flyStage'); if (!world) return;
  const order = SIGNALS.map(r => r.id), total = String(SIGNALS.length).padStart(2,'0');
  const planes = PLANES.slice().sort((a,b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  $('#flyDots').innerHTML = SIGNALS.map(() => '<i></i>').join('');
  const els = planes.map((p,i) => {
    const f = document.createElement('figure'); f.className = 'plane'; f.dataset.d = p[0];
    if (p[1] === 'card') f.innerHTML = `<div class="card" style="width:300px"><small>${SIGNALS.find(r => r.id === p[0]).label}</small><b>${p[2]}</b><p>${p[3]}</p><span class="bar2"></span></div>`;
    else f.innerHTML = `<img src="${p[1]}" alt="${p[2]}" loading="lazy" style="width:${Math.round(260*p[3])}px"><figcaption>${p[2]}</figcaption>`;
    world.append(f);
    const side = i % 2 ? 1 : -1, rnd = Math.sin(i*12.9898)*43758.5453 % 1;
    return { el:f, d:p[0], x:side*(.26 + Math.abs(rnd)*.16), y:(Math.cos(i*4.1))*.3, z:-(i*520 + 500) };
  });
  const depth = els.length*520 + 900;
  let mx = 0, my = 0, tmx = 0, tmy = 0, prog = 0, current = -2, labelTl = null;
  if (fine) stage.addEventListener('pointermove', e => { tmx = e.clientX/innerWidth - .5; tmy = e.clientY/innerHeight - .5; });
  function setLabel(k){
    if (k === current) return; current = k;
    const r = k < 0 ? { label:'Six signals', line:'Scroll to fly through the work.' } : SIGNALS[k];
    const apply = () => { $('#flyTitle').textContent = r.label; $('#flyP').textContent = r.line; $('#flyK').textContent = k < 0 ? 'Range is the point' : `Signal ${String(k+1).padStart(2,'0')}`; };
    if (hasG && !reduced){ labelTl && labelTl.kill(); labelTl = gsap.timeline().to('.fly-label', { opacity:0, y:-14, duration:.25 }).add(apply).fromTo('.fly-label', { opacity:0, y:14 }, { opacity:1, y:0, duration:.6, ease:'expo.out' }); }
    else apply();
    $('#flyCount').textContent = `${String(Math.max(0,k+1)).padStart(2,'0')} / ${total}`;
    $$('#flyDots i').forEach((d,j) => d.classList.toggle('on', j <= k));
  }
  function render(){
    mx += (tmx - mx)*.06; my += (tmy - my)*.06;
    const W = innerWidth, H = innerHeight, cam = prog*depth;
    world.style.transform = `rotateY(${mx*7}deg) rotateX(${-my*5}deg)`;
    let near = -1, nearZ = -1e9;
    els.forEach((p,i) => {
      const zz = p.z + cam;
      const o = Math.max(0, Math.min(1, (zz + 2700)/1100)) * Math.max(0, Math.min(1, (900 - zz)/300));
      p.el.style.opacity = o.toFixed(3);
      p.el.style.visibility = o < .01 ? 'hidden' : 'visible';
      p.el.style.transform = `translate(-50%,-50%) translate3d(${(p.x*W).toFixed(1)}px,${(p.y*H).toFixed(1)}px,${zz.toFixed(1)}px)`;
      if (zz < 500 && zz > nearZ){ nearZ = zz; near = i; }
    });
    setLabel(prog < .03 ? -1 : near >= 0 ? order.indexOf(els[near].d) : current);
  }
  if (reduced){
    world.style.cssText = 'position:relative; display:flex; flex-wrap:wrap; gap:20px; justify-content:center; padding:120px var(--gutter) 60px';
    els.forEach(p => { p.el.style.cssText = 'position:relative; left:auto; top:auto; margin:0'; });
    $('.fly-hud').style.cssText = 'position:relative; padding-top:80px'; setLabel(-1);
    return;
  }
  if (hasG) ScrollTrigger.create({ trigger:'#signals', start:'top top', end:'bottom bottom', scrub:true, onUpdate:s => prog = s.progress });
  else addEventListener('scroll', () => { const r = $('#signals').getBoundingClientRect(); prog = Math.max(0, Math.min(1, -r.top/(r.height - innerHeight))); }, { passive:true });
  let vis = false; new IntersectionObserver(([en]) => vis = en.isIntersecting).observe($('#signals'));
  render();
  (function loop(){ if (vis) render(); requestAnimationFrame(loop); })();
})();

/* ============================================================
   FUNNEL: a wire funnel. Sand falls from the top rim and thins at
   every stage; past the "acted" rim the few grains left turn bronze.
   Geometry is in the SVG's 1000 x 640 units.
   ============================================================ */
(function funnel(){
  const fig = $('#wfunnel'), cv = $('#wfSand'); if (!fig || !cv) return;
  const ctx = cv.getContext('2d');
  const RIMS = [[96,260],[226,200],[366,124],[506,60],[596,26]];  /* [y, radius] */
  const KEEP = [1, .78, .55, .3, .55];                              /* chance a grain survives each rim */
  const radius = y => {
    if (y <= RIMS[0][0]) return RIMS[0][1];
    for (let i = 1; i < RIMS.length; i++){
      const [y0,r0] = RIMS[i-1], [y1,r1] = RIMS[i];
      if (y <= y1){ const t = (y - y0)/(y1 - y0), e = t*t*(3 - 2*t); return r0 + (r1 - r0)*e; }
    }
    return RIMS[RIMS.length-1][1];
  };
  let ink = tok('--ink'), bronze = tok('--bronze'), k = 1, grains = [], visible = true;
  const recolour = () => requestAnimationFrame(() => { ink = tok('--ink'); bronze = tok('--bronze'); });
  $('#themeBtn').addEventListener('click', recolour);
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', recolour);
  function size(){ const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 1.5); cv.width = Math.max(2, r.width*d); cv.height = Math.max(2, r.height*d); k = cv.width/1000; }
  function spawn(){
    const a = Math.random()*Math.PI*2, m = Math.sqrt(Math.random());
    grains.push({ u:Math.cos(a)*m*.96, y:96 + Math.sin(a)*m*40, vy:.7 + Math.random()*.9, s:.9 + Math.random()*1.5, rim:0, alive:1, tw:Math.random()*6.28 });
  }
  function step(dt){
    if (grains.length < 900) for (let i = 0; i < 5; i++) spawn();
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (let i = grains.length - 1; i >= 0; i--){
      const g = grains[i];
      g.y += g.vy*dt; g.vy = Math.min(g.vy + .006*dt, 2.6);
      g.u += (Math.random() - .5)*.012*dt; g.u = Math.max(-.97, Math.min(.97, g.u));
      while (g.rim < RIMS.length - 1 && g.y > RIMS[g.rim + 1][0]){ g.rim++; if (g.alive === 1 && Math.random() > KEEP[g.rim]) g.alive = .99; }
      if (g.alive < 1) g.alive -= .035*dt;
      if (g.alive <= 0 || g.y > 640){ grains.splice(i, 1); continue; }
      const x = 500 + g.u*radius(g.y), hot = g.rim >= 3;
      ctx.globalAlpha = Math.max(0, g.alive) * (.45 + .4*Math.sin(g.tw += .05*dt)) * (hot ? 1 : .9);
      ctx.fillStyle = hot ? bronze : ink;
      ctx.beginPath(); ctx.arc(x*k, g.y*k, g.s*k*1.6, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  size(); addEventListener('resize', size); new ResizeObserver(size).observe(cv);
  if (reduced){ for (let i = 0; i < 400; i++){ spawn(); grains[i].y = 96 + Math.random()*500; } step(0); return; }
  new IntersectionObserver(([en]) => visible = en.isIntersecting).observe(fig);
  let last = performance.now();
  (function loop(t){ const dt = Math.min(3, (t - last)/16.7); last = t; if (visible && !document.hidden) step(dt); requestAnimationFrame(loop); })(last);
  if (hasG) gsap.from('.wf-stages li, .wf-notes li', { opacity:0, y:16, duration:1, ease:'expo.out', stagger:.12, scrollTrigger:{ trigger:fig, start:'top 75%', once:true } });
})();

/* ============================================================
   CHAPTERS
   ============================================================ */
const BRO = id => BROCHURES.find(b => b.id === id);
const SUITE = BROCHURES.filter(b => !b.hidden);
$('#fan').innerHTML = SUITE.map((b,i) => `<button class="bro" type="button" data-flip="${b.id}" style="--i:${i}; --r:${(i-3.5)*3.5}deg; --dy:${Math.abs(i-3.5)*12}px; z-index:${i+1}" aria-label="Turn the pages of ${b.title}"><img src="${b.cover}" alt="" loading="lazy"><span>${b.title}</span></button>`).join('');
$('#broPicks').innerHTML = SUITE.map(b => `<button type="button" data-flip="${b.id}">${b.title}<small>${b.kind === 'trifold' ? 'Tri-fold' : b.n + ' pp'}</small></button>`).join('');
const FEED = [["img/meta-awareness-1.jpg","Awareness · cold"],["img/meta-awareness-2.jpg","Awareness · cold"],["img/meta-retargeting.jpg","Retargeting · warm"],["img/meta-awareness-3.jpg","Awareness · cold"],["img/meta-leadgen.jpg","Lead gen · high intent"]];
$('#feed').innerHTML = FEED.map(f => `<article class="post"><header><i></i><div>Novel Office<small>Sponsored</small></div></header><img src="${f[0]}" alt="" loading="lazy"><footer><span>${f[1]}</span><span>Learn more</span></footer></article>`).join('');

if (hasG && !reduced){
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px) and (min-height: 761px)', () => {
    const tl = ch => gsap.timeline({ scrollTrigger:{ trigger:`[data-ch="${ch}"]`, start:'top top', end:'bottom bottom', scrub:1 } });
    $$('.chapter').forEach(sec => gsap.from($('.ch-text', sec).children, { y:60, opacity:0, stagger:.08, duration:1.2, ease:'expo.out', scrollTrigger:{ trigger:sec, start:'top 60%', once:true } }));
    tl('orra').fromTo('.v-orra .c1', { yPercent:40 }, { yPercent:-18, ease:'none' }, 0).fromTo('.v-orra .c2', { yPercent:-30 }, { yPercent:22, ease:'none' }, 0).fromTo('.v-orra .c3', { yPercent:55 }, { yPercent:-28, ease:'none' }, 0);
    tl('cockpit').fromTo('.v-cockpit .screen', { rotateX:52, rotateZ:-8, scale:.72, y:80 }, { rotateX:0, rotateZ:0, scale:1, y:0, ease:'power2.out' }, 0)
      .fromTo('.v-cockpit .verdicts span', { y:30, opacity:0 }, { y:0, opacity:1, stagger:.08, ease:'power2.out' }, .45);
    tl('collateral').fromTo('.fan .bro', { left:'28%', top:'20%', rotate:i => (i%2 ? 3 : -3) }, { left:i => `${i*7.4}%`, top:i => `calc(12% + ${Math.abs(i-3.5)*12}px)`, rotate:i => (i-3.5)*3.5, ease:'power2.inOut', stagger:.03 }, 0);
    tl('nsh').fromTo('.v-nsh .hero-cell', { scale:2.3 }, { scale:1, ease:'power2.inOut' }, 0).fromTo('.v-nsh .cell:not(.hero-cell)', { opacity:.15, scale:.88 }, { opacity:1, scale:1, stagger:.05, ease:'power2.out' }, .25);
    tl('paid').fromTo('.paid-figs div', { x:40, opacity:.2 }, { x:0, opacity:1, stagger:.15, ease:'power2.out' }, 0);
  });
}
/* The feed scrolls inside the phone as the chapter passes, pinned or not. Scrolling the phone by hand takes over for a moment. */
(function feedScroll(){
  const fs = $('#feedScreen'); if (!fs || !hasG || reduced) return;
  let manual = 0; const mark = () => manual = Date.now();
  ['wheel','touchmove','keydown'].forEach(ev => fs.addEventListener(ev, mark, { passive:true }));
  ScrollTrigger.create({ trigger:'[data-ch="paid"]', start:'top 75%', end:'bottom 25%', onUpdate:s => { if (Date.now() - manual < 1500) return; fs.scrollTop = s.progress * (fs.scrollHeight - fs.clientHeight); } });
})();

/* Workshop tilt */
if (fine && !reduced) $$('.tool').forEach(t => {
  t.addEventListener('pointermove', e => { const r = t.getBoundingClientRect(), x = (e.clientX - r.left)/r.width - .5, y = (e.clientY - r.top)/r.height - .5; t.style.transform = `perspective(1200px) rotateY(${x*5}deg) rotateX(${-y*4}deg)`; });
  t.addEventListener('pointerleave', () => t.style.transform = '');
});

/* ============================================================
   ARCHIVE: infinite drag canvas. Brochures open as flipbooks.
   ============================================================ */
(function archive(){
  const box = $('#archive'), layer = $('#tiles');
  const cats = [['all','All'],['brochures','Brochures'],['renders','Renders'],['ads','Ad creatives']];
  $('#archTabs').innerHTML = cats.map((c,i) => `<button type="button" aria-pressed="${i===0}" data-c="${c[0]}">${c[1]}</button>`).join('');
  let items = ARCHIVE.map((a,i) => ({ a, i })), tiles = [], cw = 300, cols = 0, rows = 0, W = 0, H = 0;
  let ox = 0, oy = 0, tx = 0, ty = 0, vx = 0, vy = 0, drag = null, moved = 0, touched = false;
  function build(){
    const vw = box.clientWidth, vh = box.clientHeight;
    cw = vw < 700 ? 200 : 300; const ch = cw*1.05;
    cols = Math.ceil(vw/cw) + 2; rows = Math.ceil(vh/ch) + 2; W = cols*cw; H = rows*ch;
    layer.innerHTML = ''; tiles = [];
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
      const it = items[(r*cols + c + r*3) % items.length], el = document.createElement('div'); el.className = 'tile'; el.style.setProperty('--cw', cw + 'px');
      el.innerHTML = `<button type="button" data-k="${it.i}"><img src="${it.a[0]}" alt="${it.a[1]}" style="--ar:${it.a[3]}" draggable="false" loading="lazy"><span>${it.a[1]}</span></button>`;
      layer.append(el); tiles.push({ el, bx:c*cw + (r%2 ? cw*.5 : 0), by:r*ch + (c%2 ? ch*.18 : 0) });
    }
    place();
  }
  function place(){ tiles.forEach(t => { const x = ((t.bx + ox) % W + W) % W - cw, y = ((t.by + oy) % H + H) % H - cw*1.05; t.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`; }); }
  box.addEventListener('pointerdown', e => { if (e.button !== 0) return; drag = { x:e.clientX, y:e.clientY, t:e.pointerType }; moved = 0; vx = vy = 0; touched = true; });
  addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = drag.t === 'touch' ? 0 : e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; moved += Math.abs(dx) + Math.abs(dy); tx += dx; ty += dy; vx = dx; vy = dy; if (moved > 6) box.classList.add('dragging'); });
  addEventListener('pointerup', () => { if (!drag) return; drag = null; box.classList.remove('dragging'); });
  box.addEventListener('click', e => { const b = e.target.closest('.tile button'); if (!b || moved > 6) return; const a = ARCHIVE[+b.dataset.k]; if (a[4]) openFlip(a[4]); else openImage(+b.dataset.k, items.filter(x => !x.a[4]).map(x => x.i)); });
  box.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)){ e.preventDefault(); tx -= e.deltaX; touched = true; } }, { passive:false });
  box.addEventListener('keydown', e => { const k = { ArrowLeft:[120,0], ArrowRight:[-120,0], ArrowUp:[0,120], ArrowDown:[0,-120] }[e.key]; if (k && e.target.closest('.tile')){ tx += k[0]; ty += k[1]; touched = true; } });
  $('#archTabs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#archTabs button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    items = ARCHIVE.map((a,i) => ({ a, i })).filter(x => b.dataset.c === 'all' || x.a[2] === b.dataset.c); build(); });
  let vis = false; new IntersectionObserver(([en]) => vis = en.isIntersecting).observe(box);
  build(); addEventListener('resize', build);
  (function loop(){
    if (vis){
      if (!drag){ vx *= .94; vy *= .94; tx += vx; ty += vy; if (!reduced && !touched) tx -= .25; }
      ox += (tx - ox)*.12; oy += (ty - oy)*.12; place();
    }
    requestAnimationFrame(loop);
  })();
})();
$('#emails').innerHTML = EMAILS.map((e,i) => `<li><button type="button" data-email="${i}">${e[0]} ${arrow}</button></li>`).join('');

/* WanderWitty */
$('#posts').innerHTML = POSTS.map(p => `<li><a href="${p[2]}" target="_blank" rel="noopener" data-cursor="Read"><b>${p[0]}</b>${arrow}<span class="mono">WanderWitty · ${p[1]}</span></a></li>`).join('');
/* Live crops: a real page rendered at its own width, scaled down and cropped to its top section */
function initCrops(scope){
  $$('.live-crop', scope).forEach(box => {
    if (box.dataset.ready) return; box.dataset.ready = 1;
    const ifr = $('iframe', box), w = +box.dataset.w, h = +box.dataset.h;
    box.style.setProperty('--cw', w); box.style.setProperty('--ch', h);
    const fit = () => { const s = box.clientWidth / w; ifr.style.width = w + 'px'; ifr.style.height = h + 'px'; ifr.style.transform = `scale(${s})`; };
    new ResizeObserver(fit).observe(box); addEventListener('resize', fit); addEventListener('load', fit); fit();
    ifr.src = box.dataset.src;
  });
}
initCrops(document);
/* Phones on the page (the Lifecycle chapter): the email renders at iPhone width and scrolls inside the screen */
$$('iframe[data-device]').forEach(ifr => { const screen = ifr.parentElement, w = +ifr.dataset.device; const fit = () => fitDevice(screen, ifr, w); new ResizeObserver(fit).observe(screen); addEventListener('resize', fit); addEventListener('load', fit); fit(); });
$('#elsewhere').innerHTML = ELSEWHERE.map(a => `<li><a href="${a[2]}" target="_blank" rel="noopener" data-cursor="Read"><div><b>${a[0]}</b><div class="mono" style="margin-top:4px">${a[1]}</div></div>${arrow}</a></li>`).join('');

/* ============================================================
   CONTACT
   ============================================================ */
const mv = $('#mcrVideo');
new IntersectionObserver(([en]) => { if (en.isIntersecting && !reduced) { mv.preload = 'auto'; mv.play().then(() => $('.contact .poster').style.opacity = 0).catch(() => {}); } else mv.pause(); }, { threshold:.15 }).observe($('#contact'));
/* Neon sign: letters flicker on in their own time when the footer arrives; hovering flicks the switch again */
(function neon(){
  const h = $('#cTitle'); if (!h) return;
  h.innerHTML = h.textContent.split(' ').map(w => `<span class="word" aria-hidden="true">${[...w].map(ch => `<span class="ltr">${ch}</span>`).join('')}</span>`).join(' ');
  const ltrs = $$('.ltr', h);
  const light = () => { ltrs.forEach(l => l.style.setProperty('--d', (Math.random()*.9).toFixed(2) + 's')); h.classList.remove('on'); void h.offsetWidth; h.classList.add('on'); };
  if (reduced){ h.classList.add('on'); ltrs.forEach(l => l.style.setProperty('--d','0s')); return; }
  new IntersectionObserver(([en], io) => { if (en.isIntersecting){ light(); io.disconnect(); } }, { threshold:.6 }).observe(h);
  let last = 0; h.addEventListener('pointerenter', () => { if (Date.now() - last > 1800){ last = Date.now(); light(); } });
})();
$('#copyMail').addEventListener('click', e => {
  const btn = e.currentTarget, txt = $('#mailLink').textContent;
  const done = ok => { btn.textContent = ok ? 'Copied' : 'Selected, press Ctrl+C'; setTimeout(() => btn.textContent = 'Copy email', 2200); };
  const fb = () => { const r = document.createRange(); r.selectNodeContents($('#mailLink')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); done(false); };
  try { navigator.clipboard.writeText(txt).then(() => done(true), fb); } catch(err){ fb(); }
});

/* ============================================================
   DRAWER: one side panel for case studies, live tools, emails, pages, brochures and images
   ============================================================ */
const dlg = $('#drawer'), body = $('#drawerBody');
let lastFocus = null;
function openDrawer(kind, width){
  Flipbook.destroy(); mailRO && mailRO.disconnect();
  dlg.style.setProperty('--dw', width + 'px');
  $('#drawerKind').textContent = kind;
  body.className = 'd-body'; body.scrollTop = 0;
  if (!dlg.open){ lastFocus = document.activeElement; lenis && lenis.stop(); dlg.showModal(); }
}
function frame(src, title, kind, width){
  openDrawer(kind, width);
  body.classList.add('frame');
  body.innerHTML = `<span class="mono d-loading">Loading ${title}</span><iframe title="${title}" src="${src}"></iframe><h2 id="drawerTitle" class="sr">${title}</h2>`;
  $('iframe', body).addEventListener('load', () => { const l = $('.d-loading', body); l && l.remove(); });
}
function openCase(id){
  const c = CASES[id]; if (!c) return;
  if (c.full) return frame(c.full, c.title, 'Case study · ' + c.type, 1280);
  openDrawer(c.type, 820);
  const panels = (c.panels||[]).map(p => `<button class="arrowlink" type="button" data-${p[1]}="${p[2]}"${p[3] ? ` data-title="${p[3]}"` : ''}>${p[0]} ${arrow}</button>`);
  const abs = (c.abs||[]).map(l => `<a class="arrowlink" href="${l[1]}" target="_blank" rel="noopener">${l[0]} ${arrow}</a>`);
  body.innerHTML = `<div class="case-in">
    <h2 id="drawerTitle">${c.title}</h2>
    <p class="prob">${c.problem}</p>
    ${c.disc ? `<p class="disc">${c.disc}</p>` : ''}
    <div class="body"><h4>The work</h4>${c.body.map(p => `<p>${p}</p>`).join('')}</div>
    ${c.steps ? `<div><h4>${c.stepsTitle || 'How it works'}</h4><ol class="steps">${c.steps.map(s => `<li>${s}</li>`).join('')}</ol></div>` : ''}
    ${c.figs ? `<dl class="cfigs">${c.figs.map(f => `<div><dt>${f[1]}</dt><dd>${f[0]}</dd></div>`).join('')}</dl>` : ''}
    ${c.brochures ? `<div><h4>Turn the pages</h4><div class="bro-picks">${SUITE.map(b => `<button type="button" data-flip="${b.id}">${b.title}<small>${b.kind === 'trifold' ? 'Tri-fold' : b.n + ' pp'}</small></button>`).join('')}</div></div>` : ''}
    ${c.emails ? `<div><h4>Read the emails</h4><div class="bro-picks">${EMAILS.map((e,i) => `<button type="button" data-email="${i}">${e[0]}</button>`).join('')}</div></div>` : ''}
    ${c.gal ? `<div class="cgal">${c.gal.map(g => `<img src="${g[0]}" alt="" style="--ar:${g[1]}" loading="lazy">`).join('')}</div>` : ''}
    ${c.wide ? (c.wide.startsWith('live:') ? (([src, w, h]) => `<div class="cwide"><span class="live-crop" data-src="${src}" data-w="${w}" data-h="${h}"><iframe title="" tabindex="-1" aria-hidden="true"></iframe></span></div>`)(c.wide.slice(5).split('|')) : `<div class="cwide"><img src="${c.wide}" alt="" loading="lazy"></div>`) : ''}
    ${c.chips ? `<ul class="chips">${c.chips.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}
    ${panels.length || abs.length ? `<div class="clinks">${panels.join('')}${abs.join('')}</div>` : ''}
  </div>`;
  initCrops(body);
}
function openTool(id){ const t = TOOLS[id]; if (t) frame(t.src, t.title, 'Live tool · ' + t.title, t.width); }
/* A device screen shows a page at its real width (390 for iPhone, 1180 for iPad), scaled to fit the frame */
function fitDevice(screen, iframe, baseW){
  const s = screen.clientWidth / baseW;
  iframe.style.width = baseW + 'px'; iframe.style.height = (screen.clientHeight / s) + 'px'; iframe.style.transform = `scale(${s})`;
}
let mailRO = null;
function openEmail(i){
  const e = EMAILS[i]; if (!e) return;
  openDrawer('Lifecycle email · shown on an iPhone', 640);
  body.classList.add('frame');
  body.innerHTML = `<div class="mail-view">
    <div class="bro-picks" role="group" aria-label="Choose an email">${EMAILS.map((m,j) => `<button type="button" data-email="${j}" aria-pressed="${j === i}">${m[0]}</button>`).join('')}</div>
    <div class="mail-stage"><div class="iphone"><div class="screen" style="overflow:hidden"><iframe title="${e[0]} email" src="${e[1]}"></iframe></div></div></div>
    <h2 id="drawerTitle" class="sr">${e[0]} email</h2>
  </div>`;
  const stage = $('.mail-stage', body), phone = $('.iphone', body), screen = $('.screen', body), ifr = $('iframe', body);
  const fit = () => { const pw = Math.min(stage.clientWidth * .92, (stage.clientHeight - 8) * 9 / 19.5, 400); phone.style.setProperty('--pw', pw + 'px'); requestAnimationFrame(() => fitDevice(screen, ifr, 390)); fitDevice(screen, ifr, 390); };
  mailRO && mailRO.disconnect(); mailRO = new ResizeObserver(fit); mailRO.observe(stage); fit();
}
function openPage(src, title){ frame(src, title, title, 1180); }
function openFlip(id){
  const b = BRO(id); if (!b) return;
  openDrawer('Brochure · ' + b.type, 1240);
  body.classList.add('frame');
  Flipbook.mount(body, b);
}
let imgList = [], imgPos = 0;
function openImage(k, list){ imgList = list; imgPos = Math.max(0, list.indexOf(k)); openDrawer('Archive', 1100); showImage(); }
function showImage(){
  const a = ARCHIVE[imgList[imgPos]];
  body.innerHTML = `<div class="case-in"><h2 id="drawerTitle" style="font-size:clamp(1.6rem,3vw,2.4rem)">${a[1]}</h2><img src="${a[0]}" alt="${a[1]}" style="width:100%;height:auto;border-radius:6px"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><button class="x nav" type="button" data-img="-1" aria-label="Previous image"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></button><span class="mono">${imgPos+1} / ${imgList.length}</span><button class="x nav" type="button" data-img="1" aria-label="Next image"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></button></div></div>`;
}
dlg.addEventListener('keydown', e => { if ($('[data-img]', body) && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')){ imgPos = (imgPos + (e.key === 'ArrowRight' ? 1 : -1) + imgList.length) % imgList.length; showImage(); } });
/* Cleanup runs at once when the panel closes, and again (harmlessly) on the native close event, which Esc also fires */
function cleanupDrawer(){ Flipbook.destroy(); mailRO && mailRO.disconnect(); body.innerHTML = ''; lenis && lenis.start(); if (lastFocus && lastFocus.focus){ lastFocus.focus({ preventScroll:true }); lastFocus = null; } }
function closeDrawer(){ if (dlg.open) dlg.close(); cleanupDrawer(); }
$('#drawerClose').addEventListener('click', closeDrawer);
dlg.addEventListener('click', e => { if (e.target === dlg) closeDrawer(); });
dlg.addEventListener('close', cleanupDrawer);
dlg.addEventListener('cancel', cleanupDrawer);

/* One click handler routes every panel trigger on the page, including ones inside the drawer */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-case],[data-tool],[data-email],[data-flip],[data-page],[data-img]'); if (!t) return;
  if (t.dataset.case) openCase(t.dataset.case);
  else if (t.dataset.tool) openTool(t.dataset.tool);
  else if (t.dataset.email) openEmail(+t.dataset.email);
  else if (t.dataset.flip) openFlip(t.dataset.flip);
  else if (t.dataset.page) openPage(t.dataset.page, t.dataset.title || 'Page');
  else if (t.dataset.img && t.closest('#drawer')){ imgPos = (imgPos + +t.dataset.img + imgList.length) % imgList.length; showImage(); }
});

addEventListener('load', () => hasG && ScrollTrigger.refresh());
