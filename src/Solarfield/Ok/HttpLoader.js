/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/lightship-js/src/Solarfield/Ok/HttpLoader',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ok',
				'solarfield/ok-kit-js/src/Solarfield/Ok/HttpMux'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok,
			Solarfield.Ok.HttpMux
		);
	}
})
(function (Ok, HttpMux) {
	"use strict";

	/**
	 * @class Solarfield.Ok.HttpLoader
	 * Wrapper for HttpMux, which provides a Promise based API.
	 * Note that the promise will still resolve in the case of an abort or timeout, but will have
	 * a null value for the response.
	 */
	var HttpLoader = Ok.extendObject(Object, {
		constructor: function () {
			throw "Class is abstract."
		}
	});

	HttpLoader._SOHL_abortPromise = function () {
		if (this._SOHL_httpMux) {
			this._SOHL_httpMux.abort();
			delete this._SOHL_httpMux;
		}
	};

	/**
	 * Loads data from aUrl.
	 * @param {string} aUrl The url to load from.
	 * @param {Object} [aOptions] Additional options.
	 * @param {string} [aOptions.responseType] @see XMLHttpRequest.responseType
	 * @returns {Promise<HttpLoaderLoadResolved>}
	 *
	 * @typedef {{
		 *  response: string|null,
		 *  aborted: boolean,
		 *  timedOut: boolean
		 * }} HttpLoaderLoadResolved
	 */
	HttpLoader.load = function (aUrl, aOptions) {
		var options, promise, httpMux;

		options = Ok.objectAssign({
			responseType: ''
		}, aOptions);

		httpMux = new HttpMux();

		promise = new Promise(function (resolve) {
			httpMux.send({
				url: aUrl,
				responseType: options.responseType,

				onEnd: function (aEvt) {
					promise = null;
					options = null;
					httpMux = null;

					resolve({
						response: aEvt.response,
						aborted: aEvt.aborted,
						timedOut: aEvt.timedOut
					});
				}
			});
		}.bind(this));

		promise._SOHL_httpMux = httpMux;
		promise.abort = HttpLoader._SOHL_abortPromise;

		return promise;
	};

	Ok.defineNamespace('Solarfield.Ok');
	Solarfield.Ok.HttpLoader = HttpLoader;

	return HttpLoader;
});
