define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
	],
	function (ObjectUtils) {
		"use strict";

		/**
		 * An event which has a lifetime, that can be extended via the waitUntil() method.
		 * @class Solarfield.Ok.ExtendableEvent
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
		 */
		return ObjectUtils.extend(null, {
			waitUntil: function (aPromise) {
				this.waitQueue.push(aPromise);
				return aPromise;
			},

			constructor: function (aOptions, aWaitQueue) {
				/** @protected */
				this.waitQueue = aWaitQueue;

				this.type = aOptions.type;
				this.target = aOptions.target;
				this.detail = aOptions.detail !== undefined ? aOptions.detail : null;
			}
		});
	}
);
