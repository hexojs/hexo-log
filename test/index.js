'use strict';

const should = require('chai').should(); // eslint-disable-line
const rewire = require('rewire');
const sinon = require('sinon');

describe('hexo-log', () => {
  const logger = require('../lib/log');
  const loggerModule = rewire('../lib/log');

  it('add alias for levels', () => {
    let log = logger();

    log.d.should.eql(log.debug);
    log.i.should.eql(log.info);
    log.w.should.eql(log.warn);
    log.e.should.eql(log.error);
    log.log.should.eql(log.info);
  });

  it('default name is hexo', () => {
    let log = logger();

    log.fields.name.should.eql('hexo');
  });

  it('options.name', () => {
    let log = logger({ name: 'foo' });

    log.fields.name.should.eql('foo');
  });

  it('level should be trace if options.debug is true', () => {
    let log = logger({ debug: true });

    log.streams[0].level.should.eql(10);
  });

  it('should add file stream if options.debug is true', () => {
    let log = logger({ debug: true });

    log.streams[1].path.should.eql('debug.log');
  });

  it('should remove console stream if options.silent is true', () => {
    let log = logger({ silent: true });

    log.streams.length.should.eql(0);
  });

  it('should display time if options.debug is true', () => {
    const spy = sinon.spy();
    const now = new Date();

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

  it('should print error to process.stderr stream', () => {
    const spy = sinon.spy();

    loggerModule.__with__({
      process: {
        stderr: {
          write: spy
        }
      }
    })(() => {
      const log = loggerModule();
      log.error('test');
    });

    spy.calledOnce.should.be.true;
  });
});
