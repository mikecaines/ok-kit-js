/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/ok-kit-js/src/Solarfield/Ok/AnimUtils',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
				'solarfield/ok-kit-js/src/Solarfield/Ok/DomUtils',
				'solarfield/ok-kit-js/src/Solarfield/Ok/RegexUtils'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok.ObjectUtils,
			Solarfield.Ok.DomUtils,
			Solarfield.Ok.RegexUtils,
			true
		);
	}
})
(function (ObjectUtils, DomUtils, RegexUtils, _createGlobals) {
	"use strict";

	var AnimUtils = function () {
		throw new Error("Class is abstract.");
	};

	//do some one-time compatibility tests
	(function () {
		AnimUtils.compat = {};

		var domAnimation = window.Modernizr && Modernizr.prefixed && Modernizr.prefixed('animation');

		var prefixes = {
			animation: {
				start: 'animationstart',
				end: 'animationend',
				key: 'keyframes'
			},

			WebkitAnimation: {
				start: 'webkitAnimationStart',
				end: 'webkitAnimationEnd',
				key: '-webkit-keyframes'
			}
		};

		if (domAnimation in prefixes) {
			AnimUtils.compat.domAnimation = domAnimation;
			AnimUtils.compat.domAnimationName = domAnimation + 'Name';
			AnimUtils.compat.eventAnimationstart = prefixes[domAnimation].start;
			AnimUtils.compat.eventAnimationend = prefixes[domAnimation].end;
			AnimUtils.compat.cssKeyframes = prefixes[domAnimation].key;
		}

		else {
			AnimUtils.compat.domAnimation = false;
			AnimUtils.compat.domAnimationName = false;
			AnimUtils.compat.eventAnimationstart = false;
			AnimUtils.compat.eventAnimationend = false;
			AnimUtils.compat.cssKeyframes = false;
		}
	})();

	/**
	 * @param aAnimationName
	 * @param aKeyframeName
	 * @returns {CSSRule}
	 */
	AnimUtils.getCssKeyframe = function (aAnimationName, aKeyframeName) {
		var animation = DomUtils.findCssRule(new RegExp('(^|\\s)@' + RegexUtils.escape(AnimUtils.compat.cssKeyframes) + '\\s+' + RegexUtils.escape(aAnimationName) + '\\s*\\{'));
		return animation ? DomUtils.findCssRule(new RegExp('(^|\\s)' + aKeyframeName + '(\\s|$)'), animation.cssRules) : null;
	};

	AnimUtils.serializeAnimation = function (aObject) {
		var str = '';

		if (aObject.name) str += ' ' + aObject.name;

		if (aObject.duration) {
			str += ' ' + aObject.duration;

			//if no unit is specified. default to ms
			if ((''+aObject.duration).search(/^[0-9.]+$/) > -1) str += 'ms';
		}

		if (aObject.timingFunction) str += ' ' + aObject.timingFunction;

		if (aObject.delay) {
			str += ' ' + aObject.delay;

			//if no unit is specified. default to ms
			if ((''+aObject.delay).search(/^[0-9.]+$/) > -1) str += 'ms';
		}

		if (aObject.iterationCount) str += ' ' + aObject.iterationCount;
		if (aObject.direction) str += ' ' + aObject.direction;
		if (aObject.fillMode) str += ' ' + aObject.fillMode;
		if (aObject.playState) str += ' ' + aObject.playState;

		return str;
	};

	AnimUtils.parseAnimation = function (aStr) {
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

	AnimUtils.setAnimation = function (aElement, aAnimation) {
		var animation = aAnimation && aAnimation.length ? AnimUtils.parseAnimation(aAnimation) : aAnimation;

		if (AnimUtils.compat.eventAnimationstart) {
			if (animation) {
				if (AnimUtils.hasAnimation(aElement, animation.name)) {
					aElement.style[AnimUtils.compat.domAnimation] = '';

					AnimUtils.deferAnimationCall(function () {
						//FUTURE: use new Function() for perf
						aElement.style[AnimUtils.compat.domAnimation] = aAnimation.length ? aAnimation : AnimUtils.serializeAnimation(aAnimation);
					});
				}

				else {
					aElement.style[AnimUtils.compat.domAnimation] = aAnimation.length ? aAnimation : AnimUtils.serializeAnimation(aAnimation);
				}
			}

			else {
				aElement.style[AnimUtils.compat.domAnimation] = '';
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

	AnimUtils.hasAnimation = function (aElement, aAnimationName) {
		return aElement.style[AnimUtils.compat.domAnimation]
			.search(new RegExp('(^|(,\\s*))[^,]*' + aAnimationName + '[^,]*((\\s*,)|$)', 'g'), '') > -1;
	};

	AnimUtils.deferAnimationCall = function (aCallback) {
		requestAnimationFrame(aCallback);
	};

	AnimUtils.onAnimationStart = function (aElement, aAnimationName, aCallback, aData) {
		return new Promise(function (resolve) {
			aElement._Ok_oas = {
				c: aCallback,
				d: aData,
				r: resolve,
				a: aAnimationName
			};


			if (AnimUtils.compat.eventAnimationstart) {
				aElement.addEventListener(AnimUtils.compat.eventAnimationstart, AnimUtils.onAnimationStart._handleCssAnimationStart);
			}

			else {
				AnimUtils.onAnimationStart._handleCssAnimationStart.call(aElement, {
					currentTarget: aElement,
					animationName: aAnimationName
				});
			}
		});
	};
	AnimUtils.onAnimationStart._handleCssAnimationStart = function (aEvt) {
		var item;

		if (aEvt.currentTarget === aEvt.target) {
			if (aEvt.currentTarget._Ok_oas.a == aEvt.animationName) {
				item = aEvt.currentTarget._Ok_oas;
				delete aEvt.currentTarget._Ok_oas;
				aEvt.currentTarget.removeEventListener(AnimUtils.compat.eventAnimationstart, AnimUtils.onAnimationStart._handleCssAnimationStart);

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

	AnimUtils.onAnimationEnd = function (aElement, aAnimationName, aCallback, aData) {
		return new Promise(function (resolve) {
			aElement._Ok_oae = {
				c: aCallback,
				d: aData,
				r: resolve,
				a: aAnimationName
			};


			if (AnimUtils.compat.eventAnimationend) {
				aElement.addEventListener(AnimUtils.compat.eventAnimationend, AnimUtils.onAnimationEnd._handleCssAnimationEnd);
			}

			else {
				AnimUtils.onAnimationEnd._handleCssAnimationEnd.call(aElement, {
					currentTarget: aElement,
					animationName: aAnimationName
				});
			}
		});
	};
	AnimUtils.onAnimationEnd._handleCssAnimationEnd = function (aEvt) {
		var item;

		if (aEvt.currentTarget === aEvt.target) {
			if (aEvt.currentTarget._Ok_oae.a == aEvt.animationName) {
				item = aEvt.currentTarget._Ok_oae;
				delete aEvt.currentTarget._Ok_oae;
				aEvt.currentTarget.removeEventListener(AnimUtils.compat.eventAnimationend, AnimUtils.onAnimationEnd._handleCssAnimationEnd);

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

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.AnimUtils = AnimUtils;
	}

	return AnimUtils;
});
