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
    return !!(val && val.constructor && val.constructor.name === 'Object');
  }

  exports = module.exports = isPlainObject;
})();
