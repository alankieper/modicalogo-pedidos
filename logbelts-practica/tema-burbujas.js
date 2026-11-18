// Tema "burbujas" del link del equipo: burbujas de vidrio en la cabecera (suben, se mueven de lado y explotan, también al tocarlas)
// y burbujas tenues que suben por el fondo. Es el mismo código que la página de la nube.
(function () {
  "use strict";
  document.body.dataset.tema = "burbujas";

  const fondo = document.createElement("div");
  fondo.className = "burbujas"; fondo.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 12; i++) {
    const b = document.createElement("i"), t = 18 + Math.random() * 46;
    b.className = "burbuja";
    b.style.cssText = `width:${t}px;height:${t}px;left:${Math.random() * 96}%;--dur:${18 + Math.random() * 16}s;--delay:${-Math.random() * 30}s;--deriva:${(Math.random() * 40 - 20).toFixed(0)}px;--top:${Math.random() * 90}%`;
    fondo.appendChild(b);
  }
  document.body.prepend(fondo);

  const cab = document.querySelector(".cab");
  if (!cab) return;
  const cv = document.createElement("canvas");
  cv.className = "cab-burbujas"; cv.setAttribute("aria-hidden", "true");
  cab.insertBefore(cv, cab.querySelector(".cab-logo"));
  const ctx = cv.getContext("2d"), quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, raf = 0, bs = [], chispas = [], anillos = [];
  const medir = () => { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
  const nueva = (ini) => { const r = 6 + Math.random() * (W > 700 ? 26 : 18);
    return { x: Math.random() * W, y: ini ? Math.random() * H : H + r + Math.random() * 40, r, v: .25 + Math.random() * .5, f: Math.random() * 6.3, a: .3 + Math.random() * .8, e: H * (.05 + Math.random() * .5), t: Math.random() * 360 }; };
  const reventar = (b) => { anillos.push({ x: b.x, y: b.y, r: b.r, vida: 1 });
    for (let i = 0, n = 7 + Math.floor(Math.random() * 5); i < n; i++) { const a = i / n * 6.28 + Math.random() * .4, v = 1.1 + Math.random() * 2;
      chispas.push({ x: b.x + Math.cos(a) * b.r * .8, y: b.y + Math.sin(a) * b.r * .8, vx: Math.cos(a) * v, vy: Math.sin(a) * v - .4, r: 1.1 + Math.random() * 2, vida: 1 }); } };
  const dibujar = ({ x, y, r, t }) => {
    const g = ctx.createRadialGradient(x - r * .3, y - r * .35, r * .1, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,.35)"); g.addColorStop(.45, "rgba(255,255,255,.06)"); g.addColorStop(.82, "rgba(255,255,255,.14)"); g.addColorStop(1, "rgba(255,255,255,.55)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    const l = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
    l.addColorStop(0, `hsla(${t},90%,85%,.55)`); l.addColorStop(.5, `hsla(${(t + 120) % 360},90%,85%,.25)`); l.addColorStop(1, `hsla(${(t + 240) % 360},90%,85%,.5)`);
    ctx.strokeStyle = l; ctx.lineWidth = Math.max(1, r * .06); ctx.beginPath(); ctx.arc(x, y, r - ctx.lineWidth / 2, 0, 6.283); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.beginPath(); ctx.ellipse(x - r * .38, y - r * .42, r * .22, r * .12, -.7, 0, 6.283); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = Math.max(1, r * .07); ctx.beginPath(); ctx.arc(x, y, r * .62, -.35, .75); ctx.stroke();
  };
  const cuadro = () => {
    ctx.clearRect(0, 0, W, H);
    bs.forEach((b, i) => { b.f += .018; b.y -= b.v; b.x += Math.sin(b.f) * b.a * .35; if (b.y < b.e) { reventar(b); bs[i] = nueva(false); } else dibujar(b); });
    anillos = anillos.filter((a) => (a.vida -= .06) > 0);
    anillos.forEach((a) => { ctx.strokeStyle = `rgba(255,255,255,${a.vida * .8})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(a.x, a.y, a.r * (1 + (1 - a.vida) * .9), 0, 6.283); ctx.stroke(); });
    chispas = chispas.filter((c) => (c.vida -= .035) > 0);
    chispas.forEach((c) => { c.x += c.vx; c.y += c.vy; c.vy += .06; ctx.fillStyle = `rgba(255,255,255,${c.vida * .9})`; ctx.beginPath(); ctx.arc(c.x, c.y, c.r * c.vida, 0, 6.283); ctx.fill(); });
    raf = requestAnimationFrame(cuadro);
  };
  const iniciar = () => { medir(); bs = Array.from({ length: W > 700 ? 18 : 11 }, () => nueva(true)); cancelAnimationFrame(raf);
    if (quieto) { ctx.clearRect(0, 0, W, H); bs.forEach(dibujar); } else raf = requestAnimationFrame(cuadro); };
  iniciar();
  let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(iniciar, 150); });
  cab.addEventListener("pointerdown", (e) => { const r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    const i = bs.findIndex((b) => Math.hypot(b.x - px, b.y - py) < b.r + 10); if (i >= 0) { reventar(bs[i]); bs[i] = nueva(false); } });
  document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden && !quieto) raf = requestAnimationFrame(cuadro); });
})();
