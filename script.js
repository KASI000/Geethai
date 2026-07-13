/* ============================================================
   OUR STORY — AURORA NEON EDITION — script.js
   The most interactive edition: parallax aurora blobs, a
   click-anywhere spark burst, a drag-to-swipe photo deck, and
   a draggable "love meter" — on top of the same core mechanics
   used by every edition (confetti, fireworks, typewriter, etc).
   Search "REPLACE" for every spot you should customize.
============================================================= */

/* ============================================================
   0. CONFIG
============================================================= */
const CONFIG = {
  // ✍️ REPLACE with your own love letter (page 4). Use \n\n for paragraph breaks.
  loveLetter:
`My love,

I don't say this enough, so I wanted to put it somewhere you could come back to.

You make the ordinary parts of my life feel worth showing up for. I love the way you see the world, the way you care for people without needing credit, and the way you still get excited over the little things.

There's more I want to tell you — keep going.`,

  // 🎂 REPLACE with your own birthday message (page 2)
  birthdayMessage:
    "Another year of you means another year the world got a little brighter. I hope today is filled with everything that makes you smile.",

  // ❤️ REPLACE / add / remove reasons (page 5)
  reasons: [
    { icon: "✦", front: "Your smile", back: "It's the first thing I look for in a room." },
    { icon: "✦", front: "Your kindness", back: "You make people feel safe just by being near them." },
    { icon: "✦", front: "Your laugh", back: "Loud, sudden, and my favorite sound." },
    { icon: "✦", front: "Your support", back: "You show up for me even on my hardest days." },
    { icon: "✦", front: "Your heart", back: "Gentle with everyone, even when it isn't easy." },
    { icon: "✦", front: "Our late nights", back: "Talking to you never once felt like enough time." },
  ],

  // 📸 REPLACE captions (page 3) — pair with real images in memories.html
  memoryCaptions: [
    "The day we couldn't stop laughing",
    "That little café we found by accident",
    "Golden hour, right on time",
    "You, mid-sentence, mid-smile",
    "A quiet night that felt like everything",
  ],

  // 🌙 REPLACE the sequence shown on the romantic night scene (proposal.html)
  nightSequence: [
    "I've wanted to tell you something for a long time...",
    "I think you're amazing.",
    "You make my life happier.",
    "You mean so much to me.",
  ],
  nightFinal: "I Love You ❤️",
};

/* ============================================================
   1. LOADER
============================================================= */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) setTimeout(() => loader.classList.add("loader-hidden"), 850);
});

/* ============================================================
   2. PAGE TRANSITIONS
============================================================= */
document.body.classList.add("page-enter");
document.querySelectorAll(".page-link").forEach(link => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || link.target === "_blank") return;
    e.preventDefault();
    const curtain = document.getElementById("curtain");
    if (curtain) {
      curtain.classList.add("leaving");
      setTimeout(() => { window.location.href = href; }, 600);
    } else {
      window.location.href = href;
    }
  });
});

/* ============================================================
   3. RIPPLE EFFECT
============================================================= */
function attachRipple(btn) {
  if (!btn) return;
  btn.style.position = btn.style.position || "relative";
  btn.style.overflow = "hidden";
  btn.addEventListener("click", (e) => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
    ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 750);
  });
}
document.querySelectorAll(".neon-btn, .ghost-neon-btn, .yes-btn, .wait-btn").forEach(attachRipple);

/* ============================================================
   4. AURORA BLOBS — parallax on mouse move + scroll
============================================================= */
function spawnAurora() {
  const layer = document.getElementById("aurora-layer");
  if (!layer) return;
  const specs = [
    { color: "var(--neon-pink)", size: 420, top: "10%", left: "10%", depth: 30 },
    { color: "var(--neon-violet)", size: 380, top: "40%", left: "60%", depth: 50 },
    { color: "var(--neon-cyan)", size: 340, top: "65%", left: "20%", depth: 20 },
  ];
  specs.forEach(s => {
    const el = document.createElement("div");
    el.className = "aurora-blob";
    el.style.width = el.style.height = s.size + "px";
    el.style.top = s.top; el.style.left = s.left;
    el.style.background = s.color;
    el.dataset.depth = s.depth;
    layer.appendChild(el);
  });
  const blobs = layer.querySelectorAll(".aurora-blob");
  window.addEventListener("mousemove", (e) => {
    const px = (e.clientX / window.innerWidth - 0.5);
    const py = (e.clientY / window.innerHeight - 0.5);
    blobs.forEach(b => {
      const depth = +b.dataset.depth;
      b.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
    });
  });
}
spawnAurora();

/* ============================================================
   5. CLICK-ANYWHERE SPARK BURST
============================================================= */
const clickCanvas = document.getElementById("click-canvas");
let clickCtx, clickParticles = [], clickRunning = false;
if (clickCanvas) {
  clickCtx = clickCanvas.getContext("2d");
  const resizeClick = () => { clickCanvas.width = innerWidth; clickCanvas.height = innerHeight; };
  resizeClick();
  window.addEventListener("resize", resizeClick);

  document.addEventListener("pointerdown", (e) => {
    // Don't spam bursts on top of buttons/links being pressed rapidly — still fun, just gentle
    const colors = ["#ff2d95", "#8b3bff", "#21e6c1", "#ffd447"];
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      clickParticles.push({
        x: e.clientX, y: e.clientY,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        alpha: 1, color: colors[Math.floor(Math.random() * colors.length)], r: 2 + Math.random() * 2,
      });
    }
    if (!clickRunning) runClickLoop();
  });
}
function runClickLoop() {
  clickRunning = true;
  clickCtx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
  clickParticles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.alpha -= 0.02;
    clickCtx.globalAlpha = Math.max(p.alpha, 0);
    clickCtx.fillStyle = p.color;
    clickCtx.beginPath(); clickCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2); clickCtx.fill();
  });
  clickCtx.globalAlpha = 1;
  clickParticles = clickParticles.filter(p => p.alpha > 0);
  if (clickParticles.length > 0) requestAnimationFrame(runClickLoop);
  else { clickRunning = false; clickCtx.clearRect(0, 0, clickCanvas.width, clickCanvas.height); }
}

/* ============================================================
   6. SCROLL REVEAL
============================================================= */
const revealTargets = document.querySelectorAll(".reveal");
if (revealTargets.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("in-view"); });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));
}

/* ============================================================
   7. AMBIENT EFFECTS — hearts, petals, stars, fireflies, flowers, roses
============================================================= */
function spawnHeart() {
  const layer = document.getElementById("hearts-layer");
  if (!layer) return;
  const el = document.createElement("div");
  el.className = "floating-heart";
  el.textContent = "❤";
  el.style.left = Math.random() * 100 + "vw";
  el.style.setProperty("--sz", 12 + Math.random() * 16 + "px");
  el.style.setProperty("--dur", 9 + Math.random() * 7 + "s");
  el.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
  layer.appendChild(el);
  setTimeout(() => el.remove(), 17000);
}
function spawnPetal() {
  const layer = document.getElementById("petals-layer");
  if (!layer) return;
  const el = document.createElement("div");
  el.className = "petal";
  el.style.left = Math.random() * 100 + "vw";
  el.style.setProperty("--sz", 9 + Math.random() * 9 + "px");
  el.style.setProperty("--dur", 8 + Math.random() * 6 + "s");
  el.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
  layer.appendChild(el);
  setTimeout(() => el.remove(), 15000);
}
function spawnRose() {
  const layer = document.getElementById("roses-layer");
  if (!layer) return;
  const el = document.createElement("div");
  el.className = "rose-drift";
  el.textContent = "🌹";
  el.style.left = Math.random() * 100 + "vw";
  el.style.setProperty("--dur", 10 + Math.random() * 6 + "s");
  layer.appendChild(el);
  setTimeout(() => el.remove(), 17000);
}
function spawnStars(count = 70) {
  const layer = document.getElementById("stars-layer");
  if (!layer) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "star";
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = Math.random() * 100 + "vh";
    el.style.setProperty("--sz", 1 + Math.random() * 2.4 + "px");
    el.style.setProperty("--dur", 2 + Math.random() * 4 + "s");
    el.style.animationDelay = Math.random() * 4 + "s";
    layer.appendChild(el);
  }
}
function spawnFireflies(count = 16) {
  const layer = document.getElementById("fireflies-layer");
  if (!layer) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "firefly";
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = 40 + Math.random() * 55 + "vh";
    el.style.setProperty("--dur", 9 + Math.random() * 8 + "s");
    el.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
    el.style.setProperty("--dy", (Math.random() * -60) + "px");
    el.style.setProperty("--dx2", (Math.random() * 80 - 40) + "px");
    el.style.setProperty("--dy2", (Math.random() * -100) + "px");
    el.style.animationDelay = Math.random() * 6 + "s";
    layer.appendChild(el);
  }
}
function spawnFlowers() {
  const layer = document.getElementById("flowers-layer");
  if (!layer) return;
  const blooms = ["🌸", "🌺", "🌷", "🌹"];
  for (let i = 0; i < 8; i++) {
    const el = document.createElement("div");
    el.className = "flower";
    el.textContent = blooms[i % blooms.length];
    el.style.left = (i * 13 + Math.random() * 6) + "%";
    el.style.animationDelay = Math.random() * 3 + "s";
    layer.appendChild(el);
  }
}
spawnStars();
spawnFireflies();
spawnFlowers();
setInterval(spawnHeart, 1000);
setInterval(spawnPetal, 1000);
setInterval(spawnRose, 1500);

function spawnBalloons() {
  const wrap = document.getElementById("balloons");
  if (!wrap) return;
  const colors = ["#ff2d95", "#8b3bff", "#21e6c1", "#ffd447", "#3b6bff"];
  for (let i = 0; i < 10; i++) {
    const el = document.createElement("div");
    el.className = "balloon";
    el.style.left = (5 + Math.random() * 90) + "%";
    el.style.color = colors[i % colors.length];
    el.style.background = `radial-gradient(circle at 30% 25%, #fff4, transparent 40%), ${colors[i % colors.length]}`;
    el.style.setProperty("--dur", 12 + Math.random() * 8 + "s");
    el.style.animationDelay = (Math.random() * 10) + "s";
    wrap.appendChild(el);
  }
}
function spawnGifts() {
  const wrap = document.getElementById("gifts");
  if (!wrap) return;
  const icons = ["🎁", "🎀", "💝"];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement("div");
    el.className = "gift";
    el.textContent = icons[i % icons.length];
    el.style.left = (Math.random() * 90) + "%";
    el.style.setProperty("--dur", 14 + Math.random() * 8 + "s");
    el.style.animationDelay = (Math.random() * 12) + "s";
    wrap.appendChild(el);
  }
}
spawnBalloons();
spawnGifts();

/* ============================================================
   8. CONFETTI + FIREWORKS
============================================================= */
const confettiCanvas = document.getElementById("confetti-canvas");
const fireworksCanvas = document.getElementById("fireworks-canvas");
let confettiCtx, fireworksCtx;
if (confettiCanvas) confettiCtx = confettiCanvas.getContext("2d");
if (fireworksCanvas) fireworksCtx = fireworksCanvas.getContext("2d");
function resizeCanvases() {
  [confettiCanvas, fireworksCanvas].forEach(c => { if (!c) return; c.width = innerWidth; c.height = innerHeight; });
}
resizeCanvases();
window.addEventListener("resize", resizeCanvases);

const paletteColors = ["#ff2d95", "#8b3bff", "#21e6c1", "#ffd447", "#3b6bff", "#fff"];

let confettiPieces = [], confettiRunning = false;
function fireConfetti(durationMs = 3000, count = 140) {
  if (!confettiCtx) return;
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width, y: -20 - Math.random() * 200,
      w: 6 + Math.random() * 6, h: 10 + Math.random() * 8,
      color: paletteColors[Math.floor(Math.random() * paletteColors.length)],
      vy: 2 + Math.random() * 3, vx: -1.5 + Math.random() * 3,
      rot: Math.random() * 360, vr: -6 + Math.random() * 12,
    });
  }
  if (!confettiRunning) runConfettiLoop();
  clearTimeout(fireConfetti._t);
  fireConfetti._t = setTimeout(() => { confettiPieces = []; }, durationMs + 2000);
}
function runConfettiLoop() {
  confettiRunning = true;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    confettiCtx.save(); confettiCtx.translate(p.x, p.y); confettiCtx.rotate(p.rot * Math.PI / 180);
    confettiCtx.fillStyle = p.color; confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); confettiCtx.restore();
  });
  confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 30);
  if (confettiPieces.length > 0) requestAnimationFrame(runConfettiLoop);
  else { confettiRunning = false; confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); }
}

let fireworkParticles = [], fireworksRunning = false;
function launchFirework(x, y) {
  if (!fireworksCtx) return;
  const color = paletteColors[Math.floor(Math.random() * paletteColors.length)];
  for (let i = 0; i < 40; i++) {
    const angle = (Math.PI * 2 * i) / 40, speed = 2 + Math.random() * 3;
    fireworkParticles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, alpha: 1, color });
  }
  if (!fireworksRunning) runFireworksLoop();
}
function fireFireworks(bursts = 6, spanMs = 2200) {
  if (!fireworksCanvas) return;
  for (let i = 0; i < bursts; i++) {
    setTimeout(() => {
      launchFirework(fireworksCanvas.width * (0.2 + Math.random() * 0.6), fireworksCanvas.height * (0.2 + Math.random() * 0.4));
    }, (i * spanMs) / bursts);
  }
}
function runFireworksLoop() {
  fireworksRunning = true;
  fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  fireworkParticles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.alpha -= 0.012;
    fireworksCtx.globalAlpha = Math.max(p.alpha, 0);
    fireworksCtx.fillStyle = p.color;
    fireworksCtx.beginPath(); fireworksCtx.arc(p.x, p.y, 2.4, 0, Math.PI * 2); fireworksCtx.fill();
  });
  fireworksCtx.globalAlpha = 1;
  fireworkParticles = fireworkParticles.filter(p => p.alpha > 0);
  if (fireworkParticles.length > 0) requestAnimationFrame(runFireworksLoop);
  else { fireworksRunning = false; fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height); }
}
function heartExplosion() {
  const layer = document.getElementById("hearts-layer");
  if (!layer) return;
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "floating-heart";
      el.textContent = "❤";
      el.style.left = 40 + Math.random() * 20 + "vw";
      el.style.bottom = "40vh";
      el.style.setProperty("--sz", 16 + Math.random() * 22 + "px");
      el.style.setProperty("--dur", 3 + Math.random() * 3 + "s");
      el.style.setProperty("--drift", (Math.random() * 200 - 100) + "px");
      layer.appendChild(el);
      setTimeout(() => el.remove(), 6500);
    }, i * 30);
  }
}

/* ============================================================
   9. MUSIC TOGGLE
============================================================= */
const bgAudio = document.getElementById("bgAudio");
const musicToggle = document.getElementById("musicToggle");
function playAudio() {
  if (!bgAudio) return;
  bgAudio.play().catch(() => {});
  if (musicToggle) musicToggle.classList.add("playing");
}
function pauseAudio() {
  if (!bgAudio) return;
  bgAudio.pause();
  if (musicToggle) musicToggle.classList.remove("playing");
}
if (musicToggle) {
  musicToggle.addEventListener("click", () => { if (!bgAudio) return; bgAudio.paused ? playAudio() : pauseAudio(); });
}

/* ============================================================
   10. PAGE 1 — WELCOME
============================================================= */
const openSurpriseBtn = document.getElementById("openSurpriseBtn");
if (openSurpriseBtn) openSurpriseBtn.addEventListener("click", () => { if (bgAudio && bgAudio.paused) playAudio(); });

/* ============================================================
   11. PAGE 2 — BIRTHDAY
============================================================= */
const hbText = document.getElementById("happyBirthdayText");
if (hbText) {
  const text = hbText.textContent;
  hbText.textContent = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "letter-pop";
    span.style.animationDelay = (i * 0.06) + "s";
    span.textContent = ch === " " ? "\u00A0" : ch;
    hbText.appendChild(span);
  });
  window.addEventListener("load", () => {
    setTimeout(() => { fireConfetti(3000, 150); fireFireworks(5, 2000); playAudio(); }, 700);
  });
}
const birthdayMsgEl = document.getElementById("birthdayMessage");
if (birthdayMsgEl) birthdayMsgEl.textContent = CONFIG.birthdayMessage;

/* ============================================================
   12. PAGE 3 — MEMORY GALLERY (drag-to-swipe deck)
============================================================= */
const swipeDeck = document.getElementById("swipeDeck");
if (swipeDeck) {
  const cards = [...swipeDeck.querySelectorAll(".swipe-card")];
  const dotsWrap = document.getElementById("slideDots");
  let current = 0;

  cards.forEach((c, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsWrap.appendChild(dot);
    c.style.zIndex = cards.length - i;
  });
  const dots = dotsWrap.querySelectorAll("span");

  function layoutCards() {
    cards.forEach((c, i) => {
      const offset = i - current;
      if (offset < 0) {
        c.style.transform = `translateX(${-window.innerWidth}px) rotate(-8deg)`;
        c.style.opacity = "0";
      } else {
        c.style.transform = `translateY(${offset * 10}px) scale(${1 - offset * 0.04})`;
        c.style.opacity = offset > 2 ? "0" : "1";
      }
    });
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }
  layoutCards();

  function goNext() {
    if (current >= cards.length - 1) { current = 0; } else { current++; }
    layoutCards();
  }

  // Drag / swipe handling on the top card
  let startX = 0, startY = 0, dragging = false, dragCard = null;
  function onDown(e) {
    dragCard = cards[current];
    if (!dragCard) return;
    dragging = true;
    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX; startY = point.clientY;
    dragCard.style.transition = "none";
  }
  function onMove(e) {
    if (!dragging || !dragCard) return;
    const point = e.touches ? e.touches[0] : e;
    const dx = point.clientX - startX;
    const dy = point.clientY - startY;
    dragCard.style.transform = `translate(${dx}px, ${dy * 0.2}px) rotate(${dx / 20}deg)`;
  }
  function onUp(e) {
    if (!dragging || !dragCard) return;
    dragging = false;
    const point = e.changedTouches ? e.changedTouches[0] : e;
    const dx = point.clientX - startX;
    dragCard.style.transition = "";
    if (Math.abs(dx) > 90) {
      dragCard.style.transform = `translateX(${dx > 0 ? 600 : -600}px) rotate(${dx / 10}deg)`;
      dragCard.style.opacity = "0";
      setTimeout(() => { goNext(); }, 250);
    } else {
      layoutCards();
    }
  }
  swipeDeck.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  swipeDeck.addEventListener("touchstart", onDown, { passive: true });
  swipeDeck.addEventListener("touchmove", onMove, { passive: true });
  swipeDeck.addEventListener("touchend", onUp);

  // Auto-advance gently so it still feels alive if the visitor doesn't drag
  setInterval(() => { if (!dragging) goNext(); }, 4500);
}

/* ============================================================
   13. PAGE 4 — LOVE LETTER
============================================================= */
const paperEl = document.getElementById("paper");
const letterTextEl = document.getElementById("letterText");
if (paperEl && letterTextEl) {
  setTimeout(() => { paperEl.classList.add("open"); setTimeout(() => typewrite(CONFIG.loveLetter, letterTextEl), 800); }, 500);
}
function typewrite(text, el, speed = 22) {
  el.textContent = "";
  const cursor = document.createElement("span");
  cursor.className = "cursor"; cursor.textContent = "\u00A0";
  let i = 0;
  function step() {
    if (i <= text.length) { el.textContent = text.slice(0, i); el.appendChild(cursor); i++; setTimeout(step, speed); }
    else cursor.remove();
  }
  step();
}

/* ============================================================
   14. PAGE 5 — REASONS (tilt cards) + LOVE METER (draggable)
============================================================= */
const reasonsGrid = document.getElementById("reasonsGrid");
if (reasonsGrid) {
  CONFIG.reasons.forEach((r, i) => {
    const card = document.createElement("div");
    card.className = "tilt-card glass reveal reveal-delay-" + ((i % 3) + 1);
    card.innerHTML = `
      <span class="tilt-index">0${i + 1}</span>
      <span class="tilt-icon">${r.icon}</span>
      <p>${r.front} — <span style="color:var(--neon-cyan);">${r.back}</span></p>`;
    reasonsGrid.appendChild(card);
  });
  const cards = reasonsGrid.querySelectorAll(".tilt-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const rotX = ((y - rect.height / 2) / rect.height) * -12;
      const rotY = ((x - rect.width / 2) / rect.width) * 12;
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = "perspective(700px) rotateX(0) rotateY(0) scale(1)"; });
  });
  const revealObserver2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("in-view"); });
  }, { threshold: 0.15 });
  cards.forEach(c => revealObserver2.observe(c));
}

const loveMeterTrack = document.getElementById("loveMeterTrack");
if (loveMeterTrack) {
  const fill = document.getElementById("loveMeterFill");
  const handle = document.getElementById("loveMeterHandle");
  const label = document.getElementById("loveMeterLabel");
  const labels = ["a little", "quite a lot", "so much", "endlessly", "completely, utterly, forever"];

  function setMeter(pct) {
    pct = Math.max(4, Math.min(100, pct));
    fill.style.width = pct + "%";
    handle.style.left = pct + "%";
    const idx = Math.min(labels.length - 1, Math.floor((pct / 100) * labels.length));
    label.textContent = "I love you " + labels[idx];
    if (pct >= 98 && !loveMeterTrack.dataset.maxed) {
      loveMeterTrack.dataset.maxed = "1";
      fireConfetti(1500, 60);
    } else if (pct < 98) {
      loveMeterTrack.dataset.maxed = "";
    }
  }
  function pctFromEvent(e) {
    const rect = loveMeterTrack.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return ((point.clientX - rect.left) / rect.width) * 100;
  }
  let draggingMeter = false;
  handle.addEventListener("mousedown", () => draggingMeter = true);
  handle.addEventListener("touchstart", () => draggingMeter = true, { passive: true });
  loveMeterTrack.addEventListener("mousedown", (e) => { draggingMeter = true; setMeter(pctFromEvent(e)); });
  window.addEventListener("mousemove", (e) => { if (draggingMeter) setMeter(pctFromEvent(e)); });
  window.addEventListener("mouseup", () => draggingMeter = false);
  loveMeterTrack.addEventListener("touchmove", (e) => setMeter(pctFromEvent(e)), { passive: true });
  window.addEventListener("touchend", () => draggingMeter = false);
  setMeter(20);
}

/* ============================================================
   15. ROMANTIC NIGHT + PROPOSAL
============================================================= */
const nightSequenceEl = document.getElementById("nightSequence");
if (nightSequenceEl) {
  const lines = [...CONFIG.nightSequence, CONFIG.nightFinal];
  let idx = 0;
  function showNextLine() {
    nightSequenceEl.innerHTML = "";
    const p = document.createElement("p");
    p.className = "night-line" + (idx === lines.length - 1 ? " final" : "");
    p.textContent = lines[idx];
    nightSequenceEl.appendChild(p);
    requestAnimationFrame(() => p.classList.add("show"));
    if (idx < lines.length - 1) { idx++; setTimeout(showNextLine, 2900); }
    else { setTimeout(() => document.getElementById("nightContinueBtn")?.classList.remove("hidden"), 1000); }
  }
  showNextLine();
}
const nightContinueBtn = document.getElementById("nightContinueBtn");
if (nightContinueBtn) {
  nightContinueBtn.addEventListener("click", () => {
    nightContinueBtn.classList.add("hidden");
    nightSequenceEl.classList.add("hidden");
    document.getElementById("proposalWrap")?.classList.remove("hidden");
  });
}

const yesBtn = document.getElementById("yesBtn");
const waitBtn = document.getElementById("waitBtn");
const proposalPre = document.getElementById("proposalPre");
const proposalResult = document.getElementById("proposalResult");

if (yesBtn) {
  yesBtn.addEventListener("click", () => {
    proposalPre.classList.add("hidden");
    proposalResult.innerHTML = `
      <div class="thankyou-heart">💖</div>
      <h2 class="neon-heading">Thank You <span class="glow">❤️</span></h2>
      <p class="section-sub">This is the best answer I've ever received. Here's to us.</p>
      <a href="final.html" class="neon-btn page-link" style="margin-top:10px;">See What Comes Next →</a>`;
    proposalResult.classList.remove("hidden");
    proposalResult.classList.add("fade-in-result");
    fireConfetti(3500, 180); fireFireworks(8, 2600); heartExplosion(); playAudio();
    attachRipple(proposalResult.querySelector(".page-link"));
  });
}
if (waitBtn) {
  waitBtn.addEventListener("click", () => {
    proposalPre.classList.add("hidden");
    proposalResult.innerHTML = `<p class="gentle-response">I completely understand. Thank you for taking the time to visit this surprise.<br>Your comfort and happiness are what matter most.</p>`;
    proposalResult.classList.remove("hidden");
    proposalResult.classList.add("fade-in-result");
  });
}

/* ============================================================
   16. FINAL PAGE
============================================================= */
const shareBtn = document.getElementById("shareBtn");
if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const url = window.location.href.replace("final.html", "index.html");
    if (navigator.share) {
      try { await navigator.share({ title: "Our Story", text: "I made something for you 💕", url }); } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        shareBtn.textContent = "Link Copied";
        setTimeout(() => { shareBtn.textContent = "Share Our Story"; }, 1800);
      } catch (e) { prompt("Copy this link:", url); }
    }
  });
}
const downloadBtn = document.getElementById("downloadBtn");
if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800; canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 800, 1000);
    grad.addColorStop(0, "#05060f"); grad.addColorStop(0.5, "#12152f"); grad.addColorStop(1, "#1b2044");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 800, 1000);
    ctx.strokeStyle = "#21e6c1"; ctx.lineWidth = 3; ctx.strokeRect(30, 30, 740, 940);
    ctx.fillStyle = "#ff2d95"; ctx.font = "120px Georgia"; ctx.textAlign = "center"; ctx.fillText("❤", 400, 380);
    ctx.fillStyle = "#f5f3ff"; ctx.font = "italic 40px Georgia";
    ctx.fillText("Our story starts with", 400, 500);
    ctx.fillText("honesty, respect,", 400, 555);
    ctx.fillText("and happiness.", 400, 610);
    ctx.fillStyle = "#21e6c1"; ctx.font = "52px Georgia"; ctx.fillText("Forever With You", 400, 760);
    ctx.fillStyle = "#8280a3"; ctx.font = "22px Georgia"; ctx.fillText(new Date().toLocaleDateString(), 400, 820);
    const link = document.createElement("a");
    link.download = "our-memory-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

/* ============================================================
   17. STORY PROGRESS
============================================================= */
document.querySelectorAll(".story-progress .bud").forEach(bud => {
  const file = bud.getAttribute("data-page");
  if (window.location.pathname.endsWith(file)) bud.classList.add("active");
});
