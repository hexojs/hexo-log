'use strict';

require('chai').should();
const rewire = require('rewire');
const sinon = require('sinon');

const noop = () => {};
const fakeConsole = {
  trace: noop,
  debug: noop,
  info: noop,
  warn: noop,
  error: noop
};
const fakeProcess = {
  process: {
    stderr: {
      write: noop
    },
    stdout: {
      write: noop
    }
  }
};

const { logger } = require('../dist/log');

describe('hexo-log', () => {
  let loggerModule;

  beforeEach(() => {
    sinon.restore();
    loggerModule = rewire('../dist/log.js');
  });

  it('add alias for levels', () => {
    const log = logger();

    log.d.should.eql(log.debug);
    log.i.should.eql(log.info);
    log.w.should.eql(log.warn);
    log.e.should.eql(log.error);
    log.log.should.eql(log.info);
  });

  it('trace - should call console.trace', () => {
    const spy = sinon.spy();
    loggerModule.__set__('console.trace', spy);

    loggerModule.__with__(fakeProcess)(() => {
      const log = loggerModule({ debug: true });
      log.trace('test');
    });

    spy.called.should.be.true;
  });

  it('trace - with stderr and no stdout', () => {
    const stdoutSpy = sinon.spy();
    const stderrSpy = sinon.spy();

    loggerModule.__set__('console', fakeConsole);

    loggerModule.__with__({
      process: {
        stderr: {
          write: stderrSpy
        },
        stdout: {
          write: stdoutSpy
        }
      }
    })(() => {
      const log = loggerModule({ debug: true });
      log.trace('test');
    });

    stderrSpy.called.should.be.true;
    stdoutSpy.called.should.be.false;
  });

  it('debug - should call console.debug', () => {
    const spy = sinon.spy();
    loggerModule.__set__('console.debug', spy);

    loggerModule.__with__(fakeProcess)(() => {
      const log = loggerModule({ debug: true });
      log.debug('test');
    });

    spy.called.should.be.true;
  });

  it('debug - with stdout and no stderr', () => {
    const stdoutSpy = sinon.spy();
    const stderrSpy = sinon.spy();

    loggerModule.__set__('console', fakeConsole);

    loggerModule.__with__({
      process: {
        stderr: {
          write: stderrSpy
        },
        stdout: {
          write: stdoutSpy
        }
      }
    })(() => {
      const log = loggerModule({ debug: true });
      log.debug('test');
    });

    stderrSpy.called.should.be.false;
    stdoutSpy.called.should.be.true;
  });

  it('info - should call console.info', () => {
    const spy = sinon.spy();
    loggerModule.__set__('console.info', spy);

    loggerModule.__with__(fakeProcess)(() => {
      const log = loggerModule({ debug: true });
      log.info('test');
    });

    spy.called.should.be.true;
  });

  it('info - with stdout and no stderr', () => {
    const stdoutSpy = sinon.spy();
    const stderrSpy = sinon.spy();

    loggerModule.__set__('console', fakeConsole);

    loggerModule.__with__({
      process: {
        stderr: {
          write: stderrSpy
        },
        stdout: {
          write: stdoutSpy
        }
      }
    })(() => {
      const log = loggerModule({ debug: true });
      log.info('test');
    });

    stderrSpy.called.should.be.false;
    stdoutSpy.called.should.be.true;
  });

  it('warn - should call console.warn', () => {
    const spy = sinon.spy();
    loggerModule.__set__('console.warn', spy);

    loggerModule.__with__(fakeProcess)(() => {
      const log = loggerModule({ debug: true });
      log.warn('test');
    });

    spy.called.should.be.true;
  });

  it('warn - with stderr and no stdout', () => {
    const stdoutSpy = sinon.spy();
    const stderrSpy = sinon.spy();

    loggerModule.__set__('console', fakeConsole);

    loggerModule.__with__({
      process: {
        stderr: {
          write: stderrSpy
        },
        stdout: {
          write: stdoutSpy
        }
      }
    })(() => {
      const log = loggerModule({ debug: true });
      log.warn('test');
    });

    stderrSpy.called.should.be.true;
    stdoutSpy.called.should.be.false;
  });

  it('error - should call console.error', () => {
    const spy = sinon.spy();
    loggerModule.__set__('console.error', spy);

    loggerModule.__with__(fakeProcess)(() => {
      const log = loggerModule({ debug: true });
      log.error('test');
    });

    spy.called.should.be.true;
  });

  it('error - with stderr and no stdout', () => {
    const stdoutSpy = sinon.spy();
    const stderrSpy = sinon.spy();

    loggerModule.__set__('console', fakeConsole);

    loggerModule.__with__({
      process: {
        stderr: {
          write: stderrSpy
        },
        stdout: {
          write: stdoutSpy
        }
      }
    })(() => {
      const log = loggerModule({ debug: true });
      log.error('test');
    });

    stderrSpy.called.should.be.true;
    stdoutSpy.called.should.be.false;
  });

  it('fatal - should call console.error', () => {
    const spy = sinon.spy();
    loggerModule.__set__('console.error', spy);

    loggerModule.__with__(fakeProcess)(() => {
      const log = loggerModule({ debug: true });
      log.fatal('test');
    });

    spy.called.should.be.true;
  });

  it('fatal - with stderr and no stdout', () => {
    const stdoutSpy = sinon.spy();
    const stderrSpy = sinon.spy();

    loggerModule.__set__('console', fakeConsole);

    loggerModule.__with__({
      process: {
        stderr: {
          write: stderrSpy
        },
        stdout: {
          write: stdoutSpy
        }
      }
    })(() => {
      const log = loggerModule({ debug: true });
      log.fatal('test');
    });

    stderrSpy.called.should.be.true;
    stdoutSpy.called.should.be.false;
  });

  it('options.debug - should display time', () => {
    const spy = sinon.spy();
    const now = new Date();

    loggerModule.__set__('console', fakeConsole);

    loggerModule.__with__({
      process: {
        stdout: {
          write: spy
        }
      },
      Date: function() {
        this.toISOString = () => now.toISOString();
      }
    })(() => {
      const log = loggerModule({ debug: true });
      log.info('test');
    });

    spy.args[0][0].should.contain(now.toISOString().substring(11, 23));
  });

  it('options.silent - should not display anything', () => {
    const consoleTraceSpy = sinon.spy();
    const consoleDebugSpy = sinon.spy();
    const consoleInfoSpy = sinon.spy();
    const consoleWarnSpy = sinon.spy();
    const consoleErrorSpy = sinon.spy();

    loggerModule.__set__('console.trace', consoleTraceSpy);
    loggerModule.__set__('console.debug', consoleDebugSpy);
    loggerModule.__set__('console.info', consoleInfoSpy);
    loggerModule.__set__('console.warn', consoleWarnSpy);
    loggerModule.__set__('console.error', consoleErrorSpy);

    loggerModule.__with__(fakeProcess)(() => {
      const log = loggerModule({ silent: true });
      log.trace('test');
      log.debug('test');
      log.info('test');
      log.warn('test');
      log.error('test');
      log.fatal('test');
    });

    consoleTraceSpy.called.should.be.false;
    consoleDebugSpy.called.should.be.false;
    consoleInfoSpy.called.should.be.false;
    consoleWarnSpy.calledOnce.should.be.false;
    consoleErrorSpy.calledTwice.should.be.false;
  });

  it('should not display error as object', () => {
    const consoleWarnSpy = sinon.spy();
    const consoleErrorSpy = sinon.spy();

    loggerModule.__set__('console.warn', consoleWarnSpy);
    loggerModule.__set__('console.error', consoleErrorSpy);

    loggerModule.__with__(fakeProcess)(() => {
      const log = loggerModule();
      log.warn({err: new Error('test')});
      log.error({err: new Error('test')}, 'test: %s', 'test');
    });
    consoleWarnSpy.args[0].length.should.eql(0);
    consoleErrorSpy.args[0][0].should.eql('test: %s');
  });
});

describe('hexo-log example', () => {
  const log = logger({ debug: true });
  const log2 = logger();
  it('log.trace()', () => {
    log.trace('Hello, World!');
    log2.trace('Hello, World!');
  });

  it('log.debug()', () => {
    log.debug('Hello, World!');
    log2.debug('Hello, World!');
  });

  it('log.info()', () => {
    log.info('Hello, World!');
    log2.info('Hello, World!');
  });

  it('log.warn()', () => {
    log.warn('Hello, World!');
    log2.warn('Hello, World!');
  });

  it('log.error()', () => {
    log.error('Hello, World!');
    log2.error('Hello, World!');
  });

  it('log.fatal()', () => {
    log.fatal('Hello, World!');
    log2.fatal('Hello, World!');
  });
});
