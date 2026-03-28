const elements = document.querySelectorAll('.fade-in');

window.addEventListener('load', () => {
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('show');
    }, index * 300);
  });
});
