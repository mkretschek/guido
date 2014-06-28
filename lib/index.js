(function () {
  'use strict';

  var Checker = require('./checker');

  var guido = new Checker();

  guido.Checker = Checker;

  // Expose processors
  guido.processors = require('./processor');
  guido.extend = require('./processor/extend');

  // Expose descriptors
  guido.descriptors = require('./descriptors');
  guido.type = require('./descriptors/type');

  // Default guido instance setup
  guido.use(guido.processors);
  guido.use(guido.descriptors);

  // Expose the default and pre-configured checker
  exports = module.exports = guido;
})();
