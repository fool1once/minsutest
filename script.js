// ===== Matrix Rain Effect =====
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);

const rainDrops = [];
for (let x = 0; x < columns; x++) {
  rainDrops[x] = 1;
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0F0';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < rainDrops.length; i++) {
    const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

    if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      rainDrops[i] = 0;
    }
    rainDrops[i]++;
  }
}

setInterval(drawMatrix, 40);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ===== TYPING ANIMATION =====
const typingText = document.getElementById('typingText');
const phrases = ['Full-Stack Developer', 'Cybersecurity Enthusiast', 'Open Source Contributor'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typingText.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 50;
  } else {
    typingText.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 120;
  }

  if (!isDeleting && charIndex === current.length) {
    typingSpeed = 1500; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingSpeed = 400;
  }

  setTimeout(type, typingSpeed);
}
setTimeout(type, 1000);

// ===== MOBILE HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ===== INTERACTIVE TERMINAL =====
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');

const commands = {
  help: 'Available commands: whoami, skills, projects, contact, clear, help',
  whoami: 'I am a developer obsessed with clean code, dark themes, and neon aesthetics.',
  skills: 'JavaScript, Python, React, Node.js, Docker, and more...',
  projects: 'Project Alpha, DarkNet Monitor, NeonBot — check the projects section above.',
  contact: 'Email: your.email@example.com | GitHub: @yourusername',
  clear: 'CLEAR_SCREEN',
};

terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmd = terminalInput.value.trim().toLowerCase();
    terminalInput.value = '';

    // Add command to output
    const cmdLine = document.createElement('p');
    cmdLine.innerHTML = `<span style="color:#0ff;">visitor@profile:~$</span> ${cmd}`;
    terminalOutput.appendChild(cmdLine);

    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    const response = commands[cmd] || `command not found: ${cmd}. Type 'help' for options.`;
    const resLine = document.createElement('p');
    resLine.textContent = `> ${response}`;
    resLine.style.color = '#0f0';
    terminalOutput.appendChild(resLine);

    // Auto-scroll
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
});

// Focus input on click anywhere in terminal box
document.querySelector('.terminal-box').addEventListener('click', () => {
  terminalInput.focus();
});
