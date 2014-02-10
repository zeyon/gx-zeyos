(function () {
	var Popup = new gx.zeyos.Popup({
		'width': 300
	});

	var txtContent = new Element('textarea');

	// Demo Injection
	$(document.body).adopt(__({'children': [
		{'tag': 'h5', 'html': 'gx.zeyos.Popup'},
		{'class': 'p-10 b_t-1 b_b-1', 'children': [
			'Enter your HTML content into the textarea:',
			txtContent
		]},
		{'class': 'p-10 bg-E', 'children': {
			btnOpen : {'tag': 'button', 'html': 'Open Popup', 'onClick': function() {
				Popup.setContent(txtContent.get('value'));
				Popup.show();
			}}
		}}
	]}));
})();
