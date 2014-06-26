(function () {
  'use strict';


  var expect = require('chai').expect;
  var sinon = require('sinon');


  var Checker = require('../../lib/checker');
  var extend = require('../../lib/processor/extend');

  var guido;

  describe('extend', function () {

    beforeEach(function () {
      guido = new Checker();
    });


    it('is accessible', function () {
      expect(extend).to.be.defined;
    });


    it('is a function', function () {
      expect(extend).to.be.a('function');
    });


    it('is a "usable()" function', function () {
      function useExtend() {
        guido.use(extend);
      }

      expect(useExtend).not.to.throw;
    });


    it('adds a processor to the guido instance', function () {
      //expect(guido.getProcessor()).to.have.length(0);
      guido.use(extend);
      expect(guido.getProcessor()).to.have.length(1);
    });


    describe('processor', function () {

      var foo;
      var bar;
      var processor;

      beforeEach(function () {
        guido.use(extend);
      });


      beforeEach(function () {
        var processors = guido.getProcessor();
        processor = sinon.spy(processors, 0);
      });


      beforeEach(function (done) {
        foo = {
          length : {min : 5}
        };

        bar = {
          extend : 'Foo',
          length : {max : 10}
        };

        guido.setDescription('Foo', foo, done);
      });


      it('changes only descriptions with the "extend" keyword',
        function (done) {
          expect(guido.getDescription('Foo')).to.eql(foo);

          guido.setDescription('Bar', bar, function (err) {
            if (err) { return done(err); }

            expect(guido.getDescription('Bar')).to.eql({
              extend : 'Foo',
              length : {
                min : 5,
                max : 10
              }
            });

            done();
          });
        });


      it('creates a copy of the attributes', function (done) {
        expect(guido.getDescription('Foo')).to.eql(foo);

        guido.setDescription('Bar', bar, function (err) {
          if (err) { return done(err); }

          var description = guido.getDescription();

          // Note that we don't need to do any checks for
          // `description.Foo` being equal to `foo` because it has not
          // passed through the processor (since it does not have an 'extend'
          // descriptor) and, thus, has nothing to do with this test.

          // It's not another reference to the same description object
          expect(description.Bar).to.not.equal(bar);

          // It's not the same length object. 
          expect(description.Bar.length).to.not.equal(foo.length);
          expect(description.Bar.length).to.not.equal(bar.length);

          done();
        });
      });


      it('returns an error if the given base description is not defined',
        function (done) {
          var fail = {
            extend : 'Inexistent'
          };

          guido.setDescription('Fail', fail, function (err) {
            expect(err).to.not.be.null;
            expect(err.message).to.match(/Base description not found/);
            done();
          });
        });
    });
  });
})();
