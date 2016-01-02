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
		 * @param {string} [aOptions.successKey] Dot-separated path which must exist in response json.
		 * @param {string} [aOptions.successValue] Value at successKey must match this value.
		 * @returns {Promise}
		 */
		load: function (aUrl, aOptions) {
			var options = Ok.objectAssign({
				successKey: null,
				successValue: null
			}, aOptions);

			return JsonLoader.super.prototype.load(aUrl, options).then(function (responseText) {
				var responseJson, json, error;

				try {responseJson = JSON.parse(responseText);} catch (ex) {}

				if (responseJson !== undefined) {
					if (options.successValue) {
						if (Ok.objectGet(responseJson, options.successKey) == options.successValue) {
							json = responseJson;
						}
						else {
							error = "successValue '" + options.successValue + "' at successKey '" + options.successKey + "' not found in response.";
						}
					}

					else if (options.successKey) {
						if (Ok.objectHas(responseJson, options.successKey)) {
							json = responseJson;
						}
						else {
							error = "successKey '" + options.successKey + "' not found in response.";
						}
					}

					else {
						json = responseJson;
					}
				}

				else {
					error = "Response could not be parsed as JSON."
				}

				if (error) {
					return Promise.reject({
						message: error,
						response: responseText
					});
				}

				else {
					return json;
				}
			}.bind(this));
		}
	});

	Ok.defineNamespace('Solarfield.Ok');
	Solarfield.Ok.JsonLoader = JsonLoader;

	return JsonLoader;
});
