/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/lightship-js/src/Solarfield/Ok/JsonLoader',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ok',
				'solarfield/ok-kit-js/src/Solarfield/Ok/HttpLoader'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok,
			Solarfield.Ok.HttpLoader
		);
	}
})
(function (Ok, HttpLoader) {
	"use strict";

	/**
	 * @class Solarfield.Ok.JsonLoader
	 * @extends Solarfield.Ok.HttpLoader
	 */
	var JsonLoader = Ok.extendObject(HttpLoader, {
		constructor: function () {
			throw "Class is abstract.";
		}
	});

	JsonLoader._SOJL_abortPromise = function () {
		if (this._SOJL_httpPromise) {
			this._SOJL_httpPromise.abort();
			delete this._SOJL_httpPromise;
		}
	};

	/**
	 * Loads JSON from aUrl.
	 * @param {string} aUrl The url to load.
	 * @param {object} [aOptions] Additional options.
	 * @returns {Promise<JsonLoaderLoadResolved>}
	 * @throws Error if a response is received and it cannot be parsed as JSON.
	 *
	 * @typedef {{
		 *  json: json|null,
		 *  aborted: boolean,
		 *  timedOut: boolean
		 * }} JsonLoaderLoadResolved
	 */
	JsonLoader.load = function (aUrl, aOptions) {
		var jsonPromise, httpPromise;

		httpPromise = JsonLoader.super.load(aUrl, aOptions);

		jsonPromise = httpPromise.then(function (httpResult) {
			var jsonResult;

			jsonPromise = null;

			if (httpResult.aborted || httpResult.timedOut) {
				jsonResult = {
					json: null,
					aborted: httpResult.aborted,
					timedOut: httpResult.timedOut
				}
			}

			else {
				jsonResult = {
					json: JSON.parse(httpResult.response),
					aborted: false,
					timedOut: false
				};
			}

			return jsonResult;
		}.bind(this));

		jsonPromise._SOJL_httpPromise = httpPromise;
		jsonPromise.abort = JsonLoader._SOJL_abortPromise;

		httpPromise = null;

		return jsonPromise;
	};

	Ok.defineNamespace('Solarfield.Ok');
	Solarfield.Ok.JsonLoader = JsonLoader;

	return JsonLoader;
});
