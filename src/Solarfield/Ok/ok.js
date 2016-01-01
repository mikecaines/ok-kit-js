/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/ok-kit-js/src/Solarfield/Ok/ok',
			[],
			factory
		);
	}

	else {
		factory();
	}
})
(function () {
	"use strict";

	var Ok = self.Solarfield && Solarfield.Ok ? Solarfield.Ok : {};

	Ok.defineNamespace = function (aNamespace) {
		if (!Ok.objectGet(self, aNamespace)) {
			Ok.objectSet(self, aNamespace, {});
		}
	};

	Ok.objectScout = function (aObject, aPath, aSeparator) {
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

	Ok.objectHas = function (aObject, aPath, aSeparator) {
		return Ok.objectScout(aObject, aPath, aSeparator)[0];
	};

	Ok.objectGet = function (aObject, aPath, aSeparator) {
		return Ok.objectScout(aObject, aPath, aSeparator)[1];
	};

	Ok.objectSet = function (aObject, aPath, aValue, aSeparator) {
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

	Ok.objectMerge = function (aObject1, aObject2) {
		var v1, v2, merged, k, arr;

		v1 = Ok.isVector(aObject1);
		v2 = Ok.isVector(aObject2);

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
				merged[k] = Ok.objectMerge(merged[k], aObject2[k]);
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
	Ok.objectAssign = Object.assign || function (aObject1, aObjectN) {
		var i, k;

		for (i = 1; i < arguments.length; i++) {
			for (k in arguments[i]) {
				aObject1[k] = arguments[i][k];
			}
		}

		return aObject1;
	};

	Ok.object2dIndexOf = function (aObject, aPath, aValue, aStrict) {
		var strict = aStrict != null ? aStrict : false;
		var k, value;

		for (k in aObject) {
			value = Ok.objectGet(aObject[k], aPath);

			if ((strict == false && value == aValue) || (strict == true && value === aValue)) {
				return k;
			}
		}

		return null;
	};

	Ok.object2dFind = function (aObject, aPath, aValue, aStrict) {
		var k = Ok.object2dIndexOf(aObject, aPath, aValue, aStrict);
		return (k !== null) ? aObject[k] : null;
	};

	Ok.isVector = function (aObj) {
		var i, k;

		i = 0;
		for (k in aObj) {
			if (k != i) return false;
			i++;
		}

		return i > 0;
	};

	Ok.strCamelToDash = function (aString) {
		var str;

		str = (aString+'').match(/((?:[A-Z]?[a-z]+)|(?:[0-9]+))/g);
		str = str.join('-');
		str = str.toLowerCase();

		return str;
	};

	Ok.strDashToCamel = function (aString) {
		var str = '';
		var matches, c, i;

		matches = (aString+'').match(/([^\-]+)/gi);

		if (matches) {
			for (i = 0; i < matches.length; i++) {
				c = matches[i].substr(0, 1);

				if (str != '') {
					c = c.toUpperCase();
				}

				str += c + matches[i].substr(1);
			}
		}

		return str;
	};

	Ok.strUpperCaseFirst = function (aString) {
		var str = aString+'';
		return str.substr(0, 1).toUpperCase() + str.substr(1);
	};

	Ok.pregQuote = function (aText) {
		return (''+aText).replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
	};

	Ok.randomInt = function (aMin, aMax) {
		return Math.floor(Math.random() * (aMax - aMin + 1)) + aMin;
	};

	Ok.randomFloat = function (aMin, aMax) {
		return Math.random() * (aMax - aMin) + aMin;
	};

	Ok.randomAdditiveInverse = function () {
		return Ok.randomInt(0, 1) == 0 ? 1 : -1;
	};

	Ok.roundFloat = function (aFloat, aDecimals) {
		var offset = Math.pow(10, aDecimals);
		return Math.round(aFloat * offset) / offset;
	};

	Ok.offsetTop = function (aElement) {
		var offset = 0;
		var el = aElement;

		do {
			offset += el.offsetTop;
		}
		while ((el = el.offsetParent));

		return offset;
	};

	Ok.offsetLeft = function (aElement) {
		var offset = 0;
		var el = aElement;

		do {
			offset += el.offsetLeft;
		}
		while ((el = el.offsetParent));

		return offset;
	};

	/**
	 * @param {RegExp} aRegExp
	 * @param {CSSRule[]=} aRuleList
	 * @returns {Array}
	 */
	Ok.findCssRules = function (aRegExp, aRuleList) {
		function searchRules(aCssRules, aRegExp) {
			var j;
			var matchedRules = [];

			for (j = 0; j < aCssRules.length; j++) {
				if (aCssRules[j].cssRules) {
					matchedRules = matchedRules.concat(searchRules(aCssRules[j].cssRules, aRegExp));
				}

				if (aCssRules[j].cssText) {
					if (aCssRules[j].cssText.search(aRegExp) > -1) {
						matchedRules.push(aCssRules[j]);
					}
				}
			}

			return matchedRules;
		}

		var i, rules, tempRules, j;
		var matchedRules = [];

		if (aRuleList) {
			matchedRules = searchRules(aRuleList, aRegExp);
		}

		else {
			for (i = 0; i < document.styleSheets.length; i++) {
				rules = null;

				//we use try here because the same-origin policy can result in errors on access
				try {rules = document.styleSheets[i].cssRules;}
				catch (ex) {}

				if (rules) {
					tempRules = searchRules(rules, aRegExp);
					for (j = 0; j < tempRules.length; j++) {
						matchedRules.push(tempRules[j]);
					}
				}
			}
		}

		return matchedRules;
	};

	/**
	 * @param {RegExp} aRegExp
	 * @param {CssRule=} aRuleList
	 * @returns {*}
	 */
	Ok.findCssRule = function (aRegExp, aRuleList) {
		var rules = Ok.findCssRules(aRegExp, aRuleList);
		return rules.length > 0 ? rules[0] : null;
	};

	Ok.getAncestorByClassName = function (aElement, aClassName) {
		var ancestor = null;
		var el = aElement;

		while ((el = el.parentElement)) {
			if (el.classList.contains(aClassName)) {
				ancestor = el;
				break;
			}
		}

		return ancestor;
	};

	Ok.getAncestorByTagName = function (aElement, aTagName) {
		var ancestor = null;
		var el = aElement;

		while ((el = el.parentElement)) {
			if (el.tagName == aTagName) {
				ancestor = el;
				break;
			}
		}

		return ancestor;
	};

	Ok.escapeRegExp = function (aString){
		return (aString+'').replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
	};

	/**
	 * Provides inheritance.
	 * @param {Function} aSuperClass
	 * @param {Function|Object=} aSubClass Optional subclass constructor.
	 * @returns {Function} A reference to the subclass constructor.
	 */
	Ok.extendObject = function (aSuperClass, aSubClass) {
		var p, subClass, subMembers, hasSubConstructor;

		if (aSubClass) {
			if ((typeof aSubClass) == 'function') {
				subClass = aSubClass;
				hasSubConstructor = true;
			}

			else {
				if (aSubClass.hasOwnProperty('constructor')) {
					subClass = aSubClass.constructor;
				}

				subMembers = aSubClass;
				delete subMembers.constructor;
			}
		}

		if (!subClass) {
			Ok.extendObject._oeo_counter++;

			subClass = new Function(
				"this._oeo_superClass" + Ok.extendObject._oeo_counter + ".apply(this, arguments);"
			);
		}

		//copy 'static' methods of aSuperClass to aSubClass
		for (p in aSuperClass) {
			if ((typeof aSuperClass[p]) == 'function') {
				subClass[p] = aSuperClass[p];
			}
		}

		subClass.prototype = Object.create(aSuperClass.prototype);
		subClass.prototype.constructor = subClass;
		subClass.super = aSuperClass;

		if (subMembers) {
			for (p in subMembers) {
				subClass.prototype[p] = subMembers[p];
			}
		}

		if (!hasSubConstructor) {
			subClass.prototype['_oeo_superClass' + Ok.extendObject._oeo_counter] = aSuperClass;
		}

		return subClass;
	};
	Ok.extendObject._oeo_counter = -1;

	Ok.cloneObject = function (aObject) {
		return JSON.parse(JSON.stringify(aObject));
	};




	/** @class Solarfield.Ok.HashMap */
	Ok.HashMap = function (aData) {
		this._ohm_data = (aData != null && aData.constructor === Object) ? aData : {};
	};

	Ok.HashMap.prototype.getData = function () {
		return this._ohm_data;
	};

	Ok.HashMap.prototype.get = function (aPath) {
		return Ok.objectGet(this._ohm_data, aPath);
	};

	Ok.HashMap.prototype.getAsString = function (aPath) {
		var value = this.get(aPath);
		if (value == null) value = '';
		else value = value.toString();
		return value;
	};

	Ok.HashMap.prototype.getAsObject = function (aPath) {
		var value = this.get(aPath);
		var isNull = value == null;
		var obj, k;

		if (!isNull) {
			if (value.constructor === Object) {
				obj = value;
			}

			else {
				obj = {};

				for (k in value) {
					obj[k] = value[k];
				}
			}
		}

		else {
			obj = {};
		}

		return obj;
	};

	Ok.HashMap.prototype.getAsArray = function (aPath) {
		var value = this.get(aPath);
		var isNull = value == null;
		var arr, k;

		if (!isNull) {
			if (value.constructor === Array) {
				arr = value;
			}

			else {
				arr = [];

				for (k in value) {
					arr.push(value[k]);
				}
			}
		}

		else {
			arr = [];
		}

		return arr;
	};

	Ok.HashMap.prototype.getAsBool = function (aPath) {
		return this.get(aPath) == true;
	};

	Ok.HashMap.prototype.set = function (aPath, aValue) {
		Ok.objectSet(this._ohm_data, aPath, aValue);
	};

	Ok.defineNamespace('Solarfield.Ok');
	return Solarfield.Ok = Ok;
});
