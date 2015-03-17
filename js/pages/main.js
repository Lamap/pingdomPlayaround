require.config({
	baseUrl: ".",
	paths: {
		"jquery": "./js/libs/jquery-1.10.2.min",
		"loginModule": "./js/modules/login/login",
		"localStorageHandler": "./js/utils/localStorageHandler",
		"ajaxService": "./js/utils/ajaxService"
	}
});
var loginModule = null;
var reportModule = null;
require(["jquery", "loginModule", "ajaxService"], function($, createLoginModule, createService) {
	$(document).ready(function() {
		var service = createService();
		service.isAuthenticated(function(data) {
			if(!data.err) {
				window.location.href = "./report.html";
				return;
			}
		});
		var loginModule = createLoginModule();
		loginModule.init();
	});
});