/* SIGNTUNING motion layer: video playback manager + scroll scenes. No libraries. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const S = window.SITE || {};
  const conn = navigator.connection || {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
  const touch = matchMedia('(hover: none)').matches;

  /* ---------- videos: load when seen, play the most visible ones only ---------- */
  const vids = $$('video[data-src]');
  const MAX = touch ? 2 : 3;                       // phones run out of video decoders fast
  const seen = new Map();
  const tall = () => matchMedia('(max-aspect-ratio: 4/5)').matches;
  const load = v => { if (v.dataset.on) return; v.dataset.on = '1'; v.src = (tall() && v.dataset.srcTall) || v.dataset.src; };
  vids.forEach(v => { v.muted = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.loop = true; v.preload = 'none'; v.disablePictureInPicture = true; });
  let ready = false;
  const go = () => { ready = true; schedule(); };
  if (document.readyState === 'complete') setTimeout(go, 600); else addEventListener('load', () => (window.requestIdleCallback || setTimeout)(go, { timeout: 1500 }), { once: true });
  function schedule() {
    if (!ready) return;
    if (document.hidden) { vids.forEach(v => v.paused || v.pause()); return; }
    const top = [...seen].filter(([, r]) => r > 0.18).sort((a, b) => b[1] - a[1]).slice(0, MAX).map(x => x[0]);
    for (const v of vids) {
      if (top.includes(v) && !reduce && !saveData) { load(v); if (v.paused) v.play().catch(() => {}); }
      else if (!v.paused) v.pause();
    }
  }
  const vio = new IntersectionObserver(es => { es.forEach(e => seen.set(e.target, e.isIntersecting ? e.intersectionRatio : 0)); schedule(); }, { threshold: [0, .2, .4, .6, .8, 1] });
  vids.forEach(v => vio.observe(v));
  document.addEventListener('visibilitychange', schedule);

  /* ---------- statement words ---------- */
  $$('[data-words]').forEach(p => {
    const words = p.textContent.trim().split(/\s+/);
    p.style.setProperty('--n', words.length);
    p.innerHTML = words.map((w, i) => `<span class="wd${w.startsWith('*') ? ' r' : ''}" style="--i:${i}">${w.replace(/^\*/, '')}</span>`).join(' ');
  });

  /* ---------- scroll scenes: one rAF writes --p (0..1) per scene ---------- */
  const scenes = $$('[data-scrub]');
  const hwork = $('.hwork');
  function sizeH() {
    if (!hwork) return;
    const track = $('.hwork-track', hwork);
    const pinned = !touch && innerWidth > 900 && !reduce;
    if (!pinned) { hwork.style.height = ''; hwork.style.removeProperty('--dist'); return; }
    const dist = Math.max(0, track.scrollWidth - innerWidth + 40);
    hwork.style.setProperty('--dist', dist + 'px');
    hwork.style.height = (dist + innerHeight) + 'px';
  }
  let ticking = false;
  function update() {
    ticking = false;
    const vh = innerHeight;
    for (const el of scenes) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      const k = el.dataset.scrub;
      let p;
      if (k === 'hero') p = -r.top / (r.height * .9);
      else if (k === 'pin') p = -r.top / Math.max(1, r.height - vh);
      else p = (vh - r.top) / (vh * .85 + r.height * .45);
      p = Math.min(1, Math.max(0, p));
      if (Math.abs(p - (el._p ?? -1)) > .0015) { el._p = p; el.style.setProperty('--p', p.toFixed(4)); }
    }
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  if (!reduce) { addEventListener('scroll', req, { passive: true }); addEventListener('resize', () => { sizeH(); req(); }); }
  sizeH(); update();
  addEventListener('load', () => { sizeH(); update(); });

  /* ---------- reel lightbox ---------- */
  const box = $('.vlight');
  $$('[data-reel]').forEach(b => b.addEventListener('click', () => {
    if (!box) return;
    const v = $('video', box);
    v.src = b.dataset.reel; v.muted = false; box.classList.add('open'); v.play().catch(() => {}); $('button', box).focus();
  }));
  const close = () => { if (!box) return; const v = $('video', box); v.pause(); v.removeAttribute('src'); v.load(); box.classList.remove('open'); };
  box?.addEventListener('click', e => { if (e.target === box || e.target.closest('button')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  /* ---------- real TikTok feed, loaded when near ---------- */
  const tt = $('.ttframe[data-auto]');
  if (tt && S.tiktok) {
    const go = () => {
      const h = (S.tiktokHandle || '').replace('@', '');
      tt.innerHTML = `<blockquote class="tiktok-embed" cite="${S.tiktok}" data-unique-id="${h}" data-embed-type="creator" style="max-width:780px;min-width:288px"><section><a target="_blank" href="${S.tiktok}?refer=creator_embed">${S.tiktokHandle}</a></section></blockquote>`;
      const sc = document.createElement('script'); sc.async = true; sc.src = 'https://www.tiktok.com/embed.js'; document.body.appendChild(sc);
    };
    if (saveData) tt.querySelector('.loading')?.insertAdjacentHTML('beforeend', '<button class="btn ghost" type="button">Load videos</button>'), tt.addEventListener('click', go, { once: true });
    else { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { o.disconnect(); go(); } }, { rootMargin: '600px 0px' }); o.observe(tt); }
  }
})();
