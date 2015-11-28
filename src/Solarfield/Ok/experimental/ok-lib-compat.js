/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";




if (!Solarfield.Ok.compat) {
	Solarfield.Ok.compat = {};

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
			Solarfield.Ok.compat.domAnimation = domAnimation;
			Solarfield.Ok.compat.domAnimationName = domAnimation + 'Name';
			Solarfield.Ok.compat.eventAnimationstart = prefixes[domAnimation].start;
			Solarfield.Ok.compat.eventAnimationend = prefixes[domAnimation].end;
			Solarfield.Ok.compat.cssKeyframes = prefixes[domAnimation].key;
		}

		else {
			Solarfield.Ok.compat.domAnimation = false;
			Solarfield.Ok.compat.domAnimationName = false;
			Solarfield.Ok.compat.eventAnimationstart = false;
			Solarfield.Ok.compat.eventAnimationend = false;
			Solarfield.Ok.compat.cssKeyframes = false;
		}
	})();
}
