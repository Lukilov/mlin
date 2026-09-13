(() => {
  const page = window.location.pathname.split('/').filter(Boolean).pop() || 'index';

  if (page === 'dogodki') {
    document.body.classList.add('editorial-events');
    return;
  }

  const labels = {
    'utrinki-dediscina': 'Spoznaj',
    'zgodovina': 'Spoznaj',
    'mlinarstvo': 'Odkrij',
    'slikar': 'Odkrij',
    'arhitektura': 'Odkrij',
    'tehnicna': 'Odkrij',
    'povzdviguj': 'Doživi',
    'pasjon': 'Doživi',
    'razstava-kosir': 'Dogodki',
    'razstava-mlin': 'Dogodki'
  };

  const source = document.querySelector([
    '.section-utrinki .utrinki-text',
    '.section-zgodovina .zgodovina-text',
    '.section-pasjon .container',
    'body > section.zgodovina-text',
    'body > .dogodek-kosir'
  ].join(', '));

  if (!source || source.classList.contains('editorial-content')) return;

  const heading = source.querySelector(':scope > h1') || source.querySelector('h1');
  if (!heading) return;

  const masthead = document.createElement('header');
  masthead.className = 'editorial-masthead';
  masthead.innerHTML = `
    <p class="editorial-kicker">${labels[page] || 'Koširjev mlin'}</p>
    <span class="editorial-line" aria-hidden="true"></span>
  `;
  heading.replaceWith(masthead);
  masthead.insertBefore(heading, masthead.querySelector('.editorial-line'));

  const rawNodes = Array.from(source.children).filter((node) => node !== masthead);
  const meaningfulNodes = rawNodes.filter((node) => {
    return node.matches('img, h2, h3, p, blockquote, a, .pasjon-image, .text-content') ||
      node.querySelector?.('img, h2, h3, p, blockquote');
  });

  const initialGroups = [];
  let currentGroup = [];
  meaningfulNodes.forEach((node) => {
    if (node.matches('h2') && currentGroup.length) {
      initialGroups.push(currentGroup);
      currentGroup = [];
    }
    currentGroup.push(node);
  });
  if (currentGroup.length) initialGroups.push(currentGroup);

  const groups = [];
  initialGroups.forEach((group) => {
    if (group.length <= 4) {
      groups.push(group);
      return;
    }
    for (let index = 0; index < group.length; index += 3) {
      groups.push(group.slice(index, index + 3));
    }
  });

  groups.forEach((group, index) => {
    const chapter = document.createElement('section');
    const inner = document.createElement('div');
    const visual = document.createElement('div');
    const copy = document.createElement('div');
    const number = document.createElement('span');
    chapter.className = `editorial-chapter ${index % 2 ? 'is-reversed' : ''}`;
    inner.className = 'editorial-chapter-inner';
    visual.className = 'editorial-visual';
    copy.className = 'editorial-copy';
    number.className = 'editorial-number';
    number.textContent = String(index + 1).padStart(2, '0');
    number.setAttribute('aria-hidden', 'true');

    const expanded = [];
    group.forEach((node) => {
      if (node.matches('.text-content')) {
        expanded.push(...Array.from(node.children));
      } else {
        expanded.push(node);
      }
    });

    expanded.forEach((node) => {
      if (node.matches('img, .pasjon-image')) {
        visual.appendChild(node);
        return;
      }

      Array.from(node.querySelectorAll?.(':scope > img') || []).forEach((image) => {
        visual.appendChild(image);
      });

      if (node.textContent.trim() || node.querySelector?.('p, h2, h3, blockquote, a')) {
        copy.appendChild(node);
      }
    });

    if (visual.children.length) {
      chapter.classList.add('has-visual');
      inner.appendChild(visual);
    } else {
      chapter.classList.add('is-textual');
    }

    inner.appendChild(copy);
    chapter.append(number, inner);
    source.appendChild(chapter);
  });

  source.prepend(masthead);
  source.classList.add('editorial-content');
  source.closest('section')?.classList.add('has-editorial-content');
  if (source.matches('.dogodek-kosir')) source.classList.add('editorial-event-detail');

  const chapters = source.querySelectorAll('.editorial-chapter');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    chapters.forEach((chapter) => chapter.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  chapters.forEach((chapter) => observer.observe(chapter));
})();
