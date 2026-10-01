/**
 * Edit Up - Video Template Viewer & Universal Link Handler
 * Domain: edit-up.com
 * Handles video-templates routing, dynamic parameter extraction, deep linking, QR code generation, and sharing
 */

const APP_STORE_URL = "https://apps.apple.com/us/app/edit-up-ai-photo-video-editor/id1333491559";
const CUSTOM_SCHEME_PREFIX = "editup://video-template/";

// Video Template Presets Mapping
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
  const templateId = getVideoTemplateIdFromUrl();
  renderVideoTemplateDetails(templateId);
  initDeepLinkButton(templateId);
  initShareTools(templateId);
  generateQrCode(window.location.href);
});

/**
 * Extract video template ID from /video-templates/{id}, query ?id=, or hash #id
 */
function getVideoTemplateIdFromUrl() {
  const path = window.location.pathname;
  
  // Check if session storage has a redirect from 404.html
  const storedId = sessionStorage.getItem('redirect_video_template_id');
  if (storedId) {
    sessionStorage.removeItem('redirect_video_template_id');
    return storedId;
  }

  // Check URL path: /video-templates/<id>
  const match = path.match(/\/video-templates\/([^\/\?#]+)/i);
  if (match && match[1] && match[1] !== 'index.html') {
    return decodeURIComponent(match[1]);
  }

  // Also check legacy /templates/<id> if any
  const legacyMatch = path.match(/\/templates\/([^\/\?#]+)/i);
  if (legacyMatch && legacyMatch[1] && legacyMatch[1] !== 'index.html') {
    return decodeURIComponent(legacyMatch[1]);
  }

  // Check query parameter: ?id=<id>
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('id')) {
    return urlParams.get('id');
  }

  // Check hash: #<id>
  if (window.location.hash) {
    const hash = window.location.hash.substring(1).trim();
    if (hash) return hash;
  }

  return "beat-sync"; // Default video template
}

/**
 * Format string to Title Case
 */
function formatTitleCase(str) {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Render video template UI details
 */
function renderVideoTemplateDetails(id) {
  const cleanId = id.toLowerCase().trim();
  const info = VIDEO_TEMPLATE_PRESETS[cleanId] || {
    title: `${formatTitleCase(cleanId)} Video Template`,
    category: "AI Video Template",
    duration: "0:15s",
    clips: "8-12 Clips",
    audio: "Auto Beat Sync Audio Track",
    description: `Custom Edit Up video template ID "${cleanId}". Open in the app to apply automatic beat-sync cuts, audio replacement, and cinematic color transitions in 1 tap.`,
    tags: ["🎬 Video Template", "🎵 Beat Sync", "⚡ Auto Transitions", "📱 9:16 Vertical"]
  };

  // Update DOM elements
  const titleEl = document.getElementById('template-title');
  const idEl = document.getElementById('template-id-text');
  const descEl = document.getElementById('template-description');
  const tagsEl = document.getElementById('template-tags-container');
  const bannerTag = document.getElementById('template-banner-tag');

  if (titleEl) titleEl.textContent = info.title;
  if (idEl) idEl.textContent = id;
  if (descEl) descEl.textContent = info.description;
  if (bannerTag) bannerTag.textContent = `🎬 ${info.category.toUpperCase()}`;

  if (tagsEl) {
    tagsEl.innerHTML = info.tags.map(t => `<span class="template-info-pill">${t}</span>`).join('');
  }

  // Update Page Title
  document.title = `${info.title} | Edit Up Video Template`;
}

/**
 * Handle "Open in Edit Up App" button with custom scheme & App Store fallback
 */
function initDeepLinkButton(id) {
  const btn = document.getElementById('btn-open-app');
  if (!btn) return;

  const deepLink = `${CUSTOM_SCHEME_PREFIX}${encodeURIComponent(id)}`;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const startTime = Date.now();
    let appOpened = false;

    const onBlur = () => {
      appOpened = true;
      window.removeEventListener('blur', onBlur);
    };
    window.addEventListener('blur', onBlur);

    // Attempt custom URI scheme
    window.location.href = deepLink;

    // Fallback prompt if app not installed
    setTimeout(() => {
      window.removeEventListener('blur', onBlur);
      if (!appOpened && (Date.now() - startTime < 3000)) {
        const userConfirm = confirm(
          "Edit Up does not appear to be installed on this device.\n\nWould you like to download Edit Up for free on the App Store to use this video template?"
        );
        if (userConfirm) {
          window.location.href = APP_STORE_URL;
        }
      }
    }, 1600);
  });
}

/**
 * Share & Copy Link utility
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
        }, 2000);
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
          alert('Video template link copied to clipboard!');
        });
      }
    });
  }
}

/**
 * Generates lightweight visual QR code on canvas so desktop users can scan with iPhone
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
