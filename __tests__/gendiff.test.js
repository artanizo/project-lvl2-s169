import gendiff from '../src';

const flatExpected =
`{
    host: hexlet.io
  - timeout: 50
  + timeout: 20
  - proxy: 123.234.53.22
  + verbose: true
}`;

const treeExpected =
`{
    common: {
      setting1: Value 1
    - setting2: 200
      setting3: true
    - setting6: {
          key: value
      }
    + setting4: blah blah
    + setting5: {
          key5: value5
      }
    }
    group1: {
    - baz: bas
    + baz: bars
      foo: bar
    }
  - group2: {
      abc: 12345
    }
  + group3: {
      fee: 100500
    }
}`;

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

test('json tree_shoul match', () => {
  const diff = gendiff('__tests__/__fixtures__/before_tree.json', '__tests__/__fixtures__/after_tree.json');
  expect(diff).toBe(treeExpected);
});

test('ini tree_shoul match', () => {
  const diff = gendiff('__tests__/__fixtures__/before_tree.ini', '__tests__/__fixtures__/after_tree.ini');
  expect(diff).toBe(treeExpected);
});

test('yml tree_shoul match', () => {
  const diff = gendiff('__tests__/__fixtures__/before_tree.yml', '__tests__/__fixtures__/after_tree.yml');
  expect(diff).toBe(treeExpected);
});

const plainFormatExpected = `Property 'common.setting2' was removed
Property 'common.setting6' was removed
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with complex value
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group2' was removed
Property 'group3' was added with complex value`;

test('plain format', () => {
  const diff = gendiff('__tests__/__fixtures__/before_tree.json', '__tests__/__fixtures__/after_tree.json', 'plain');
  expect(diff).toBe(plainFormatExpected);
});

const jsonFormatExpected = [
  {
    key: 'host',
    type: 'unchanged',
    level: 1,
    prevValue: 'hexlet.io',
    currentValue: 'hexlet.io',
    children: [],
    parents: [],
  },
  {
    key: 'timeout',
    type: 'changed',
    level: 1,
    prevValue: 50,
    currentValue: 20,
    children: [],
    parents: [],
  },
  {
    key: 'proxy',
    type: 'deleted',
    level: 1,
    prevValue: '123.234.53.22',
    children: [],
    parents: [],
  },
  {
    key: 'verbose',
    type: 'added',
    level: 1,
    currentValue: true,
    children: [],
    parents: [],
  },
];

test('json format', () => {
  const diff = gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json', 'json');
  expect(JSON.parse(diff)).toMatchObject(jsonFormatExpected);
});
