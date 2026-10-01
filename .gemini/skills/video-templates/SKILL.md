---
name: video-templates
description: Manage, generate, and maintain Edit Up video templates, Apple Universal Links, and Nginx configurations for edit-up.com.
---

# Video Templates Skill for Edit Up (`edit-up.com`)

Use this skill when creating, updating, or testing video templates, universal links, Open Graph sharing cards, or Nginx server routes for **Edit Up: AI Photo Video Editor** (`https://edit-up.com`).

## Core Knowledge & Metadata

- **App ID:** `1333491559`
- **Team ID:** `QA5HCG2XW6`
- **Bundle ID:** `com.debotoshdey.SquareSize`
- **Domain:** `https://edit-up.com`
- **Apple Association Path:** `/.well-known/apple-app-site-association`
- **Universal Link URL Format:** `https://edit-up.com/video-templates/{id}`
- **Custom Scheme:** `editup://video-template/{id}`

## Color Scheme Standards
Sampled from the official app icon:
- Coral Red: `#FF0044`
- Hot Pink: `#FF007A`
- Magenta: `#FE00EC`
- Purple: `#B800E6`
- Background: `#0A0914`

## How to Add a New Video Template

1. **Register metadata** in `assets/js/template.js` inside `VIDEO_TEMPLATE_PRESETS`:
   ```javascript
   "template-id": {
     title: "Template Title",
     category: "Category Name",
     duration: "0:15s",
     clips: "10 Clips",
     audio: "Music Title / Beat Sync",
     description: "Description of the cuts, filters, and effects.",
     tags: ["🎵 Beat Sync", "⚡ Auto Transitions", "📱 9:16 Vertical"]
   }
   ```

2. **Generate pre-rendered static folder:**
   ```bash
   mkdir -p video-templates/template-id
   cp video-templates/index.html video-templates/template-id/index.html
   ```

3. **Add preview card** to `video-templates/index.html` and `index.html`.

4. **Verify Universal Link and AASA file:**
   Ensure `/.well-known/apple-app-site-association` includes `/video-templates/*`.

5. **Test in browser & Nginx:**
   Verify `https://edit-up.com/video-templates/template-id` returns HTTP 200 with complete Open Graph meta tags and smart app banner.
