const links = document.querySelectorAll('.nav-link');
const tabs = document.querySelectorAll('.tab-content');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

/* TAB SWITCHING */
links.forEach(link => {
  link.addEventListener('click', () => {
    
    // Remove active from all
    links.forEach(l => l.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));

    // Activate clicked
    link.classList.add('active');
    const tab = document.getElementById(link.dataset.tab);
    tab.classList.add('active');

    // Close mobile menu
    nav.classList.remove('show');
  });
});

/* MOBILE MENU */
menuToggle.addEventListener('click', () => {
  nav.classList.toggle('show');
});

/* SIMPLE LEADERBOARD DATA */
const leaderboardData = [
  { name: "Player1", score: 10 },
  { name: "Player2", score: 8 },
  { name: "Player3", score: 5 }
];

const list = document.getElementById("leaderboard-list");

leaderboardData
  .sort((a, b) => b.score - a.score)
  .forEach(player => {
    const li = document.createElement("li");
    li.textContent = `${player.name} - ${player.score} pts`;
    list.appendChild(li);
  });
