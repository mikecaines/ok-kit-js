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
			Solarfield.Ok
		);
	}
})
(function (Ok) {
	"use strict";

	/** @class Solarfield.Ok.StructProxy */
	var StructProxy = function (aData) {
		this._ohm_data = (aData != null && aData.constructor === Object) ? aData : {};
	};

	StructProxy.prototype.getData = function () {
		return this._ohm_data;
	};

	StructProxy.prototype.get = function (aPath) {
		return Ok.objectGet(this._ohm_data, aPath);
	};

	StructProxy.prototype.getAsString = function (aPath) {
		var value = this.get(aPath);
		if (value == null) value = '';
		else value = value.toString();
		return value;
	};

	StructProxy.prototype.getAsObject = function (aPath) {
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
	};

	StructProxy.prototype.getAsArray = function (aPath) {
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
	};

	StructProxy.prototype.getAsBool = function (aPath) {
		return this.get(aPath) == true;
	};

	StructProxy.prototype.set = function (aPath, aValue) {
		Ok.objectSet(this._ohm_data, aPath, aValue);
	};

	Ok.defineNamespace('Solarfield.Ok');
	return Solarfield.Ok.StructProxy = StructProxy;
});
