/**
 * {@link http://github.com/mikecaines/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";

/**
 * @namespace ok
 */
if (!self.ok) self.ok = {};




/**
 * WARNING: this is very slow!
 * @see http://jsperf.com/overridden-getters
 * @param aObject
 * @param aPropertyName
 * @returns {*}
 */
ok.getSuperPropertyDescriptor = function (aObject, aPropertyName) {
	var pd = null;
	var obj = Object.getPrototypeOf(aObject);

	do {
		obj = Object.getPrototypeOf(obj);
		pd = Object.getOwnPropertyDescriptor(obj, aPropertyName);
	}
	while (pd == null && obj.constructor !== Object);

	return pd;
};
