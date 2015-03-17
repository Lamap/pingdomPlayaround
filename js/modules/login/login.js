define(["jquery", "ajaxService"], function($, createAjaxService) {
	var DEFAULT_WARNING = "Wrong credentials";

	return function createLoginModule() {
		console.log("createLoginModule");
		var warningMessage = $("#warningMessage");
		var login = {
			form: $("#loginForm"),
			password: $("#password"),
			username: $("#username")
		};
		var service = createAjaxService();


		function init() {
			login.form.submit(sendLogin);
			login.password.focus(inputFieldsGetFocus);
			login.username.focus(inputFieldsGetFocus);

			if(!navigator.cookieEnabled) {
				warn("You must enable cookies for logging in.");
			}
		}

		function inputFieldsGetFocus() {
			warningMessage.text(DEFAULT_WARNING);
			warningMessage.hide();
		}

		function sendLogin(e) {
			e.preventDefault();

			var postData = {
				password: login.password[0].value,
				username: login.username[0].value
			};

			if(!postData.password || !postData.username) {
				return;
			}

			service.login(postData, onLoginReceived);
		}

		function onLoginReceived(data) {
			if(data.err) {
				return warn(data.err);
			}
			window.location.href = "./report.html";
		}

		function warn(message) {
			warningMessage.text(message);
			warningMessage.show();
		}
		return {
			init: init
		};
	};
});