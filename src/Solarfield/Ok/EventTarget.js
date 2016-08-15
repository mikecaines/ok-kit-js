(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/ok-kit-js/src/Solarfield/Ok/EventTarget',
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
	 * @class Solarfield.Ok.EventTarget
	 */
	var EventTarget = ObjectUtils.extend(Object, {
		/**
		 * The arguments of this method are structured this way, in order to avoid using closures or bind(). The intent is
		 * to save memory if dispatchExtendableEvent() is never called, since it may not be used often in some
		 * EventTarget contexts.
		 * @private
		 */
		_bet_dispatchExtendableEventStep: function (aSelf, aThisContext, aEvent, aHandlers, aWaitQueue, aResolve) {
			if (aHandlers.length > 0) {
				aHandlers.shift().call(aThisContext, aEvent);

				Promise.all(aWaitQueue.splice(0))
				.then(function () {
					setTimeout(aSelf, 0, aSelf, aThisContext, aEvent, aHandlers, aWaitQueue, aResolve);
				});
			}

			else {
				aResolve();
			}
		},

		constructor : function () {
			this._bet_listeners = {}
		},

		addEventListener: function (aEventType, aListener) {
			if (!this.addedEventListener(aEventType, aListener)) {
				if (!this._bet_listeners[aEventType]) {
					this._bet_listeners[aEventType] = [];
				}

				this._bet_listeners[aEventType].push(aListener);
			}
		},

		/**
		 * Dispatches an event to any registered listeners.
		 *
		 * @param {*} aThisContext When the event is dispatched, unbound listener functions will have their this context
		 *  set to the specified object.
		 *
		 * @param aEvent The event object. The only required property is 'type'.
		 */
		dispatchEvent: function (aThisContext, aEvent) {
			var i;

			if (this._bet_listeners[aEvent.type]) {
				for (i = 0; i < this._bet_listeners[aEvent.type].length; i++) {
					this._bet_listeners[aEvent.type][i].call(aThisContext, aEvent);
				}
			}
		},

		/**
		 * Dispatches an ExtendableEvent and returns a Promise which resolves when the event lifetime ends. The event
		 * lifetime can be extended by listeners, by calling the waitUntil() method of the event.
		 *
		 * After the event is dispatched to a listener, any promises in the wait queue ( added via waitUntil() ) are
		 * processed via Promise.all(). This ensures listeners will be called in order, waiting for the previous listeners
		 * promises to resolve, before continuing.
		 *
		 * @param {*} aThisContext When the event is dispatched, unbound listener functions will have their this context
		 *  set to the specified object.
		 *
		 * @param {Solarfield.Ok.ExtendableEventManager} aManager An instance of an ExtendableEventManager which generates
		 *  the actual ExtendableEvent. Note that unlike dispatchEvent(), you pass an ExtendableEventManager, not the
		 *  ExtendableEvent directly. The manager provides access to the wait queue and other internals.
		 *
		 * @returns {Promise} Promise which resolves at the end of the event's lifetime.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
		 */
		dispatchExtendableEvent: function (aThisContext, aManager) {
			return new Promise(function (resolve) {
				this._bet_dispatchExtendableEventStep(
					this._bet_dispatchExtendableEventStep,
					aThisContext,
					aManager.getExtendableEvent(),

					this._bet_listeners[aManager.getExtendableEvent().type]
						? this._bet_listeners[aManager.getExtendableEvent().type].concat() : [],

					aManager.getWaitQueue(),
					resolve
				);
			}.bind(this));
		},

		addedEventListener: function (aEventType, aListener) {
			var i;

			if (this._bet_listeners[aEventType]) {
				for (i = 0; i < this._bet_listeners[aEventType].length; i++) {
					if (this._bet_listeners[aEventType][i] === aListener) return i;
				}
			}

			return null;
		},

		hasEventListeners: function (aEventType) {
			return this._bet_listeners[aEventType] && this._bet_listeners[aEventType].length > 0;
		}
	});

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.EventTarget = EventTarget;
	}

	return EventTarget;
});
