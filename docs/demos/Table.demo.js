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
		'onClick': function(row) {
			alert(JSON.encode(row));
		},
		'onFilter': function(col) {
			alert(JSON.encode(col));
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
			btnAddData : {'tag': 'button', 'html': 'Add data', 'onClick': function() {
				var temp = Array.clone(data);
				temp.push({'customername': 'Another One', 'customernum': '1003943295792836012345719837632809467', 'lastmodified': '1220454105'});
				Table.setData(temp);
			}}
		}}
	]}));
})();
