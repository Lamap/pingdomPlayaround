define(["jquery"], function($) {
	return function createCookieReaderWriter() {
		function write(name, value, expires, path, domain) {
			if(!name) {
				return;
			}
			if(!value) {
				expires = -1000000;
			}
			var cookie = name + "=" + escape(value) + ";";

			if(expires && !isNaN(expires)) {
				expires = new Date(new Date().getTime() + expires);
				cookie += "expires=" + expires.toGMTString() + ";";
			}


			if (typeof path === "string") {
				cookie += "path=" + path + ";";
			}
			if (typeof domain === "string") {
				cookie += "domain=" + domain + ";";
			}

			document.cookie = cookie;
		}

		function read(name) {
			if(!name) {
				return;
			}
			var cookiestring = RegExp("" + name + "[^;]+").exec(document.cookie);
			return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
		}

		return {
			read: read,
			write: write
		};
	};
});