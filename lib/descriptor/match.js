(function () {
  'use strict';

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
    var flags = [];

    if (obj.global) {
      flags.push('g');
    }

    if (obj.multiline) {
      flags.push('m');
    }

    if (obj.ignoreCase) {
      flags.push('i');
    }

    if (obj.sticky) {
      flags.push('y');
    }

    return new RegExp(obj.pattern, flags.join(''));
  }


  // Make sure we allways have a RegExp object in the description
  function matchProcessor(guido, description, callback) {
    var regexp = description && description[KEYWORD];

    if (isPlainObject(regexp)) {
      description[KEYWORD] = getRegExpFromObj(regexp);
    } else if (!(regexp instanceof RegExp)) {
      try {
        // Replace the string with a regular expression
        description[KEYWORD] = new RegExp(regexp);
      } catch (err) {
        // Unable to create a RegExp instance
        return callback(err, null);
      }
    }

    callback(null, description);
  }


  exports = module.exports = function (guido) {
    guido.setProcessor(matchProcessor);
    guido.setDescriptor('match', matchDescriptor);
  };

})();
