/**
 * {@link http://github.com/mikecaines/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";




if (!Ok.compat) {
	Ok.compat = {};

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
			Ok.compat.domAnimation = domAnimation;
			Ok.compat.domAnimationName = domAnimation + 'Name';
			Ok.compat.eventAnimationend = prefixes[domAnimation].end;
			Ok.compat.cssKeyframes = prefixes[domAnimation].key;
			Ok.compat.cssFileSuffix = prefixes[domAnimation].suf;
		}

		else {
			Ok.compat.domAnimation = false;
			Ok.compat.domAnimationName = false;
			Ok.compat.eventAnimationend = false;
			Ok.compat.cssKeyframes = false;
			Ok.compat.cssFileSuffix = '';
		}
	})();
}
