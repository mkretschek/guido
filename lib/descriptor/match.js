(function () {
  'use strict';

  var isPlainObject = require('../helper/is-plain-object');

  var KEYWORD = 'match';

  var ERROR_MESSAGE = 'Invalid value';
  var ERROR_CODE = 'INVALID_MATCH';


  function matchDescriptor(regexp, val, callback) {
    try {
      if (regexp.test(val)) {
        callback(null, true);
      } else {
        callback(null, false, {
          message : ERROR_MESSAGE,
          code : ERROR_CODE,
          regexp : regexp.toString(),
          value : val
        });
      }
    } catch (err) {
      // There's probably something wrong with the RegExp
      callback(err, null);
    }
  }


  function getRegExpFromObject(obj) {
    var flags;

    if (obj.flags) {
      flags = obj.flags;
    } else {
      flags = '';

      if (obj.global) {
        flags += 'g';
      }

      if (obj.ignoreCase) {
        flags += 'i';
      }

      if (obj.multiline) {
        flags += 'm';
      }
    }

    return new RegExp(obj.pattern, flags);
  }


  // Make sure we allways have a RegExp object in the description
  function matchProcessor(guido, description, callback) {
    var regexp = description && description[KEYWORD];

    if (!(regexp instanceof RegExp)) {
      if (isPlainObject(regexp)) {
        description[KEYWORD] = getRegExpFromObject(regexp);
      } else {
        try {
          // Replace the string with a regular expression
          description[KEYWORD] = new RegExp(regexp);
        } catch (err) {
          // Unable to create a RegExp instance
          return callback(err, null);
        }
      }
    }

    callback(null, description);
  }


  exports = module.exports = function (guido) {
    guido.setProcessor(matchProcessor);
    guido.setDescriptor('match', matchDescriptor);
  };

})();
