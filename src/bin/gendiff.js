#!/usr/bin/env node

import util from 'commander';
import gendiff from '..';

util.version('0.5.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format', 'json')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig, option) =>
    console.log(gendiff(firstConfig, secondConfig, option.format)))
  .parse(process.argv);

if (!util.args.length) util.help();
