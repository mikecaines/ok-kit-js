/**
 * {@link http://github.com/mikecaines/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";




/**
 * @class Ok.Widget
 * @param {HTMLElement} aElement
 * @param {Object=} aOptions
 * @constructor
 */
Ok.Widget = function (aElement, aOptions) {
	this._ow_element = aElement;
};

Ok.Widget.prototype.getElement = function () {
	return this._ow_element;
};
