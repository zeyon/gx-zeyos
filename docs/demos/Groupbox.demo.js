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
