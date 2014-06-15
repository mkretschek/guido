(function () {
  'use strict';

  var path = require('path');
  var expect = require('chai').expect;

  var load = require('../../lib/helper/load');

  var BASE_PATH = path.join(__dirname, '..');


  describe('load() helper', function () {
    it('is accessible', function () {
      expect(load).to.be.defined;
    });


    it('is a function', function () {
      expect(load).to.be.a('function');
    });


    it.only('loads the file at the given path', function () {
      var format = load(path.join(BASE_PATH, 'descriptor', 'base.js'));
      expect(format).to.be.an('object');
      expect(format.Test).to.be.defined;
      expect(format.Test).to.be.an('object');
      expect(format.Test.type).to.equal('string');
    });

    it('loads all files at the paths in an array');
    it('loads all files that match the given glob');
    it('concatenates loaded files into a single object');
    it('returns an object');
  });
})();
