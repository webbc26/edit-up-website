/**
 * Edit Up - Generic Video Template Viewer & Universal Link Gateway
 * Domain: edit-up.com
 * Handles dynamic template ID resolution, device detection, deep link handoff,
 * Smart App Banner injection, and QR code generation.
 */

const APP_STORE_URL = "https://apps.apple.com/us/app/edit-up-ai-photo-video-editor/id1333491559";
const CUSTOM_SCHEME_PREFIX = "editup://video-template/";

// Generic Metadata for All Video Templates
const GENERIC_TITLE = "Easy Video Editor & Maker | Edit Up";
const GENERIC_HEADING = "Easy Video Editor & Maker";
const GENERIC_DESCRIPTION = "Create viral Reels and TikTok videos effortlessly with Edit Up. Open this video template to auto-sync your photos and clips with beat-matched music, cinematic transitions, and 4K export.";
const GENERIC_OG_IMAGE = "https://edit-up.com/assets/images/og-template-share.png";

// Video Template Presets Mapping (Fallback & Enhancements)
const VIDEO_TEMPLATE_PRESETS = {
  "beat-sync": {
    title: "Dynamic Beat Sync Reel",
    category: "Reels & TikTok",
    duration: "0:12s",
    clips: "12 Clips",
    audio: "Trending Rhythmic Beat (Auto-Synced)",
    description: "Fast-paced cuts matched perfectly to rhythmic audio drops with synchronized flash transitions. Ideal for fashion, fitness, and montage reels.",
    tags: ["🎵 Beat Sync", "⚡ Auto Transitions", "📱 9:16 Vertical", "🔥 Trending"]
  },
  "vintage-vlog": {
    title: "Vintage 35mm Film Vlog",
    category: "Retro Reel",
    duration: "0:24s",
    clips: "8 Clips",
    audio: "Lo-Fi Acoustic Ambient",
    description: "Retro warm color grading, organic grain, light leaks, and smooth camera pan effect. Perfect for lifestyle, daily vlogs, and memory dumps.",
    tags: ["📼 35mm Film", "🎞️ Light Leaks", "☕ Lo-Fi Audio", "✨ Nostalgia"]
  },
  "cinematic-travel": {
    title: "Cinematic Travel Montage",
    category: "Travel & Drone",
    duration: "0:18s",
    clips: "10 Clips",
    audio: "Epic Atmospheric Soundscape",
    description: "Slow-motion zoom transitions with ambient music soundscape and cinematic letterboxing. Designed for landscape and vacation clips.",
    tags: ["🏞️ Cinematic", "🚁 Drone Sync", "✈️ Travel", "⚡ 4K Export"]
  },
  "reel-glow": {
    title: "Cyberpunk Neon Video Glow",
    category: "Visual Effects",
    duration: "0:15s",
    clips: "6 Clips",
    audio: "Synthwave Cyber Bass",
    description: "Electric pink & violet outline tracing with dynamic subject tracking blur and 3D shadows. Stand out in the Instagram Explore tab.",
    tags: ["✨ Neon Glow", "✂️ Subject Cutout", "🎨 Color Pop", "📱 9:16 Reel"]
  },
  "fast-montage": {
    title: "Multi-Clip Photo & Video Reel",
    category: "Split Screen",
    duration: "0:10s",
    clips: "16 Clips",
    audio: "High-Energy Pop Beats",
    description: "Synchronized collage split-screen transitions with snappy zoom bursts. Pack 16 photos and video clips into a high-energy 10-second recap.",
    tags: ["⚡ Split Screen", "📸 Photo+Video", "🚀 High Energy", "⏱️ 0:10s Fast"]
  },
  "aesthetic-story": {
    title: "Minimalist Lifestyle Story",
    category: "Editorial Story",
    duration: "0:20s",
    clips: "6 Clips",
    audio: "Soft Warm Piano",
    description: "Soft pastel framing, gentle dissolve transitions, and clean typography badges. Creates a calm, luxurious aesthetic for your brand.",
    tags: ["🤍 Minimalist", "📖 Editorial", "🌸 Pastel Mood", "🖋️ Typography"]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const device = detectDevice();
  const templateId = getVideoTemplateIdFromUrl();
  const templateInfo = resolveTemplateInfo(templateId);

  renderVideoTemplateDetails(templateId, templateInfo);
  updateMetadata(templateId, templateInfo);
  applyDeviceAdaptations(templateId, device);
  initDeepLinkButton(templateId, device);
  initShareTools(templateId);
  generateQrCode(`https://edit-up.com/video-templates/${encodeURIComponent(templateId)}`);
});

/**
 * Detect Visitor Device Platform
 */
function detectDevice() {
  const ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();
  const isIOS = /ipad|iphone|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);
  const isDesktop = !isIOS && !isAndroid;

  return { isIOS, isAndroid, isDesktop };
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

  return "beat-sync"; // Default template
}

/**
 * Format string to Clean Title Case
 */
function formatTitleCase(str) {
  if (!str) return "Video Template";
  if (/^\d+$/.test(str)) return `Video Template #${str}`;
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Resolves template metadata: sets generic title and description while keeping preset tags/duration if available
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
    tags: preset.tags || ["🎵 Beat Sync Audio", "⚡ Auto Transitions", "📱 9:16 Vertical Reels", "✨ 4K Export"]
  };
}

/**
 * Render video template UI details in the DOM (Generic title & description for all templates)
 */
function renderVideoTemplateDetails(id, info) {
  const titleEl = document.getElementById('template-title');
  const idEl = document.getElementById('template-id-text');
  const descEl = document.getElementById('template-description');
  const tagsEl = document.getElementById('template-tags-container');
  const bannerTag = document.getElementById('template-banner-tag');
  const previewTitle = document.getElementById('template-preview-title');

  // Title and Description remain generic for all templates
  if (titleEl) titleEl.textContent = GENERIC_HEADING;
  if (idEl) idEl.textContent = id;
  if (descEl) descEl.textContent = GENERIC_DESCRIPTION;
  if (bannerTag) {
    bannerTag.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:middle; margin-right:4px;">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>
      VIDEO TEMPLATES PORTAL
    `;
  }
  if (previewTitle) previewTitle.textContent = GENERIC_HEADING;

  if (tagsEl) {
    const tags = (info && info.tags && info.tags.length) ? info.tags : [
      "🎵 Beat Sync Audio",
      "⚡ Auto Transitions",
      "📱 9:16 Vertical Reels",
      "✨ 4K Export"
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
  const deviceBadge = document.getElementById('device-status-badge');
  const btnOpenApp = document.getElementById('btn-open-app');
  const fallbackBox = document.querySelector('.template-fallback-box');
  const qrWrapper = document.getElementById('qr-scanner-card');
  const androidNotice = document.getElementById('android-device-notice');

  // Update deep link URL on the button
  if (btnOpenApp) {
    btnOpenApp.setAttribute('href', `${CUSTOM_SCHEME_PREFIX}${encodeURIComponent(id)}`);
  }

  if (device.isIOS) {
    if (deviceBadge) {
      deviceBadge.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="display:inline-block; vertical-align:middle; margin-right:6px;">
          <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
        iOS Device Detected • Ready to Open
      `;
      deviceBadge.className = 'device-pill device-pill-ios';
    }
    if (btnOpenApp) {
      btnOpenApp.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Open Template in Edit Up
      `;
    }
    if (qrWrapper) {
      qrWrapper.style.display = 'none'; // Hide desktop QR scanner on iOS devices
    }
    if (androidNotice) {
      androidNotice.style.display = 'none';
    }
  } else if (device.isDesktop) {
    if (deviceBadge) {
      deviceBadge.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="display:inline-block; vertical-align:middle; margin-right:6px;">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
        Desktop Browser • Scan with iPhone
      `;
      deviceBadge.className = 'device-pill device-pill-desktop';
    }
    if (btnOpenApp) {
      btnOpenApp.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Launch in Edit Up (editup://)
      `;
    }
    if (qrWrapper) {
      qrWrapper.style.display = 'flex'; // Ensure QR code is prominent on desktop
    }
    if (androidNotice) {
      androidNotice.style.display = 'none';
    }
  } else if (device.isAndroid) {
    if (deviceBadge) {
      deviceBadge.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="display:inline-block; vertical-align:middle; margin-right:6px;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        Android Detected • iOS Exclusive App
      `;
      deviceBadge.className = 'device-pill device-pill-android';
    }
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
    if (qrWrapper) {
      qrWrapper.style.display = 'none';
    }
  }
}

/**
 * Handle "Open in Edit Up App" button click with Custom URI Scheme and App Store fallback
 */
function initDeepLinkButton(id, device) {
  const btn = document.getElementById('btn-open-app');
  if (!btn) return;

  const deepLink = `${CUSTOM_SCHEME_PREFIX}${encodeURIComponent(id)}`;

  btn.addEventListener('click', (e) => {
    // If Android, direct to App Store or alert
    if (device.isAndroid) {
      return; // Let native link navigate to App Store
    }

    e.preventDefault();

    const startTime = Date.now();
    let appOpened = false;

    const onBlur = () => {
      appOpened = true;
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('pagehide', onBlur);
    };

    window.addEventListener('blur', onBlur);
    window.addEventListener('pagehide', onBlur);

    // Attempt to open native app via custom scheme
    window.location.href = deepLink;

    // Fallback to App Store if native app did not open after 1.6s
    setTimeout(() => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('pagehide', onBlur);

      // If document is still visible and less than 3 seconds elapsed, app wasn't opened
      if (!appOpened && document.visibilityState === 'visible' && (Date.now() - startTime < 3200)) {
        if (device.isIOS) {
          // Direct fallback to Apple App Store on iOS
          window.location.href = APP_STORE_URL;
        } else {
          // On desktop, scroll to QR code or offer App Store link
          const qrBox = document.getElementById('qr-scanner-card');
          if (qrBox) {
            qrBox.scrollIntoView({ behavior: 'smooth' });
            qrBox.style.boxShadow = '0 0 30px rgba(255, 0, 122, 0.7)';
            setTimeout(() => {
              qrBox.style.boxShadow = '';
            }, 2000);
          } else {
            window.open(APP_STORE_URL, '_blank');
          }
        }
      }
    }, 1600);
  });
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
        copyBtn.innerHTML = '<span>✓ Copied Universal Link!</span>';
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
          alert('Video template universal link copied to clipboard!');
        });
      }
    });
  }
}

/**
 * Generates lightweight visual QR code on canvas so desktop users can scan with iPhone camera
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
