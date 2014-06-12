/**
 * @class gx.zeyos.Toggle
 * @description Creates a switch component
 * @extends gx.ui.Container
 *
 * @param {element|string} display The display element
 *
 * @option {mixed} value
 * @option {boolean} on The initial switch state (default: off)
 *
 * @event check
 * @event uncheck
 */
gx.zeyos.Toggle = new Class({
	Extends: gx.ui.Container,

	options: {
		'value': true,
		'on': false
	},

	initialize: function(display, options) {
		if (display == null)
			display = new Element('fieldset');
		this.parent(display, options);

		var root = this;
		if (this._display.root.get('tag') == 'fieldset') {
			this._display.fieldset = this._display.root;
		} else {
			this._display.fieldset = new Element('fieldset', {'class': 'm_r-10'}).inject(this._display.root, 'top');
		}

		this._display.fieldset.addClass('tgl');
		this._display.fieldset.addEvent('click', function() {
			root.toggle();
		});

		if ( this.options.on )
			this._display.fieldset.addClass('act');
	},

	getState: function() {
		if ( this._display.fieldset.hasClass('act') )
			return true;
		else
			return false;
	},

	getValue: function() {
		if ( this._display.fieldset.hasClass('act') )
			return this.options.value;
		else
			return false;
	},

	toggle: function() {
		if ( this._display.fieldset.hasClass('act') )
			this.setUnchecked();
		else
			this.setChecked();
	},

	setChecked: function() {
		this._display.fieldset.addClass('act');
		this.fireEvent('check');
	},

	setUnchecked: function() {
		this._display.fieldset.removeClass('act');
		this.fireEvent('uncheck');
	}
});
