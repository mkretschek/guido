(function () {
  'use strict';

  var expect = require('chai').expect;

  var simplify = require('../../lib/helper/simplify');


  describe('simplify() helper', function () {
    it('is accessible', function () {
      expect(simplify).to.be.defined;
    });


    it('is a function', function () {
      expect(simplify).to.be.a('function');
    });


    it('defaults to using javascript native types');
    it('simplifies a descriptor object to native types');
    it('simplifies property descriptors');
    it('simplifies item descriptors');
    it('returns the simplified object');
  });
})();
