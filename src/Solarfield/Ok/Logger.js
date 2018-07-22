define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
	],
	function (ObjectUtils, StructUtils) {
		"use strict";
		
		/**
		 * A logger that provides support for all RFC 5424 levels, and forwards to the global/browser console.
		 * Calls to log with an unknown level, will fallback to the behaviour of the window.console.log method.
		 * @class Logger
		 * @see https://tools.ietf.org/html/rfc5424#page-11
		 */
		var Logger = ObjectUtils.extend(null, {
			log: function (aLevel, aMessage, aContext) {
				this.logItem({
					channel: this.name,
					level: aLevel,
					message: aMessage,
					context: aContext,
				});
			},
			
			emergency: function (aMessage, aContext) {
				this.log('EMERGENCY', aMessage, aContext);
			},
			
			alert: function (aMessage, aContext) {
				this.log('ALERT', aMessage, aContext);
			},
			
			critical: function (aMessage, aContext) {
				this.log('EMERGENCY', aMessage, aContext);
			},
			
			error: function (aMessage, aContext) {
				this.log('EMERGENCY', aMessage, aContext);
			},
			
			warn: function (aMessage, aContext) {
				this.log('WARNING', aMessage, aContext);
			},
			
			warning: function (aMessage, aContext) {
				this.warn(aMessage, aContext);
			},
			
			notice: function (aMessage, aContext) {
				this.log('NOTICE', aMessage, aContext);
			},
			
			info: function (aMessage, aContext) {
				this.log('INFO', aMessage, aContext);
			},
			
			debug: function (aMessage, aContext) {
				this.log('DEBUG', aMessage, aContext);
			},
			
			/**
			 * Similar to log(), but accepts a message object.
			 * If the item contains a channel property, it will override use of the logger's name, when displaying output.
			 * @param {{}} aItem - The item to log.
			 * @param {string} aItem.channel - A label for the source of the message.
			 * @param {string} aItem.level - The severity level. e.g. INFO, WARNING, ERROR, etc.
			 * @param {string} aItem.message - The text of the message.
			 * @param {{}} aItem.context - Any additional context information.
			 */
			logItem: function (aItem) {
				var channel = (''+(aItem.channel||''));
				var level = (''+(aItem.level||'')).toUpperCase();
				var message = (''+(aItem.message||''));
				var context = aItem.context;
				var funcName, funcArgs;
				
				
				//if level is known
				if (level in Logger._sol_levels) {
					funcName = Logger._sol_levels[level];
					
					funcArgs = [message];
					if (context !== undefined) funcArgs.push(context);
				}
				
				//else level is unknown, treat args as console.log() style
				else {
					funcName = 'log';
					funcArgs = Array.prototype.slice.call(arguments); //convert arguments to an Array
				}
				
				
				//if we have a channel
				if (channel) {
					//prepend the channel to the output
					funcArgs.unshift('%c' + channel.replace(/%/g, '%%'), 'color:GrayText', '');
				}
				
				//else we don't have a channel
				else {
					//if args are in "message, substitutions" style
					if (funcArgs.length >= 2 && typeof funcArgs[0] == 'string') {
						//escape % characters (substitution markers) in message
						funcArgs[0] = funcArgs[0].replace(/%/g, '%%');
					}
				}
				
				console[funcName].apply(console, funcArgs);
			},
			
			/**
			 * Clones this logger, and gives the clone the specified name.
			 * @param {string=} [aName=''] The name of the new logger.
			 * @return {Logger}
			 */
			withName: function (aName) {
				return new this.constructor({
					name: aName,
				});
			},
			
			/**
			 * @constructor
			 * @param {{}=} aOptions - Configuration options.
			 * @param {string=} [aOptions.name=''] - The name/channel of the logger.
			 */
			constructor: function (aOptions) {
				var options = StructUtils.assign({
					name: '',
				}, aOptions);
				
				/**
				 * @public
				 * @type {string}
				 */
				this.name = ''+(options.name||'');
			},
		});
		
		/**
		 * @static
		 * @private
		 */
		Logger._sol_levels = {
			EMERGENCY: 'error',
			ALERT: 'error',
			CRITICAL: 'error',
			ERROR: 'error',
			WARNING: 'warn',
			NOTICE: 'info',
			INFO: 'info',
			DEBUG: 'debug',
		};
		
		return Logger;
	}
);
