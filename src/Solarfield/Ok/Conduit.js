/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
				'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
				'solarfield/ok-kit-js/src/Solarfield/Ok/EventTarget',
				'solarfield/ok-kit-js/src/Solarfield/Ok/ExtendableEventManager',
				'solarfield/ok-kit-js/src/Solarfield/Ok/ConduitDataEvent',
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok.ObjectUtils,
			Solarfield.Ok.StructUtils,
			Solarfield.Ok.EventTarget,
			Solarfield.Ok.ExtendableEventManager,
			Solarfield.Ok.ConduitDataEvent,
			true
		);
	}
})
(function (ObjectUtils, StructUtils, EvtTarget, ExtendableEventManager, ConduitDataEvent, _createGlobals) {
	"use strict";

	/**
	 * An object which enables you to push (send) arbitrary data into it, which will result in an (extendable)
	 * 'data' event being dispatched to all registered listeners. The data associated with the event, can be replaced
	 * (or modified). These features provide a way to set up a Promise based processing chain of custom data packets.
	 * @class Solarfield.Ok.Conduit
	 */
	var Conduit = ObjectUtils.extend(null, {
		/**
		 * @param {string} aType - The type of event. Types include: data.
		 * @param {Function} aListener - The callback.
		 * @param {{}} aOptions - Configuration options.
		 *  @param {int} aOptions.priority - Dispatch order priority.
		 *    Listeners with lower priorities will be called first.
		 *    Default is 0.
		 */
		addEventListener: function (aType, aListener, aOptions) {
			this._soc_eventTarget.addEventListener(aType, aListener, aOptions);
		},

		getName: function () {
			return this._soc_name;
		},
		
		/**
		 * @param {*} aData Any object which will be dispatched to all 'data' event listeners.
		 * @return {Promise} Promise resolving to the data, after all event listeners have been called.
		 */
		push: function (aData) {
			var event = new ExtendableEventManager(function (aWaitQueue) {
				return new ConduitDataEvent({
					target: this,
				}, aWaitQueue, aData);
			}.bind(this));
			
			return this._soc_eventTarget.dispatchExtendableEvent(this, event, {
				breakOnError: true,
			})
			.then(function () {
				return aData
			})
		},
		
		/**
		 * @param {Object} aOptions
		 * @param {string=} aOptions.name
		 * @constructor
		 */
		constructor: function (aOptions) {
			var options = StructUtils.assign({
				name: null
			}, aOptions);

			this._soc_name = options.name != null ? ''+options.name : null;
			this._soc_eventTarget = new EvtTarget();
		}
	});

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.Conduit = Conduit;
	}

	return Conduit;
});
