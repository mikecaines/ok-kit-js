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
ok.getCssKeyframe = function (aAnimationName, aKeyframeName) {
	var animation = ok.findCssRule(new RegExp('(^|\\s)@' + ok.escapeRegExp(ok.compat.cssKeyframes) + '\\s+' + ok.escapeRegExp(aAnimationName) + '\\s*\\{'));
	return animation ? ok.findCssRule(new RegExp('(^|\\s)' + aKeyframeName + '(\\s|$)'), animation.cssRules) : null;
};

ok.removeAnimation = function (aElement, aAnimationName) {
	aElement.style[ok.compat.domAnimation] =
		aElement.style[ok.compat.domAnimation]
		.replace(new RegExp('(^|(,\\s*))[^,]*' + aAnimationName + '[^,]*((\\s*,)|$)', 'g'), '')
		.replace(/^\s*,/, '')
		.replace(/,\s*$/, '')
		.trim();
};

ok.addAnimation = function (aElement, aAnimationName, aAnimationOther) {
	var value;

	if (!ok.hasAnimation(aElement, aAnimationName)) {
		value = aAnimationName + ' ' + aAnimationOther;
		if (aElement.style[ok.compat.domAnimation] != '') value = ',' + value;

		aElement.style[ok.compat.domAnimation] += value;
	}
};

ok.hasAnimation = function (aElement, aAnimationName) {
	return aElement.style[ok.compat.domAnimation]
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

ok.handleAnimationRemoval = function (aEvt) {
	ok.removeAnimation(aEvt.currentTarget, aEvt.animationName);
};

ok.animationDeferCall = function (aCallback) {
	requestAnimationFrame(aCallback);
};
