/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok.ObjectUtils,
			true
		);
	}
})
(function (ObjectUtils, _createGlobals) {
	"use strict";

	/**
	 * @class Solarfield.Ok.StructUtils
	 */
	var StructUtils = function () {
		throw new Error("Class is abstract.");
	};

	StructUtils.scout = function (aObject, aPath, aSeparator) {
		var separator = aSeparator || '.';
		var steps = (aPath+'').split(separator);
		var node, i, result;

		result = [false, null];

		node = aObject;
		for (i = 0; i < steps.length; i++) {
			if (node != null && typeof node == 'object' && steps[i] in node) {
				if (i == steps.length - 1) {
					result = [true, node[steps[i]]];
					break;
				}

				else {
					node = node[steps[i]];
				}
			}

			else {
				break;
			}
		}

		return result;
	};

	StructUtils.has = function (aObject, aPath, aSeparator) {
		return StructUtils.scout(aObject, aPath, aSeparator)[0];
	};

	StructUtils.get = function (aObject, aPath, aSeparator) {
		return StructUtils.scout(aObject, aPath, aSeparator)[1];
	};

	StructUtils.set = function (aObject, aPath, aValue, aSeparator) {
		var separator = aSeparator || '.';
		var steps = (aPath+'').split(separator);
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

		node[steps[i]] = aValue;
	};

	StructUtils.merge = function (aObject1, aObject2) {
		var v1, v2, merged, k, arr;

		v1 = StructUtils.isVector(aObject1);
		v2 = StructUtils.isVector(aObject2);

		if ((v1 && !v2) || (!v1 && v2)) {
			throw "Cannot merge vector and non-vector.";
		}

		merged = v1 ? [] : {};

		arr = v2 ? aObject2 : aObject1;
		for (k in arr) {
			merged[k] = arr[k];
		}

		for (k in aObject2) {
			if (
				(k in merged)
				&& merged[k] != null
				&& (merged[k] instanceof Object)
				&& aObject2[k] != null
				&& (aObject2[k] instanceof Object)
			) {
				merged[k] = StructUtils.merge(merged[k], aObject2[k]);
			}

			else {
				merged[k] = aObject2[k];
			}
		}

		return merged;
	};

	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	 * @type {Function}
	 */
	StructUtils.assign = Object.assign || function (aObject1, aObjectN) {
			var i, k;

			for (i = 1; i < arguments.length; i++) {
				for (k in arguments[i]) {
					aObject1[k] = arguments[i][k];
				}
			}

			return aObject1;
		};

	StructUtils.search = function (aObject, aPath, aValue, aStrict) {
		var strict = aStrict != null ? aStrict : false;
		var k, value;

		for (k in aObject) {
			value = StructUtils.get(aObject[k], aPath);

			if ((strict == false && value == aValue) || (strict == true && value === aValue)) {
				return k;
			}
		}

		return null;
	};

	StructUtils.find = function (aObject, aPath, aValue, aStrict) {
		var k = StructUtils.search(aObject, aPath, aValue, aStrict);
		return (k !== null) ? aObject[k] : null;
	};

	StructUtils.isVector = function (aObj) {
		var i, k;

		i = 0;
		for (k in aObj) {
			if (k != i) return false;
			i++;
		}

		return i > 0;
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.StructUtils = StructUtils;
	}

	return StructUtils;
});
