/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			[],
			factory
		);
	}

	else {
		factory(true);
	}
})
(function (_createGlobals) {
	"use strict";

	var ObjectUtils = function () {
		throw new Error("Class is abstract.");
	};

	ObjectUtils.defineNamespace = (function () {
		function h(aObject, aPath) {
			var steps = (aPath+'').split('.');
			var node, i;

			node = aObject;
			for (i = 0; i < steps.length; i++) {
				if (node != null && typeof node == 'object' && steps[i] in node) {
					if (i == steps.length - 1) {
						return true;
					}

					else {
						node = node[steps[i]];
					}
				}

				else {
					break;
				}
			}

			return false;
		}

		function s(aObject, aPath) {
			var steps = (aPath+'').split('.');
			var node, i;

			if (!(aObject != null && typeof aObject == 'object')) {
				throw "aObject must be an Object.";
			}

			node = aObject;
			for (i = 0; i < steps.length - 1; i++) {
				if (!(node[steps[i]] != null && typeof node[steps[i]] == 'object' && steps[i] in node)) {
					node[steps[i]] = {};
				}

				node = node[steps[i]];
			}

			node[steps[i]] = {};
		}

		return function (aNamespace) {
			if (!h(self, aNamespace)) {
				s(self, aNamespace);
			}
		}
	})();

	/**
	 * Provides inheritance.
	 * @param {Function} aSuperClass
	 * @param {Function|Object=} aSubClass Optional subclass constructor.
	 * @returns {Function} A reference to the subclass constructor.
	 */
	ObjectUtils.extend = function (aSuperClass, aSubClass) {
		var p, subClass, subMembers, hasSubConstructor;

		if (aSubClass) {
			if ((typeof aSubClass) == 'function') {
				subClass = aSubClass;
				hasSubConstructor = true;
			}

			else {
				if (aSubClass.hasOwnProperty('constructor')) {
					subClass = aSubClass.constructor;
					hasSubConstructor = true;
				}

				subMembers = aSubClass;
				delete subMembers.constructor;
			}
		}

		if (!subClass) {
			ObjectUtils.extend._oeo_counter++;

			subClass = new Function(
				aSuperClass ? "this._oeo_superClass" + ObjectUtils.extend._oeo_counter + ".apply(this, arguments);" : ''
			);
		}

		if (aSuperClass) {
			//copy 'static' methods of aSuperClass to aSubClass
			for (p in aSuperClass) {
				if ((typeof aSuperClass[p]) == 'function') {
					subClass[p] = aSuperClass[p];
				}
			}

			subClass.prototype = Object.create(aSuperClass.prototype);
			subClass.prototype.constructor = subClass;
			subClass.super = aSuperClass;
		}

		else {
			subClass.super = Object;
		}

		if (subMembers) {
			for (p in subMembers) {
				subClass.prototype[p] = subMembers[p];
			}
		}

		if (!hasSubConstructor) {
			subClass.prototype['_oeo_superClass' + ObjectUtils.extend._oeo_counter] = aSuperClass;
		}

		return subClass;
	};
	ObjectUtils.extend._oeo_counter = -1;

	ObjectUtils.clone = function (aObject) {
		return JSON.parse(JSON.stringify(aObject));
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.ObjectUtils = ObjectUtils;
	}

	return ObjectUtils;
});
