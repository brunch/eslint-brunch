'use strict';

const colors = require('ansicolors');
const pluralize = require('pluralize');
const CLIEngine = require('eslint').CLIEngine;

class ESLinter {
  constructor(brunchConfig) {
    this.config = (brunchConfig && brunchConfig.plugins && brunchConfig.plugins.eslint) || {};
    this.warnOnly = (this.config.warnOnly === true);
    this.pattern = this.config.pattern || /^app[\/\\].*\.js?$/;
    this.engineOptions = this.config.config || {};
    this.linter = new CLIEngine(this.engineOptions);
  }

  lint(data, path) {
    const result = this.linter.executeOnText(data, path).results[0];
    const errorCount = result.errorCount;
    const warningCount = result.warningCount;
    if (errorCount === 0 && warningCount === 0) {
      return Promise.resolve();
    }
    const errorMsg = result.messages.map(error => {
      return `${colors.blue(error.message)} (${error.line}:${error.column})`;
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
