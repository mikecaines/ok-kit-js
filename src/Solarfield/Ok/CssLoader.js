/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/lightship-js/src/Solarfield/Ok/CssLoader',
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
	 * @class Solarfield.Ok.CssLoader
	 * @extends Solarfield.Ok.HttpLoader
	 */
	var CssLoader = Ok.extendObject(HttpLoader, {
		/**
		 * Tests any success conditions, once the CSS is inserted into the document.
		 * @param aLoadOptions
		 * @returns {string|null} Null if successful, otherwise string error message.
		 * @protected
		 */
		_testLoaded: function (aLoadOptions) {
			var error;

			if (aLoadOptions.successSelector) {
				if (!Ok.findCssRule(new RegExp('(^|})\\s*' + Solarfield.Ok.escapeRegExp(aLoadOptions.successSelector) + '\\s*{'))) {
					error = "successSelector '" + aLoadOptions.successSelector + "' not found.";
				}
			}

			return error || null;
		},

		/**
		 * Inserts the link element into the document.
		 * Override if you want to modify the href attribute, or insert into a specific location in the dom, etc.
		 * @param {HTMLElement} aElement
		 * @param {object} aOptions Options used by load().
		 * @protected
		 */
		insertElement: function (aElement, aOptions) {
			document.head.insertBefore(aElement, document.head.firstChild);
		},

		/**
		 * Loads the stylesheet at aUrl, and optionally performs post-load success checks.
		 * @param {string} aUrl
		 * @param {object} [aOptions] Additional options.
		 * @param {string} [aOptions.successSelector] A CSSRule with the specified selector must exist.
		 * @returns {Promise}
		 */
		load: function (aUrl, aOptions) {
			var options = Ok.objectAssign({
				successSelector: null
			}, aOptions);

			if (!this._testLoaded(options)) {
				return Promise.resolve({
					url: aUrl
				});
			}

			return new Promise(function (resolve, reject) {
				var el;

				el = document.createElement('link');
				el.setAttribute('data-href', aUrl);
				el.setAttribute('href', aUrl);
				el.setAttribute('rel', 'stylesheet');
				el.setAttribute('type', 'text/css');

				el.addEventListener('load', function () {
					var error;

					if ((error = this._testLoaded(options))) {
						reject({
							message: error,
							element: el
						});
					}

					else {
						resolve({
							url: aUrl
						});
					}
				}.bind(this));

				el.addEventListener('error', function (ex) {
					reject(ex);
				});

				this.insertElement(el, options);
			}.bind(this));
		},

		/**
		 * Removes any link element with a data-href attribute matching aUrl.
		 * @param aUrl
		 */
		unload: function (aUrl) {
			var el;

			if ((el = document.querySelector('link[rel="stylesheet"][data-href="' + aUrl + '"]'))) {
				el.parentNode.removeChild(el);
			}
		}
	});

	Ok.defineNamespace('Solarfield.Ok');
	Solarfield.Ok.CssLoader = CssLoader;

	return CssLoader;
});
