(function () {
  'use strict';

  var expect = require('chai').expect;

  var Checker = require('../../lib/checker');
  var length = require('../../lib/descriptor/length');


  describe('length descriptor', function () {
    var guido;

    beforeEach(function () {
      guido = new Checker();
      guido.use(length);
    });


    it('is accessible', function () {
      expect(length).to.be.defined;
    });


    it('is a function', function () {
      expect(length).to.be.a('function');
    });


    it('is "usable"', function () {
      function useLength() {
        guido.use(length);
      }

      expect(useLength).to.not.throw;
    });


    it('sets a descriptor', function () {
      var guido = new Checker();

      expect(guido.getDescriptor('length')).to.be.undefined;

      guido.use(length);

      expect(guido.getDescriptor('length')).to.be.a('function');
    });


    it('sets the "length" keyword', function () {
      var guido = new Checker();

      expect(guido.usesKeyword('length')).to.be.false;

      guido.use(length);

      expect(guido.usesKeyword('length')).to.be.true;
    });


    describe('with a numeric value', function () {

      beforeEach(function (done) {
        guido.setDescription('Foo', {
          length : 6
        }, done);
      });


      it('accepts strings with the given length', function (done) {
        guido.validate('Foo', 'foobar', function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.true;
          done();
        });
      });


      it('accepts arrays with the given length', function (done) {
        var arr = [0, 1, 2, 3, 4, 5];

        guido.validate('Foo', arr, function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.true;
          done();
        });
      });


      it('accepts objects with the given length value', function (done) {
        var obj = {length : 6};

        guido.validate('Foo', obj, function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.true;
          done();
        });
      });


      it('rejects strings shorter than the given length', function (done) {
        guido.validate('Foo', 'foo', function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.false;
          done();
        });
      });


      it('rejects strings longer than the given length', function (done) {
        guido.validate('Foo', 'foobarbaz', function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.false;
          done();
        });
      });


      it('rejects arrays shorter than the given length', function (done) {
        var arr = [];

        guido.validate('Foo', arr, function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.false;
          done();
        });
      });


      it('rejects arrays longer than the given length', function (done) {
        var arr = [0, 1, 2, 3, 4, 5, 6, 7];

        guido.validate('Foo', arr, function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.false;
          done();
        });
      });


      it('rejects objects with a lower length property', function (done) {
        var obj = {length : 1};

        guido.validate('Foo', obj, function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.false;
          done();
        });
      });


      it('rejects objects with a higher length property', function (done) {
        var obj = {length : 7};

        guido.validate('Foo', obj, function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.false;
          done();
        });
      });
    }); // with a numeric value


    describe('with a range', function () {

      beforeEach(function (done) {
        guido.setDescription('Foo', {
          length : {
            min : 3,
            max : 5
          }
        }, done);
      });


      it('accepts strings with length within the given range',
        function (done) {
          guido.validate('Foo', 'foo', function (err, valid) {
            if (err) { return done(err); }
            expect(valid).to.be.true;

            guido.validate('Foo', 'foob', function (err, valid) {
              if (err) { return done(err); }
              expect(valid).to.be.true;

              guido.validate('Foo', 'fooba', function (err, valid) {
                if (err) { return done(err); }
                expect(valid).to.be.true;

                done();
              });
            });
          });
        });


      it('accepts arrays with length within the given range',
        function (done) {
          var arr3 = [0, 1, 2];
          var arr4 = [0, 1, 2, 3];
          var arr5 = [0, 1, 2, 3, 4];

          guido.validate('Foo', arr3, function (err, valid) {
            if (err) { return done(err); }
            expect(valid).to.be.true;

            guido.validate('Foo', arr4, function (err, valid) {
              if (err) { return done(err); }
              expect(valid).to.be.true;

              guido.validate('Foo', arr5, function (err, valid) {
                if (err) { return done(err); }
                expect(valid).to.be.true;

                done();
              });
            });
          });
        });


      it('accepts objects with length property within the given range',
        function (done) {
          var obj3 = {length : 3};
          var obj4 = {length : 4};
          var obj5 = {length : 5};

          guido.validate('Foo', obj3, function (err, valid) {
            if (err) { return done(err); }
            expect(valid).to.be.true;

            guido.validate('Foo', obj4, function (err, valid) {
              if (err) { return done(err); }
              expect(valid).to.be.true;

              guido.validate('Foo', obj5, function (err, valid) {
                if (err) { return done(err); }
                expect(valid).to.be.true;

                done();
              });
            });
          });
        });


      it('rejects strings with length outside the given range',
        function (done) {
          guido.validate('Foo', 'fo', function (err, valid) {
            if (err) { return done(err); }
            expect(valid).to.be.false;

            guido.validate('Foo', 'foobar', function (err, valid) {
              if (err) { return done(err); }
              expect(valid).to.be.false;

              done();
            });
          });
        });


      it('rejects arrays with length outside the given range',
        function (done) {
          var arr2 = [0, 1];
          var arr6 = [0, 1, 2, 3, 4, 5];

          guido.validate('Foo', arr2, function (err, valid) {
            if (err) { return done(err); }
            expect(valid).to.be.false;

            guido.validate('Foo', arr6, function (err, valid) {
              if (err) { return done(err); }
              expect(valid).to.be.false;

              done();
            });
          });
        });


      it('rejects objects with length property outside the given range',
        function (done) {
          var obj2 = {length : 2};
          var obj6 = {length : 6};

          guido.validate('Foo', obj2, function (err, valid) {
            if (err) { return done(err); }
            expect(valid).to.be.false;

            guido.validate('Foo', obj6, function (err, valid) {
              if (err) { return done(err); }
              expect(valid).to.be.false;

              done();
            });
          });
        });
    }); // with a range


    describe('checking values with no length', function () {

      beforeEach(function (done) {
        guido.setDescription('Foo', {
          length : 8
        }, done);
      });


      it('rejects numbers', function (done) {
        guido.validate('Foo', 123456, function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.false;
          done();
        });
      });


      it('returns false for objects with no length attribute',
        function (done) {
          var date = new Date();
          var bool = false;
          var objWithoutLength = {};

          guido.validate('Foo', date, function (err, valid) {
            if (err) { return done(err); }
            expect(valid).to.be.false;

            guido.validate('Foo', bool, function (err, valid) {
              if (err) { return done(err); }
              expect(valid).to.be.false;

              guido.validate('Foo', objWithoutLength, function (err, valid) {
                if (err) { return done(err); }
                expect(valid).to.be.false;

                done();
              });
            });
          });
        });


      it('returns false for null', function (done) {
        guido.validate('Foo', null, function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.false;
          done();
        });
      });


      it('returns false for undefined', function (done) {
        guido.validate('Foo', undefined, function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.false;
          done();
        });
      });
    });

  });

})();
