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


    // TODO(mkretschek): not sure if this is the desired behavior
    it('defaults to using javascript native types');


    it('returns the simplified object', function () {
      var descriptor = require('../descriptor/simple');
      var simplified = simplify(descriptor, simplify.JAVASCRIPT_NATIVES);
      expect(simplified).to.be.an('object');
    });


    it('simplifies a descriptor object to native types', function () {
      var descriptor = require('../descriptor/simple');

      var simplified = simplify(descriptor, simplify.JAVASCRIPT_NATIVES);

      expect(simplified).to.have.property('Descriptor');
      expect(simplified).to.have.property('ChildDescriptor');
      expect(simplified).to.have.property('GrandChildDescriptor');

      expect(simplified.Descriptor).to.eql(descriptor.Descriptor);

      expect(simplified.ChildDescriptor).to.eql({
        type : 'String',
        length : {
          min : 3,
          max : 15
        },
        value : {
          min : 'bar',
          max : 'baz'
        }
      });

      expect(simplified.GrandChildDescriptor).to.eql({
        type : 'String',
        length : {
          min : 1,
          max : 15
        },
        value : {
          min : 'bar',
          max : 'baz'
        }
      });
    });


    it('simplifies property descriptors', function () {
      var descriptor = require('../descriptor/properties');

      var simplified = simplify(descriptor, simplify.JAVASCRIPT_NATIVES);

      expect(simplified).to.have.property('ObjectDescriptor');
      expect(simplified).to.have.property('PropertyDescriptor');

      expect(simplified.ObjectDescriptor).to.have.property('properties');
      expect(simplified.ObjectDescriptor.properties).to.have.property('foo');
      expect(simplified.ObjectDescriptor.properties).to.have.property('bar');

      expect(simplified.ObjectDescriptor.properties.foo).to.eql({
        type : 'String',
        length : 5
      });

      expect(simplified.ObjectDescriptor.properties.bar).to.eql({
        type : 'String',
        length : {
          min : 30,
          max : 100
        }
      });
    });


    it('simplifies item descriptors', function () {
      var descriptor = require('../descriptor/items');

      var simplified = simplify(descriptor, simplify.JAVASCRIPT_NATIVES);

      expect(simplified).to.have.property('ArrayDescriptor');
      expect(simplified).to.have.property('ItemDescriptor');

      expect(simplified.ArrayDescriptor).to.have.property('items');
      expect(simplified.ArrayDescriptor.items).to.have.length(1);

      expect(simplified.ArrayDescriptor.items[0]).to.eql({
        type : 'String',
        length : 100
      });
    });
  });
})();
