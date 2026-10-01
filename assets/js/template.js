/**
 * Edit Up - Generic Video Template Viewer & Universal Link Gateway
 * Domain: edit-up.com
 * Handles dynamic template ID resolution, device detection, deep link handoff,
 * Smart App Banner injection, interactive simulated 9:16 video player, and QR code generation.
 */

const APP_STORE_URL = "https://apps.apple.com/us/app/edit-up-ai-photo-video-editor/id1333491559";
const CUSTOM_SCHEME_PREFIX = "editup://video-template/";

// Generic Metadata for All Video Templates
const GENERIC_TITLE = "Easy Video Editor & Maker | Edit Up";
const GENERIC_HEADING = "Easy Video Editor & Maker";
const GENERIC_DESCRIPTION = "Create viral Reels and TikTok videos effortlessly with Edit Up. Open this video template to auto-sync your photos and clips with beat-matched music, cinematic transitions, and 4K export.";
const GENERIC_OG_IMAGE = "https://edit-up.com/assets/images/og-template-share.png";

// Video Template Preset Enhancements (Optional tags/duration mapping)
const VIDEO_TEMPLATE_PRESETS = {
  "trending": {
    category: "Reels & TikTok",
    duration: "0:15s",
    clips: "10 Clips",
    audio: "Trending Rhythmic Beat (Auto-Synced)",
    tags: ["🎵 Auto Beat-Sync Audio", "⚡ 10 Auto Cuts", "📱 9:16 Reels & TikTok", "✨ 4K 60FPS Export"]
  },
  "velocity": {
    category: "Velocity Edit",
    duration: "0:12s",
    clips: "12 Clips",
    audio: "Phonk High-Energy Beats",
    tags: ["⚡ Velocity Curve", "🌊 Optical Slow-Mo", "📱 9:16 Vertical", "🔥 Trending"]
  },
  "aesthetic": {
    category: "Retro & Film",
    duration: "0:18s",
    clips: "8 Clips",
    audio: "Lo-Fi Acoustic Ambient",
    tags: ["📼 35mm Film", "🎞️ Light Leaks", "☕ Lo-Fi Audio", "✨ Nostalgia"]
  }
};

// Video Clips for Interactive Simulated 9:16 Player
const VIDEO_PLAYER_CLIPS = [
  "/assets/images/screenshots/screen-4.jpg",
  "/assets/images/screenshots/screen-2.jpg",
  "/assets/images/screenshots/screen-6.jpg",
  "/assets/images/screenshots/screen-3.jpg",
  "/assets/images/screenshots/screen-5.jpg",
  "/assets/images/screenshots/screen-7.jpg"
];

document.addEventListener('DOMContentLoaded', () => {
  const device = detectDevice();
  const templateId = getVideoTemplateIdFromUrl();
  const templateInfo = resolveTemplateInfo(templateId);

  // Render Generic UI & Metadata
  renderVideoTemplateDetails(templateId, templateInfo);
  updateMetadata(templateId, templateInfo);
  applyDeviceAdaptations(templateId, device);
  initDeepLinkHandoff(templateId, device);
  initShareTools(templateId);
  initInteractiveVideoPlayer();
  generateQrCode(`https://edit-up.com/video-templates/${encodeURIComponent(templateId)}`);
  initDynamicCopyright();
});

/**
 * Detect Visitor Device Platform
 */
function detectDevice() {
  const ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();
  const isIOS = /ipad|iphone|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);
  const isDesktop = !isIOS && !isAndroid;

  return { isIOS, isAndroid, isDesktop, ua };
}

/**
 * Extract video template ID from /video-templates/{id}, query ?id=, or hash #id
 */
function getVideoTemplateIdFromUrl() {
  const path = window.location.pathname;

  // Check if session storage has a redirect from 404.html
  const storedId = sessionStorage.getItem('redirect_video_template_id');
  if (storedId) {
    sessionStorage.removeItem('redirect_video_template_id');
    return storedId.trim();
  }

  // Check URL path: /video-templates/<id>
  const match = path.match(/\/video-templates\/([^\/\?#]+)/i);
  if (match && match[1] && match[1].toLowerCase() !== 'index.html') {
    return decodeURIComponent(match[1]).trim();
  }

  // Check query parameter: ?id=<id>
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('id') && urlParams.get('id').trim()) {
    return urlParams.get('id').trim();
  }

  // Check hash: #<id>
  if (window.location.hash) {
    const hash = window.location.hash.substring(1).trim();
    if (hash) return hash;
  }

  return "trending"; // Generic default template ID
}

/**
 * Resolves template metadata: generic title & description for all templates
 */
function resolveTemplateInfo(id) {
  const cleanId = (id || '').toLowerCase().trim();
  const preset = VIDEO_TEMPLATE_PRESETS[cleanId] || {};

  return {
    id: id,
    title: GENERIC_HEADING,
    category: preset.category || "Video Template",
    duration: preset.duration || "0:15s",
    clips: preset.clips || "10 Clips",
    audio: preset.audio || "Trending Beat-Sync Music",
    description: GENERIC_DESCRIPTION,
    tags: preset.tags || ["🎵 Auto Beat-Sync Audio", "⚡ 10 Auto Cuts", "📱 9:16 Reels & TikTok", "✨ 4K 60FPS Export"]
  };
}

/**
 * Render video template UI details in the DOM (Generic for all templates)
 */
function renderVideoTemplateDetails(id, info) {
  const titleEl = document.getElementById('template-title');
  const descEl = document.getElementById('template-description');
  const tagsEl = document.getElementById('template-tags-container');
  const previewTitle = document.getElementById('template-preview-title');

  // Title and Description remain generic for all templates
  if (titleEl) titleEl.textContent = GENERIC_HEADING;
  if (descEl) descEl.textContent = GENERIC_DESCRIPTION;
  if (previewTitle) previewTitle.textContent = GENERIC_HEADING;

  if (tagsEl) {
    const tags = (info && info.tags && info.tags.length) ? info.tags : [
      "🎵 Auto Beat-Sync Audio",
      "⚡ 10 Auto Cuts",
      "📱 9:16 Reels & TikTok",
      "✨ 4K 60FPS Export"
    ];
    tagsEl.innerHTML = tags.map(t => `<span class="template-info-pill">${t}</span>`).join('');
  }
}

/**
 * Update Smart App Banner, Open Graph, and Page Title dynamically with generic title and description
 */
function updateMetadata(id, info) {
  document.title = GENERIC_TITLE;

  // Update Apple Smart App Banner with specific template ID argument
  let appBanner = document.querySelector('meta[name="apple-itunes-app"]');
  if (!appBanner) {
    appBanner = document.createElement('meta');
    appBanner.name = 'apple-itunes-app';
    document.head.appendChild(appBanner);
  }
  appBanner.content = `app-id=1333491559, app-argument=editup://video-template/${encodeURIComponent(id)}`;

  // Update canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.href = `https://edit-up.com/video-templates/${encodeURIComponent(id)}`;
  }

  // Update Open Graph tags (Generic for all templates)
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = GENERIC_TITLE;

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = GENERIC_DESCRIPTION;

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.content = `https://edit-up.com/video-templates/${encodeURIComponent(id)}`;

  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.content = GENERIC_OG_IMAGE;

  // Update Twitter Cards (Generic for all templates)
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.content = GENERIC_TITLE;

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.content = GENERIC_DESCRIPTION;

  const twUrl = document.querySelector('meta[name="twitter:url"]');
  if (twUrl) twUrl.content = `https://edit-up.com/video-templates/${encodeURIComponent(id)}`;

  const twImg = document.querySelector('meta[name="twitter:image"]');
  if (twImg) twImg.content = GENERIC_OG_IMAGE;
}

/**
 * Apply Device-Aware Customizations to the Page
 */
function applyDeviceAdaptations(id, device) {
  const btnOpenApp = document.getElementById('btn-open-app');
  const btnStickyOpen = document.getElementById('btn-sticky-open-app');
  const qrWrapper = document.getElementById('qr-scanner-card');
  const androidNotice = document.getElementById('android-device-notice');

  const deepLink = `${CUSTOM_SCHEME_PREFIX}${encodeURIComponent(id)}`;

  if (btnOpenApp) {
    btnOpenApp.setAttribute('href', deepLink);
  }
  if (btnStickyOpen) {
    btnStickyOpen.setAttribute('href', deepLink);
  }

  if (device.isIOS) {
    if (qrWrapper) {
      qrWrapper.style.display = 'none'; // Hide desktop QR scanner on mobile devices
    }
    if (androidNotice) {
      androidNotice.style.display = 'none';
    }
  } else if (device.isDesktop) {
    if (qrWrapper) {
      qrWrapper.style.display = 'flex'; // Ensure QR code is prominent on desktop
    }
    if (androidNotice) {
      androidNotice.style.display = 'none';
    }
  } else if (device.isAndroid) {
    if (androidNotice) {
      androidNotice.style.display = 'block';
    }
    if (btnOpenApp) {
      btnOpenApp.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        View Edit Up on App Store
      `;
      btnOpenApp.setAttribute('href', APP_STORE_URL);
      btnOpenApp.setAttribute('target', '_blank');
      btnOpenApp.setAttribute('rel', 'noopener');
    }
    if (btnStickyOpen) {
      btnStickyOpen.setAttribute('href', APP_STORE_URL);
      btnStickyOpen.setAttribute('target', '_blank');
      btnStickyOpen.setAttribute('rel', 'noopener');
    }
    if (qrWrapper) {
      qrWrapper.style.display = 'none';
    }
  }
}

/**
 * Handle Universal Link Handoff with Console Logging and App Store Fallback
 */
function initDeepLinkHandoff(id, device) {
  const btn = document.getElementById('btn-open-app');
  const btnSticky = document.getElementById('btn-sticky-open-app');
  const deepLink = `${CUSTOM_SCHEME_PREFIX}${encodeURIComponent(id)}`;

  // Attach click listener for primary and sticky buttons
  const handleClick = (e) => {
    if (device.isAndroid) {
      return; // Let native link navigate to App Store
    }

    e.preventDefault();
    dispatchHandoff(deepLink, false, device);
  };

  if (btn) btn.addEventListener('click', handleClick);
  if (btnSticky) btnSticky.addEventListener('click', handleClick);

  // If on iOS, initiate automatic handoff
  if (device.isIOS) {
    setTimeout(() => {
      dispatchHandoff(deepLink, true, device);
    }, 1500);
  }
}

/**
 * Core Handoff Execution with Fallback Timer
 */
function dispatchHandoff(deepLink, isAuto, device) {
  const startTime = Date.now();
  let appOpened = false;

  const onBlur = () => {
    appOpened = true;
    window.removeEventListener('blur', onBlur);
    window.removeEventListener('pagehide', onBlur);
  };

  window.addEventListener('blur', onBlur);
  window.addEventListener('pagehide', onBlur);

  // Attempt to open the app via custom scheme
  try {
    window.location.href = deepLink;
  } catch (err) {
    // Graceful fallback
  }

  // Fallback to App Store if native app did not take over
  setTimeout(() => {
    window.removeEventListener('blur', onBlur);
    window.removeEventListener('pagehide', onBlur);

    // If page is still visible and less than 3500ms elapsed, app wasn't opened
    if (!appOpened && document.visibilityState === 'visible' && (Date.now() - startTime < 3500)) {
      if (device.isIOS) {
        window.location.href = APP_STORE_URL;
      } else {
        const qrBox = document.getElementById('qr-scanner-card');
        if (qrBox) {
          qrBox.scrollIntoView({ behavior: 'smooth' });
          qrBox.style.boxShadow = '0 0 35px rgba(255, 0, 122, 0.75)';
          setTimeout(() => {
            qrBox.style.boxShadow = '';
          }, 2000);
        }
      }
    }
  }, 1800);
}

/**
 * Share & Copy Link utilities
 */
function initShareTools(id) {
  const copyBtn = document.getElementById('btn-copy-template-link');
  const shareBtn = document.getElementById('btn-share-template');
  const currentUrl = `https://edit-up.com/video-templates/${encodeURIComponent(id)}`;

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(currentUrl).then(() => {
        const origText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span>✓ Copied Link!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = origText;
        }, 2200);
      }).catch(() => {
        prompt('Copy this video template link:', currentUrl);
      });
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: GENERIC_TITLE,
          text: `Create viral Reels and TikTok videos with Edit Up! Open template: ${id}`,
          url: currentUrl
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(currentUrl).then(() => {
          alert('Video template link copied to clipboard!');
        });
      }
    });
  }
}

/**
 * Interactive Simulated 9:16 Video Template Player
 */
function initInteractiveVideoPlayer() {
  const playerContainer = document.getElementById('template-player-container');
  const playBtn = document.getElementById('btn-play-pause-video');
  const playIconSvg = document.getElementById('play-icon-svg');
  const previewImg = document.getElementById('template-preview-img');
  const progressFill = document.getElementById('player-progress-fill');
  const beatFlash = document.getElementById('player-beat-flash');
  const timeText = document.getElementById('player-time-text');
  const eqBars = document.querySelectorAll('.audio-eq-bar');
  const clipChips = document.querySelectorAll('.template-clip-slot-chip');

  if (!playerContainer || !previewImg) return;

  let isPlaying = false;
  let currentSecond = 0;
  const totalSeconds = 15;
  let currentClipIndex = 0;
  let playbackTimer = null;
  let eqTimer = null;

  function togglePlay(e) {
    if (e) e.stopPropagation();
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  }

  function playVideo() {
    isPlaying = true;
    if (playBtn) playBtn.classList.add('playing');
    if (playIconSvg) {
      // Switch icon to Pause
      playIconSvg.innerHTML = `
        <rect x="6" y="4" width="4" height="16" rx="1"></rect>
        <rect x="14" y="4" width="4" height="16" rx="1"></rect>
      `;
    }

    // Start EQ dancing animation
    startEqAnimation();

    // Start 100ms ticker for progress bar and clip switching
    playbackTimer = setInterval(() => {
      currentSecond += 0.1;

      // Progress bar fill percentage
      const percent = (currentSecond / totalSeconds) * 100;
      if (progressFill) progressFill.style.width = `${Math.min(percent, 100)}%`;

      // Update time display
      const displaySec = Math.floor(currentSecond);
      if (timeText) {
        timeText.textContent = `0:${displaySec < 10 ? '0' : ''}${displaySec} / 0:${totalSeconds}s`;
      }

      // Clip switching every 2.5s (simulating beat drops)
      const targetClipIndex = Math.floor((currentSecond / totalSeconds) * VIDEO_PLAYER_CLIPS.length) % VIDEO_PLAYER_CLIPS.length;
      if (targetClipIndex !== currentClipIndex) {
        currentClipIndex = targetClipIndex;
        triggerBeatCut(currentClipIndex);
      }

      // Loop when completed
      if (currentSecond >= totalSeconds) {
        currentSecond = 0;
      }
    }, 100);
  }

  function pauseVideo() {
    isPlaying = false;
    clearInterval(playbackTimer);
    clearInterval(eqTimer);

    if (playBtn) playBtn.classList.remove('playing');
    if (playIconSvg) {
      // Switch icon to Play
      playIconSvg.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
    }

    // Reset EQ bars
    eqBars.forEach(bar => {
      bar.style.height = '6px';
    });
  }

  function triggerBeatCut(clipIdx) {
    // Flash effect
    if (beatFlash) {
      beatFlash.classList.add('active');
      setTimeout(() => beatFlash.classList.remove('active'), 100);
    }

    // Switch image
    previewImg.src = VIDEO_PLAYER_CLIPS[clipIdx];

    // Highlight clip slot chip
    clipChips.forEach((chip, i) => {
      if (i === clipIdx) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  function startEqAnimation() {
    eqTimer = setInterval(() => {
      eqBars.forEach(bar => {
        const randHeight = Math.floor(Math.random() * 16) + 4;
        bar.style.height = `${randHeight}px`;
      });
    }, 140);
  }

  // Click on play button or preview screen
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  playerContainer.addEventListener('click', togglePlay);

  // Click on clip chips to jump
  clipChips.forEach((chip, idx) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      currentClipIndex = idx;
      currentSecond = (idx / VIDEO_PLAYER_CLIPS.length) * totalSeconds;
      triggerBeatCut(currentClipIndex);
      if (!isPlaying) playVideo();
    });
  });
}

/**
 * Generates visual QR code on canvas for desktop users to scan with iPhone camera
 */
function generateQrCode(url) {
  const canvas = document.getElementById('template-qr-canvas');
  if (!canvas) return;

  const img = new Image();
  img.crossOrigin = "Anonymous";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&color=ffffff&bgcolor=151326&data=${encodeURIComponent(url)}`;

  img.onload = () => {
    const ctx = canvas.getContext('2d');
    canvas.width = 220;
    canvas.height = 220;
    ctx.drawImage(img, 0, 0, 220, 220);
  };
  img.onerror = () => {
    const ctx = canvas.getContext('2d');
    canvas.width = 220;
    canvas.height = 220;
    ctx.fillStyle = '#151326';
    ctx.fillRect(0, 0, 220, 220);
    ctx.fillStyle = '#FF007A';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scan with iPhone Camera', 110, 115);
  };
  img.src = qrUrl;
}

/**
 * Dynamic Copyright Year
 */
function initDynamicCopyright() {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = currentYear;
  });
}
