/**
 * @class gx.zeyos.Request
 * @description Utility class to send REST requests
 * @extends gx.core.Settings
 *
 * @option {string} service
 * @option {string} accesskey
 *
 * @event error (Message, Response, Header)
 * @event failure
 * @event exception
 * @event success
 *
 * @sample Msgbox Try the different messagebox types with custom text.
 */
gx.zeyos.Request = new Class({
	Extends: gx.core.Settings,
	options: {
		'service': false,
		'accesskey': false
	},
	_files: [],
	initialize: function (options) {
		this.parent(options);

		if (typeOf(options.showError) == 'function') {
			this.showError = options.showError;
		}
		
		this.baseUrl = '../remotecall/'+this.options.service+(this.options.accesskey ? ':'+this.options.accesskey : '')+'/';
	},

	/**
	 * @method setService
	 * @description Sets the ZeyOS REST service
	 * @param {string} service The service name
	 * @param {string} accesskey The access key
	 */
	setService: function(service, accesskey) {
		this.options.service = service;
		this.options.accesskey = accesskey == null ? accesskey : false;
	},

	/**
	 * @method send
	 * @description Performs a HTTP request
	 * @param {string} path The REST path (e.g. "list/") - please mind the exact name of your resource (e.g. mind trailing slashes)
	 * @param {object|string} data The request data
	 * @param {function} callback The callback function
	 * @param {string} method
	 */
	send: function(path, data, callback, method) {
		var reqOptions = {
			'url': this.baseUrl + path,
			'method': method,
			'data': data,
			'onRequest': function() {
				this.fireEvent('request');
			}.bind(this),
			'onComplete': function() {
				this.fireEvent('complete');
			}.bind(this),
			'onFailure': function(xhr) {
                this.fireEvent('failure', xhr);
				if (xhr.responseText !== '') {
					var json = xhr.responseText;
					res = JSON.decode(json);
					if (typeOf(res) == 'object') {
						if (res.error != null)
							this.fireEvent('error', 'Error: '+res.error);
						else
                            this.fireEvent('error', 'Server error (' + xhr.status + ') ' + json);
					}
				}
			}.bind(this),
            'onException': function(headerName, json) {
                this.fireEvent('exception', [json, headerName]);
                res = JSON.decode(json);
                if (typeOf(res) == 'object') {
                    if (res.error != null) {
                        this.fireEvent('error', 'Error: ' + res.error);
                    } else if (res.result == null) {
                        this.fireEvent('error', 'Invalid response (no result): '+json);
                    } else {
                        callback(res.result, headerName);
                    }
                } else {
                    this.fireEvent('error', 'Invalid response: ' + json);
                }
            }.bind(this),
			'onSuccess': function(json) {
				this.fireEvent('success', json);
                res = JSON.decode(json);
                if (typeOf(res) == 'object') {
                    if (res.error != null) {
                        this.fireEvent('error', 'Error: ' + res.error);
                    } else if (res.result == null) {
                        this.fireEvent('error', 'Invalid response (no result): '+json);
                    } else {
                        callback(res.result, '200 OK');
                    }
                } else {
                    this.fireEvent('error', 'Invalid response: ' + json);
                }
			}.bind(this)
		};
		var req;
		if (this._files[0] != null) {
			req = new Request.File(reqOptions);
			this._files.each(function(elem) {
				req.addFile(elem);
			});
		} else {
			req = new Request(reqOptions);
		}
		req.send();
		this._files = [];
	},
	
	/**
	 * @method showError
	 * @description Displays an error message
	 * @param {string} err
	 */
	showError: function(err) {
		// ZeyOSApi.showMsgRuntimeError(err);
		alert(err);
	},
	
	/**
	 * @method openLink
	 * @description Opens a link in new window
	 * @param {string} path The REST path (e.g. "list/") - please mind the exact name of your resource (e.g. mind trailing slashes)
	 */
	openLink: function(path) {
		window.open(this.baseUrl + path, '_blank');
	},
	
	/**
	 * @method upload
	 * @description Performs a POST request with file upload
	 * @param {string} path The REST path (e.g. "list/") - please mind the exact name of your resource (e.g. mind trailing slashes)
	 * @param {object|string} data The request data
	 * @param {array} files Array of file elements to upload
	 * @param {function} callback The callback function
	 */
	upload: function(path, data, files, callback) {
		this._files = files;
		this.send(path, data, callback, 'POST');
	},
	
	/**
	 * @method post
	 * @description Performs a POST request
	 * @param {string} path The REST path (e.g. "list/") - please mind the exact name of your resource (e.g. mind trailing slashes)
	 * @param {object|string} data The request data
	 * @param {function} callback The callback function
	 */
	'post': function(path, data, callback) {
		this.send(path, data, callback, 'POST');
	},
	
	/**
	 * @method get
	 * @description Performs a GET request
	 * @param {string} path The REST path (e.g. "list/") - please mind the exact name of your resource (e.g. mind trailing slashes)
	 * @param {object|string} data The request data
	 * @param {function} callback The callback function
	 */
	'get': function(path, data, callback) {
		this.send(path, data, callback, 'GET');
	},
	
	/**
	 * @method put
	 * @description Performs a PUT request
	 * @param {string} path The REST path (e.g. "list/") - please mind the exact name of your resource (e.g. mind trailing slashes)
	 * @param {object|string} data The request data
	 * @param {function} callback The callback function
	 */
	'put': function(path, data, callback) {
		this.send(path, data, callback, 'PUT');
	},
	
	/**
	 * @method delete
	 * @description Performs a DELETE request
	 * @param {string} path The REST path (e.g. "list/") - please mind the exact name of your resource (e.g. mind trailing slashes)
	 * @param {object|string} data The request data
	 * @param {function} callback The callback function
	 */
	'delete': function(path, data, callback) {
		this.send(path, data, callback, 'PUT');
	}
});


