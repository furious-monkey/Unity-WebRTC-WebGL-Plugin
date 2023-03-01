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

	initCookie: function () {

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

	addCssToDocument: function () {
		let css = `
		/**************************\
  Basic Modal Styles
\**************************/

.bw-widget-modal {
  font-family: -apple-system,BlinkMacSystemFont,avenir next,avenir,helvetica neue,helvetica,ubuntu,roboto,noto,segoe ui,arial,sans-serif;
}

.bw-widget-modal__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.bw-widget-modal__container {
  background-color: #fff;
  padding: 30px;
  max-width: 500px;
  max-height: 100vh;
  border-radius: 4px;
  overflow-y: auto;
  box-sizing: border-box;
}

.bw-widget-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bw-widget-modal__title {
  margin-top: 0;
  margin-bottom: 0;
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.25;
  color: #00449e;
  box-sizing: border-box;
}

.bw-widget-modal__close {
  background: transparent;
  border: 0;
}


.bw-widget-modal__content {
  margin-top: 2rem;
  margin-bottom: 2rem;
  line-height: 1.5;
  color: rgba(0,0,0,.8);
}

.bw-widget-modal__btn {
  font-size: .875rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: .5rem;
  padding-bottom: .5rem;
  background-color: #e6e6e6;
  color: rgba(0,0,0,.8);
  border-radius: .25rem;
  border-style: none;
  border-width: 0;
  cursor: pointer;
  -webkit-appearance: button;
  text-transform: none;
  overflow: visible;
  line-height: 1.15;
  margin: 0;
  will-change: transform;
  -moz-osx-font-smoothing: grayscale;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  transition: -webkit-transform .25s ease-out;
  transition: transform .25s ease-out;
  transition: transform .25s ease-out,-webkit-transform .25s ease-out;
}

.bw-widget-modal__btn:focus, .modal__btn:hover {
  -webkit-transform: scale(1.05);
  transform: scale(1.05);
}

.bw-widget-modal__btn-primary {
  background-color: #00449e;
  color: #fff;
}



/**************************\
  Demo Animation Style
\**************************/
@keyframes bw-widget-mmfadeIn {
    from { opacity: 0; }
      to { opacity: 1; }
}

@keyframes bw-widget-mmfadeOut {
    from { opacity: 1; }
      to { opacity: 0; }
}

@keyframes bw-widget-mmslideIn {
  from { transform: translateY(15%); }
    to { transform: translateY(0); }
}

@keyframes bw-widget-mmslideOut {
    from { transform: translateY(0); }
    to { transform: translateY(-10%); }
}

.bw-widget-micromodal-slide {
  display: none;
}

.bw-widget-micromodal-slide.is-open {
  display: block;
}

.bw-widget-micromodal-slide[aria-hidden="false"] .bw-widget-modal__overlay {
  animation: mmfadeIn .3s cubic-bezier(0.0, 0.0, 0.2, 1);
}

.bw-widget-micromodal-slide[aria-hidden="false"] .bw-widget-modal__container {
  animation: mmslideIn .3s cubic-bezier(0, 0, .2, 1);
}

.micromodal-slide[aria-hidden="true"] .bw-widget-modal__overlay {
  animation: mmfadeOut .3s cubic-bezier(0.0, 0.0, 0.2, 1);
}

.bw-widget-micromodal-slide[aria-hidden="true"] .bw-widget-modal__container {
  animation: mmslideOut .3s cubic-bezier(0, 0, .2, 1);
}

.bw-widget-micromodal-slide .bw-widget-modal__container,
.bw-widget-micromodal-slide .bw-widget-modal__overlay {
  will-change: transform;
}

.bw-text-input {
	display: block;
}

.bw-alert {
}

.bw-alert-item {
	padding-top: 10px;
	padding-bottom: 10px;
}

.bw-alert-warning {
	color: red;
}

.bw-link {
	color: blue;
}
		`;
		var style = document.createElement('style')
		style.innerText = css
		document.head.appendChild(style)
	},

	createLoginModal: function () {
		let html = `
		<div class="bw-widget-modal bw-widget-micromodal-slide" id="bw-login-modal" aria-hidden="true">
			<div class="bw-widget-modal__overlay" tabindex="-1" data-micromodal-close>
			<div class="bw-widget-modal__container" role="dialog" aria-modal="true" aria-labelledby="bw-login-modal-title">
				<header class="bw-widget-modal__header">
				<h2 class="bw-widget-modal__title" id="bw-login-modal-title">
					Login
				</h2>
				<button class="bw-widget-modal__close" aria-label="Close modal" data-micromodal-close></button>
				</header>
				<main class="bw-widget-modal__content" id="bw-login-modal-content">
					<label for="bw_login_email">Email</label>
					<input type="email" class="bw-text-input" name="bw_login_email" id="bw_login_email" />
					
					<label>Password</label>
					<input type="password" class="bw-text-input" name="bw_login_password" id="bw_login_password" />

					<p>Need an account? <a class="bw-link" onclick="BingewaveConnector.switchModals('bw-register-modal', 'bw-login-modal')" >Register Here<a>

					<div id="bw-login-success" class="bw-alert bw-alert-success"></div>
					<div id="bw-login-error" class="bw-alert bw-alert-warning"></div>
				</main>
				<footer class="bw-widget-modal__footer">
				<button onclick="BingewaveConnector.login()" class="bw-widget-modal__btn modal__btn-primary">Login</button>
				<button class="bw-widget-modal__btn" data-micromodal-close aria-label="Close this dialog window">Cancel</button>
				</footer>
			</div>
			</div>
		</div>
		`;

		document.body.insertAdjacentHTML('beforeend', html);

	},

	createRegisterModal: function () {
		let html = `
		<div class="bw-widget-modal bw-widget-micromodal-slide" id="bw-register-modal" aria-hidden="true">
			<div class="bw-widget-modal__overlay" tabindex="-1" data-micromodal-close>
			<div class="bw-widget-modal__container" role="dialog" aria-modal="true" aria-labelledby="bw-register-modal-title">
				<header class="bw-widget-modal__header">
				<h2 class="bw-widget-modal__title" id="bw-register-modal-title">
					Register
				</h2>
				<button class="bw-widget-modal__close" aria-label="Close modal" data-micromodal-close></button>
				</header>
				<main class="bw-widget-modal__content" id="bw-register-modal-content">

					<label for="bw_register_first_name">First Name</label>
					<input type="email" class="bw-text-input" name="bw_register_first_name" id="bw_register_first_name" />

					<label for="bw_register_last_name">Last Name</label>
					<input type="email" class="bw-text-input" name="bw_register_last_name" id="bw_register_last_name" />
					
					<label for="bw_register_email">Email</label>
					<input type="email" class="bw-text-input" name="bw_register_email" id="bw_register_email" />
					
					<label>Password</label>
					<input type="password" class="bw-text-input" name="bw_register_password" id="bw_register_password" />

					<div>
						<input type="checkbox" name="bw_register_agree_terms" id="bw_register_agree_terms" value="1" /> Agree To Terms
					</div>

					<p>Already have an account? <a onclick="BingewaveConnector.switchModals('bw-login-modal', 'bw-register-modal')" href="#">Login Here<a>

					<div id="bw-register-success" class="bw-alert bw-alert-success"></div>
					<div id="bw-register-error" class="bw-alert bw-alert-warning"></div>
				</main>
				<footer class="bw-widget-modal__footer">
				<button onclick="BingewaveConnector.register()" class="bw-widget-modal__btn modal__btn-primary">Register</button>
				<button class="bw-widget-modal__btn" data-micromodal-close aria-label="Close this dialog window">Cancel</button>
				</footer>
			</div>
			</div>
		</div>
		`;

		document.body.insertAdjacentHTML('beforeend', html);

	},

	refreshPage: function () {
		location.reload();
	},

	setCookie: function (name, value, days) {

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

	getCookie: function (name) {

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

	eraseCookie: function (name) {
		document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	},

	sendLogin: function () {

		let email = document.getElementById('bw_login_email').value;
		let password = document.getElementById('bw_login_password').value;

		fetch(globalVariables.endpoint + 'auth/login', {
			method: 'POST', // or 'PUT'
			headers: {
				'Content-Type': 'application/json',
				'Authorization': globalVariables.token
			},
			body: JSON.stringify({ email: email, password: password }),
		})
			.then(response => response.json())
			.then(data => {

				if (data.status == 'success') {

					MicroModal.close('bw-login-modal');
					if (data.data && data.data.auth_token) {
						globalVariables.token = data.data.auth_token;
						setCookie('bw_auth_token', globalVariables.token);
					}

				} else if (data.status == 'failure') {

					let login_errors = document.getElementById("bw-login-error");
					login_errors.innerHTML = '';

					for (let i = 0; i < data.errors.length; i++) {
						let item = document.createElement('p');
						item.class = 'bw-alert-item';
						item.innerHTML = data.errors[i];
						login_errors.append(item);
					}
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	},

	sendRegister: function () {

		let email = document.getElementById('bw_register_email').value;
		let password = document.getElementById('bw_register_password').value;
		let first_name = document.getElementById('bw_register_first_name').value;
		let last_name = document.getElementById('bw_register_last_name').value;
		let terms = document.getElementById('bw_register_agree_terms').value;

		fetch(globalVariables.endpoint + 'auth/register', {
			method: 'POST', // or 'PUT'
			headers: {
				'Content-Type': 'application/json',
				'Authorization': globalVariables.token
			},
			body: JSON.stringify({ email: email, password: password, first_name: first_name, last_name: last_name, agree_to_terms: terms }),
		})
			.then(response => response.json())
			.then(data => {

				if (data.status == 'success') {

					MicroModal.close('bw-register-modal');
					if (data.data && data.data.auth_token) {
						globalVariables.token = data.data.auth_token;
						setCookie('bw_auth_token', globalVariables.token);
					}

				} else if (data.status == 'failure') {

					let register_errors = document.getElementById("bw-register-error");

					register_errors.innerHTML = '';

					for (const [key, value] of Object.entries(data.errors)) {

						if (Array.isArray(value)) {
							for (let j = 0; j < value.length; j++) {
								let item = document.createElement('p');
								item.class = 'bw-alert-item';
								item.innerHTML = value[j];
								register_errors.append(item);
							}
						} else {
							let item = document.createElement('p');
							item.class = 'bw-alert-item';
							item.innerHTML = value;
							register_errors.append(item);

						}

					}
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	},

	switchModals: function (open_modal, current_modal) {
		if (current_modal) {
			MicroModal.close(current_modal);
		}

		MicroModal.show(open_modal);
	},

	parseTags: function () {

		//Get bw:widget elements
		let elements = document.getElementsByTagName("bw:widget");

		for (var i = 0; i < elements.length; i++) {
			let widget = elements[i];
			let type = widget.getAttribute("type");
			let id = widget.getAttribute("id");

			if (type == 'group') {
				var object_id = widget.getAttribute("oid");
				displayAdGroup(widget, id, object_id);
			} else if (type == 'ad') {
				displayAd(widget, id);
			} else if (type == 'adspace') {
				displayAdSpace(widget, id);
			} else if (type == 'sponsored_content') {
				displaySponsoredContent(widget, id);
			} else if (type == 'needs') {
				displayNeedsFrame(widget, id);
			} else if (type == 'needs_feed') {
				displayNeedsFeedFrame(widget, id);
			} else if (type == 'opportunities') {
				displayOpportunitiesFrame(widget, id);
			} else if (type == 'opportunities_feed') {
				displayOpportunitiesFeedFrame(widget, id);
			} else if (type == 'promotions') {
				displayPromotionsFrame(widget, id);
			} else if (type == 'promotions_feed') {
				displayPromotionsFeedFrame(widget, id);
			} else if (type == 'promotions_manage') {
				displayManagePromotionsFrame(widget, id);
			} else if (type == 'collaborate') {
				displayCollaborationFrame(widget, id);
			} else if (type == 'podcasts') {
				displayVideosPlayList(widget, id);
			} else if (type == 'podcast') {
				var object_id = widget.getAttribute("oid");
				displayPodcast(widget, id, object_id);
			} else if (type == 'watch') {
				var object_id = widget.getAttribute("oid");
				id = 'abc123';
				displayWatchView(widget, id, object_id);
			} else if (type == 'stream') {
				var object_id = widget.getAttribute("oid");
				displayStream(widget, id, object_id);
			} else if (type == 'broadcast') {
				var object_id = widget.getAttribute("oid");
				displayBroadcast(widget, id, object_id);
			} else if (type == 'streambroadcast') {
				var object_id = widget.getAttribute("oid");
				displayStreamAndBroadcast(widget, id, object_id);
			} else if (type == 'ticket') {
				var object_id = widget.getAttribute("oid");
				displayEventTicket(widget, id, object_id);
			} else if (type == 'chat') {
				var object_id = widget.getAttribute("oid");
				displayChat(widget, id, object_id);
			} else if (type == 'online') {
				var object_id = widget.getAttribute("oid");
				displayOnlineUsers(widget, id, object_id);
			} else if (type == 'webrtc') {
				var object_id = widget.getAttribute("oid");
				displayWebRTC(widget, id, object_id);
			} else if (type == 'webrtc_class') {
				var object_id = widget.getAttribute("oid");
				displayWebRtcClassroom(widget, id, object_id);
			} else if (type == 'products') {
				var object_id = widget.getAttribute("oid");
				displayProducts(widget, id, object_id);
			} else if (type == 'notepad') {
				var object_id = widget.getAttribute("oid");
				displayNotepad(widget, id, object_id);
			} else if (type == 'liveproducts') {
				var object_id = widget.getAttribute("oid");
				displayLiveProducts(widget, id, object_id);
			} else if (type == 'voting') {
				var object_id = widget.getAttribute("oid");
				displayVoting(widget, id, object_id);
			} else if (type == 'messenging') {
				var object_id = widget.getAttribute("oid");
				displayMessenging(widget, id, object_id);
			} else if (type == 'conferencetickets') {
				var object_id = widget.getAttribute("oid");
				displayConferenceTickets(widget, id, object_id);
			} else if (type == 'eventpaywall') {
				var object_id = widget.getAttribute("oid");
				displayEventPayWall(widget, id, object_id);
			} else if (type == 'join') {
				var object_id = widget.getAttribute("oid");
				displayEventJoin(widget, id, object_id);
			} else if (type == 'popup') {
				var object_id = widget.getAttribute("oid");
				displayEventPopup(widget, id, object_id);
			}

		}//end for

		//Get elements with the data attribute
		elements = document.querySelectorAll("[data-invirtu]");

		for (var i = 0; i < elements.length; i++) {
			let widget = elements[i];

			let type = widget.getAttribute("type");
			let id = widget.getAttribute("id");

			if (type == 'group') {
				displayAdGroup(widget, id);
			} else if (type == 'ad') {
				displayAd(widget, id);
			} else if (type == 'adspace') {
				displayAdSpace(widget, id);
			} else if (type == 'sponsored_content') {
				displaySponsoredContent(widget, id);
			} else if (type == 'needs') {
				displayNeedsFrame(widget, id);
			} else if (type == 'needs_feed') {
				displayNeedsFeedFrame(widget, id);
			} else if (type == 'opportunities') {
				displayOpportunitiesFrame(widget, id);
			} else if (type == 'opportunities_feed') {
				displayOpportunitiesFeedFrame(widget, id);
			} else if (type == 'promotions') {
				displayPromotionsFrame(widget, id);
			} else if (type == 'promotions_feed') {
				displayPromotionsFeedFrame(widget, id);
			} else if (type == 'promotions_manage') {
				displayManagePromotionsFrame(widget, id);
			} else if (type == 'collaborate') {
				displayCollaborationFrame(widget, id);
			} else if (type == 'podcasts') {
				displayVideosPlayList(widget, id);
			} else if (type == 'podcast') {
				var object_id = widget.getAttribute("oid");
				displayPodcast(widget, id, object_id);
			} else if (type == 'watch') {
				var object_id = widget.getAttribute("oid");
				id = 'abc123';
				displayWatchView(widget, id, object_id);
			} else if (type == 'stream') {
				var object_id = widget.getAttribute("oid");
				displayStream(widget, id, object_id);
			} else if (type == 'broadcast') {
				var object_id = widget.getAttribute("oid");
				displayBroadcast(widget, id, object_id);
			} else if (type == 'streambroadcast') {
				var object_id = widget.getAttribute("oid");
				displayStreamAndBroadcast(widget, id, object_id);
			} else if (type == 'ticket') {
				var object_id = widget.getAttribute("oid");
				displayEventTicket(widget, id, object_id);
			} else if (type == 'chat') {
				var object_id = widget.getAttribute("oid");
				displayChat(widget, id, object_id);
			} else if (type == 'online') {
				var object_id = widget.getAttribute("oid");
				displayOnlineUsers(widget, id, object_id);
			} else if (type == 'webrtc') {
				var object_id = widget.getAttribute("oid");
				displayWebRTC(widget, id, object_id);
			} else if (type == 'webrtc_class') {
				var object_id = widget.getAttribute("oid");
				displayWebRtcClassroom(widget, id, object_id);
			} else if (type == 'products') {
				var object_id = widget.getAttribute("oid");
				displayProducts(widget, id, object_id);
			} else if (type == 'notepad') {
				var object_id = widget.getAttribute("oid");
				displayNotepad(widget, id, object_id);
			} else if (type == 'liveproducts') {
				var object_id = widget.getAttribute("oid");
				displayLiveProducts(widget, id, object_id);
			} else if (type == 'voting') {
				var object_id = widget.getAttribute("oid");
				displayVoting(widget, id, object_id);
			} else if (type == 'messenging') {
				var object_id = widget.getAttribute("oid");
				displayMessenging(widget, id, object_id);
			} else if (type == 'conferencetickets') {
				var object_id = widget.getAttribute("oid");
				displayConferenceTickets(widget, id, object_id);
			} else if (type == 'eventpaywall') {
				var object_id = widget.getAttribute("oid");
				displayEventPayWall(widget, id, object_id);
			} else if (type == 'join') {
				var object_id = widget.getAttribute("oid");
				displayEventJoin(widget, id, object_id);
			} else if (type == 'popup') {
				var object_id = widget.getAttribute("oid");
				displayEventPopup(widget, id, object_id);
			}

		}//end for

		globalVariables.deepest_scroll = globalVariables.instance.getScrollPosition();
	},

	parseTagsOnLoad: function () {

		if (window.addEventListener) {
			window.addEventListener('message', listenIframe, false);

		} else if (window.attachEvent) {
			window.attachEvent('onmessage', listenIframe);
		}

	},

	listenIframe: function (event) {

		if (!(event.origin + '/' == 'https://widgets.bingewave.com/' || event.origin + '/' == 'https://www.bingewave.com/' || event.origin + '/' == 'http://iframe.bingewave.local/')) {
			//return;
		}

		if (event.data && (typeof event.data === 'string' || event.data instanceof String)) {

			try {
				var data = JSON.parse(event.data);

				if (data.command && data.command == 'require_login') {
					//alert("Require Login");
					globalVariables.token = data.token;
					MicroModal.show('bw-login-modal');
				} else if (data.command && data.command == 'set_auth_token') {

					globalVariables.token = data.token;

					setCookie('bw_auth_token', globalVariables.token);
				} else if (data.command && data.command == 'refresh_page') {

					refreshPage();

				} else if (data.elementid) {

					var iFrameID = document.getElementById(data.elementid.replace(":80", ""));

					//Remove port number, if present
					//iFrameID = iFrameID.replace(":80", "");

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

	createPageView: function () {

		var data = {
			page_view_screen_width: globalVariables.instance.getScreenWidth(),
			page_view_screen_height: globalVariables.instance.getScreenHeight(),
			page_view_view_width: globalVariables.instance.getViewWidth(),
			page_view_view_height: globalVariables.instance.getViewHeight(),
			page_view_browser: globalVariables.instance.detectBrowser(),
			page_view_browser_version: globalVariables.instance.getBrowserVersion(),
			page_view_os: globalVariables.instance.getOperatingSystem(),
			page_view_os_version: globalVariables.instance.getOperatingSystemVersion(),
			page_view_is_mobile: globalVariables.instance.isMobile(),
			page_view_cookie_enabled: globalVariables.instance.allowCookies(),
			page_view_url: document.URL,
			click_id: globalVariables.instance.getHashParam('adbid'),
			click_key: globalVariables.instance.getHashParam('abdkey')
		}

		PVAjax.send({
			url: '/api/pageviews',
			data: data,
			type: 'POST',
			format: 'json',
			success: function (response) {
				response = JSON.parse(response);
				globalVariables.page_view_id = response.globalVariables.page_view_id;

			}
		});
	},

	displayAd: function (widget, id) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", "https://connect.bingewave.com/ads/" + id + "?elementid=" + elementID);
		renderIframe(widget, id, ifrm, elementID, 0);

	},

	displayAdGroup: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/groups/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayAdSpace: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", "https://www.bingewave.com//adspace/view/" + id + "?mode=iframe&elementid=" + elementID);
		renderIframe(widget, id, ifrm, elementID, 0);
	},

	displaySponsoredContent: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var adbscid = globalVariables.instance.getQueryParameter('adbscid');

		if (adbscid) {
			let ifrm = document.createElement("IFRAME");
			ifrm.setAttribute("src", "https://connect.bingewave.com/sponsored/" + id + "?elementid=" + elementID + "&adbscid=" + adbscid);
			renderIframe(widget, id, ifrm, elementID, 0);
		}
	},

	displayWatchView: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com//stream/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayStream: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/stream/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayBroadcast: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/broadcast/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayStreamAndBroadcast: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/streambroadcast/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayEventTicket: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/ticket/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayChat: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/chat/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayOnlineUsers: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/online/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayWebRTC: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/webrtc/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayWebRtcClassroom: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/webrtc_class/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayNotepad: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/notepad/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayEventJoin: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/join/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayEventPopup: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/popup/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayMessenging: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/messenging/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayConferenceTickets: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/conferencetickets/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayVoting: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/voting/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayEventPayWall: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/eventpaywall/" + id + "?elementid=" + elementID;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayLiveProducts: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/liveproducts/" + id + "?elementid=" + elementID

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayProducts: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let url = "https://widgets.bingewave.com/products/" + id + "?elementid=" + elementID

		let ifrm = document.createElement("IFRAME");
		renderIframe(widget, id, ifrm, elementID, 0, url);
	},

	displayNeedsFrame: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 600);
	},

	displayNeedsFeedFrame: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var url = "http://iframe.bingewave.local/needs/feed?mode=iframe&mtype=needs&elementid=" + elementID + "&cid=" + id;

		ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", url);

		var defaultHeight = '300px';

		if (widget.getAttribute("width")) {
			ifrm.width = widget.getAttribute("width");
		} else {
			ifrm.width = '100%';
		}

		if (widget.getAttribute("height")) {
			ifrm.height = widget.getAttribute("height");
		} else {
			ifrm.height = '300px';
		}

		renderIframe(widget, id, ifrm, elementID, defaultHeight);
	},

	displayOpportunitiesFrame: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var hashvars = globalVariables.instance.parseHash();

		if (hashvars && hashvars.opportunity_id && hashvars.discussion_id) {
			var url = "http://iframe.bingewave.local/opportunities/viewdiscussion/" + hashvars.discussion_id + "?mode=iframe&mtype=opportunities&elementid=" + elementID + "&cid=" + id;
		} else if (hashvars && hashvars.opportunity_id) {
			var url = "http://iframe.bingewave.local/opportunities/view/" + hashvars.opportunity_id + "?mode=iframe&mtype=opportunities&elementid=" + elementID + "&cid=" + id;
		} else {
			var url = "http://iframe.bingewave.local/opportunities?mode=iframe&mtype=opportunities&elementid=" + elementID + "&cid=" + id;
		}

		ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 600);
	},

	displayOpportunitiesFeedFrame: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var url = "http://iframe.bingewave.local/opportunities/feed?mode=iframe&mtype=opportunities&elementid=" + elementID + "&cid=" + id;

		ifrm = document.createElement("IFRAME");

		var defaultHeight = '300px';

		if (widget.getAttribute("width")) {
			ifrm.width = widget.getAttribute("width");
		} else {
			ifrm.width = '100%';
		}

		if (widget.getAttribute("height")) {
			ifrm.width = widget.getAttribute("height");
			defaultHeight = widget.getAttribute("height");
		} else {
			ifrm.height = '300px';
		}

		renderIframe(widget, id, ifrm, elementID, defaultHeight, url);
	},

	displayPromotionsFrame: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var hashvars = globalVariables.instance.parseHash();

		if (hashvars && hashvars.promotion_id) {
			var url = "http://iframe.bingewave.local/promotions/view/" + hashvars.promotion_id + "?mode=iframe&mtype=promotions&elementid=" + elementID + "&cid=" + id;
		} else {
			var url = "http://iframe.bingewave.local/promotions?mode=iframe&mtype=promotions&elementid=" + elementID + "&cid=" + id;
		}

		let ifrm = document.createElement("IFRAME");
		renderIframe(widget, id, ifrm, elementID, 600, url);
	},

	displayPromotionsFeedFrame: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var url = "http://iframe.bingewave.local/promotions/feed?mode=iframe&mtype=promotions&elementid=" + elementID + "&cid=" + id;

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", url);

		var defaultHeight = '300px';

		if (widget.getAttribute("width")) {
			ifrm.width = widget.getAttribute("width");
		} else {
			ifrm.width = '100%';
		}

		if (widget.getAttribute("height")) {
			ifrm.width = widget.getAttribute("height");
			defaultHeight = widget.getAttribute("height");
		} else {
			ifrm.height = '300px';
		}

		renderIframe(widget, id, ifrm, elementID, defaultHeight);
	},

	displayManagePromotionsFrame: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var url = "http://iframe.bingewave.local/promotions/manage?mode=iframe&mtype=promotions_manage&elementid=" + elementID + "&cid=" + id;

		let ifrm = document.createElement("IFRAME");
		renderIframe(widget, id, ifrm, elementID, 600, url);
	},

	displayCollaborationFrame: function (widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var hashvars = globalVariables.instance.parseHash();

		if (hashvars && hashvars.message_id) {
			var url = "http://iframe.bingewave.local/collaborate/message/" + hashvars.message_id + "?mode=iframe&mtype=collaboration&elementid=" + elementID + "&cid=" + id;
		} else if (hashvars && hashvars.connection_requestor_id) {
			var url = "http://iframe.bingewave.local/collaborate/connect/" + hashvars.connection_requestor_id + "?mode=iframe&mtype=collaboration&elementid=" + elementID + "&cid=" + id;
		} else {
			var url = "http://iframe.bingewave.local/collaborate?mode=iframe&mtype=collaboration&elementid=" + elementID + "&cid=" + id;
		}

		ifrm = document.createElement("IFRAME");
		renderIframe(widget, id, ifrm, elementID, 600, url);
	},

	displayVideosPlayList: function (widget, id) {
		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var url = "http://iframe.bingewave.local/podcasts/playlist?mode=iframe&mtype=podcastn&elementid=" + elementID + "&cid=" + id;

		let ifrm = document.createElement("IFRAME");
		renderIframe(widget, id, ifrm, elementID, 700, url);
	},

	displayPodcast: function (widget, id, object_id) {
		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let ifrm = document.createElement("IFRAME");
		renderIframe(widget, id, ifrm, elementID, 600);
	},

	renderIframe: function (widget, id, ifrm, elementID, defaultHeight, url) {

		let type = widget.getAttribute("type");
		let environment = widget.getAttribute("env");
		let uniqueTypeID = id + '-' + type + '-iframe';

		if (environment) {
			url = updateQueryStringParameter(url, 'env', environment)
		}

		let frameExist = document.getElementById(uniqueTypeID);

		if (!frameExist) {
			if (globalVariables.token) {
				let xhr = new XMLHttpRequest();

				xhr.open('GET', url);
				xhr.onreadystatechange = function () {
					if (this.readyState === this.DONE) {
						if (this.status === 200) {
							if (iOS()) {

								let reader = new FileReader();

								reader.readAsDataURL(this.response);

								reader.onloadend = function () {
									ifrm.setAttribute("src", reader.result);
								}

							} else {
								var data_url = URL.createObjectURL(this.response);
								ifrm.setAttribute("src", data_url);
							}

						} else {
							console.log(type);
							console.log(url);
							console.error('Unable To Set IFrame SRC');
						}
					}
				};

				xhr.responseType = 'blob';
				xhr.setRequestHeader('Authorization', globalVariables.token);
				xhr.send();

			} else {
				console.log("Token Not Exist");
				ifrm.setAttribute("src", url);
			}
			ifrm.style.width = "100%";

			if (defaultHeight) {
				ifrm.style.height = defaultHeight + "px";
			}

			ifrm.scrolling = "no";
			ifrm.frameBorder = 0;
			ifrm.setAttribute("onload", "scroll(0,0)");
			ifrm.id = elementID;
			let placeholderFrame = document.createElement('span');
			placeholderFrame.id = uniqueTypeID;

			widget.appendChild(ifrm);
			widget.appendChild(placeholderFrame);

			globalVariables.frames.push(ifrm);
		}
	},

	windowReady: function (callback) {
		// in case the document is already rendered
		if (document.readyState != 'loading') callback();
		// modern browsers
		else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
		// IE <= 8
		else document.attachEvent('onreadystatechange', function () {
			if (document.readyState == 'complete') callback();
		});
	},

	updateQueryStringParameter: function (uri, key, value) {
		var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		var separator = uri.indexOf('?') !== -1 ? "&" : "?";
		if (uri.match(re)) {
			return uri.replace(re, '$1' + key + "=" + value + '$2');
		}
		else {
			return uri + separator + key + "=" + value;
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

			let tmpToken = getCookie('bw_auth_token');

			if (tmpToken) {
				globalVariables.token = tmpToken;
			}
		}

		windowReady(function () {

			initCookie();
			//addCssToDocument();
			//createLoginModal();
			//createRegisterModal();
			parseTagsOnLoad();

			parseTags();

			// if (MicroModal) {
			// 	MicroModal.init();
			// }
		});
	},

	setAuthToken: function (auth_token) {
		globalVariables.token = auth_token;
		this.token = auth_token;
	},

	iOS: function () {
		return [
			'iPad Simulator',
			'iPhone Simulator',
			'iPod Simulator',
			'iPad',
			'iPhone',
			'iPod'
		].includes(navigator.platform)
			// iPad on iOS 13 detection
			|| (navigator.userAgent.includes("Mac") && "ontouchend" in document)
	},

	getInstance: function () {

		if (!globalVariables.instance) {

			globalVariables.instance = {

				unknown: '-',

				clientStrings: [
					{ s: 'Windows 3.11', r: /Win16/ },
					{ s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
					{ s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
					{ s: 'Windows 98', r: /(Windows 98|Win98)/ },
					{ s: 'Windows CE', r: /Windows CE/ },
					{ s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
					{ s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
					{ s: 'Windows Server 2003', r: /Windows NT 5.2/ },
					{ s: 'Windows Vista', r: /Windows NT 6.0/ },
					{ s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
					{ s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
					{ s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
					{ s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
					{ s: 'Windows ME', r: /Windows ME/ },
					{ s: 'Android', r: /Android/ },
					{ s: 'Open BSD', r: /OpenBSD/ },
					{ s: 'Sun OS', r: /SunOS/ },
					{ s: 'Linux', r: /(Linux|X11)/ },
					{ s: 'iOS', r: /(iPhone|iPad|iPod)/ },
					{ s: 'Mac OS X', r: /Mac OS X/ },
					{ s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
					{ s: 'QNX', r: /QNX/ },
					{ s: 'UNIX', r: /UNIX/ },
					{ s: 'BeOS', r: /BeOS/ },
					{ s: 'OS/2', r: /OS\/2/ },
					{ s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
				],

				getViewWidth: function () {
					var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth || e.clientWidth || g.clientWidth;

					return x;
				},

				getViewHeight: function () {

					var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], y = w.innerHeight || e.clientHeight || g.clientHeight;

					return y;
				},

				getScreenWidth: function () {
					return window.screen.width;
				},

				getScreenHeight: function () {
					return window.screen.height;
				},

				getDocumentHeight: function () {
					var D = document;
					return Math.max(
						D.body.scrollHeight, D.documentElement.scrollHeight,
						D.body.offsetHeight, D.documentElement.offsetHeight,
						D.body.clientHeight, D.documentElement.clientHeight
					);
				},

				detectBrowser: function () {
					var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
					if (/trident/i.test(M[1])) {
						tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
						return 'IE ' + (tem[1] || '');
					}

					return M[1];
				},

				getBrowserVersion: function () {
					var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
					if (/trident/i.test(M[1])) {
						tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
						return 'IE ' + (tem[1] || '');
					}
					M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
					if ((tem = ua.match(/version\/([\.\d]+)/i)) != null)
						M[2] = tem[1];

					return M[1];
				},

				getScrollPosition: function () {
					var doc = document.documentElement;
					var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
					var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

					return top;
				},

				getOperatingSystem: function () {

					var nAgt = navigator.userAgent;

					var os = globalVariables.instance.unknown;

					for (var id in globalVariables.instance.clientStrings) {
						var cs = globalVariables.instance.clientStrings[id];
						if (cs.r.test(nAgt)) {
							os = cs.s;
							break;
						}
					}



					if (/Windows/.test(os)) {
						os = 'Windows';
					}



					return os;
				},

				getOperatingSystemVersion: function () {

					var nAgt = navigator.userAgent;


					for (var id in globalVariables.instance.clientStrings) {
						var cs = globalVariables.instance.clientStrings[id];
						if (cs.r.test(nAgt)) {
							os = cs.s;
							break;
						}
					}

					var osVersion = globalVariables.instance.unknown;

					if (/Windows/.test(os)) {
						osVersion = /Windows (.*)/.exec(os)[1];
						os = 'Windows';
					}

					switch (os) {
						case 'Mac OS X':
							osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
							break;

						case 'Android':
							osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
							break;

						case 'iOS':
							osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
							osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
							break;
					}

					return osVersion;

				},

				isMobile: function () {
					var nVer = navigator.appVersion;

					var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

					return mobile;
				},

				allowCookies: function () {
					var cookieEnabled = (navigator.cookieEnabled) ? true : false;

					if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
						document.cookie = 'testcookie';
						cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
					}

					return cookieEnabled;
				},
				getQueryParameter: function (name) {
					name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
					var regexS = "[\\?&]" + name + "=([^&#]*)";
					var regex = new RegExp(regexS);
					var results = regex.exec(window.location.search);
					if (results == null)
						return "";
					else
						return decodeURIComponent(results[1].replace(/\+/g, " "));
				},

				parseHash: function () {
					var hashParams = {};
					var e, a = /\+/g, // Regex for replacing addition symbol with a space
						r = /([^&;=]+)=?([^&;]*)/g, d = function (s) {
							return decodeURIComponent(s.replace(a, " "));
						}, q = window.location.hash.substring(1);

					while (e = r.exec(q)) {
						hashParams[d(e[1])] = d(e[2]);
					}

					return hashParams;
				},

				adjustIframeHeight: function (id) {
					var iFrameID = document.getElementById(id);
					if (iFrameID) {
						//console.log(iFrameID.contentWindow.document.body.scrollHeight);
						// here you can make the height, I delete it first, then I make it again
						//iFrameID.height = "";
						//iFrameID.height = iFrameID.contentWindow.document.body.scrollHeight + "px";
					}

				},

				getHashParam: function (key) {
					var hash = globalVariables.instance.parseHash();

					return hash[key];
				},

				setHashParam: function (key, val) {
					var hash = globalVariables.instance.parseHash();
					hash[key] = val;
					globalVariables.instance._writeHash(hash);

				},

				removeHashParam: function (key) {
					var hash = globalVariables.instance.parseHash();
					delete hash[key];
					globalVariables.instance._writeHash(hash);
				},

				updateQueryStringParameter: function (uri, key, value) {
					var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
					separator = uri.indexOf('?') !== -1 ? "&" : "?";
					if (uri.match(re)) {
						return uri.replace(re, '$1' + key + "=" + value + '$2');
					} else {
						return uri + separator + key + "=" + value;
					}
				},

				getQueryStringParameter: function (name) {
					name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
					var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
						results = regex.exec(location.search);
					return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
				},

				_writeHash: function (hash) {
					var string = '';
					var first = true;

					$.each(hash, function (index, value) {
						if (first == false) {
							string += '&';
						}
						first = false;
						string += index + '=' + value;
					});

					window.location.hash = string;
				}


			};

		};

		return globalVariables.instance;
	}

};

var PVAjax = function () {

	function send(data) {

		data = _applyDefaults(data);

		data.xhr = _getRequestObject();

		data = _applyCallbacks(data);

		data.data = _formatObject(data.data, data.format, null);

		_sendRequest(data);

	}

	function _applyDefaults(data) {

		if (data.type == undefined) {

			data.type = '';

		}

		if (data.data == undefined) {

			data.data = {};

		}

		if (data.method == undefined) {

			data.method = 'ajax';

		}

		if (data.async == undefined) {

			data.async = true;

		}

		if (data.url == undefined) {

			data.method = null;

		}

		if (data.format == undefined) {

			data.format = 'serial';

		}

		if (data.response == undefined) {

			data.response = 'string';

		}

		if (data.success == undefined) {

			data.success = function (response) {

			};

		}

		if (data.error == undefined) {

			data.error = function (response) {

			};

		}

		return data;

	}

	function _applyCallbacks(data) {

		data.xhr.onreadystatechange = function () {

			if (data.xhr.readyState == 4 && data.xhr.status == 200) {

				var response = '';

				if (data.response == 'json') {

					response = JSON.parse(data.xhr.responseText);

				} else {

					response = data.xhr.responseText;

				}

				data.success(response);

			} else if (data.xhr.readyState == 4 && data.xhr.status == 200) {

				data.error(data.xhr.responseText);

			}

		};

		return data;

	}

	function _getRequestObject() {

		xhr = null;

		if (window.XDomainRequest) {
			xhr = new XDomainRequest();

		} else if (typeof XMLHttpRequest !== 'undefined') {

			xhr = new XMLHttpRequest();

		} else {

			var versions = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XmlHttp.2.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];

			for (var i = 0, len = versions.length; i < len; i++) {

				try {

					xhr = new ActiveXObject(versions[i]);

					break;

				} catch (e) {

				}

			} // end for

		}//end if

		return xhr;

	}

	function _formatObject(obj, format, prefix) {

		if (format == 'json') {

			return JSON.stringify(obj);

		} else {

			var str = [];

			for (var p in obj) {

				var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];

				str.push(typeof v == "object" ? _formatObject(v, format, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));

			}

			return str.join("&");

		}

	}

	function _sendRequest(data) {

		if (data.type.toLowerCase() == 'get') {

			data.xhr.open(data.type, data.url + '?' + data.data, data.async);

			data.xhr.withCredentials = true;

			data.xhr.send();

		} else {

			data.xhr.open(data.type, data.url, data.async);

			data.xhr.withCredentials = true;

			data.xhr.send(data.data);

		}

	}

	return {

		send: send

	};

}();

autoAddDeps(BingewaveConnector, '$globalVariables');
mergeInto(LibraryManager.library, BingewaveConnector);