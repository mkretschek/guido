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


    it('returns an object', function () {
      var format = load(path.join(BASE_PATH, 'base.js'));
      expect(format).to.be.an('object');
    });


    it('returns an empty object if no file is found', function () {
      var format = load('inexistent.path');
      expect(format).to.eql({});
    });


    it('loads the file at the given path', function () {
      var format = load(path.join(BASE_PATH, 'base.js'));
      expect(format).to.be.an('object');
      expect(format.Test).to.be.defined;
      expect(format.Test).to.be.an('object');
      expect(format.Test.type).to.equal('string');
    });


    it('loads all files at the paths in an array', function () {
      var format = load([
        path.join(BASE_PATH, 'load1.js'),
        path.join(BASE_PATH, 'load2.js'),
        path.join(BASE_PATH, 'load3.js')
      ]);

      expect(format).to.eql({
        Load1 : true,
        Load2 : true,
        Load3 : true
      });
    });


    it('loads all files at the paths passed to it', function () {
      var format = load(
        path.join(BASE_PATH, 'load1.js'),
        path.join(BASE_PATH, 'load2.js'),
        path.join(BASE_PATH, 'load3.js')
      );

      expect(format).to.eql({
        Load1 : true,
        Load2 : true,
        Load3 : true
      });
    });


    it('loads all files that match the given glob', function () {
      var format = load(path.join(BASE_PATH, 'load*.js'));

      expect(format).to.eql({
        Load1 : true,
        Load2 : true,
        Load3 : true
      });
    });
  });

})();
