/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

/**
 * @typedef {{
 *  status: int,
 *  statusText: string,
 *  response: *,
 *  responseType: string|null
 *  aborted: boolean,
 *  timedOut: boolean,
 *  error: Error|null
 * }} HttpLoaderLoadResolved
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/ok-kit-js/src/Solarfield/Ok/HttpLoader',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
				'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
				'solarfield/ok-kit-js/src/Solarfield/Ok/HttpMux',
				'solarfield/ok-kit-js/src/Solarfield/Ok/HttpLoaderError'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok.ObjectUtils,
			Solarfield.Ok.StructUtils,
			Solarfield.Ok.HttpMux,
			Solarfield.Ok.HttpLoaderError,
			true
		);
	}
})
(function (ObjectUtils, StructUtils, HttpMux, HttpLoaderError, _createGlobals) {
	"use strict";

	/**
	 * @class HttpLoader
	 * @abstract
	 * Wrapper for HttpMux, which provides a Promise based API.
	 * Works similar to the Fetch API.
	 * Requests are abortable.
	 * Different response types (JSON, etc.) are handled by subclasses, however you can leverage the parseFunction
	 * request option to handle any type of response.
	 */
	const HttpLoader = ObjectUtils.extend(Object, {
		/**
		 * @constructor
		 */
		constructor: function () {
			throw "Class is abstract."
		}
	});

	/**
	 * @static
	 * @private
	 */
	HttpLoader._SOHL_abortPromise = function () {
		if (this._SOHL_httpMux) {
			this._SOHL_httpMux.abort();
			delete this._SOHL_httpMux;
		}
	};

	/**
	 * Normalizes the various argument forms that can be passed to ::load(), into a single object.
	 * @protected
	 * @param aUrl
	 * @param aOptions
	 */
	HttpLoader.normalizeLoadArgs = function (aUrl, aOptions) {
		let options;

		if ((typeof aUrl) == 'string') {
			options = StructUtils.assign({
				url: aUrl
			}, aOptions);
		}

		else {
			options = aUrl;
		}

		return options;
	};

	/**
	 * Loads data from aUrl.
	 * Rejects if the request/args are invalid, or if the request is aborted, times out, or a response/parse error
	 * occurs. Receiving a non-HTTP-200 status code will not reject.
	 * Rejects with an Error or HttpLoaderError, the latter providing additional details.
	 * @param {string} aUrl The url to load from.
	 * @param {Object} [aOptions] Additional options. @see HttpMux#send
	 * @returns {Promise.<HttpLoaderLoadResolved, Error|HttpLoaderError>} Promise with an abort() method.
	 * @static
	 * @public
	 */
	HttpLoader.load = function (aUrl, aOptions) {
		let httpMux = new HttpMux();

		let promise = new Promise(function (resolve, reject) {
			let options = this.normalizeLoadArgs(aUrl, aOptions);
			delete options.onBegin;
			
			options.onEnd = function (aEvt) {
				promise = null;
				
				const result = {
					status: aEvt.status,
					statusText: aEvt.statusText,
					responseType: aEvt.responseType,
					response: aEvt.response,
					aborted: aEvt.aborted,
					timedOut: aEvt.timedOut,
					error: aEvt.error
				};
				
				if (!aEvt.error && !aEvt.aborted && !aEvt.timedOut) {
					resolve(result);
				}
				
				else {
					reject(new HttpLoaderError(
						result.error ? result.error.message : "Loading failed.",
						0, null, result
					));
				}
			};

			httpMux.send(options);
			options = null;
		}.bind(this));

		promise._SOHL_httpMux = httpMux;
		promise.abort = HttpLoader._SOHL_abortPromise;
		
		httpMux = null;

		return promise;
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield['Ok']['HttpLoader'] = HttpLoader;
	}

	return HttpLoader;
});
