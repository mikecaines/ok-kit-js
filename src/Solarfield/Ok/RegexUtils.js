/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/ok-kit-js/src/Solarfield/Ok/RegexUtils',
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
	 * @class Solarfield.Ok.RegexUtils
	 */
	var RegexUtils = function () {
		throw new Error("Class is abstract.");
	};

	RegexUtils.escape = function (aString){
		return (aString+'').replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.RegexUtils = RegexUtils;
	}

	return RegexUtils;
});
