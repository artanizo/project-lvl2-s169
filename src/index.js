import fs from 'fs';

export default (first, second) => {
  const fData = JSON.parse(fs.readFileSync(first));
  const sData = JSON.parse(fs.readFileSync(second));

  const commonKeys = Object.keys({ ...fData, ...sData });

  const diff = commonKeys.reduce((acc, key) => {
    const before = fData[key];
    const after = sData[key];

    if (before === after) acc[`  ${key}`] = before;
    if (!before || before !== after) acc[`+ ${key}`] = after;
    if (!after || before !== after) acc[`- ${key}`] = before;
    return acc;
  }, {});

  return diff;
};
