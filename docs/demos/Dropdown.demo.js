(function () {
	var Dropdown = new gx.zeyos.Dropdown(null, {
		'label': 'Sample menu',
		'items': {
			'test1': 'Test 1',
			'test2': 'Test 2',
			'test3': 'Test 3',
			'test4': 'Test 4',
			'test5': 'Test 5',
			'test6': 'Test 6'
		}
	});

	// Demo Injection
	$(document.body).adopt(__({'children': [
		{'tag': 'h5', 'html': 'gx.zeyos.Dropdown'},
		{'class': 'p-10 b_t-1 b_b-1', 'child': Dropdown.display()},
		{'class': 'p-10 bg-E', 'children': {
			btnGetValue : {'tag': 'button', 'html': 'Get value', 'onClick': function() {
				alert(Dropdown.getValue());
			}}
		}}
	]}));
})();
