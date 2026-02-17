(() => {
  const body = document.body;
  const langSwitcher = document.querySelector('.lang-switcher');
  const langToggle = document.querySelector('.lang-toggle');
  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.drawer-close');
  const privacyOpen = document.querySelectorAll('[data-open-privacy]');
  const privacyModal = document.getElementById('privacy-modal');
  const privacyX = document.querySelector('.modal-close-x');
  const privacyClose = document.querySelector('.modal-close-bottom');
  const faqItems = document.querySelectorAll('.faq-item');

  const trapFocus = (container, event) => {
    const nodes = container.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
    const focusable = [...nodes].filter(el => !el.disabled);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.key === 'Tab' && event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (event.key === 'Tab' && !event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (langToggle) {
    langToggle.addEventListener('click', () => langSwitcher.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!langSwitcher.contains(e.target)) langSwitcher.classList.remove('open');
    });
  }

  const openDrawer = () => {
    drawer.classList.add('open');
    drawerOverlay.classList.add('show');
    body.classList.add('menu-open');
    drawer.querySelector('a, button')?.focus();
  };
  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('show');
    body.classList.remove('menu-open');
    burger?.focus();
  };
  burger?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  const openModal = () => {
    privacyModal.classList.add('show');
    body.classList.add('modal-open');
    privacyX?.focus();
  };
  const closeModal = () => {
    privacyModal.classList.remove('show');
    body.classList.remove('modal-open');
  };

  privacyOpen.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
  privacyX?.addEventListener('click', closeModal);
  privacyClose?.addEventListener('click', closeModal);
  privacyModal?.addEventListener('click', (e) => {
    if (e.target === privacyModal) closeModal();
  });

  faqItems.forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      faqItems.forEach(other => { if (other !== item) other.classList.remove('open'); });
      item.classList.toggle('open');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (drawer.classList.contains('open')) closeDrawer();
      if (privacyModal.classList.contains('show')) closeModal();
      langSwitcher?.classList.remove('open');
    }
    if (drawer.classList.contains('open')) trapFocus(drawer, e);
    if (privacyModal.classList.contains('show')) trapFocus(privacyModal, e);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        if (entry.target.dataset.fill) entry.target.style.width = entry.target.dataset.fill;
        if (entry.target.dataset.count) {
          const target = Number(entry.target.dataset.count);
          let n = 0;
          const step = Math.max(1, Math.round(target / 40));
          const tick = () => {
            n = Math.min(target, n + step);
            entry.target.textContent = n.toLocaleString();
            if (n < target) requestAnimationFrame(tick);
          };
          tick();
        }
      }
    });
  }, { threshold: 0.22 });

  document.querySelectorAll('.reveal, .fill, [data-count]').forEach(el => observer.observe(el));
})();
