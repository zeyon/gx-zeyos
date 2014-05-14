/**
 * @class gx.zeyos.Select
 * @description Creates a dynamic select box, which dynamically loads the contents from a remote URL
 * @extends gx.ui.Container
 *
 * @param  {element|string}  display         The display element
 * @param  {object}          options
 *
 * @option {string}          height          Default: auto
 * @option {string}          selectionPrefix An optional prefix displayed in front of the selected value
 * @option {string}          icon            The glyphikon icon (default: chevron-down)
 * @option (string)          resetable       If set, add an additional list option to reset the selection (e.g. "Select all")
 * @option {string}          textboxClass    Additional textbox class
 * @option {array}           data            Default data
 * @option {string|function} elementIndex    The ID format (default key is "ID"; specify function to overwrite)
 * @option {string|function} elementLabel    Element label or alternative list format (Default returns a:"elem.name")
 * @option {string|function} elementSelect   The label for selected elements or alternative format function
 * @option {object}          elementDefault  Represents a default element, e.g. for "empty" selections
 * @option {string|int}      value           Specifies the default/preset value or simple lists
 *
 * @event show     When the selection list is shown
 * @event hide     When the selection list is hidden
 * @event select   When an element is selected
 * @event noselect When no element is selected
 *
 */
gx.zeyos.Select = new Class({
	gx: 'gx.zeyos.Select',
	Extends: gx.ui.Container,
	options: {
		'height'         : 'auto',
		'allowEmpty'     : false,
		'selectionLabel' : false,
		'icon'           : 'chevron-down',
		'resetable'      : false,
		'textboxClass'   : false,
		'data'           : null,
		'elementIndex'   : 'ID',
		'elementLabel'   : 'name',
		'elementSelect'  : 'name',
		'elementDefault' : null,
		'value'          : null,
		/* Messages */
		'msg'            : {
			'noSelection': 'No Selection'
		}
	},
	_closed    : true,
	_selected  : null,
	_currentElem: null,
	_running   : false,

	initialize: function (display, options) {
		var root = this;
		try {
			this.parent(display, options);

			this._display.root.addClass('gx-zeyos-select');
			this._display.fieldset = new Element('fieldset', {
				'class' : 'sel',
				'name'  : 'view',
				'styles': {'max-width': + root.options.width}
			});
			if (this.options.fieldsetClass)
				this._display.fieldset.addClass(this.options.fieldsetClass);

			this._display.textbox = new Element('input', {
				'type'       : 'text',
				'class'      : 'form-control',
				'placeholder': '('+this.getMessage('noSelection')+')'
			});
			if (this.options.textboxClass)
				this._display.textbox.addClass(this.options.textboxClass);

			this._display.dropdown = new Element('section', {
				'styles': {
					'max-height': this.options.height
				}
			});

			this._display.root.adopt(
				this._display.fieldset.adopt([
					this._display.textbox,
					this._display.dropdown
				])
			);

			// Initialize keyboard controls
			this.fxScoll = new Fx.Scroll(this._display.dropdown, {
				offset: {
					y: -100
				}
			});
			this._display.textbox.addEvents({
				'click': function () {
					this.show();
				}.bind(this),
				'focus': function () {
					this.show();
				}.bind(this),
				'blur': function () {
					this.hide.delay(300, root);
				}.bind(this),
				'keypress': function (event) {
					if ( event.key == 'tab' )
						return;
					if ( event.key == 'up' || event.key == 'down' ) {
						event.preventDefault();
						return;
					}
					if ( this.search == null )
						event.preventDefault(); // Do nothing for simple select boxes
				}.bind(this),
				'keydown': function (event) {
					if ( event.key == 'tab' )
						return;
					if ( event.key == 'up' || event.key == 'down' ) {
						event.preventDefault();
						return;
					}
					if ( this.search == null )
						event.preventDefault(); // Do nothing for simple select boxes
				}.bind(this),
				'keyup': function (event) {
					if ( event.key == 'tab' )
						return;

					if ( event.key == 'esc' ) {
						this.hide();
					} else if ( event.key == 'up' || event.key == 'down' ) {
						event.preventDefault();

						this.show();

						var li;
						if (this._currentElem == null) {
							if(event.key == 'down')
								li = this._display.dropdown.getFirst(':not(.hidden)');
							else
								li = this._display.dropdown.getLast(':not(.hidden)');
						} else {
							if(event.key == 'down') {
								li = this._currentElem.getNext(':not(.hidden)');
								if (li == null && this._currentElem == this._display.dropdown.getLast(':not(.hidden)'))
									li = this._display.dropdown.getFirst(':not(.hidden)');
							} else {
								li = this._currentElem.getPrevious(':not(.hidden)');
								if (li == null && this._currentElem == this._display.dropdown.getFirst(':not(.hidden)'))
									li = this._display.dropdown.getLast(':not(.hidden)');
							}
						}

						if (li != null) {
							if (this._currentElem != null)
								this._currentElem.removeClass('act');
							this._currentElem = li;
							this._currentElem.addClass('act');
							this.fxScoll.toElement(this._currentElem);
						}

						return;
					} else if ( event.key == 'enter' ) {
						if (this._currentElem != null) {
							this._currentElem.fireEvent('click');
						}

						return;
					}

					if ( this.search != null ) {
						this.show();
						this.search();
					} else
						event.preventDefault(); // Do nothing for simple select boxes
				}.bind(this)
			});

			if (gx.util.isFunction(this.options.elementIndex))
				this.getId = this.options.elementIndex.bind(this);

			if (gx.util.isFunction(this.options.elementLabel))
				this.getLink = this.options.elementLabel.bind(this);

			if (gx.util.isFunction(this.options.elementSelect))
				this.showSelection = this.options.elementSelect.bind(this);

			if (gx.util.isArray(this.options.data))
				this.setData(this.options.data);

			if (this.options.value != null && gx.util.isString(this.options.elementIndex)) {
				this.options.data.each(function(entry) {
					if (entry[this.options.elementIndex] == this.options.value)
						this.set(entry, true);
				}.bind(this));
			}
		} catch(e) {
			e.message = 'gx.zeyos.Select: ' + e.message;
			throw e;
		}
	},

	/**
	 * @method set
	 * @description Sets the selected element
	 * @param {object} selection The element to select
	 * @param {bool} noEvents Do not throw events
	 * @returns Returns this instance (for method chaining).
	 * @type gx.zeyos.Select
	 */
	set: function (selection, noEvents) {
		this._selected = selection;
		return this.update(noEvents != false);
	},

	/**
	 * Updates the selection by ID
	 * @param {string|int} id
	 */
	setId: function(id) {
		var data,
		    list = this.getRows();
		for (var i = 0 ; i < list.length ; i++) {
			data = list[i].retrieve('data');
			if ( this.getId(data) == id ) {
				this.set(data);
				return;
			}
		}
		this.options.getId(list[i])
	},

	/**
	 * @method update
	 * @description Updates the select box according to its state of selection
	 * @param {bool} noEvents Do not throw events
	 * @returns Returns this instance (for method chaining).
	 * @type gx.zeyos.Select
	 */
	update: function (noEvents) {
		if (noEvents == null || !noEvents)
			this.fireEvent(this._selected == null ? 'noselect' : 'select', this._selected);

		this.showSelection(this._selected);
		this.hide();

		return this;
	},

	showSelection: function() {
		this._display.textbox.set('value', this._selected == null ? '' : this._selected[this.options.elementSelect]);
	},

	/**
	 * @method getID
	 * @description Returns the ID of the selected element
	 */
	getId: function (elem) {
		if (elem != null)
			return elem[this.options.elementIndex];

		if (this._selected != null)
			return this._selected[this.options.elementIndex];

		return null;
	},

	/**
	 * Returns the element's link
	 *
	 * @param  {object} elem
	 * @return {element}
	 */
	getLink: function(elem) {
		return new Element('div', {
			'class': 'sel_item ico',
			'html': elem[this.options.elementLabel]
		});
	},

	/**
	 * @method getRows
	 * @description Returns the list rows
	 * @return {array}
	 */
	getRows: function() {
		return this._display.dropdown.getElements('>div');
	},

	/**
	 * @method setData
	 * @description Builds a list of links from the provided array
	 * @param {array} list The provided array
	 * @returns Returns this instance (for method chaining).
	 * @type gx.zeyos.Select
	 */
	setData: function (list) {
		var root = this;
		try {
			this._display.dropdown.empty();
			this._currentElem = null;

			if (this.options.resetable) {
				this._display.dropdown.adopt(__({'tag': 'li', 'child':
					{'tag': 'a', 'class': 'reset', 'html': this.options.resetable, 'onClick': function() {
						this.set();
					}.bind(this)}
				}));
			}

			var addCLink = function (link, el) {
				link.addEvent('click', function () {
					root.set(el);
				});
			};

			if ( this.options.elementDefault != null )
				list = [this.options.elementDefault].append(list);

			var len = list.length;

			for ( i = 0 ; i < len ; i++ ) {
				if (list[i] == null)
					continue;

				var row = this.getLink(list[i]);
				if ( this._selected != null && this.options.getId(list[i]) == this.options.getId(this._selected) )
					row.addClass('act');

				row.store('data', list[i]);
				row.store('key', i);
				this._display.dropdown.adopt(row);
				addCLink(row, list[i]);
			}
		} catch(e) {
			gx.util.Console('gx.zeyos.Select->setData', e.message);
		}

		return this;
	},

	/**
	 * @method show
	 * @description Shows the select box
	 * @returns Returns this instance (for method chaining).
	 * @type gx.zeyos.Select
	 */
	show: function () {
		if ( this._display.textbox.disabled )
			return this;

		this._display.fieldset.addClass('act');
		this._display.textbox.focus();

		this.fireEvent('show');
		return this;
	},

	/**
	 * @method hide
	 * @description Hides the select box
	 * @returns Returns this instance (for method chaining).
	 * @type gx.zeyos.Select
	 */
	hide: function () {
		if (!this.isOpen())
			return this;

		this._display.fieldset.removeClass('act');
		this.clearCursor();

		this.fireEvent('hide');
		return this.update();
	},

	/**
	 * @method isOpen
	 * @description Returns if the list box is open
	 * @return {bool}
	 */
	isOpen: function() {
		return this._display.fieldset.hasClass('act');
	},

	/**
	 * @method getValue
	 * @description Alias for getID
	 */
	getValue: function () {
		return this.getId();
	},

	/**
	 * @method getSelected
	 * @description Returns the selected element
	 */
	getSelected: function () {
		return this._selected;
	},

	/**
	 * @method clearCursor
	 * @description Removes the current list selection
	 */
	clearCursor: function() {
		if (this._currentElem == null)
			return;

		this._currentElem.removeClass('act');
		this._currentElem = null;
	},

	/**
	 * @method reset
	 * @description Resets the selection
	 * @param {bool} noEvents Do not throw events
	 * @returns Returns this instance (for method chaining).
	 * @type gx.zeyos.Select
	 */
	reset: function (noEvents) {
		return this.set(null, noEvents);
	},

	/**
	 * @method enable
	 * @description Enables the text box
	 * @returns Returns this instance (for method chaining).
	 * @type gx.zeyos.Select
	 */
	enable: function () {
		this._display.textbox.erase('disabled');
		return this;
	},

	/**
	 * @method disable
	 * @description Disables the text box
	 * @returns Returns this instance (for method chaining).
	 * @type gx.zeyos.Select
	 */
	disable: function () {
		this._display.textbox.set('disabled', true);
		return this;
	}
});

/**
 * @class gx.zeyos.SelectPrio
 * @description Creates a priority select box
 * @extends gx.zeyos.Select
 */
gx.zeyos.SelectPrio = new Class({
	gx: 'gx.zeyos.SelectPrio',
	Extends: gx.zeyos.Select,
	options: {
		elementIndex: 'value',
		data: [
			{'value': 0, 'color': '#008000', 'symbol': '■□□□□', 'label': 'lowest'},
			{'value': 1, 'color': '#ffc000', 'symbol': '■■□□□', 'label': 'low'},
			{'value': 2, 'color': '#ff8000', 'symbol': '■■■□□', 'label': 'medium'},
			{'value': 3, 'color': '#ff4000', 'symbol': '■■■■□', 'label': 'high'},
			{'value': 4, 'color': '#c00000', 'symbol': '■■■■■', 'label': 'highest'}
		],
		msg: {
			'lowest' : 'Lowest',
			'low'    : 'Low',
			'medium' : 'Medium',
			'high'   : 'High',
			'highest': 'Highest'
		},
		value: 0
	},

	showSelection: function() {
		this._display.textbox.set('value', this._selected == null ? '' : this._selected.symbol + ' | ' + this.getMessage(this._selected.label));
	},

	getLink: function(elem) {
		return new Element('div', {
			'class' : 'sel_item',
			'html'  : elem.symbol + ' | ' + this.getMessage(elem.label),
			'styles': {'color': elem.color}
		});
	}
});

/**
 * @class gx.zeyos.SelectFilter
 * @description Creates a filterable search list
 * @extends gx.zeyos.Select
 *
 * @param  {element|string}  display         The display element
 * @param  {object}          options
 *
 * @option {string}          height          Default: 200px
 * @option {string}          selectionPrefix An optional prefix displayed in front of the selected value
 * @option {string}          icon            The glyphikon icon (default: chevron-down)
 * @option (string)          resetable       If set, add an additional list option to reset the selection (e.g. "Select all")
 * @option {string}          textboxClass    Additional textbox class
 * @option {array}           data            Default data
 * @option {string|function} elementIndex    The ID format (default key is "ID"; specify function to overwrite)
 * @option {string|function} elementLabel    Element label or alternative list format (Default returns a:"elem.name")
 * @option {string|function} elementSelect   The label for selected elements or alternative format function
 * @option {object}          elementDefault  Represents a default element, e.g. for "empty" selections
 * @option {string|int}      value           Specifies the default/preset value or simple lists
 * @option {array}           searchfields    List of searchable object fields inside
 *
 */
gx.zeyos.SelectFilter = new Class({
	gx: 'gx.zeyos.SelectFilter',
	Extends: gx.zeyos.Select,
	options: {
		'height'      : '200px',
		'searchfields': ['name']
	},
	_lastSearch: null,

	initialize: function (display, options) {
		var root = this;
		try {
			this.addEvent('show', function() {
				this.search();
			}.bind(this));
			this.parent(display, options);
		} catch(e) {
			e.message = 'gx.zeyos.SelectFilter: ' + e.message;
			throw e;
		}
	},

	/**
	 * @method search
	 * @description Initiates a search request
	 * @returns Returns this instance (for method chaining).
	 */
	search: function () {
		try {
			var query = this._display.textbox.get('value');
			if (this._lastSearch == query)
				return;

			this.clearCursor();
			this._lastSearch = query;
			this._searchQuery(query);

		} catch(e) {
			e.message = 'gx.zeyos.SelectFilter: ' + e.message;
			throw e;
		}
	},

	/**
	 * @method search
	 * @description Performs a search
	 * @returns Returns this instance (for method chaining).
	 */
	_searchQuery: function (query) {
		try {
			this._display.dropdown.getElements('>div').each(function(li) {
				var field,
				    data = li.retrieve('data', {});

				for (var i = 0 ; i < this.options.searchfields.length ; i++) {
					field = this.options.searchfields[i];
					if (query == '') {
						li.removeClass('hidden');
						return;
					}
					switch (typeOf(data[field])) {
						case 'number':
							data[field] = data[field].toString();
						case 'string':
							if (data[field].test(query, 'i')) {
								li.removeClass('hidden');
								return;
							}
					}
				}
				li.addClass('hidden');
			}.bind(this));
		} catch(e) {
			e.message = 'gx.zeyos.SelectFilter: ' + e.message;
			throw e;
		}
	},

	/**
	 * @method showLoader
	 * @description Show the loader icon
	 * @return gx.zeyos.SelectFilter
	 */
	showLoader: function() {
		// this._display.icon.set('class', 'glyphicon glyphicon-refresh');
		return this;
	},

	/**
	 * @method hideLoader
	 * @description Hide the loader icon and restore the default icon
	 * @return gx.zeyos.SelectFilter
	 */
	hideLoader: function() {
		// this._display.icon.set('class', 'glyphicon glyphicon-'+this.options.icon);
	}
});

/**
 * @class gx.zeyos.SelectDyn
 * @description Creates a dynamic select box with searchable conent
 * @extends gx.zeyos.Select
 *
 * @param  {element|string}  display         The display element
 * @param  {object}          options
 *
 * @option {string}          height          Default: 200px
 * @option {string}          selectionPrefix An optional prefix displayed in front of the selected value
 * @option {string}          icon            The glyphikon icon (default: chevron-down)
 * @option (string)          resetable       If set, add an additional list option to reset the selection (e.g. "Select all")
 * @option {string}          textboxClass    Additional textbox class
 * @option {array}           data            Default data
 * @option {string|function} elementIndex    The ID format (default key is "ID"; specify function to overwrite)
 * @option {string|function} elementLabel    Element label or alternative list format (Default returns a:"elem.name")
 * @option {string|function} elementSelect   The label for selected elements or alternative format function
 * @option {object}          elementDefault  Represents a default element, e.g. for "empty" selections
 * @option {string|int}      value           Specifies the default/preset value or simple lists
 * @option {string}          url             The request URL
 * @option {string}          method          The request method (default: GET)
 * @option {string|function} queryParam      The query paramter or a function that returns the request data object (e.g. {search: QUERY, entity: ...})
 * @option {object}          requestData     Default request data
 *
 * @event show     When the selection list is shown
 * @event hide     When the selection list is hidden
 * @event select   When an element is selected
 * @event noselect When no element is selected
 *
 */
gx.zeyos.SelectDyn = new Class({
	gx: 'gx.zeyos.SelectDyn',
	Extends: gx.zeyos.SelectFilter,
	options: {
		'url': './',
		'method': 'GET',
		'queryParam': 'query',
		'parseDefault': false,
		'requestData': {}
	},
	_requestChain:[],
	_firstLoad: false,

	initialize: function (display, options) {
		var root = this;
		try {
			if (options.onRequestSuccess == null)
				this.options.parseDefault = true;


			this.addEvent('show', function() {
				if (this._firstLoad)
					return;

				this.search();
				this._firstLoad = true;
			}.bind(this));

			this.parent(display, options);

			if (gx.util.isFunction(this.options.queryParam))
				this.getRequetData = this.options.queryParam.bind(this);

			if (this.options.parseDefault) {
				this.addEvent('requestSuccess', function(json) {
					var r = gx.util.parseResult(json);
					this.setData(gx.util.isArray(r) ? r : []);
				}.bind(this))
			}
		} catch(e) {
			e.message = 'gx.zeyos.SelectDyn: ' + e.message;
			throw e;
		}
	},

	getRequetData: function(query, data) {
		data[this.options.queryParam] = query;
		return data;
	},

	_searchQuery: function(query) {
		var r = new Request({
			'method'   : this.options.method,
			'url'      : this.options.url,
			'data'     : this.getRequetData(query, Object.clone(this.options.requestData)),
			'onRequest': function() {
				this.showLoader();
			}.bind(this),
			'onComplete': function() {
				this.hideLoader();
				var next = this._requestChain.pop();
				if (next != null && next != r) {
					this._requestChain = []; // Reset the chain, only execute the next request
					next.send();
				}
			}.bind(this),
			'onSuccess': function (json) {
				this.fireEvent('requestSuccess', json);
			}.bind(this),
			'onFailure': function () {
				this.fireEvent('requestFailure');
			}.bind(this)
		});
		this._requestChain.push(r);

		if (this._requestChain.length == 1)
			r.send();
	}
});

