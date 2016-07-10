/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/ok-kit-js/src/Solarfield/Ok/MathUtils',
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

	var MathUtils = function () {
		throw new Error("Class is abstract.");
	};

	MathUtils.randomInt = function (aMin, aMax) {
		return Math.floor(Math.random() * (aMax - aMin + 1)) + aMin;
	};

	MathUtils.randomFloat = function (aMin, aMax) {
		return Math.random() * (aMax - aMin) + aMin;
	};

	MathUtils.randomAdditiveInverse = function () {
		return MathUtils.randomInt(0, 1) == 0 ? 1 : -1;
	};

	MathUtils.roundFloat = function (aFloat, aDecimals) {
		var offset = Math.pow(10, aDecimals);
		return Math.round(aFloat * offset) / offset;
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.MathUtils = MathUtils;
	}

	return MathUtils;
});
