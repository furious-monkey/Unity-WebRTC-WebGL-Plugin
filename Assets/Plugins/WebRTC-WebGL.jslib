
var BingewaveConnector = (function () {

	// Instance stores a reference to the Singleton
	$instance;

	$page_view_id = null;

	$startTime = new Date();

	$deepest_scroll = 0;

	$endpoint = 'https://bw.bingewave.com/';

	$token = null;

	$frames = [];

	$sessionData = {};


	function initCookie() {

		var cookieImage = document.createElement("img");

		cookieImage.src = "https://widgets.bingewave.com/cookie";

		cookieImage.setAttribute("style", "display : none;");

		document.body.appendChild(cookieImage);

		var cookieTag = document.createElement("input");

		cookieTag.setAttribute("style", "display : none;");

		cookieTag.setAttribute("type", "hidden");

		cookieTag.setAttribute("name", "bw_xdomain_cookie");

		cookieTag.setAttribute("value", "value_you_want");

	}

	let API = {
		get: function (url) {
			return this.get('GET', url);
		},
		post: function (url, data) {
			return this.get('POST', url, data);
		},
		put: function (url, data) {
			return this.get('PUT', url, data);
		},
		delete: function (url, data) {
			return this.get('PUT', url, data);
		},
		_getAuthToken: function () {
			return token;
		},
		_call: function (method, url, options) {

			const auth_token = this._getAuthToken();

			return fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': auth_token
				},
				body: (options) ? JSON.stringify(options) : null
			}).then(function (response) {

				if (!response.ok) {
					response.text()
						.then(text => { throw new Error(text) })
				}

				return response.json();
			});
		}
	}

	function addCssToDocument() {
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
	}

	function createLoginModal() {
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

	}

	function createRegisterModal() {
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

	}

	function refreshPage() {
		location.reload();
	}

	function setCookie(name, value, days) {

		try {
			var expires = "";
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = "; expires=" + date.toUTCString();
			}
			document.cookie = name + "=" + (value || "") + expires + "; path=/";
		} catch (error) {
			sessionData[name] = value;
		}
	}

	function getCookie(name) {

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
			if (sessionData[name]) {
				return sessionData[name];
			}

			return null;;
		}
	}

	function eraseCookie(name) {
		document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}

	function sendLogin() {

		let email = document.getElementById('bw_login_email').value;
		let password = document.getElementById('bw_login_password').value;

		fetch(endpoint + 'auth/login', {
			method: 'POST', // or 'PUT'
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify({ email: email, password: password }),
		})
			.then(response => response.json())
			.then(data => {

				if (data.status == 'success') {

					MicroModal.close('bw-login-modal');
					if (data.data && data.data.auth_token) {
						token = data.data.auth_token;
						setCookie('bw_auth_token', token);
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
	}

	function sendRegister() {

		let email = document.getElementById('bw_register_email').value;
		let password = document.getElementById('bw_register_password').value;
		let first_name = document.getElementById('bw_register_first_name').value;
		let last_name = document.getElementById('bw_register_last_name').value;
		let terms = document.getElementById('bw_register_agree_terms').value;

		fetch(endpoint + 'auth/register', {
			method: 'POST', // or 'PUT'
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify({ email: email, password: password, first_name: first_name, last_name: last_name, agree_to_terms: terms }),
		})
			.then(response => response.json())
			.then(data => {

				if (data.status == 'success') {

					MicroModal.close('bw-register-modal');
					if (data.data && data.data.auth_token) {
						token = data.data.auth_token;
						setCookie('bw_auth_token', token);
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
	}

	function switchModals(open_modal, current_modal) {
		if (current_modal) {
			MicroModal.close(current_modal);
		}

		MicroModal.show(open_modal);
	}

	function parseTags() {

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

		deepest_scroll = instance.getScrollPosition();
	}

	function parseTagsOnLoad() {

		if (window.addEventListener) {
			window.addEventListener('message', listenIframe, false);

		} else if (window.attachEvent) {
			window.attachEvent('onmessage', listenIframe);
		}

	}

	window.onscroll = function (e) {
		if (instance.getScrollPosition() >= deepest_scroll + 50) {
			deepest_scroll = instance.getScrollPosition();

			if (page_view_id) {


				PVAjax.send({
					url: '/api/pageviews',
					data: {
						page_view_id: page_view_id,
						page_view_scroll_depth: deepest_scroll
					},
					type: 'PUT',
					format: 'json'

				});
			}
		}

	}

	function listenIframe(event) {


		if (!(event.origin + '/' == 'https://widgets.bingewave.com/' || event.origin + '/' == 'https://www.bingewave.com/' || event.origin + '/' == 'http://iframe.bingewave.local/')) {
			//return;
		}

		if (event.data && (typeof event.data === 'string' || event.data instanceof String)) {

			try {
				var data = JSON.parse(event.data);

				if (data.command && data.command == 'require_login') {
					//alert("Require Login");
					token = data.token;
					MicroModal.show('bw-login-modal');
				} else if (data.command && data.command == 'set_auth_token') {

					token = data.token;

					setCookie('bw_auth_token', token);
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
	}

	function createPageView() {


		var data = {
			page_view_screen_width: instance.getScreenWidth(),
			page_view_screen_height: instance.getScreenHeight(),
			page_view_view_width: instance.getViewWidth(),
			page_view_view_height: instance.getViewHeight(),
			page_view_browser: instance.detectBrowser(),
			page_view_browser_version: instance.getBrowserVersion(),
			page_view_os: instance.getOperatingSystem(),
			page_view_os_version: instance.getOperatingSystemVersion(),
			page_view_is_mobile: instance.isMobile(),
			page_view_cookie_enabled: instance.allowCookies(),
			page_view_url: document.URL,
			click_id: instance.getHashParam('adbid'),
			click_key: instance.getHashParam('abdkey')
		}

		PVAjax.send({
			url: '/api/pageviews',
			data: data,
			type: 'POST',
			format: 'json',
			success: function (response) {
				response = JSON.parse(response);
				page_view_id = response.page_view_id;

			}
		});
	}

	setInterval(function () {

		if (page_view_id) {

			var endTime = new Date();        //Get the current time.
			var timeSpent = (endTime - startTime);


			PVAjax.send({
				url: '/api/pageviews',
				data: {
					page_view_id: page_view_id,
					page_view_total_time: timeSpent
				},
				type: 'PUT',
				format: 'json'
			});
		}



	}, 5000);

	function displayAd(widget, id) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", "https://connect.bingewave.com/ads/" + id + "?elementid=" + elementID);
		renderIframe(widget, id, ifrm, elementID, 0);

	}

	function displayAdGroup(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/groups/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}


	}

	function displayAdSpace(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", "https://www.bingewave.com//adspace/view/" + id + "?mode=iframe&elementid=" + elementID);
		renderIframe(widget, id, ifrm, elementID, 0);
	}

	function displaySponsoredContent(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var adbscid = instance.getQueryParameter('adbscid');

		var adbspid = instance.getQueryParameter('adbspid');

		if (adbscid) {
			let ifrm = document.createElement("IFRAME");
			ifrm.setAttribute("src", "https://connect.bingewave.com/sponsored/" + id + "?elementid=" + elementID + "&adbscid=" + adbscid);
			renderIframe(widget, id, ifrm, elementID, 0);
		}
	}

	function displayWatchView(widget, id, elementID) {


		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com//stream/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayStream(widget, id, elementID) {


		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/stream/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayBroadcast(widget, id, elementID) {


		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/broadcast/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayStreamAndBroadcast(widget, id, elementID) {


		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/streambroadcast/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayEventTicket(widget, id, elementID) {


		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/ticket/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayChat(widget, id, elementID) {


		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/chat/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		//ifrm.setAttribute("src", url );
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayOnlineUsers(widget, id, elementID) {


		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/online/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayWebRTC(widget, id, elementID) {


		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/webrtc/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		//ifrm.setAttribute("src",  url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayWebRtcClassroom(widget, id, elementID) {


		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/webrtc_class/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		//ifrm.setAttribute("src", url );
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayNotepad(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/notepad/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		//ifrm.setAttribute("src",  url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayEventJoin(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/join/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		//ifrm.setAttribute("src",  url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayEventPopup(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/popup/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		//ifrm.setAttribute("src",  url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayMessenging(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/messenging/" + id + "?elementid=" + elementID;


		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		//ifrm.setAttribute("src",  url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}

	}

	function displayConferenceTickets(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/conferencetickets/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		//ifrm.setAttribute("src",  url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}


	function displayVoting(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/voting/" + id + "?elementid=" + elementID;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		//ifrm.setAttribute("src",  url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}

	}


	function displayEventPayWall(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/eventpaywall/" + id + "?elementid=" + elementID;


		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		//ifrm.setAttribute("src",  url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}


	function displayLiveProducts(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/liveproducts/" + id + "?elementid=" + elementID


		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("allowfullscreen", "true");
		ifrm.setAttribute("webkitallowfullscreen", "true");
		ifrm.setAttribute("mozallowfullscreen", "true");
		ifrm.setAttribute("allow", "camera *;microphone *");
		ifrm.setAttribute("width", "100%");
		//ifrm.setAttribute("src",  url);
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayProducts(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let url = "https://widgets.bingewave.com/products/" + id + "?elementid=" + elementID

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		//ifrm.setAttribute("src", url );
		renderIframe(widget, id, ifrm, elementID, 0, url);
		//}
	}

	function displayNeedsFrame(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		let adbscid = instance.getQueryParameter('adbscid');

		let adbspid = instance.getQueryParameter('adbspid');

		let hashvars = instance.parseHash();

		if (hashvars && hashvars.need_id && hashvars.thread_id && hashvars.type == 'response') {
			let url = "http://iframe.bingewave.local/needs/responses/" + hashvars.thread_id + "?mode=iframe&mtype=needs&elementid=" + elementID + "&cid=" + id;
		} else if (hashvars && hashvars.need_id && hashvars.thread_id && hashvars.type == 'respond') {
			let url = "http://iframe.bingewave.local/needs/respond/" + hashvars.need_id + "?mode=iframe&mtype=needs&elementid=" + elementID + "&cid=" + id;
		} else if (hashvars && hashvars.need_id) {
			let url = "http://iframe.bingewave.local/needs/respond/" + hashvars.need_id + "?mode=iframe&mtype=needs&elementid=" + elementID + "&cid=" + id;
		} else {
			let url = "http://iframe.bingewave.local/needs?mode=iframe&mtype=needs&elementid=" + elementID + "&cid=" + id;
		}

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 600);
		//}
	}

	function displayNeedsFeedFrame(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var adbscid = instance.getQueryParameter('adbscid');

		var adbspid = instance.getQueryParameter('adbspid');

		var hashvars = instance.parseHash();

		var url = "http://iframe.bingewave.local/needs/feed?mode=iframe&mtype=needs&elementid=" + elementID + "&cid=" + id;

		//if(adbscid) {


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
		//}
	}

	function displayOpportunitiesFrame(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var adbscid = instance.getQueryParameter('adbscid');

		var adbspid = instance.getQueryParameter('adbspid');

		var hashvars = instance.parseHash();

		if (hashvars && hashvars.opportunity_id && hashvars.discussion_id) {
			var url = "http://iframe.bingewave.local/opportunities/viewdiscussion/" + hashvars.discussion_id + "?mode=iframe&mtype=opportunities&elementid=" + elementID + "&cid=" + id;
		} else if (hashvars && hashvars.opportunity_id) {
			var url = "http://iframe.bingewave.local/opportunities/view/" + hashvars.opportunity_id + "?mode=iframe&mtype=opportunities&elementid=" + elementID + "&cid=" + id;
			//instance.removeHashParam('opportunity_id');
		} else {
			var url = "http://iframe.bingewave.local/opportunities?mode=iframe&mtype=opportunities&elementid=" + elementID + "&cid=" + id;
		}

		//if(adbscid) {
		ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", url);
		renderIframe(widget, id, ifrm, elementID, 600);
		//}
	}

	function displayOpportunitiesFeedFrame(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var adbscid = instance.getQueryParameter('adbscid');

		var adbspid = instance.getQueryParameter('adbspid');

		var hashvars = instance.parseHash();

		var url = "http://iframe.bingewave.local/opportunities/feed?mode=iframe&mtype=opportunities&elementid=" + elementID + "&cid=" + id;

		//if(adbscid) {
		ifrm = document.createElement("IFRAME");
		//ifrm.setAttribute("src",  url);

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
		//}
	}

	function displayPromotionsFrame(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var adbscid = instance.getQueryParameter('adbscid');

		var adbspid = instance.getQueryParameter('adbspid');

		var hashvars = instance.parseHash();

		if (hashvars && hashvars.promotion_id) {
			var url = "http://iframe.bingewave.local/promotions/view/" + hashvars.promotion_id + "?mode=iframe&mtype=promotions&elementid=" + elementID + "&cid=" + id;
		} else {
			var url = "http://iframe.bingewave.local/promotions?mode=iframe&mtype=promotions&elementid=" + elementID + "&cid=" + id;
		}

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		//ifrm.setAttribute("src", url );
		renderIframe(widget, id, ifrm, elementID, 600, url);
		//}
	}

	function displayPromotionsFeedFrame(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var adbscid = instance.getQueryParameter('adbscid');

		var adbspid = instance.getQueryParameter('adbspid');

		var hashvars = instance.parseHash();

		var url = "http://iframe.bingewave.local/promotions/feed?mode=iframe&mtype=promotions&elementid=" + elementID + "&cid=" + id;

		//if(adbscid) {
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
		//}
	}

	function displayManagePromotionsFrame(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var adbscid = instance.getQueryParameter('adbscid');

		var adbspid = instance.getQueryParameter('adbspid');

		var hashvars = instance.parseHash();

		var url = "http://iframe.bingewave.local/promotions/manage?mode=iframe&mtype=promotions_manage&elementid=" + elementID + "&cid=" + id;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		//ifrm.setAttribute("src", url );
		renderIframe(widget, id, ifrm, elementID, 600, url);
		//}
	}

	function displayCollaborationFrame(widget, id, elementID) {

		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var adbscid = instance.getQueryParameter('adbscid');

		var adbspid = instance.getQueryParameter('adbspid');

		var hashvars = instance.parseHash();

		if (hashvars && hashvars.message_id) {
			var url = "http://iframe.bingewave.local/collaborate/message/" + hashvars.message_id + "?mode=iframe&mtype=collaboration&elementid=" + elementID + "&cid=" + id;
		} else if (hashvars && hashvars.connection_requestor_id) {
			var url = "http://iframe.bingewave.local/collaborate/connect/" + hashvars.connection_requestor_id + "?mode=iframe&mtype=collaboration&elementid=" + elementID + "&cid=" + id;
		} else {
			var url = "http://iframe.bingewave.local/collaborate?mode=iframe&mtype=collaboration&elementid=" + elementID + "&cid=" + id;
		}

		//if(adbscid) {
		ifrm = document.createElement("IFRAME");
		//ifrm.setAttribute("src", url );
		renderIframe(widget, id, ifrm, elementID, 600, url);
		//}
	}

	function displayVideosPlayList(widget, id) {
		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var adbscid = instance.getQueryParameter('adbscid');

		var adbspid = instance.getQueryParameter('adbspid');

		var hashvars = instance.parseHash();

		var url = "http://iframe.bingewave.local/podcasts/playlist?mode=iframe&mtype=podcastn&elementid=" + elementID + "&cid=" + id;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		//ifrm.setAttribute("src", url );
		renderIframe(widget, id, ifrm, elementID, 700, url);
		//}
	}

	function displayPodcast(widget, id, object_id) {
		elementID = id + ':' + Math.floor((Math.random() * 100) + 1);

		var adbscid = instance.getQueryParameter('adbscid');

		var adbspid = instance.getQueryParameter('adbspid');

		var hashvars = instance.parseHash();

		var url = "http://iframe.bingewave.local/podcasts/embed/" + object_id + "?mode=iframe&mtype=podcastn&elementid=" + elementID + "&cid=" + id;

		//if(adbscid) {
		let ifrm = document.createElement("IFRAME");
		renderIframe(widget, id, ifrm, elementID, 600);
		//}
	}


	function renderIframe(widget, id, ifrm, elementID, defaultHeight, url) {

		let type = widget.getAttribute("type");

		let environment = widget.getAttribute("env");

		let uniqueTypeID = id + '-' + type + '-iframe';

		if (environment) {
			url = updateQueryStringParameter(url, 'env', environment)
		}

		let frameExist = document.getElementById(uniqueTypeID);

		if (!frameExist) {

			//Need to fix for iphone
			//see issue: https://stackoverflow.com/questions/69495472/iphone-safari-loads-iframe-blob-with-pre-tags

			if (token) {

				let xhr = new XMLHttpRequest();

				xhr.open('GET', url);
				xhr.onreadystatechange = function () {
					if (this.readyState === this.DONE) {
						if (this.status === 200) {
							// this.response is a Blob, because we set responseType above

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
				xhr.setRequestHeader('Authorization', token);
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
			//ifrm.setAttribute("sandbox", "allow-scripts allow-top-navigation allow-same-origin");



			/*ifrm.onload = function (){
				instance.adjustIframeHeight(elementID);
			};*/

			let placeholderFrame = document.createElement('span');
			placeholderFrame.id = uniqueTypeID;

			widget.appendChild(ifrm);
			widget.appendChild(placeholderFrame);

			frames.push(ifrm);

		}

	}

	function windowReady(callback) {
		// in case the document is already rendered
		if (document.readyState != 'loading') callback();
		// modern browsers
		else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
		// IE <= 8
		else document.attachEvent('onreadystatechange', function () {
			if (document.readyState == 'complete') callback();
		});
	}

	function updateQueryStringParameter(uri, key, value) {
		var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		var separator = uri.indexOf('?') !== -1 ? "&" : "?";
		if (uri.match(re)) {
			return uri.replace(re, '$1' + key + "=" + value + '$2');
		}
		else {
			return uri + separator + key + "=" + value;
		}
	}

	function init(data) {

		if (typeof data === 'object' && data !== null) {
			if (data['auth_token']) {
				token = data['auth_token'];
				this.token = data['auth_token'];
			}
		}

		if (!token) {

			let tmpToken = getCookie('bw_auth_token');

			if (tmpToken) {
				token = tmpToken;
			}
		}

		windowReady(function () {

			initCookie();
			addCssToDocument();
			createLoginModal();
			createRegisterModal();
			parseTagsOnLoad();

			parseTags();

			if (MicroModal) {
				MicroModal.init();
			}
			//MicroModal.close('bw-login-modal');
			//parseTagsOnLoad();
			//createPageView();



		});

	}

	function setAuthToken(auth_token) {
		token = auth_token;
		this.token = auth_token;
	}

	function iOS() {
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
	}

	return {

		init: init,
		login: sendLogin,
		register: sendRegister,
		setCookie: setCookie,
		getCookie: getCookie,
		eraseCookie: eraseCookie,
		switchModals: switchModals,
		parseTags: parseTags,
		setAuthToken: setAuthToken,
		getInstance: function () {

			if (!instance) {

				instance = {

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

						var os = instance.unknown;

						for (var id in instance.clientStrings) {
							var cs = instance.clientStrings[id];
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


						for (var id in instance.clientStrings) {
							var cs = instance.clientStrings[id];
							if (cs.r.test(nAgt)) {
								os = cs.s;
								break;
							}
						}

						var osVersion = instance.unknown;

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
						var hash = instance.parseHash();

						return hash[key];
					},

					setHashParam: function (key, val) {
						var hash = instance.parseHash();
						hash[key] = val;
						instance._writeHash(hash);

					},

					removeHashParam: function (key) {
						var hash = instance.parseHash();
						delete hash[key];
						instance._writeHash(hash);
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

			return instance;
		}
	};

})();

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

var adbience = BingewaveConnector.getInstance();

//https://unpkg.com/micromodal@0.4.6/dist/micromodal.min.js

try {
	!function (e, t) { "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self).MicroModal = t() }(this, (function () { "use strict"; function e(e, t) { for (var o = 0; o < t.length; o++) { var n = t[o]; n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n) } } function t(e) { return function (e) { if (Array.isArray(e)) return o(e) }(e) || function (e) { if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e) }(e) || function (e, t) { if (!e) return; if ("string" == typeof e) return o(e, t); var n = Object.prototype.toString.call(e).slice(8, -1); "Object" === n && e.constructor && (n = e.constructor.name); if ("Map" === n || "Set" === n) return Array.from(n); if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return o(e, t) }(e) || function () { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") }() } function o(e, t) { (null == t || t > e.length) && (t = e.length); for (var o = 0, n = new Array(t); o < t; o++)n[o] = e[o]; return n } var n, i, a, r, s, l = (n = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'], i = function () { function o(e) { var n = e.targetModal, i = e.triggers, a = void 0 === i ? [] : i, r = e.onShow, s = void 0 === r ? function () { } : r, l = e.onClose, c = void 0 === l ? function () { } : l, d = e.openTrigger, u = void 0 === d ? "data-micromodal-trigger" : d, f = e.closeTrigger, h = void 0 === f ? "data-micromodal-close" : f, v = e.openClass, m = void 0 === v ? "is-open" : v, g = e.disableScroll, b = void 0 !== g && g, y = e.disableFocus, p = void 0 !== y && y, w = e.awaitCloseAnimation, E = void 0 !== w && w, k = e.awaitOpenAnimation, M = void 0 !== k && k, C = e.debugMode, A = void 0 !== C && C; !function (e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") }(this, o), this.modal = document.getElementById(n), this.config = { debugMode: A, disableScroll: b, openTrigger: u, closeTrigger: h, openClass: m, onShow: s, onClose: c, awaitCloseAnimation: E, awaitOpenAnimation: M, disableFocus: p }, a.length > 0 && this.registerTriggers.apply(this, t(a)), this.onClick = this.onClick.bind(this), this.onKeydown = this.onKeydown.bind(this) } var i, a, r; return i = o, (a = [{ key: "registerTriggers", value: function () { for (var e = this, t = arguments.length, o = new Array(t), n = 0; n < t; n++)o[n] = arguments[n]; o.filter(Boolean).forEach((function (t) { t.addEventListener("click", (function (t) { return e.showModal(t) })) })) } }, { key: "showModal", value: function () { var e = this, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null; if (this.activeElement = document.activeElement, this.modal.setAttribute("aria-hidden", "false"), this.modal.classList.add(this.config.openClass), this.scrollBehaviour("disable"), this.addEventListeners(), this.config.awaitOpenAnimation) { var o = function t() { e.modal.removeEventListener("animationend", t, !1), e.setFocusToFirstNode() }; this.modal.addEventListener("animationend", o, !1) } else this.setFocusToFirstNode(); this.config.onShow(this.modal, this.activeElement, t) } }, { key: "closeModal", value: function () { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, t = this.modal; if (this.modal.setAttribute("aria-hidden", "true"), this.removeEventListeners(), this.scrollBehaviour("enable"), this.activeElement && this.activeElement.focus && this.activeElement.focus(), this.config.onClose(this.modal, this.activeElement, e), this.config.awaitCloseAnimation) { var o = this.config.openClass; this.modal.addEventListener("animationend", (function e() { t.classList.remove(o), t.removeEventListener("animationend", e, !1) }), !1) } else t.classList.remove(this.config.openClass) } }, { key: "closeModalById", value: function (e) { this.modal = document.getElementById(e), this.modal && this.closeModal() } }, { key: "scrollBehaviour", value: function (e) { if (this.config.disableScroll) { var t = document.querySelector("body"); switch (e) { case "enable": Object.assign(t.style, { overflow: "" }); break; case "disable": Object.assign(t.style, { overflow: "hidden" }) } } } }, { key: "addEventListeners", value: function () { this.modal.addEventListener("touchstart", this.onClick), this.modal.addEventListener("click", this.onClick), document.addEventListener("keydown", this.onKeydown) } }, { key: "removeEventListeners", value: function () { this.modal.removeEventListener("touchstart", this.onClick), this.modal.removeEventListener("click", this.onClick), document.removeEventListener("keydown", this.onKeydown) } }, { key: "onClick", value: function (e) { e.target.hasAttribute(this.config.closeTrigger) && this.closeModal(e) } }, { key: "onKeydown", value: function (e) { 27 === e.keyCode && this.closeModal(e), 9 === e.keyCode && this.retainFocus(e) } }, { key: "getFocusableNodes", value: function () { var e = this.modal.querySelectorAll(n); return Array.apply(void 0, t(e)) } }, { key: "setFocusToFirstNode", value: function () { var e = this; if (!this.config.disableFocus) { var t = this.getFocusableNodes(); if (0 !== t.length) { var o = t.filter((function (t) { return !t.hasAttribute(e.config.closeTrigger) })); o.length > 0 && o[0].focus(), 0 === o.length && t[0].focus() } } } }, { key: "retainFocus", value: function (e) { var t = this.getFocusableNodes(); if (0 !== t.length) if (t = t.filter((function (e) { return null !== e.offsetParent })), this.modal.contains(document.activeElement)) { var o = t.indexOf(document.activeElement); e.shiftKey && 0 === o && (t[t.length - 1].focus(), e.preventDefault()), !e.shiftKey && t.length > 0 && o === t.length - 1 && (t[0].focus(), e.preventDefault()) } else t[0].focus() } }]) && e(i.prototype, a), r && e(i, r), o }(), a = null, r = function (e) { if (!document.getElementById(e)) return console.warn("MicroModal: â—Seems like you have missed %c'".concat(e, "'"), "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "ID somewhere in your code. Refer example below to resolve it."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<div class="modal" id="'.concat(e, '"></div>')), !1 }, s = function (e, t) { if (function (e) { e.length <= 0 && (console.warn("MicroModal: â—Please specify at least one %c'micromodal-trigger'", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "data attribute."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<a href="#" data-micromodal-trigger="my-modal"></a>')) }(e), !t) return !0; for (var o in t) r(o); return !0 }, { init: function (e) { var o = Object.assign({}, { openTrigger: "data-micromodal-trigger" }, e), n = t(document.querySelectorAll("[".concat(o.openTrigger, "]"))), r = function (e, t) { var o = []; return e.forEach((function (e) { var n = e.attributes[t].value; void 0 === o[n] && (o[n] = []), o[n].push(e) })), o }(n, o.openTrigger); if (!0 !== o.debugMode || !1 !== s(n, r)) for (var l in r) { var c = r[l]; o.targetModal = l, o.triggers = t(c), a = new i(o) } }, show: function (e, t) { var o = t || {}; o.targetModal = e, !0 === o.debugMode && !1 === r(e) || (a && a.removeEventListeners(), (a = new i(o)).showModal()) }, close: function (e) { e ? a.closeModalById(e) : a.closeModal() } }); return window.MicroModal = l, l }));

} catch (error) {
	console.error(error);
	// expected output: ReferenceError: nonExistentFunction is not defined
	// Note - error messages will vary depending on browser
}
