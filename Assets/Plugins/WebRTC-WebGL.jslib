var BingewaveConnector = {

	// Instance stores a reference to the Singleton
	$globalVariables: {
		instance: null,
		page_view_id: null,
		deepest_scroll: 0,
		endpoint: 'https://bw.bingewave.com/',
		token: null,
		frames: [],
		sessionData: {}
	},

	$initCookie: function () {
		var cookieImage = document.createElement("img");
		cookieImage.src = "https://widgets.bingewave.com/cookie";
		cookieImage.setAttribute("style", "display : none;");
		document.body.appendChild(cookieImage);
		var cookieTag = document.createElement("input");
		cookieTag.setAttribute("style", "display : none;");
		cookieTag.setAttribute("type", "hidden");
		cookieTag.setAttribute("name", "bw_xdomain_cookie");
		cookieTag.setAttribute("value", "value_you_want");
	},
	
	$getCookie: function (name) {
		try {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
		} catch (error) {
			if (globalVariables.sessionData[name]) {
				return globalVariables.sessionData[name];
			}

			return null;;
		}
	},

	$windowReady: function (callback) {
		// in case the document is already rendered
		if (document.readyState != 'loading') callback();
		// modern browsers
		else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
		// IE <= 8
		else document.attachEvent('onreadystatechange', function () {
			if (document.readyState == 'complete') callback();
		});
	},

	init: function (data) {

		window.alert(data);

		if (typeof data === 'object' && data !== null) {
			if (data['auth_token']) {
				globalVariables.token = data['auth_token'];
				this.token = data['auth_token'];
			}
		}

		if (!globalVariables.token) {
			var tmpToken = getCookie("bw_auth_token");
			if (tmpToken) {
				globalVariables.token = tmpToken;
			}
		}

		windowReady(function () {

			initCookie();
			//parseTagsOnLoad();
			//parseTags();
		});
	},

};

autoAddDeps(BingewaveConnector, '$globalVariables');
autoAddDeps(BingewaveConnector, '$getCookie');
autoAddDeps(BingewaveConnector, '$initCookie');
autoAddDeps(BingewaveConnector, '$windowReady');
mergeInto(LibraryManager.library, BingewaveConnector);