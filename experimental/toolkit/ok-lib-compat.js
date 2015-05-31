/**
 * {@link http://github.com/mikecaines/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";




if (!ok.compat) {
	ok.compat = {};

	(function () {
		var domAnimation = Modernizr.prefixed('animation');

		var prefixes = {
			animation: {
				end: 'animationend',
				key: 'keyframes',
				suf: ''
			},

			WebkitAnimation: {
				end: 'webkitAnimationEnd',
				key: '-webkit-keyframes',
				suf: '-webkit'
			}
		};

		if (domAnimation in prefixes) {
			ok.compat.domAnimation = domAnimation;
			ok.compat.domAnimationName = domAnimation + 'Name';
			ok.compat.eventAnimationend = prefixes[domAnimation].end;
			ok.compat.cssKeyframes = prefixes[domAnimation].key;
			ok.compat.cssFileSuffix = prefixes[domAnimation].suf;
		}

		else {
			ok.compat.domAnimation = false;
			ok.compat.domAnimationName = false;
			ok.compat.eventAnimationend = false;
			ok.compat.cssKeyframes = false;
			ok.compat.cssFileSuffix = '';
		}
	})();
}
