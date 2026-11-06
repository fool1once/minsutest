/* Built-in fallback content (used only if data.js is not found). */
/* Edit this file to update the site. No build step needed. */
window.PORTFOLIO = window.PORTFOLIO || {
  uids: ["6838532770206056449", "6751632828758228993"],

  socials: [
    { k: "tt", name: "TikTok", icon: "fab fa-tiktok", handle: "fool1once", url: "https://www.tiktok.com/@fool1once?_r=1&_t=ZS-9B6CuabyM7w", c: "#69c9d0" },
    { k: "fb", name: "Facebook", icon: "fab fa-facebook", handle: "Jhon F. Zenin", url: "https://www.facebook.com/share/19vGAKCmXk/", c: "#1877f2" },
    { k: "ig", name: "Instagram", icon: "fab fa-instagram", handle: "jhonchalant", url: "https://www.instagram.com/jhonchalant?xtok=ZXM3MHg5MDBzbWsz", c: "#e1306c" },
    { k: "dc", name: "Discord", icon: "fab fa-discord", handle: "youngfool", url: "https://discord.com/invite/rKvgk97K8Y", c: "#5865f2", copy: true },
    { k: "rb", name: "Roblox", icon: "fas fa-cube", handle: "FooIxl", url: "https://www.roblox.com/users/2918118693/profile", c: "#ff3e3e" }
  ],

  tiers: [
    { k: "majors", label: "Majors", cls: "red", items: ["Gladiators: Top 8", "CMO Battleground S1 Champion", "Garena Masters 11: Top 8"] },
    { k: "champion", label: "Champion", cls: "gold", items: [
      "Wooze Elite Inter Scrim 5v5", "Sidra x Re x Soriux x Nan 5v5", "Elle's Szn 1 5v5", "Kize x Miz 5v5 Tourna S1",
      "Kizy Tourna / Aims 5v5 / Hairi x Akuma S2", "AVR Esports BFMT", "SIDRA Esports 1v1 SR", "Ziel 1v1 Open Div SG",
      "AVR Esports 1v1 SG", "2v2 Soriux x Sidra", "SVT 1v1 Tourna SMG & SR", "Aims 5v5 / Kizy 5v5",
      "Xerina x Samii 5v5 S1", "Cozi x Mika 5v5 S1", "Savage²¹ 5v5 BFMT", "T5 5v5 BFMT / Kouvx 5v5"] },
    { k: "first", label: "First place", cls: "silver", items: [
      "Maddy x Neko 5v5 (×2)", "Navi's 5v5 S2 & Open", "Cozi 5v5 S2 & S3", "Elle x Mika 5v5", "Elle x Mikko 5v5",
      "Joji's Tourna 5v5", "SIDRA Esports 1v1 SMG", "Wagas x Sinag 1v1 SR", "Ziel 1v1 Open Div SR",
      "Xerina x Soju 5v5 S1", "Belle's & Velox 5v5 S1", "Cozi x Mika 5v5 S1"] },
    { k: "second", label: "Second place", cls: "silver", items: ["Wagas x Sinag 1v1 SG", "Hera's Szn 1"] },
    { k: "third", label: "Third place", cls: "bronze", items: ["Hera S1 5v5", "Ziel x Gela 5v5 S1"] }
  ],

  projects: [
    { icon: "fab fa-python", name: "Humanizer", tag: "Python · Text", desc: "Rewrites AI-generated text so it reads like natural human writing." },
    { icon: "fas fa-robot", name: "AI Tool", tag: "Custom utility", desc: "A custom AI-powered utility with workflows built from scratch." },
    { icon: "fas fa-message", name: "SMS Dispatch", tag: "Messaging utility", desc: "Automated bulk messaging dispatch for your own numbers and opted-in lists." },
    { icon: "fas fa-desktop", name: "Autochat", tag: "Desktop automation", desc: "Desktop tool that runs repeated chat flows automatically." },
    { icon: "fas fa-at", name: "Nickname Loop", tag: "Auto loop", desc: "Cycles through nicknames in a continuous loop with no input." }
  ],

  games: [
    { icon: "fas fa-mobile-screen-button", name: "COD Mobile" },
    { icon: "fas fa-gamepad", name: "ML" },
    { icon: "fas fa-cube", name: "Roblox" },
    { icon: "fab fa-steam", name: "Steam" },
    { icon: "fas fa-crosshairs", name: "Valorant" }
  ],

  motto: [
    "Win in silence, let results speak.", "Aim to be the top.", "Stay untouchable.", "Outwork everyone.",
    "Be the standard, not the competition.", "Leave no room for doubt.", "Dominate with discipline."
  ]
};

(() => {
  const D = window.PORTFOLIO;
  if (!D) { console.error('data.js did not load. Make sure data.js is in the same folder as index.html.'); return; }
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- render content from data.js ---------- */
  $('#socials').innerHTML = D.socials.map(s =>
    `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}" style="--hc:${s.c}"><i class="${s.icon}"></i></a>`).join('');

  $('#links').innerHTML = D.socials.map(s => s.copy
    ? `<button class="lk" data-copy="${esc(s.handle)}"><i class="${s.icon}"></i><span><small>${s.name} · tap to copy</small><b>${esc(s.handle)}</b></span></button>`
    : `<a class="lk" href="${s.url}" target="_blank" rel="noopener"><i class="${s.icon}"></i><span><small>${s.name}</small><b>${esc(s.handle)}</b></span></a>`).join('');

  $('#games-row').innerHTML = D.games.map(g => `<div class="gm"><i class="${g.icon}"></i><span>${esc(g.name)}</span></div>`).join('');
  $('#uids').innerHTML = D.uids.map(u => `<span>UID ${u}</span>`).join('');

  $('#proj').innerHTML = D.projects.map(p => `
    <div class="pc" tabindex="0" role="button" aria-label="${esc(p.name)}: flip card">
      <div class="pc-i">
        <div class="pc-f"><i class="${p.icon}"></i><h3>${esc(p.name)}</h3><small>${esc(p.tag)}</small></div>
        <div class="pc-b"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p></div>
      </div>
    </div>`).join('');
  $$('.pc').forEach(c => {
    const flip = () => c.classList.toggle('flipped');
    c.addEventListener('click', flip);
    c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  });

  $('#stats').innerHTML = D.tiers.map(t =>
    `<div class="stat"><b class="${t.cls}" data-count="${t.items.length}">0</b><span>${t.label}</span></div>`).join('');
  $('#ach').innerHTML = D.tiers.flatMap(t =>
    t.items.map(i => `<li data-t="${t.k}"><span class="chip ${t.cls}">${t.label}</span><span>${esc(i)}</span></li>`)).join('');
  $('#tabs').innerHTML = [{ k: 'all', label: 'All' }, ...D.tiers].map((t, i) =>
    `<button class="tab" role="tab" data-k="${t.k}" aria-selected="${i === 0}">${t.label}</button>`).join('');
  $('#tabs').addEventListener('click', e => {
    const b = e.target.closest('.tab'); if (!b) return;
    $$('.tab').forEach(t => t.setAttribute('aria-selected', t === b));
    $$('#ach li').forEach(li => { li.hidden = b.dataset.k !== 'all' && li.dataset.t !== b.dataset.k; });
  });

  /* copy handle */
  const toast = $('#toast'); let tt;
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-copy]'); if (!b) return;
    navigator.clipboard?.writeText(b.dataset.copy).then(() => {
      toast.textContent = 'Copied ' + b.dataset.copy;
      toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 1600);
    });
  });

  /* ---------- slides: stagger index, in-view state, nav, dots ---------- */
  const slides = $$('.slide');
  slides.forEach(s => $$('.rv', s).forEach((el, i) => el.style.setProperty('--i', i)));
  $('#dots').innerHTML = slides.map(s => `<a href="#${s.id}" data-l="${s.dataset.label}" aria-label="${s.dataset.label}"></a>`).join('');
  const dots = $$('#dots a'), links = $$('#menu a');

  const countUp = el => {
    const n = +el.dataset.count; if (reduce) { el.textContent = n; return; }
    const t0 = performance.now(), d = 900;
    const step = t => { const p = Math.min((t - t0) / d, 1); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    e.target.classList.toggle('in', e.isIntersecting);
    if (e.isIntersecting) {
      const i = slides.indexOf(e.target);
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
      links.forEach(l => l.classList.toggle('on', l.hash === '#' + e.target.id));
      if (e.target.id === 'achievements') $$('[data-count]').forEach(countUp);
    }
  }), { rootMargin: '-25% 0px -25% 0px' });
  slides.forEach(s => io.observe(s));
  document.documentElement.classList.remove('no-js'); // only hide-then-reveal once everything above worked

  const burger = $('#burger'), menu = $('#menu');
  const setMenu = o => { burger.setAttribute('aria-expanded', o); menu.classList.toggle('open', o); };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  links.forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* typing motto */
  (() => {
    const el = $('#typing'); if (reduce) return;
    let p = 0, c = 0, del = false;
    const tick = () => {
      const w = D.motto[p];
      el.textContent = w.slice(0, del ? --c : ++c);
      let ms = del ? 24 : 85;
      if (!del && c === w.length) { ms = 2200; del = true; }
      else if (del && c === 0) { del = false; p = (p + 1) % D.motto.length; ms = 400; }
      setTimeout(tick, ms);
    };
    el.textContent = ''; setTimeout(tick, 700);
  })();

  /* scroll progress bar */
  const bar = $('#bar');
  const prog = () => bar.style.setProperty('--p', scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
  addEventListener('scroll', prog, { passive: true }); prog();

  /* ---------- 3D hand (three.js) ---------- */
  const cv = $('#stage');
  if (!window.THREE) { cv.hidden = true; return; }
  let R;
  try { R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch (e) { cv.hidden = true; return; }
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(38, 1, .1,60); cam.position.z = 7.5;
  scene.add(new THREE.AmbientLight(0x8899aa, .55));
  const l1 = new THREE.PointLight(0x00ff88, 2.4, 40); l1.position.set(4, 3, 5); scene.add(l1);
  const l2 = new THREE.PointLight(0x00e5ff, 2, 40); l2.position.set(-4, -2, 4); scene.add(l2);

  const body = new THREE.MeshStandardMaterial({ color: 0x0c1814, metalness: .85, roughness: .28, emissive: 0x003a22, emissiveIntensity: .7 });
  const edge = new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: .7 });
  const part = (geo, parent, pos) => {
    const m = new THREE.Mesh(geo, body);
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), edge));
    if (pos) m.position.set(...pos);
    parent.add(m); return m;
  };

  const hand = new THREE.Group(); scene.add(hand);
  part(new THREE.BoxGeometry(1.3, 1.4, .45), hand);
  part(new THREE.CylinderGeometry(.42, .5, .8, 8), hand, [0, -1.05, 0]);

  const makeFinger = (x, y, segs, rad) => {
    const base = new THREE.Group(); base.position.set(x, y, 0); hand.add(base);
    const joints = []; let parent = base;
    segs.forEach((L, i) => {
      const j = new THREE.Group(); if (i) j.position.y = segs[i - 1];
      parent.add(j);
      const r = rad * (1 - i * .09);
      part(new THREE.CylinderGeometry(r, r * 1.05, L, 8), j, [0, L / 2, 0]);
      part(new THREE.SphereGeometry(r * 1.1, 10, 8), j);
      joints.push(j); parent = j;
    });
    return { base, joints };
  };
  const thumb = makeFinger(-.72, -.3, [.5, .42], .12);
  const fingers = [[-.48, 1.1], [-.16, 1.12], [.16, 1.05], [.48, .85]].map(([x, s]) =>
    makeFinger(x, .7, [.46 * s, .34 * s, .28 * s], .105));
  const bend = [1.35, 1.5, 1.2];

  const pts = new Float32Array(900);
  for (let i = 0; i < 900; i += 3) {
    const r = 5 + Math.random() * 6, a = Math.random() * 6.283, b = Math.acos(2 * Math.random() - 1);
    pts[i] = r * Math.sin(b) * Math.cos(a); pts[i + 1] = r * Math.cos(b); pts[i + 2] = r * Math.sin(b) * Math.sin(a) - 3;
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  const dust = new THREE.Points(g, new THREE.PointsMaterial({ color: 0x00e5ff, size: .035, transparent: true, opacity: .6 }));
  scene.add(dust);

  /* one pose per slide: curl of [thumb, index, middle, ring, pinky], side, yaw */
  const POSES = [
    { c: [0, 0, 0, 0, 0], side: 1, yaw: -.35 },        // home: open hello
    { c: [1, 1, 1, 1, 1], side: -1, yaw: .4 },         // achievements: fist
    { c: [.9, 0, 1, 1, 1], side: 1, yaw: -.5 },        // projects: pointing
    { c: [0, 1, 1, 1, 1], side: -1, yaw: .35 },        // connect: thumbs up
    { c: [1, 0, 1, 1, 0], side: 0, yaw: 0 }            // games: rock sign
  ];
  const N = slides.length, TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const sm = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;

  let tops = [], visW = 10, wide = true;
  const measure = () => { tops = slides.map(s => s.offsetTop); };
  const resize = () => {
    R.setSize(innerWidth, innerHeight, false);
    cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix();
    visW = 2 * Math.tan(cam.fov * Math.PI / 360) * cam.position.z * cam.aspect;
    wide = innerWidth > 860; measure();
  };
  addEventListener('resize', resize); resize();
  new ResizeObserver(measure).observe($('main'));
  document.fonts?.ready.then(measure);

  const cur = { c: [0, 0, 0, 0, 0], x: 0, y: 0, rot: 0, s: 1 };
  let mx = 0, my = 0, last = performance.now();
  addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });

  const frame = now => {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, .05); last = now;
    const t = now / 1000, y = scrollY + innerHeight * .5;

    let i = 0; tops.forEach((tp, k) => { if (y >= tp) i = k; });
    const a = tops[i], b = tops[i + 1] ?? a + innerHeight;
    const gT = i < N - 1 ? sm(.55, 1, (y - a) / (b - a)) : 0;
    const P0 = POSES[i], P1 = POSES[Math.min(i + 1, N - 1)];

    const tgt = {
      c: P0.c.map((v, k) => lerp(v, P1.c[k], gT)),
      x: lerp(P0.side, P1.side, gT) * (wide ? visW * .22 : 0),
      y: wide ? 0 : 1.3,
      rot: lerp(P0.yaw, P1.yaw, gT) + (reduce ? 0 : (i + gT) * TAU),
      s: wide ? 1.45 : 1.05
    };
    const k = reduce ? 1 : 1 - Math.exp(-dt * 7);
    cur.c = cur.c.map((v, n) => lerp(v, tgt.c[n], k));
    cur.x = lerp(cur.x, tgt.x, k); cur.y = lerp(cur.y, tgt.y, k);
    cur.rot = lerp(cur.rot, tgt.rot, k); cur.s = lerp(cur.s, tgt.s, k);

    const idle = reduce ? 0 : 1;
    thumb.base.rotation.z = .95 - .85 * cur.c[0];
    thumb.joints.forEach((j, n) => { j.rotation.x = (cur.c[0] + Math.sin(t * 2) * .04 * idle) * (n ? 1.2 : .8); });
    fingers.forEach((f, n) => f.joints.forEach((j, m) => {
      j.rotation.x = Math.max(0, cur.c[n + 1] + Math.sin(t * 2 + n) * .05 * idle) * bend[m];
    }));

    hand.position.set(cur.x, cur.y + Math.sin(t * .9) * .1 * idle, 0);
    hand.rotation.set(-.15 + my * .3, cur.rot + mx * .5, -mx * .1);
    hand.scale.setScalar(cur.s);
    dust.rotation.y = t * .03 * idle + cur.rot * .05;
    R.render(scene, cam);
  };
  requestAnimationFrame(frame);
})();
