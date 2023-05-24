(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
				'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok.ObjectUtils,
			Solarfield.Ok.StructUtils,
			true
		);
	}
})
(function (ObjectUtils, StructUtils, _createGlobals) {
	"use strict";

	/**
	 * @class Solarfield.Ok.EventTarget
	 */
	const EventTarget = ObjectUtils.extend(Object, {
		constructor : function () {
			/**
			 * @private
			 */
			this._bet_listeners = {};
		},
		
		/**
		 *
		 * @param {string} aEventType Event type to listen for.
		 * @param {Function} aListener Callback function.
		 * @param {{}} aOptions - Configuration options.
		 * @param {int=} aOptions.priority Listeners registered with lower priorities will be called first.
		 *  Default priority is 0.
		 */
		addEventListener: function (aEventType, aListener, aOptions) {
			if (!this.addedEventListener(aEventType, aListener)) {
				if (!this._bet_listeners[aEventType]) {
					this._bet_listeners[aEventType] = [];
				}

				const options = StructUtils.assign({
					priority: 0,
				}, aOptions);
				
				this._bet_listeners[aEventType].push({
					func: aListener,
					opts: options,
				});
				
				this._bet_listeners[aEventType].sort(function (a, b) {
					if (a.opts.priority < b.opts.priority) return -1;
					if (a.opts.priority > b.opts.priority) return 1;
					return 0;
				});
			}
		},
		
		/**
		 * @param {string} aEventType
		 * @param {function} aListener
		 */
		removeEventListener: function (aEventType, aListener) {
			const index = this.addedEventListener(aEventType, aListener);
			
			if (index !== null) {
				this._bet_listeners[aEventType].splice(index, 1);
				
				if (this._bet_listeners[aEventType].length === 0) {
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
			const breakOnError = aOptions && ('breakOnError' in aOptions) ? aOptions.breakOnError : false;

			const listeners =
				aOptions && aOptions.listener
					? [{func: aOptions.listener}]
					: this._bet_listeners[aEvent.type]
						? this._bet_listeners[aEvent.type]
						: [];

			for (const listener of listeners) {
				try {
					listener.func.call(aThisContext, aEvent);
				}
				catch (e) {
					setTimeout(function () {throw e}, 0);
					if (breakOnError) throw e;
				}
			}
		},

		/**
		 * Dispatches an ExtendableEvent and returns a Promise which resolves when the event lifetime ends.
		 *
		 * Listeners themselves can be async functions.
		 *
		 * The event lifetime can be extended by listeners, by calling the waitUntil() method of the event
		 * (this adds a promise to the wait queue). That is, the dispatchExtendableEvent() function will not return/resolve
		 * until all listeners have been called, and the wait queue is settled.
		 *
		 * Listeners will be called (and awaited) sequentially, in order, however the wait queue will be processed
		 * concurrently.
		 *
		 * IMPORTANT: Avoid calling dispatchExtendableEvent() multiple times for the same event, as each call will
		 * create its own wait queue, likely resulting in unexpected behaviour.
		 *
		 * @param {*} aThisContext When the event is dispatched, unbound listener functions will have their this context
		 *  set to the specified object.
		 *
		 * @param {Solarfield.Ok.ExtendableEventManager} aManager An instance of an ExtendableEventManager which generates
		 *  the actual ExtendableEvent. Note that unlike dispatchEvent(), you pass an ExtendableEventManager, not the
		 *  ExtendableEvent directly. The manager provides access to the wait queue and other internals.
		 *
		 * @param {Object=} aOptions Call time options.
		 * @param {Function=} aOptions.listener When specified, the event will be dispatched to this listener, instead of
		 *  any listeners registered via addEventListener().
		 * @param {boolean=false} aOptions.breakOnError When true, if an error occurs in a listener
		 *  (or one of the promises in the wait queue rejects), the event will not be dispatched to any further listeners,
		 *  and dispatchExtendableEvent() will error.
		 *
		 * @returns {ExtendableEvent} Promise which resolves to the ExtendableEvent produced by the ExtendableEventManager.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
		 */
		dispatchExtendableEvent: async function (aThisContext, aManager, aOptions) {
			const event = aManager.getExtendableEvent();
			const waitQueue = aManager.getWaitQueue();

			const breakOnError = aOptions && ('breakOnError' in aOptions) ? aOptions.breakOnError : false;

			let listeners = [];
			if (aOptions && aOptions.listener) listeners.push({func: aOptions.listener});
			else if (this._bet_listeners[event.type]) listeners.push(...this._bet_listeners[event.type]);

			for (const listener of listeners) {
				try {
					await listener.func.call(aThisContext, event);
				}
				catch (e) {
					// re-throw the error in the global scope
					setTimeout(() => {throw e}, 0);

					if (breakOnError) throw e;
				}
			}

			// await the wait queue
			{
				let error;

				await Promise.allSettled(waitQueue.map(promise => promise.catch(e => {
					// re-throw the error in the global scope
					setTimeout(() => {throw e}, 0);

					// keep a ref to the first encountered error
					if (!error) error = e;
				})));

				if (breakOnError && error) throw error;
			}

			return event;
		},

		addedEventListener: function (aEventType, aListener) {
			if (this._bet_listeners[aEventType]) {
				for (let i = 0; i < this._bet_listeners[aEventType].length; i++) {
					if (this._bet_listeners[aEventType][i].func === aListener) return i;
				}
			}

			return null;
		},

		hasEventListeners: function (aEventType) {
			return (aEventType in this._bet_listeners) && this._bet_listeners[aEventType].length > 0;
		}
	});

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok['EventTarget'] = EventTarget;
	}

	return EventTarget;
});
