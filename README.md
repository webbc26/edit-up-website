# Edit Up (`edit-up.com`) — AI Video Template Portal & Website

Official static website and Apple Universal Link portal for **[Edit Up: AI Photo Video Editor](https://apps.apple.com/us/app/edit-up-ai-photo-video-editor/id1333491559)** on the iOS App Store, hosted at **`https://edit-up.com`** on an Nginx VPS.

Features the signature neon sunset gradient color scheme of the app icon: Coral Red (`#FF0044`), Hot Pink (`#FF007A`), and Purple/Magenta (`#B800E6`).

---

## 🎬 Core Video Template Features

1. **Video Template Universal Links (`/video-templates/{id}`)**
   - Universal Link URL format: `https://edit-up.com/video-templates/{id}`
   - Opening on iOS launches the Edit Up app with pre-configured beat sync, audio tracks, and transitions via custom scheme `editup://video-template/{id}`.
   - Intelligent web fallback:
     - Shows video template specs (aspect ratio `9:16`, duration `0:15s`, clip count, beat sync status).
     - QR Code generator allows desktop visitors to scan with their iPhone camera to open the template immediately.
     - Direct fallback button to download on the Apple App Store.
     - Copy Universal Link & native Web Share API buttons.

2. **Apple App Site Association (AASA)**
   - Located at `/.well-known/apple-app-site-association` and `/apple-app-site-association`.
   - Verified credentials:
     - **Team ID:** `QA5HCG2XW6`
     - **Bundle ID:** `com.debotoshdey.SquareSize`
     - **App ID:** `QA5HCG2XW6.com.debotoshdey.SquareSize`
     - **Configured Paths:** `/video-templates/*`, `/video-templates/*/*`, `/v/*`, `/app/*`

3. **Generic Social Sharing Image & Metadata**
   - High-resolution Open Graph banner: `https://edit-up.com/assets/images/og-template-share.png` (1200 × 630 px).
   - Rich video-specific Open Graph and Twitter Cards:
     - `og:title` & `twitter:title`: `Easy Video Editor & Maker | Edit Up`
     - `og:description` & `twitter:description`: `Create viral Reels and TikTok videos effortlessly with Edit Up. Open this video template to auto-sync your photos and clips with beat-matched music, cinematic transitions, and 4K export.`
     - `apple-itunes-app`: Smart App Banner enabled for iOS Safari.

4. **Nginx VPS Configuration**
   - Production configuration located at [`nginx/edit-up.com.conf`](file:///home/nadim/braincraft/edit-up-html/nginx/edit-up.com.conf).
   - Proper JSON headers for AASA files, dynamic fallback routing for `/video-templates/`, asset caching, and security headers.

5. **AI Agent Rules & Skills**
   - [`AGENTS.md`](file:///home/nadim/braincraft/edit-up-html/AGENTS.md) & [`.cursorrules`](file:///home/nadim/braincraft/edit-up-html/.cursorrules) define the repository structure, brand colors, and standards so all AI agents generate consistent code.
   - [`.agents/skills/video-templates/SKILL.md`](file:///home/nadim/braincraft/edit-up-html/.agents/skills/video-templates/SKILL.md) provides a dedicated skill for agentic pairing.

---

## 📁 Repository Structure

```
edit-up-html/
├── .well-known/
│   ├── apple-app-site-association        # Apple Universal Link AASA file (no extension)
│   └── apple-app-site-association.json   # JSON copy
├── apple-app-site-association            # Root fallback for older iOS versions
├── apple-app-site-association.json
├── nginx/
│   └── edit-up.com.conf                  # Production Nginx virtual host configuration
├── video-templates/
│   └── index.html                        # Universal Video Template page (dynamically handles /video-templates/{id})
├── index.html                            # Master landing page
├── 404.html                              # Fallback router for dynamic paths
├── .gitignore                            # Clean git exclusion rules
├── AGENTS.md                             # Architectural standards for AI agents
├── .cursorrules                          # Cursor IDE agent instructions
├── .agents/skills/video-templates/       # Agent skill specification
├── assets/
│   ├── css/
│   │   └── style.css                     # Responsive CSS with app icon colors
│   ├── js/
│   │   ├── main.js                       # Home interactions, slider, FAQ, tester
│   │   └── template.js                   # Universal link handler, QR generator, sharing
│   └── images/
│       ├── app-icon.png                  # Master 512x512 app squircle icon
│       ├── apple-touch-icon.png          # 180x180 iOS icon
│       ├── favicon-32x32.png             # 32x32 browser favicon
│       ├── og-home-share.png             # 1200x630 Homepage Open Graph card
│       ├── og-template-share.png         # 1200x630 Video template social share card
│       ├── compare-before.jpg            # Before image for slider
│       ├── compare-after.jpg             # After image for slider
│       └── screenshots/                  # High-res App Store screenshots (screen-1 to 7)
```

---

## 💻 Running Locally

To run the site locally with Apple Universal Links and dynamic `/video-templates/{id}` routing (emulating Nginx `try_files`):

```bash
# Start the local development server (default port: 8080)
python3 serve.py

# Or specify a custom port
python3 serve.py 3000
```

> **Why `python3 serve.py` instead of `python3 -m http.server`?**  
> Python's built-in `http.server` only looks for physical files and folders on disk. Because video templates use dynamic universal link IDs (such as `/video-templates/1235`), standard `python3 -m http.server` returns `404 File not found`.  
> `serve.py` emulates Nginx's `try_files` rewrite rules (`/video-templates/*` -> `/video-templates/index.html`) and serves Apple AASA files with proper `application/json` headers.

---

## 🚀 Setting Up on Your VPS (Nginx)

1. **Clone or point this directory on your VPS:**
   ```bash
   # Example target path: /home/nadim/braincraft/edit-up-html
   # Or /var/www/edit-up.com
   ```

2. **Link the Nginx configuration:**
   ```bash
   sudo cp nginx/edit-up.com.conf /etc/nginx/sites-available/edit-up.com
   sudo ln -s /etc/nginx/sites-available/edit-up.com /etc/nginx/sites-enabled/
   ```

3. **Verify root path in the configuration:**
   Open `/etc/nginx/sites-available/edit-up.com` and ensure the `root` directive points to your directory path:
   ```nginx
   root /home/nadim/braincraft/edit-up-html;
   ```

4. **Obtain SSL Certificate using Certbot:**
   ```bash
   sudo certbot --nginx -d edit-up.com -d www.edit-up.com
   ```

5. **Test and reload Nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 🧪 Testing Video Universal Links

1. Open `https://edit-up.com/video-templates/1235` (or any template ID) in Safari on an iPhone.
2. If Edit Up is installed, iOS opens the app immediately to the specific template.
3. If accessed on desktop, scan the on-screen QR Code with an iPhone camera to test the handoff.
