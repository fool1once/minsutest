links.forEach(link => {
  link.addEventListener('click', () => {

    const current = document.querySelector('.tab-content.active');

    // Fade out current
    current.style.opacity = "0";

    setTimeout(() => {
      current.classList.remove('active');

      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const next = document.getElementById(link.dataset.tab);
      next.classList.add('active');

    }, 200);

  });
});
