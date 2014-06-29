(function () {
  'use strict';

  var expect = require('chai').expect;

  var isPlainObject = require('../../lib/helper/is-plain-object');

  describe('isPlainObject() helper', function () {
    it('is accessible', function () {
      expect(isPlainObject).to.be.defined;
    });


    it('is a function', function () {
      expect(isPlainObject).to.be.a('function');
    });


    it('returns true for plain objects', function () {
      expect(isPlainObject({})).to.be.true;
    });


    it('returns true for new Object()', function () {
      // Avoid the warning about the object literal notation being prefered
      // over the Object constructor
      /* jshint -W010 */
      expect(isPlainObject(new Object())).to.be.true;
    });


    it('returns false for Date', function () {
      expect(isPlainObject(new Date())).to.be.false;
    });


    it('returns false for arrays', function () {
      // Avoid the warning about the array literal notation being prefered
      // over the Array constructor
      /* jshint -W009 */
      expect(isPlainObject([])).to.be.false;
      expect(isPlainObject(new Array())).to.be.false;
    });


    it('returns false for custom constructors', function () {
      function CustomConstructor() {}

      expect(isPlainObject(new CustomConstructor())).to.be.false;
    });


    it('returns false for strings', function () {
      expect(isPlainObject('foobar')).to.be.false;
    });


    it('returns false for numbers', function () {
      expect(isPlainObject(123)).to.be.false;
    });
  });
})();
