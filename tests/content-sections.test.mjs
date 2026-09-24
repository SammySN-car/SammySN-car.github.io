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
  const details = html.match(/<details[\s>]/g) || [];
  assert.strictEqual(details.length, 4);
});

test('contact has mailto and github', () => {
  assert.ok(html.includes('mailto:samarnathani0@gmail.com'));
  assert.ok(html.includes('https://github.com/SammySN-car'));
});
