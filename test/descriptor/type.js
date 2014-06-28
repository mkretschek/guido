(function () {
  'use strict';

  var expect = require('chai').expect;

  var Checker = require('../../lib/checker');
  var type = require('../../lib/descriptor/type');


  describe('type descriptor', function () {
    var guido;

    beforeEach(function () {
      guido = new Checker();
      guido.use(type);
    });


    beforeEach(function (done) {
      guido.setDescription('String', {
        type : 'string'
      }, done);
    });


    beforeEach(function (done) {
      guido.setDescription('Boolean', {
        type : 'boolean'
      }, done);
    });


    beforeEach(function (done) {
      guido.setDescription('StringOrNumber', {
        type : [
          'string',
          'number'
        ]
      }, done);
    });


    it('is accessible', function () {
      expect(type).to.be.defined;
    });


    it('is a function', function () {
      expect(type).to.be.a('function');
    });


    it('is "usable"', function () {
      function useType() {
        guido.use(type);
      }

      expect(useType).to.not.throw;
    });


    it('sets a descriptor', function () {
      var guido = new Checker();

      expect(guido.getDescriptor('type')).to.be.undefined;

      guido.use(type);

      expect(guido.getDescriptor('type')).to.be.a('function');
    });


    it('sets the "type" keyword', function () {
      var guido = new Checker();

      expect(guido.usesKeyword('type')).to.be.false;

      guido.use(type);

      expect(guido.usesKeyword('type')).to.be.true;
    });


    it('accepts values that match the specific type', function (done) {
      guido.validate('String', 'foo', function (err, valid) {
        if (err) { return done(err); }

        expect(valid).to.be.true;
        done();
      });
    });


    it('does not accept values that don\'t match the given type',
      function (done) {
        guido.validate('String', 123, function (err, valid) {
          if (err) { return done(err); }

          expect(valid).to.be.false;

          guido.validate('String', true, function (err, valid) {
            if (err) { return done(err); }

            expect(valid).to.be.false;
            done();
          });
        });
      });


    it('accepts an array of types', function (done) {
      // Test a string
      guido.validate('StringOrNumber', 'foo', function (err, valid) {
        if (err) { return done(err); }

        expect(valid).to.be.true;

        // Test a number
        guido.validate('StringOrNumber', 123, function (err, valid) {
          if (err) { return done(err); }

          expect(valid).to.be.true;

          // Test a boolean
          guido.validate('StringOrNumber', true, function (err, valid) {
            if (err) { return done(err); }

            expect(valid).to.be.false;
            done();
          });
        });
      });
    });
  });

})();
