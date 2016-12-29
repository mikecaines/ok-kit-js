/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/lightship-js/src/Solarfield/Ok/CustomError',
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
	 * @class CustomError
	 * @extends Error
	 */
	var CustomError = ObjectUtils.extend(Error, {
		constructor: function (aMessage, aCode, aPrevious) {
			this.name = this.constructor.name||'CustomError';
			this.message = ''+aMessage;
			this.code = aCode||0;
			this.previous = aPrevious||null;

			try {
				this.stack =
					(new Error()).stack.trim()
					.match(/([^\n]*)$/)[1]
					.replace(/^\s*at\s+/, '');
			}
			catch (e) {}

			if (this.stack) {
				try {
					var last = this.stack.match(/([^<\s]+):(\d+):(\d+)\)?$/);
					this.fileName = last[1].replace(/^[(@]/, '');
					this.lineNumber = last[2];
					this.columnNumber = last[3];
				}
				catch (e) {}
			}
		}
	});

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.CustomError = CustomError;
	}

	return CustomError;
});