document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const activeByPage = {
    'index.html': 'Domov',
    'zgodovina.html': 'Spoznaj',
    'utrinki-dediscina.html': 'Spoznaj',
    'mlinarstvo.html': 'Odkrij',
    'slikar.html': 'Odkrij',
    'arhitektura.html': 'Odkrij',
    'tehnicna.html': 'Odkrij',
    'povzdviguj.html': 'Doživi',
    'pasjon.html': 'Doživi',
    'dogodki.html': 'Dogodki',
    'razstava-kosir.html': 'Dogodki',
    'razstava-mlin.html': 'Dogodki'
  };

  const activeLabel = activeByPage[page];
  document.querySelectorAll('.main-nav > ul > li > a').forEach((link) => {
    const isActive = link.textContent.trim() === activeLabel;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
});
