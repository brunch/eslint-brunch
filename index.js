'use strict';

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const pluralize = require('pluralize');
const CLIEngine = require('eslint').CLIEngine;

class ESLinter {
  constructor(config1) {
    this.config = config1 || {};
    const config = this.config.plugins && this.config.plugins.eslint || {};
    this.warnOnly = this.config.warnOnly != null ? config.warnOnly : true;
    const configFile = path.join(process.cwd(), '.eslintrc');
    this.pattern = this.config.pattern || /^app\/.*\.js?$/;
    try {
      const stats = fs.statSync(configFile);
      if (stats.isFile()) {
        this.linter = new CLIEngine();
        this.linter.getConfigForFile(configFile);
      }
    } catch (_error) {
      const e = _error.toString().replace('Error: ENOENT, ', '');
      console.warn(`.eslintrc parsing error: ${e} \nESLint will run with default options.`);
      this.linter = new CLIEngine({useEslintrc: false});
    }
  }

  lint(data, path) {
    const result = this.linter.executeOnText(data, path).results[0];
    const errorCount = result.errorCount;
    if (errorCount === 0) {
      return Promise.resolve();
    }
    const errorMsg = result.messages.map(error => {
      return `${chalk.bold(error.message)} (${error.line}:${error.column})`;
    });
    errorMsg.unshift(`ESLint detected ${errorCount} ${(pluralize('problem', errorCount))}:`);
    let msg = errorMsg.join('\n');
    if (this.warnOnly) {
      msg = `warn: ${msg}`;
    }
    return (msg ? Promise.reject(msg) : Promise.resolve());
  }
}

ESLinter.prototype.brunchPlugin = true;
ESLinter.prototype.type = 'javascript';
ESLinter.prototype.extension = 'js';

module.exports = ESLinter;
