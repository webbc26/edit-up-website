/**
 * Edit Up - Generic Video Template Viewer & Universal Link Gateway
 * Domain: edit-up.com
 * Handles dynamic template ID resolution, device detection, deep link handoff,
 * Smart App Banner injection, and QR code generation.
 */

const APP_STORE_URL = "https://apps.apple.com/us/app/edit-up-ai-photo-video-editor/id1333491559";
const CUSTOM_SCHEME_PREFIX = "editup://video-template/";

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
 * Resolves template metadata: uses preset if registered, otherwise generates dynamic generic metadata
 */
function resolveTemplateInfo(id) {
  const cleanId = id.toLowerCase().trim();
  if (VIDEO_TEMPLATE_PRESETS[cleanId]) {
    return VIDEO_TEMPLATE_PRESETS[cleanId];
  }

  const title = formatTitleCase(id);
  return {
    title: `${title}`,
    category: "AI Video Template",
    duration: "0:15s",
    clips: "8-12 Clips",
    audio: "Auto Beat Sync Audio Track",
    description: `Ready-to-use Edit Up video template "${id}". Open directly in Edit Up to apply automatic beat-sync cuts, video clip replacement, and cinematic color transitions in 1 tap.`,
    tags: ["🎬 Video Template", "🎵 Beat Sync", "⚡ Auto Transitions", "📱 9:16 Vertical", "✨ 4K Export"]
  };
}

/**
 * Render video template UI details in the DOM
 */
function renderVideoTemplateDetails(id, info) {
  const titleEl = document.getElementById('template-title');
  const idEl = document.getElementById('template-id-text');
  const descEl = document.getElementById('template-description');
  const tagsEl = document.getElementById('template-tags-container');
  const bannerTag = document.getElementById('template-banner-tag');
  const previewTitle = document.getElementById('template-preview-title');

  if (titleEl) titleEl.textContent = info.title;
  if (idEl) idEl.textContent = id;
  if (descEl) descEl.textContent = info.description;
  if (bannerTag) bannerTag.textContent = `🎬 ${info.category.toUpperCase()}`;
  if (previewTitle) previewTitle.textContent = info.title;

  if (tagsEl && info.tags) {
    tagsEl.innerHTML = info.tags.map(t => `<span class="template-info-pill">${t}</span>`).join('');
  }
}

/**
 * Update Smart App Banner, Open Graph, and Page Title dynamically
 */
function updateMetadata(id, info) {
  document.title = `${info.title} | Edit Up Video Template`;

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

  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = `${info.title} | Edit Up Video Template`;

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = info.description;

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.content = `https://edit-up.com/video-templates/${encodeURIComponent(id)}`;

  // Update Twitter Cards
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.content = `${info.title} | Edit Up Video Template`;

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.content = info.description;
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
      deviceBadge.innerHTML = '<span>📱</span> iOS Device Detected • Ready to Open';
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
      deviceBadge.innerHTML = '<span>💻</span> Desktop Browser • Scan with iPhone';
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
      deviceBadge.innerHTML = '<span>🤖</span> Android Detected • iOS Exclusive';
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
          title: `Edit Up Video Template: ${id}`,
          text: `Check out this AI video template on Edit Up: AI Photo & Video Editor!`,
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
