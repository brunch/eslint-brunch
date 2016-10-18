'use strict';

const CLIEngine = require('eslint').CLIEngine;

class ESLinter {
  constructor(brunchConfig) {
    this.config = (brunchConfig && brunchConfig.plugins && brunchConfig.plugins.eslint) || {};
    this.warnOnly = (typeof this.config.warnOnly === 'boolean') ? this.config.warnOnly : true;
    this.pattern = this.config.pattern || /^app[\/\\].*\.js?$/;
    this.engineOptions = this.config.config || {};
    this.linter = new CLIEngine(this.engineOptions);
  }

  lint(data, path) {
    const report = this.linter.executeOnText(data, path);
    if (report.errorCount === 0 && report.warningCount === 0) {
      return Promise.resolve();
    }
    const formatter = CLIEngine.getFormatter();
    let msg = 'ESLint reported:\n' + formatter(report.results);
    if (this.warnOnly) {
      msg = `warn: ${msg}`;
    }
    return Promise.reject(msg);
  }
}

ESLinter.prototype.brunchPlugin = true;
ESLinter.prototype.type = 'javascript';
ESLinter.prototype.extension = 'js';

module.exports = ESLinter;
