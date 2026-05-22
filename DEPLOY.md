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

## One-time: let Cursor deploy without copy-paste

1. In Terminal:

```bash
cd ~/Desktop/CinematicViewing
cp .env.github.example .env.github
```

2. Create a GitHub token (same as before): **Settings → Developer settings → Tokens (classic) → `repo` scope**.

3. Open **`.env.github`** on your Mac and paste the token after `GITHUB_TOKEN=`. Save. **Do not send the token in chat.**

4. In Hostinger → **Git** → turn on **Auto deployment** (if available).

After this, when you say **`deploy now`**, Cursor runs `npm run deploy` → commit + push to GitHub automatically.

---

## Every time we change the site

**You say:** `deploy now`

**Cursor will:**

1. Save changes in this folder  
2. Run `npm run deploy` (commit + push `index.html` and `assets/`)

**Hostinger** then:

- Updates **automatically** if Auto deployment is on, or  
- You click **Deploy** once in hPanel → Git

Check: **https://cinematicviewing.com** (Cmd+Shift+R)

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
