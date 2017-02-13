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
	 * @class Solarfield.Ok.StringUtils
	 */
	var StringUtils = function () {
		throw new Error("Class is abstract.");
	};

	StringUtils.camelToDash = function (aString) {
		var str;

		str = (aString+'').match(/((?:[A-Z]?[a-z]+)|(?:[0-9]+))/g);
		str = str.join('-');
		str = str.toLowerCase();

		return str;
	};

	StringUtils.dashToCamel = function (aString) {
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

	StringUtils.upperCaseFirst = function (aString) {
		var str = aString+'';
		return str.substr(0, 1).toUpperCase() + str.substr(1);
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.StringUtils = StringUtils;
	}

	return StringUtils;
});
