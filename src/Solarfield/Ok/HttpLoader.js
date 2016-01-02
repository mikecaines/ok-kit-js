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

	//FUTURE: HttpMux queuing/pool/reuse to avoid many parallel requests, etc.
	//FUTURE: automatic retries

	/**
	 * @class Solarfield.Ok.HttpLoader
	 * Wrapper for HttpMux, which provides a Promise based API.
	 */
	var HttpLoader = Ok.extendObject(Object, {
		_getMux: function () {
			if (!this._httpMux) {
				this._httpMux = new HttpMux();
			}

			return this._httpMux;
		},

		/**
		 * Loads data from aUrl.
		 * @param {string} aUrl The url to load from.
		 * @param {Object} [aOptions] Additional options.
		 * @param {string} [aOptions.responseType] @see XMLHttpRequest.responseType
		 * @returns {Promise}
		 */
		load: function (aUrl, aOptions) {
			var options;

			this.abort();

			options = Ok.objectAssign({
				responseType: ''
			}, aOptions);

			return new Promise(resolve => {
				this._getMux().send({
					url: aUrl,
					responseType: options.responseType,
					onEnd: function (aEvt) {
						resolve(aEvt.response);
					}
				});
			});
		},

		abort: function () {
			if (this._httpMux) {
				this._httpMux.abort();
			}
		},

		constructor: function () {
			this._httpMux = null;
		}
	});

	Ok.defineNamespace('Solarfield.Ok');
	Solarfield.Ok.HttpLoader = HttpLoader;

	return HttpLoader;
});
