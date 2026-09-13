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

    navigation.querySelectorAll('.dropdown').forEach((dropdown, index) => {
      const parentLink = dropdown.querySelector(':scope > a');
      const submenu = dropdown.querySelector(':scope > .dropdown-menu');
      if (!parentLink || !submenu || dropdown.querySelector(':scope > .submenu-toggle')) return;

      submenu.id ||= `mobile-submenu-${index + 1}`;
      const submenuToggle = document.createElement('button');
      submenuToggle.className = 'submenu-toggle';
      submenuToggle.type = 'button';
      submenuToggle.setAttribute('aria-controls', submenu.id);
      submenuToggle.setAttribute('aria-expanded', 'false');
      submenuToggle.setAttribute('aria-label', `Odpri podmeni ${parentLink.textContent.trim()}`);
      submenuToggle.innerHTML = '<span aria-hidden="true"></span>';
      parentLink.insertAdjacentElement('afterend', submenuToggle);

      submenuToggle.addEventListener('click', () => {
        const isOpen = !dropdown.classList.contains('submenu-open');
        navigation.querySelectorAll('.dropdown.submenu-open').forEach((openDropdown) => {
          if (openDropdown === dropdown) return;
          openDropdown.classList.remove('submenu-open');
          openDropdown.querySelector(':scope > .submenu-toggle')?.setAttribute('aria-expanded', 'false');
        });
        dropdown.classList.toggle('submenu-open', isOpen);
        submenuToggle.setAttribute('aria-expanded', String(isOpen));
        submenuToggle.setAttribute('aria-label', `${isOpen ? 'Zapri' : 'Odpri'} podmeni ${parentLink.textContent.trim()}`);
      });
    });

    const closeMenu = () => {
      navigation.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Odpri navigacijski meni');
      navigation.querySelectorAll('.dropdown.submenu-open').forEach((dropdown) => {
        dropdown.classList.remove('submenu-open');
        dropdown.querySelector(':scope > .submenu-toggle')?.setAttribute('aria-expanded', 'false');
      });
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
