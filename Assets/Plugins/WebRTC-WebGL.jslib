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

	$parseTagsOnLoad: function () {

		if (window.addEventListener) {
			window.addEventListener('message', listenIframe, false);

		} else if (window.attachEvent) {
			window.attachEvent('onmessage', listenIframe);
		}

	},

	$refreshPage: function () {
		location.reload();
	},

	$setCookie: function (name, value, days) {

		try {
			var expires = "";
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = "; expires=" + date.toUTCString();
			}
			document.cookie = name + "=" + (value || "") + expires + "; path=/";
		} catch (error) {
			globalVariables.sessionData[name] = value;
		}
	},

	$listenIframe: function (event) {

		if (!(event.origin + '/' == 'https://widgets.bingewave.com/' || event.origin + '/' == 'https://www.bingewave.com/' || event.origin + '/' == 'http://iframe.bingewave.local/')) {
			//return;
		}

		if (event.data && (typeof event.data === 'string' || event.data instanceof String)) {

			try {
				var data = JSON.parse(event.data);

				if (data.command && data.command == 'require_login') {
					globalVariables.token = data.token;

				} else if (data.command && data.command == 'set_auth_token') {
					globalVariables.token = data.token;
					setCookie('bw_auth_token', globalVariables.token);

				} else if (data.command && data.command == 'refresh_page') {
					refreshPage();

				} else if (data.elementid) {
					var iFrameID = document.getElementById(data.elementid.replace(":80", ""));

					if (iFrameID && data.height && data.height > 0) {
						iFrameID.style.height = parseInt(data.height) + "px";
						iFrameID.height = parseInt(data.height);
					}
				}
			} catch (error) {
				console.log("Catch Error");
				console.log(error);
			}
		}
	},

	init: function (data) {

		if (typeof data === 'object' && data !== null) {
			if (data['auth_token']) {
				globalVariables.token = data['auth_token'];
				this.token = data['auth_token'];
			}
		}

		if (!globalVariables.token) {

			var tmpToken = getCookie('bw_auth_token');

			if (tmpToken) {
				globalVariables.token = tmpToken;
			}
		}

		windowReady(function () {
			initCookie();
			parseTagsOnLoad();
			//parseTags();
		});
	},

};

autoAddDeps(BingewaveConnector, '$globalVariables');
autoAddDeps(BingewaveConnector, '$initCookie');
// autoAddDeps(BingewaveConnector, '$addCssToDocument');
// autoAddDeps(BingewaveConnector, '$createRegisterModal');
autoAddDeps(BingewaveConnector, '$refreshPage');
autoAddDeps(BingewaveConnector, '$setCookie');
autoAddDeps(BingewaveConnector, '$getCookie');
// autoAddDeps(BingewaveConnector, '$switchModals');
// autoAddDeps(BingewaveConnector, '$parseTags');
autoAddDeps(BingewaveConnector, '$parseTagsOnLoad');
autoAddDeps(BingewaveConnector, '$listenIframe');
// autoAddDeps(BingewaveConnector, '$displayAd');
// autoAddDeps(BingewaveConnector, '$displayAdGroup');
// autoAddDeps(BingewaveConnector, '$displayAdSpace');
// autoAddDeps(BingewaveConnector, '$displaySponsoredContent');
// autoAddDeps(BingewaveConnector, '$displayWatchView');
// autoAddDeps(BingewaveConnector, '$displayStream');
// autoAddDeps(BingewaveConnector, '$displayBroadcast');
// autoAddDeps(BingewaveConnector, '$displayStreamAndBroadcast');
// autoAddDeps(BingewaveConnector, '$displayEventTicket');
// autoAddDeps(BingewaveConnector, '$displayChat');
// autoAddDeps(BingewaveConnector, '$displayOnlineUsers');
// autoAddDeps(BingewaveConnector, '$displayWebRTC');
// autoAddDeps(BingewaveConnector, '$displayWebRtcClassroom');
// autoAddDeps(BingewaveConnector, '$displayNotepad');
// autoAddDeps(BingewaveConnector, '$displayEventJoin');
// autoAddDeps(BingewaveConnector, '$displayEventPopup');
// autoAddDeps(BingewaveConnector, '$displayMessenging');
// autoAddDeps(BingewaveConnector, '$displayConferenceTickets');
// autoAddDeps(BingewaveConnector, '$displayVoting');
// autoAddDeps(BingewaveConnector, '$displayEventPayWall');
// autoAddDeps(BingewaveConnector, '$displayLiveProducts');
// autoAddDeps(BingewaveConnector, '$displayProducts');
// autoAddDeps(BingewaveConnector, '$displayNeedsFrame');
// autoAddDeps(BingewaveConnector, '$displayNeedsFeedFrame');
// autoAddDeps(BingewaveConnector, '$displayOpportunitiesFrame');
// autoAddDeps(BingewaveConnector, '$displayOpportunitiesFeedFrame');
// autoAddDeps(BingewaveConnector, '$displayPromotionsFrame');
// autoAddDeps(BingewaveConnector, '$displayPromotionsFeedFrame');
// autoAddDeps(BingewaveConnector, '$displayManagePromotionsFrame');
// autoAddDeps(BingewaveConnector, '$displayCollaborationFrame');
// autoAddDeps(BingewaveConnector, '$displayVideosPlayList');
// autoAddDeps(BingewaveConnector, '$displayPodcast');
// autoAddDeps(BingewaveConnector, '$renderIframe');
autoAddDeps(BingewaveConnector, '$windowReady');
// autoAddDeps(BingewaveConnector, '$updateQueryStringParameter');
mergeInto(LibraryManager.library, BingewaveConnector);