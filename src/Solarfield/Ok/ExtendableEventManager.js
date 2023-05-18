define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils'
	],
	function (ObjectUtils) {
		"use strict";

		/**
		 * The internal object which is used when dispatching an ExtendableEvent via EventTarget.dispatchExtendableEvent().
		 * It is used to provide the EventTarget dispatcher access to the ExtendableEvent's wait queue,
		 * but to also restrict the event listeners from accessing it.
		 * @class Solarfield.Ok.ExtendableEventManager
		 * @see Solarfield.Ok.EventTarget::dispatchExtendableEvent()
		 */
		return ObjectUtils.extend(null, {
			/**
			 * Gets the actual ExtendableEvent which is dispatched to listeners.
			 * @returns {Solarfield.Ok.ExtendableEvent}
			 */
			getExtendableEvent: function () {
				if (!this._event) {
					this._event = this._factory(this._waitQueue);
					delete this._factory;
				}

				return this._event;
			},

			getWaitQueue: function () {
				return this._waitQueue;
			},
			
			/**
			 * @constructor
			 * @param {Function} aFactory - A callback which is passed the wait queue, and should return an ExtendableEvent.
			 */
			constructor: function (aFactory) {
				this._waitQueue = [];
				this._factory = aFactory;
			}
		});
	}
);