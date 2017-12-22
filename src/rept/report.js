import getJsonRept from './json';
import getPlainRept from './plain';

const formatMap = {
  json: getJsonRept,
  plain: getPlainRept,
};

export default (ast, format) => formatMap[format](ast);
