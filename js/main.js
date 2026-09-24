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
