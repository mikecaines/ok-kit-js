/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/lightship-js/src/Solarfield/Ok/CssLoader',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok.ObjectUtils,
			true
		);
	}
})
(function (ObjectUtils, _createGlobals) {
	"use strict";

	/**
	 * @class Solarfield.Ok.CssLoader
	 * @extends Solarfield.Ok.HttpLoader
	 */
	var CssLoader = ObjectUtils.extend(Object, {
		constructor: function () {
			throw "Method is abstract.";
		}
	});

	/**
	 * Imports the stylesheet at aUrl.
	 * @param {string} aUrl
	 * @param {object} aOptions
	 * @returns {Promise}
	 * @private
	 */
	CssLoader._importUrl = function (aUrl, aOptions) {
		var linkEl, linkState;

		linkEl = this.getElement(aUrl, aOptions);
		linkState = linkEl ? linkEl.getAttribute('data-state') : 1;

		if (linkState == null) {
			return Promise.resolve();
		}

		return new Promise(function (resolve, reject) {
			var el = linkEl;

			var handleLoad = function () {
				this.removeAttribute('data-state');
				this.removeEventListener('load', handleLoad);
				this.removeEventListener('error', handleError);

				resolve();
			};

			var handleError = function () {
				this.parentNode.removeChild(this);
				this.removeEventListener('load', handleLoad);
				this.removeEventListener('error', handleError);

				reject(new Error("Failed to load '" + aUrl + "'."));
			};

			if (!el) {
				el = document.createElement('link');
				el.setAttribute('href', aUrl);
				el.setAttribute('rel', 'stylesheet');
				el.setAttribute('type', 'text/css');
				el.setAttribute('data-state', '1');
			}

			el.addEventListener('load', handleLoad);
			el.addEventListener('error', handleError);

			if (!linkEl) {
				this.insertElement(el, aOptions);
			}
		}.bind(this));
	};

	/**
	 * Imports the stylesheet identified by aModuleId.
	 * @param {string} aModuleId
	 * @param {object} aOptions
	 * @returns {Promise}
	 * @private
	 */
	CssLoader._importModule = function (aModuleId, aOptions) {
		var el = document.createElement('div');
		el.dataset.cssModuleId = aModuleId;
		document.body.appendChild(el);

		var style = window.getComputedStyle(el);
		document.body.removeChild(el);

		if (style.display == 'none') {
			return Promise.resolve();
		}

		return this._importUrl(System.normalizeSync(aModuleId).replace(/(\.css)?\.js$/, '.css'), aOptions);
	};

	/**
	 * Gets the element that links the stylesheet to the current document.
	 * @param aUrl
	 * @param aOptions
	 * @returns {string|null} Null if successful, otherwise string error message.
	 * @protected
	 */
	CssLoader.getElement = function (aUrl, aOptions) {
		return document.querySelector(
			'link[rel="stylesheet"][href="' + aUrl + '"]'
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
	 * Loads the stylesheet identified by aUrl.
	 * @param {string} aUrl A URL ending in .css, or a "CSS module ID".
	 *   CSS Module ID's follow the same naming and normalization rules as defined by systemjs.
	 *   e.g. Module ID 'somepackage/somefolder/style'
	 *     may normalize to 'https://somedomain/packages/somepackage/somefolder/style.css'
	 *   The stylesheet itself must also contain a rule in the form of:
	 *    [data-css-module-id="somepackage/somefolder/style"] {display:none}
	 *   Using a module ID has the advantage that the module's CSS *rules* can be detected, independently from how they
	 *   were loaded (stylesheet import, bundle stylesheet import, etc.)
	 * @param {object} [aOptions] Additional options.
	 * @returns {Promise}
	 */
	CssLoader.import = function (aUrl, aOptions) {
		return new Promise(function (resolve) {
			//if aUrl is a URL ending in .css
			if (aUrl.search(/\.css$/) > -1) {
				resolve(this._importUrl(aUrl, aOptions));
			}

			//else consider aUrl a module id
			else {
				resolve(this._importModule(aUrl, aOptions));
			}
		}.bind(this));
	};

	/**
	 * Removes any link element with an href attribute matching aUrl.
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

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.CssLoader = CssLoader;
	}

	return CssLoader;
});