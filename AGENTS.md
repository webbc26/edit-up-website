# Agent Guidelines for Edit Up (`edit-up.com`)

This repository contains the official static website and Apple Universal Link portal for **Edit Up: AI Photo Video Editor**, hosted at **`https://edit-up.com`** on an Nginx VPS.

All AI agents (Antigravity, Claude Code, Cursor, Copilot) modifying or generating code in this repository MUST strictly follow these architectural standards and conventions.

---

## 1. Project Overview & App Metadata

| Field | Value |
|---|---|
| **App Name** | Edit Up: AI Photo Video Editor |
| **Domain** | `https://edit-up.com` |
| **Apple App ID (Track ID)** | `1333491559` |
| **Apple Developer Team ID** | `QA5HCG2XW6` |
| **Bundle Identifier** | `com.debotoshdey.SquareSize` |
| **Full Apple App ID** | `QA5HCG2XW6.com.debotoshdey.SquareSize` |
| **App Store URL** | `https://apps.apple.com/us/app/edit-up-ai-photo-video-editor/id1333491559` |
| **Custom URI Scheme** | `editup://video-template/{id}` (and `editup://template/{id}`) |
| **Primary Route** | `/video-templates/{id}` |
| **Hosting Environment** | Linux VPS with Nginx directly serving this folder |

---

## 2. Brand Identity & Design System

The visual design is strictly based on the official Edit Up app icon. Do NOT introduce arbitrary color themes.

* **Primary Palette (App Icon Neon Gradient):**
  * Coral Red: `#FF0044`
  * Hot Pink: `#FF007A`
  * Electric Magenta: `#FE00EC`
  * Deep Purple / Violet: `#B800E6`
* **Background Palette:**
  * Canvas Body: `#0A0914` (Deep dark slate)
  * Elevated Surface / Cards: `rgba(22, 20, 38, 0.65)` with `backdrop-filter: blur(16px)`
  * Card Borders: `rgba(255, 255, 255, 0.08)` with hover highlight `rgba(255, 0, 122, 0.4)`
* **Typography:**
  * System font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif`
  * High-contrast headings with linear gradient text clips (`var(--gradient-brand)`).
* **Border Radii:**
  * iOS Squircle standard: `12px` (icons/buttons), `18px` (cards), `26px` (preview containers), `36px` (phones), `9999px` (pills/badges).

---

## 3. Technology Stack & Rules

* **Zero Heavy Frameworks:** Pure semantic HTML5, modern vanilla CSS3 (CSS custom properties), and vanilla modern JavaScript (ES6+).
* **No Node runtime or build step required:** All HTML, CSS, and JS files must be directly executable and servable as static files by Nginx.
* **Asset Paths:** Always use absolute root-relative paths (e.g. `/assets/css/style.css`, `/assets/images/app-icon.png`, `/video-templates/`) so nested paths like `/video-templates/beat-sync/` resolve assets accurately without broken relative links.

---

## 4. Video Template Universal Link Architecture

Universal Links allow iOS users to tap `https://edit-up.com/video-templates/{id}` and jump directly into the Edit Up app with the chosen video template loaded.

### 4.1. Apple App Site Association (AASA)
* Files:
  * `/.well-known/apple-app-site-association`
  * `/apple-app-site-association`
* **Rule:** Must be served as `application/json` without any `.json` file extension in the URL.
* Nginx handles this in `nginx/edit-up.com.conf`.

### 4.2. Video Template Page Requirements (`video-templates/index.html`)
Every video template page MUST contain:
1. **Apple Smart App Banner:**
   ```html
   <meta name="apple-itunes-app" content="app-id=1333491559, app-argument=editup://video-template">
   ```
2. **Generic Social Sharing Metadata (Open Graph & Twitter):**
   ```html
   <meta property="og:type" content="video.other">
   <meta property="og:title" content="Easy Video Editor & Maker | Edit Up">
   <meta property="og:description" content="Create viral Reels and TikTok videos effortlessly with Edit Up. Open this video template to auto-sync your photos and clips with beat-matched music, cinematic transitions, and 4K export.">
   <meta property="og:image" content="https://edit-up.com/assets/images/og-template-share.png">
   <meta property="og:image:width" content="1200">
   <meta property="og:image:height" content="630">
   <meta name="twitter:card" content="summary_large_image">
   <meta name="twitter:title" content="Easy Video Editor & Maker | Edit Up">
   <meta name="twitter:description" content="Create viral Reels and TikTok videos effortlessly with Edit Up. Open this video template to auto-sync your photos and clips with beat-matched music, cinematic transitions, and 4K export.">
   <meta name="twitter:image" content="https://edit-up.com/assets/images/og-template-share.png">
   ```
3. **Deep Link Handoff:**
   * Button with ID `btn-open-app` launching `editup://video-template/{id}`.
   * Fallback timeout to `https://apps.apple.com/us/app/edit-up-ai-photo-video-editor/id1333491559`.
4. **Desktop QR Code Scanner:**
   * Canvas element `template-qr-canvas` rendering a QR code for iPhone camera scanning.

---

## 5. Standard Procedure: Adding a New Video Template

When asked to add or modify a video template:
1. **Update JS Preset Registry:**
   * Open [`assets/js/template.js`](file:///home/nadim/braincraft/edit-up-html/assets/js/template.js).
   * Add entry to `VIDEO_TEMPLATE_PRESETS`:
     ```javascript
     "my-template-id": {
       title: "My Template Name",
       category: "Reels & TikTok",
       duration: "0:15s",
       clips: "10 Clips",
       audio: "Trending Audio Title",
       description: "Description of the cuts, transitions, and mood.",
       tags: ["🎵 Beat Sync", "⚡ Auto Transitions", "📱 9:16 Vertical"]
     }
     ```
2. **Create Pre-rendered Directory:**
   * Create folder `video-templates/my-template-id/`.
   * Copy `video-templates/index.html` to `video-templates/my-template-id/index.html`.
3. **Update Hub Showcases:**
   * Add template preview card to `video-templates/index.html` and `index.html`.
4. **Verify Universal Link:**
   * Ensure URL is `https://edit-up.com/video-templates/my-template-id`.

---

## 6. Nginx Server Configuration

* File location: [`nginx/edit-up.com.conf`](file:///home/nadim/braincraft/edit-up-html/nginx/edit-up.com.conf)
* When updating routes or caching policies, maintain:
  * `location = /.well-known/apple-app-site-association` with `default_type application/json;`.
  * `location /video-templates/` with `try_files $uri $uri/ /video-templates/index.html?$args;`.
  * `location /assets/` with `max-age=31536000, immutable`.
  * Error page 404 pointing to `/404.html`.
