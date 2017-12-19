import fs from 'fs';
import _ from 'lodash';

export default (firstFile, secondFile) => {
  const firstFileData = JSON.parse(fs.readFileSync(firstFile));
  const secondFileData = JSON.parse(fs.readFileSync(secondFile));

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
