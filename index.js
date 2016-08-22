'use strict';

const colors = require('ansicolors');
const fs = require('fs');
const pluralize = require('pluralize');
const CLIEngine = require('eslint').CLIEngine;

const configFilePrefix = '.eslintrc';

class ESLinter {
  constructor(brunchConfig) {
    this.config = brunchConfig || {};
    const config = brunchConfig.plugins && brunchConfig.plugins.eslint || {};
    this.warnOnly = config.warnOnly != null ? config.warnOnly : true;
    this.pattern = config.pattern || /^app[\/\\].*\.js?$/;

    var useConfig;
    try {
      useConfig = fs.readdirSync(process.cwd())
        .filter((filename) => filename.startsWith(configFilePrefix))
        .filter((configFile) => {
          try {
            return fs.statSync(configFile).isFile();
          } catch (_error) {
            const e = _error.toString().replace('Error: ENOENT, ', '');
            console.warn(`${configFile} read error: ${e}`);
            return false;
          }
        })
        .length > 0;
    } catch (_error) {
      useConfig = false;
    }

    if (useConfig === false) {
      console.warn(`no usable .eslintrc.* file can be found.\nESLint will run with default options.`);
    }
    const engineConfig = { useEslintrc: useConfig };

    this.linter = new CLIEngine(engineConfig);
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
