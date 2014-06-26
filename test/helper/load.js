(function () {
  'use strict';

  var path = require('path');
  var expect = require('chai').expect;

  var load = require('../../lib/helper/load');

  var BASE_PATH = path.join(__dirname, '..', 'descriptor');


  describe('load() helper', function () {
    it('is accessible', function () {
      expect(load).to.be.defined;
    });


    it('is a function', function () {
      expect(load).to.be.a('function');
    });


    it('is async', function (done) {
      load(path.join(BASE_PATH, 'base.js'), done);
    });


    it('passes the resulting object to the callback', function (done) {
      load(path.join(BASE_PATH, 'base.js'), function (err, format) {
        if (err) { return done(err); }
        expect(format).to.be.an('object');
        done();
      });
    });


    it('returns an empty object if no file is found', function (done) {
      load('inexistent.path', function (err, format) {
        if (err) { return done(err); }
        expect(format).to.eql({});
        done();
      });
    });


    it('loads the file at the given path', function (done) {
      load(path.join(BASE_PATH, 'base.js'), function (err, format) {
        if (err) { return done(err); }
        expect(format).to.be.an('object');
        expect(format.Test).to.be.defined;
        expect(format.Test).to.be.an('object');
        expect(format.Test.type).to.equal('string');
        done();
      });
    });


    it('loads all files at the paths in an array', function (done) {
      load([
        path.join(BASE_PATH, 'load1.js'),
        path.join(BASE_PATH, 'load2.js'),
        path.join(BASE_PATH, 'load3.js')
      ], function (err, format) {
        if (err) { return done(err); }

        expect(format).to.eql({
          Load1 : true,
          Load2 : true,
          Load3 : true
        });

        done();
      });
    });


    it('loads all files at the paths passed to it', function (done) {
      load(
        path.join(BASE_PATH, 'load1.js'),
        path.join(BASE_PATH, 'load2.js'),
        path.join(BASE_PATH, 'load3.js'),
        function (err, format) {
          if (err) { return done(err); }

          expect(format).to.eql({
            Load1 : true,
            Load2 : true,
            Load3 : true
          });

          done();
        });
    });


    it('loads all files that match the given glob', function (done) {
      load(path.join(BASE_PATH, 'load*.js'), function (err, format) {
        if (err) { return done(err); }

        expect(format).to.eql({
          Load1 : true,
          Load2 : true,
          Load3 : true
        });

        done();
      });
    });
  });

})();
