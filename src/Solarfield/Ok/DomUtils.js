/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/ok-kit-js/src/Solarfield/Ok/DomUtils',
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

	var DomUtils = function () {
		throw new Error("Class is abstract.");
	};

	DomUtils.offsetTop = function (aElement) {
		var offset = 0;
		var el = aElement;

		do {
			offset += el.offsetTop;
		}
		while ((el = el.offsetParent));

		return offset;
	};

	DomUtils.offsetLeft = function (aElement) {
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
	DomUtils.findCssRules = function (aRegExp, aRuleList) {
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
	DomUtils.findCssRule = function (aRegExp, aRuleList) {
		var rules = DomUtils.findCssRules(aRegExp, aRuleList);
		return rules.length > 0 ? rules[0] : null;
	};

	DomUtils.getAncestorByClassName = function (aElement, aClassName) {
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

	DomUtils.getAncestorByTagName = function (aElement, aTagName) {
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

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.DomUtils = DomUtils;
	}

	return DomUtils;
});
