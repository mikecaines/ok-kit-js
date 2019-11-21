/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
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
	var StructUtils = function () {
		throw new Error("Class is abstract.");
	};

	StructUtils.scout = function (aObject, aPath, aSeparator) {
		var separator = aSeparator || '.';
		var steps = (aPath+'').split(separator);
		var i;

		var result = [false, null];

		var node = aObject;
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

		if (!(aObject != null && typeof aObject == 'object')) {
			throw "aObject must be an Object.";
		}

		var node = aObject;
		var i;
		for (i = 0; i < steps.length - 1; i++) {
			if (!(node[steps[i]] != null && typeof node[steps[i]] == 'object' && steps[i] in node)) {
				node[steps[i]] = {};
			}

			node = node[steps[i]];
		}

		node[steps[i]] = aValue;
	};

	StructUtils.pushSet = function (aObject, aPath, aValue, aSeparator) {
		var separator = aSeparator || '.';
		var steps = (aPath+'').split(separator);

		if (!(aObject != null && typeof aObject == 'object')) {
			throw "aObject must be an Object.";
		}

		var node = aObject;
		var i;
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
	
	/**
	 * @param {{}} aStruct
	 * @param {string} aPath
	 * @param {string} aSeparator
	 * @param {boolean=true} aDeep If true, any empty ancestor structures will be removed also.
	 */
	StructUtils.remove = function (aStruct, aPath, aSeparator, aDeep) {
		var separator = aSeparator || '.';
		var deep = aDeep !== undefined ? true==aDeep : true;
		var path, leaf, k;
		
		path = (aPath + '').split(separator);
		leaf = path.pop();
		
		var subStruct = path.length === 0 ? aStruct : this.get(aStruct, path.join(separator));
		
		if (!(subStruct === null || subStruct === undefined)) {
			if (subStruct.constructor === Array) {
				k = parseInt(leaf);
				if (!isNaN(k)) subStruct.splice(k, 1);
				
				if (deep && path.length > 0 && subStruct.length === 0) {
					this.remove(aStruct, path.join(separator), separator, deep);
				}
			}
			else if (subStruct.constructor === Object) {
				delete subStruct['' + leaf];
				if (deep && path.length > 0 && Object.getOwnPropertyNames(subStruct).length === 0) {
					this.remove(aStruct, path.join(separator), separator, deep);
				}
			}
		}
	};
	
	StructUtils.delegate = function (aArray, aPrimaryKey) {
		var map = {};
		var i, len;
		
		for (i = 0, len = aArray.length; i < len; i++) {
			if (aArray[i][aPrimaryKey] in map) throw new Error(
				"Duplicate value found for primary key: '" + aArray[i][aPrimaryKey] + "'."
			);
			
			map[aArray[i][aPrimaryKey]] = aArray[i];
		}
		
		return map;
	};

	StructUtils.merge = function (aObject1, aObject2) {
		var k;
		
		var v1 = StructUtils.isVector(aObject1);
		var v2 = StructUtils.isVector(aObject2);

		if ((v1 && !v2) || (!v1 && v2)) {
			throw "Cannot merge vector and non-vector.";
		}

		var merged = v1 ? [] : {};

		var arr = v2 ? aObject2 : aObject1;
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

	StructUtils.mergeInto = function (aObject1, aObject2) {
		var k;
		
		var v1 = StructUtils.isVector(aObject1);
		var v2 = StructUtils.isVector(aObject2);

		if ((v1 && !v2) || (!v1 && v2)) {
			throw "Cannot merge vector and non-vector.";
		}

		//if aObject2 is a vector, replace contents of aObject1 with contents of aObject2
		if (v2) {
			aObject1.splice(0);
			for (k in aObject2) {
				aObject1[k] = aObject2[k];
			}
		}

		for (k in aObject2) {
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
	 * Converts a deep structure into a shallow one.
	 * Descendant collections are expanded, and top level keys are concatenated.
	 * @param {Object|Array} aObject An object structure.
	 * @param {string} [aSeparator=.] Separator used when concatenating keys.
	 * @returns {Object}
	 */
	StructUtils.flatten = function (aObject, aSeparator) {
		var separator = aSeparator || '.';
		var arr = {};
		var k, v, arrarr, kk;
		
		for (k in aObject) {
			v = aObject[k];
			
			//if scalar
			if (!(v && (v instanceof Array || v.constructor === Object))) {
				arr[k] = v;
			}
			
			else {
				arrarr = this.flatten(v, separator);
				
				for (kk in arrarr) {
					arr[k + separator + kk] = arrarr[kk];
				}
			}
		}
		
		return arr;
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
		var i = 0;
		var k;
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
