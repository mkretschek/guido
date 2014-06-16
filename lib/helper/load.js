(function () {
  'use strict';

  var _ = require('underscore');
  var glob = require('glob');

  var deepExtend = require('./deep-extend');


  // Makes `require()` parse YAML files
  require('js-yaml');


  function getFilenames(path) {
    if (typeof path !== 'string' && path.length) {
      path = _.flatten(path);
      return _.flatten(_.map(path, function (p) {
        return getFilenames(p);
      }));
    }

    if (typeof path === 'string') {
      return glob.sync(path);
    }

    return [];
  }


  function load(path) {
    if (arguments.length > 1) {
      path = Array.prototype.slice.call(arguments, 0);
    }

    var filenames = getFilenames(path);
    var formats = {};
    var len, i;

    for (i = 0, len = filenames.length; i < len; i += 1) {
      deepExtend(formats, require(filenames[i]));
    }

    return formats;
  }


  exports = module.exports = load;
})();
