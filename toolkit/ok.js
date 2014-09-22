/**
 * {@link http://github.com/mikecaines/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";

var ok = ok || {};

ok.extendObject = function (aSubClass, aSuperClass) {
	var p;

	aSubClass.prototype = new aSuperClass(aSuperClass);

	aSubClass.prototype.constructor = aSubClass;

	//copy 'static' members of aSuperClass to aSubClass
	for (p in aSuperClass) {
		aSubClass[p] = aSuperClass[p];
	}
};

ok.findCssRules = function (aRegExp) {
	var i, j, rules;
	var matchedRules = [];

	for (i = 0; i < document.styleSheets.length; i++) {
		try {rules = document.styleSheets[i].cssRules;}
		catch (ex) {rules = [];}

		for (j = 0; j < rules.length; j++) {
			if (rules[j].cssText.match(aRegExp)) {
				matchedRules.push(rules[j]);
			}
		}
	}

	return matchedRules;
};