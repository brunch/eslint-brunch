'use strict';
const {CLIEngine} = require('eslint');

class ESLinter {
  constructor(brunchCfg) {
    const params = brunchCfg.plugins.eslint || {};
    this.pattern = params.pattern || /^app\/.*\.jsx?$/;

    this.engine = new CLIEngine(params.config);
    this.formatter = CLIEngine.getFormatter(params.formatter);
    this.warnOnly = typeof params.warnOnly === 'boolean' ? params.warnOnly : true;
  }

  lint(file) {
    const report = this.engine.executeOnText(file.data, file.path);
    if (!report.errorCount && !report.warningCount) return;

    const msg = `ESLint reported:\n${this.formatter(report.results)}`;
    if (this.warnOnly) throw `warn: ${msg}`;
    throw msg;
  }
}

ESLinter.prototype.brunchPlugin = true;
ESLinter.prototype.type = 'javascript';

module.exports = ESLinter;
