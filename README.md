# hexo-log

[![CI](https://github.com/hexojs/hexo-log/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/hexojs/hexo-log/actions/workflows/ci.yml)
[![NPM version](https://badge.fury.io/js/hexo-log.svg)](https://www.npmjs.com/package/hexo-log)
[![Coverage Status](https://coveralls.io/repos/github/hexojs/hexo-log/badge.svg)](https://coveralls.io/github/hexojs/hexo-log)

Logger for Hexo.

## Installation

``` bash
$ npm install hexo-log --save
```

## Usage

``` js
// v3.x.x
const log = require('hexo-log')({
  debug: false,
  silent: false
});
log.info('Hello world');

// v4.x.x
const log = require('hexo-log').default({
  debug: false,
  silent: false
});
log.info('Hello world');

// v4.x.x (ES Module)
import { logger } from 'hexo-log';

const log = logger({
  debug: false,
  silent: false
});
log.info('Hello world');
```

Option | Description | Default
--- | --- | ---
`debug` | Display debug message. | `false`
`silent` | Don't display any message in console. | `false`

## License

MIT
