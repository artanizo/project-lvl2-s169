import _ from 'lodash';

const newLine = '\n';

const diffSign = {
  unchanged: '  ',
  added: '+ ',
  deleted: '- ',
  complex: '  ',
  changed: ['- ', '+ '],
};

const valueToString = level => (val) => {
  const getString = (value) => {
    if (!_.isObject(value)) {
      return value;
    }

    const indent = ' '.repeat(level * 2);
    const keyIndent = ' '.repeat(level * 4);
    const sign = diffSign.unchanged;

    const string = Object.keys(value)
      .reduce((acc, key) => `${acc}${newLine}${keyIndent}${sign}${key}: ${getString(value[key])}`, '');
    return `{${string}${newLine}${indent}${sign}}`;
  };

  return getString(val);
};

const astToString = (ast) => {
  const string = ast.reduce((acc, node) => {
    const indent = ' '.repeat(node.level * 2);
    const sign = diffSign[node.type];
    const valueToStringMethod = valueToString(node.level);

    if (node.type === 'unchanged') {
      return `${acc}${newLine}${indent}${sign}${node.key}: ${valueToStringMethod(node.currentValue)}`;
    }
    if (node.type === 'added') {
      return `${acc}${newLine}${indent}${sign}${node.key}: ${valueToStringMethod(node.currentValue)}`;
    }
    if (node.type === 'deleted') {
      return `${acc}${newLine}${indent}${sign}${node.key}: ${valueToStringMethod(node.prevValue)}`;
    }
    if (node.type === 'changed') {
      return `${acc}${newLine}${indent}${sign[0]}${node.key}: ${valueToStringMethod(node.prevValue)}` +
      `${newLine}${indent}${sign[1]}${node.key}: ${valueToStringMethod(node.currentValue)}`;
    }

    return `${acc}${newLine}${indent}${sign}${node.key}: ` +
      `{${astToString(node.children)}${newLine}${sign}${indent}}`;
  }, '');
  return string;
};

export default astToString;
