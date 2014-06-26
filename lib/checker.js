(function () {
  'use strict';

  var _ = require('underscore');
  var async = require('async');

  var defaultDescriptors = require('./descriptor');
  var defaultProcessors = require('./processor');
  var isPlainObject = require('./helper/is-plain-object');
  var createVerifier = require('./helper/create-verifier');
  var load = require('./helper/load');
  var process = require('./helper/process');
  var noop = require('./helper/noop');


  function Checker() {
    if (!(this instanceof Checker)) {
      return new Checker();
    }

    this._descriptors = {};
    this._descriptions = {};
    this._processors = [];
    this._config = {};
    this._verifiers = {};

    this.use(defaultDescriptors);
    this.use(defaultProcessors);
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
      return !~this._keywords.indexOf(keyword);
    },


    registerKeyword : function (keyword) {
      if (!this.usesKeyword(keyword)) {
        this._keywords.push(keyword);
      }

      return this;
    },


    getDescriptor : function (name) {
      return name ?
        this._descriptors[name] :
        this._descriptors;
    },

    setDescriptor : function (name, fn) {
      var key;

      if (typeof name === 'object') {
        for (key in name) {
          if (name.hasOwnProperty(key)) {
            this.addDescriptor(name, name[key]);
          }
        }
        return;
      }

      if (!this.config('silent') && this.usesKeyword(name)) {
        console.warn('Overriding existing keyword:', name);
      }

      this._descriptors[name] = fn;
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


    getVerifier : function (name) {
      return name ?
        this._verifiers[name] :
        this._verifiers;
    },

    setVerifier : function (name, fn) {
      if (typeof fn === 'function') {
        this._verifiers[name] = fn;
      }

      return this;
    },

    getDescription : function (name) {
      return name ?
        this._descriptions[name] :
        this._descriptions;
    },

    setDescription : function (name, description, callback) {
      callback = callback || noop;

      if (!isPlainObject(description)) {
        return callback(new Error('Description must be an object'));
      }

      var self = this;

      process(this, description, function (err, result) {
        if (err) { return callback(err, null); }

        var fn = createVerifier(result, self._descriptors);
        self._descriptions[name] = result;
        self.setVerifier(name, fn);
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
