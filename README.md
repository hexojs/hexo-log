# hexo-log

Logger for Hexo, based on [bunyan] with better console output.

## Installation

``` bash
$ npm install hexo-log --save
```

## Usage

``` js
var log = require('hexo-log')({
  debug: false,
  silent: false
});

log.info('Hello world');
```

Option | Description | Default
--- | --- | ---
`debug` | Display debug message and save log to `debug.log` file. | `false`
`silent` | Don't display message in console. | `false`
`name` | Name | `hexo`

## License

MIT

[bunyan]: https://github.com/trentm/node-bunyan
