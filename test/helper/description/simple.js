(function () {
  'use strict';

  exports = module.exports = {
    Descriptor : {
      type : 'String',
      length : 10,
      value : {
        min : 'bar'
      }
    },

    ChildDescriptor : {
      type : 'Descriptor',
      length : {
        min : 3,
        max : 15
      },
      value : {
        max : 'baz'
      }
    },

    GrandChildDescriptor : {
      type : 'ChildDescriptor',
      length : {
        min : 1
      }
    }
  };
})();
