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
  assert.match(css, /--primary:\s*#0e7490/);
});

test('gates scroll-behavior behind no-preference', () => {
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\)[\s\S]*scroll-behavior:\s*smooth/);
});
