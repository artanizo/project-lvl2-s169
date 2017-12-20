import gendiff from '../src';

const flatExpected = JSON.stringify({
  '  host': 'hexlet.io',
  '- timeout': 50,
  '+ timeout': 20,
  '- proxy': '123.234.53.22',
  '+ verbose': true,
}, null, 4);

test('json files difference_should match', () => {
  const diff = gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json');

  expect(diff).toBe(flatExpected);
});

test('yaml files difference_should match', () => {
  const diff = gendiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml');
  expect(diff).toBe(flatExpected);
});
