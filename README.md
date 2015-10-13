# backbutton.js
small cross-browser hash-based router library for single page apps

## API

### backbutton.navigate(fragmentString)

Sets fragment to `fragmentString`. Triggers fragment change if different from previous fragment.

```javascript
//if current location is http://path/doc.html

backbutton.navigate('/page/7');

//current location has changed to http://path/doc.html#/page/7
```

### backbutton.current()

Returns current fragment.

```javascript
//if current location is http://path/doc.html#/page/7

var frag = backbutton.current();

//frag now equals "/page/7"
```

### backbutton.observe(fragmentChangeListener)

Registers a listener function. Each call to `backbutton.observe` adds another listener. On fragment change, each listener is called with the new fragment as a single argument. There is currently no method to unregister listeners.

```javascript
//router with static routes

var routeHandlers = {
  '/home': function(){ ... },
  '/about': function(){ ... },
  '/404': function(){ ... }
};

//register listener for the router
backbutton.observe(function(newFragment){
  if(routeHandlers[newFragment]){
    //call route handler
    routeHandlers[newFragment]();
  }else{
    //call error route handler
    routeHandlers['/404']();
  }
});
```

### backbutton.refresh()

Fires all listeners with current fragment. Useful on first page load.

```
//user navigates directly to http://path/doc.html#/page/7
//from another page or from browser history,
//nothing happens until refresh is called

backbutton.refresh();

//now any listeners registered with backbutton.observe
//or backbutton.routes are called
```
