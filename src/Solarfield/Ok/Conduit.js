/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/lightship-js/src/Solarfield/Ok/Conduit',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ok',
				'solarfield/ok-kit-js/src/Solarfield/Ok/EventTarget'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok,
			Solarfield.Ok.EventTarget
		);
	}
})
(function (Ok, EvtTarget) {
	"use strict";

	/**
	 * @class Solarfield.Ok.Conduit
	 */
	var Conduit = Ok.extendObject(null, {
		addEventListener: function (aType, aListener) {
			this._soc_eventTarget.addEventListener(aType, aListener);
		},

		getName: function () {
			return this._soc_name;
		},

		push: function (aData) {
			this._soc_eventTarget.dispatchEvent(this, {
				type: 'data',
				target: this,
				data: aData
			});
		},

		constructor: function (aName) {
			this._soc_name = aName != null ? aName.toString() : null;
			this._soc_eventTarget = new EvtTarget();
		}
	});

	Ok.defineNamespace('Solarfield.Ok');
	Solarfield.Ok.Conduit = Conduit;

	return Conduit;
});
