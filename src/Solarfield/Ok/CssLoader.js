/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
				'solarfield/ok-kit-js/src/Solarfield/Ok/EventTarget',
				'solarfield/ok-kit-js/src/Solarfield/Ok/ExtendableEventManager',
				'solarfield/ok-kit-js/src/Solarfield/Ok/ExtendableEvent',
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok.ObjectUtils,
			Solarfield.Ok.EventTarget,
			Solarfield.Ok.ExtendableEventManager,
			Solarfield.Ok.ExtendableEvent,
			true
		);
	}
})
(function (ObjectUtils, EventTarget, ExtendableEventManager, ExtendableEvent, _createGlobals) {
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

	CssLoader._eventTarget = new EventTarget();

	/**
	 * Imports the stylesheet at aUrl.
	 * @param {string} aUrl
	 * @param {object} aOptions
	 * @returns {Promise}
	 * @private
	 */
	CssLoader._importUrl = function (aUrl, aOptions) {
		var linkEl = this.getElement(aUrl, aOptions);
		var linkState = linkEl ? linkEl.getAttribute('data-state') : 1;

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
				if (this.parentNode) {
					this.parentNode.removeChild(this);
				}

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

		var style = window.getComputedStyle(el).display;
		document.body.removeChild(el);

		if (style == 'none') {
			return Promise.resolve();
		}

		return this._importUrl(System.normalizeSync(aModuleId).replace(/(\.css)?\.js$/, '.css'), aOptions);
	};

	CssLoader._whenReadyToImport = function () {
		var eventManager = new ExtendableEventManager(function (aWaitQueue) {
			return new ExtendableEvent({
				type: 'before-import',
				target: this,
			}, aWaitQueue);
		}.bind(this));

		return this._eventTarget.dispatchExtendableEvent(this, eventManager, {
			breakOnError: true,
		});
	};

	/**
	 * Gets the element that links the stylesheet to the current document.
	 * @param aUrl
	 * @param aOptions
	 * @returns {HTMLElement|null} Null if successful, otherwise string error message.
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
		return this._whenReadyToImport()
			.then(function () {
				//if aUrl is a URL ending in .css
				if (aUrl.search(/\.css$/) > -1) {
					return this._importUrl(aUrl, aOptions);
				}

				//else consider aUrl a module id
				return this._importModule(aUrl, aOptions);
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

	/**
	 * @param {string} aType - The event type name.
	 *  Types include: before-import.
	 * @param aListener
	 * @param aOptions
	 */
	CssLoader.addEventListener = function (aType, aListener, aOptions) {
		this._eventTarget.addEventListener(aType, aListener);
	};

	CssLoader.removeEventListener = function (aType, aListener, aOptions) {
		this._eventTarget.removeEventListener(aType, aListener);
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok['CssLoader'] = CssLoader;
	}

	return CssLoader;
});
