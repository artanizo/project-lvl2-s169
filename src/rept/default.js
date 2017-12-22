import _ from 'lodash';

const newLine = '\n';

const getNodeValueString = (level, val) => {
  const getString = (value) => {
    if (!_.isObject(value)) {
      return value;
    }

    const indent = ' '.repeat(level * 2);
    const keyIndent = ' '.repeat(level * 4);

    const string = Object.keys(value)
      .map(key => `${keyIndent}  ${key}: ${getString(value[key])}`)
      .join(newLine);

    return ['{', string, `${indent}  }`].join(newLine);
  };

  return getString(val);
};

const getNodeString = (key, value, sign, level) => {
  const indent = ' '.repeat(level * 2);
  return [`${indent}${sign}${key}: ${getNodeValueString(level, value)}`];
};

const getRept = (ast) => {
  const reptArr = ast.map((node) => {
    switch (node.type) {
      case 'unchanged':
        return getNodeString(node.key, node.currentValue, '  ', node.level);
      case 'added':
        return getNodeString(node.key, node.currentValue, '+ ', node.level);
      case 'deleted':
        return getNodeString(node.key, node.prevValue, '- ', node.level);
      case 'changed': {
        const before = getNodeString(node.key, node.prevValue, '- ', node.level);
        const after = getNodeString(node.key, node.currentValue, '+ ', node.level);
        return [before, after];
      }
      case 'complex': {
        const indent = ' '.repeat(node.level * 2);
        return [`${indent}  ${node.key}: {${newLine}${getRept(node.children)}${newLine}  ${indent}}`];
      }
      default:
        return '';
    }
  });
  return _.flatten(reptArr).join(newLine);
};

export default ast => `{${newLine}${getRept(ast)}${newLine}}`;
