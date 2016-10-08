/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/lightship-js/src/Solarfield/Ok/HttpMux',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
				'solarfield/ok-kit-js/src/Solarfield/Ok/StringUtils',
				'solarfield/ok-kit-js/src/Solarfield/Ok/Url'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok.ObjectUtils,
			Solarfield.Ok.StringUtils,
			Solarfield.Ok.Url,
			true
		);
	}
})
(function (ObjectUtils, StringUtils, Url, _createGlobals) {
	"use strict";

	/**
	 * @class Solarfield.Ok.HttpMux
	 * Utility wrapper for XMLHttpRequest, which ensures only one request is ever executed. Aborting of any currently
	 * executing requests is handled automatically, and all begin/end events are fired in the correct order.
	 */
	var HttpMux = function (aRequestDefaults) {
		this._lhm_currentXhr = null;
		this._lhm_currentInfo = null;
		this._lhm_requestDefaults = null;
		this._lhm_listeners = {};

		this._lhm_handleXhrLoadend = this._lhm_handleXhrLoadend.bind(this);
		this._lhm_handleXhrTimeout = this._lhm_handleXhrTimeout.bind(this);

		if (aRequestDefaults) {
			this.setRequestDefaults(aRequestDefaults);
		}
	};

	/**
	 * @param {{
	 *	 url: string=,
	 *	 method: string=,
	 *	 data: *=,
	 *	 responseType: string=,
	 *	 onBegin: function=,
	 *	 onEnd: function=,
	 * }} aRequest
	 */
	HttpMux.prototype.send = function (aRequest) {
		var xhr, request;

		if (this._lhm_currentXhr) {
			this._lhm_currentXhr.abort();
		}

		request = this._lhm_normalizeRequest(aRequest);

		xhr = new XMLHttpRequest();
		xhr.responseType = request.responseType;
		xhr.addEventListener('loadend', this._lhm_handleXhrLoadend);
		xhr.addEventListener('timeout', this._lhm_handleXhrTimeout);

		this._lhm_currentXhr = xhr;

		this._lhm_currentInfo = {
			onBegin: request.onBegin,
			onEnd: request.onEnd,
			aborted: false,
			timedOut: false
		};

		xhr.open(request.method, request.url);

		this._lhm_dispatchEvent({
			type: 'begin',
			currentTarget: this,
			xhr: xhr
		}, this._lhm_currentInfo, true);

		xhr.send(request.data);
	};

	HttpMux.prototype.abort = function () {
		if (this._lhm_currentXhr) {
			this._lhm_currentInfo.aborted = true;
			this._lhm_currentXhr.abort();
		}
	};

	HttpMux.prototype.setRequestDefaults = function (aDefaults) {
		this._lhm_requestDefaults = aDefaults;
	};

	HttpMux.prototype.addEventListener = function (aType, aListener) {
		if (!(aType in this._lhm_listeners)) {
			this._lhm_listeners[aType] = [];
		}

		this._lhm_listeners[aType].push(aListener);
	};

	HttpMux.prototype._lhm_handleXhrLoadend = function (aEvt) {
		var xhr = this._lhm_currentXhr;
		var info = this._lhm_currentInfo;

		this._lhm_currentXhr = null;
		this._lhm_currentInfo = null;

		//do an extra check for an implicit abort,
		//which occurs when the page is reloaded while the request is still executing
		if (!info.aborted && !info.timedOut) {
			if (xhr.status === 0) {
				info.aborted = true;
			}
		}

		this._lhm_dispatchEvent({
			type: 'end',
			currentTarget: this,
			xhr: xhr,
			response: xhr.response,
			responseType: xhr.responseType,
			aborted: info.aborted,
			timedOut: info.timedOut
		}, info, false);
	};

	HttpMux.prototype._lhm_handleXhrTimeout = function () {
		this._lhm_currentInfo.timedOut = true;
	};

	HttpMux.prototype._lhm_normalizeRequest = function (aRequest) {
		var request, k, url, query, i;

		request = {
			url: '',
			method: null,
			data: null,
			responseType: '',
			onBegin: null,
			onEnd: null
		};

		if (this._lhm_requestDefaults) {
			for (k in this._lhm_requestDefaults) {
				request[k] = this._lhm_requestDefaults[k];
			}
		}

		if (aRequest) {
			for (k in aRequest) {
				request[k] = aRequest[k];
			}
		}

		//if the request doesn't specify a method
		if (request.method == null) {
			//if the request data is null/undefined, string, or Object, default the method to 'get', otherwise 'post'.
			request.method =
				(request.data == null || (typeof request.data) == 'string' || request.data.constructor == Object)
				? 'get' : 'post'
			;
		}

		//if the method is 'get', and we have data
		if (request.method == 'get' && request.data) {
			//attempt to convert the data to query parameters, and append them to the request url

			if (!(
				(typeof request.data) == 'string'
				|| request.data.constructor == Object
			)) throw new Error(
				"Could not convert request data to URL query string, for HTTP GET request."
				+ " Type must be string or Object."
			);

			url = new Url(request.url);
			query = Url.parseQuery(request.data);

			for (i in query) {
				url.setQueryParam(i, query[i], false);
			}

			request.url = url.toString();
			request.data = null;
		}

		return request;
	};

	HttpMux.prototype._lhm_dispatchEvent = function (aEvent, aInfo, aOrder) {
		var listeners, i, k;

		//queue persistent listeners
		listeners = (aEvent.type in this._lhm_listeners) ? this._lhm_listeners[aEvent.type].concat([]) : [];

		//queue one-time listener
		k = 'on' + StringUtils.upperCaseFirst(StringUtils.dashToCamel(aEvent.type));
		if (k in aInfo) {
			if (aInfo[k]) {
				listeners[aOrder ? 'push' : 'unshift'](aInfo[k]);
			}
		}

		for (i = 0; i < listeners.length; i++) {
			listeners[i].call(this, aEvent);
		}
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.HttpMux = HttpMux;
	}

	return HttpMux;
});
