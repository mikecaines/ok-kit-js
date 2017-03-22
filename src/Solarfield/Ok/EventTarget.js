(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
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
		_bet_dispatchExtendableEventStep: function (aSelf, aThisContext, aEvent, aHandlers, aWaitQueue, aResolve, aReject, aWait, aBreakOnError) {
			if (aHandlers.length > 0) {
				try {
					//call the current event listener
					aHandlers.shift().call(aThisContext, aEvent);
				}
				catch (e) {
					if (aBreakOnError) {
						//break the dispatch chain
						aReject(e);
						return;
					}
					else {
						//rethrow the error into the global scope, without breaking the dispatch chain
						setTimeout(function () {throw e}, 0);
					}
				}

				//remove any promises from the wait queue, and wait for them all to settle
				aWait(aWaitQueue.splice(0))
				.then(function () {
					//queue the next event listener
					setTimeout(aSelf, 0, aSelf, aThisContext, aEvent, aHandlers, aWaitQueue, aResolve, aReject, aWait, aBreakOnError);
				})
				.catch(function (e) {
					if (aBreakOnError) {
						//break the dispatch chain
						aReject(e);
					}
					else {
						//queue the next event listener
						setTimeout(aSelf, 0, aSelf, aThisContext, aEvent, aHandlers, aWaitQueue, aResolve, aReject, aWait, aBreakOnError);
					}
				})
			}

			else {
				aResolve();
			}
		},

		/**
		 * Similar to Promise.all(), but settles once all passed promises are settled (i.e. no fail-fast behaviour).
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#Promise.all_fail-fast_behaviour
		 * @param {[Promise]}aPromises
		 * @returns {Promise|Promise.<Error>}
		 * @private
		 */
		_bet_dispatchExtendableEventWait: function (aPromises) {
			var error;

			return Promise.all(aPromises.map(function (promise) {
				return promise.catch(function (e) {
					//rethrow the error into the global scope, without breaking the dispatch chain
					setTimeout(function () {throw e}, 0);

					//capture the first error, and consider it the error that broke the chain
					if (!error) error = e;
				});
			}))
			.then(function () {
				return error ? Promise.reject(error) : Promise.resolve();
			});
		},

		constructor : function () {
			/**
			 * @private
			 */
			this._bet_listeners = {};
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
		 * @param {string} aEventType
		 * @param {function} aListener
		 */
		removeEventListener: function (aEventType, aListener) {
			var index = this.addedEventListener(aEventType, aListener);
			
			if (index !== null) {
				this._bet_listeners[aEventType].splice(index, 1);
				
				if (this._bet_listeners[aEventType].length == 0) {
					delete this._bet_listeners[aEventType];
				}
			}
		},

		/**
		 * Dispatches an event to any registered listeners.
		 *
		 * @param {*} aThisContext When the event is dispatched, unbound listener functions will have their this context
		 *  set to the specified object.
		 *
		 * @param aEvent The event object. The only required property is 'type'.
		 *
		 * @param {Object=} aOptions Call time options
		 * @param {Function=} aOptions.listener If specified, the event will be dispatched to this listener, instead of
		 *  any listeners registered via addEventListener().
		 * @param {boolean=false} aOptions.breakOnError If true, if an error occurs in a listener, the event will not be
		 *  dispatched to any further listeners.
		 */
		dispatchEvent: function (aThisContext, aEvent, aOptions) {
			var breakOnError = aOptions && ('breakOnError' in aOptions) ? aOptions.breakOnError : false;
			var i;

			var listeners =
				aOptions && aOptions.listener
					? [aOptions.listener]
					: this._bet_listeners[aEvent.type]
						? this._bet_listeners[aEvent.type]
						: [];

			for (i = 0; i < listeners.length; i++) {
				try {
					listeners[i].call(aThisContext, aEvent);
				}
				catch (e) {
					setTimeout(function () {throw e}, 0);
					if (breakOnError) throw e;
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
		 * @param {Object=} aOptions Call time options.
		 * @param {Function=} aOptions.listener If specified, the event will be dispatched to this listener, instead of
		 *  any listeners registered via addEventListener().
		 * @param {boolean=false} aOptions.breakOnError If true, if an error occurs in a listener (or one of the promises added
		 *  via waitUntil() rejects), the event will not be dispatched to any further listeners.
		 *
		 * @returns {Promise} Promise which resolves at the end of the event's lifetime.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
		 */
		dispatchExtendableEvent: function (aThisContext, aManager, aOptions) {
			return new Promise(function (resolve, reject) {
				this._bet_dispatchExtendableEventStep(
					this._bet_dispatchExtendableEventStep,
					aThisContext,
					aManager.getExtendableEvent(),

					aOptions && aOptions.listener
						? [aOptions.listener]
						:	this._bet_listeners[aManager.getExtendableEvent().type]
							? this._bet_listeners[aManager.getExtendableEvent().type].concat()
							: [],

					aManager.getWaitQueue(),
					resolve,
					reject,
					this._bet_dispatchExtendableEventWait,
					aOptions && ('breakOnError' in aOptions) ? aOptions.breakOnError : false
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
		Solarfield.Ok['EventTarget'] = EventTarget;
	}

	return EventTarget;
});
