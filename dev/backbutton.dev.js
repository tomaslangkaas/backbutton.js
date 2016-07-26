var backbutton = (function(gwin) {
    function getFragment(url) {
        url = url || gwin[LOC][HREF] || '';
        var i = url.indexOf('#');
        return i > -1 ? url.slice(i + 1) : '';
    }

    function setFragment(fragment, loct) {
        (loct || gwin[LOC]).hash = '#' + fragment;
    }

    function poll() {
        var current = getFragment(),
            last = getFragment(iwindow[LOC][HREF]);
        if (current != lastfrag) {
            if (current != last) {
                iwindoc = iwindow[DOC];
                iwindoc.open();
                iwindoc.close();
                setFragment(current, iwindow[LOC]);
            }
            trigger(0, current);
            lastfrag = current;
        } else if (last != lastfrag) {
            gwin[LOC][HREF] = gwin[LOC][HREF].replace(/#.*/, '#') + last;
        }
    }

    function trigger(evt, fragment) {
        var i, l = listeners.length;
        fragment = fragment || getFragment();
        router && router(fragment);
        for (i = 0; i < l; i++) listeners[i](fragment);
    }
    var listeners = [],
        DOC = 'document',
        docm = gwin[DOC],
        LOC = 'location',
        HREF = 'href',
        hashChangeSupport = ('onhashchange' in gwin) && gwin.addEventListener,
        iFrame, iwindow, iwindoc,
        router,
        lastfrag = getFragment(),
        methods = {
            'observe': function(fn) {
                listeners.push(fn);
            },
            'navigate': setFragment,
            'current': getFragment,
            'routes': function(arg, fallback) {
                if (arg) {
                    router = function(str) {
                        for (var i = 0, l = arg.length, m; i < l; i += 2) {
                            if (m = str.match(arg[i])) {
                                arg[i + 1].apply(null, m.slice(1));
                                break;
                            }
                        }
                        if (i == l && fallback) fallback(str);
                    }
                } else {
                    router = 0;
                }
            },
            'refresh': trigger,
            'back': function() {
                gwin.history.back();
            }
        };
    setFragment(lastfrag);
    if (hashChangeSupport) {
        gwin.addEventListener('hashchange', trigger, false);
    } else {
        iFrame = docm.createElement('iframe');
        iFrame.src = 'javascript:0';
        iFrame.style.display = 'none';
        iFrame.tabIndex = -1;
        iwindow = docm.body.insertBefore(iFrame, docm.body.firstChild).contentWindow;
        iwindoc = iwindow[DOC];
        iwindoc.open();
        iwindoc.close();
        setFragment(lastfrag, iwindow[LOC]);
        setInterval(poll, 50);
    }
    return methods;
})(window);
