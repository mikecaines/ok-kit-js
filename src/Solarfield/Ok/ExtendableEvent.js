define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
	],
	function (ObjectUtils) {
		"use strict";

		/**
		 * An event which has a lifetime, that can be extended via the waitUntil() method.
		 * Note that EventTarget.dispatchExtendableEvent() accepts an ExtendableEventManager,
		 * not an ExtendableEvent directly.
		 * @class Solarfield.Ok.ExtendableEvent
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
		 */
		return ObjectUtils.extend(null, {
			/**
			 * Adds a promise into the wait queue, extending the event lifetime.
			 * @public
			 * @param {Promise} aPromise
			 * @return {Promise} The passed aPromise is returned for convenience.
			 */
			waitUntil: function (aPromise) {
				this.waitQueue.push(aPromise);
				return aPromise;
			},

			preventDefault: function () {
				this.defaultPrevented = true;
			},
			
			/**
			 * @constructor
			 * @see ExtendableEventManager
			 * @see EventTarget::dispatchExtendableEvent()
			 * @param {ExtendableEventInit} aEventInit Event configuration.
			 * @param {Array} aWaitQueue The queue of promises, usually passed from the ExtendableEventManager.
			 */
			constructor: function (aEventInit, aWaitQueue) {
				/** @protected */
				this.waitQueue = aWaitQueue;

				this.type = aEventInit.type;
				this.target = aEventInit.target;
				this.detail = aOptions.detail !== undefined ? aOptions.detail : null;
				this.defaultPrevented = false;
			}
		});
		
		/**
		 * @typedef {{}} ExtendableEventInit
		 * @property {string} type
		 * @property {*} target
		 */
	}
);
