/* ============================================================
   main.js — interactive layer for samehat12.github.io
   1. Dark mode toggle (persisted)
   2. Scroll-triggered fade-up animations
   3. Active nav highlighting
   4. Cursor sparkle trail
   5. Skill proficiency bar animation
   6. Contact modal open / close
   ============================================================ */


// ─── 1. DARK MODE ────────────────────────────────────────────
const darkToggle = document.getElementById('darkToggle');
const iconMoon   = document.getElementById('iconMoon');
const iconSun    = document.getElementById('iconSun');

function setDarkIcons(isDark) {
  iconMoon.style.display = isDark ? 'none' : '';
  iconSun.style.display  = isDark ? '' : 'none';
}

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  setDarkIcons(true);
}

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  setDarkIcons(isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});


// ─── 2. SCROLL-TRIGGERED FADE-UP ANIMATIONS ──────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-card, .timeline-item, .project-card').forEach(el => {
  el.classList.add('fade-up');
  fadeObserver.observe(el);
});

// Stagger timeline items per section
document.querySelectorAll('.timeline').forEach(tl => {
  tl.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.12}s`;
  });
});

// Stagger project cards
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});


// ─── 3. ACTIVE NAV HIGHLIGHTING ──────────────────────────────
const sections = document.querySelectorAll('[id]');
const navLinks = document.querySelectorAll('nav ul a');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('nav-active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();


// ─── 4. CURSOR SPARKLE TRAIL ─────────────────────────────────
const SPARKLE_CHARS        = ['✦', '✧', '⋆', '·', '✦'];
const SPARKLE_COLORS_LIGHT = ['#a0506a', '#5a4fa0', '#3a6645', '#2a5a80', '#a06020'];
const SPARKLE_COLORS_DARK  = ['#e8a8c0', '#b8acf0', '#90cc98', '#84b8e0', '#d4a068'];
let lastSparkle = 0;

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastSparkle < 60) return;
  lastSparkle = now;

  const isDark = document.body.classList.contains('dark');
  const colors = isDark ? SPARKLE_COLORS_DARK : SPARKLE_COLORS_LIGHT;

  const dot = document.createElement('span');
  dot.className   = 'sparkle-dot';
  dot.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
  dot.style.left  = e.clientX + (Math.random() * 12 - 6) + 'px';
  dot.style.top   = e.clientY + (Math.random() * 8  - 4) + 'px';
  dot.style.color = colors[Math.floor(Math.random() * colors.length)];

  document.body.appendChild(dot);
  setTimeout(() => dot.remove(), 700);
});


// ─── 5. SKILL PROFICIENCY BARS ───────────────────────────────
// Animate each .skill-fill bar to its data-pct width when the
// skill stack scrolls into view. Each bar gets a small staggered
// delay so they cascade in left-to-right, top-to-bottom.

const skillStack = document.getElementById('skillStack');

if (skillStack) {
  const allFills = skillStack.querySelectorAll('.skill-fill');

  // Assign staggered delays up front (before intersection fires)
  allFills.forEach((fill, i) => {
    fill.style.transitionDelay = `${i * 0.06}s`;
  });

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Animate every bar inside the stack
      allFills.forEach(fill => {
        const pct = fill.dataset.pct || 0;
        fill.style.width = pct + '%';
      });

      skillObserver.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  skillObserver.observe(skillStack);
}


// ─── 6. CONTACT MODAL ────────────────────────────────────────
function openContact() {
  document.getElementById('contactOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeContact() {
  document.getElementById('contactOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

window.openContact  = openContact;
window.closeContact = closeContact;

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeContact();
});