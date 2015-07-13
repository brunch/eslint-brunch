chalk     = require('chalk')
path      = require('path')
fs        = require('fs')
pluralize = require('pluralize')
CLIEngine = require('eslint').CLIEngine

module.exports = class ESLinter
  brunchPlugin: yes
  type: 'javascript'
  extension: 'js'

  constructor: (@config) ->
    config = @config?.plugins?.eslint or {}
    @warnOnly = config?.warnOnly ? yes
    configFile = path.join process.cwd(), ".eslintrc"
    @pattern = config?.pattern or /^app\/.*\.js?$/

    try # read settings from .eslintrc file if exists
      stats = fs.statSync(configFile)
      if stats.isFile()
        @linter = new CLIEngine()
        @linter.getConfigForFile(configFile)
    catch e
      e = e.toString().replace "Error: ENOENT, ", ""
      console.warn ".eslintrc parsing error: #{e} \nESLint will run with default options."
      @linter = new CLIEngine({useEslintrc: false})

  lint: (data, path, callback) ->
    result = @linter.executeOnText(data, path).results[0]
    errorCount = result.errorCount

    if errorCount is 0
      callback()
      return

    errorMsg = for error in result.messages
      do (error) =>
        """
        #{chalk.bold error.message} (#{error.line}:#{error.column})
        """

    errorMsg.unshift "ESLint detected #{errorCount} #{pluralize('problem', errorCount)}:"

    msg = errorMsg.join '\n'
    msg = "warn: #{msg}" if @warnOnly
    callback msg
