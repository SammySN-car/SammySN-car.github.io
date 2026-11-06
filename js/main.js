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
  var el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initLucide() {
  if (typeof window !== 'undefined' && window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  bindThemeToggle();
  bindProjectFilter();
  initReveal();
  initMobileNav();
  initActiveNav();
  initFooterYear();
  initLucide();
});
