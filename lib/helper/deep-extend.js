(function () {
  'use strict';

  var deepCopy = require('./deep-copy');
  var isPlainObject = require('./is-plain-object');


  /**
   * Deeply extends the given target object with the properties of the following
   * source objects.
   *
   * Note that the target object WILL be changed. Note also that if a parameter
   * is repeated in the target and in one or more source objects, it will be
   * overriden and the one defined in the latest object passed to the function
   * will prevail.
   *
   * @param {Object} target The object to which the updates should be applied
   *  to.
   * @param {...Object} source Objects from which the parameters should be
   *  taken.
   * @return {Object} The target object (already extended/updated).
   */
  function deepExtend(target) {
    var sources = Array.prototype.slice.apply(arguments, 1);
    var source;
    var val;
    var key, len, i;

    for (i = 0, len = sources.length; i < len; i += 1) {
      source = sources[i];

      for (key in source) {
        if (source.hasOwnProperty(key)) {
          sourceVal = source[key];
          targetVal = target[key];

          if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
            deepExtend(targetVal, sourceVal);
          } else {
            target[key] = Array.isArray(sourceVal) || isPlainObject(sourceVal) ?
              deepCopy(targetVal) :
              targetVal;
          }
        }
      }
    }

    return target;
  }

  exports = module.exports = deepExtend;
})();
