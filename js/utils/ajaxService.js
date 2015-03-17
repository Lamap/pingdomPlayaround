define(["jquery", "localStorageHandler"], function($, createStorageHandler) {
	var LOGIN_ROUTE = "http://jobtestapi.pingdom.net/v1/login";
	var DATA_ROUTE = "http://jobtestapi.pingdom.net/v1/check";

	var DEFAULT_TIME_INTERVAL = {
		from: new Date("01/01/2015").getTime() / 1000,
		to: new Date("01/31/2015").getTime() / 1000
	};
	
	return function createAjaxService() {
		var storage = createStorageHandler();

		function login(credentials, callback) {
			if(typeof callback !== "function") {
				throw("callback parameter must be a function");
			}
			$.post(LOGIN_ROUTE, credentials).always(function(data) {
				var returning = {err: null};
				if(data.status !== "ok") {
					returning.err = "Failed to log in.";
					if(data.responseJSON && data.responseJSON.message) {
						returrning.err = data.responseJSON.message;
					}
					return callback(returning);
				}

				if(!data.token) {
					returning.err = "No token received";
					return callback(returning);
				}

				var token = data.token;
				storage.write("token", token, 1000 * 60 * 60 * 8);
				callback(data);
			});
		}

		function isAuthenticated(callback) {
			if(typeof callback !== "function") {
				throw("callback parameter must be a function");
			}
			var settings = {
				token: storage.read("token"),
				from: new Date().getTime() - 1,
				to: new Date().getTime()
			};
			$.get(DATA_ROUTE, settings).always(function(data) {
				var returning = {err: null};
				if(data.status !== "ok") {
					if(data.responseJSON && data.responseJSON.message) {
						returning.err = data.responseJSON.message;
					}
					return callback(returning);
				}
				callback(returning);
			});
		}

		function getReport(callback, from, to) {
			if(typeof callback !== "function") {
				throw("callback parameter must be a function");
			}
			var settings = {
				token: storage.read("token"),
				from: from || DEFAULT_TIME_INTERVAL.from,
				to: to || DEFAULT_TIME_INTERVAL.to
			};
			$.get(DATA_ROUTE, settings).always(function(data) {
				var returning = {err: null};
				if(data.status !== "ok") {
					if(data.responseJSON && data.responseJSON.message) {
						returning.err = data.responseJSON.message;
					}
					return callback(returning);
				}

				if(!(data.average_response instanceof Array) || !(data.state_changes instanceof Array)) {
					returning.err = "Service error, invalid response";
					return callback(returning);
				}
				returning = data;
				callback(returning);
			});
		}

		return {
			isAuthenticated: isAuthenticated,
			login: login,
			getReport: getReport
		};
	};
});