import _ from 'lodash';

const newLine = '\n';

const getNodeValueString = (value, withPrefix = false) => {
  const outValue = withPrefix ? `value: '${value}'` : value;
  return (!_.isObject(value) ? outValue : 'complex value');
};

const getFullKey = node => [...node.parents, node.key].join('.');

const getReport = (ast) => {
  const nodeToStringMap = {
    added: node => `Property '${getFullKey(node)}' was added with ${getNodeValueString(node.currentValue, true)}`,
    deleted: node => `Property '${getFullKey(node)}' was removed`,
    changed: node => `Property '${getFullKey(node)}' was updated. From '${getNodeValueString(node.prevValue)}' to '${getNodeValueString(node.currentValue)}'`,
    unchanged: () => '',
    complex: node => getReport(node.children),
  };

  const reportArr = ast.reduce((acc, node) => {
    const toString = nodeToStringMap[node.type];
    return [...acc, toString(node)];
  }, []);

  return _.compact(reportArr).join(newLine);
};

export default getReport;
