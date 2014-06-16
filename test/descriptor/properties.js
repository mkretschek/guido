(function () {
  'use strict';

  exports = module.exports = {
    ObjectDescriptor : {
      type : 'Object',
      properties : {
        foo : {
          type : 'PropertyDescriptor',
          length : 5
        },
        bar : {
          type : 'PropertyDescriptor',
          length : {
            max : 100
          }
        }
      }
    },

    PropertyDescriptor : {
      type : 'String',
      length : {
        min : 30,
        max : 50
      }
    }
  };
})();
