# Deploy via Git — GitHub → Hostinger

This is the **same easy way** as your other site: we edit here → **push to GitHub** → **Hostinger pulls** the update.

No FTP passwords on your Mac needed.

---

## One-time setup

### 1. Create a GitHub repo

1. Log in at [github.com](https://github.com)
2. **New repository** (private is fine)
3. Name it e.g. `cinematic-viewing`
4. **Do not** add README/license (we already have files)
5. Copy the repo URL, e.g. `https://github.com/YOUR_USERNAME/cinematic-viewing.git`

### 2. Push this project from your Mac

In Terminal:

```bash
cd ~/Desktop/CinematicViewing
git init
git add index.html assets/
git commit -m "Initial Cinematic Viewing site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cinematic-viewing.git
git push -u origin main
```

(GitHub may ask you to sign in — browser or token.)

### 3. Connect GitHub in Hostinger

1. [hpanel.hostinger.com](https://hpanel.hostinger.com) → **Websites** → **Cinematic Viewing** → **Manage**
2. Find **Git** or **Advanced → Git** (wording varies by plan)
3. **Connect repository** → choose **GitHub**
4. Authorize Hostinger to access GitHub
5. Select repo **`cinematic-viewing`**, branch **`main`**
6. Set deploy directory to **`public_html`** (or what Hostinger shows)
7. Click **Deploy** / enable **Auto-deployment** if offered

### 4. Domain (123-reg)

Point **CinematicViewing.com** at Hostinger (nameservers from hPanel, or A record at 123-reg).  
Enable **SSL** in Hostinger.

---

## Every time we change the site

**You say:** `deploy now` or `push to git`

**I will:**

1. Save your changes in this folder
2. Run `git add` + `git commit` with a short message
3. Run `git push` (if GitHub is already connected on your Mac)

**Hostinger** then either:

- Updates **automatically** on push, or  
- You click **Deploy** once in hPanel → Git

You check: **https://cinematicviewing.com** (hard refresh: Cmd+Shift+R)

---

## What goes in the repo

| Include | Exclude |
|---------|---------|
| `index.html` | `conversation-log.md` (optional) |
| `assets/` (logo, hero.mp4) | `node_modules/` |
| `DEPLOY.md`, `README.md` | `.env.deploy` |

---

## If Git is not in your Hostinger plan

Some plans don’t show **Git** in hPanel. Then:

- Upgrade plan, or  
- Use FTP fallback: `.env.deploy` + `npm run deploy` (see `.env.deploy.example`)

---

## Quick checklist

- [ ] GitHub repo created  
- [ ] Code pushed to `main`  
- [ ] Hostinger Git connected to that repo  
- [ ] First deploy succeeded  
- [ ] Domain points to Hostinger  
- [ ] HTTPS on  

---

*May 2026*
