/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/lightship-js/src/Solarfield/Ok/Url',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok.ObjectUtils,
			true
		);
	}
})
(function (ObjectUtils, _createGlobals) {
	"use strict";

	/**
	 * @class Url
	 */
	var Url = ObjectUtils.extend(null, {
		getHost: function () {
			return this._sou_parts.host;
		},

		setHost: function (aHost) {
			this._sou_parts.host = aHost != null ? aHost+'' : '';
		},

		getPort: function () {
			return this._sou_parts.port;
		},

		setPort: function (aPort) {
			this._sou_parts.port = aPort != null ? aPort+'' : '';
		},

		getScheme: function () {
			return this._sou_parts.scheme;
		},

		setScheme: function (aScheme) {
			this._sou_parts.scheme = aScheme != null ? aScheme+'' : '';
		},

		getQuery: function () {
			return this.constructor.serializeQuery(this._sou_parts['query']);
		},

		setQuery: function (aQuery) {
			this._sou_parts.query = this.constructor.parseQuery(aQuery);
		},

		getQueryParamsAll: function () {
			return this._sou_parts.query;
		},

		getQueryParams: function () {
			var params, name;

			params = {};
			for (name in this._sou_parts.query) {
				params[name] = this._sou_parts.query[name][0];
			}

			return params;
		},

		getQueryParamAll: function (aName) {
			if (aName in this._sou_parts.query) {
				return this._sou_parts.query[aName];
			}

			return [];
		},

		getQueryParam: function (aName) {
			if (aName in this._sou_parts.query) {
				return this._sou_parts.query[aName][0];
			}

			return '';
		},

		setQueryParam: function (aName, aValue, aReplace) {
			var replace = arguments.length >= 3 ? aReplace : true;
			var values, i;

			values = aValue != null && aValue.constructor == Array ? aValue : [aValue];

			//normalize all values to string type
			for (i = 0; i < values.length; i++) {
				if (typeof values[i] != 'string') {
					values[i] = values[i] != null ? values[i]+'' : '';
				}
			}

			if (replace) {
				this._sou_parts.query[aName] = values;
			}

			else {
				if ((aName in this._sou_parts.query) == false) {
					this._sou_parts.query[aName] = values;
				}

				else {
					this._sou_parts.query[aName] = this._sou_parts.query[aName].concat(values);
				}
			}
		},

		removeQueryParam: function (aName) {
			delete this._sou_parts.query[aName];
		},

		getPath: function () {
			return this._sou_parts.path;
		},

		setPath: function (aPath) {
			this._sou_parts.path = aPath != null ? aPath+'' : '';
		},

		pushPath: function (aPath) {
			this._sou_parts.path += aPath;
		},

		pushDir: function (aDir) {
			if (this._sou_parts.path.search(/\/$/) < 0) {
				this._sou_parts.path += '/';
			}

			this._sou_parts.path += encodeURIComponent(aDir) + '/';
		},

		setFileName: function (aDir) {
			if (this._sou_parts.path.search(/\/$/) < 0) {
				this._sou_parts.path += '/';
			}

			this._sou_parts.path += encodeURIComponent(aDir);
		},

		getFileName: function () {
			var matches;

			if ((matches = this._sou_parts['path'].match(/([^/]+)$/))) {
				return matches[1];
			}
			
			return '';
		},

		toString: function () {
			var v;
			var str = '';

			if (this._sou_parts.host != '') {
				if (this._sou_parts.scheme != '') {
					str += this._sou_parts.scheme + '://';
				}
				else {
					str += this._sou_parts.slashes;
				}
			}

			if (this._sou_parts.host != '') {
				str += this._sou_parts.host;
			}

			if (this._sou_parts.port != '') {
				str += ':' + this._sou_parts.port;
			}

			if (this._sou_parts.path != '') {
				if (str != '') {
					if (this._sou_parts.path.search(/^\//) == -1) {
						str += '/';
					}
				}

				str += this._sou_parts.path;
			}

			v = this.constructor.serializeQuery(this._sou_parts.query);
			if (v != '') str += '?' + v;

			if (this._sou_parts.fragment != '') {
				str += '#' + this._sou_parts.fragment;
			}

			return str;
		},

		constructor: function (aString) {
			var matches;

			this._sou_parts = {
				scheme : '',
				slashes : '',
				host : '',
				port : '',
				path : '',
				query : {},
				fragment : ''
			};

			if (aString != null && aString != '') {
				matches = (aString+'').match(/^(?:([^:\/]+):)?(\/\/)?([^\/:]*)?(?::(\d*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/);
				if (matches == null || matches.length != 8) {
					throw "Could not parse string as URL: '" + aString + "'.";
				}

				if (matches[1] != null) this._sou_parts.scheme = matches[1];
				if (matches[2] != null) this._sou_parts.slashes = matches[12];
				if (matches[3] != null) this._sou_parts.host = matches[3];
				if (matches[4] != null) this._sou_parts.port = matches[4];
				if (matches[5] != null) this._sou_parts.path = matches[5];
				if (matches[6] != null) this._sou_parts.query = this.constructor.parseQuery(matches[6]);
				if (matches[7] != null) this._sou_parts.fragment = matches[7];
			}
		}
	});

	/**
	 * Parses a value into an object containing key-value pairs.
	 * @param {null|string|Object} aQuery
	 * @returns {Object}
	 * @static
	 */
	Url.parseQuery = function (aQuery) {
		var parsedQuery, pairs, query, pair, pairParts, paramName, paramValue, i, values;

		if (aQuery == null || aQuery == '') {
			parsedQuery = {};
		}

		else if ((typeof aQuery) == 'string') {
			pairs = aQuery.split('&');
			query = {};

			for (i = 0; i < pairs.length; i++) {
				pair = pairs[i];
				pairParts = pair.split('=');
				paramName = decodeURIComponent(pairParts[0]);
				paramValue = pairParts.length > 1 ? decodeURIComponent(pairParts[1]) : '';
				if ((paramName in query) == false) {
					query[paramName] = [];
				}
				query[paramName].push(paramValue);
			}

			parsedQuery = query;
		}

		else if (aQuery.constructor == Object) {
			parsedQuery = {};

			Object.keys(aQuery).forEach(function (key) {
				if ((key in parsedQuery) == false) {
					parsedQuery[key] = [];
				}

				values = (aQuery[key] != null && aQuery[key].constructor == Array) ? aQuery[key] : [aQuery[key]];

				values.forEach(function (value) {
					parsedQuery[key].push('' + value);
				})
			});
		}

		else {
			throw new Error("aQuery must be a null, string, or Object.");
		}

		return parsedQuery;
	};

	/**
	 * @static
	 */
	Url.serializeQuery = function (aQuery) {
		var str, name, values, i;

		str = '';
		for (name in aQuery) {
			values = aQuery[name].constructor === Array ? aQuery[name] : [aQuery[name]];

			for (i = 0; i < values.length; i++) {
				if (str != '') str += '&';
				str += encodeURIComponent(name) + '=' + encodeURIComponent(values[i]);
			}
		}

		return str;
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.Url = Url;
	}

	return Url;
});