import _ from 'lodash';

const newLine = '\n';

const getNodeValueString = value => (!_.isObject(value) ? value : 'complex value');

const getRept = (ast) => {
  const reptArr = ast.reduce((acc, node) => {
    const fullKey = [...node.parents, node.key].join('.');
    switch (node.type) {
      case 'added': {
        const newValue = !_.isObject(node.currentValue) ? `value: '${node.currentValue}'` : 'complex value';
        return [...acc, `Property '${fullKey}' was added with ${newValue}`];
      }
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
