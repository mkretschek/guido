(function () {
  'use strict';

  var deepExtend = require('../helper/deep-extend');
  var deepCopy = require('../helper/deep-copy');

  var KEYWORD = 'extend';


  function getBaseName(description) {
    return description[KEYWORD];
  }


  function hasBase(description) {
    return !!getBaseName(description);
  }


  function extend(guido, description, callback) {

    function getBase(name) {
      var base = guido.getDescription(name);

      if (!base) {
        throw(new Error('Base description not found: ' + name));
      }

      return base;
    }

    var baseName;
    var base;

    if (hasBase(description)) {
      baseName = getBaseName(description);
      try {
        base = deepCopy(getBase(baseName));
      } catch (err) {
        return callback(err, null);
      }

      description = deepExtend({}, base, description);
    }

    callback(null, description);
  }


  exports = module.exports = function (guido) {
    guido.setProcessor(extend);
  };

})();
