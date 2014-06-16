(function () {
  'use strict';

  exports = module.exports = {
    ArrayDescriptor : {
      type : 'Array',
      items : [{
        type : 'ItemDescriptor',
        length : 100
      }]
    },

    ItemDescriptor : {
      type : 'String',
      length : 5
    }
  };
})();
