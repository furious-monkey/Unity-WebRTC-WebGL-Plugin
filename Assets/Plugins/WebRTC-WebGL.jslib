var BingewaveConnector = {
  // Instance stores a reference to the Singleton
  $globalVariables: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJiaW5nZXdhdmUtd2VicnRjIiwiaXNzIjoiYmluZ2V3YXZlLXdlYnJ0YyIsInN1YiI6Im1lZXQuYmluZ2V3YXZlLmNvbSIsInJvb20iOiIqIn0.NUvbPsKW9ahAyeTVMVEIGWrhLoPH8UJfRCvUbWhi5u0",
    frames: [],
    sessionData: {},
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
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    } catch (error) {
      if (globalVariables.sessionData[name]) {
        return globalVariables.sessionData[name];
      }

      return null;
    }
  },

  $windowReady: function (callback) {
    // in case the document is already rendered
    if (document.readyState != "loading") callback();
    // modern browsers
    else if (document.addEventListener)
      document.addEventListener("DOMContentLoaded", callback);
    // IE <= 8
    else
      document.attachEvent("onreadystatechange", function () {
        if (document.readyState == "complete") callback();
      });
  },

  $parseTagsOnLoad: function () {
    if (window.addEventListener) {
      window.addEventListener("message", listenIframe, false);
    } else if (window.attachEvent) {
      window.attachEvent("onmessage", listenIframe);
    }
  },

  $displayWebRTC: function (widget, id, elementID) {
    elementID = id + ":" + Math.floor(Math.random() * 100 + 1);

    var url =
      "https://widgets.bingewave.com/webrtc/" + id + "?elementid=" + elementID;

    var ifrm = document.createElement("IFRAME");
    ifrm.setAttribute("allowfullscreen", "true");
    ifrm.setAttribute("webkitallowfullscreen", "true");
    ifrm.setAttribute("mozallowfullscreen", "true");
    ifrm.setAttribute("allow", "camera *;microphone *");
    ifrm.setAttribute("width", "100%");
    renderIframe(widget, id, ifrm, elementID, 0, url);
  },

  $parseTags: function () {
    //Get bw:widget elements
    var elements = document.getElementsByTagName("bw:widget");

    for (var i = 0; i < elements.length; i++) {
      var widget = elements[i];
      var id = widget.getAttribute("id");
      var object_id = widget.getAttribute("oid");
      displayWebRTC(widget, id, object_id);
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
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    } catch (error) {
      globalVariables.sessionData[name] = value;
    }
  },

  $listenIframe: function (event) {
    if (
      !(
        event.origin + "/" == "https://widgets.bingewave.com/" ||
        event.origin + "/" == "https://www.bingewave.com/" ||
        event.origin + "/" == "http://iframe.bingewave.local/"
      )
    ) {
      //return;
    }

    if (
      event.data &&
      (typeof event.data === "string" || event.data instanceof String)
    ) {
      try {
        var data = JSON.parse(event.data);

        if (data.command && data.command == "require_login") {
          globalVariables.token = data.token;
        } else if (data.command && data.command == "set_auth_token") {
          globalVariables.token = data.token;
          setCookie("bw_auth_token", globalVariables.token);
        } else if (data.command && data.command == "refresh_page") {
          refreshPage();
        } else if (data.elementid) {
          var iFrameID = document.getElementById(
            data.elementid.replace(":80", "")
          );
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

  $renderIframe: function (widget, id, ifrm, elementID, defaultHeight, url) {
    var type = widget.getAttribute("type");
    var environment = widget.getAttribute("env");
    var uniqueTypeID = id + "-" + type + "-iframe";

    if (environment) {
      url = updateQueryStringParameter(url, "env", environment);
    }

    var frameExist = document.getElementById(uniqueTypeID);

    if (!frameExist) {
      if (globalVariables.token) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = function () {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              var data_url = URL.createObjectURL(this.response);
              ifrm.setAttribute("src", data_url);
            } else {
              console.log(type);
              console.log(url);
              console.error("Unable To Set IFrame SRC");
            }
          }
        };
        xhr.responseType = "blob";
        xhr.setRequestHeader("Authorization", globalVariables.token);
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

      var placeholderFrame = document.createElement("span");
      placeholderFrame.id = uniqueTypeID;

      widget.appendChild(ifrm);
      widget.appendChild(placeholderFrame);

      globalVariables.frames.push(ifrm);
    }
  },

  $updateQueryStringParameter: function (uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf("?") !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, "$1" + key + "=" + value + "$2");
    } else {
      return uri + separator + key + "=" + value;
    }
  },

  init: function (data) {
    if (typeof data === "object" && data !== null) {
      if (data["auth_token"]) {
        globalVariables.token = data["auth_token"];
        this.token = data["auth_token"];
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
      parseTagsOnLoad();
      parseTags();
    });
  },
};

autoAddDeps(BingewaveConnector, "$globalVariables");
autoAddDeps(BingewaveConnector, "$initCookie");
autoAddDeps(BingewaveConnector, "$refreshPage");
autoAddDeps(BingewaveConnector, "$setCookie");
autoAddDeps(BingewaveConnector, "$getCookie");
autoAddDeps(BingewaveConnector, "$parseTags");
autoAddDeps(BingewaveConnector, "$parseTagsOnLoad");
autoAddDeps(BingewaveConnector, "$listenIframe");
autoAddDeps(BingewaveConnector, "$displayWebRTC");
autoAddDeps(BingewaveConnector, "$renderIframe");
autoAddDeps(BingewaveConnector, "$windowReady");
autoAddDeps(BingewaveConnector, "$updateQueryStringParameter");
mergeInto(LibraryManager.library, BingewaveConnector);
