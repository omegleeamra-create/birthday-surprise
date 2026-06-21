/* ============================================================
   BIRTHDAY SURPRISE — script.js
   All customisable values are at the top of this file.
   ============================================================ */

// ============================================================
//  ✏️  CUSTOMISE HERE
// ============================================================

/** The correct birthday passcode in DDMM format (e.g. 1505 for 15 May) */
const CORRECT_PASSWORD = "2206";

/** Her name shown on the final screen */
const HER_NAME = "HIYA";

/**
 * Background music URL.
 * Replace with a direct link to an MP3 / OGG file.
 * Free suggestions:
 *   • Upload your own file and paste its URL
 *   • Use a royalty-free service like Pixabay
 * Leave as "" to disable music entirely.
 */
const MUSIC_URL = "music.mp3";

/**
 * Photos for the gallery carousel.
 * Replace the `src` values with your actual image URLs or relative paths.
 * Add or remove objects to change the number of slides.
 */
const PHOTOS = [
  {
    src: "photo1.JPG",
    caption: "My favourite person ❤️"
  },
  {
    src: "photo2.JPG",
    caption: "My favorite Smile"
  },
  {
    src: "photo3.JPG",
    caption: "Forever my person 💕"
  },
  {
    src: "photo4.JPG",
    caption: "Every memory with you 🌸"
  }
];

/**
 * Love letter text.
 * \n creates a new line. Keep the spacing as you like.
 */
const LETTER_TEXT =
`Happy Birthday, My Love ❤️

Thank you for bringing happiness into my life.
Every day with you is my favourite day.

May your smile always stay bright and beautiful.
I wish you endless happiness, success, and countless
memories together.

I love you more than words can ever express.

Happy Birthday, Princess ❤️`;

// ============================================================
//  LOADING MESSAGES (Screen 3)
// ============================================================
const LOADING_MESSAGES = [
  "Preparing hugs ❤️",
  "Baking happiness 🎂",
  "Adding extra love 💕",
  "Loading memories ✨",
  "Wrapping your smile 🎁",
  "Almost there… 🌸"
];

// ============================================================
//  OPENING TYPEWRITER TEXT (Screen 1)
// ============================================================
const OPENING_TEXT = "One special night, one little surprise ❤️";

// ============================================================
//  AMBIENT PARTICLES
// ============================================================
const PARTICLE_EMOJIS = ["💖", "✨", "⭐", "🌸", "💫", "💕", "🌟", "❤️"];

// ============================================================
//  HELPERS
// ============================================================
function $(id) { return document.getElementById(id); }

function goTo(screenId, delay = 0) {
  setTimeout(() => {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    $(screenId).classList.add("active");
  }, delay);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================================
//  AMBIENT FLOATING PARTICLES
// ============================================================
(function spawnParticles() {
  const container = $("ambient-particles");
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      --dur: ${6 + Math.random() * 8}s;
      --delay: ${-Math.random() * 10}s;
      font-size: ${12 + Math.random() * 16}px;
    `;
    container.appendChild(p);
  }
})();

// ============================================================
//  MUSIC
// ============================================================
let bgMusic = null;
let musicPlaying = false;

if (MUSIC_URL) {
  bgMusic = new Audio(MUSIC_URL);
  bgMusic.loop = true;
  bgMusic.volume = 0.45;
}

$("music-btn").addEventListener("click", () => {
  if (!bgMusic) return;
  if (musicPlaying) {
    bgMusic.pause();
    $("music-btn").classList.remove("playing");
    $("music-btn").innerHTML = '<i class="fa-solid fa-music"></i>';
  } else {
    bgMusic.play().catch(() => {});
    $("music-btn").classList.add("playing");
    $("music-btn").innerHTML = '<i class="fa-solid fa-pause"></i>';
  }
  musicPlaying = !musicPlaying;
});

function tryPlayMusic() {
  if (bgMusic && !musicPlaying) {
    bgMusic.play().then(() => {
      musicPlaying = true;
      $("music-btn").classList.add("playing");
      $("music-btn").innerHTML = '<i class="fa-solid fa-pause"></i>';
    }).catch(() => {});
  }
}

// ============================================================
//  SCREEN 1 — OPENING TYPEWRITER
// ============================================================
(function initOpening() {
  const el = $("opening-text");
  let i = 0;
  function type() {
    if (i < OPENING_TEXT.length) {
      el.textContent += OPENING_TEXT[i++];
      setTimeout(type, 55);
    } else {
      el.style.borderRight = "none";
    }
  }
  setTimeout(type, 600);

  $("begin-btn").addEventListener("click", () => {
    tryPlayMusic();
    goTo("screen-2");
  });
})();

// ============================================================
//  SCREEN 2 — PASSCODE
// ============================================================
(function initPasscode() {
  let entered = "";

  function updateDots() {
    document.querySelectorAll("#passcode-dots .dot").forEach((d, i) => {
      d.classList.toggle("filled", i < entered.length);
    });
  }

  function showError() {
    const numpad = $("numpad");
    const err = $("error-msg");
    numpad.classList.add("shake");
    err.classList.add("visible");
    setTimeout(() => { numpad.classList.remove("shake"); }, 500);
    entered = "";
    updateDots();
  }

  function heartExplosion() {
    // Burst of confetti hearts
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      shapes: ["circle"],
      colors: ["#f06292", "#f48fb1", "#fce4ec", "#d63a6e", "#ffd6e7", "#ffffff"],
      scalar: 1.2
    });
  }

  function checkPassword() {
    if (entered === CORRECT_PASSWORD) {
      $("lock-icon").classList.add("unlocked");
      $("lock-icon").innerHTML = '<i class="fa-solid fa-lock-open"></i>';
      heartExplosion();
      goTo("screen-3", 1200);
      setTimeout(startLoading, 1300);
    } else {
      showError();
    }
  }

  document.querySelectorAll(".num-key[data-val]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (entered.length >= 4) return;
      entered += btn.dataset.val;
      updateDots();
      $("error-msg").classList.remove("visible");
      if (entered.length === 4) checkPassword();
    });
  });

  $("clear-key").addEventListener("click", () => {
    entered = entered.slice(0, -1);
    updateDots();
    $("error-msg").classList.remove("visible");
  });

  $("enter-key").addEventListener("click", () => {
    if (entered.length === 4) checkPassword();
  });
})();

// ============================================================
//  SCREEN 3 — LOADING
// ============================================================
function startLoading() {
  const bar   = $("progress-bar");
  const pct   = $("progress-percent");
  const msgEl = $("loading-msg");
  let progress = 0;
  let msgIdx   = 0;

  // Cycle messages every 1.2 s
  const msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
    msgEl.style.animation = "none";
    // Trigger reflow to re-run animation
    void msgEl.offsetWidth;
    msgEl.style.animation = "fadeSwap 0.5s ease";
    msgEl.textContent = LOADING_MESSAGES[msgIdx];
  }, 1200);

  // Increment progress
  const progInterval = setInterval(() => {
    progress += Math.random() * 4 + 1;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progInterval);
      clearInterval(msgInterval);
      msgEl.textContent = "Ready! 🎉";
      setTimeout(() => goTo("screen-4"), 900);
    }
    bar.style.width = progress + "%";
    pct.textContent = Math.floor(progress) + "%";
  }, 100);
}

// ============================================================
//  SCREEN 4 — BIRTHDAY CAKE
// ============================================================
(function initCake() {
  $("blow-btn").addEventListener("click", () => {
    // Extinguish flames
    document.querySelectorAll(".flame").forEach(f => {
      f.classList.add("blown");
      f.style.display = "none";
    });

    // Confetti burst
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.4 },
      colors: ["#f06292", "#ffd54f", "#f48fb1", "#fce4ec", "#ffffff", "#b3e5fc"]
    });
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60, spread: 70,
        origin: { x: 0, y: 0.5 },
        colors: ["#f06292", "#ffd54f", "#fce4ec"]
      });
      confetti({
        particleCount: 80,
        angle: 120, spread: 70,
        origin: { x: 1, y: 0.5 },
        colors: ["#f06292", "#ffd54f", "#fce4ec"]
      });
    }, 300);

    // Play happy birthday music (if music URL not set, just skip)
    if (bgMusic) {
      bgMusic.currentTime = 0;
      bgMusic.play().catch(() => {});
      musicPlaying = true;
      $("music-btn").classList.add("playing");
      $("music-btn").innerHTML = '<i class="fa-solid fa-pause"></i>';
    }

    setTimeout(() => goTo("screen-5"), 2200);
    setTimeout(buildGallery, 2000);
  });
})();

// ============================================================
//  SCREEN 5 — PHOTO GALLERY
// ============================================================
function buildGallery() {
  const carousel = $("carousel");
  const dots     = $("carousel-dots");
  carousel.innerHTML = "";
  dots.innerHTML = "";

  PHOTOS.forEach((photo, idx) => {
    // Slide
    const slide = document.createElement("div");
    slide.className = "carousel-slide";

    const frame = document.createElement("div");
    frame.className = "photo-frame";

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = "lazy";
    frame.appendChild(img);

    // Floating hearts on photo
    const heartsWrap = document.createElement("div");
    heartsWrap.className = "photo-hearts";
    ["💖", "✨", "💕", "❤️", "🌸"].forEach((em, hi) => {
      const h = document.createElement("span");
      h.className = "photo-heart";
      h.textContent = em;
      h.style.cssText = `
        left: ${10 + hi * 18}%;
        bottom: 10%;
        animation-delay: ${hi * 0.7}s;
        animation-duration: ${2.5 + hi * 0.4}s;
      `;
      heartsWrap.appendChild(h);
    });
    frame.appendChild(heartsWrap);

    const caption = document.createElement("p");
    caption.className = "photo-caption";
    caption.textContent = photo.caption;

    slide.appendChild(frame);
    slide.appendChild(caption);
    carousel.appendChild(slide);

    // Dot
    const dot = document.createElement("span");
    dot.className = "carousel-dot" + (idx === 0 ? " active" : "");
    dot.dataset.idx = idx;
    dot.addEventListener("click", () => goToSlide(idx));
    dots.appendChild(dot);
  });

  initCarousel();
}

function initCarousel() {
  const carousel = $("carousel");
  let current = 0;
  let startX = 0;
  let isDragging = false;

  function goToSlide(idx) {
    current = Math.max(0, Math.min(PHOTOS.length - 1, idx));
    carousel.style.transform = `translateX(-${current * 100}vw)`;
    document.querySelectorAll(".carousel-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
    if (current === PHOTOS.length - 1) {
      $("gallery-continue-btn").style.display = "inline-flex";
    }
  }

  // Touch / swipe
  carousel.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });
  carousel.addEventListener("touchend", e => {
    if (!isDragging) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -40) goToSlide(current + 1);
    else if (dx > 40) goToSlide(current - 1);
    isDragging = false;
  }, { passive: true });

  // Mouse drag (desktop fallback)
  carousel.addEventListener("mousedown", e => { startX = e.clientX; isDragging = true; });
  carousel.addEventListener("mouseup", e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    if (dx < -40) goToSlide(current + 1);
    else if (dx > 40) goToSlide(current - 1);
    isDragging = false;
  });

  // Expose for dot clicks
  document.querySelectorAll(".carousel-dot").forEach(d => {
    d.addEventListener("click", () => goToSlide(+d.dataset.idx));
  });

  $("gallery-continue-btn").addEventListener("click", () => {
    goTo("screen-6");
    setTimeout(startLetter, 400);
  });
}

// ============================================================
//  SCREEN 6 — LOVE LETTER TYPEWRITER
// ============================================================
function startLetter() {
  const el = $("letter-text");
  el.textContent = "";
  let i = 0;
  function type() {
    if (i < LETTER_TEXT.length) {
      el.textContent += LETTER_TEXT[i++];
      setTimeout(type, 28);
    } else {
      document.querySelector(".letter-sign").classList.add("visible");
      setTimeout(() => {
        $("letter-next-btn").style.display = "inline-flex";
      }, 600);
    }
  }
  setTimeout(type, 400);

  $("letter-next-btn").addEventListener("click", () => {
    goTo("screen-7");
    setTimeout(startFinal, 500);
  }, { once: true });
}

// ============================================================
//  SCREEN 7 — FINAL CELEBRATION
// ============================================================
function startFinal() {
  // Set her name
  $("final-name").textContent = HER_NAME;

  // Balloons
  const balloonsWrap = $("balloons");
  const balloonEmojis = ["🎈", "🎀", "💖", "🎊", "🎉"];
  for (let i = 0; i < 12; i++) {
    const b = document.createElement("span");
    b.className = "balloon";
    b.textContent = balloonEmojis[i % balloonEmojis.length];
    b.style.cssText = `
      left: ${Math.random() * 90}%;
      font-size: ${32 + Math.random() * 20}px;
      --dur: ${5 + Math.random() * 5}s;
      --delay: ${-Math.random() * 5}s;
    `;
    balloonsWrap.appendChild(b);
  }

  // Rising hearts
  const heartsWrap = $("rising-hearts");
  const heartEmojis = ["❤️", "💖", "💕", "💗", "💓", "✨"];
  for (let i = 0; i < 24; i++) {
    const h = document.createElement("span");
    h.className = "rising-heart";
    h.textContent = heartEmojis[i % heartEmojis.length];
    h.style.cssText = `
      left: ${Math.random() * 95}%;
      font-size: ${14 + Math.random() * 14}px;
      --dur: ${4 + Math.random() * 5}s;
      --delay: ${-Math.random() * 6}s;
    `;
    heartsWrap.appendChild(h);
  }

  // Big confetti burst
  const burstConfetti = () => {
    confetti({
      particleCount: 160,
      spread: 120,
      origin: { y: 0.3 },
      colors: ["#f06292", "#ffd54f", "#fce4ec", "#d63a6e", "#ffffff", "#b3e5fc", "#a5d6a7"]
    });
  };
  burstConfetti();
  setTimeout(burstConfetti, 700);
  setTimeout(burstConfetti, 1400);

  // Fireworks on canvas
  launchFireworks();

  // Replay button
  $("replay-btn").addEventListener("click", () => {
    // Reset everything and go back to screen 1
    location.reload();
  });
}

// ============================================================
//  FIREWORKS (canvas)
// ============================================================
function launchFireworks() {
  const canvas = $("fireworks-canvas");
  const ctx    = canvas.getContext("2d");

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COLORS = ["#f06292","#ffd54f","#fce4ec","#d63a6e","#ffffff","#b3e5fc","#81c784","#ff8a65"];
  const particles = [];

  class Particle {
    constructor(x, y, color) {
      this.x = x; this.y = y; this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.radius = 2 + Math.random() * 2;
      this.gravity = 0.06;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.alpha -= 0.016;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function explode(x, y) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle(x, y, color));
    }
    // Confetti burst at same position
    confetti({
      particleCount: 40,
      spread: 60,
      origin: {
        x: x / canvas.width,
        y: y / canvas.height
      },
      colors: COLORS,
      scalar: 0.9
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(loop);
  }
  loop();

  // Fire 6 fireworks, then repeat
  function fire() {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        explode(
          50 + Math.random() * (canvas.width - 100),
          30 + Math.random() * (canvas.height * 0.55)
        );
      }, i * 250);
    }
  }
  fire();
  const fwInterval = setInterval(fire, 2000);

  // Stop fireworks when leaving screen 7
  const obs = new MutationObserver(() => {
    if (!$("screen-7").classList.contains("active")) {
      clearInterval(fwInterval);
      obs.disconnect();
    }
  });
  obs.observe($("screen-7"), { attributes: true, attributeFilter: ["class"] });
}
