// Matrix rain
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = [];

function initRain() {
  columns = Math.floor(canvas.width / fontSize);
  drops = [];
  for (let i = 0; i < columns; i++) drops[i] = 1;
}
initRain();
window.addEventListener('resize', () => { resizeCanvas(); initRain(); });

function draw() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#0F0';
  ctx.font = fontSize + 'px monospace';
  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
setInterval(draw, 40);

// Fading motto carousel – never horizontal, always wraps
const mottoEl = document.getElementById('mottoText');
const mottos = [
  'Win in silence, let results speak.',
  'Aim to be the top.',
  'Stay untouchable.',
  'Outwork everyone.',
  'Be the standard, not the competition.',
  'Leave no room for doubt.',
  'Become impossible to replace.',
  'Dominate with discipline.'
];

let currentMotto = 0;

function changeMotto() {
  // Fade out
  mottoEl.style.opacity = '0';
  setTimeout(() => {
    currentMotto = (currentMotto + 1) % mottos.length;
    mottoEl.textContent = mottos[currentMotto];
    // Fade in
    mottoEl.style.opacity = '1';
  }, 400);
}

// Start with first motto already visible
mottoEl.textContent = mottos[0];
setInterval(changeMotto, 3500);

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('active');
  }
});
