import gendiff from '../src';

const flatExpected = '{\n' +
'    host: hexlet.io\n' +
'  - timeout: 50\n' +
'  + timeout: 20\n' +
'  - proxy: 123.234.53.22\n' +
'  + verbose: true\n' +
'}';

test('json flat_should match', () => {
  const diff = gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json');
  expect(diff).toBe(flatExpected);
});

test('yaml flat_should match', () => {
  const diff = gendiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml');
  expect(diff).toBe(flatExpected);
});

test('ini flat_shoul match', () => {
  const diff = gendiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.ini');
  expect(diff).toBe(flatExpected);
});
