# GitHub Pages Portfolio — Design Spec

**Date:** 2026-09-24  
**Owner:** Samar Nathani (SammySN-car)  
**Status:** Approved (pending written review)

---

## 1. Purpose & Audience

A single-page personal portfolio hosted at `sammysn-car.github.io`, showcasing Samar's AI/ML work, open-source contributions, and coursework.

**Primary audiences (equal weight):**
- Recruiters / hiring managers — need fast scan, clear structure, proof of skills
- Fellow developers / OSS community — notice craft, interactions, code quality

**Success criteria:**
- Visitor understands who Samar is and what he builds within 10 seconds
- Projects, OSS PRs, and coursework are all discoverable in one scroll
- Site demonstrates frontend craft (theme toggle, filters, animations) without feeling gimmicky
- Deploys via GitHub Pages with zero build step

---

## 2. Approach

**Static HTML/CSS/JavaScript** — no framework, no build tooling.

**Rationale:**
- Edit → push → live (zero friction)
- Proves fundamentals to recruiters
- Portfolio-scale interactions are trivial in vanilla JS
- Fastest to ship and easiest to maintain

**Rejected alternatives:**
- Vue 3 + Vite — overkill; adds toolchain for a one-pager
- Astro/SSG — new learning surface for minimal gain

---

## 3. Site structure

Single page (`index.html`) with smooth-scroll navigation.

| # | Section | Purpose |
|---|---------|---------|
| 1 | Hero | Name, one-liner, CTAs (View Projects / Contact) |
| 2 | About | Short bio + skills grid |
| 3 | Projects | Filterable card grid |
| 4 | Open Source | Merged PRs with links |
| 5 | Coursework | Collapsible grouped list |
| 6 | Contact | Email + GitHub links |

**File layout:**
```
SammySN-car.github.io/
├── index.html
├── css/styles.css
├── js/main.js
├── docs/superpowers/specs/   (this spec lives here)
└── assets/                   (optional)
```

---

## 4. Visual design

**Aesthetic:** Dark-first, modern, tech-forward. Not templated.

**Color palette:**

| Role | Dark mode | Light mode |
|------|-----------|------------|
| Background | `#0a0e14` | `#f8f9fa` |
| Surface/cards | `#111827` | `#ffffff` |
| Primary accent | `#22d3ee` (cyan) | `#0891b2` |
| Secondary accent | `#a78bfa` (violet) | `#7c3aed` |
| Text | `#e5e7eb` | `#1f2937` |

**Typography:**
- Headings/body: system font stack (no webfont — fastest, zero layout shift)
- Mono (tags/code): `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

**Layout:**
- Max-width ~1100px, generous whitespace
- Cards: subtle border + hover lift
- Mobile-first responsive
- Dark/light toggle in navbar, persisted to localStorage

**Explicitly excluded:** heavy gradients, particle backgrounds, stock hero images, excessive animation.

---

## 5. Interactions & behavior

### 5.1 Theme toggle
- ☀️/🌙 in navbar
- Defaults to `prefers-color-scheme`
- Persisted to `localStorage`
- 0.3s smooth transition; no flash of wrong theme on load

### 5.2 Project filter
- Tag pills derived from project tags in §6.3: `All` · `AI/ML` · `Web` · `Full-stack` · `Python`
- Click filters cards with fade/hide
- Pure JS, no libraries

### 5.3 Scroll animations
- Intersection Observer: fade-in on scroll, once per element
- Respect `prefers-reduced-motion`

### 5.4 Navbar
- Sticky, blurs on scroll (`backdrop-filter`)
- Active section highlight
- Mobile hamburger menu

### 5.5 Project cards
```
┌─────────────────────────┐
│ [icon/emoji]            │
│ Project Name            │
│ One-line description    │
│ [tag] [tag] [tag]       │
│ ↗ GitHub   ↗ Demo       │
└─────────────────────────┘
```
- Hover: border glow + lift
- External links open in new tab

### 5.6 Contact
- `mailto:` button
- GitHub icon link
- No backend form (excluded — YAGNI)
- LinkedIn: excluded for now (future addition)

---

## 6. Content & data

Content is hardcoded in `index.html`. No CMS, no JSON fetch. Future option: extract projects to `projects.json` if the list grows.

### 6.1 Hero
```
Hi, I'm Samar Nathani 👋
AI/ML developer building RAG pipelines, LLM agents & intelligent systems
[View Projects]  [Contact]
```

### 6.2 About
- 2–3 sentence bio
- Skills grid (4 columns): Languages · AI/ML · Web · Tools  
  (mirrors profile README skills table)

### 6.3 Projects (7 cards)

| Project | Tags | Link |
|---------|------|------|
| moodbeats | AI/ML, Python, RAG | GitHub |
| smart-mcq-solver | AI/ML, Python, ML | GitHub |
| ai-research-agent | AI/ML, Python, Agents | GitHub |
| jev-deliberation-judge | AI/ML, Python, Multi-agent | GitHub |
| readme-free.ai | AI/ML, Python, LLM | GitHub |
| comment-cat-prediction-challenge | AI/ML, Data Science | GitHub |
| Event-Booking-App | Web, Full-stack, Vue | GitHub |

**Decision:** Include exactly one full-stack card (`Event-Booking-App`) to show breadth. Rest are AI/ML.

### 6.4 Open Source
Bullet list with links:
- pytorch/pytorch
- supabase/supabase
- ag2ai/faststream
- wemake-services/django-modern-rest (4 merged PRs)
- dgtlmoon/changedetection.io

### 6.5 Coursework
Collapsible `<details>` groups (same structure as profile README):
- Programming
- Application Development
- Machine Learning & AI
- Mathematics & Statistics

### 6.6 Contact
- Email: `samarnathani0@gmail.com`
- GitHub: `https://github.com/SammySN-car`
- LinkedIn: not included (v2)

---

## 7. Technical constraints

- **Hosting:** GitHub Pages from `SammySN-car/SammySN-car.github.io` repo (or `docs/` on existing repo — decision: dedicated repo, root-served)
- **No build step:** open `index.html` works locally
- **Browser support:** last 2 versions of Chrome/Firefox/Safari/Edge
- **Accessibility:** semantic HTML, alt text, keyboard navigation, `prefers-reduced-motion`, color contrast AA
- **Performance:** no external JS libraries; system fonts only (no external font requests)

---

## 8. Out of scope (v2+)

- Blog / markdown content pipeline
- Live embedded demos
- Contact form with backend
- LinkedIn link
- Multi-language (i18n)
- Analytics (can add later via GitHub-native or privacy-friendly option)

---

## 9. Acceptance criteria

1. Site loads at `https://sammysn-car.github.io` via GitHub Pages
2. All 6 sections present and navigable via sticky navbar
3. Theme toggle works, persists across reload, defaults to system preference
4. Project filter correctly shows/hides cards by tag
5. Scroll animations fire once and respect reduced-motion
6. Mobile layout usable at 375px width
7. All external links open correctly (new tab where appropriate)
8. No console errors
9. Lighthouse accessibility score ≥ 90 (target)

---

## 10. Open questions

None — all decisions made during design review (2026-09-24).
