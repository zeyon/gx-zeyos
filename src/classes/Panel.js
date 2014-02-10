/**
 * @method Panel
 */
/**
 * @class gx.zeyos.Panel
 * @description Create simple toggle panel
 * @extends gx.ui.Container
 *
 * @param {html element} display Html element to adopt the panel.
 * @param {string|html element} title Title of the panel.
 * @param {string|html element} content Content of the panel.
 * @param {boolean} open Open panel after creation.
 */
gx.zeyos.Panel = new Class({
	Extends: gx.ui.Container,
	initialize: function(display, title, content, open) {
		var root = this;
		this._title = new Element('h1').addEvent('click', function(){
			root.toggle();
		});
		this._content = new Element('div', {
			'class': 'b-25 bg-W d-b'
		});
		this._section = new Element('section', {
			'class': 'bg-E br_b-5 bsd-3 p-7'
		});

		this.parent(display);
		this.toElement().set({'class': 'm_l-10 m_r-10 m_t-10'}).adopt([
			this._title,
			this._section.adopt([
				this._content
			])
		]);

		if ( title != null )
			this.setTitle(title);

		if ( content != null )
			this.setContent(content);

		if ( open == undefined || open != false )
			this.open();
	},

	setTitle: function(title) {
		if ( gx.util.isString(title) ) {
			this._title.set('html', title);
		} else {
			this._title.empty();
			this._title.adopt(title);
		}
	},

	setContent: function(content) {
		if ( gx.util.isString(content) ) {
			this._content.set('html', content);
		} else {
			this._content.empty();
			this._content.adopt(content);
		}
	},

	open: function() {
		this._title.addClass('act');
		this._section.show();
	},

	close: function() {
		this._title.removeClass('act');
		this._section.hide();
	},

	toggle: function() {
		if ( this._title.hasClass('act') )
			this.close();
		else
			this.open();
	}
})
