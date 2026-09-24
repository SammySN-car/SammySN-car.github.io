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

document.addEventListener('DOMContentLoaded', function () {
  bindThemeToggle();
  bindProjectFilter();
});
