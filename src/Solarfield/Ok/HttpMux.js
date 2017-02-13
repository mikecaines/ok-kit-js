/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
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
	const HttpMux = function (aRequestDefaults) {
		this._lhm_currentXhr = null;
		this._lhm_currentInfo = null;
		this._lhm_requestDefaults = null;
		this._lhm_listeners = {};

		this._lhm_handleXhrLoad = this._lhm_handleXhrLoad.bind(this);
		this._lhm_handleXhrError = this._lhm_handleXhrError.bind(this);
		this._lhm_handleXhrAbort = this._lhm_handleXhrAbort.bind(this);
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
		if (this._lhm_currentXhr) {
			this._lhm_currentXhr.abort();
		}

		const request = this._lhm_normalizeRequest(aRequest);

		const xhr = new XMLHttpRequest();
		xhr.addEventListener('load', this._lhm_handleXhrLoad);
		xhr.addEventListener('error', this._lhm_handleXhrError);
		xhr.addEventListener('abort', this._lhm_handleXhrAbort);
		xhr.addEventListener('timeout', this._lhm_handleXhrTimeout);

		this._lhm_currentXhr = xhr;

		this._lhm_currentInfo = {
			onBegin: request.onBegin,
			onEnd: request.onEnd,
			parseFunction: request.parseFunction,
			response: null,
			aborted: false,
			timedOut: false,
			error: null
		};

		xhr.open(request.method, request.url);
		xhr.responseType = request.responseType;
		xhr.timeout = request.timeout;

		Object.keys(request.headers).forEach(function (k) {
			(request.headers[k] instanceof Array ? request.headers[k] : [request.headers[k]]).forEach(function (v) {
				xhr.setRequestHeader(k, v);
			});
		});

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

	HttpMux.prototype._lhm_handleXhrLoad = function () {
		const xhr = this._lhm_currentXhr;
		const info = this._lhm_currentInfo;

		this._lhm_currentXhr = null;
		this._lhm_currentInfo = null;

		if (info.parseFunction) {
			try {
				info.response = info.parseFunction(xhr);
			}
			catch (e) {
				info.error = e;
			}
		}
		
		this._lhm_dispatchEndEvent(info, xhr);
	};
	
	HttpMux.prototype._lhm_handleXhrError = function () {
		const xhr = this._lhm_currentXhr;
		const info = this._lhm_currentInfo;
		
		this._lhm_currentXhr = null;
		this._lhm_currentInfo = null;
		
		info.error = new Error("A transport level error occurred.");
		
		this._lhm_dispatchEndEvent(info, xhr);
	};
	
	HttpMux.prototype._lhm_handleXhrAbort = function () {
		const xhr = this._lhm_currentXhr;
		const info = this._lhm_currentInfo;
		
		this._lhm_currentXhr = null;
		this._lhm_currentInfo = null;
		
		info.aborted = true;
		
		this._lhm_dispatchEndEvent(info, xhr);
	};

	HttpMux.prototype._lhm_handleXhrTimeout = function () {
		const xhr = this._lhm_currentXhr;
		const info = this._lhm_currentInfo;
		
		this._lhm_currentXhr = null;
		this._lhm_currentInfo = null;
		
		info.timedOut = true;
		
		this._lhm_dispatchEndEvent(info, xhr);
	};
	
	HttpMux.prototype._lhm_dispatchEndEvent = function (aInfo, aXhr) {
		this._lhm_dispatchEvent({
			type: 'end',
			currentTarget: this,
			xhr: aXhr,
			status: aXhr.status,
			statusText: aXhr.statusText,
			response: aInfo.response,
			responseType: aXhr.responseType,
			aborted: aInfo.aborted,
			timedOut: aInfo.timedOut,
			error: aInfo.error
		}, aInfo, false);
	};

	HttpMux.prototype._lhm_normalizeRequest = function (aRequest) {
		const request = {
			url: '',
			method: null,
			headers: {},
			data: null,
			responseType: '',
			timeout: 0,
			parseFunction: null,
			onBegin: null,
			onEnd: null
		};

		if (this._lhm_requestDefaults) {
			for (let k in this._lhm_requestDefaults) {
				request[k] = this._lhm_requestDefaults[k];
			}
		}

		if (aRequest) {
			for (let k in aRequest) {
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

			let url = new Url(request.url);
			let query = Url.parseQuery(request.data);

			for (let k in query) {
				url.setQueryParam(k, query[k], false);
			}

			request.url = url.toString();
			request.data = null;
		}

		if (request.method == 'post' && (typeof request.data) == 'string') {
			let contentTypeSet = false;
			for (let k in Object.keys(request.headers)) {
				if (k.toLowerCase() == 'content-type') {
					contentTypeSet = true;
					break;
				}
			}

			if (!contentTypeSet) {
				request.headers['content-type'] = 'application/x-www-form-urlencoded';
			}
		}

		return request;
	};

	HttpMux.prototype._lhm_dispatchEvent = function (aEvent, aInfo, aOrder) {
		//queue persistent listeners
		const listeners = (aEvent.type in this._lhm_listeners) ? this._lhm_listeners[aEvent.type].concat([]) : [];

		//queue one-time listener
		let k = 'on' + StringUtils.upperCaseFirst(StringUtils.dashToCamel(aEvent.type));
		if (k in aInfo) {
			if (aInfo[k]) {
				listeners[aOrder ? 'push' : 'unshift'](aInfo[k]);
			}
		}

		for (let i = 0; i < listeners.length; i++) {
			listeners[i].call(this, aEvent);
		}
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield['Ok']['HttpMux'] = HttpMux;
	}

	return HttpMux;
});
