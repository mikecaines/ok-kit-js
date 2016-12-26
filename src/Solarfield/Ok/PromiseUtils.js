/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/ok-kit-js/src/Solarfield/Ok/PromiseUtils',
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

	var PromiseUtils = function () {
		throw new Error("Class is abstract.");
	};

	/**
	 * Creates a promise that resolves once all specified promises have settled.
	 * The promise will not reject.
	 * @param {Array} aArray Array of Promise's.
	 * @returns {Promise.<{resolved:Array, rejected:Array}>}
	 */
	PromiseUtils.allSettled = function (aArray) {
		var rejected = [];
		var resolved = [];

		return Promise.all(aArray.map(function (promise) {
			return Promise.resolve(promise).then(function (v) {
				resolved.push(v);
			})
			.catch(function (e) {
				rejected.push(e);
			});
		}))
		.then(function () {
			return {
				resolved: resolved,
				rejected: rejected,
			};
		});
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.DomUtils = PromiseUtils;
	}

	return PromiseUtils;
});
