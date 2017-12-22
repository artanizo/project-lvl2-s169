import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';
import astToString from './rept/report';

const parseMap = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.yaml': yaml.safeLoad,
  '.ini': ini.parse,
};

const valuesActionMap = [
  {
    check: (firstVal, secondVal) => firstVal === secondVal,
    type: 'unchanged',
  },
  {
    check: firstVal => !firstVal,
    type: 'added',
  },
  {
    check: (firstVal, secondVal) => !secondVal,
    type: 'deleted',
  },
  {
    check: (firstVal, secondVal) => firstVal && secondVal &&
      _.isObject(firstVal) && _.isObject(secondVal),
    type: 'complex',
  },
  {
    check: (firstVal, secondVal) => firstVal && secondVal && firstVal !== secondVal,
    type: 'changed',
  },
];

const parse = (fileExtension, fileData) => parseMap[fileExtension](fileData);

const getType = (firstVal, secondVal) =>
  _.find(valuesActionMap, ({ check }) => check(firstVal, secondVal));

const buildAst = (obj1 = {}, obj2 = {}, level = 1, parents = []) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));

  return keys.reduce((acc, key) => {
    const prevValue = obj1[key];
    const currentValue = obj2[key];

    const { type } = getType(prevValue, currentValue);
    const children = type === 'complex' ? buildAst(prevValue, currentValue, level + 1, [...parents, key]) : [];
    return [...acc, {
      key,
      type,
      level,
      prevValue,
      currentValue,
      children,
      parents,
    }];
  }, []);
};

export default (firstFile, secondFile, format = 'default') => {
  const firstFileData = parse(path.extname(firstFile), fs.readFileSync(firstFile, 'utf-8'));
  const secondFileData = parse(path.extname(secondFile), fs.readFileSync(secondFile, 'utf-8'));

  const ast = buildAst(firstFileData, secondFileData);
  return astToString(ast, format);
};
