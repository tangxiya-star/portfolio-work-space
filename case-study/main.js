// TaxPilot case study — interactivity
// State toggles · variant switchers · motion replay · hero card reveal

document.addEventListener('DOMContentLoaded', () => {

  // ───────── Hero TransactionCard — tap to reveal evidence chain ─────────
  const heroCard = document.getElementById('hero-tcard');
  if (heroCard) {
    const evidence = heroCard.querySelector('.t-evidence');
    const hint = document.querySelector('.hero-hint');
    const toggle = () => {
      const isOpen = evidence.getAttribute('data-revealed') === 'true';
      evidence.setAttribute('data-revealed', isOpen ? 'false' : 'true');
      if (hint) hint.style.opacity = isOpen ? '1' : '0';
    };
    heroCard.addEventListener('click', toggle);
    heroCard.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  }

  // ───────── Button variant switcher ─────────
  const buttonCard = document.querySelector('[data-comp="button"]');
  if (buttonCard) {
    const stage = buttonCard.querySelector('.rn-btn');
    const variantBtns = buttonCard.querySelectorAll('.vb');
    const labels = {
      primary: 'Connect bank',
      secondary: 'Skip for now',
      outline: 'Add manually',
      ghost: 'Cancel',
      destructive: 'Disconnect',
    };
    variantBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const variant = btn.dataset.variant;
        variantBtns.forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        stage.className = 'rn-btn ' + variant;
        stage.textContent = labels[variant];
      });
    });
  }

  // ───────── SegmentedControl ─────────
  const seg = document.getElementById('seg-demo');
  if (seg) {
    const opts = seg.querySelectorAll('.seg-opt');
    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        opts.forEach(o => o.classList.remove('on'));
        opt.classList.add('on');
      });
    });
  }

  // ───────── Toggle ─────────
  const toggle = document.getElementById('toggle-demo');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const on = toggle.classList.toggle('on');
      toggle.setAttribute('aria-pressed', on);
    });
  }

  // ───────── SelectionCard single-select ─────────
  const selGrid = document.querySelector('.sel-grid');
  if (selGrid) {
    const cards = selGrid.querySelectorAll('.rn-sel');
    cards.forEach(c => {
      c.addEventListener('click', () => {
        cards.forEach(x => x.classList.remove('on'));
        c.classList.add('on');
      });
    });
  }

  // ───────── State matrix ─────────
  const stateTabs = document.querySelectorAll('.state-tab');
  const stateScreens = document.querySelectorAll('.state-screen');
  const stateCaption = document.getElementById('state-caption');

  const captions = {
    loading: {
      name: 'Loading',
      text: 'Connection in progress. Reassure that work is happening — but only here. Hand off to analyzing the moment data starts arriving.',
    },
    analyzing: {
      name: 'Analyzing',
      text: 'The second beat. Same wait time as loading, but now the user sees what the app is doing with their data. Perceived performance, designed.',
    },
    empty: {
      name: 'Empty',
      text: 'No transactions yet. Direct, never apologetic — "let\'s connect a bank," not "no data found." Empty states are conversations.',
    },
    reauth: {
      name: 'Reauth',
      text: 'A persistent banner, not a blocking modal. The app keeps working. The alternative would say "broken;" this says "recoverable."',
    },
    paywall: {
      name: 'Paywall',
      text: 'Appears only after the user has seen real value. A wall on first launch says "pay to find out." A wall after analysis says "this works — keep going."',
    },
  };

  stateTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const state = tab.dataset.state;
      stateTabs.forEach(t => t.classList.remove('on'));
      tab.classList.add('on');
      stateScreens.forEach(s => {
        s.classList.toggle('on', s.dataset.screen === state);
      });
      if (stateCaption && captions[state]) {
        stateCaption.querySelector('.state-cap-name').textContent = captions[state].name;
        stateCaption.querySelector('.state-cap-text').textContent = captions[state].text;
      }
    });
  });

  // ───────── Motion replay ─────────
  const replayBtns = document.querySelectorAll('.motion-replay');
  const playMotion = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('play');
    // Force reflow so animation restarts cleanly
    void el.offsetWidth;
    el.classList.add('play');
  };

  replayBtns.forEach(btn => {
    btn.addEventListener('click', () => playMotion(btn.dataset.motion));
  });

  // Auto-play motion on first scroll into view
  const motionEls = ['m-discovery', 'm-handoff', 'm-batch'];
  if ('IntersectionObserver' in window) {
    const seen = new Set();
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !seen.has(entry.target.id)) {
          seen.add(entry.target.id);
          playMotion(entry.target.id);
        }
      });
    }, { threshold: 0.4 });
    motionEls.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  } else {
    // Fallback: play once on load
    motionEls.forEach(playMotion);
  }

  // Loop motion every ~4s for ambient liveliness
  setInterval(() => {
    motionEls.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) playMotion(id);
    });
  }, 5000);

});
