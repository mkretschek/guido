(function () {
  'use strict';

  var expect = require('chai').expect;
  var sinon = require('sinon');


  var Checker = require('../../lib/checker');
  var process = require('../../lib/helper/process');


  describe('process() helper', function () {
    var fooProcessor = sinon.spy(function (guido, description, callback) {
      description.foo = true;
      callback(null, description);
    });

    var barProcessor = sinon.spy(function (guido, description, callback) {
      description.bar = true;
      callback(null, description);
    });

    var guido;
    var description;


    beforeEach(function () {
      guido = new Checker();
      description = {};
    });


    afterEach(function () {
      fooProcessor.reset();
      barProcessor.reset();
    });


    it('is accessible', function () {
      expect(process).to.be.defined;
    });


    it('is a function', function () {
      expect(process).to.be.a('function');
    });


    it('calls all the processors set in the checker', function (done) {
      guido.setProcessor(fooProcessor);
      guido.setProcessor(barProcessor);

      process(guido, description, function () {
        expect(fooProcessor).to.have.been.called;
        expect(barProcessor).to.have.been.called;

        expect(fooProcessor).to.have.been.calledBefore(barProcessor);
        done();
      });
    });


    it('calls the processors in sequence', function (done) {
      guido.setProcessor(fooProcessor);
      guido.setProcessor(barProcessor);

      process(guido, description, function () {
        expect(fooProcessor).to.have.been.calledBefore(barProcessor);
        done();
      });
    });


    it('passes the result of each processor onto the next', function (done) {
      guido.setProcessor(function (guido, description, callback) {
        callback(null, description + '2');
      });

      guido.setProcessor(function (guido, description, callback) {
        callback(null, description + '3');
      });

      var description = '1';

      process(guido, description, function (err, result) {
        expect(result).to.equal('123');
        done();
      });
    });


    it('passes the resulting description to the callback', function (done) {
      guido.setProcessor(fooProcessor);
      guido.setProcessor(barProcessor);

      process(guido, description, function (err, result) {
        expect(result).to.equal(description);
        expect(result.foo).to.be.true;
        expect(result.bar).to.be.bar;
        done();
      });
    });


    it('it passes the error to the callback if one occurs', function (done) {
      var error = new Error('Some error!');
      guido.setProcessor(function (guido, description, callback) {
        callback(error);
      });

      process(guido, description, function (err) {
        expect(err).to.be.defined;
        expect(err).to.equal(error);
        done();
      });
    });


    it('stops executing the processors when an error occurs', function (done) {
      var error = new Error('Some error!');

      guido.setProcessor(fooProcessor);

      guido.setProcessor(function (guido, description, callback) {
        callback(error);
      });

      guido.setProcessor(barProcessor);

      process(guido, description, function (err) {
        expect(err).to.be.defined;
        expect(err).to.equal(error);

        expect(fooProcessor).to.have.been.called;
        expect(barProcessor).to.not.have.been.called;
        done();
      });
    });


    it('does not pass a resulting description if an error occurs',
      function (done) {
        var error = new Error('Some error!');

        guido.setProcessor(fooProcessor);

        guido.setProcessor(function (guido, description, callback) {
          callback(error);
        });

        guido.setProcessor(barProcessor);

        process(guido, description, function (err, result) {
          expect(result).to.be.null;
          done();
        });
      });
  });

})();
