define(
	'solarfield/ok-kit-js/src/Solarfield/Ok/ExtendableEvent',
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
				this.waitQueue.push(
					aPromise
					.catch(function (e) {
						//rethrow the exception in global scope, without breaking the call stack or event listener queue.
						//They can be caught using window.onerror, similar to an exception thrown by a <button>.onclick handler
						setTimeout(function(){throw e}, 0);
					})
				);
			},

			constructor: function (aOptions, aWaitQueue) {
				/** @protected */
				this.waitQueue = aWaitQueue;

				this.type = aOptions.type;
				this.target = aOptions.target;
			}
		});
	}
);