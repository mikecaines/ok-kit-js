/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
				'solarfield/ok-kit-js/src/Solarfield/Ok/HttpLoader'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok.ObjectUtils,
			Solarfield.Ok.HttpLoader,
			true
		);
	}
})
(function (ObjectUtils, HttpLoader, _createGlobals) {
	"use strict";

	/**
	 * @class Solarfield.Ok.JsonLoader
	 * @abstract
	 * @extends Solarfield.Ok.HttpLoader
	 * @property {Solarfield.Ok.HttpLoader} super
	 */
	var JsonLoader = ObjectUtils.extend(HttpLoader);

	/**
	 * Loads JSON from aUrl.
	 * @inheritDoc
	 */
	JsonLoader.load = function (aUrl, aOptions) {
		var options = this.normalizeLoadArgs(aUrl, aOptions);

		options.parseFunction = function (aXhr) {
			return JSON.parse(aXhr.response);
		};

		return JsonLoader.super.load(options);
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.JsonLoader = JsonLoader;
	}

	return JsonLoader;
});
