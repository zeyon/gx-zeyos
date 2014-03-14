/**
 * @class gx.zeyos.Table
 * @description Creates a dynamic select box, which dynamically loads the contents from a remote URL.
 * @extends gx.ui.Container
 * @implements gx.util.Console
 * @sample Table
 *
 * @event click
 * @event dblclick
 * @event filter
 * @event rowAdd
 * @event addData
 * @event setData
 * @event complete
 * @event beforeRowAdd
 * @event afterRowAdd
 *
 * @option {array} cols          The table column structure
 * @option {function} structure  Formatting row data into columns (returns an array)
 * @option {array}    data       The list data
 * @option {bool}     scroll     Make table body scrollable
 * @option {bool}     autoresize Register a window.onResize event for Column Sync
 * @option {bool}     selectable Display selectable checkboxes
 */
gx.zeyos.Table = new Class({
	gx: 'gx.zeyos.Table',
	Extends: gx.ui.Container,
	options: {
		'cols': [
			{'label': 'Column 1', 'id': 'col1', 'width': '20px', 'filter': 'asc'},
			{'label': 'Column 2', 'id': 'col2'}
		],
		'structure': function(row, index) {
			return [
				row.col1,
				{'label': row.col2, 'className': row.col2class}
			];
		},
		'data'        : [],
		'scroll'      : true,
		'autoresize'  : true,
		'selectable'  : false,
		'checkOnClick': true,
		'sortable'    : false,
		'height'      : '400px'
	},
	_cols: [],
	_rows: [],
	_filter: false,
	_colspan: 0,
	_scrollBarCol: false,

	initialize: function(display, options) {
		var root = this;
		try {
			this.parent(display, options);
			//this.addEvent('complete', this.adoptSizeToHead.bind(this));

			this._display.table    = new Element('table', {'class': 'tbl'});
			this._display.thead    = new Element('thead');
			this._display.theadRow = new Element('tr', {'class': 'tbl_head'});
			this._display.tbody    = new Element('tbody');

			this._display.root.adopt(
				this._display.table.adopt([
					this._display.thead.adopt(
						this._display.theadRow
					),
					this._display.tbody
				])
			);

			this.buildCols();

			if (this.options.scroll) {
				this._display.header = new Element('table', {'class': 'tbl'});
				this._display.header.inject(this._display.root, 'top');
				this._display.header.adopt(this._display.thead);
				this._display.wrapper = new Element('div', {'styles': {'overflow-y': 'scroll', 'height': this.options.height}});
				this._display.wrapper.wraps(this._display.table);

				this._display.emptyCol = new Element('th');
				this._display.theadRow.adopt(this._display.emptyCol);

				this.addEvent('display', function() {
					this.syncColWith.delay(100, this);
				}.bind(this));

				if (this.options.autoresize) {
					window.addEvent('resize', function() {
						this.syncColWith();
					}.bind(this));
				}
				this.addEvent('complete', function() {
					this.syncColWith();
				}.bind(this));
			}

			if (this.options.selectable && this.options.checkOnClick) {
				this.addEvent('click', function(row) {
					if (event.target == row.checkbox)
						return;
					row.checkbox.checked = !row.checkbox.checked;
				}.bind(this));
			}

			this.setData(this.options.data);

			//window.addEvent('resize', this.adoptSizeToHead.bind(this));
		} catch(e) {
			e.message = 'gx.zeyos.Table->initialize: ' + e.message;
			throw e;
		}
	},

	/**
	 * @method syncColWidth
	 * @description Synchronize the column width
	 */
	syncColWith: function() {
		if (!this.options.scroll)
			return;

		var scrollWidth = this._display.header.getSize().x - this._display.table.getSize().x;
		this._display.emptyCol.setStyle('width', scrollWidth);
		// this._display.emptyCol.setStyle('background', 'red');

		var row = this._display.tbody.getElement('tr');
		if (row == null)
			return;

		var th = this._display.theadRow.getElements('th');
		row.getElements('td').each(function(td, index) {
			if (th[index] != null)
				th[index].setStyle('width', td.getSize().x);
		});
	},

	/**
	 * @method buildCols
	 * @description Builds the columns
	 * @param {array} cols An array of columns
	 */
	buildCols: function(cols) {
		try {
			if (this.options.selectable) {
				this._display.checkall = new Element('input', {'type': 'checkbox'});
				this._display.checkall.addEvent('click', function() {
					var deselect = true;
					this._rows.each(function(row, index) {
						if (!row.checkbox.checked)
							deselect = false;
					});
					this._rows.each(function(row) {
						row.checkbox.checked = !deselect;
					});
					checkall.checked = !deselect;
				}.bind(this));
				this.options.cols = [{
					'label'     : this._display.checkall,
					'width'     : '20px',
					'filterable': false,
					'className' : 'tbl_chk'
				}].append(this.options.cols);
			}

			this.options.cols.each(function(col) {
				col.th = new Element('th');
				switch (typeOf(col.label)) {
					case 'object' :
						col.th.adopt(__(col.label));
						break;
					case 'element':
						col.th.adopt(col.label);
						break;
					default:
						col.th.set('html', col.label);
						break;
				}

				if ((col.filter != null || col.filterable != false) && this.options.sortable) {
					col.th.set('data-sort', '-' + col.id );
					col.indicator = col.th;
					col.th.addEvent('click', function() {
						this.setSort(col);
					}.bind(this));
				}

				if (col['text-align'] != null)
					col.th.setStyle('text-align', col['text-align']);

				if (col.width != null)
					col.th.setStyle('width', col.width);
				if (col.className != null)
					col.th.set('class', col.className);
				if (col.filter != null)
					this.setSort(col, col.filter, 1);

				this._display.theadRow.adopt(col.th);
				this._cols.push(col);
			}.bind(this));
			this._colspan = this.options.cols.length;
			// Add one more col to header which automatically scale with of scroll bar width
			// Set default width 16px in case no data will be add at first
			// Erase when data will be add to get automatically scaled.
			//this._scrollBarCol = new Element('th', {'class': ''});
			this._display.theadRow.adopt(this._scrollBarCol);
		} catch(e) {
			e.message = 'gx.zeyos.Table->buildCols: ' + e.message;
			throw e;
		}

		return this;
	},

	/**
	 * @method addData
	 * @description Adds the specified data to the table
	 * @param {array} data The data to add
	 */
	addData: function(data) {
		var odd = false;
		try {
			if ( typeOf(data) != 'array' )
				return this;

			this.fireEvent('addData', data);
			data.each(function(row, index) {
				if ( typeOf(row) != 'object' )
					return;

				var rowProperties = {};
				var cols = this.options.structure(row, index);

				if (gx.util.isObject(cols) && cols.row ) {
					if (cols.properties)
						rowProperties = cols.properties;
					cols = cols.row;
				}

				if (!gx.util.isArray(cols))
					return;

				// Add checkboxes
				if (this.options.selectable) {
					row.checkbox = new Element('input', {'type': 'checkbox', 'value': row.ID});
					cols = [{
						'label': row.checkbox,
						'className': 'tbl_chk'
					}].append(cols);
				}

				row.tr = new Element('tr', rowProperties)
					.addClass('tbl_row');

				this.fireEvent('beforeRowAdd', [row, index] );

				var clickable = (row.clickable == null || row.clickable != false || (this.options.cols[index] != null && this.options.cols[index].clickable != false));

				if (odd)
					row.tr.addClass('bg');
				odd = !odd;

				cols.each(function(col, index) {
					clickable = clickable ? !(this.options.cols[index] != null && this.options.cols[index].clickable == false) : true;
					var td = new Element('td');

					if ( this.options.cols[index].width != null )
						td.setStyle('width', this.options.cols[index].width);

					switch ( typeOf(col) ) {
						case 'object' :
							col = Object.clone(col);

							var labelType = typeOf(col.label);
							if ( (labelType === 'element') || (labelType === 'textnode') )
								td.adopt(col.label);
							else
								td.set('html', col.label);

							clickable = ( (col.clickable == null) || (col.clickable != false) );
							if ( col.className != null )
								td.addClass(col.className);

							delete col.label;
							delete col.clickable;
							delete col.className;

							td.set(col);

							break;

						case 'element':
						case 'textnode':
							td.adopt(col);
							break;
						default:
							td.set('html', col);
							break;
					}

					if ( this._cols[index]['text-align'] != null )
						td.setStyle('text-align', this._cols[index]['text-align']);

					if (clickable) {
						td.addEvent('click', function(event) {
							this.fireEvent('click', [ row, event, index ] );
						}.bind(this));
						td.addEvent('dblclick', function(event) {
							this.fireEvent('dblclick', [ row, event, index ] );
						}.bind(this));
					}
					row.tr.adopt(td);
				}.bind(this));
				this._display.tbody.adopt(row.tr);
				this._rows.push(row);
				this.fireEvent('rowAdd', [row, index] );
				this.fireEvent('afterRowAdd', [row, index] );
			}.bind(this));
			//if( data.length > 0 ) this._scrollBarCol.erase('style');
			this.fireEvent('complete', data);
		} catch(e) {
			e.message = 'gx.zeyos.Table->addData: ' + e.message;
			throw e;
		}

		return this;
	},

	/**
	 * @method setData
	 * @description Sets the list data. Calls empty() and then addData(data)
	 * @param {array} data The list data to set
	 */
	setData: function(data) {
		this._rows = [];
		this.empty();
		this.fireEvent('setData', data)
		return this.addData(data);
	},

	/**
	 * @method setSort
	 * @description Sorts the table according to the specified column and mode
	 * @param {object} col The column that is decisive for the sorting
	 * @param {string} mode The sorting order: 'asc' or 'desc'
	 * @param noEvent
	 */
	setSort: function(col, mode, noEvent) {
		if ( !this._filter )
			this._filter = {};

		if ( mode == null ) {
			if ( col.th.get('data-sort').indexOf('-') > -1 ) {
				mode = 'asc';
				var prefix = '';
			} else {
				mode = 'desc';
				var prefix = '-';
			}
		}

		if ( mode == 'asc' ) {
			this._filter.mode = 'desc';
			var opPrefix = '-';
		} else {
			this._filter.mode = 'asc';
			var opPrefix = '';
		}

		for ( var i = 0; i < this._cols.length; i++ ) {
			var currentCol = this._cols[i];
			currentCol.th.removeClass('act');
			currentCol.th.set('data-sort', opPrefix + currentCol.id);
		}

		col.th.set('data-sort', prefix + col.id);
		col.th.addClass('act');

		this._filter.indicator = col.th;
		this._filter.id        = col.id;

		if (noEvent == null)
			this.fireEvent('filter', [col, this._filter.mode]);

		return this;
	},

	/**
	 * @method getFilter
	 * @description Returns the filter object {mode: 'asc'|'desc', id: COLID}
	 */
	getFilter: function() {
		return this._filter;
	},

	/**
	 * @method empty
	 * @description Clears the table body
	 */
	empty: function() {
		this._display.tbody.empty();
		return this;
	},

	getSelection: function() {
		var selection = [];
		this._rows.each(function(row) {
			if (row.checkbox == null || !row.checkbox.checked)
				return;

			selection.push(row);
		}.bind(this))

		return selection;
	}
});
