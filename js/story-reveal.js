(() => {
  const source = document.querySelector([
    '.section-utrinki .utrinki-text',
    '.section-zgodovina .zgodovina-text',
    '.section-pasjon .container',
    'body > section.zgodovina-text'
  ].join(', '));

  if (!source) return;

  const fullContent = source.closest('section') || source;
  const titleElement = source.querySelector('h1');
  const pageTitle = titleElement?.textContent.trim() || document.title;
  const allItems = Array.from(source.querySelectorAll('h2, p, blockquote, img'));

  if (allItems.length < 2) return;

  const chapterNames = [
    'Začetek zgodbe',
    'Sledi časa',
    'Prostor in ljudje',
    'Živa dediščina',
    'Pogled naprej'
  ];
  const cardCount = Math.min(5, Math.max(3, Math.ceil(allItems.length / 2)));
  const groups = Array.from({ length: cardCount }, (_, index) => {
    const start = Math.floor((index * allItems.length) / cardCount);
    const end = Math.floor(((index + 1) * allItems.length) / cardCount);
    return allItems.slice(start, end);
  });

  const stage = document.createElement('section');
  stage.className = 'story-experience';
  stage.setAttribute('aria-label', `Interaktivna predstavitev: ${pageTitle}`);
  stage.innerHTML = `
    <div class="story-atmosphere" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
    <div class="story-topbar">
      <p class="story-brand">Koširjev mlin</p>
      <button class="story-skip" type="button">Preskoči in odpri vsebino</button>
    </div>
    <div class="story-cover">
      <p class="story-kicker">Interaktivna zgodba</p>
      <h1>${pageTitle}</h1>
      <p class="story-cover-copy">Vsebina se bo razkrila po delih. Kliknite in stopite v zgodbo.</p>
      <button class="story-start" type="button">
        <span>Začni raziskovati</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
    <div class="story-deck" hidden></div>
    <div class="story-progress" aria-label="Napredek skozi zgodbo">
      <span class="story-progress-label">Uvod</span>
      <div class="story-progress-dots"></div>
    </div>
    <button class="story-floating-next" type="button" hidden>
      <span>Naslednje poglavje</span>
      <span aria-hidden="true">→</span>
    </button>
  `;

  const deck = stage.querySelector('.story-deck');
  const dots = stage.querySelector('.story-progress-dots');
  const progressLabel = stage.querySelector('.story-progress-label');
  const floatingNext = stage.querySelector('.story-floating-next');
  const floatingNextLabel = floatingNext.querySelector('span');
  let currentIndex = -1;
  let transitionLocked = false;

  const makeTextClone = (element) => {
    const clone = element.cloneNode(true);
    clone.querySelectorAll('img').forEach((image) => image.remove());
    clone.querySelectorAll('a').forEach((link) => {
      const span = document.createElement('span');
      span.innerHTML = link.innerHTML;
      link.replaceWith(span);
    });
    return clone.textContent.trim() ? clone : null;
  };

  groups.forEach((group, index) => {
    const heading = group.find((item) => item.matches('h2'));
    const image = group.find((item) => item.matches('img'));
    const textItems = group
      .filter((item) => item.matches('p, blockquote'))
      .map(makeTextClone)
      .filter(Boolean);
    const cardTitle = heading?.textContent.trim() || chapterNames[index];
    const card = document.createElement('article');
    const isLast = index === groups.length - 1;
    card.className = `story-card${image ? ' has-image' : ' is-text-only'}${index % 2 ? ' is-reversed' : ''}`;
    card.hidden = true;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', isLast ? 'Odpri celotno zgodbo' : 'Odpri naslednje poglavje');

    const visual = image
      ? `<figure class="story-card-visual"><img src="${image.currentSrc || image.src}" alt="${image.alt || ''}"></figure>`
      : `<div class="story-card-mark" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div>`;
    const bodyCopy = textItems.length
      ? textItems.map((item) => item.outerHTML).join('')
      : '<p>Odkrijte naslednji del zgodbe Koširjeve domačije.</p>';

    card.innerHTML = `
      ${visual}
      <div class="story-card-content">
        <p class="story-card-step">${String(index + 1).padStart(2, '0')} / ${String(groups.length).padStart(2, '0')}</p>
        <h2>${cardTitle}</h2>
        <div class="story-card-copy">${bodyCopy}</div>
        <button class="story-next" type="button">
          <span>${isLast ? 'Odpri celotno zgodbo' : 'Naslednje poglavje'}</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    `;

    const advance = (event) => {
      event.stopPropagation();
      isLast ? finishStory() : showCard(index + 1);
    };
    card.querySelector('.story-next').addEventListener('click', advance);
    card.addEventListener('click', () => isLast ? finishStory() : showCard(index + 1));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        isLast ? finishStory() : showCard(index + 1);
      }
    });
    deck.appendChild(card);

    const dot = document.createElement('span');
    dot.className = 'story-progress-dot';
    dot.setAttribute('aria-hidden', 'true');
    dots.appendChild(dot);
  });

  const cards = Array.from(deck.querySelectorAll('.story-card'));
  const progressDots = Array.from(dots.children);

  function updateProgress(index) {
    progressDots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-past', dotIndex < index);
      dot.classList.toggle('is-current', dotIndex === index);
    });
    progressLabel.textContent = index < 0
      ? 'Uvod'
      : `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    floatingNextLabel.textContent = index === cards.length - 1
      ? 'Odpri celotno zgodbo'
      : 'Naslednje poglavje';
  }

  function showCard(index) {
    if (transitionLocked || index < 0 || index >= cards.length) return;
    transitionLocked = true;
    const previous = currentIndex >= 0 ? cards[currentIndex] : null;
    const next = cards[index];

    if (currentIndex < 0) {
      stage.classList.add('is-started');
      deck.hidden = false;
      floatingNext.hidden = false;
    }

    if (previous) previous.classList.add('is-leaving');
    next.hidden = false;
    next.classList.add('is-entering');
    updateProgress(index);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => next.classList.add('is-active'));
    });

    window.setTimeout(() => {
      if (previous) {
        previous.hidden = true;
        previous.classList.remove('is-active', 'is-leaving');
      }
      next.classList.remove('is-entering');
      currentIndex = index;
      transitionLocked = false;
      next.focus({ preventScroll: true });
    }, 760);
  }

  function finishStory() {
    if (transitionLocked) return;
    transitionLocked = true;
    floatingNext.hidden = true;
    stage.classList.add('is-completing');
    fullContent.hidden = false;
    fullContent.setAttribute('aria-hidden', 'false');
    fullContent.classList.add('story-full-content', 'is-revealing');

    window.setTimeout(() => {
      floatingNext.remove();
      stage.remove();
      fullContent.classList.add('is-revealed');
      fullContent.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    }, 900);
  }

  stage.querySelector('.story-start').addEventListener('click', () => showCard(0));
  stage.querySelector('.story-skip').addEventListener('click', finishStory);
  floatingNext.addEventListener('click', () => {
    const activeIndex = cards.findIndex((card) => card.classList.contains('is-active'));
    if (activeIndex < 0 || transitionLocked) return;
    activeIndex === cards.length - 1 ? finishStory() : showCard(activeIndex + 1);
  });
  updateProgress(-1);

  fullContent.classList.add('story-full-content');
  fullContent.hidden = true;
  fullContent.setAttribute('aria-hidden', 'true');
  fullContent.before(stage);
  document.body.appendChild(floatingNext);
  document.body.classList.add('has-story-experience');
})();
