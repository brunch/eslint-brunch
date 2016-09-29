'use strict';

const colors = require('ansicolors');
const pluralize = require('pluralize');
const CLIEngine = require('eslint').CLIEngine;

var padString = function(input, minLength, right) {
  var paddingLength = Math.max(0, minLength - input.length);
  var padding = ' '.repeat(paddingLength);
  return (right ? (padding + input) : (input + padding));
};

var formatSeverity = function(severity) {
  if (severity === 1) {
    return colors.yellow('warning');
  }
  if (severity === 2) {
    return colors.red('error');
  }
  return '';
};

var formatErrors = function(errors) {
  var maxLengths = { line: 6, column: 3, severity: 0, message: 0 };
  errors.forEach((error) => {
    maxLengths.severity = Math.max(maxLengths.severity, formatSeverity(error.severity).length);
    maxLengths.message = Math.max(maxLengths.message, error.message.length);
  });
  var formattedLines = errors.map((error) =>
    colors.cyan(
        padString(String(error.line), maxLengths.line, true) + ':' +
        padString(String(error.column), maxLengths.column)
    ) +
    '  ' + padString(formatSeverity(error.severity), maxLengths.severity) +
    '  ' + padString(error.message, maxLengths.message) +
    '  ' + colors.blue(error.ruleId)
  );
  return formattedLines.join('\n');
};

class ESLinter {
  constructor(brunchConfig) {
    this.config = (brunchConfig && brunchConfig.plugins && brunchConfig.plugins.eslint) || {};
    this.warnOnly = (typeof this.config.warnOnly === 'boolean') ? this.config.warnOnly : true;
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
    const problemSummary = [];
    if (errorCount > 0) {
      problemSummary.push(errorCount + ' ' + pluralize('error', errorCount));
    }
    if (warningCount > 0) {
      problemSummary.push(warningCount + ' ' + pluralize('warning', warningCount));
    }
    let msg = 'ESLint detected ' + problemSummary.join(' and ') + ':\n' + formatErrors(result.messages);
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
