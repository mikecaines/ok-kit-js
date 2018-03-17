define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
	],
	function (ObjectUtils) {
		"use strict";
		
		/**
		 * The object returned from HttpLoader::load()
		 * @class HttpLoaderResult
		 * @see HttpLoader#load
		 * @property {int} status - HTTP status code.
		 * @property {string} statusText - HTTP status message.
		 * @property {string} responseType - Underlying XMLHttpRequest response type. This is often an empty string.
		 * @property {*} response - The response body. This may be a string, JSON, etc.
		 * @property {bool} aborted - Whether the request was aborted.
		 * @property {bool} timedOut - Whether the request timed out.
		 * @property {HttpLoaderError} error - An error which provides details on why the request failed.
		 */
		var HttpLoaderResult = ObjectUtils.extend(null, {
			constructor: function HttpLoaderResult(status, statusText, responseType, response, aborted, timedOut, error) {
				Object.defineProperties(this, {
					status: {value: status},
					statusText: {value: statusText},
					responseType: {value: responseType},
					response: {value: response},
					aborted: {value: aborted},
					timedOut: {value: timedOut},
					error: {value: error},
				});
			}
		});
		
		return HttpLoaderResult;
	}
);
