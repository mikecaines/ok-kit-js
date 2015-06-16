/**
 * {@link http://github.com/mikecaines/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";




/**
 * @param aAnimationName
 * @param aKeyframeName
 * @returns {CSSRule}
 */
Ok.getCssKeyframe = function (aAnimationName, aKeyframeName) {
	var animation = Ok.findCssRule(new RegExp('(^|\\s)@' + Ok.escapeRegExp(Ok.compat.cssKeyframes) + '\\s+' + Ok.escapeRegExp(aAnimationName) + '\\s*\\{'));
	return animation ? Ok.findCssRule(new RegExp('(^|\\s)' + aKeyframeName + '(\\s|$)'), animation.cssRules) : null;
};

Ok.removeAnimation = function (aElement, aAnimationName) {
	aElement.style[Ok.compat.domAnimation] =
		aElement.style[Ok.compat.domAnimation]
		.replace(new RegExp('(^|(,\\s*))[^,]*' + aAnimationName + '[^,]*((\\s*,)|$)', 'g'), '')
		.replace(/^\s*,/, '')
		.replace(/,\s*$/, '')
		.trim();
};

Ok.addAnimation = function (aElement, aAnimationName, aAnimationOther) {
	var value;

	if (!Ok.hasAnimation(aElement, aAnimationName)) {
		value = aAnimationName + ' ' + aAnimationOther;
		if (aElement.style[Ok.compat.domAnimation] != '') value = ',' + value;

		aElement.style[Ok.compat.domAnimation] += value;
	}
};

Ok.hasAnimation = function (aElement, aAnimationName) {
	return aElement.style[Ok.compat.domAnimation]
		.search(new RegExp('(^|(,\\s*))[^,]*' + aAnimationName + '[^,]*((\\s*,)|$)', 'g'), '') > -1;
};

Ok.queueOnAnimationStart = function (aElement, aAnimationName, aCallback, aData) {
	aElement['_okqas_' + aAnimationName] = {
		callback: aCallback,
		data: aData
	};
};

Ok.queueOnAnimationEnd = function (aElement, aAnimationName, aCallback, aData) {
	aElement['_okqae_' + aAnimationName] = {
		callback: aCallback,
		data: aData
	};
};

Ok.handleAnimationQueue = function (aEvt) {
	var eventType = aEvt.type.substr(-2);
	var queue, k;

	if (aEvt.target === aEvt.currentTarget) {
		if (eventType == 'nd') k = '_okqae_';
		else if (eventType == 'rt') k = '_okqas_';
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

Ok.handleAnimationRemoval = function (aEvt) {
	Ok.removeAnimation(aEvt.currentTarget, aEvt.animationName);
};

Ok.animationDeferCall = function (aCallback) {
	requestAnimationFrame(aCallback);
};
