// SELECT ELEMENTS
const links = document.querySelectorAll('.nav-link');
const tabs = document.querySelectorAll('.tab-content');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

// TAB SWITCHING (SAFE)
links.forEach(link => {
  link.addEventListener('click', () => {

    const targetId = link.getAttribute('data-tab');
    const nextTab = document.getElementById(targetId);

    if (!nextTab) return; // prevent crash

    // REMOVE ACTIVE STATES
    links.forEach(l => l.classList.remove('active'));
    tabs.forEach(tab => {
      tab.classList.remove('active');
      tab.style.opacity = 0;
    });

    // ACTIVATE CLICKED LINK
    link.classList.add('active');

    // SHOW TARGET TAB WITH ANIMATION
    nextTab.classList.add('active');

    setTimeout(() => {
      nextTab.style.opacity = 1;
    }, 50);

    // CLOSE MOBILE MENU
    if (nav) nav.classList.remove('show');
  });
});

// MOBILE MENU FIX
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('show');
  });
}

// LEADERBOARD (SAFE LOAD)
const leaderboardData = [
  { name: "Player1", score: 10 },
  { name: "Player2", score: 8 },
  { name: "Player3", score: 5 }
];

const list = document.getElementById("leaderboard-list");

if (list) {
  leaderboardData
    .sort((a, b) => b.score - a.score)
    .forEach(player => {
      const li = document.createElement("li");
      li.textContent = `${player.name} - ${player.score} pts`;
      list.appendChild(li);
    });
}
