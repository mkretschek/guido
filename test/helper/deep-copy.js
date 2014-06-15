(function () {
  'use strict';

  var expect = require('chai').expect;

  var deepCopy = require('../../lib/helper/deep-copy');

  var obj = {foo : {bar : 'baz'}};
  var arr = ['foo', obj];

  describe('deepCopy() helper', function () {
    it('is accessible', function () {
      expect(deepCopy).to.be.defined;
    });


    it('is a function', function () {
      expect(deepCopy).to.be.a('function');
    });


    it('creates a copy of the given object', function () {
      var copy = deepCopy(obj);

      expect(copy).not.to.equal(obj);
      expect(copy).to.eql(obj);
    });


    it('creates a copy of nested objects', function () {
      var copy = deepCopy(obj);

      expect(copy.foo).not.to.equal(obj.foo);
      expect(copy.foo).to.eql(obj.foo);
    });


    it('creates a copy of the given array', function () {
      var copy = deepCopy(arr);

      expect(copy).not.to.equal(arr);
      expect(copy).to.eql(arr);
    });


    it('creates a copy of objects in the given array', function () {
      var copy = deepCopy(arr);

      expect(copy[1]).not.to.equal(arr[1]);
      expect(copy[1]).to.eql(arr[1]);
    });
  });
})();
