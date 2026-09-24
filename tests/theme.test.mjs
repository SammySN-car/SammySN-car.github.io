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
