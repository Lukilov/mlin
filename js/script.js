// Smooth scroll for in-page anchors (href="#section-id")
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const id = this.getAttribute('href').substring(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
    }
  });
});

// Funkcija za rotacijo dogodkov (če boš dodal več)
document.querySelector('.carousel-prev').addEventListener('click', () => {
  alert('Prejšnji dogodek');
});

document.querySelector('.carousel-next').addEventListener('click', () => {
  alert('Naslednji dogodek');
});