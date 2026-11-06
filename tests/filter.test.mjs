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
  'ai-ml python mcp',
  'ai-ml python',
  'ai-ml python rag',
  'ai-ml python',
  'ai-ml python',
  'ai-ml python web full-stack rag',
  'ai-ml python agents',
];

test('all shows seven', () => assert.strictEqual(countVisible(tags, 'all'), 7));
test('ai-ml shows seven', () => assert.strictEqual(countVisible(tags, 'ai-ml'), 7));
test('web shows one', () => assert.strictEqual(countVisible(tags, 'web'), 1));
test('full-stack shows one', () => assert.strictEqual(countVisible(tags, 'full-stack'), 1));
test('python shows seven', () => assert.strictEqual(countVisible(tags, 'python'), 7));
test('unknown filter shows zero', () => assert.strictEqual(countVisible(tags, 'rust'), 0));
