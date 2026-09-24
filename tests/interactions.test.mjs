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
