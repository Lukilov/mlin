document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').filter(Boolean).pop() || 'index';
  const activeByPage = {
    'index': 'Domov',
    'zgodovina': 'Spoznaj',
    'utrinki-dediscina': 'Spoznaj',
    'mlinarstvo': 'Odkrij',
    'slikar': 'Odkrij',
    'arhitektura': 'Odkrij',
    'tehnicna': 'Odkrij',
    'povzdviguj': 'Doživi',
    'pasjon': 'Doživi',
    'dogodki': 'Dogodki',
    'razstava-kosir': 'Dogodki',
    'razstava-mlin': 'Dogodki'
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

  // GitHub Pages serves these Jekyll pages without the .html extension.
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    const match = href.match(/^([^?#]+)\.html([?#].*)?$/);
    if (match) link.setAttribute('href', `${match[1]}/${match[2] || ''}`);
  });
});
