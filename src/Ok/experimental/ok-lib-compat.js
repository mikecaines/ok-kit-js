/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";




if (!Ok.compat) {
	Ok.compat = {};

	(function () {
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
			Ok.compat.domAnimation = domAnimation;
			Ok.compat.domAnimationName = domAnimation + 'Name';
			Ok.compat.eventAnimationstart = prefixes[domAnimation].start;
			Ok.compat.eventAnimationend = prefixes[domAnimation].end;
			Ok.compat.cssKeyframes = prefixes[domAnimation].key;
		}

		else {
			Ok.compat.domAnimation = false;
			Ok.compat.domAnimationName = false;
			Ok.compat.eventAnimationstart = false;
			Ok.compat.eventAnimationend = false;
			Ok.compat.cssKeyframes = false;
		}
	})();
}
