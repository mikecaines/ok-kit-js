/**
 * {@link http://github.com/mikecaines/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";

/**
 * @namespace ok
 */
if (!self.ok) self.ok = {};




ok.Widget = function (aElement) {
	this._ow_element = aElement;
};

ok.Widget.prototype.getElement = function () {
	return this._ow_element;
};

