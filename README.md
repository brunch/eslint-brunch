# eslint-brunch
Adds [ESLint](http://eslint.org) support to [brunch](http://brunch.io).

## Usage
Install the plugin via npm with `npm install --save eslint-brunch`.

Configuration settings can be set in any acceptable `.eslintrc.*` [configration file formats](http://eslint.org/docs/user-guide/configuring#configuration-file-formats). If no configuration file can be found, this plugin will fallback to default ESLint options.

## Options

```coffeescript
config =
  plugins:
    eslint:
      pattern: /^app\/.*\.js?$/
      warnOnly: yes
```

Every sub-option (`pattern`, `warnOnly`) is optional.

## License

Licensed under the [MIT license](https://github.com/spyl94/eslint-brunch/blob/master/LICENSE).
