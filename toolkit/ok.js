/**
 * {@link http://github.com/mikecaines/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";

var ok = ok || {};

ok.objectGet = function (aObject, aPath, aSeparator) {
	var separator = aSeparator || '.';
	var steps = (aPath+'').split(separator);
	var node, i;

	node = aObject;
	for (i = 0; i < steps.length; i++) {
		if (node != null && typeof node == 'object' && steps[i] in node) {
			if (i == steps.length - 1) {
				return node[steps[i]];
			}

			else {
				node = node[steps[i]];
			}
		}

		else {
			break;
		}
	}

	return null;
};

ok.objectSet = function (aObject, aPath, aValue, aSeparator) {
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

ok.objectMerge = function (aObject1, aObject2) {
	var v1, v2, merged, k, arr;

	v1 = ok.isVector(aObject1);
	v2 = ok.isVector(aObject2);

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
			merged[k] = ok.objectMerge(merged[k], aObject2[k]);
		}

		else {
			merged[k] = aObject2[k];
		}
	}

	return merged;
};

ok.isVector = function (aObj) {
	var i, k;

	i = 0;
	for (k in aObj) {
		if (k != i) return false;
		i++;
	}

	return i > 0;
};

ok.strCamelToDash = function (aString) {
	var str;

	str = (aString+'').match(/((?:[A-Z]?[a-z]+)|(?:[0-9]+))/g);
	str = str.join('-');
	str = str.toLowerCase();

	return str;
};

ok.strDashToCamel = function (aString) {
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

ok.strUpperCaseFirst = function (aString) {
	var str = aString+'';
	return str.substr(0, 1).toUpperCase() + str.substr(1);
};

ok.pregQuote = function (aText) {
	return (''+aText).replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
};

ok.randomInt = function (aMin, aMax) {
	return Math.floor(Math.random() * (aMax - aMin + 1)) + aMin;
};

ok.randomFloat = function (aMin, aMax) {
	return Math.random() * (aMax - aMin) + aMin;
};

ok.roundFloat = function (aFloat, aDecimals) {
	var offset = Math.pow(10, aDecimals);
	return Math.round(aFloat * offset) / offset;
};

ok.offsetTop = function (aElement) {
	var offset = 0;
	var el = aElement;

	do {
		offset += el.offsetTop;
	}
	while ((el = el.offsetParent));

	return offset;
};

ok.offsetLeft = function (aElement) {
	var offset = 0;
	var el = aElement;

	do {
		offset += el.offsetLeft;
	}
	while ((el = el.offsetParent));

	return offset;
};

ok.searchCssRules = function (aRegExp) {
	function searchRules(aCssRules, aRegExp) {
		var j;
		var matchedRules = [];

		for (j = 0; j < aCssRules.length; j++) {
			if (aCssRules[j].cssRules) {
				matchedRules = matchedRules.concat(searchRules(aCssRules[j].cssRules, aRegExp));
			}

			else {
				if (aCssRules[j].cssText.match(aRegExp)) {
					matchedRules.push(aCssRules[j]);
				}
			}
		}

		return matchedRules;
	}

	var i, rules;
	var matchedRules = [];

	for (i = 0; i < document.styleSheets.length; i++) {
		rules = null;

		//we use try here because the same-origin policy can result in errors on access
		try {rules = document.styleSheets[i].cssRules;}
		catch (ex) {}

		if (rules) {
			matchedRules = searchRules(rules, aRegExp);
		}
	}

	return matchedRules;
};

ok.getAncestorByClassName = function (aElement, aClassName) {
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

ok.getAncestorByTagName = function (aElement, aTagName) {
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

/**
 * Provides inheritance.
 * @param {Function} aSuperClass
 * @param {Function=} aSubClass Optional subclass constructor.
 * @returns {Function} A reference to the subclass constructor.
 */
ok.extendObject = function (aSuperClass, aSubClass) {
	var p, subClass;

	if (aSubClass) {
		subClass = aSubClass;
	}

	else {
		ok.extendObject._oeo_counter++;

		subClass = new Function(
			"this._oeo_superClass" + ok.extendObject._oeo_counter + ".apply(this, arguments);"
		);
	}

	//copy 'static' members of aSuperClass to aSubClass
	for (p in aSuperClass) {
		subClass[p] = aSuperClass[p];
	}

	subClass.prototype = Object.create(aSuperClass.prototype);
	subClass.prototype.constructor = subClass;

	if (!aSubClass) {
		subClass.prototype['_oeo_superClass' + ok.extendObject._oeo_counter] = aSuperClass;
	}

	return subClass;
};
ok.extendObject._oeo_counter = -1;

ok.cloneObject = function (aObject) {
	return JSON.parse(JSON.stringify(aObject));
};




/** @class ok.HashMap */
ok.HashMap = function (aData) {
	this._ohm_data = (aData != null && aData.constructor === Object) ? aData : {};
};

ok.HashMap.prototype.getData = function () {
	return this._ohm_data;
};

ok.HashMap.prototype.get = function (aPath) {
	return ok.objectGet(this._ohm_data, aPath);
};

ok.HashMap.prototype.getAsString = function (aPath) {
	var value = this.get(aPath);
	if (value == null) value = '';
	else value = value.toString();
	return value;
};

ok.HashMap.prototype.getAsObject = function (aPath) {
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

ok.HashMap.prototype.getAsArray = function (aPath) {
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

ok.HashMap.prototype.getAsBool = function (aPath) {
	return this.get(aPath) == true;
};

ok.HashMap.prototype.set = function (aPath, aValue) {
	ok.objectSet(this._ohm_data, aPath, aValue);
};
