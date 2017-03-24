![backbutton.js](http://tomaslangkaas.github.io/backbutton.js/assets/backbutton.svg)

A tiny cross-browser hash-based router library for single page apps

```javascript
backbutton.routes([
  /^$/, function () {
    /* home page route */
  },

  /^search\/(.*)$/, function (querystring) {
    /* route handler for /search/:query */
  }
],{
  404: function (fragmentPath) {
    /* handle non-existing routes */
  }
});

```

## Features

* Enables browser navigation in single page apps&mdash;enables back button
* Tiny (~ 1 kb), no dependencies
* Versatile
  * Allows dynamic routing and parametrized routes (with regular expressions)
  * Wide browser coverage (tested in IE6+, FF3.6+, Chrome 6+, Safari 4+, Mobile Safari 4+, Opera 12+, Android browser 2.2+)
  * Works for both local files (file: protocol) and served files (http: protocol)
* MIT-licensed
* Implements location polling and iframe-based history entry to work in IE6&ndash;8. Relies on `onhashchange` event in modern browsers. Based on code fragments from the [Backbone History source code](http://backbonejs.org/docs/backbone.html#section-196) and the [jquery hashchange plugin source code](http://benalman.com/projects/jquery-hashchange-plugin/)

## Demo

Demo code at [codepen](http://codepen.io/tomaslangkaas/full/GZmarM/)

## Tests

[Run tests online](http://tomaslangkaas.github.io/backbutton.js/tests/run.html)

## API

### backbutton.navigate( fragmentString )

Sets fragment to `fragmentString`. Creates new item in browser history and triggers fragment change if `fragmentString` is different from previous fragment.

```javascript
//if current location is http://path/doc.html

backbutton.navigate('/page/7');

//current location has changed to http://path/doc.html#/page/7
//any registered backbutton listeners or routes are triggered
//with the fragment string '/page/7'
```

### backbutton.current()

Returns current fragment.

```javascript
//if current location is http://path/doc.html#/page/7

var frag = backbutton.current();

//frag now equals "/page/7"
```

### backbutton.observe( fragmentChangeListener )

Registers a listener function. Each call to `backbutton.observe` adds another listener. On fragment change, each listener is called with the new fragment string as a single argument.

```javascript
//example router with static routes

var routeHandlers = {
  '/home': function(){ ... },
  '/about': function(){ ... },
  '/404': function(){ ... }
};

//register listener for the router

backbutton.observe(function(newFragmentString){
  if(routeHandlers[newFragmentString]){
    //call route handler
    routeHandlers[newFragmentString]();
  }else{
    //call error route handler
    routeHandlers['/404']();
  }
});

//setting fragment to '/about' triggers the registered
//listener with the new fragment string '/about',
//which in turn triggers
//routeHandlers['/about']()

backbutton.navigate('/about');
```

### backbutton.refresh()

Fires all listeners with current fragment string. For use on page load.

```javascript
//user navigates directly to http://path/doc.html#/page/7
//from another page or from browser history,
//registered backbutton observers or routes
//are not triggered on page load, since this
//is not technically a fragment change

backbutton.refresh();

//now all listeners registered with backbutton.observe
//or backbutton.routes are called with the current
//fragment string '/page/7'
```

### backbutton.routes( RegExpRoutesArray [,fallbackListener] )

Sets up route listeners with regular expressions. Regular expressions are executed in order, until first route match. Thus, order matters. If there is no route match, the fallbackListener is called if it is defined.

Regular expressions allow for routes with parameters and for validation of dynamic paths.

The `RegExpRoutesArray` argument is an array with alternating regular expressions and their corresponding listeners.

```javascript
//route handlers

var routeHandlers = {
  home: function(){ ... },
  searchPage: function(queryString){ ... },
  viewProduct: function(category, productId){ ... },
  noRouteMatch: function(fragment){ ... }
};

backbutton.routes([
    //matches '/home' and '/home/'
    /^\/home\/?$/,
    routeHandlers.home,

    //matches '/search/*',
    //passes querystring to handler
    /^\/search\/(.*)$/,
    routeHandlers.searchPage,

    //matches '/:category/:productId*',
    //where category consist of letters and
    //productId consist of digits
    /^\/([a-z]+)\/(\d+)$/i,
    routeHandlers.viewProduct
  ],
  //fallback route handler
  routeHandlers.noRouteMatch
);
```

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
