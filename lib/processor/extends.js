(function () {
  'use strict';

  var deepExtend = require('../helper/deep-extend');

  var KEYWORD = 'extends';


  function getSuperName(description) {
    return description[KEYWORD];
  }


  function hasSuper(description) {
    return !!getSuperName(description);
  }


  function process(descriptions, callback) {

    function getSuper(name) {
      var super = descriptions[name];

      if (!super) {
        throw(new Error('Super description not found: ' + name));
      }

      return super;
    }


    var key;
    var description;
    var superName;
    var super;

    for (key in descriptions) {
      if (descriptions.hasOwnProperty(key)) {
        description = descriptions[key];

        if (hasSuper(description)) {
          superName = getSuperName(description);

          try {
            super = getSuper(superName);
          } catch (err) {
            callback(err, null);
          }

          descriptions[key] = deepExtend({}, super, description);
        }
      }
    }

    callback(null, descriptions);
  }


  exports = module.exports = function (guido) {
    guido.addProcessor(process);
  };

})();
