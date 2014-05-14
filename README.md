Gx ZeyOS Components
===================

Gx is an extensible component library built on MooTools. The ZeyOS module includes various components for building add-on for ZeyOS.


Demos
-----

All demos from the `./docs/demos/` directory and be viewed on our [Demo page](http://gx.zeyon.net/zeyos/)


Components
----------

### gx.zeyos.Select ###

Creates a dynamic select box, which dynamically loads the contents from a remote URL

#### Demo ####

```js
(function () {
	var SelectPrio = new gx.zeyos.SelectPrio();

	var SelectFilter = new gx.zeyos.SelectFilter();
	(new Request({url: './data/select.json', onSuccess: function(json) {
		SelectFilter.setData(JSON.decode(json));
	}})).send();

	var SelectDyn = new gx.zeyos.SelectDyn(null, {
		'url': window.location.href.substring(0, window.location.href.lastIndexOf("/")+1) + 'data/select.php',
		'onRequestSuccess': function(json) {
			this.setData(JSON.decode(json));
		}
	});

	// Demo Injection
	$(document.body).adopt(__({'children': [
		{'tag': 'h5', 'html': 'gx.zeyos.Select'},
		{'class': 'pad-10', 'children': [
			{'tag': 'label', 'html': 'Selection demo:'},
			{'class': 'p_t-10', 'child': SelectPrio},
			{'class': 'p_t-10', 'child': SelectFilter},
			{'class': 'p_t-10 p_b-10', 'child': SelectDyn}
		]},
		{'class': 'p-10 bg-E', 'children': {
			btnSelectValue : {'tag': 'button', 'class': 'btn btn-primary', 'html': 'Get selection', 'onClick': function() {
				alert(JSON.encode(SelectFilter.getSelected()));
			}},
			btnSelectReset : {'tag': 'button', 'class': 'btn btn-default', 'html': 'Reset', 'onClick': function() {
				SelectFilter.set();
			}}
		}}
	]}));

})();

```

### gx.zeyos.Table ###

```js
(function() {
	var data = [
		{'customername': 'HyperFlyer', 'customernum': '1003', 'lastmodified': '1220454105'},
		{'customername': 'InScreen Design', 'customernum': '1004', 'lastmodified': '1220454283'},
		{'customername': 'GlobalSpin Travel Agency', 'customernum': '1005', 'lastmodified': '1220454466'},
		{'customername': 'nTronic AG', 'customernum': '1001', 'lastmodified': '1220453517'},
		{'customername': 'CleanTexx', 'customernum': '1002', 'lastmodified': '1220454105'},
	];
	var Table = new gx.zeyos.Table(null, {
		'cols': [
			{'label': 'Name', 'id': 'customername'},
			{'label': 'Number', 'id': 'customernum', 'text-align': 'right'},
			{'label': 'Last change', 'id': 'lastmodified'}
		],
		'structure': function(row) {
			return [
				row.customername,
				row.customernum,
				new Date(row.lastmodified * 1000).format('%d.%m.%Y %H:%M')
			];
		},
		'data': data,
		'scroll': true,
		'selectable': true,
		'onClick': function(row) {
			console.log(row.customernum);
		},
		'onFilter': function(col, mode) {
			alert(col.id + ': ' + mode);
		}
	});

	// Demo Injection
	$(document.body).adopt(__({'children': [
		{'tag': 'h5', 'html': 'gx.zeyos.Table'},
		{'class': 'b-1', 'child': Table.display()},
		{'class': 'p-10 bg-E', 'children': {
			btnTableEmpty : {'tag': 'button', 'class': 'm_r-5', 'html': 'Empty', 'onClick': function() {
				Table.empty();
			}},
			btnTableSet : {'tag': 'button', 'class': 'm_r-5', 'html': 'Set data', 'onClick': function() {
				Table.setData(data);
			}},
			btnAddData : {'tag': 'button', 'class': 'm_r-5', 'html': 'Add data', 'onClick': function() {
				var temp = Array.clone(data);
				temp.push({'customername': 'Another One', 'customernum': '1003943295792836012345719837632809467', 'lastmodified': '1220454105'});
				Table.setData(temp);
			}},
			btnGetSelection : {'tag': 'button', 'html': 'Get selection', 'onClick': function() {
				console.log(Table.getSelection());
			}}
		}}
	]}));
})();

```

### gx.zeyos.Checklist ###

```js
(function () {
	var Checklist = new gx.zeyos.Checklist(null, {
		'data': [
			{'ID': 0, 'label': 'Test1'},
			{'ID': 1, 'label': 'Test2'},
			{'ID': 2, 'label': 'Test3'}
		]
	});

	// Demo Injection
	$(document.body).adopt(__({'children': [
		{'tag': 'h5', 'html': 'gx.zeyos.Checklist'},
		{'class': 'p-10 b_t-1 b_b-1', 'child': Checklist.display()},
		{'class': 'p-10 bg-E', 'children': {
			btnChecklist : {'tag': 'button', 'html': 'Get value', 'onClick': function() {
				alert(JSON.encode(Checklist.getValues()));
			}}
		}}
	]}));
})();

```

### gx.zeyos.Groupbox ###

```js
(function () {
	var Groupboxes = [
		new gx.zeyos.Groupbox(__({'html': 'Hello world'}), {'title': 'First Groupbox', 'open': true}),
		new gx.zeyos.Groupbox(__({'html': 'Hello world'}), {'title': 'Second Groupbox'}),
		new gx.zeyos.Groupbox(__({'html': 'Hello world'}), {'title': 'Third'})
	];

	// Demo Injection
	$(document.body).adopt(__({'children': [
		{'tag': 'h5', 'html': 'gx.zeyos.Groupbox'},
		{'class': 'p-10 b_t-1 b_b-1', 'children': Groupboxes},
		{'class': 'p-10 bg-E', 'children': {
			btnToggle : {'tag': 'button', 'class': 'm_r-5', 'html': 'Toggle all', 'onClick': function() {
				Groupboxes.each(function(gb) {
					gb.toggle();
				});
			}},
			btnOpen : {'tag': 'button', 'class': 'm_r-5', 'html': 'Open all', 'onClick': function() {
				Groupboxes.each(function(gb) {
					gb.open();
				});
			}},
			btnClose : {'tag': 'button', 'html': 'Close all', 'onClick': function() {
				Groupboxes.each(function(gb) {
					gb.close();
				});
			}}
		}}
	]}));
})();

```

### gx.zeyos.Permission ###

```js
(function () {
	var Permission = new gx.zeyos.Permission(null, {
		groups: [
			{ID: 1, name: 'Adminstrators'},
			{ID: 2, name: 'Marketing'},
			{ID: 5, name: 'Sales'},
			{ID: 6, name: 'Developers'},
			{ID: 7, name: 'Support'}
		]
	});

	// Demo Injection
	$(document.body).adopt(__({'children': [
		{'tag': 'h5', 'html': 'gx.zeyos.Permission'},
		{'class': 'p-10 b_t-1 b_b-1', 'child': Permission},
		{'class': 'p-10 bg-E', 'children': {
			btnPermissionSetPrivate : {'tag': 'button', 'class': 'm_r-5', 'html': 'Set private', 'onClick': function() {
				Permission.set(false);
			}},
			btnPermissionSetPublic : {'tag': 'button', 'class': 'm_r-5', 'html': 'Set public', 'onClick': function() {
				Permission.set(true);
			}},
			btnPermissionSetGroup : {'tag': 'button', 'class': 'm_r-5', 'html': 'Set group', 'onClick': function() {
				Permission.set(2);
			}},
			btnPermissionGetValue : {'tag': 'button', 'class': 'm_r-5', 'html': 'Get value', 'onClick': function() {
				alert(Permission.get());
			}}
		}}
	]}));
})();

```

Usage
-----

Compile using [Grunt](http://gruntjs.com/)


Credits
-------

Gx has been actively development for a couple of years now. Contributors are

 * Peter-Christoph Haider (Lead Developer)
 * Sebastian Glonner
 * Hoang Nguyen

Gx is a project by [Zeyon](http://www.zeyon.net)
