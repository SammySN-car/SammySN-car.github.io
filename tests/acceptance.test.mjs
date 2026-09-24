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
