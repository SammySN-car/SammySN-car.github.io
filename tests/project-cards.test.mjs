import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('contains exactly 7 project cards', () => {
  const cards = html.match(/class="project-card[^"]*"/g) || [];
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
