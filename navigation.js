(() => {
  const header = document.querySelector('.journal-header');
  const toggle = header.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const mobile = matchMedia('(max-width: 700px)');
  const links = Array.from(nav.querySelectorAll('a'));
  const sections = document.body.classList.contains('film-home')
    ? links.slice(1).map(link => document.getElementById(link.hash.slice(1)))
    : [];

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.hidden = mobile.matches && !open;
  }

  function syncWidth() {
    if (mobile.matches && nav.contains(document.activeElement)) {
      toggle.hidden = false;
      toggle.focus();
    }
    toggle.hidden = !mobile.matches;
    setOpen(false);
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('pointerdown', event => {
    if (!header.contains(event.target)) setOpen(false);
  });
  header.addEventListener('focusout', event => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
  });
  nav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || !mobile.matches) return;
    setOpen(false);
    if (link.hash && link.pathname === location.pathname) {
      const target = document.getElementById(link.hash.slice(1));
      if (target) {
        target.tabIndex = -1;
        target.focus({preventScroll: true});
      }
    }
  });
  mobile.addEventListener('change', syncWidth);
  syncWidth();
  header.classList.add('nav-ready');

  let queued = false;
  function update() {
    queued = false;
    header.classList.toggle('compact', window.scrollY > 18);
    if (!sections.length) return;
    let current = links[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 94) {
        current = links.find(link => link.hash === '#' + section.id);
      }
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = links[links.length - 1];
    }
    for (const link of links) {
      if (link === current) link.setAttribute('aria-current', link.hash ? 'location' : 'page');
      else link.removeAttribute('aria-current');
    }
  }
  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  update();
})();
