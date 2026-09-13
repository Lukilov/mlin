const setupNavigation = () => {
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

  const header = document.querySelector('.site-header');
  const headerContainer = header?.querySelector('.header-container');
  const navigation = header?.querySelector('.main-nav');

  if (headerContainer && navigation && !headerContainer.querySelector('.mobile-menu-toggle')) {
    navigation.id ||= 'primary-navigation';

    const toggle = document.createElement('button');
    toggle.className = 'mobile-menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-controls', navigation.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Odpri navigacijski meni');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    headerContainer.insertBefore(toggle, navigation);

    const closeMenu = () => {
      navigation.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Odpri navigacijski meni');
    };

    toggle.addEventListener('click', () => {
      const isOpen = !navigation.classList.contains('is-open');
      navigation.classList.toggle('is-open', isOpen);
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Zapri navigacijski meni' : 'Odpri navigacijski meni');
    });

    navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.matchMedia('(min-width: 769px)').addEventListener('change', (event) => {
      if (event.matches) closeMenu();
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupNavigation);
} else {
  setupNavigation();
}
