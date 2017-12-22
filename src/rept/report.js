import getDefaultRept from './default';
import getPlainRept from './plain';

const formatMap = {
  default: getDefaultRept,
  plain: getPlainRept,
};

export default (ast, format) => formatMap[format](ast);
