(function () {
  'use strict';

  var expect = require('chai').expect;

  var Checker = require('../../lib/checker');
  var match = require('../../lib/descriptor/match');


  describe('match descriptor', function () {
    var guido;
    var foobar;

    beforeEach(function () {
      foobar = {
        match : /^foobar$/i
      };
    });


    beforeEach(function () {
      guido = new Checker();
      guido.use(match);
    });


    beforeEach(function (done) {
      guido.setDescription('Foobar', foobar, done);
    });


    it('is accessible', function () {
      expect(match).to.be.defined;
    });


    it('is a function', function () {
      expect(match).to.be.a('function');
    });


    it('is "usable"', function () {
      function useDescriptor() {
        guido.use(match);
      }

      expect(useDescriptor).to.not.throw;
    });


    it('sets a descriptor', function () {
      var guido = new Checker();

      expect(guido.getDescriptor('match')).to.be.undefined;

      guido.use(match);

      expect(guido.getDescriptor('match')).to.be.a('function');
    });


    it('sets a processor', function () {
      var guido = new Checker();

      expect(guido.getProcessor()).to.have.length(0);

      guido.use(match);

      expect(guido.getProcessor()).to.have.length(1);
    });


    it('sets the "match" keyword', function () {
      var guido = new Checker();

      expect(guido.usesKeyword('match')).to.be.false;

      guido.use(match);

      expect(guido.usesKeyword('match')).to.be.true;
    });


    it('accepts strings matching the regexp', function (done) {
      guido.validate('Foobar', 'FooBar', function (err, valid) {
        if (err) { return done(err); }
        expect(valid).to.be.true;

        guido.validate('Foobar', 'foobar', function (err, valid) {
          if (err) { return done(err); }
          expect(valid).to.be.true;

          done();
        });
      });
    });


    it('rejects numbers', function (done) {
      guido.validate('Foobar', 123456, function (err, valid) {
        if (err) { return done(err); }
        expect(valid).to.be.false;
        done();
      });
    });


    it('rejects arrays', function (done) {
      guido.validate('Foobar', ['f'], function (err, valid) {
        if (err) { return done(err); }
        expect(valid).to.be.false;
        done();
      });
    });


    it('rejects objects', function (done) {
      guido.validate('Foobar', {}, function (err, valid) {
        if (err) { return done(err); }
        expect(valid).to.be.false;
        done();
      });
    });


    describe('processor', function () {
      it('converts strings to RegExp instances', function (done) {
        var foobar = {
          match : 'foobar'
        };

        guido.setDescription('Foobar', foobar, function (err) {
          if (err) { return done(err); }

          var description = guido.getDescription('Foobar');
          expect(description.match).to.be.instanceof(RegExp);
          expect(description.match.toString()).to.equal('/foobar/');

          done();
        });
      });


      it('converts object to RegExp instances', function (done) {
        var foobar = {
          match : {
            pattern : '^foobar$',
            flags : 'gi'
          }
        };

        guido.setDescription('Foobar', foobar, function (err) {
          if (err) { return done(err); }

          var description = guido.getDescription('Foobar');
          expect(description.match).to.be.instanceof(RegExp);
          expect(description.match.toString()).to.equal('/^foobar$/gi');

          done();
        });
      });

      it('sets appropriate flags', function (done) {
        var foobar = {
          match : {
            pattern : '^foobar$',
            global : true,
            ignoreCase : true,
            multiline : true
          }
        };

        guido.setDescription('Foobar', foobar, function (err) {
          if (err) { return done(err); }

          var description = guido.getDescription('Foobar');
          expect(description.match).to.be.instanceof(RegExp);
          expect(description.match.toString()).to.equal('/^foobar$/gim');

          done();
        });
      });


      it('keeps the original RegExp instance if one is given', function (done) {
        var re = /^foobar$/gi;
        var foobar = {
          match : re
        };

        guido.setDescription('Foobar', foobar, function (err) {
          if (err) { return done(err); }

          var description = guido.getDescription('Foobar');
          expect(description.match).to.be.instanceof(RegExp);
          expect(description.match).to.equal(re);

          done();
        });
      });

    }); // processor

  });

})();
