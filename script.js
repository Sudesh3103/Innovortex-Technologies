// ============ Mobile nav toggle ============
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle?.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  navToggle.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!mainNav?.contains(e.target) && !navToggle?.contains(e.target) && mainNav?.classList.contains('open')) {
    mainNav.classList.remove('open');
    navToggle?.classList.remove('active');
  }
});

// ============ Sticky header shadow on scroll ============
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  if (window.scrollY > 12) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
});

// ============ Scroll reveal ============
const revealEls = document.querySelectorAll('.reveal, .reveal-up');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el) => revealObserver.observe(el));

// ============ Animated stat counters ============
const statNums = document.querySelectorAll('.stat-num');

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value + '+';
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + '+';
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach((el) => statObserver.observe(el));

// ============ Mouse parallax for hero visual ============
const heroVisual = document.querySelector('.hero .hero-visual, .hero .about-visual, .hero .globe-visual');
if (heroVisual && window.matchMedia('(pointer:fine)').matches) {
  const heroSection = document.querySelector('.hero');
  const logoEl = heroVisual.querySelector('.hero-logo-svg, .podium-logo, .globe-logo');
  const rings = heroVisual.querySelectorAll('.ring-deco, .podium-ring');
  const orbitItems = heroVisual.querySelectorAll('.orbit-item');
  const badges = heroVisual.querySelectorAll('.float-badge');
  const dots = heroVisual.querySelectorAll('.ring-dot');

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;

    if (logoEl) {
      logoEl.style.transform = `translate(${dx * 14}px, ${dy * 14 - 18}px) rotate(${dx * 3}deg)`;
    }
    rings.forEach((r, i) => {
      const factor = (i + 1) * 6;
      r.style.transform = `translate(${dx * factor}px, ${dy * factor}px) rotate(${rings[0]?.classList.contains('ring-2') ? -1 : 1} * var(--r, 0deg))`;
    });
    orbitItems.forEach((o, i) => {
      const factor = (i % 2 === 0 ? 1 : -1) * 10;
      o.style.marginTop = `${dy * factor}px`;
      o.style.marginLeft = `${dx * factor}px`;
    });
    badges.forEach((b, i) => {
      const f = (i + 1) * 4;
      b.style.transform = `translate(${dx * f}px, ${dy * f - 12}px)`;
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    if (logoEl) logoEl.style.transform = '';
    rings.forEach(r => r.style.transform = '');
    orbitItems.forEach(o => { o.style.marginTop = ''; o.style.marginLeft = ''; });
    badges.forEach(b => b.style.transform = '');
  });
}

// ============ Card tilt effect ============
const tiltCards = document.querySelectorAll('.service-card, .stat-card, .work-card, .project-card, .industry-card, .service-detail-card, .why-card, .team-cta-inner');
tiltCards.forEach(card => {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -6;
    const ry = ((x / rect.width) - 0.5) * 6;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============ Magnetic buttons ============
const magBtns = document.querySelectorAll('.btn-primary, .btn-outline');
magBtns.forEach(btn => {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25 - 3}px) scale(1.02)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ============ Project filter (Our Work page) ============
const filterRow = document.getElementById('filterRow');
const projectGrid = document.getElementById('projectGrid');
const noResults = document.getElementById('noResults');

if (filterRow && projectGrid) {
  const chips = filterRow.querySelectorAll('.filter-chip');
  const cards = projectGrid.querySelectorAll('.project-card');

  filterRow.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;

    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');

    const filter = chip.dataset.filter;
    let visibleCount = 0;

    cards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      const match = filter === 'all' || categories.includes(filter);
      card.classList.toggle('hide', !match);
      if (match) {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'revealCard 0.5s cubic-bezier(0.22,1,0.36,1) both';
        visibleCount++;
      }
    });

    if (noResults) noResults.hidden = visibleCount !== 0;
  });
}

// ============ Contact form (Contact page) ============
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = contactForm.querySelector('.btn-submit');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9+\-\s()]{7,}$/;

  function setFieldValid(field, isValid) {
    field.classList.toggle('invalid', !isValid);
  }

  function validateField(input) {
    const field = input.closest('.field');
    if (!field) return true;

    let isValid = true;
    if (input.hasAttribute('required') && !input.value.trim()) isValid = false;
    if (isValid && input.type === 'email' && input.value && !emailPattern.test(input.value)) isValid = false;
    if (isValid && input.type === 'tel' && input.value && !phonePattern.test(input.value)) isValid = false;

    setFieldValid(field, isValid);
    return isValid;
  }

  contactForm.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      const field = input.closest('.field');
      if (field && field.classList.contains('invalid')) validateField(input);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputs = contactForm.querySelectorAll('input, select, textarea');
    let allValid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) allValid = false;
    });

    if (!allValid) {
      const firstInvalid = contactForm.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
      firstInvalid?.focus();
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      contactForm.reset();
      if (formSuccess) {
        formSuccess.hidden = false;
        alert('Thanks! Your message has been sent — we\'ll get back to you within 24 hours.');
        setTimeout(() => { formSuccess.hidden = true; }, 6000);
      }
    }, 1000);
  });
}

// ============ Inject keyframes for card reveal ============
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes revealCard {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;
document.head.appendChild(styleSheet);

// ============ Smooth anchor scroll offset for sticky header ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerH = header?.offsetHeight || 70;
      const y = target.getBoundingClientRect().top + window.pageYOffset - headerH - 10;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});
