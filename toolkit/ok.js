/**
 * {@link http://github.com/mikecaines/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";

if (!('ok' in self)) self.ok = {};

self.ok.findCssRules = function (aRegExp) {
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