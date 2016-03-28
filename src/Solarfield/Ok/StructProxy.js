/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/ok-kit-js/src/Solarfield/Ok/StructProxy',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ok'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok,
			true
		);
	}
})
(function (Ok, _createGlobals) {
	"use strict";

	/** @class Solarfield.Ok.StructProxy */
	var StructProxy = Ok.extendObject(null, {
		constructor: function (aData) {
			this._ohm_data = (aData != null && aData.constructor === Object) ? aData : {};
		},

		getData: function () {
			return this._ohm_data;
		},

		get: function (aPath) {
			return Ok.objectGet(this._ohm_data, aPath);
		},

		getAsString: function (aPath) {
			var value = this.get(aPath);
			if (value == null) value = '';
			else value = value.toString();
			return value;
		},

		getAsObject: function (aPath) {
			var value = this.get(aPath);
			var isNull = value == null;
			var obj, k;

			if (!isNull) {
				if (value.constructor === Object) {
					obj = value;
				}

				else {
					obj = {};

					for (k in value) {
						obj[k] = value[k];
					}
				}
			}

			else {
				obj = {};
			}

			return obj;
		},

		getAsArray: function (aPath) {
			var value = this.get(aPath);
			var isNull = value == null;
			var arr, k;

			if (!isNull) {
				if (value.constructor === Array) {
					arr = value;
				}

				else {
					arr = [];

					for (k in value) {
						arr.push(value[k]);
					}
				}
			}

			else {
				arr = [];
			}

			return arr;
		},

		getAsBool: function (aPath) {
			return this.get(aPath) == true;
		},

		set: function (aPath, aValue) {
			Ok.objectSet(this._ohm_data, aPath, aValue);
		}
	});

	if (_createGlobals) {
		Ok.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.StructProxy = StructProxy;
	}

	return StructProxy;
});
