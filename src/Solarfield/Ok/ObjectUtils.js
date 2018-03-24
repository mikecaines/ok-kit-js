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
	 * Automates class-like inheritance, for browsers that do not support the native 'class' statement.
	 * Classes created via this function, can be extended by native classes, and vice-versa.
	 * The constructor of the created class, will have a 'super' property, mimicking the native 'super' statement.
	 *
	 * @param {Function} aParentConstructor - The constructor function of the parent/super class.
	 *
	 * @param {Function|Object=} aChild - The child/sub class definition.
	 *  If this is a function, it is considered the constructor of the child class.
	 *  If this is an object, it is considered a collection of properties to be assigned to the child class's prototype.
	 *  The object may contain an optional 'constructor' property, which will be considered the constructor of the child
	 *  class.
	 *
	 * @returns {Function} The constructor function of the new child class.
	 */
	ObjectUtils.extend = function (aParentConstructor, aChild) {
		var p, childConstructor, childProperties, hasChildConstructor;

		if (aChild) {
			if ((typeof aChild) == 'function') {
				childConstructor = aChild;
				hasChildConstructor = true;
			}

			else {
				if (aChild.hasOwnProperty('constructor')) {
					childConstructor = aChild.constructor;
					hasChildConstructor = true;
				}

				childProperties = aChild;
				delete childProperties.constructor;
			}
		}

		if (!childConstructor) {
			//create an implied constructor, which just calls the parent
			
			ObjectUtils.extend._oeo_counter++;

			childConstructor = new Function(
				aParentConstructor ? "this._oeo_superClass" + ObjectUtils.extend._oeo_counter + ".apply(this, arguments);" : ''
			);
		}

		if (aParentConstructor) {
			//copy 'static' methods of aParentConstructor to aChild
			for (p in aParentConstructor) {
				if ((typeof aParentConstructor[p]) == 'function') {
					childConstructor[p] = aParentConstructor[p];
				}
			}

			childConstructor.prototype = Object.create(aParentConstructor.prototype);
			childConstructor.prototype.constructor = childConstructor;
			childConstructor.super = aParentConstructor;
		}

		else {
			childConstructor.super = Object;
		}

		if (childProperties) {
			for (p in childProperties) {
				childConstructor.prototype[p] = childProperties[p];
			}
		}

		if (!hasChildConstructor) {
			childConstructor.prototype['_oeo_superClass' + ObjectUtils.extend._oeo_counter] = aParentConstructor;
		}

		return childConstructor;
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
