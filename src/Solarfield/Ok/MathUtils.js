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

	/**
	 * Whether or not two rectangles intersect.
	 * @param r1 Rectangle1 as [x1, y1, x2, y2]
	 * @param r2 Rectangle2
	 * @returns {boolean}
	 */
	MathUtils.rectsIntersect = function (r1, r2) {
		return r1[0]<r2[2] && r1[2]>r2[0] && r1[1]<r2[3] && r1[3]>r2[1];
	};

	/**
	 * The absolute minimum distance between two rectangles.
	 * Sizes which overlap, or are contained within the other rectangle, are considered zero.
	 * @param r1 Rectangle1 as [x1, y1, x2, y2]
	 * @param r2 Rectangle2
	 * @returns {number}
	 */
	MathUtils.rectsNearestSide = function(r1, r2) {
		return Math.max(
			Math.max(0, r1[0]-r2[2]),
			Math.max(0, r2[0]-r1[2]),
			Math.max(0, r1[1]-r2[3]),
			Math.max(0, r2[1]-r1[3])
		);
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.MathUtils = MathUtils;
	}

	return MathUtils;
});
