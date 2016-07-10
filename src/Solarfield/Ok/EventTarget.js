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

		dispatchEvent: function (aThisContext, aEvent) {
			var i;

			if (this._bet_listeners[aEvent.type]) {
				for (i = 0; i < this._bet_listeners[aEvent.type].length; i++) {
					this._bet_listeners[aEvent.type][i].call(aThisContext, aEvent);
				}
			}
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
