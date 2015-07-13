chalk = require('chalk')
pluralize = require('pluralize')
CLIEngine = require('eslint').CLIEngine

module.exports = class ESLinter
  brunchPlugin: yes
  type: 'javascript'
  extension: 'js'

  lint: (data, path, callback) ->
    if path.indexOf("bower_components", 0) == 0
      callback()
      return

    linter = new CLIEngine({})
    result = linter.executeOnText(data, path).results[0]
    errorCount = result.errorCount

    if errorCount > 0
      console.warn("Linting of '#{result.filePath}' failed with #{errorCount} #{pluralize('error', errorCount)}.")

      result.messages.forEach((warn) ->
        console.warn("#{chalk.yellow warn.message} (#{warn.line}:#{warn.column})")
      )

    callback()
