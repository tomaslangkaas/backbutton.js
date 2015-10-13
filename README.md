# backbutton.js
small cross-browser hash-based router library for client-side single page apps

## API

### backbutton.navigate(fragmentString)

Sets fragment to `fragmentString`. Creates new item in browser history and triggers fragment change if `fragmentString` is different from previous fragment.

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

Registers a listener function. Each call to `backbutton.observe` adds another listener. On fragment change, each listener is called with the new fragment as a single argument.

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

//set fragment to '/about', 
//triggers routeHandlers['/about']()
backbutton.navigate('/about');

```

### backbutton.refresh()

Fires all listeners with current fragment. For use on page load.

```javascript
//user navigates directly to http://path/doc.html#/page/7
//from another page or from browser history,
//nothing happens until refresh is called

backbutton.refresh();

//now any listeners registered with backbutton.observe
//or backbutton.routes have been called
```

### backbutton.routes(RegExpRoutesArray [,fallbackListener])

### backbutton.back()

Goes back to previous item in browser history. Facade for `window.history.back()`.

```javascript
//current location is http://path/doc.html#/home
//navigate to route '/about'

backbutton.navigate('/about');

//current location is http://path/doc.html#/about,
//any registered backbutton listeners or routes are triggered
//with the fragment '/about'

//navigate back, same as clicking on
//back button in browser

backbutton.back();

//current location is now http://path/doc.html#/home again
//any registered backbutton listeners or routes are triggered
//with the fragment '/home'
```
