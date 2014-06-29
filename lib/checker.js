(function () {
  'use strict';

  var _ = require('underscore');
  var async = require('async');

  var isPlainObject = require('./helper/is-plain-object');
  var createValidator = require('./helper/create-validator');
  var load = require('./helper/load');
  var process = require('./helper/process');
  var noop = require('./helper/noop');
  var getSafeName = require('./helper/get-safe-name');


  function Checker() {
    if (!(this instanceof Checker)) {
      return new Checker();
    }

    this._descriptors = {};
    this._descriptions = {};
    this._processors = [];
    this._config = {};
    this._verifiers = {};
    this._keywords = [];
  }



  Checker.prototype = {
    
    use : function (fn) {
      if (typeof fn === 'function') {
        fn.call(this, this);
      } else {
        throw(new Error('guido cannot use ' + fn));
      }

      return this;
    },


    config : function (setting, value) {
      if (arguments.length === 1) {
        return this._config[setting];
      }

      this._config[setting] = value;
      return this;
    },


    usesKeyword : function (keyword) {
      return !!~this._keywords.indexOf(keyword);
    },


    registerKeyword : function (keyword) {
      if (!this.usesKeyword(keyword)) {
        this._keywords.push(keyword);
      }

      return this;
    },

    getDescriptor : function (name) {
      return name ?
        this._descriptors[getSafeName(name)] :
        this._descriptors;
    },

    setDescriptor : function (name, fn) {
      var key;
      var safeName = getSafeName(name);

      if (typeof name === 'object') {
        for (key in name) {
          if (name.hasOwnProperty(key)) {
            this.setDescriptor(key, name[key]);
          }
        }
        return;
      }

      if (!this.config('silent') && this.usesKeyword(name)) {
        console.warn('Overriding existing keyword:', name);
      }

      this._descriptors[safeName] = fn;
      this.registerKeyword(name);

      return this;
    },


    getProcessor : function (index) {
      return arguments.length ?
        this._processors[index] :
        this._processors;
    },


    setProcessor : function (fn) {
      if (!~this._processors.indexOf(fn)) {
        this._processors.push(fn);
      }

      return this;
    },

    getDescription : function (name) {
      return name ?
        this._descriptions[name] :
        this._descriptions;
    },


    validate : function (name, value, callback) {
      var validator = this.validate[name];

      if (!validator) {
        var err = new Error('Description not found: ' + name);
        return callback(err, false, null);
      }

      return validator(value, callback);
    },


    setValidator : function (name) {
      this.validate[name] = createValidator(this, name);
      return this;
    },


    setDescription : function (name, description, callback) {
      callback = callback || noop;

      if (!isPlainObject(description)) {
        return callback(new Error('Description must be an object'));
      }

      var self = this;

      process(this, description, function (err, result) {
        if (err) { return callback(err); }

        self._descriptions[name] = result;
        self.setValidator(name);
        callback(null);
      });
    },


    load : function (path, callback) {
      var self = this;

      load(path, function (err, descriptions) {
        if (err) { return callback(err, null); }

        var tasks = _.map(descriptions, function (description, name) {
          return function (done) {
            self.addDescription(name, description, done);
          };
        });


        async.series(tasks, function (err) {
          if (err) { return callback(err, null); }
          callback(null, descriptions);
        });

        return this;
      });
    }
  };

  exports = module.exports = Checker;
})();
