/**
 * Edit Up - Main Landing Page Interactive Scripts
 * Domain: edit-up.com
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initComparisonSlider();
  initScreenshotSlider();
  initFAQAccordion();
  initSmoothScroll();
  initPricingSync();
  initDynamicCopyright();
});

/* Mobile Menu Navigation */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

/* Before / After Comparison Slider */
function initComparisonSlider() {
  const container = document.querySelector('.comparison-slider-container');
  const beforeImg = document.querySelector('.comparison-before');
  const handle = document.querySelector('.comparison-handle');

  if (!container || !beforeImg || !handle) return;

  let isDragging = false;

  const setSliderPosition = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    
    const percentage = (x / rect.width) * 100;
    beforeImg.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  const startDrag = (e) => {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSliderPosition(clientX);
    container.style.cursor = 'ew-resize';
  };

  const stopDrag = () => {
    isDragging = false;
    container.style.cursor = 'default';
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSliderPosition(clientX);
  };

  container.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mousemove', onDrag);

  container.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchmove', onDrag, { passive: true });
}

/* Animated Screenshot Showcase Slider */
function initScreenshotSlider() {
  const track = document.querySelector('.showcase-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (!track) return;

  // Duplicate the children once so the CSS marquee loops seamlessly
  const items = Array.from(track.children);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // Manual nudge buttons
  let manualOffset = 0;
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.style.animationPlayState = 'paused';
      manualOffset += 300;
      track.style.transform = `translateX(${manualOffset}px)`;
      setTimeout(() => {
        track.style.animationPlayState = 'running';
      }, 2500);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.style.animationPlayState = 'paused';
      manualOffset -= 300;
      track.style.transform = `translateX(${manualOffset}px)`;
      setTimeout(() => {
        track.style.animationPlayState = 'running';
      }, 2500);
    });
  }
}

/* FAQ Accordion */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* Smooth Scrolling for Anchors */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* Dynamic Pricing Synchronization */
async function initPricingSync() {
  try {
    const res = await fetch('/assets/data/pricing.json');
    if (!res.ok) return;
    const data = await res.json();
    if (!data || !data.plans) return;

    Object.keys(data.plans).forEach(planKey => {
      const plan = data.plans[planKey];
      const card = document.querySelector(`.pricing-card[data-pricing-plan="${planKey}"]`);
      if (!card) return;

      const priceEl = card.querySelector('[data-pricing-field="price"]');
      if (priceEl && plan.price) priceEl.textContent = plan.price;

      const periodEl = card.querySelector('[data-pricing-field="period"]');
      if (periodEl && plan.period) periodEl.textContent = plan.period;

      const trialEl = card.querySelector('[data-pricing-field="trialTag"]');
      if (trialEl && plan.trialTag) trialEl.textContent = plan.trialTag;

      const badgeEl = card.querySelector('[data-pricing-field="popularBadge"]');
      if (badgeEl && plan.popularBadge) badgeEl.textContent = plan.popularBadge;

      const ctaEl = card.querySelector('[data-pricing-field="ctaText"]');
      if (ctaEl && plan.ctaText) ctaEl.textContent = plan.ctaText;
    });
  } catch (err) {
    // Graceful fallback to static pre-rendered HTML values
    console.debug('Pricing loaded from pre-rendered static HTML:', err);
  }
}

/* Dynamic Copyright Year */
function initDynamicCopyright() {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = currentYear;
  });
}

