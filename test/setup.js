/**
 * Setup code for the test environment.
 */

(function () {
  'use strict';

  var chai = require('chai');
  var sinonChai = require('sinon-chai');

  /** Sets sinon-related assertions into Chai's should and expect APIs. */
  chai.use(sinonChai);
})();
