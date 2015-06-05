(function(exports) {
	'use strict';

	var _unloaded = {};
	var _loaded = {};

	//for just loading a function, not for other modules to depend on
	function require() {
		_registerModule(arguments, true);
	}

	//for defining a module that other modules can depend on. 
	function define() {
		_registerModule(arguments, false);
	}

	function _registerModule(args, defined) {

		args = _parseArguments(args, defined);
		if (_undefined(args.callback)) throw new Error('Callback is mandatory');
		if (_undefined(args.name)) throw new Error('Name is mandatory');
		if (_defined(_getModule(args.name))) throw new Error('This module is registered.');
		_unloaded[args.name] = args;

		_execute();
	}

	function _clear() {
		_unloaded = {};
		_loaded = {};
	}

	function _parseArguments(args, defined) {
		var out = {};
		args = Array.prototype.slice.call(args);
		if (_isString(args[0])) out.name = args[0];
		if (_isFunction(args[1])) out.callback = args[1];
		if (_isFunction(args[2])) out.callback = args[2];
		if (_isFunction(args[3])) out.callback = args[3];
		if (_isBoolean(args[1])) out.private = args[1];
		if (_isBoolean(args[2])) out.private = args[2];
		if (_isBoolean(args[3])) out.private = args[3];
		if (_isArray(args[1])) out.deps = args[1];
		if (_isArray(args[2])) out.deps = args[2];
		if (_isArray(args[3])) out.deps = args[3];
		out.defined = defined;

		return _defaults(out);
	}

	function _defaults(obj) {
		obj.private = obj.private || false;
		obj.deps = obj.deps || [];
		obj.result = null;
		return obj;
	}

	function _execute() {
		for (var m in _unloaded) {
			if (_unloaded.hasOwnProperty(m)) {
				var execute = true;
				var mod = _unloaded[m];
				var deps = [];
				for (var i = 0; i < mod.deps.length; i++) {
					var dep = mod.deps[i];

					if (_privacyMismatch(mod.name, dep)) {
						throw new Error('Privacy mismatch: ' + mod.name + ' - ' + dep);
					}

					if (_undefined(_loaded[dep])) {
						execute = false;
					} else {
						if (!_moduleCanBeUsed(dep)) {
							throw new Error(dep + ' is required, not defined, and cannot be used as a dependent');
						} else {
							deps.push(_loaded[dep].result);
						}
					}
				}

				if (execute === true) {
					mod.result = (deps.length > 0) ? mod.callback.apply(null, deps) : mod.callback();
					_loaded[mod.name] = mod;
					delete _unloaded[mod.name];
					_execute();
				}

			}
		}
	}

	function _moduleCanBeUsed(mod) {
		var dep = _getModule(mod) || {};
		return dep.defined || false;
	}

	function _privacyMismatch(mod, dep) {
		var same = _getNamespace(mod) === _getNamespace(dep);
		if (same === false) {
			var dependent = _getModule(dep);
			return dependent.private || false;
		} else {
			return false;
		}
	}

	function _getNamespace(name) {
		var parts = name.split('.');
		parts.pop();
		return parts.join('.');
	}

	function _getModule(name) {
		return _loaded[name] || _unloaded[name];
	}

	function _defined(variable) {
		return !_undefined(variable);
	}

	function _undefined(variable) {
		return typeof variable === 'undefined';
	}

	function _isString(variable) {
		return (variable) ? typeof variable === 'string' : false;
	}

	function _isFunction(variable) {
		return (variable) ? typeof variable === 'function' : false;
	}

	function _isBoolean(variable) {
		return (variable) ? typeof variable === 'boolean' : false;
	}

	function _isArray(variable) {
		return (variable) ? variable instanceof Array : false;
	}

	define.clear = require.clear = _clear;
	exports.define = define;
	exports.require = require;
})(window);