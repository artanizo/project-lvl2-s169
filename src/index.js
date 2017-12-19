import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';

const parseMap = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.yaml': yaml.safeLoad,
}

const parse = (fileExtension, fileData) => parseMap[fileExtension](fileData);

export default (firstFile, secondFile) => {
  const firstFileData = parse(path.extname(firstFile), fs.readFileSync(firstFile));
  const secondFileData = parse(path.extname(secondFile), fs.readFileSync(secondFile));

  const keys = _.union(Object.keys(firstFileData), Object.keys(secondFileData));

  const diff = keys.reduce((acc, key) => {
    const firstFileValue = firstFileData[key];
    const secondFileValue = secondFileData[key];

    if (firstFileValue === secondFileValue) {
      return { ...acc, [`  ${key}`]: firstFileValue };
    }
    if (!firstFileValue) {
      return { ...acc, [`+ ${key}`]: secondFileValue };
    }
    if (!secondFileValue) {
      return { ...acc, [`- ${key}`]: firstFileValue };
    }

    const keyDiff = {};
    keyDiff[`- ${key}`] = firstFileValue;
    keyDiff[`+ ${key}`] = secondFileValue;

    return { ...acc, ...keyDiff };
  }, {});

  return diff;
};
