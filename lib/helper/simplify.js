(function () {
  'use strict';

  var _ = require('underscore');

  var deepExtend = require('./helper/deep-extend');
  var deepCopy = require('./helper/deep-copy');


  function simplifyDescriptors(descriptors, native) {
    var simplified = {};
    var type;


    function isNative(type) {
      return !!~native.indexOf(type);
    }


    function get(type) {
      return simplified[type] || simplify(descriptors[type]);
    }


    function simplify(descriptor) {
      var simplifiedDescriptor;

      simplifiedDescriptor = descriptor.type && !isNative(descriptor.type) ?
        deepExtend({}, get(descriptor.type), descriptor) :
        deepCopy(descriptor);

      simplifyProperties(simplifiedDescriptor.properties);
      simplifyItems(simplifiedDescriptor.items);

      return simplifiedDescriptor;
    }


    function simplifyProperties(properties) {
      var key;

      if (properties) {
        for (key in properties) {
          if (properties.hasOwnProperty(key)) {
            properties[key] = simplify(properties[key]);
          }
        }
      }

      return properties;
    }


    function simplifyItems(items) {
      var len, i;

      if (items) {
        for (i = 0, len = items.length; i < len; i += 1) {
          items[i] = simplify(items[i]);
        }
      }

      return items;
    }


    for (type in descriptors) {
      if (descriptors.hasOwnProperty(type)) {
        simplified[type] = get(type);
      }
    }

    return simplified;
  }


  exports = module.exports = simplifyDescriptors;
})();
