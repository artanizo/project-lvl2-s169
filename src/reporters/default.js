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

const getReport = (ast) => {
  const nodeToStringMap = {
    unchanged: node => getNodeString(node.key, node.currentValue, '  ', node.level),
    added: node => getNodeString(node.key, node.currentValue, '+ ', node.level),
    deleted: node => getNodeString(node.key, node.prevValue, '- ', node.level),
    changed: (node) => {
      const before = getNodeString(node.key, node.prevValue, '- ', node.level);
      const after = getNodeString(node.key, node.currentValue, '+ ', node.level);
      return [before, after];
    },
    complex: (node) => {
      const indent = ' '.repeat(node.level * 2);
      return [`${indent}  ${node.key}: {${newLine}${getReport(node.children)}${newLine}  ${indent}}`];
    },
  };

  const reportArr = ast.map((node) => {
    const toString = nodeToStringMap[node.type];
    return toString(node);
  });

  return _.flatten(reportArr).join(newLine);
};

export default ast => ['{', getReport(ast), '}'].join(newLine);

