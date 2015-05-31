/**
 * {@link http://github.com/mikecaines/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";




/**
 * @class ok.Widget
 * @param {HTMLElement} aElement
 * @param {Object=} aOptions
 * @constructor
 */
ok.Widget = function (aElement, aOptions) {
	this._ow_element = aElement;
};

ok.Widget.prototype.getElement = function () {
	return this._ow_element;
};
