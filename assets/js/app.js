(() => {
  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
  const state = { filter: 'All', query: '' };
  let revealObserver = null;

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const safe = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const safeUrl = (value = '') => String(value).trim();


  function iconType(tech = '') {
    const value = String(tech).toLowerCase();
    if (value.includes('java') && !value.includes('javascript')) return 'coffee';
    if (value.includes('spring security')) return 'shield';
    if (value.includes('spring')) return 'leaf';
    if (value.includes('react')) return 'atom';
    if (value.includes('vite')) return 'bolt';
    if (value.includes('node')) return 'hex';
    if (value.includes('express')) return 'route';
    if (value.includes('mongo') || value.includes('postgres') || value.includes('mysql')) return 'database';
    if (value.includes('jwt') || value.includes('oauth') || value.includes('otp')) return 'key';
    if (value.includes('websocket') || value.includes('stomp') || value.includes('socket')) return 'signal';
    if (value.includes('jsp') || value.includes('servlet') || value.includes('php')) return 'code';
    if (value.includes('kotlin') || value.includes('android')) return 'mobile';
    if (value.includes('playwright') || value.includes('qa')) return 'check';
    if (value.includes('linux') || value.includes('postfix') || value.includes('dns')) return 'terminal';
    if (value.includes('security') || value.includes('auth')) return 'shield';
    return 'spark';
  }

  function techIcon(tech = '') {
    const type = iconType(tech);
    const common = 'class="tech-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"';
    const icons = {
      coffee: `<svg ${common}><path d="M6 8h9v5.2A4.8 4.8 0 0 1 10.2 18H9.8A4.8 4.8 0 0 1 5 13.2V9a1 1 0 0 1 1-1Z"/><path d="M15 9h1.4a2.2 2.2 0 0 1 0 4.4H15"/><path d="M7 4.8c.8-.55.8-1.15.25-1.8M10.4 4.8c.8-.55.8-1.15.25-1.8M13.8 4.8c.8-.55.8-1.15.25-1.8"/><path d="M5 20h12"/></svg>`,
      leaf: `<svg ${common}><path d="M20 4.5C12 4.6 6.9 8.1 5.7 14.6c-.5 2.8 1.5 5 4.2 4.7 6.1-.7 9.6-6.1 10.1-14.8Z"/><path d="M6.7 17.3c3.2-4.3 6.6-6.5 10.8-8"/></svg>`,
      shield: `<svg ${common}><path d="M12 3.5 19 6v5.2c0 4.5-2.9 7.9-7 9.3-4.1-1.4-7-4.8-7-9.3V6l7-2.5Z"/><path d="m8.8 12 2.1 2.1 4.4-4.7"/></svg>`,
      atom: `<svg ${common}><circle cx="12" cy="12" r="1.8"/><path d="M20.5 12c0 2-3.8 3.6-8.5 3.6S3.5 14 3.5 12s3.8-3.6 8.5-3.6 8.5 1.6 8.5 3.6Z"/><path d="M16.25 19.36c-1.73 1-4.94-1.61-7.28-5.66S6.04 6.84 7.77 5.84s4.94 1.61 7.28 5.66 2.93 6.86 1.2 7.86Z"/><path d="M7.75 19.36c-1.73-1-1.14-4.11 1.2-8.16s5.55-6.66 7.28-5.66 1.14 4.11-1.2 8.16-5.55 6.66-7.28 5.66Z"/></svg>`,
      bolt: `<svg ${common}><path d="M13 2.8 5.8 13h5.1L10.8 21 18.2 10.6h-5.3L13 2.8Z"/></svg>`,
      hex: `<svg ${common}><path d="M12 3.5 19.5 8v8L12 20.5 4.5 16V8L12 3.5Z"/><path d="M9 15V9l6 6V9"/></svg>`,
      route: `<svg ${common}><path d="M5 7h7a4 4 0 0 1 0 8H7"/><path d="M7 4 4 7l3 3"/><path d="m17 12 3 3-3 3"/></svg>`,
      database: `<svg ${common}><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>`,
      key: `<svg ${common}><circle cx="8" cy="12" r="3.4"/><path d="M11.4 12H21"/><path d="M17 12v3"/><path d="M14.5 12v2"/></svg>`,
      signal: `<svg ${common}><path d="M4 12a8 8 0 0 1 8-8"/><path d="M4 12a8 8 0 0 0 8 8"/><path d="M9 12a3 3 0 0 1 3-3"/><path d="M9 12a3 3 0 0 0 3 3"/><path d="M14 9l6 6"/><path d="M20 9l-6 6"/></svg>`,
      code: `<svg ${common}><path d="m9 7-5 5 5 5"/><path d="m15 7 5 5-5 5"/><path d="m13.5 5-3 14"/></svg>`,
      mobile: `<svg ${common}><rect x="7" y="3" width="10" height="18" rx="2.4"/><path d="M10 6h4"/><path d="M11.6 18h.8"/></svg>`,
      check: `<svg ${common}><path d="M20 6 9.2 17 4 11.8"/><path d="M4 20h16"/></svg>`,
      terminal: `<svg ${common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m7 10 3 2-3 2"/><path d="M12 15h5"/></svg>`,
      spark: `<svg ${common}><path d="M12 3.5 14 9l5.5 2-5.5 2-2 5.5-2-5.5-5.5-2L10 9l2-5.5Z"/></svg>`
    };
    return icons[type] || icons.spark;
  }

  function techChip(tech) {
    return `<span class="tech-chip" data-tech="${safe(tech)}">${techIcon(tech)}<em>${safe(tech)}</em></span>`;
  }

  function moreTechChip(count) {
    return `<span class="tech-chip tech-more" aria-label="${count} more technologies"><em>+${safe(count)}</em></span>`;
  }

  function hydrateStaticStackChips(root = document) {
    qsa('.stack-cloud > span:not(.tech-chip)', root).forEach((chip) => {
      const tech = chip.textContent.trim();
      chip.classList.add('tech-chip');
      chip.dataset.tech = tech;
      chip.innerHTML = `${techIcon(tech)}<em>${safe(tech)}</em>`;
    });
  }

  function uniqueCategories() {
    return ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))];
  }

  function getDocs(project) {
    return Array.isArray(project.docs) ? project.docs : [];
  }

  function countDocs() {
    return projects.reduce((total, project) => total + getDocs(project).length, 0);
  }

  function projectBadge(project) {
    return project.badge || project.category || project.type || 'Project';
  }

  function setText(selector, value) {
    const el = qs(selector);
    if (el) el.textContent = value;
  }

  function initStats() {
    setText('#projectCount', projects.length);
    setText('#docCount', countDocs());
    setText('#repoCount', projects.filter((project) => project.repo).length);
    setText('#featuredCount', projects.filter((project) => project.featured).length);
  }

  function renderFilters() {
    const filterBar = qs('#filterBar');
    if (!filterBar) return;

    filterBar.innerHTML = uniqueCategories().map((category) => `
      <button class="filter-btn ${category === state.filter ? 'active' : ''}" type="button" data-filter="${safe(category)}">${safe(category)}</button>
    `).join('');

    qsa('.filter-btn', filterBar).forEach((button) => {
      button.addEventListener('click', () => {
        state.filter = button.dataset.filter;
        renderFilters();
        renderProjects();
      });
    });
  }

  function projectMatches(project) {
    const filterMatch = state.filter === 'All' || project.category === state.filter;
    const query = state.query.trim().toLowerCase();
    if (!query) return filterMatch;

    const searchable = [
      project.title,
      project.subtitle,
      project.category,
      project.badge,
      project.type,
      project.role,
      project.description,
      ...(Array.isArray(project.stack) ? project.stack : []),
      ...(Array.isArray(project.highlights) ? project.highlights : [])
    ].join(' ').toLowerCase();

    return filterMatch && searchable.includes(query);
  }

  function docButtons(project, compact = false) {
    const docs = getDocs(project);
    if (!docs.length) {
      return '<span class="empty-doc">PDF asset pending</span>';
    }

    return docs.map((doc) => `
      <a class="doc-btn ${compact ? 'compact' : ''}" href="${safeUrl(doc.href)}" target="_blank" rel="noreferrer">
        <span>PDF</span>${safe(doc.label)}
      </a>
    `).join('');
  }

  function projectPrimaryAction(project) {
    if (project.repo) {
      return `<a class="primary-link" href="${safeUrl(project.repo)}" target="_blank" rel="noreferrer">GitHub Repo</a>`;
    }

    const docs = getDocs(project);
    if (docs.length) {
      return `<a class="primary-link" href="${safeUrl(docs[0].href)}" target="_blank" rel="noreferrer">Open PDF</a>`;
    }

    return '<span class="empty-doc action-note">No public repo yet</span>';
  }

  function stackMarkup(project, limit = 6) {
    const stack = Array.isArray(project.stack) ? project.stack : [];
    const visible = stack.slice(0, limit).map((tech) => techChip(tech)).join('');
    const extra = stack.length > limit ? moreTechChip(stack.length - limit) : '';
    return visible + extra;
  }

  function renderFeaturedProjects() {
    const featuredGrid = qs('#featuredGrid');
    if (!featuredGrid) return;

    const featured = projects
      .filter((project) => project.featured)
      .sort((a, b) => Number(Boolean(b.spotlight)) - Number(Boolean(a.spotlight)))
      .slice(0, 6);

    if (!featured.length) return;

    featuredGrid.innerHTML = featured.map((project, index) => {
      if (project.spotlight) {
        return `
          <article class="featured-project spotlight-showcase" style="--delay:${index * 55}ms" data-reveal>
            <div class="spotlight-media-clean">
              <img src="${safeUrl(project.preview)}" alt="${safe(project.title)} preview" loading="lazy">
            </div>
            <div class="featured-content spotlight-content">
              <div class="project-meta">
                <span>${safe(project.type)}</span>
                <span>${safe(project.year)}</span>
              </div>
              <span class="project-badge inline-badge">Portfolio case study</span>
              <h3>${safe(project.title)}</h3>
              <p>${safe(project.subtitle)}</p>
              <div class="signature-strip" aria-label="AgroLink Hub evidence">
                <span>41 UI screens</span>
                <span>Marketplace workflows</span>
                <span>Realtime support</span>
                <span>Admin controls</span>
              </div>
              <div class="stack-row">${stackMarkup(project, 6)}</div>
              <div class="project-actions">
                ${projectPrimaryAction(project)}
                <button class="secondary-link" type="button" data-project="${safe(project.id)}">Details</button>
              </div>
            </div>
          </article>
        `;
      }

      return `
        <article class="featured-project compact-featured" style="--delay:${index * 55}ms" data-reveal>
          <div class="featured-media">
            <img src="${safeUrl(project.preview)}" alt="${safe(project.title)} preview" loading="lazy">
            <span class="project-badge">${safe(projectBadge(project))}</span>
          </div>
          <div class="featured-content">
            <div class="project-meta">
              <span>${safe(project.type)}</span>
              <span>${safe(project.year)}</span>
            </div>
            <h3>${safe(project.title)}</h3>
            <p>${safe(project.subtitle)}</p>
            <div class="stack-row">${stackMarkup(project, 5)}</div>
            <div class="project-actions">
              ${projectPrimaryAction(project)}
              <button class="secondary-link" type="button" data-project="${safe(project.id)}">Details</button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    qsa('[data-project]', featuredGrid).forEach((button) => {
      button.addEventListener('click', () => openModal(button.dataset.project));
    });

    qsa('img', featuredGrid).forEach((image) => {
      image.addEventListener('error', () => {
        image.style.display = 'none';
        image.parentElement.classList.add('image-missing');
      }, { once: true });
    });

    observeReveal(featuredGrid);
  }

  function renderProjects() {
    const projectGrid = qs('#projectGrid');
    if (!projectGrid) return;

    const visible = projects.filter(projectMatches);
    setText('#visibleCount', visible.length);

    if (!projects.length) {
      projectGrid.innerHTML = '<div class="empty-state">Project data did not load. Check that assets/js/projects.js exists beside assets/js/app.js.</div>';
      return;
    }

    if (!visible.length) {
      projectGrid.innerHTML = '<div class="empty-state">No projects matched this search.</div>';
      return;
    }

    projectGrid.innerHTML = visible.map((project, index) => `
      <article class="project-card ${project.featured ? 'featured-card' : ''} ${project.spotlight ? 'spotlight-card' : ''}" style="--delay:${index * 40}ms" data-reveal>
        <div class="project-media">
          <img src="${safeUrl(project.preview)}" alt="${safe(project.title)} preview" loading="lazy">
          <span class="project-badge">${safe(projectBadge(project))}</span>
        </div>
        <div class="project-content">
          <div class="project-meta">
            <span>${safe(project.type)}</span>
            <span>${safe(project.year)}</span>
          </div>
          <h3>${safe(project.title)}</h3>
          <p class="project-subtitle">${safe(project.subtitle)}</p>
          ${getDocs(project).length ? `<div class="doc-row priority-docs">${docButtons(project, true)}</div>` : ''}
          <p class="project-desc">${safe(project.description)}</p>
          <div class="stack-row">${stackMarkup(project)}</div>
          <div class="project-actions">
            ${projectPrimaryAction(project)}
            <button class="secondary-link" type="button" data-project="${safe(project.id)}">Details</button>
          </div>
          ${!getDocs(project).length ? `<div class="doc-row">${docButtons(project, true)}</div>` : ''}
        </div>
      </article>
    `).join('');

    qsa('[data-project]', projectGrid).forEach((button) => {
      button.addEventListener('click', () => openModal(button.dataset.project));
    });

    qsa('img', projectGrid).forEach((image) => {
      image.addEventListener('error', () => {
        image.style.display = 'none';
        image.parentElement.classList.add('image-missing');
      }, { once: true });
    });

    observeReveal(projectGrid);
  }

  function openModal(id) {
    const modal = qs('#projectModal');
    const modalBody = qs('#modalBody');
    const project = projects.find((item) => item.id === id);
    if (!modal || !modalBody || !project) return;

    const highlights = Array.isArray(project.highlights) ? project.highlights : [];
    const stack = Array.isArray(project.stack) ? project.stack : [];
    const meta = [project.type, project.year, project.status].filter(Boolean);
    const docs = getDocs(project);

    modalBody.innerHTML = `
      <div class="modal-detail-layout">
        <div class="modal-top-row">
          <div class="modal-preview-frame">
            <img src="${safeUrl(project.preview)}" alt="${safe(project.title)} preview">
          </div>
          <div class="modal-intro-panel">
            <span class="modal-category">${safe(projectBadge(project))}</span>
            <h2>${safe(project.title)}</h2>
            <p>${safe(project.subtitle)}</p>
            <div class="modal-mini-meta">
              ${meta.map((item) => `<span>${safe(item)}</span>`).join('')}
            </div>
            <div class="modal-action-strip" aria-label="Project evidence and links">
              ${projectPrimaryAction(project)}
              ${docs.length ? docButtons(project) : '<span class="empty-doc">PDF evidence not attached for this item</span>'}
            </div>
          </div>
        </div>
        <div class="modal-grid modal-grid-compact">
          <section class="modal-section">
            <h4>Project Summary</h4>
            <p>${safe(project.description)}</p>
          </section>
          <section class="modal-section">
            <h4>My Contribution</h4>
            <p>${safe(project.role)}</p>
          </section>
          <section class="modal-section">
            <h4>Key Highlights</h4>
            <ul>${highlights.map((item) => `<li>${safe(item)}</li>`).join('')}</ul>
          </section>
          <section class="modal-section">
            <h4>Technology Stack</h4>
            <div class="stack-row modal-stack">${stack.map((tech) => techChip(tech)).join('')}</div>
          </section>
        </div>
      </div>
    `;

    const modalCard = qs('.modal-card', modal);
    if (modalCard) modalCard.scrollTop = 0;
    modal.scrollTop = 0;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    const modal = qs('#projectModal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function initSearch() {
    const searchInput = qs('#projectSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (event) => {
      state.query = event.target.value;
      renderProjects();
    });
  }

  function initScrollLinks() {
    qsa('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = qs(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initModal() {
    const modal = qs('#projectModal');
    const modalClose = qs('#modalClose');
    if (modalClose) modalClose.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });
  }

  function initYear() {
    setText('#currentYear', new Date().getFullYear());
  }

  function observeReveal(root = document) {
    const items = qsa('[data-reveal]:not(.in-view)', root);
    if (!items.length) return;
    if (!revealObserver) {
      items.forEach((item) => item.classList.add('in-view'));
      return;
    }
    items.forEach((item) => revealObserver.observe(item));
  }

  function initRevealMotion() {
    document.body.classList.add('motion-ready');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      qsa('[data-reveal]').forEach((item) => item.classList.add('in-view'));
      return;
    }

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    observeReveal();
  }

  function initScrollProgress() {
    const progress = qs('#scrollProgress');
    if (!progress) return;
    let ticking = false;

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (ticking) return;
      window.requestAnimationFrame(update);
      ticking = true;
    }, { passive: true });
    update();
  }

  function initHeroTilt() {
    const visual = qs('[data-tilt]');
    if (!visual || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    visual.addEventListener('mousemove', (event) => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      visual.style.setProperty('--tilt-x', `${y * -4.5}deg`);
      visual.style.setProperty('--tilt-y', `${x * 5.5}deg`);
    });

    visual.addEventListener('mouseleave', () => {
      visual.style.setProperty('--tilt-x', '0deg');
      visual.style.setProperty('--tilt-y', '0deg');
    });
  }

  function init() {
    document.documentElement.classList.add('js-ready');
    hydrateStaticStackChips();
    initStats();
    renderFilters();
    renderFeaturedProjects();
    renderProjects();
    initSearch();
    initScrollLinks();
    initModal();
    initYear();
    initRevealMotion();
    initScrollProgress();
    initHeroTilt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
