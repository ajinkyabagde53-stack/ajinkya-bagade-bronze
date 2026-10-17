/* ============================================================
   FLIPBOOK. Renders a brochure inside the side panel.
   book:    leaves hinge on the spine. Cover sits alone on the right, then spreads.
            Narrow screens show one page at a time.
   trifold: outside sheet O1|O2|O3 (cover is O3), inside sheet I1|I2|I3.
            closed shows the cover; the cover swings open, then the flap unfolds,
            then the whole sheet turns over to show the outside.
   ============================================================ */
window.Flipbook = (function(){
  const pageSrc = (b,i) => `brochures/pages/${b.id}/${String(i).padStart(2,'0')}.jpg`;
  const arrowL = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  const arrowR = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  let current = null;

  function preload(srcs){ return Promise.all(srcs.map(s => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = s; }))); }

  function mount(host, b){
    destroy();
    host.innerHTML = `
      <div class="flip">
        <div class="flip-head"><div><h2 id="drawerTitle">${b.title}</h2><p>${b.note}</p></div></div>
        <div class="flip-stage" tabindex="-1"><span class="mono d-loading">Loading pages</span></div>
        <div class="flip-ctl">
          <button class="x nav" type="button" data-f="-1" aria-label="Previous">${arrowL}</button>
          <div class="mid"><span class="mono" aria-live="polite" data-count></span></div>
          <button class="x nav" type="button" data-f="1" aria-label="Next">${arrowR}</button>
        </div>
      </div>`;
    const stage = host.querySelector('.flip-stage'), count = host.querySelector('[data-count]');
    const prev = host.querySelector('[data-f="-1"]'), next = host.querySelector('[data-f="1"]');
    const srcs = b.kind === 'book' ? Array.from({length:b.n}, (_,i) => pageSrc(b,i+1)) : b.stacked ? [pageSrc(b,1)] : [pageSrc(b,1), pageSrc(b,2)];
    const ctl = b.kind === 'book' ? book(stage, b, srcs) : trifold(stage, b, srcs);
    const sync = () => { count.textContent = ctl.label(); prev.disabled = ctl.pos() <= 0; next.disabled = ctl.pos() >= ctl.max(); };
    const go = d => { ctl.go(d); sync(); };
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    stage.addEventListener('click', e => { const r = stage.getBoundingClientRect(); go(e.clientX < r.left + r.width/2 && ctl.pos() > 0 ? -1 : 1); });
    stage.addEventListener('contextmenu', e => e.preventDefault());
    let sx = null;
    stage.addEventListener('pointerdown', e => sx = e.clientX);
    stage.addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40){ e.stopPropagation(); go(dx < 0 ? 1 : -1); } });
    const key = e => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    const ro = new ResizeObserver(() => ctl.layout());
    current = { key, ro };
    host.closest('dialog').addEventListener('keydown', key);
    preload(srcs).then(() => { if (current && current.key === key){ stage.innerHTML = ''; ctl.build(); ro.observe(stage); sync(); } });
    sync();
  }

  function book(stage, b, srcs){
    let el, leaves = [], t = 0, single = false;
    const n = srcs.length;
    const face = (src, cls) => `<div class="face ${cls}" style="${src ? `background-image:url('${src}')` : 'background:var(--stock)'}"></div>`;
    function build(){
      single = stage.clientWidth < 720;
      el = document.createElement('div'); el.className = 'book' + (single ? ' single' : '');
      leaves = [];
      if (single){
        for (let i=0;i<n;i++){ const l = document.createElement('div'); l.className = 'leaf'; l.innerHTML = face(srcs[i],'front') + face(null,'back'); el.append(l); leaves.push(l); }
      } else {
        for (let k=0;k<Math.ceil(n/2);k++){ const l = document.createElement('div'); l.className = 'leaf'; l.innerHTML = face(srcs[2*k],'front') + face(srcs[2*k+1] || null,'back'); el.append(l); leaves.push(l); }
      }
      stage.append(el); t = Math.min(t, max()); layout(); apply(true);
    }
    const max = () => single ? n - 1 : leaves.length;
    function layout(){
      if (!el) return;
      if ((stage.clientWidth < 720) !== single){ el.remove(); build(); return; }
      const W = stage.clientWidth - 48, H = stage.clientHeight - 48;
      const pw = single ? Math.min(W, H*b.ar) : Math.min(W/2, H*b.ar), ph = pw / b.ar;
      el.style.setProperty('--bw', (single ? pw : pw*2) + 'px'); el.style.setProperty('--bh', ph + 'px');
      apply(true);
    }
    function apply(instant){
      leaves.forEach((l,k) => {
        if (instant) l.style.transition = 'none';
        const turned = k < t;
        const z = turned ? k : leaves.length - k;
        l.style.transform = `translateZ(${z*.6}px) rotateY(${turned ? -180 : 0}deg)`;
        if (single) l.style.opacity = turned ? '0' : '1';
        if (instant){ l.offsetWidth; l.style.transition = ''; }
      });
      if (!single){
        const shift = t === 0 ? -25 : (t === leaves.length && n % 2 === 0) ? 25 : 0;
        el.style.transform = `translateX(${shift}%)`;
        el.style.setProperty('--spine', t === 0 || (t === leaves.length && n % 2 === 0) ? 0 : 1);
      }
    }
    function go(d){ const nt = Math.max(0, Math.min(max(), t + d)); if (nt === t) return; t = nt; apply(false); }
    function label(){
      if (single) return `Page ${t+1} of ${n}`;
      if (t === 0) return `Cover · ${n} pages`;
      const l = 2*t, r = 2*t + 1;
      return r <= n ? `Pages ${l} and ${r} of ${n}` : `Page ${l} of ${n}`;
    }
    return { build, layout, go, label, pos:() => t, max };
  }

  function trifold(stage, b, srcs){
    const labels = ['Closed · the cover','Cover open','Fully open · the inside','Turned over · the outside'];
    let el, cover, flap, mid, s = 0;
    const out = b.stacked ? srcs[0] : srcs[0], ins = b.stacked ? srcs[0] : srcs[1];
    const y = (which) => b.stacked ? (which === 'out' ? '0%' : '100%') : '0%';
    const sizeY = b.stacked ? '200%' : '100%';
    const f = (src, panel, which, cls) => `<div class="face ${cls}" style="background-image:url('${src}'); background-size:300% ${sizeY}; background-position:${['0%','50%','100%'][panel]} ${y(which)}"></div>`;
    function build(){
      el = document.createElement('div'); el.className = 'fold';
      el.innerHTML = `<div class="sheet">
        <div class="panel p-cover">${f(ins,0,'in','front')}${f(out,2,'out','back')}</div>
        <div class="panel p-mid">${f(ins,1,'in','front')}${f(out,1,'out','back')}</div>
        <div class="panel p-flap">${f(ins,2,'in','front')}${f(out,0,'out','back')}</div>
      </div>`;
      stage.append(el);
      cover = el.querySelector('.p-cover'); mid = el.querySelector('.p-mid'); flap = el.querySelector('.p-flap');
      cover.style.cssText = 'left:0; transform-origin:100% 50%';
      mid.style.cssText = 'left:33.3333%';
      flap.style.cssText = 'left:66.6667%; transform-origin:0 50%';
      layout(); apply(true);
    }
    function layout(){
      if (!el) return;
      const pa = b.ar/3, W = stage.clientWidth - 48, H = stage.clientHeight - 48;
      const pw = Math.min(W/3, H*pa), ph = pw / pa;
      el.style.setProperty('--fw', pw*3 + 'px'); el.style.setProperty('--fh', ph + 'px'); el.style.setProperty('--pw', pw + 'px');
    }
    function apply(instant){
      const parts = [el, el.querySelector('.sheet'), cover, flap];
      if (instant) parts.forEach(p => p.style.transition = 'none');
      cover.style.transform = s >= 1 ? 'translateZ(0) rotateY(0deg)' : 'translateZ(2px) rotateY(180deg)';
      flap.style.transform = s >= 2 ? 'translateZ(0) rotateY(0deg)' : 'translateZ(1px) rotateY(-180deg)';
      el.querySelector('.sheet').style.transform = s === 3 ? 'rotateY(180deg)' : 'none';
      el.style.transform = s === 1 ? 'translateX(16.6667%)' : 'none';
      if (instant) parts.forEach(p => { p.offsetWidth; p.style.transition = ''; });
    }
    function go(d){ const ns = Math.max(0, Math.min(3, s + d)); if (ns === s) return; s = ns; apply(false); }
    return { build, layout, go, label:() => labels[s], pos:() => s, max:() => 3 };
  }

  function destroy(){ if (!current) return; current.ro.disconnect(); document.querySelectorAll('dialog').forEach(d => d.removeEventListener('keydown', current.key)); current = null; }
  return { mount, destroy };
})();
