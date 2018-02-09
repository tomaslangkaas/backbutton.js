(function(window) {
  
  var listeners = [false],
      document = 'document',
      location = 'location',
      href = 'href',
      lastFragment = getFragment(),
      winDocument = window[document],
      hashChangeSupport = ('onhashchange' in window) && 
                           window.addEventListener,

      // public interface

      backbuttonObject = window['backbutton'] = {
      
      'version': '1.0.0',

      'observe': function(fn) {
        var i = listeners.length;
        listeners[i] = fn;
        return function(){
          listeners[i] = false;
        }
      },
      
      'navigate': setFragment,
      
      'current': getFragment,
      
      'routes': function(arg, /*options,*/ preventRefresh) {
        var oldRouter = listeners[0];
        !preventRefresh && setTimeout(notify);
        //options = options || {};
        if (arg && typeof(arg) === 'object') {
          listeners[0] = function(fragmentString) {
            //if (!options['capture'] || options['capture'](fragmentString)) {
              for (var index = 0, length = arg.length, matchResult, returnValue; index < length; index += 2) {
                if (matchResult = fragmentString.match(arg[index])) {
                  returnValue = arg[index + 1].apply(backbuttonObject, matchResult.slice(1));
                  if (!returnValue) {
                    break;
                  }else if(typeof returnValue === 'string'){
                    fragmentString = returnValue;
                  }
                }
              }
              //if (index == length && options[404]) options[404](fragmentString);
            //}
          }
        } else {
          listeners[0] = arg;
        }
        return oldRouter;
      },
      
      'refresh': notify//,
      
      //'back': function() {
        //setTimeout(function(){
          //window.history.go(-1);
          //window.history.back();
          //window.history.back(-1);
        //},500)
      //}

    };

  // backbutton initialization and setup

  setFragment(lastFragment);
  
  if (hashChangeSupport) {
    window.addEventListener('hashchange', notify, false);
  } else {
    var pollInterval = 50,    
        iFrame, 
        iWindow, 
        iWinDocument;
    
    iFrame = winDocument.createElement('iframe');
    iFrame.src = 'javascript:0';
    iFrame.style.display = 'none';
    iFrame.tabIndex = -1;
    iWindow = winDocument.body.insertBefore(iFrame, winDocument.body.firstChild).contentWindow;
    iWinDocument = iWindow[document];
    iWinDocument.open();
    iWinDocument.close();
    setFragment(lastFragment, iWindow[location]);
    setInterval(function () {
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
          window[location][href] = window[location][href].replace(/#.*/, '#') + last;
        }
      }, pollInterval
    );
  }
  
  // internal functions

  function getFragment(url) {
    url = url || window[location][href] || '';
    var i = url.indexOf('#');
    return i > -1 ? url.slice(i + 1) : '';
  }

  function setFragment(fragment, locationObject) {
    (locationObject || window[location]).hash = '#' + fragment;
  }

  function notify() {
    //console.log('notify', [fragment, backbutton.current()]);
    
    var index, 
        fragment = getFragment(),
        length = listeners.length;

    //fragment = fragment || getFragment();
    for (index = 0; index < length; index++)
      typeof listeners[index] === 'function' && 
      listeners[index](fragment);
  }
  
  //return backbuttonObject;
  
})(window);
