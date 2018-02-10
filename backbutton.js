(function(window) {

  var listeners = [false],
    document = "document",
    location = "location",
    href = "href",
    lastFragment = getFragment(),
    winDocument = window[document],
    hashChangeSupport = "onhashchange" in window && window.addEventListener,
    // public interface

    backbuttonObject = (window["backbutton"] = {
      version: "1.0.2",

      observe: function(fn) {
        var i = listeners.length;
        listeners[i] = fn;
        return function() {
          listeners[i] = false;
        };
      },

      navigate: setFragment,

      current: getFragment,

      routes: function(routingTable, autoStart) {
        var oldRouter = listeners[0];
        if (autoStart === void 0 || autoStart === true) setTimeout(notify);
        if (routingTable && typeof routingTable === "object") {
          listeners[0] = function(fragmentString) {
            for (
              var index = 0,
                length = routingTable.length,
                matchResult,
                returnValue;
              index < length;
              index += 2
            ) {
              if ((matchResult = fragmentString.match(routingTable[index]))) {
                returnValue = routingTable[index + 1].apply(
                  backbuttonObject,
                  matchResult.slice(1)
                );
                if (!returnValue) {
                  break;
                } else if (typeof returnValue === "string") {
                  fragmentString = returnValue;
                }
              }
            }
          };
        } else {
          listeners[0] = routingTable;
        }
        return oldRouter;
      },

      refresh: notify
    });

  // backbutton initialization and setup

  setFragment(lastFragment);
  
  if (hashChangeSupport) {
    window.addEventListener("hashchange", notify, false);

  /* start of old browser support */
  } else {
    var pollInterval = 50,
      iFrame,
      iWindow,
      iWinDocument;

    iFrame = winDocument.createElement("iframe");
    iFrame.src = "javascript:0";
    iFrame.style.display = "none";
    iFrame.tabIndex = -1;
    iWindow = winDocument.body.insertBefore(iFrame, winDocument.body.firstChild)
      .contentWindow;
    iWinDocument = iWindow[document];
    iWinDocument.open();
    iWinDocument.close();
    setFragment(lastFragment, iWindow[location]);
    setInterval(function() {
      var current = getFragment(),
        last = getFragment(iWindow[location][href]);

      if (current != lastFragment) {
        if (current != last) {
          iWinDocument = iWindow[document];
          iWinDocument.open();
          iWinDocument.close();
          setFragment(current, iWindow[location]);
        }
        notify(0, current);
        lastFragment = current;
      } else if (last != lastFragment) {
        window[location][href] =
          window[location][href].replace(/#.*/, "#") + last;
      }
    }, pollInterval);
  }
  /* end of old browser support */

  // internal functions

  function getFragment(url) {
    url = url || window[location][href] || "";
    var i = url.indexOf("#");
    return i > -1 ? url.slice(i + 1) : "";
  }

  function setFragment(fragment, locationObject) {
    (locationObject || window[location]).hash = "#" + fragment;
  }

  function notify(eventObject, fragment) {
    var index,
      length = listeners.length;

    fragment = unescape(fragment || getFragment());

    for (index = 0; index < length; index++)
      typeof listeners[index] === "function" &&
        listeners[index].call(backbuttonObject, fragment);
  }

})(window);
