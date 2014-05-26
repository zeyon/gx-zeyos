/**
 * @class gx.zeyos.Permission
 * @description Creates a ZeyOS-Style permission box
 * @extends gx.ui.Container
 * @implements gx.util.Console
 *
 * @param {element|string} display The display element
 *
 * @option {float} timestamp The initial time of the element
 * @option {string} unit The default input unit (milliseconds, seconds)
 * @option {array} format The format of the date box (d: day, m: month, y: year)
 * @option {array} month The month ("Jan.", ...)
 *
 * @event update
 *
 * @sample Datebox Simple datebox example.
 */
gx.zeyos.Permission = new Class({
	gx: 'gx.zeyos.Permission',
	Extends: gx.ui.Container,
	options: {
		'value': true,
		'groups': []
	},
	_fields: {},
	_labels: {},
	_shared: false,
	initialize: function(display, options) {
		var root = this;
		this.parent(display, options);

		var labelFields = {
			'owner'  : ['Owner', 'field.owner'],
			'public' : ['Public', 'field.public'],
			'shared' : ['Shared', 'field.shared'],
			'private': ['Private', 'field.private']
		};

		if (typeof _ === 'function') {
			Object.each(labelFields, function(f, key) {
				this._labels[key] = _(f[1]);
			}.bind(this));
		} else {
			Object.each(labelFields, function(f, key) {
				this._labels[key] = f[0];
			}.bind(this));
		}

		this._display.select = new gx.zeyos.SelectFilter(null, {
			data: this.options.groups,
			allowEmpty: true
		});

		this._display.checkbox = new Element('input', {'type': 'checkbox', 'class': 'm_r-6X'});
		this._display.indicator = new Element('span', {'class': 'fc-B6 fn m_l-10X'});
		this._display.root.adopt([
			__({'tag': 'p', 'child':
				{'tag': 'label', 'children': [
					this._display.checkbox,
					this._labels.owner,
					this._display.indicator
				]}
			}),
			this._display.select
		]);

		this._display.checkbox.addEvent('click', function(event) {
			if (!this._display.checkbox.checked) {
				this.set(false);
			} else {
				this.set(true);
			}
		}.bind(this));

		this.set(this.options.value);
	},

	/**
	 * @method set
	 * @description Sets the timestamp according to the given unit
	 * @param {false|true|int} permission Sets the permission (FALSE: private, TRUE: public, INT: Group ID)
	 */
	set: function(permission) {
		if (permission === false || permission === 'private') {
			// Private
			this._display.select._display.textbox.set('placeholder', '(' + this._labels.private + ')');
			this._display.indicator.set('html', '(' + this._labels.private + ')');
			this._display.select.set();
			this._display.select.disable();
			this._display.checkbox.checked = false;
			this._shared = false;
		} else {
			this._display.select._display.textbox.set('placeholder', '(' + this._labels.public + ')');
			this._display.indicator.set('html', '(' + this._labels.shared + ')');
			this._display.checkbox.checked = true;
			this._display.select.enable();
			this._display.select.reset();
			this._shared = true;
			if (permission !== true && permission !== 'public') {
				this._display.select.setId(permission);
			}
		}
	},

	/**
	 * @method get
	 * @description Returns the current selection
	 * @return
	 */
	get: function() {
		if (this._shared) {
			var group = this._display.select.getId();
			return group == null ? 'public' : group;
		}

		return 'private';
	}
});
