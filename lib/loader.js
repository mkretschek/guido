(function () {
  'use strict';

  var _ = require('underscore');
  var glob = require('glob');

  var deepExtend = require('./helper/deep-extend');
  var deepCopy = require('./helper/deep-copy');


  // Makes `require()` parse YAML files
  require('js-yaml');


  function getFilenames(path) {
    if (arguments.length > 1) {
      return getFilenames(Array.prototype.slice.call(arguments, 0));
    }

    if (Array.isArray(path)) {
      path = _.flatten(path);
      return _.flatten(_.map(path, getFilenames));
    }

    if (typeof path === 'string') {
      return glob.sync(path);
    }

    return [];
  }


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
    }


    for (type in descriptors) {
      if (descriptors.hasOwnProperty(type)) {
        simplified[type] = get(type);
      }
    }

    return simplified;
  }


  function loadFormats(path) {
    var filenames = getFilenames(path);
    var formats = {};
    var len, i;

    for (i = 0, len = filenames.length; i < len; i += 1) {
      // FIXME(mkretschek): make this a deep extend
      _.extend(formats, require(filenames[i]));
    }

    return formats;
  }


  function Loader(native) {
    if (!(this instanceof Loader)) {
      return new Loader(native);
    }

    this._native = native;
    this._descriptors = {};
  }


  Loader.prototype = {
    load : function (path) {
      var descriptors = loadFormats(path) || {};
      this._descriptors = simplifyDescriptors(descriptors, this._native);
      return this._descriptors;
    }
  };


  exports = module.exports = Loader;
})();
