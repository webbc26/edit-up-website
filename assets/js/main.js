/**
 * Edit Up - Main Landing Page Interactive Scripts
 * Domain: edit-up.com
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initComparisonSlider();
  initFAQAccordion();
  initVideoLinkTester();
  initSmoothScroll();
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

  // Mouse events
  container.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mousemove', onDrag);

  // Touch events
  container.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchmove', onDrag, { passive: true });
}

/* FAQ Accordion */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* Universal Link Interactive Tester for Video Templates */
function initVideoLinkTester() {
  const testerInput = document.getElementById('tester-input');
  const testerBtn = document.getElementById('tester-btn');
  const testerOutput = document.getElementById('tester-result');

  if (testerBtn && testerInput) {
    testerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let val = testerInput.value.trim();
      if (!val) val = 'beat-sync';

      // Clean ID
      const safeId = encodeURIComponent(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, ''));
      const targetUrl = `https://edit-up.com/video-templates/${safeId}`;

      if (testerOutput) {
        testerOutput.innerHTML = `
          <div style="margin-top: 16px; padding: 16px; background: rgba(0,0,0,0.5); border-radius: 12px; border: 1px solid var(--border-accent); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Generated Video Universal Link:</span>
              <a href="/video-templates/${safeId}" style="color: #FFB4D6; font-family: monospace; font-size: 0.95rem; word-break: break-all;">${targetUrl}</a>
            </div>
            <div style="display: flex; gap: 8px;">
              <button onclick="navigator.clipboard.writeText('${targetUrl}').then(() => alert('Universal Link copied!'))" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;">Copy Link</button>
              <a href="/video-templates/${safeId}" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.85rem;">Test Page</a>
            </div>
          </div>
        `;
      }
    });
  }
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
