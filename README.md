# eslint-brunch
Adds [ESLint](http://eslint.org) support to [brunch](http://brunch.io).

## Usage
Install the plugin via npm with `npm install --save eslint-brunch`.

Configuration settings should be set in your `.eslintrc` file.

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
