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
		/**
		 * Loads JSON from aUrl, and optionally performs post-load success checks.
		 * @param {string} aUrl The url to load.
		 * @param {object} [aOptions] Additional options.
		 * @param {string} [aOptions.successPath] Dot-separated path which must exist in response json.
		 * @param {string} [aOptions.successValue] Value at successPath must match this value.
		 * @returns {Promise}
		 */
		load: function (aUrl, aOptions) {
			var options, jsonPromise, httpPromise;

			options = Ok.objectAssign({
				successPath: null,
				successValue: null
			}, aOptions);

			httpPromise = JsonLoader.super.prototype.load(aUrl, options);

			jsonPromise = httpPromise.then(function (httpResult) {
				var responseJson, json, error, jsonResult;

				jsonPromise = null;

				if (httpResult.aborted) {
					jsonResult = {
						json: null,
						aborted: true
					}
				}

				else {
					try {
						responseJson = JSON.parse(httpResult.response);
					} catch (ex) {}

					if (responseJson !== undefined) {
						if (options.successValue) {
							if (Ok.objectGet(responseJson, options.successPath) == options.successValue) {
								json = responseJson;
							}
							else {
								error = "successValue '" + options.successValue + "' at successPath '" + options.successPath + "' not found in response.";
							}
						}

						else if (options.successPath) {
							if (Ok.objectHas(responseJson, options.successPath)) {
								json = responseJson;
							}
							else {
								error = "successPath '" + options.successPath + "' not found in response.";
							}
						}

						else {
							json = responseJson;
						}
					}

					else {
						error = "Response could not be parsed as JSON.";
					}

					options = null;

					if (error) {
						jsonResult = Promise.reject({
							message: error,
							response: httpResult.response
						});
					}

					else {
						jsonResult = {
							json: json,
							aborted: httpResult.aborted
						};
					}
				}

				return jsonResult;
			}.bind(this));

			jsonPromise._SOJL_httpPromise = httpPromise;
			jsonPromise.abort = JsonLoader._SOJL_abortPromise;

			httpPromise = null;

			return jsonPromise;
		}
	});

	JsonLoader._SOJL_abortPromise = function () {
		if (this._SOJL_httpPromise) {
			this._SOJL_httpPromise.abort();
			delete this._SOJL_httpPromise;
		}
	};

	Ok.defineNamespace('Solarfield.Ok');
	Solarfield.Ok.JsonLoader = JsonLoader;

	return JsonLoader;
});
