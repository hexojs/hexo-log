'use strict';

const { Console } = require('console');
const chalk = require('chalk');

const LEVEL = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60
};

const LEVEL_NAMES = {
  trace: 'TRACE',
  debug: 'DEBUG',
  info: 'INFO ',
  warn: 'WARN ',
  error: 'ERROR',
  fatal: 'FATAL'
};

const LEVEL_COLORS = {
  trace: 'gray',
  debug: 'gray',
  info: 'green',
  warn: 'bgYellow',
  error: 'bgRed',
  fatal: 'bgRed'
};

const console = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: false
});

class Logger {
  constructor(options = {}) {
    const silent = options.silent || false;
    this._debug = options.debug || false;

    this.level = LEVEL.info;

    if (silent) {
      this.level = LEVEL.warn;
    }

    if (this._debug) {
      this.level = LEVEL.trace;
    }
  }

  _writeDebugTimestamp(stdType = 'stdout') {
    if (this._debug) {
      const str = new Date().toISOString().substring(11, 23);
      process[stdType].write(chalk[LEVEL_COLORS.debug](str + ' '));
    }
  }

  trace(...args) {
    if (LEVEL.trace >= this.level) {
      this._writeDebugTimestamp('stderr');
      process.stderr.write(chalk[LEVEL_COLORS.trace](LEVEL_NAMES.trace) + ' ');
      console.trace(...args);
    }
  }

  debug(...args) {
    if (LEVEL.debug >= this.level) {
      this._writeDebugTimestamp();
      process.stdout.write(chalk[LEVEL_COLORS.debug](LEVEL_NAMES.debug) + ' ');
      // For Node.js 10 and higher, console.debug is an alias for console.log
      console.debug(...args);
    }
  }

  info(...args) {
    if (LEVEL.info >= this.level) {
      this._writeDebugTimestamp();
      process.stdout.write(chalk[LEVEL_COLORS.info](LEVEL_NAMES.info) + ' ');
      // For Node.js 10 and higher, console.info is an alias for console.log
      console.info(...args);
    }
  }

  warn(...args) {
    if (LEVEL.warn >= this.level) {
      this._writeDebugTimestamp('stderr');
      process.stderr.write(chalk[LEVEL_COLORS.warn](LEVEL_NAMES.warn) + ' ');
      // For Node.js 10 and higher, console.info is an alias for console.error
      console.warn(...args);
    }
  }

  error(...args) {
    if (LEVEL.error >= this.level) {
      this._writeDebugTimestamp('stderr');
      process.stderr.write(chalk[LEVEL_COLORS.error](LEVEL_NAMES.error) + ' ');
      console.error(...args);
    }
  }

  fatal(...args) {
    if (LEVEL.fatal >= this.level) {
      this._writeDebugTimestamp('stderr');
      process.stderr.write(chalk[LEVEL_COLORS.fatal](LEVEL_NAMES.fatal) + ' ');
      console.error(...args);
    }
  }
}

function createLogger(options) {
  const logger = new Logger(options);

  logger.d = logger.debug;
  logger.i = logger.info;
  logger.w = logger.warn;
  logger.e = logger.error;
  logger.log = logger.info;

  return logger;
}

module.exports = createLogger;
