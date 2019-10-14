define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
	],
	function (ObjectUtils) {
		"use strict";

		/**
		 * @class LogUtils
		 */
		var LogUtils = ObjectUtils.extend(Object, {
			constructor: function () {
				throw new Error("Class is abstract");
			}
		});

		/**
		 * Returns true, if message with level b, should be included when logging at level a.
		 * @param {int|string} a
		 * @param {int|string} b
		 * @return {boolean}
		 */
		LogUtils.includes = function (a, b) {
			return this.toRfc5424(a) >= this.toRfc5424(b);
		};

		/**
		 * Maps the specified level identifier to the corresponding RFC5424 integer.
		 * @see https://tools.ietf.org/html/rfc5424#page-11
		 * @param {int|string} aLevel
		 * @return {int}
		 */
		LogUtils.toRfc5424 = function (aLevel) {
			var level;
			
			level = parseInt(aLevel);
			if (level.toString() === aLevel.toString()) {
				if (!(level >= 0 && level <= 7)) throw new Error(
					"Unknown log level '" + aLevel + "'."
				);

				return level;
			}

			var map = {
				emergency: 0,
				alert: 1,
				critical: 2,
				error: 3,
				warning: 4,
				warn: 4,
				notice: 5,
				info: 6,
				informational: 6,
				debug: 7,
			};

			level = (''+aLevel).toLowerCase();
			if (!map[level]) throw new Error(
				"Unknown log level '" + aLevel + "'."
			);

			return map[level];
		};
		
		return LogUtils;
	}
);
