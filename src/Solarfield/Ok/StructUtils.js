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
	 * @class StructUtils
	 */
	const StructUtils = function () {
		throw new Error("Class is abstract.");
	};

	StructUtils.scout = function (aObject, aPath, aSeparator) {
		const separator = aSeparator || '.';
		const steps = (aPath+'').split(separator);

		let result = [false, null];

		let node = aObject;
		for (let i = 0; i < steps.length; i++) {
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
		const separator = aSeparator || '.';
		const steps = (aPath+'').split(separator);

		if (!(aObject != null && typeof aObject == 'object')) {
			throw "aObject must be an Object.";
		}

		let node = aObject;
		let i;
		for (i = 0; i < steps.length - 1; i++) {
			if (!(node[steps[i]] != null && typeof node[steps[i]] == 'object' && steps[i] in node)) {
				node[steps[i]] = {};
			}

			node = node[steps[i]];
		}

		node[steps[i]] = aValue;
	};

	StructUtils.pushSet = function (aObject, aPath, aValue, aSeparator) {
		const separator = aSeparator || '.';
		const steps = (aPath+'').split(separator);

		if (!(aObject != null && typeof aObject == 'object')) {
			throw "aObject must be an Object.";
		}

		let node = aObject;
		let i;
		for (i = 0; i < steps.length - 1; i++) {
			if (!(node[steps[i]] != null && typeof node[steps[i]] == 'object' && steps[i] in node)) {
				node[steps[i]] = {};
			}

			node = node[steps[i]];
		}

		if (!(node[steps[i]] && node[steps[i]] instanceof Array)) {
			node[steps[i]] = [];
		}

		node[steps[i]].push(aValue);
	};

	StructUtils.merge = function (aObject1, aObject2) {
		const v1 = StructUtils.isVector(aObject1);
		const v2 = StructUtils.isVector(aObject2);

		if ((v1 && !v2) || (!v1 && v2)) {
			throw "Cannot merge vector and non-vector.";
		}

		const merged = v1 ? [] : {};

		const arr = v2 ? aObject2 : aObject1;
		for (let k in arr) {
			merged[k] = arr[k];
		}

		for (let k in aObject2) {
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

	StructUtils.mergeInto = function (aObject1, aObject2) {
		const v1 = StructUtils.isVector(aObject1);
		const v2 = StructUtils.isVector(aObject2);

		if ((v1 && !v2) || (!v1 && v2)) {
			throw "Cannot merge vector and non-vector.";
		}

		//if aObject2 is a vector, replace contents of aObject1 with contents of aObject2
		if (v2) {
			aObject1.splice(0);
			for (let k in aObject2) {
				aObject1[k] = aObject2[k];
			}
		}

		for (let k in aObject2) {
			if (
				(k in aObject1)
				&& aObject1[k] != null
				&& (aObject1[k] instanceof Object)
				&& aObject2[k] != null
				&& (aObject2[k] instanceof Object)
			) {
				aObject1[k] = StructUtils.merge(aObject1[k], aObject2[k]);
			}

			else {
				aObject1[k] = aObject2[k];
			}
		}
	};

	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	 * @type {Function}
	 */
	StructUtils.assign = Object.assign || function (aObject1, aObjectN) {
		for (let i = 1; i < arguments.length; i++) {
			for (let k in arguments[i]) {
				aObject1[k] = arguments[i][k];
			}
		}

		return aObject1;
	};

	StructUtils.search = function (aObject, aPath, aValue, aStrict) {
		const strict = aStrict != null ? aStrict : false;

		for (let k in aObject) {
			const value = StructUtils.get(aObject[k], aPath);

			if ((strict == false && value == aValue) || (strict == true && value === aValue)) {
				return k;
			}
		}

		return null;
	};

	StructUtils.find = function (aObject, aPath, aValue, aStrict) {
		const k = StructUtils.search(aObject, aPath, aValue, aStrict);
		return (k !== null) ? aObject[k] : null;
	};

	StructUtils.isVector = function (aObj) {
		let i = 0;
		for (let k in aObj) {
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
