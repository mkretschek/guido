
(function () {
  'use strict';


  /**
   * Makes a deep copy of the given object.
   * Note: this is a quick and non-optimal solution, but as this method is
   * supposed to be used only during app initialization, it's good enough for
   * now.
   * @param {*} obj Object to be copied.
   * @return {Object} Deep copy of the given object.
   */
  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  exports = module.exports = deepCopy;
})();
