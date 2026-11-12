/* SIGNTUNING site script. Business details come from config.js (window.SITE). */
(() => {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ss = { get(k) { try { return sessionStorage.getItem(k); } catch { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch {} }, del(k) { try { sessionStorage.removeItem(k); } catch {} } };

  const I = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 2h-3.4v13.4a2.9 2.9 0 1 1-2.1-2.8V9.1a6.3 6.3 0 1 0 5.5 6.3V8.6a8 8 0 0 0 4.4 1.3V6.5a4.5 4.5 0 0 1-4.4-4.5Z"/></svg>'
  };
  const waLink = msg => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
  const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 1e4 ? (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' : n.toLocaleString('en');

  /* ---------- header, menu, footer, dock ---------- */
  const page = html.dataset.page;
  const links = [['index.html', 'Home', 'home'], ['services.html', 'Services', 'services'], ['work.html', 'Our work', 'work'], ['contact.html', 'Contact', 'contact']];
  const hello = `Hi ${S.name}! I saw your website and I'd like a price.`;
  const head = $('#top');
  if (head) head.innerHTML = `<div class="wrap">
      <a class="brand" href="index.html" aria-label="${S.name} home"><img src="img/logo.webp" alt="${S.name}" width="520" height="147"></a>
      <nav class="nav" aria-label="Main">${links.map(([h, t, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
      <a class="btn wa" href="${waLink(hello)}" target="_blank" rel="noopener">${I.wa}WhatsApp</a>
      <button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="sheet"><span></span><span></span><span></span></button>
    </div>`;
  const sheet = $('#sheet');
  if (sheet) sheet.innerHTML = links.map(([h, t], i) => `<a class="big" href="${h}"><span>0${i + 1}</span>${t}</a>`).join('') +
    `<div class="btns"><a class="btn wa" href="${waLink(hello)}" target="_blank" rel="noopener">${I.wa}WhatsApp</a><a class="btn ghost" href="tel:${S.phoneIntl}">${I.phone}Call</a></div>`;
  const burger = $('.burger');
  burger?.addEventListener('click', () => { const o = html.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', o); });
  addEventListener('keydown', e => { if (e.key === 'Escape') html.classList.remove('menu-open'); });

  const foot = $('#foot');
  if (foot) foot.innerHTML = `<div class="wrap">
    <div class="foot">
      <div><img src="img/logo.webp" alt="${S.name}" width="520" height="147" loading="lazy"><p>${S.tagline}. Window tint, wraps, stickers and number plates in ${S.areaLong.split(',')[0]}.</p></div>
      <div><p class="fh">Pages</p>${links.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div>
      <div><p class="fh">Talk to us</p><a href="${waLink(hello)}" target="_blank" rel="noopener">WhatsApp ${S.phone}</a><a href="tel:${S.phoneIntl}">Call ${S.phone}</a><a href="${S.tiktok}" target="_blank" rel="noopener">TikTok ${S.tiktokHandle}</a><a href="contact.html">${S.area}</a></div>
    </div>
    <div class="bigword" aria-hidden="true">${S.name}</div>
    <div class="legal"><span>© ${new Date().getFullYear()} ${S.legalName}. All rights reserved.</span><span>Made in Mauritius</span></div>
  </div>`;
  const dock = $('#dock');
  if (dock) dock.innerHTML = `<a class="btn wa" href="${waLink(hello)}" target="_blank" rel="noopener">${I.wa}WhatsApp</a><a class="btn ghost" style="background:#111" href="tel:${S.phoneIntl}">${I.phone}Call</a>`;

  // fill simple placeholders
  $$('[data-s]').forEach(el => { const v = S[el.dataset.s]; if (v != null) el.textContent = v; });
  $$('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa || hello); a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-tel]').forEach(a => { a.href = 'tel:' + S.phoneIntl; });
  $$('[data-tt]').forEach(a => { a.href = S.tiktok; a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-icon]').forEach(el => { el.insertAdjacentHTML('afterbegin', I[el.dataset.icon] || ''); });
  $$('[data-map]').forEach(f => { f.src = `https://www.google.com/maps?q=${encodeURIComponent(S.mapQuery)}&z=13&output=embed`; });
  if (!S.demoPhotos) $$('.demo-note').forEach(n => n.remove());

  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    head?.classList.toggle('solid', y > 40);
    dock?.classList.toggle('show', y > innerHeight * .6);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- reveal on scroll ---------- */
  $$('.split').forEach(el => {
    // wrap each word of every text node, leaving tags such as <br> and <span class="chrome"> alone
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
    while (walk.nextNode()) nodes.push(walk.currentNode);
    nodes.forEach(n => {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w => {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.append(w); return; }
        const s = document.createElement('span'); s.className = 'w'; const i = document.createElement('i'); i.textContent = w; s.append(i); frag.append(s);
      });
      n.replaceWith(frag);
    });
    $$('.w > i', el).forEach((w, i) => w.style.transitionDelay = (i * 0.05) + 's');
  });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  const watch = () => $$('.rv, .split').forEach(el => io.observe(el));

  /* ---------- count up ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = S.stats[el.dataset.count] ?? +el.dataset.count, plus = el.dataset.plus || '';
    if (reduce) { el.textContent = fmt(to) + plus; return; }
    const t0 = performance.now(), d = 1600;
    const step = t => { const k = Math.min(1, (t - t0) / d), v = to * (1 - Math.pow(1 - k, 4)); el.textContent = fmt(Math.round(v)) + plus; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .4 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- ticker: double the track so it loops ---------- */
  $$('.ticker-track').forEach(t => { t.innerHTML += t.innerHTML; });

  /* ---------- intro (home, once per visit) ---------- */
  const opening = $('.opening');
  const startPage = () => { watch(); };
  if (opening && html.classList.contains('intro-on')) {
    let done = false;
    const finish = () => {
      if (done) return; done = true; ss.set('st-intro', '1');
      opening.classList.add('lift'); startPage();
      setTimeout(() => { html.classList.remove('intro-on'); opening.remove(); }, 900);
    };
    requestAnimationFrame(() => opening.classList.add('play'));
    setTimeout(finish, 2500);
    opening.addEventListener('click', finish);
    addEventListener('keydown', e => { if (e.key === 'Escape') finish(); }, { once: true });
  } else { opening?.remove(); startPage(); }

  /* ---------- page change: film rolls down, then off ---------- */
  const tx = $('.tx');
  const txName = tx && $('.name', tx);
  if (tx && html.classList.contains('tx-wait')) {
    const n = ss.get('st-tx'); ss.del('st-tx');
    if (txName && n) txName.innerHTML = `${n}<small>${S.name}</small>`;
    html.classList.remove('tx-wait'); tx.classList.add('arrive');
    setTimeout(() => tx.classList.remove('arrive'), 950);
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || !tx || reduce || e.ctrlKey || e.metaKey || e.shiftKey || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!/^[\w-]+\.html(#[\w-]+)?$/.test(href)) return;
    const [file] = href.split('#');
    const here = location.pathname.split('/').pop() || 'index.html';
    if (file === here) { html.classList.remove('menu-open'); return; }
    e.preventDefault();
    const label = (a.querySelector('h3')?.textContent || a.textContent).replace(/^0\d/, '').trim().slice(0, 28) || S.name;
    ss.set('st-tx', label);
    txName.innerHTML = `${label}<small>${S.name}</small>`;
    tx.classList.add('go');
    setTimeout(() => { location.href = href; }, 560);
  });
  addEventListener('pageshow', e => { if (e.persisted && tx) { tx.classList.remove('go', 'arrive'); html.classList.remove('menu-open'); } });

  /* ---------- gallery ---------- */
  const mas = $('.masonry');
  if (mas) {
    $$('.filters .chip').forEach(c => c.addEventListener('click', () => {
      $$('.filters .chip').forEach(x => x.setAttribute('aria-pressed', x === c));
      const k = c.dataset.f;
      $$('figure', mas).forEach(f => f.classList.toggle('hide', k !== 'all' && f.dataset.cat !== k));
    }));
    const lb = $('.lightbox'), lbImg = $('img', lb);
    mas.addEventListener('click', e => { const im = e.target.closest('figure')?.querySelector('img'); if (!im) return; lbImg.src = im.src; lbImg.alt = im.alt; lb.classList.add('open'); $('button', lb).focus(); });
    lb.addEventListener('click', e => { if (e.target !== lbImg) lb.classList.remove('open'); });
    addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
  }
  const ttBtn = $('#loadTT');
  ttBtn?.addEventListener('click', () => {
    const box = ttBtn.parentElement, h = S.tiktokHandle.replace('@', '');
    box.innerHTML = `<blockquote class="tiktok-embed" cite="${S.tiktok}" data-unique-id="${h}" data-embed-type="creator" style="max-width:780px;min-width:288px;margin:0"><section><a target="_blank" href="${S.tiktok}?refer=creator_embed">${S.tiktokHandle}</a></section></blockquote>`;
    const sc = document.createElement('script'); sc.async = true; sc.src = 'https://www.tiktok.com/embed.js'; document.body.appendChild(sc);
  });

  /* ---------- services sub-nav highlight ---------- */
  const sub = $$('.subnav a');
  if (sub.length) {
    const sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) sub.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
    sub.forEach(a => { const t = $(a.hash); t && sio.observe(t); });
  }
})();
