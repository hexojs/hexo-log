'use strict';

require('chai').should();
const rewire = require('rewire');
const sinon = require('sinon');

describe('hexo-log', () => {
  const logger = require('../lib/log');
  const loggerModule = rewire('../lib/log');

  beforeEach(() => {
    sinon.stub().reset();
  });

  it('add alias for levels', () => {
    const log = logger();

    log.d.should.eql(log.debug);
    log.i.should.eql(log.info);
    log.w.should.eql(log.warn);
    log.e.should.eql(log.error);
    log.log.should.eql(log.info);
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
});
