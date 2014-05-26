/**
 * @class gx.zeyos.Dialog
 * @description Create a
 * @extends gx.ui.Container
 *
 * @param {html element} display Html element to adopt the panel.
 * @param {object} options
 * @option {int} height
 * @option {stirng} title
 */
gx.zeyos.Dialog = new Class({
	Extends: gx.ui.Container,
	options: {
		'title': '',
		'height': 400
	},
	_frames: {},
	_current: false,
	initialize: function(display, options) {
		if (display == null) {
			display = new Element('div');
			$(document.body).adopt(display);
		}
		this.parent(display, options);

		this._ui.title = new Element('div', {'class': 'bg-F fs-18 br_t-5', 'html': this.options.title});
		this._ui.content = new Element('div', {'styles': {
			height: this.options.height,
			overflow: 'auto'
		}});
		this._ui.footer = new Element('div', {'class': 'mi_t-10'});
		this._ui.root.adopt([
			this._ui.title,
			new Element('hr'),
			this._ui.content,
			this._ui.footer
		]);
	},

	/**
	 * @method setTitle
	 * @description Set the dialog title
	 * @param {string} title
	 */
	setTitle: function(title) {
		if ( gx.util.isString(title) ) {
			this._ui.title.set('html', title);
		} else {
			this._ui.title.empty();
			this._ui.title.adopt(title);
		}
	},

	/**
	 * @method initFooter
	 * @description Initialize the footer
	 * @param {object|element} buttons
	 * @return {element}
	 */
	initFooter: function(buttons) {
		switch (typeOf(buttons)) {
			case 'element':
				return buttons;
				break;
			case 'object':
			case 'array':
				break;
			default:
				return __({'child': {'tag': 'button', 'class': 'fl-r', 'html': _('action.close'), 'onClick': function() {
				ZeyOSApi.hidePop();
			}}});
		}

		var div = new Element('div'),
		    list = [];
		Object.each(buttons, function(p, key) {
			var btn = new Element('button', {'class': 'm_l-5 fl-r', 'html': (p.icon == null ? '' : '<i class="icon-'+p.icon+'"></i> ') + p.label});
			if (p.click != null)
				btn.addEvent('click', p.click);
			if (p.primary)
				btn.addClass('em fb');
			div['_'+key] = btn;
			list.push(btn);
		});
		list.reverse();
		list.push(new Element('div', {'class': 'clr'}));
		div.adopt(list);
		return div;
	},

	/**
	 * @method openFrame
	 * @description Open a specific frame
	 * @param {string} key The frame ID
	 * @return {object} The selected frame (title: string, content: element, footer: object)
	 */
	openFrame: function(key) {
		if (this._current)
			this._current.content.setStyle('display', 'none');

		this._current = this._frames[key];

		this._ui.content.empty();
		this._ui.content.adopt(this._current.content);

		this._ui.footer.empty();
		this._ui.footer.adopt(this._current.footer);

		if (this._current.title != null)
			this.setTitle(this._current.title);

		return this._current;
	},

	/**
	 * @method getFrame
	 * @description Returns a specific frame
	 * @param {string} key The frame ID
	 * @return {object}
	 */
	getFrame: function(key) {
		return this._frames[key];
	},

	/**
	 * @method addFrame
	 * @description Adds a dialog frame
	 * @param {string} key The frame ID
	 * @param {object} options Frame options (title: string, content: element, footer: element)
	 * @param {bool} open Open the frame (if this is the first frame, it will be opened by default)
	 */
	addFrame: function(key, options, open) {
		this._frames[key] = {
			title: options.title == undefined ? null : options.title,
			content: __(options.content),
			footer: this.initFooter(options.footer)
		};

		if ((!this._current && open !== false) || open === true) {
			this.openFrame(key);
		}
	},

	/**
	 * @method addSubmitFrame
	 * @description Add the success frame
	 * @param {string} key The frame ID
	 * @param {element} content The frame content
	 * @param {function} onSubmit Submit action
	 * @param {bool} open Open the frame (if this is the first frame, it will be opened by default)
	 * @return {object} The content object
	 */
	addSubmitFrame: function(key, content, onSubmit, open) {
		this.addFrame(key, {
			title: this.options.title,
			content: __({'children': content}),
			footer: {
				close: {label: _('action.close'), click: function() {
					ZeyOSApi.hidePop();
				}},
				ok: {label: _('action.ok'), primary: true, click: function() {
					onSubmit();
				}}
			}
		}, open);
		return content;
	},

	/**
	 * @method addFormFrame
	 * @description Add a form frame frame
	 * @param {string} key The frame ID
	 * @param {element} form The form content {key: [label, elem], ...}
	 * @param {function} onSubmit Submit action
	 * @param {bool} open Open the frame (if this is the first frame, it will be opened by default)
	 * @return {object} The form object {key: elem, ...}
	 */
	addFormFrame: function(key, form, onSubmit, open) {
		var frm = {},
		    content = [],
		    m = '';

		Object.each(form, function(elem, key) {
			// Add the label
			content.push({'tag': 'p', 'html': elem[0] == null ? '' :elem[0], 'class': m});
			m = 'm_t-1M'; // Margin for following elements

			// Add the field
			content.push(elem[1]);
			frm[key] = elem[1];
		});

		this.addSubmitFrame(key, content, onSubmit, open);

		return frm;
	},

	/**
	 * @method addSuccessFrame
	 * @description Add the success frame
	 * @param {string} key The frame ID
	 * @param {string|element} msg The success message
	 * @param {string} link The link to the created element
	 * @param {bool} open Open the frame (if this is the first frame, it will be opened by default)
	 */
	addSuccessFrame: function(key, msg, link, open) {
		this.addFrame(key, {
			title: this.options.title,
			content: __({'styles': {'text-align': 'center'}, 'children': {
				icon: {'styles': {
					'color': '#73b03c',
					'font-size': '96px',
					'text-shadow': '2px 2px #EFEFEF'
				}, 'child': {'tag': 'i', 'class': 'icon-ok'}},
				msg: {'styles': {
					'margin-top': '10px',
					'margin-bottom': '20px',
					'font-size': '14px'
				}, 'child': __(msg)},
				link: link == null ? null : {'tag': 'button', 'class': 'em fb', 'html': '<i class="icon-link-ext"></i> ' + _('action.open'), 'onClick': function() {
					window.open(link);
				}}
			}})
		}, open);
	},

	/**
	 * @method getFormValues
	 * @description Returns the values of a form object
	 * @param {object} form
	 * @return {object}
	 */
	getFormValues: function(form) {
		var res = {};

		Object.each(form, function(field, key) {
			switch (typeOf(field)) {
				case 'element':
					res[key] = field.get('value');
					break;
				case 'object':
					if (instanceOf(field, gx.ui.Container)) {
						if (typeOf(form.getValue) == 'function')
							res[key] = field.getValue();
						else if (typeOf(field.getValues) == 'function')
							res[key] = field.getValues();
						else if (typeOf(field.getId) == 'function')
							res[key] = field.getId();
						else if (typeOf(field.get) == 'function')
							res[key] = field.get();
					}
					break;
			}
		});

		return res;
	}
});
