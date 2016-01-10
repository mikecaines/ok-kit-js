/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/lightship-js/src/Solarfield/Ok/CssLoader',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ok'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok
		);
	}
})
(function (Ok) {
	"use strict";

	/**
	 * @class Solarfield.Ok.CssLoader
	 * @extends Solarfield.Ok.HttpLoader
	 */
	var CssLoader = Ok.extendObject(Object, {
		constructor: function () {
			throw "Method is abstract.";
		}
	});

	/**
	 * Gets the element that links the stylesheet to the current document.
	 * @param aUrl
	 * @param aOptions
	 * @returns {string|null} Null if successful, otherwise string error message.
	 * @protected
	 */
	CssLoader.getElement = function (aUrl, aOptions) {
		return document.querySelector(
			'link[rel="stylesheet"][href="' + aUrl + '"], link[rel="stylesheet"][data-href="' + aUrl + '"]'
		);
	};

	/**
	 * Inserts the link element into the document.
	 * Override if you want to modify the href attribute, or insert into a specific location in the dom, etc.
	 * @param {HTMLElement} aElement
	 * @param {object} aOptions Options used by import().
	 * @protected
	 */
	CssLoader.insertElement = function (aElement, aOptions) {
		document.head.insertBefore(aElement, document.head.firstChild);
	};

	/**
	 * Loads the stylesheet at aUrl.
	 * @param {string} aUrl
	 * @param {object} [aOptions] Additional options.
	 * @returns {Promise<CssLoaderImportResolved>}
	 *
	 * @typedef {{
		 *  element: HTMLElement
		 * }} CssLoaderImportResolved
	 */
	CssLoader.import = function (aUrl, aOptions) {
		var cssResult, el;

		if ((el = this.getElement(aUrl, aOptions))) {
			cssResult = Promise.resolve({
				element: el
			});
		}

		else {
			cssResult = new Promise(function (resolve, reject) {
				var el;

				el = document.createElement('link');
				el.setAttribute('data-href', aUrl);
				el.setAttribute('href', aUrl);
				el.setAttribute('rel', 'stylesheet');
				el.setAttribute('type', 'text/css');

				el.addEventListener('load', function (aEvt) {
					resolve({
						element: aEvt.target
					});
				}.bind(this));

				el.addEventListener('error', function (ex) {
					reject(ex);
				});

				this.insertElement(el, aOptions);
			}.bind(this));
		}

		return cssResult;
	};

	/**
	 * Removes any link element with a data-href attribute matching aUrl.
	 * This effectively removes the stylesheet from the 'registry', and stops applying its rules to the document.
	 * @param aUrl
	 * @param aOptions
	 */
	CssLoader.remove = function (aUrl, aOptions) {
		var el;

		if ((el = this.getElement(aUrl, aOptions))) {
			el.parentNode.removeChild(el);
		}
	};

	Ok.defineNamespace('Solarfield.Ok');
	Solarfield.Ok.CssLoader = CssLoader;

	return CssLoader;
});
