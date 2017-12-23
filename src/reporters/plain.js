import _ from 'lodash';

const newLine = '\n';

const getNodeValueString = (value, withPrefix = false) => {
  const outValue = withPrefix ? `value: '${value}'` : value;
  return (!_.isObject(value) ? outValue : 'complex value');
};

const getRept = (ast) => {
  const reptArr = ast.reduce((acc, node) => {
    const fullKey = [...node.parents, node.key].join('.');
    switch (node.type) {
      case 'added':
        return [...acc, `Property '${fullKey}' was added with ${getNodeValueString(node.currentValue, true)}`];
      case 'deleted':
        return [...acc, `Property '${fullKey}' was removed`];
      case 'changed':
        return [...acc, `Property '${fullKey}' was updated. From '${getNodeValueString(node.prevValue)}' to '${getNodeValueString(node.currentValue)}'`];
      case 'complex':
        return [...acc, getRept(node.children)];
      default:
        return acc;
    }
  }, []);
  return _.flatten(reptArr).join(newLine);
};

export default getRept;
