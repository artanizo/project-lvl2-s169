import getDefaultRept from './default';
import getPlainRept from './plain';
import getJsonRept from './json';

const formatMap = {
  default: getDefaultRept,
  plain: getPlainRept,
  json: getJsonRept,
};

export default (ast, format) => formatMap[format](ast);
