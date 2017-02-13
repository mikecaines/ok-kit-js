define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/EventTarget'
	],
	/**
	 *
	 * @param {Solarfield.Ok.ObjectUtils} ObjectUtils
	 * @param {Solarfield.Ok.EventTarget} EventTarget
	 * @returns {Solarfield.Ok.ProgressMap}
	 */
	function (ObjectUtils, EventTarget) {
		"use strict";

		/**
		 * @class Solarfield.Ok.ProgressMap
		 */
		var ProgressMap = ObjectUtils.extend(null, {
			/**
			 * @param aEvt
			 * @protected
			 */
			dispatchEvent: function (aEvt) {
				this._aopm_eventTarget.dispatchEvent(this, aEvt);
			},

			addEventListener: function (aType, aListener) {
				this._aopm_eventTarget.addEventListener(aType, aListener);
			},

			set: function (aCode, aDetails) {
				if (!this.has(aCode)) this._aopm_size++;

				this._aopm_data[aCode] = aDetails;

				this.dispatchEvent({
					type: 'update',
					target: this
				});
			},

			delete: function (aCode) {
				var item = this.get(aCode);

				if (this.has(aCode)) this._aopm_size--;
				delete this._aopm_data[aCode];

				this.dispatchEvent({
					type: 'update',
					target: this
				});

				return item;
			},

			get: function (aCode) {
				return this.has(aCode) ? this._aopm_data[aCode] : null;
			},

			has: function (aCode) {
				return aCode in this._aopm_data;
			},

			getSize: function () {
				return this._aopm_size;
			},

			constructor: function () {
				this._aopm_data = {};
				this._aopm_size = 0;
				this._aopm_eventTarget = new EventTarget();
			}
		});

		return ProgressMap;
	}
);
