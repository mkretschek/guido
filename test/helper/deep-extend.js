(function () {
  'use strict';

  var expect = require('chai').expect;

  var deepExtend = require('../../lib/helper/deep-extend');


  describe('deepExtend() helper', function () {
    it('is accessible', function () {
      expect(deepExtend).to.be.defined;
    });


    it('is a function', function () {
      expect(deepExtend).to.be.a('function');
    });


    it('extends a target object with the following ones', function () {
      var target = {foo : 'foo'};
      var source1 = {foo : 'bar', bar : 'foo'};
      var source2 = {foo : 'baz', baz : 'foo'};

      deepExtend(target, source1, source2);

      expect(target).to.have.property('bar');
      expect(target).to.have.property('baz');
      expect(target).to.eql({
        foo : 'baz',
        bar : 'foo',
        baz : 'foo'
      });
    });


    it('extends nested objects', function () {
      var target = {foo : {bar : 'bar'}};
      var source = {foo : {bar : 'baz', baz : 'bar'}};

      deepExtend(target, source);

      expect(target.foo).to.have.property('baz');
      expect(target.foo).to.eql({
        bar : 'baz',
        baz : 'bar'
      });
    });


    it('replaces parameters from the target if the source is not an object',
      function () {
        var target = {foo : {bar : 'baz'}};
        var source = {foo : 'bar'};

        deepExtend(target, source);

        expect(target.foo).to.equal('bar');
      });


    it('returns an object', function () {
      var target = {foo : 'foo'};
      var source = {bar : 'bar'};

      var result = deepExtend(target, source);

      expect(target).to.equal(result);
    });
  });
})();
