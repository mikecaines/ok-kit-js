/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/ok-kit-js/src/Solarfield/Ok/HtmlUtils',
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

	var HtmlUtils = function () {
		throw new Error("Class is abstract.");
	};

	/**
	 * Escapes special HTML characters the specified string.
	 * @param {*} aString String to be escaped.
	 * @returns {string}
	 */
	HtmlUtils.escape = function (aString) {
		return (aString == null ? '' : aString+'').replace(/[&<>'"]/g, function (c) {
			return '&#' + c.charCodeAt(0) + ';';
		});
	};

	/**
	 * Can be used with tagged literals to escape embedded values.
	 * @param aStrings
	 * @param aValues
	 * @returns {string}
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals
	 */
	HtmlUtils.literal = function (aStrings, aValues) {
		var html = aStrings[0];
		var i;

		for (i = 1; i < aStrings.length; i++) {
			html += HtmlUtils.escape(arguments[i]) + aStrings[i];
		}

		return html;
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.DomUtils = HtmlUtils;
	}

	return HtmlUtils;
});
