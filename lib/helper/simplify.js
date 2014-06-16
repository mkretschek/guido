(function () {
  'use strict';

  var deepExtend = require('./deep-extend');
  var deepCopy = require('./deep-copy');


  function simplifyDescriptors(descriptors, native) {
    var simplified = {};
    var type;

    if (!native) {
      // FIXME(mkretschek): should we default to JS's native types? Or
      // should JS's native types be automatically merged with user-provided
      // natives?
      throw(new Error('Native types not set'));
    }

    function isNative(type) {
      return !!~native.indexOf(type);
    }


    function get(type) {
      return simplified[type] || simplify(descriptors[type]);
    }


    function simplify(descriptor) {
      var simplifiedDescriptor;
      var parentDescriptor;

      if (descriptor.type && !isNative(descriptor.type)) {
        parentDescriptor = get(descriptor.type);

        simplifiedDescriptor = deepExtend(
          {},
          parentDescriptor,
          descriptor
        );

        // Inherit the parent's type
        simplifiedDescriptor.type = parentDescriptor.type;
      } else {
        simplifiedDescriptor = deepCopy(descriptor);
      }

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


  simplifyDescriptors.JAVASCRIPT_NATIVES = [
    'String',
    'Number',
    'Boolean',
    'Object',
    'Array',
    'Function',
    'Date',
    'RegExp',
    'Element',
    'Error'
  ];


  exports = module.exports = simplifyDescriptors;
})();
