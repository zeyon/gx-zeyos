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
