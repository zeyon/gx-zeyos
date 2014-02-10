(function () {
	var Datebox = new gx.zeyos.Datebox(null, {
		'timestamp': 0,
		'unit': 'milliseconds',
		'format': ['d', '.', 'M', '.', 'y', '&nbsp;', 'h', ':', 'i'],
		'month': ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.']
	});

	var txtTimestamp = new Element('input', {'type': 'number', 'value': (new Date()).getTime()});

	// Demo Injection
	$(document.body).adopt(__({'children': [
		{'tag': 'h5', 'html': 'gx.zeyos.Datebox'},
		{'class': 'p-10 b_t-1 b_b-1', 'child': Datebox.display()},
		{'class': 'p-10 bg-E', 'children': {
			btnDateboxSet : {'tag': 'button', 'class': 'm_r-5', 'html': 'Set date', 'onClick': function() {
				Datebox.set(txtTimestamp.get('value'));
			}},
			btnDateboxGet : {'tag': 'button', 'class': 'm_r-5', 'html': 'Get date', 'onClick': function() {
				alert(Datebox.get());
			}},
			label: {'tag': 'label', 'class': 'm_l-10 m_r-5', 'html': 'Timestamp:'},
			ts : txtTimestamp
		}}
	]}));
})();
