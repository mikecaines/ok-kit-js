/**
 * {@link http://github.com/mikecaines/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";

/**
 * @namespace ok
 */
if (!self.ok) self.ok = {};



ok.removeAnimation = function (aElement, aAnimationName) {
	aElement.style.animation =
		aElement.style.animation
		.replace(new RegExp('(^|(,\\s*))[^,]*' + aAnimationName + '[^,]*((\\s*,)|$)', 'g'), '')
		.replace(/^\s*,/, '')
		.replace(/,\s*$/, '')
		.trim();
};

ok.addAnimation = function (aElement, aAnimationName, aAnimationOther) {
	var value;

	if (!ok.hasAnimation(aElement, aAnimationName)) {
		value = aAnimationName + ' ' + aAnimationOther;
		if (aElement.style.animation != '') value = ',' + value;

		aElement.style.animation += value;
	}
};

ok.hasAnimation = function (aElement, aAnimationName) {
	return aElement.style.animation
		.search(new RegExp('(^|(,\\s*))[^,]*' + aAnimationName + '[^,]*((\\s*,)|$)', 'g'), '') > -1;
};

ok.queueOnAnimationStart = function (aElement, aAnimationName, aCallback, aData) {
	aElement['_okqas_' + aAnimationName] = {
		callback: aCallback,
		data: aData
	};
};

ok.queueOnAnimationEnd = function (aElement, aAnimationName, aCallback, aData) {
	aElement['_okqae_' + aAnimationName] = {
		callback: aCallback,
		data: aData
	};
};

ok.handleAnimationQueue = function (aEvt) {
	var eventType = aEvt.type.substr(-3);
	var queue, k;

	if (aEvt.target === aEvt.currentTarget) {
		if (eventType == 'end') k = '_okqae_';
		else if (eventType == 'art') k = '_okqas_';
		else return;

		k += aEvt.animationName;

		if (k in aEvt.currentTarget) {
			queue = aEvt.currentTarget[k];

			delete aEvt.currentTarget[k];
			k = null;

			setTimeout(queue.callback, 0, {
				currentTarget: aEvt.currentTarget,
				animationName: aEvt.animationName,
				data: queue.data
			});
		}
	}
};

ok.handleAnimationRemoval = function (aEvt) {
	ok.removeAnimation(aEvt.currentTarget, aEvt.animationName);
};

ok.animationDeferCall = function (aCallback) {
	requestAnimationFrame(aCallback);
};
