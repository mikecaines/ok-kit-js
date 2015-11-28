/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";




/**
 * @param aAnimationName
 * @param aKeyframeName
 * @returns {CSSRule}
 */
Solarfield.Ok.getCssKeyframe = function (aAnimationName, aKeyframeName) {
	var animation = Solarfield.Ok.findCssRule(new RegExp('(^|\\s)@' + Solarfield.Ok.escapeRegExp(Solarfield.Ok.compat.cssKeyframes) + '\\s+' + Solarfield.Ok.escapeRegExp(aAnimationName) + '\\s*\\{'));
	return animation ? Solarfield.Ok.findCssRule(new RegExp('(^|\\s)' + aKeyframeName + '(\\s|$)'), animation.cssRules) : null;
};

Solarfield.Ok.serializeAnimation = function (aObject) {
	var str = '';

	if (aObject.name) str += ' ' + aObject.name;
	if (aObject.duration) str += ' ' + aObject.duration;
	if (aObject.timingFunction) str += ' ' + aObject.timingFunction;
	if (aObject.delay) str += ' ' + aObject.delay;
	if (aObject.iterationCount) str += ' ' + aObject.iterationCount;
	if (aObject.direction) str += ' ' + aObject.direction;
	if (aObject.fillMode) str += ' ' + aObject.fillMode;
	if (aObject.playState) str += ' ' + aObject.playState;

	return str;
};

Solarfield.Ok.parseAnimation = function (aStr) {
	if (aStr == null || aStr.trim() == '') {
		return null;
	}

	var matches = (aStr+'').split(/\s/);

	return {
		name: matches[0] || '',
		duration: matches[1] || '',
		timingFunction: matches[2] || '',
		delay: matches[3] || '',
		iterationCount: matches[4] || '',
		direction: matches[5] || '',
		fillMode: matches[6] || '',
		playState: matches[7] || ''
	}
};

Solarfield.Ok.setAnimation = function (aElement, aAnimation) {
	var animation = aAnimation && aAnimation.length ? Solarfield.Ok.parseAnimation(aAnimation) : aAnimation;

	if (Solarfield.Ok.compat.eventAnimationstart) {
		if (animation) {
			if (Solarfield.Ok.hasAnimation(aElement, animation.name)) {
				aElement.style[Solarfield.Ok.compat.domAnimation] = '';

				Solarfield.Ok.deferAnimationCall(function () {
					//FUTURE: use new Function() for perf
					aElement.style[Solarfield.Ok.compat.domAnimation] = aAnimation.length ? aAnimation : Solarfield.Ok.serializeAnimation(aAnimation);
				});
			}

			else {
				aElement.style[Solarfield.Ok.compat.domAnimation] = aAnimation.length ? aAnimation : Solarfield.Ok.serializeAnimation(aAnimation);
			}
		}

		else {
			aElement.style[Solarfield.Ok.compat.domAnimation] = '';
		}
	}

	else {
		if (animation) {
			if (aElement._Ok_oas && aElement._Ok_oas.a == animation.name) {
				if (aElement._Ok_oas.c) {
					aElement._Ok_oas.c({
						currentTarget: aElement,
						animationName: aElement._Ok_oas.a,
						data: aElement._Ok_oas.d
					});
				}

				aElement._Ok_oas.r({
					currentTarget: aElement,
					animationName: aElement._Ok_oas.a,
					elapsedTime: 0
				});
			}

			if (aElement._Ok_oae && aElement._Ok_oae.a == animation.name) {
				if (aElement._Ok_oae.c) {
					aElement._Ok_oae.c({
						currentTarget: aElement,
						animationName: aElement._Ok_oae.a,
						data: aElement._Ok_oae.d
					});
				}

				aElement._Ok_oae.r({
					currentTarget: aElement,
					animationName: aElement._Ok_oae.a,
					elapsedTime: 0
				});
			}
		}
	}
};

Solarfield.Ok.hasAnimation = function (aElement, aAnimationName) {
	return aElement.style[Solarfield.Ok.compat.domAnimation]
		.search(new RegExp('(^|(,\\s*))[^,]*' + aAnimationName + '[^,]*((\\s*,)|$)', 'g'), '') > -1;
};

Solarfield.Ok.deferAnimationCall = function (aCallback) {
	requestAnimationFrame(aCallback);
};

Solarfield.Ok.onAnimationStart = function (aElement, aAnimationName, aCallback, aData) {
	return new Promise(function (resolve) {
		aElement._Ok_oas = {
			c: aCallback,
			d: aData,
			r: resolve,
			a: aAnimationName
		};


		if (Solarfield.Ok.compat.eventAnimationstart) {
			aElement.addEventListener(Solarfield.Ok.compat.eventAnimationstart, Solarfield.Ok.onAnimationStart._handleCssAnimationStart);
		}

		else {
			Solarfield.Ok.onAnimationStart._handleCssAnimationStart.call(aElement, {
				currentTarget: aElement,
				animationName: aAnimationName
			});
		}
	});
};
Solarfield.Ok.onAnimationStart._handleCssAnimationStart = function (aEvt) {
	var item;

	if (aEvt.currentTarget === aEvt.target) {
		if (aEvt.currentTarget._Ok_oas.a == aEvt.animationName) {
			item = aEvt.currentTarget._Ok_oas;
			delete aEvt.currentTarget._Ok_oas;
			aEvt.currentTarget.removeEventListener(Solarfield.Ok.compat.eventAnimationstart, Solarfield.Ok.onAnimationStart._handleCssAnimationStart);

			if (item.c) {
				item.c({
					currentTarget: aEvt.currentTarget,
					animationName: aEvt.animationName,
					data: item.d
				});
			}

			item.r({
				currentTarget: aEvt.currentTarget,
				animationName: aEvt.animationName,
				elapsedTime: aEvt.elapsedTime || 0
			});
		}
	}
};

Solarfield.Ok.onAnimationEnd = function (aElement, aAnimationName, aCallback, aData) {
	return new Promise(function (resolve) {
		aElement._Ok_oae = {
			c: aCallback,
			d: aData,
			r: resolve,
			a: aAnimationName
		};


		if (Solarfield.Ok.compat.eventAnimationend) {
			aElement.addEventListener(Solarfield.Ok.compat.eventAnimationend, Solarfield.Ok.onAnimationEnd._handleCssAnimationEnd);
		}

		else {
			Solarfield.Ok.onAnimationEnd._handleCssAnimationEnd.call(aElement, {
				currentTarget: aElement,
				animationName: aAnimationName
			});
		}
	});
};
Solarfield.Ok.onAnimationEnd._handleCssAnimationEnd = function (aEvt) {
	var item;

	if (aEvt.currentTarget === aEvt.target) {
		if (aEvt.currentTarget._Ok_oae.a == aEvt.animationName) {
			item = aEvt.currentTarget._Ok_oae;
			delete aEvt.currentTarget._Ok_oae;
			aEvt.currentTarget.removeEventListener(Solarfield.Ok.compat.eventAnimationend, Solarfield.Ok.onAnimationEnd._handleCssAnimationEnd);

			if (item.c) {
				item.c({
					currentTarget: aEvt.currentTarget,
					animationName: aEvt.animationName,
					data: item.d
				});
			}

			item.r({
				currentTarget: aEvt.currentTarget,
				animationName: aEvt.animationName,
				elapsedTime: aEvt.elapsedTime || 0
			});
		}
	}
};
