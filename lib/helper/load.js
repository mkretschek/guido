(function () {
  'use strict';

  var _ = require('underscore');
  var glob = require('glob');


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


  function load(path) {
    var filenames = getFilenames(path);
    var formats = {};
    var len, i;

    for (i = 0, len = filenames.length; i < len; i += 1) {
      // FIXME(mkretschek): make this a deep extend
      _.extend(formats, require(filenames[i]));
    }

    return formats;
  }


  exports = module.exports = load;
})();
