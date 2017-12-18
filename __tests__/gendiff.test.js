import gendiff from '../src';

test('should work', () => {
  const expected = {
    '  host': 'hexlet.io',
    '+ timeout': 20,
    '- timeout': 50,
    '- proxy': '123.234.53.22',
    '+ verbose': true,
  };

  const diff = gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json');

  expect(diff).toMatchObject(expected);
});
