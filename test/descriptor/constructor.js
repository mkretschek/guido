(function () {
  'use strict';

  var expect = require('chai').expect;

  var Checker = require('../../lib/checker');
  var constructor = require('../../lib/descriptor/constructor');


  describe('constructor descriptor', function () {
    var guido;

    beforeEach(function () {
      guido = new Checker();
      guido.use(constructor);
    });


    it('is accessible', function () {
      expect(constructor).to.be.defined;
    });


    it('is a function', function () {
      expect(constructor).to.be.a('function');
    });


    it('is "usable"', function () {
      function useConstructor() {
        guido.use(constructor);
      }

      expect(useConstructor).to.not.throw;
    });


    it('sets a descriptor', function () {
      var guido = new Checker();

      expect(guido.getDescriptor('constructor')).to.be.undefined;

      guido.use(constructor);

      expect(guido.getDescriptor('constructor')).to.be.a('function');
    });


    it('sets the "constructor" keyword', function () {
      var guido = new Checker();

      expect(guido.usesKeyword('constructor')).to.be.false;

      guido.use(constructor);

      expect(guido.usesKeyword('constructor')).to.be.true;
    });


    it('accepts values that match the specific constructor', function (done) {
      var DateDescription = {
        constructor : Date
      };

      guido.setDescription('Date', DateDescription, function (err) {
        if (err) { return done(err); }

        guido.validate('Date', new Date(), function (err, valid) {
          if (err) { return done(err); }

          expect(valid).to.be.true;
          done();
        });
      });
    });


    it('works with constructor names', function (done) {
      var DateDescription = {
        constructor : 'Date'
      };

      guido.setDescription('Date', DateDescription, function (err) {
        if (err) { return done(err); }

        guido.validate('Date', new Date(), function (err, valid) {
          if (err) { return done(err); }

          expect(valid).to.be.true;
          done();
        });
      });
    });


    it('does not accept values that don\'t match the given constructor',
      function (done) {
        var StringDescription = {
          constructor : String
        };

        guido.setDescription('String', StringDescription, function (err) {
          if (err) { return done(err); }

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
      });


    describe('with an array of constructors', function () {
      before(function (done) {
        var StringOrNumber = {
          constructor : [
            String,
            'Number'
          ]
        };

        guido.setDescription('StringOrNumber', StringOrNumber, done);
      });


      it('accepts values that match the given constructors', function (done) {
        guido.validate('StringOrNumber', 'abcdef', function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.true;

          guido.validate('StringOrNumber', 123456, function (err, valid) {
            if (err) { return done(err); }
            expect(valid).to.be.true;
            done();
          });
        });
      });


      it('rejects values that don\'t match any of the constructors',
        function (done) {
          guido.validate('StringOrNumber', true, function (err, valid) {
            if (err) { return done(err); }
            expect(valid).to.be.false;

            guido.validate('StringOrNumber', new Date(), function (err, valid) {
              if (err) { return done(err); }
              expect(valid).to.be.false;

              done();
            });
          });
        });

    }); // with an array of constructors

  });

})();
