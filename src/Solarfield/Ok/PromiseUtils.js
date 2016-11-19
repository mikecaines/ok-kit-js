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
	 * Similar to Promise.all(), but settles once all passed promises are settled (i.e. no fail-fast behaviour).
	 * Rejects with an array of rejected values from aArray.
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#Promise.all_fail-fast_behaviour
	 * @param {Array} aArray Array of Promise's.
	 * @returns {Promise}
	 */
	PromiseUtils.allSettled = function (aArray) {
		var errors = [];
		var values = [];

		return Promise.all(aArray.map(function (promise) {
			return promise.then(function (v) {
				values.push(v);
			})
			.catch(function (e) {
				errors.push(e);
			});
		}))
		.then(function () {
			return errors.length > 0 ? Promise.reject(errors) : Promise.resolve(values);
		});
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.DomUtils = PromiseUtils;
	}

	return PromiseUtils;
});
