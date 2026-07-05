(function() {
  const slides = document.querySelectorAll('.hero-slider .slide');
  const prev = document.querySelector('.slider-arrow.prev');
  const next = document.querySelector('.slider-arrow.next');
  let current = 0;

  function show(idx) {
    slides.forEach(s => s.classList.remove('active'));
    slides[idx].classList.add('active');
  }

  prev.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    show(current);
  });

  next.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    show(current);
  });

  // Auto-rotate every 5s (optional)
  setInterval(() => {
    current = (current + 1) % slides.length;
    show(current);
  }, 5000);
})();