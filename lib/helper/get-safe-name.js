(function () {
  'use strict';

  /**
   * Generates a safer name for the descriptors to avoid clashing with native
   * properties, such as with the 'constructor' keyword that always returns the
   * native `Object` constructor in the descriptions.
   *
   * @param {string} name A keyword, or any string, in fact.
   * @return {string} A safer version of that name, that is expected not to be
   *  part of the native JavaScript API.
   */
  exports = module.exports = function (name) {
    return '_' + name;
  };
})();
