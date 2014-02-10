(function () {
	var zSelect = new gx.zeyos.Select(null, {
		'url': window.location.href.substring(0, window.location.href.lastIndexOf("/")+1) + 'data/select.json',
		'width': '300px'
	});

	// Demo Injection
	$(document.body).adopt(__({'children': [
		{'tag': 'h5', 'html': 'gx.zeyos.Select'},
		{'class': 'p-10 b_t-1 b_b-1', 'children': [
			{'tag': 'label', 'html': 'Selection demo:'},
			zSelect
		]},
		{'class': 'p-10 bg-E', 'children': {
			btnSelectValue : {'tag': 'button', 'html': 'Get selection', 'onClick': function() {
				alert(JSON.encode(zSelect.getSelected()));
			}},
			btnSelectReset : {'tag': 'button', 'html': 'Reset', 'onClick': function() {
				zSelect.set();
			}}
		}}
	]}));
})();
