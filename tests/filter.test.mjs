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
  'ai-ml python rag',
  'ai-ml python',
  'ai-ml python',
  'ai-ml python',
  'ai-ml python',
  'ai-ml',
  'web full-stack',
];

test('all shows seven', () => assert.strictEqual(countVisible(tags, 'all'), 7));
test('ai-ml shows six', () => assert.strictEqual(countVisible(tags, 'ai-ml'), 6));
test('web shows one', () => assert.strictEqual(countVisible(tags, 'web'), 1));
test('full-stack shows one', () => assert.strictEqual(countVisible(tags, 'full-stack'), 1));
test('python shows five', () => assert.strictEqual(countVisible(tags, 'python'), 5));
test('unknown filter shows zero', () => assert.strictEqual(countVisible(tags, 'rust'), 0));
