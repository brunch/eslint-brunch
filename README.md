# eslint-brunch
Adds [ESLint](http://eslint.org) support to [brunch](http://brunch.io).

## Usage
Install the plugin via npm with `npm install --save eslint-brunch`.

Configuration settings can be set in any acceptable `.eslintrc.*` [configuration file formats](http://eslint.org/docs/user-guide/configuring#configuration-file-formats). If no configuration file can be found, this plugin will fallback to default ESLint options.

## Options

```javascript
config = {
  plugins: {
    eslint: {
      pattern: /^app\/.*\.js?$/,
      warnOnly: true,
      config: {rules: {'array-callback-return': 'warn'}}
    }
  }
}
```

| Option     | Type    | Optional? | Default | Description                                                                                                 |
|------------|---------|:---------:|--------:|---------------------------------------------------------------------------------------------------|
| `pattern`  | RegExp  | Yes       | `/^app\/.*\.js?$/` | Pattern of filepaths to be processed ([docs](http://brunch.io/docs/plugins#property-pattern-)).             |
| `warnOnly` | Boolean | Yes       | `true` | Use `warn` logging level instead of `error`.                                                                |
| `config`   | Object  | Yes       | `{}` | Options to pass to the ESLint engine ([docs](http://eslint.org/docs/developer-guide/nodejs-api#cliengine)). |


## License

Licensed under the [MIT license](https://github.com/spyl94/eslint-brunch/blob/master/LICENSE).
