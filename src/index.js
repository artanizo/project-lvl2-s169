import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const parseMap = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.yaml': yaml.safeLoad,
  '.ini': ini.parse,
};

const valuesActionMap = [
  {
    check: (firstVal, secondVal) => firstVal === secondVal,
    toString: (key, firstVal) => `    ${key}: ${firstVal}`,
  },
  {
    check: firstVal => !firstVal,
    toString: (key, firstVal, secondVal) => `  + ${key}: ${secondVal}`,
  },
  {
    check: (firstVal, secondVal) => !secondVal,
    toString: (key, firstVal) => `  - ${key}: ${firstVal}`,
  },
  {
    check: (firstVal, secondVal) => firstVal && secondVal && firstVal !== secondVal,
    toString: (key, firstVal, secondVal) => `  - ${key}: ${firstVal}\n  + ${key}: ${secondVal}`,
  },
];

const parse = (fileExtension, fileData) => parseMap[fileExtension](fileData);

const getToStringMethod = (firstVal, secondVal) =>
  _.find(valuesActionMap, ({ check }) => check(firstVal, secondVal));

export default (firstFile, secondFile) => {
  const firstFileData = parse(path.extname(firstFile), fs.readFileSync(firstFile, 'utf-8'));
  const secondFileData = parse(path.extname(secondFile), fs.readFileSync(secondFile, 'utf-8'));

  const keys = _.union(Object.keys(firstFileData), Object.keys(secondFileData));

  const diff = keys.reduce((acc, key) => {
    const firstFileValue = firstFileData[key];
    const secondFileValue = secondFileData[key];

    const { toString } = getToStringMethod(firstFileValue, secondFileValue);
    return `${acc}\n${toString(key, firstFileValue, secondFileValue)}`;
  }, '');

  return `{${diff}\n}`;
};
