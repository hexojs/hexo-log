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

const logger = require('../lib/log');

describe('hexo-log', () => {
  let loggerModule;

  beforeEach(() => {
    sinon.restore();
    loggerModule = rewire('../lib/log');
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

  it('debug - should call console.debug', () => {
    const spy = sinon.spy();
    loggerModule.__set__('console.debug', spy);

    loggerModule.__with__(fakeProcess)(() => {
      const log = loggerModule({ debug: true });
      log.debug('test');
    });

    spy.called.should.be.true;
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

  it('warn - should call console.warn', () => {
    const spy = sinon.spy();
    loggerModule.__set__('console.warn', spy);

    loggerModule.__with__(fakeProcess)(() => {
      const log = loggerModule({ debug: true });
      log.warn('test');
    });

    spy.called.should.be.true;
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

  it('fatal - should call console.error', () => {
    const spy = sinon.spy();
    loggerModule.__set__('console.error', spy);

    loggerModule.__with__(fakeProcess)(() => {
      const log = loggerModule({ debug: true });
      log.fatal('test');
    });

    spy.called.should.be.true;
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
      }
    })(() => {
      sinon.useFakeTimers(now.valueOf());
      const log = loggerModule({ debug: true });
      log.info('test');
      sinon.restore();
    });

    spy.args[0][0].should.contain(now.toISOString().substring(11, 23));
  });

  it('options.silent - should ignore those level lower than warn', () => {
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
    consoleWarnSpy.calledOnce.should.be.true;
    consoleErrorSpy.calledTwice.should.be.true;
  });
});

describe('hexo-log example', () => {
  it('log.trace()', () => {
    const log = logger({ debug: true });

    log.trace('Hello, World!');
  });

  it('log.debug()', () => {
    const log = logger({ debug: true });

    log.debug('Hello, World!');
  });

  it('log.info()', () => {
    const log = logger({ debug: true });

    log.info('Hello, World!');
  });

  it('log.warn()', () => {
    const log = logger({ debug: true });

    log.warn('Hello, World!');
  });

  it('log.error()', () => {
    const log = logger({ debug: true });

    log.error('Hello, World!');
  });

  it('log.fatal()', () => {
    const log = logger({ debug: true });

    log.fatal('Hello, World!');
  });
});
