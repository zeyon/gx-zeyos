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
