(function () {
  'use strict';

  var expect = require('chai').expect;
  var sinon = require('sinon');

  var Checker = require('../../lib/checker');
  var createValidator = require('../../lib/helper/create-validator');


  var valueDescriptor = sinon.spy(function (config, val, callback) {
    if (val !== config) {
      callback(null, false, {
        message : 'Invalid value!',
        value : val,
        expected : config
      });
      return;
    }

    callback(null, true);
  });


  var truthyDescriptor = sinon.spy(function (truthy, val, callback) {
    val = !!val;
    if (truthy === val) {
      callback(null, true);
    } else {
      callback(null, false, {
        message : truthy ? 'Not a truthy value!' : 'Not a falsy value!',
        value : val
      });
    }
  });


  var errDescriptor = sinon.spy(function (config, val, callback) {
    config = config || 'Invalid value!';
    var err = new Error(config);
    callback(err, null);
  });


  describe.only('createValidator() helper', function () {
    it('is accessible', function () {
      expect(createValidator).to.be.defined;
    });


    it('is a function', function () {
      expect(createValidator).to.be.a('function');
    });


    describe('returned function', function () {
      var guido;
      var foo;
      var validator;


      beforeEach(function () {
        truthyDescriptor.reset();
        valueDescriptor.reset();
        errDescriptor.reset();
      });


      beforeEach(function () {
        foo = {
          value : 'foo',
          truthy : true
        };
      });


      beforeEach(function () {
        guido = new Checker();

        guido.setDescriptor('value', valueDescriptor);
        guido.setDescriptor('truthy', truthyDescriptor);
        guido.setDescriptor('err', errDescriptor);
      });


      beforeEach(function (done) {
        guido.setDescription('Foo', foo, done);
      });


      beforeEach(function () {
        validator = createValidator(guido, 'Foo');
      });


      it('is a function', function () {
        expect(validator).to.be.a('function');
      });


      it('is async', function (done) {
        validator('foo', done);
      });


      it('checks the descriptors defined in the description',
        function (done) {
          validator('foo', function (err) {
            if (err) { return done(err); }

            expect(valueDescriptor).to.have.been.called;
            expect(truthyDescriptor).to.have.been.called;
            expect(errDescriptor).not.to.have.been.called;
            done();
          });
        });


      it('ignores unknown keywords', function (done) {
        var bar = {
          value : 'bar',
          inexistentDescriptor : true
        };

        guido.setDescription('Bar', bar, function (err) {
          if (err) { return done(err); }

          validator = createValidator(guido, 'Bar');

          validator('bar', function (err) {
            expect(err).to.be.null;
            done();
          });
        });
      });


      it('passes errors to the callback', function (done) {
        var failed = {
          err : 'It will always fail!'
        };

        guido.setDescription('Failed', failed, function (err) {
          if (err) { return done(err); }

          validator = createValidator(guido, 'Failed');

          validator('this should fail', function (err) {
            expect(err).to.not.be.null;
            expect(err.message).to.equal('It will always fail!');
            done();
          });
        });
      });


      it('passes a boolean to the callback indicating if the value is valid',
        function (done) {
          validator('foo', function (err, valid) {
            if (err) { return done(err); }

            expect(valid).to.be.true;

            validator('invalid', function (err, valid) {
              if (err) { return done(err); }

              expect(valid).to.be.false;
              done();
            });
          });
        });


      it('passes an array of objects containing details about errors',
        function (done) {
          validator(0, function (err, valid, details) {
            if (err) { return done(err); }

            expect(valid).to.be.false;
            expect(details).to.have.length(2);

            expect(details[0].message).to.equal('Invalid value!');
            expect(details[1].message).to.equal('Not a truthy value!');

            done();
          });
        });
    });
  });

})();
