(function () {
	var Tabbox = new gx.zeyos.Tabbox(null, {
		'height': 150,
		'frames': [
			{'name': 'tab1', 'title': 'First Tab', 'content':
				__('Nulla facilisi. Nunc volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut sit amet orci vel mauris blandit vehicula.')
			},
			{'name': 'tab2', 'title': 'Second Tab', 'content':
				__('Donec semper, sem nec tristique tempus, justo neque commodo nisl, ut gravida sem tellus suscipit nunc. Aliquam erat volutpat. Ut tincidunt pretium elit. Aliquam pulvinar.')
			},
			{'name': 'tab3', 'title': 'Third Tab', 'content':
				__('Donec dapibus orci sit amet elit. Maecenas rutrum ultrices lectus. Aliquam suscipit, lacus a iaculis adipiscing, eros orci pellentesque nisl, non pharetra dolor urna nec dolor.')
			}
		]
	});

	// Demo Injection
	$(document.body).adopt(__({'children': [
		{'tag': 'h5', 'html': 'gx.zeyos.Tabbox'},
		{'class': 'p-10 b_t-1 b_b-1', 'child': Tabbox}
	]}));
})();

