#!/usr/bin/env node

import util from 'commander';
import gendiff from '..';

util.version('0.1.2')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((first, second) => gendiff(first, second))
  .parse(process.argv);

