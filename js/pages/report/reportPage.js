require.config({
	baseUrl: ".",
	paths: {
		"jquery": "./js/libs/jquery-1.10.2.min",
		"localStorageHandler": "./js/utils/localStorageHandler",
		"ajaxService": "./js/utils/ajaxService",
		"reportModule": "./js/modules/report/report",
		"highCards": "http://code.highcharts.com/highcharts"
	}
});
var reportModule = null;
require(["jquery", "reportModule", "ajaxService", "localStorageHandler"], function($, createReportModule, createService, createStorage) {
	$(document).ready(function() {
		var logOutButton = $("#logoutButton");
		var service = createService();
		var storage = createStorage();
		service.isAuthenticated(function(data) {
			if(data.err) {
				window.location.href = "./login.html";
				return;
			}
		});
		logOutButton.click(logOut);


		function logOut() {
			storage.write("token", null);
			window.location.href = "./login.html";
		}
		reportModule = createReportModule();
		reportModule.init();
	});
});