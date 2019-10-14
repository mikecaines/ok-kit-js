define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
	],
	function (ObjectUtils) {
		"use strict";

		/**
		 * @class LogLevel
		 * Provides constants for log levels defined by RFC5424.
		 * @see https://tools.ietf.org/html/rfc5424#page-11
		 */
		var LogLevel = ObjectUtils.extend(Object, {
			constructor: function () {
				throw new Error("Class is abstract");
			}
		});

		LogLevel.EMERGENCY = 'error';
		LogLevel.ALERT = 'error';
		LogLevel.CRITICAL = 'error';
		LogLevel.ERROR = 'error';
		LogLevel.WARNING = 'warn';
		LogLevel.NOTICE = 'info';
		LogLevel.INFO = 'info';
		LogLevel.DEBUG = 'debug';
		
		return LogLevel;
	}
);
