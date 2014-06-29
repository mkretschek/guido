(function () {
  'use strict';


  /**
   * Checks if the object is a plain-old javascript object (not created with any
   * constructor other than {@code Object}).
   * @param {*} val Value to be checked.
   * @return {Boolean}
   * @private
   */
  function isPlainObject(val) {
    if (val instanceof Object) {
      var proto = Object.getPrototypeOf(val);
      return !!(proto.constructor && proto.constructor.name === 'Object');
    }

    return false;
  }

  exports = module.exports = isPlainObject;
})();
