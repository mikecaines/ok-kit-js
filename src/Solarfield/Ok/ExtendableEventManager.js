define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils'
	],
	function (ObjectUtils) {
		"use strict";

		/**
		 * The internal object which is used when dispatching an ExtendableEvent via EventTarget.dispatchExtendableEvent().
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

			constructor: function (aFactory) {
				this._waitQueue = [];
				this._factory = aFactory;
			}
		});
	}
);