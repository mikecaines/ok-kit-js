define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/ExtendableEvent',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
	],
	function (ObjectUtils, ExtendableEvent, StructUtils) {
		"use strict";
		
		/**
		 * @class ConduitDataEvent
		 * @extends Solarfield.Ok.ExtendableEvent
		 *
		 * @property {*} data Data that was pushed into the conduit.
		 *  The data property is writable, and the modified value will be available to the next event listener.
		 */
		return ObjectUtils.extend(ExtendableEvent, {
			/**
			 * @inheritDoc
			 * @param aEventInit
			 * @param aWaitQueue
			 * @param {*} aData The conduit data.
			 */
			constructor: function (aEventInit, aWaitQueue, aData) {
				var init = StructUtils.assign({
					type: 'data',
				}, aEventInit);
				
				ExtendableEvent.call(this, init, aWaitQueue);
				
				Object.defineProperties(this, {
					data: {
						value: aData,
						writable: true
					},
				});
			}
		});
	}
);