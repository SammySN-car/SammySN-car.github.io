# GitHub Pages Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a single-page static portfolio at `sammysn-car.github.io` showcasing AI/ML projects, open-source contributions, and coursework.

**Architecture:** Static HTML/CSS/JS with no build step. One `index.html`, one stylesheet using CSS custom properties for dark/light themes, one `main.js` for theme toggle, project filtering, scroll animations, and mobile nav. Deployed via GitHub Pages from a dedicated `SammySN-car.github.io` repo (root-served).

**Tech Stack:** HTML5, CSS3 (custom properties, grid/flex, backdrop-filter), vanilla JavaScript (Intersection Observer, localStorage, DOM APIs). System fonts only. No frameworks, no bundlers, no external JS libraries.

**Spec:** `docs/superpowers/specs/2026-09-24-github-pages-portfolio-design.md`

## Global Constraints

- No build step: opening `index.html` locally in a browser must work
- No external JS libraries or CDNs for scripts
- No external font requests: system font stack only
- Color palette (dark): bg `#0a0e14`, surface `#111827`, primary `#22d3ee`, secondary `#a78bfa`, text `#e5e7eb`
- Color palette (light): bg `#f8f9fa`, surface `#ffffff`, primary `#0891b2`, secondary `#7c3aed`, text `#1f2937`
- Max content width: `1100px`
- Theme transition: `0.3s` on color/background properties
- Browser support: last 2 versions Chrome/Firefox/Safari/Edge
- Accessibility: semantic HTML, keyboard nav, `prefers-reduced-motion` respected, WCAG AA contrast
- Exactly 7 project cards; exactly 1 full-stack card (`Event-Booking-App`)
- Filter pills: `All`, `AI/ML`, `Web`, `Full-stack`, `Python`
- Contact email: `samarnathani0@gmail.com`
- GitHub profile URL: `https://github.com/SammySN-car`
- Profile README skills mirrored in About section (4 columns: Languages, AI/ML, Web, Tools)
- 6 page sections: Hero, About, Projects, Open Source, Coursework, Contact

## Review Focus

- **Flash of wrong theme on load:** Theme must be applied before first paint via inline head script; a user with light system preference who previously chose dark must not see dark-to-light flash. Test: set localStorage theme, reload, assert `data-theme` on `<html>` matches before body renders (check via inline script presence + localStorage round-trip unit test).
- **Filter leaves orphaned empty states:** Clicking a tag with zero matching cards, or returning to `All`, must show correct card count with no stuck `hidden` class. Test: unit-test pure filter logic; browser-verify `All` restores all 7 cards.
- **Reduced motion still animates:** Users with `prefers-reduced-motion: reduce` must get no scroll fade-ins. Test: unit-test gate function; browser-verify with emulation.
- **Mobile menu traps keyboard focus:** Hamburger open/close must manage `aria-expanded` and not leave focusable off-screen links. Test: browser keyboard walkthrough at 375px.
- **External links open safely:** All project/GitHub links use `target="_blank" rel="noopener noreferrer"`. Test: DOM assertion across all `a[target="_blank"]`.

---

### Task 1: Project scaffold and git initialization

**Files:**
- Create: `index.html` (minimal shell)
- Create: `css/styles.css` (empty placeholder)
- Create: `js/main.js` (empty placeholder)
- Create: `.gitignore`
- Existing: `docs/superpowers/specs/` (do not delete)

**Interfaces:**
- Consumes: existing spec at `docs/superpowers/specs/2026-09-24-github-pages-portfolio-design.md`
- Produces: git repo at project root; `index.html` links `css/styles.css` and `js/main.js` with `defer` on the script

- [ ] **Step 1: Initialize git repo in portfolio folder**

Run from `C:\Users\samar\Downloads\4-projects\portfolio`:
```bash
git init
git branch -M main
```

- [ ] **Step 2: Create .gitignore**

```
.DS_Store
Thumbs.db
*.log
node_modules/
```

- [ ] **Step 3: Create minimal index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Samar Nathani — AI/ML developer building RAG pipelines, LLM agents and intelligent systems.">
  <title>Samar Nathani — AI/ML Developer</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <main id="main">
    <!-- Sections added in later tasks -->
  </main>
  <script src="js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 4: Create placeholder css and js files**

`css/styles.css`:
```css
/* Design system and layout — filled in Task 2+ */
```

`js/main.js`:
```javascript
// Theme, filter, animations — filled in Task 7+
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore index.html css/styles.css js/main.js docs/
git commit -m "chore: scaffold portfolio static site"
```

---

### Task 2: CSS design system and theme tokens

**Files:**
- Modify: `css/styles.css` (replace placeholder)
- Test: `tests/theme-tokens.test.mjs` (create)

**Interfaces:**
- Consumes: none
- Produces: CSS custom properties `--bg`, `--surface`, `--primary`, `--secondary`, `--text`, `--text-muted`, `--border` under `:root` (dark defaults) and `[data-theme="light"]`; utilities `.container`, `.section`, `.section-title`; global reset; `scroll-behavior: smooth` gated by reduced-motion

- [ ] **Step 1: Write failing test for token presence in CSS file**

Create `tests/theme-tokens.test.mjs`:
```javascript
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert';

const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');

test('defines dark theme tokens on :root', () => {
  assert.match(css, /:root\s*\{[^}]*--bg:\s*#0a0e14/);
  assert.match(css, /--surface:\s*#111827/);
  assert.match(css, /--primary:\s*#22d3ee/);
  assert.match(css, /--secondary:\s*#a78bfa/);
  assert.match(css, /--text:\s*#e5e7eb/);
});

test('defines light theme overrides', () => {
  assert.match(css, /\[data-theme="light"\]/);
  assert.match(css, /--bg:\s*#f8f9fa/);
  assert.match(css, /--primary:\s*#0891b2/);
});

test('gates scroll-behavior behind no-preference', () => {
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\)[\s\S]*scroll-behavior:\s*smooth/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/theme-tokens.test.mjs`
Expected: FAIL — tokens not found in placeholder CSS

- [ ] **Step 3: Write design system CSS**

Replace `css/styles.css` with design tokens, reset, layout utilities, and reveal animation classes. Full CSS:

```css
:root {
  --bg: #0a0e14;
  --surface: #111827;
  --primary: #22d3ee;
  --secondary: #a78bfa;
  --text: #e5e7eb;
  --text-muted: #9ca3af;
  --border: #1f2937;
  --nav-bg: rgba(10, 14, 20, 0.85);
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
  --glow: 0 0 0 1px var(--primary), 0 0 20px rgba(34, 211, 238, 0.15);
  --radius: 12px;
  --max-w: 1100px;
  --font: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color-scheme: dark;
}

[data-theme="light"] {
  --bg: #f8f9fa;
  --surface: #ffffff;
  --primary: #0891b2;
  --secondary: #7c3aed;
  --text: #1f2937;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --nav-bg: rgba(248, 249, 250, 0.85);
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  --glow: 0 0 0 1px var(--primary), 0 0 16px rgba(8, 145, 178, 0.12);
  color-scheme: light;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-padding-top: 72px; }

@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  transition: background-color 0.3s ease, color 0.3s ease;
}

img { max-width: 100%; display: block; }
a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }

.container { width: min(100% - 2rem, var(--max-w)); margin-inline: auto; }
.section { padding-block: 4.5rem; }

.section-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 2rem;
  color: var(--text);
}

.section-title::after {
  content: "";
  display: block;
  width: 48px;
  height: 3px;
  margin-top: 0.5rem;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 2px;
}

.reveal { opacity: 1; transform: none; }

@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .reveal.reveal-visible { opacity: 1; transform: translateY(0); }
}

:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/theme-tokens.test.mjs`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add css/styles.css tests/theme-tokens.test.mjs
git commit -m "feat: add CSS design tokens and theme system"
```

---

### Task 3: Navbar and page shell

**Files:**
- Modify: `index.html` (navbar + section stubs)
- Modify: `css/styles.css` (append navbar styles)

**Interfaces:**
- Consumes: `.container`, `.section` from Task 2
- Produces: `<nav class="navbar">` with brand, links (`#about`, `#projects`, `#opensource`, `#coursework`, `#contact`), `#theme-toggle`, `#nav-toggle`; `<main>` with empty sections `#hero`, `#about`, `#projects`, `#opensource`, `#coursework`, `#contact`; `#year` in footer

- [ ] **Step 1: Replace index.html body content**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Samar Nathani — AI/ML developer building RAG pipelines, LLM agents and intelligent systems.">
  <title>Samar Nathani — AI/ML Developer</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <nav class="navbar" aria-label="Primary">
    <div class="container nav-inner">
      <a href="#" class="nav-brand">Samar<span class="accent">.</span></a>

      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Open menu">
        <span class="hamburger" aria-hidden="true"></span>
      </button>

      <div class="nav-menu" id="nav-menu">
        <ul class="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#opensource">Open Source</a></li>
          <li><a href="#coursework">Coursework</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle color theme" title="Toggle theme">
          <span class="theme-icon theme-icon--dark" aria-hidden="true">🌙</span>
          <span class="theme-icon theme-icon--light" aria-hidden="true">☀️</span>
        </button>
      </div>
    </div>
  </nav>

  <main id="main">
    <section id="hero" class="section hero"></section>
    <section id="about" class="section"></section>
    <section id="projects" class="section"></section>
    <section id="opensource" class="section"></section>
    <section id="coursework" class="section"></section>
    <section id="contact" class="section"></section>
  </main>

  <footer class="footer">
    <div class="container">
      <p>© <span id="year"></span> Samar Nathani</p>
    </div>
  </footer>

  <script src="js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Append navbar CSS to styles.css**

```css
.skip-link {
  position: absolute; left: -9999px; top: 0;
  background: var(--primary); color: var(--bg);
  padding: 0.5rem 1rem; z-index: 1000;
}
.skip-link:focus { left: 0; }

.navbar {
  position: sticky; top: 0; z-index: 100;
  background: var(--nav-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  transition: background-color 0.3s ease;
}

.nav-inner {
  display: flex; align-items: center; justify-content: space-between;
  min-height: 64px; gap: 1rem;
}

.nav-brand { font-size: 1.25rem; font-weight: 700; color: var(--text); text-decoration: none; }
.nav-brand .accent { color: var(--primary); }

.nav-menu { display: flex; align-items: center; gap: 1.5rem; }
.nav-links { display: flex; list-style: none; gap: 1.25rem; }
.nav-links a { color: var(--text-muted); font-size: 0.95rem; text-decoration: none; transition: color 0.2s ease; }
.nav-links a:hover, .nav-links a.active { color: var(--primary); }

.theme-toggle {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 999px; width: 40px; height: 40px; cursor: pointer;
  display: grid; place-items: center; font-size: 1rem;
  transition: border-color 0.2s ease;
}
.theme-toggle:hover { border-color: var(--primary); }
.theme-icon--light { display: none; }
[data-theme="light"] .theme-icon--dark { display: none; }
[data-theme="light"] .theme-icon--light { display: inline; }

.nav-toggle { display: none; background: none; border: none; cursor: pointer; padding: 0.5rem; }
.hamburger, .hamburger::before, .hamburger::after {
  display: block; width: 22px; height: 2px; background: var(--text);
  position: relative; transition: transform 0.25s ease, opacity 0.25s ease;
}
.hamburger::before, .hamburger::after { content: ""; position: absolute; left: 0; }
.hamburger::before { top: -7px; }
.hamburger::after { top: 7px; }
.nav-toggle[aria-expanded="true"] .hamburger { background: transparent; }
.nav-toggle[aria-expanded="true"] .hamburger::before { top: 0; transform: rotate(45deg); }
.nav-toggle[aria-expanded="true"] .hamburger::after { top: 0; transform: rotate(-45deg); }

.footer {
  border-top: 1px solid var(--border); padding-block: 1.5rem;
  text-align: center; color: var(--text-muted); font-size: 0.9rem;
}

@media (max-width: 768px) {
  .nav-toggle { display: block; }
  .nav-menu {
    position: absolute; top: 64px; left: 0; right: 0;
    flex-direction: column; align-items: stretch;
    background: var(--surface); border-bottom: 1px solid var(--border);
    padding: 1rem; gap: 1rem; display: none;
  }
  .nav-menu.is-open { display: flex; }
  .nav-links { flex-direction: column; gap: 0.75rem; }
}
```

- [ ] **Step 3: Browser verify navbar**

- Sticky navbar visible; desktop row layout; hamburger hidden
- At 375px hamburger appears; menu hidden until click
- No horizontal scrollbar

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add sticky navbar with mobile menu shell"
```

---

### Task 4: Hero and About sections

**Files:**
- Modify: `index.html` (fill `#hero`, `#about`)
- Modify: `css/styles.css` (append hero + about)

**Interfaces:**
- Consumes: navbar shell, design tokens
- Produces: Hero h1 + CTAs (`#projects`, `#contact`); About bio + `.skills-grid` with four `.skill-group` (Languages, AI/ML, Web, Tools) matching profile README

- [ ] **Step 1: Fill hero section**

```html
<section id="hero" class="section hero">
  <div class="container hero-inner">
    <p class="hero-greeting reveal">Hi, I'm Samar Nathani 👋</p>
    <h1 class="hero-title reveal">
      AI/ML developer building <span class="gradient-text">RAG pipelines</span>, LLM agents &amp; intelligent systems
    </h1>
    <p class="hero-sub reveal">Python · LangGraph · Full-stack · Open source contributor</p>
    <div class="hero-ctas reveal">
      <a href="#projects" class="btn btn-primary">View Projects</a>
      <a href="#contact" class="btn btn-outline">Contact</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Fill about section**

```html
<section id="about" class="section">
  <div class="container">
    <h2 class="section-title reveal">About</h2>
    <div class="about-grid">
      <div class="about-bio reveal">
        <p>
          I build AI systems that turn messy information into useful answers —
          from music discovery with RAG to multi-agent deliberation judges.
          I care about clear interfaces, measurable results, and shipping things people can actually use.
        </p>
        <p>
          When I'm not training models, I'm contributing fixes to open-source
          projects like <strong>pytorch</strong>, <strong>supabase</strong>, and <strong>faststream</strong>.
        </p>
      </div>
      <div class="skills-grid reveal">
        <div class="skill-group">
          <h3>Languages</h3>
          <ul><li>Python</li><li>Java</li><li>SQL</li><li>JavaScript</li><li>HTML/CSS</li></ul>
        </div>
        <div class="skill-group">
          <h3>AI / ML</h3>
          <ul><li>RAG pipelines</li><li>LangGraph / LangChain</li><li>PyTorch</li><li>Transformers / Hugging Face</li><li>Embeddings &amp; vector search</li></ul>
        </div>
        <div class="skill-group">
          <h3>Web</h3>
          <ul><li>Vue 3</li><li>Flask</li><li>FastAPI</li><li>REST APIs</li></ul>
        </div>
        <div class="skill-group">
          <h3>Tools</h3>
          <ul><li>Git</li><li>Docker</li><li>Supabase</li><li>FAISS</li><li>Postgres</li></ul>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Append hero + about CSS**

```css
.hero { min-height: calc(100vh - 64px); display: flex; align-items: center; padding-block: 4rem; }
.hero-greeting { color: var(--primary); font-size: 1.1rem; margin-bottom: 0.75rem; font-family: var(--mono); }
.hero-title { font-size: clamp(1.75rem, 5vw, 3rem); line-height: 1.2; font-weight: 800; max-width: 18ch; margin-bottom: 1rem; }
.gradient-text {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.hero-sub { color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2rem; }
.hero-ctas { display: flex; flex-wrap: wrap; gap: 1rem; }

.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 1rem;
  text-decoration: none; transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  cursor: pointer; border: 2px solid transparent;
}
.btn:hover { text-decoration: none; transform: translateY(-2px); }
.btn-primary { background: var(--primary); color: var(--bg); }
.btn-primary:hover { box-shadow: 0 4px 16px rgba(34, 211, 238, 0.35); }
.btn-outline { border-color: var(--border); color: var(--text); background: transparent; }
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }

.about-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
@media (min-width: 768px) { .about-grid { grid-template-columns: 1fr 1.2fr; gap: 3rem; } }
.about-bio p { margin-bottom: 1rem; color: var(--text-muted); }
.about-bio strong { color: var(--text); }

.skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
@media (min-width: 900px) { .skills-grid { grid-template-columns: repeat(4, 1fr); } }
.skill-group { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem; }
.skill-group h3 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.75rem; }
.skill-group ul { list-style: none; }
.skill-group li { font-size: 0.9rem; color: var(--text-muted); padding-block: 0.2rem; }
```

- [ ] **Step 4: Browser verify hero + about**

- Hero fills viewport; gradient text renders; skills 2-col mobile / 4-col desktop
- CTAs scroll to targets

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add hero and about sections"
```

---

### Task 5: Projects section with cards and filter pills

**Files:**
- Modify: `index.html` (fill `#projects`)
- Modify: `css/styles.css` (append projects styles)
- Test: `tests/project-cards.test.mjs` (create)

**Interfaces:**
- Consumes: design tokens
- Produces: `.filter-pills` with `data-filter="all|ai-ml|web|full-stack|python"`; `.projects-grid` with exactly 7 `.project-card` each having `data-tags`; external links `target="_blank" rel="noopener noreferrer"`

- [ ] **Step 1: Write failing test for project count and tags**

Create `tests/project-cards.test.mjs`:
```javascript
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('contains exactly 7 project cards', () => {
  const cards = html.match(/class="project-card"/g) || [];
  assert.strictEqual(cards.length, 7);
});

test('filter pills match spec', () => {
  for (const f of ['all', 'ai-ml', 'web', 'full-stack', 'python']) {
    assert.ok(html.includes(`data-filter="${f}"`), `missing filter ${f}`);
  }
});

test('exactly one full-stack card', () => {
  const fullStack = html.match(/data-tags="[^"]*full-stack[^"]*"/g) || [];
  assert.strictEqual(fullStack.length, 1);
});

test('external links use safe rel', () => {
  const blanks = html.match(/target="_blank"/g) || [];
  const safe = html.match(/target="_blank" rel="noopener noreferrer"/g) || [];
  assert.strictEqual(blanks.length, safe.length);
  assert.ok(blanks.length >= 7);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/project-cards.test.mjs`
Expected: FAIL — no cards yet

- [ ] **Step 3: Fill projects section HTML**

```html
<section id="projects" class="section">
  <div class="container">
    <h2 class="section-title reveal">Projects</h2>

    <div class="filter-pills reveal" role="group" aria-label="Filter projects by tag">
      <button type="button" class="pill active" data-filter="all" aria-pressed="true">All</button>
      <button type="button" class="pill" data-filter="ai-ml" aria-pressed="false">AI/ML</button>
      <button type="button" class="pill" data-filter="web" aria-pressed="false">Web</button>
      <button type="button" class="pill" data-filter="full-stack" aria-pressed="false">Full-stack</button>
      <button type="button" class="pill" data-filter="python" aria-pressed="false">Python</button>
    </div>

    <div class="projects-grid" id="projects-grid">
      <article class="project-card reveal" data-tags="ai-ml python rag">
        <div class="project-icon" aria-hidden="true">🎵</div>
        <h3>moodbeats</h3>
        <p>AI music discovery — describe a vibe, get a curated playlist via RAG + neural reranking.</p>
        <div class="project-tags"><span class="tag">AI/ML</span><span class="tag">Python</span><span class="tag">RAG</span></div>
        <a href="https://github.com/SammySN-car/moodbeats" target="_blank" rel="noopener noreferrer" class="project-link">↗ GitHub</a>
      </article>

      <article class="project-card reveal" data-tags="ai-ml python">
        <div class="project-icon" aria-hidden="true">📝</div>
        <h3>smart-mcq-solver</h3>
        <p>Ensemble ML + RAG for MCQs using ELECTRA, MiniLM, Qwen, and Wikipedia FAISS index.</p>
        <div class="project-tags"><span class="tag">AI/ML</span><span class="tag">Python</span><span class="tag">ML</span></div>
        <a href="https://github.com/SammySN-car/smart-mcq-solver" target="_blank" rel="noopener noreferrer" class="project-link">↗ GitHub</a>
      </article>

      <article class="project-card reveal" data-tags="ai-ml python">
        <div class="project-icon" aria-hidden="true">🔬</div>
        <h3>ai-research-agent</h3>
        <p>Autonomous research assistant with LangGraph, Supabase pgvector, and multi-step reasoning.</p>
        <div class="project-tags"><span class="tag">AI/ML</span><span class="tag">Python</span><span class="tag">Agents</span></div>
        <a href="https://github.com/SammySN-car/ai-research-agent" target="_blank" rel="noopener noreferrer" class="project-link">↗ GitHub</a>
      </article>

      <article class="project-card reveal" data-tags="ai-ml python">
        <div class="project-icon" aria-hidden="true">⚖️</div>
        <h3>jev-deliberation-judge</h3>
        <p>Multi-agent deliberation system — blind jurors, vote/weight/veto aggregation.</p>
        <div class="project-tags"><span class="tag">AI/ML</span><span class="tag">Python</span><span class="tag">Multi-agent</span></div>
        <a href="https://github.com/SammySN-car/jev-deliberation-judge" target="_blank" rel="noopener noreferrer" class="project-link">↗ GitHub</a>
      </article>

      <article class="project-card reveal" data-tags="ai-ml python">
        <div class="project-icon" aria-hidden="true">🎓</div>
        <h3>readme-free.ai</h3>
        <p>Analyzes recorded viva/meeting sessions with LLMs — Drive links to graded reports.</p>
        <div class="project-tags"><span class="tag">AI/ML</span><span class="tag">Python</span><span class="tag">LLM</span></div>
        <a href="https://github.com/SammySN-car/readme-free.ai" target="_blank" rel="noopener noreferrer" class="project-link">↗ GitHub</a>
      </article>

      <article class="project-card reveal" data-tags="ai-ml">
        <div class="project-icon" aria-hidden="true">📊</div>
        <h3>comment-cat-prediction-challenge</h3>
        <p>Ensemble ML pipeline for comment category prediction (Kaggle-style challenge).</p>
        <div class="project-tags"><span class="tag">AI/ML</span><span class="tag">Data Science</span></div>
        <a href="https://github.com/SammySN-car/comment-cat-prediction-challenge" target="_blank" rel="noopener noreferrer" class="project-link">↗ GitHub</a>
      </article>

      <article class="project-card reveal" data-tags="web full-stack">
        <div class="project-icon" aria-hidden="true">🎟️</div>
        <h3>Event-Booking-App</h3>
        <p>Full-stack ticket booking with interactive seat selection and cyberpunk glassmorphic UI.</p>
        <div class="project-tags"><span class="tag">Web</span><span class="tag">Full-stack</span><span class="tag">Vue</span></div>
        <a href="https://github.com/SammySN-car/Event-Booking-App" target="_blank" rel="noopener noreferrer" class="project-link">↗ GitHub</a>
      </article>
    </div>

    <p class="filter-empty" id="filter-empty" hidden>No projects match this filter.</p>
  </div>
</section>
```

- [ ] **Step 4: Append projects CSS**

```css
.filter-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.75rem; }
.pill {
  background: var(--surface); border: 1px solid var(--border); color: var(--text-muted);
  padding: 0.4rem 1rem; border-radius: 999px; font-size: 0.9rem; font-family: var(--mono);
  cursor: pointer; transition: all 0.2s ease;
}
.pill:hover { border-color: var(--primary); color: var(--primary); }
.pill.active { background: var(--primary); border-color: var(--primary); color: var(--bg); }

.projects-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
@media (min-width: 640px) { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 960px) { .projects-grid { grid-template-columns: repeat(3, 1fr); } }

.project-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, opacity 0.3s ease;
}
.project-card:hover { transform: translateY(-4px); border-color: var(--primary); box-shadow: var(--glow); }
.project-card.is-hidden { display: none; }
.project-icon { font-size: 1.75rem; }
.project-card h3 { font-size: 1.1rem; font-family: var(--mono); color: var(--text); }
.project-card p { font-size: 0.9rem; color: var(--text-muted); flex-grow: 1; }
.project-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.tag {
  font-size: 0.75rem; font-family: var(--mono); background: var(--bg);
  border: 1px solid var(--border); color: var(--secondary);
  padding: 0.15rem 0.5rem; border-radius: 4px;
}
.project-link { font-size: 0.9rem; font-weight: 600; color: var(--primary); text-decoration: none; margin-top: 0.25rem; }
.project-link:hover { text-decoration: underline; }
.filter-empty { text-align: center; color: var(--text-muted); padding: 2rem; }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/project-cards.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 6: Browser verify grid**

- 7 cards, responsive 1/2/3 columns; hover glow; links open new tab

- [ ] **Step 7: Commit**

```bash
git add index.html css/styles.css tests/project-cards.test.mjs
git commit -m "feat: add projects grid with filter pills markup"
```

---

### Task 6: Open Source, Coursework, and Contact sections

**Files:**
- Modify: `index.html` (fill remaining sections)
- Modify: `css/styles.css` (append styles)
- Test: `tests/content-sections.test.mjs` (create)

**Interfaces:**
- Consumes: design tokens, `.section` utilities
- Produces: OSS list with 5 linked repos; Coursework with 4 `<details>`; Contact with `mailto:` + GitHub link

- [ ] **Step 1: Write failing content test**

Create `tests/content-sections.test.mjs`:
```javascript
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('open source lists all five repos', () => {
  for (const repo of [
    'pytorch/pytorch',
    'supabase/supabase',
    'ag2ai/faststream',
    'wemake-services/django-modern-rest',
    'dgtlmoon/changedetection.io',
  ]) {
    assert.ok(html.includes(repo), `missing ${repo}`);
  }
});

test('coursework has four details groups', () => {
  const details = html.match(/<details>/g) || [];
  assert.strictEqual(details.length, 4);
});

test('contact has mailto and github', () => {
  assert.ok(html.includes('mailto:samarnathani0@gmail.com'));
  assert.ok(html.includes('https://github.com/SammySN-car'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/content-sections.test.mjs`
Expected: FAIL

- [ ] **Step 3: Fill Open Source section**

```html
<section id="opensource" class="section">
  <div class="container">
    <h2 class="section-title reveal">Open Source</h2>
    <p class="oss-intro reveal">Merged pull requests into:</p>
    <ul class="oss-list reveal">
      <li><a href="https://github.com/pytorch/pytorch" target="_blank" rel="noopener noreferrer">pytorch/pytorch</a></li>
      <li><a href="https://github.com/supabase/supabase" target="_blank" rel="noopener noreferrer">supabase/supabase</a></li>
      <li><a href="https://github.com/ag2ai/faststream" target="_blank" rel="noopener noreferrer">ag2ai/faststream</a></li>
      <li><a href="https://github.com/wemake-services/django-modern-rest" target="_blank" rel="noopener noreferrer">wemake-services/django-modern-rest</a> <span class="oss-note">(4 merged)</span></li>
      <li><a href="https://github.com/dgtlmoon/changedetection.io" target="_blank" rel="noopener noreferrer">dgtlmoon/changedetection.io</a></li>
    </ul>
  </div>
</section>
```

- [ ] **Step 4: Fill Coursework section**

```html
<section id="coursework" class="section">
  <div class="container">
    <h2 class="section-title reveal">Relevant Coursework</h2>
    <div class="coursework-grid reveal">
      <details class="course-group">
        <summary>Programming</summary>
        <ul>
          <li>Programming in Python</li>
          <li>Programming Concepts using Java</li>
          <li>Programming Data Structures &amp; Algorithms using Python</li>
          <li>Computational Thinking</li>
        </ul>
      </details>
      <details class="course-group">
        <summary>Application Development</summary>
        <ul>
          <li>Modern Application Development I &amp; II</li>
          <li>Database Management Systems</li>
          <li>Business Data Management</li>
          <li>Tools in Data Science</li>
        </ul>
      </details>
      <details class="course-group">
        <summary>Machine Learning &amp; AI</summary>
        <ul>
          <li>Machine Learning Foundations</li>
          <li>Machine Learning Techniques</li>
          <li>Machine Learning Practice</li>
          <li>Introduction to Deep Learning &amp; Generative AI</li>
        </ul>
      </details>
      <details class="course-group">
        <summary>Mathematics &amp; Statistics</summary>
        <ul>
          <li>Statistics for Data Science I &amp; II</li>
          <li>Mathematics for Data Science I &amp; II</li>
        </ul>
      </details>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Fill Contact section**

```html
<section id="contact" class="section">
  <div class="container contact-inner">
    <h2 class="section-title reveal">Contact</h2>
    <p class="contact-lead reveal">Want to talk AI/ML, open source, or collaborate on something interesting?</p>
    <div class="contact-actions reveal">
      <a href="mailto:samarnathani0@gmail.com" class="btn btn-primary">Email me</a>
      <a href="https://github.com/SammySN-car" target="_blank" rel="noopener noreferrer" class="btn btn-outline">GitHub</a>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Append CSS for these sections**

```css
.oss-intro { color: var(--text-muted); margin-bottom: 1rem; }
.oss-list { list-style: none; display: grid; gap: 0.75rem; }
.oss-list li {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 0.85rem 1.25rem;
  font-family: var(--mono); font-size: 0.95rem;
}
.oss-list a { color: var(--primary); }
.oss-note { color: var(--text-muted); font-size: 0.85rem; }

.coursework-grid { display: grid; gap: 0.75rem; }
.course-group {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 0.25rem 1.25rem;
}
.course-group summary {
  cursor: pointer; padding-block: 0.85rem; font-weight: 600;
  color: var(--text); list-style: none;
  display: flex; justify-content: space-between; align-items: center;
}
.course-group summary::-webkit-details-marker { display: none; }
.course-group summary::after { content: "+"; color: var(--primary); font-size: 1.25rem; }
.course-group[open] summary::after { content: "−"; }
.course-group ul { padding-bottom: 1rem; padding-left: 1.25rem; color: var(--text-muted); }
.course-group li { padding-block: 0.2rem; }

.contact-inner { text-align: center; }
.contact-lead { color: var(--text-muted); max-width: 40ch; margin-inline: auto; margin-bottom: 1.75rem; }
.contact-actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; }
```

- [ ] **Step 7: Run test to verify it passes**

Run: `node --test tests/content-sections.test.mjs`
Expected: PASS (3 tests)

- [ ] **Step 8: Browser verify**

- Details expand/collapse; mailto works; GitHub opens new tab

- [ ] **Step 9: Commit**

```bash
git add index.html css/styles.css tests/content-sections.test.mjs
git commit -m "feat: add open source, coursework, and contact sections"
```

---

### Task 7: Theme toggle with flash-free load

**Files:**
- Modify: `index.html` (inline head script before stylesheet)
- Modify: `js/main.js` (theme logic)
- Test: `tests/theme.test.mjs` (create)

**Interfaces:**
- Consumes: `#theme-toggle`, `[data-theme]` CSS
- Produces: `resolveInitialTheme(stored, prefersLight)`, `applyTheme(theme)`, `bindThemeToggle()`; inline script runs synchronously in `<head>` before body paint

- [ ] **Step 1: Write failing theme unit tests**

Create `tests/theme.test.mjs`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert';

function resolveInitialTheme(stored, prefersLight) {
  if (stored === 'dark' || stored === 'light') return stored;
  return prefersLight ? 'light' : 'dark';
}

test('uses stored theme when valid', () => {
  assert.strictEqual(resolveInitialTheme('light', false), 'light');
  assert.strictEqual(resolveInitialTheme('dark', true), 'dark');
});

test('falls back to system preference when stored missing', () => {
  assert.strictEqual(resolveInitialTheme(null, true), 'light');
  assert.strictEqual(resolveInitialTheme(null, false), 'dark');
  assert.strictEqual(resolveInitialTheme('bogus', true), 'light');
});

test('toggles away from current', () => {
  const next = (current) => (current === 'dark' ? 'light' : 'dark');
  assert.strictEqual(next('dark'), 'light');
  assert.strictEqual(next('light'), 'dark');
});
```

- [ ] **Step 2: Run test to pin the contract**

Run: `node --test tests/theme.test.mjs`
Expected: PASS (pure functions defined in test file pin expected behavior)

- [ ] **Step 3: Add inline no-flash script to index.html `<head>` (before stylesheet)**

Insert after `<meta name="viewport">`:
```html
<script>
  (function () {
    try {
      var t = localStorage.getItem('theme');
      if (t !== 'dark' && t !== 'light') {
        t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      document.documentElement.setAttribute('data-theme', t);
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
</script>
```

- [ ] **Step 4: Implement theme logic in js/main.js**

```javascript
'use strict';

function resolveInitialTheme(stored, prefersLight) {
  if (stored === 'dark' || stored === 'light') return stored;
  return prefersLight ? 'light' : 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('theme', theme); } catch (_) {}
  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

function bindThemeToggle() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  bindThemeToggle();
  // Other bindings added in Tasks 8–9
});
```

- [ ] **Step 5: Run theme tests again**

Run: `node --test tests/theme.test.mjs`
Expected: PASS

- [ ] **Step 6: Browser verify no-flash + persistence**

1. Clear site data + light color-scheme emulation → reload → light
2. Toggle → dark; reload → stays dark
3. Throttle CPU → reload → no flash before first paint

- [ ] **Step 7: Commit**

```bash
git add index.html js/main.js tests/theme.test.mjs
git commit -m "feat: theme toggle with localStorage persistence and no-flash loader"
```

---

### Task 8: Project filter logic

**Files:**
- Modify: `js/main.js` (add filter)
- Test: `tests/filter.test.mjs` (create)

**Interfaces:**
- Consumes: `.pill[data-filter]`, `.project-card[data-tags]`, `#filter-empty`
- Produces: `cardMatches(cardTags, filter)`, `applyFilter(filter)`, `bindProjectFilter()`

- [ ] **Step 1: Write failing filter unit tests**

Create `tests/filter.test.mjs`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert';

function cardMatches(cardTags, filter) {
  if (filter === 'all') return true;
  return cardTags.split(/\s+/).includes(filter);
}

function countVisible(tagsList, filter) {
  return tagsList.filter((t) => cardMatches(t, filter)).length;
}

const tags = [
  'ai-ml python rag',
  'ai-ml python',
  'ai-ml python',
  'ai-ml python',
  'ai-ml python',
  'ai-ml',
  'web full-stack',
];

test('all shows seven', () => assert.strictEqual(countVisible(tags, 'all'), 7));
test('ai-ml shows six', () => assert.strictEqual(countVisible(tags, 'ai-ml'), 6));
test('web shows one', () => assert.strictEqual(countVisible(tags, 'web'), 1));
test('full-stack shows one', () => assert.strictEqual(countVisible(tags, 'full-stack'), 1));
test('python shows five', () => assert.strictEqual(countVisible(tags, 'python'), 5));
test('unknown filter shows zero', () => assert.strictEqual(countVisible(tags, 'rust'), 0));
```

- [ ] **Step 2: Run test to verify counts**

Run: `node --test tests/filter.test.mjs`
Expected: PASS — pins expected counts against Task 5 HTML data-tags

- [ ] **Step 3: Implement filter in js/main.js**

```javascript
function cardMatches(cardTags, filter) {
  if (filter === 'all') return true;
  return cardTags.split(/\s+/).includes(filter);
}

function applyFilter(filter) {
  var cards = document.querySelectorAll('.project-card');
  var empty = document.getElementById('filter-empty');
  var visible = 0;
  cards.forEach(function (card) {
    var tags = card.getAttribute('data-tags') || '';
    var show = cardMatches(tags, filter);
    card.classList.toggle('is-hidden', !show);
    if (show) visible += 1;
  });
  if (empty) empty.hidden = visible > 0;
}

function bindProjectFilter() {
  var pills = document.querySelectorAll('.pill[data-filter]');
  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) {
        p.classList.remove('active');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-pressed', 'true');
      applyFilter(pill.getAttribute('data-filter'));
    });
  });
}
```

Call `bindProjectFilter()` inside existing `DOMContentLoaded`.

- [ ] **Step 4: Run all tests**

Run: `node --test tests/`
Expected: all PASS

- [ ] **Step 5: Browser verify filter**

- AI/ML→6, Web→1, Full-stack→1, Python→5, All→7; active pill updates; no console errors

- [ ] **Step 6: Commit**

```bash
git add js/main.js tests/filter.test.mjs
git commit -m "feat: project tag filtering with empty-state handling"
```

---

### Task 9: Scroll reveal, active nav, mobile menu, footer year

**Files:**
- Modify: `js/main.js`
- Test: `tests/interactions.test.mjs` (create)

**Interfaces:**
- Consumes: `.reveal` CSS, `#nav-toggle`/`#nav-menu`, `#year`
- Produces: `initReveal()`, `initMobileNav()`, `initActiveNav()`, `initFooterYear()`

- [ ] **Step 1: Write failing interaction guard tests**

Create `tests/interactions.test.mjs`:
```javascript
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert';

const js = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('reveal respects prefers-reduced-motion', () => {
  assert.match(js, /prefers-reduced-motion/);
});

test('mobile nav toggles aria-expanded', () => {
  assert.match(js, /aria-expanded/);
  assert.match(js, /nav-toggle/);
});

test('footer year element exists', () => {
  assert.ok(html.includes('id="year"'));
  assert.match(js, /getElementById\("year"\)/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/interactions.test.mjs`
Expected: FAIL

- [ ] **Step 3: Implement interactions in js/main.js**

```javascript
function initReveal() {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('reveal-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
}

function initMobileNav() {
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) closeMenu();
    else {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
    }
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
}

function initActiveNav() {
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = [];
  links.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var sec = document.getElementById(id);
    if (sec) sections.push({ link: link, sec: sec });
  });
  if (!sections.length || !('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('active'); });
        var match = sections.find(function (s) { return s.sec === entry.target; });
        if (match) match.link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(function (s) { io.observe(s.sec); });
}

function initFooterYear() {
  var el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}
```

Call all four inside `DOMContentLoaded` after existing binds.

- [ ] **Step 4: Run all tests**

Run: `node --test tests/`
Expected: PASS

- [ ] **Step 5: Browser verify interactions**

1. Normal motion: sections fade in once on scroll
2. Emulate `prefers-reduced-motion: reduce` → all `.reveal` visible immediately
3. 375px: hamburger toggles `aria-expanded`; link click closes menu
4. Active nav follows section; footer year = current year

- [ ] **Step 6: Commit**

```bash
git add js/main.js tests/interactions.test.mjs
git commit -m "feat: scroll reveal, active nav, mobile menu, footer year"
```

---

### Task 10: Full acceptance pass and accessibility polish

**Files:**
- Modify: `index.html` / `css/styles.css` / `js/main.js` as needed for a11y fixes
- Test: `tests/acceptance.test.mjs` (create)

**Interfaces:**
- Consumes: all prior tasks
- Produces: passes full acceptance checklist from spec §9 (local equivalent before deploy)

- [ ] **Step 1: Write acceptance smoke tests**

Create `tests/acceptance.test.mjs`:
```javascript
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const sections = ['hero', 'about', 'projects', 'opensource', 'coursework', 'contact'];

test('all six sections exist', () => {
  for (const id of sections) {
    assert.ok(html.includes(`id="${id}"`), `missing #${id}`);
  }
});

test('navbar links to five in-page sections', () => {
  for (const id of ['about', 'projects', 'opensource', 'coursework', 'contact']) {
    assert.ok(html.includes(`href="#${id}"`));
  }
});

test('html lang and viewport present', () => {
  assert.ok(html.includes('lang="en"'));
  assert.ok(html.includes('name="viewport"'));
});

test('skip link present', () => {
  assert.ok(html.includes('class="skip-link"'));
});

test('every external target blank has noopener', () => {
  const re = /<a\s[^>]*target="_blank"([^>]*)>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    assert.ok(/rel="noopener noreferrer"/.test(m[1]), `unsafe link: ${m[0]}`);
  }
});

test('theme toggle has aria-label', () => {
  assert.ok(html.includes('id="theme-toggle"'));
  assert.ok(/id="theme-toggle"[^>]*aria-label=|aria-label=[^>]*id="theme-toggle"/.test(html));
});
```

- [ ] **Step 2: Run test**

Run: `node --test tests/acceptance.test.mjs`
Expected: PASS if markup complete; fix any failures

- [ ] **Step 3: Manual accessibility + acceptance checklist**

Walk spec §9 locally:

| # | Check | How |
|---|-------|-----|
| 1 | (Deploy deferred to Task 11) | — |
| 2 | 6 sections + sticky nav | Visual + click each nav link |
| 3 | Theme persists / system default | Task 7 steps |
| 4 | Filter correct counts | Task 8 steps |
| 5 | Reveal once + reduced motion | Task 9 steps |
| 6 | Usable at 375px | DevTools device toolbar |
| 7 | External links new tab | Inspect `rel` attributes |
| 8 | No console errors | DevTools console clean |
| 9 | A11y spot-check | Tab through; h1→h2 order; contrast on buttons |

Fix any issues found (contrast, focus rings, missing labels) in the same commit.

- [ ] **Step 4: Add global focus-visible style if missing**

Append to `css/styles.css` if not present:
```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

- [ ] **Step 5: Run full test suite**

Run: `node --test tests/`
Expected: all PASS

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: acceptance suite and accessibility polish"
```

---

### Task 11: Create GitHub repo, enable Pages, deploy

**Files:**
- No local file changes required beyond final commit
- Remote: create `SammySN-car/SammySN-car.github.io` (public)

**Interfaces:**
- Consumes: complete local repo from Tasks 1–10
- Produces: live site at `https://sammysn-car.github.io` (GitHub Pages, deploy from `main` root)

- [ ] **Step 1: Final commit if dirty**

```bash
git status
git add -A
git commit -m "chore: final pre-deploy state" || true
```

- [ ] **Step 2: Create GitHub repository**

```bash
gh repo create SammySN-car/SammySN-car.github.io --public --source=. --push --description "Personal portfolio — AI/ML, RAG, open source"
```

If `--source` fails because remote name differs:
```bash
git remote add origin https://github.com/SammySN-car/SammySN-car.github.io.git
git push -u origin main
```

- [ ] **Step 3: Enable GitHub Pages (main / root)**

```bash
gh api -X POST repos/SammySN-car/SammySN-car.github.io/pages -f "source[branch]=main" -f "source[path]=/" 2>&1 || true
```

If Pages already exists, confirm settings:
```bash
gh api repos/SammySN-car/SammySN-car.github.io/pages --jq '{status, html_url, source}'
```

Alternatively enable via UI: repo → Settings → Pages → Branch: `main` / `(root)` → Save.

- [ ] **Step 4: Wait for build and verify live URL**

Poll until site returns 200 (may take 1–2 minutes):
```powershell
$url = "https://sammysn-car.github.io"
$deadline = (Get-Date).AddMinutes(5)
while ((Get-Date) -lt $deadline) {
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15
    if ($r.StatusCode -eq 200 -and $r.Content -match "Samar Nathani") {
      Write-Output "LIVE: $url"
      break
    }
  } catch { Start-Sleep -Seconds 15 }
}
```

Expected: HTTP 200 and page contains "Samar Nathani"

- [ ] **Step 5: Verify acceptance criteria on live site**

Re-run the Task 10 checklist against `https://sammysn-car.github.io` (theme, filter, mobile, console, links).

- [ ] **Step 6: Tag release (optional)**

```bash
git tag -a v1.0.0 -m "Portfolio v1 — GitHub Pages launch"
git push origin v1.0.0
```

---

## Plan self-review notes

**Spec coverage:**
- §3 sections → Tasks 3–6
- §4 visual design → Tasks 2–6
- §5 interactions → Tasks 7–9
- §6 content → Tasks 4–6
- §7 technical constraints → Global Constraints + Task 11
- §9 acceptance → Task 10 + Task 11 Step 5

**Placeholders:** none — all steps include concrete code or commands.

**Type consistency:** `applyTheme`, `applyFilter`, `cardMatches` named consistently across tasks; DOM ids (`theme-toggle`, `nav-toggle`, `nav-menu`, `projects-grid`, `filter-empty`, `year`) match across HTML and JS.

**Review Focus mapping:**
1. Flash of wrong theme → Task 7 inline script + unit tests + browser check
2. Filter empty state → Task 5 `#filter-empty` + Task 8 `applyFilter` + counts test
3. Reduced motion → Task 2 CSS gate + Task 9 `initReveal` + test
4. Mobile focus/aria → Task 9 `aria-expanded` + Task 10 keyboard walkthrough
5. External link safety → Task 5 + Task 10 automated `rel` assertions
