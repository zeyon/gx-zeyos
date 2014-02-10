(function () {
	var Msgbox = new gx.zeyos.Msgbox();

	var txtMessage = new Element('input', {'type': 'text'});
	var selDropdown = new gx.zeyos.Dropdown(null, {
		'label': 'Icon class',
		'items': {
			'success': 'Success',
			'error': 'Error',
			'warning': 'Warning'
		}
	});

	// Demo Injection
	$(document.body).adopt(__({'children': [
		{'tag': 'h5', 'html': 'gx.zeyos.Msgbox'},
		{'class': 'p-10 b_t-1 b_b-1', 'children': [
			{'tag': 'label', 'html': 'Message text:'},
			txtMessage,
			selDropdown
		]},
		{'class': 'p-10 bg-E', 'children': {
			showmsg : {'tag': 'button', 'html': 'Show message', 'onClick': function() {
				Msgbox.show(txtMessage.value, selDropdown.getValue());
			}}
		}}
	]}));
})();
