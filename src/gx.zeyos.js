/**
 * @extends gx.core
 */
gx.zeyos = {};

// Calculate Browser scroll bar width
window.addEvent('domready', function() {
	var html = $$('html');
	var lang = html.get('lang');

	if ( lang == null || lang == '') {
		html.set('lang', 'ltr-en')
	}
});

/**
 * Additional
 * @type {Class}
 */
Request.File = new Class({
    Extends: Request,

    options: {
        emulation: false,
        urlEncoded: false
    },

    initialize: function(options){
        this.xhr = new Browser.Request();
        this.formData = new FormData();
        this.setOptions(options);
        this.headers = this.options.headers;
    },

    addFile: function(elem) {
        this.append(elem.get('name'), elem.files[0]);
        return this;
    },

    append: function(key, value){
        this.formData.append(key, value);
        return this.formData;
    },

    reset: function(){
        this.formData = new FormData();
    },

    send: function(options) {
        if (options == null)
            options = {};

        var url = options.url || this.options.url;

        this.options.isSuccess = this.options.isSuccess || this.isSuccess;
        this.running = true;

        var xhr = this.xhr;
        xhr.open('POST', url, true);
        xhr.onreadystatechange = this.onStateChange.bind(this);

        Object.each(this.headers, function(value, key){
            try{
                xhr.setRequestHeader(key, value);
            }catch(e){
                this.fireEvent('exception', [key, value]);
            }
        }, this);

        this.fireEvent('request');
        xhr.send(this.formData);

        if(!this.options.async) this.onStateChange();
        if(this.options.timeout) this.timer = this.timeout.delay(this.options.timeout, this);
        return this;
    }
});