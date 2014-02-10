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
