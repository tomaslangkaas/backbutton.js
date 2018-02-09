![backbutton.js](http://tomaslangkaas.github.io/backbutton.js/assets/backbutton.svg)

**backbutton.js*&mdash;The 1kb standalone router for client-side JavaScript applications*

**backbutton.js** makes the browser back button functional in single page apps  
**backbutton.js** makes it easy to implement client-side routing  
**backbutton.js** works basically everywhere, including local files and old browsers(\*)  
**backbutton.js** allows for fast prototyping with little setup&mdash;achieve much with just a text editor and a local browser  
**backbutton.js** is open source (MIT licensed), freely use it for any purpose

(\*) *tested in IE6+, FF3.6+, Safari 4+, iOS Safari 4+, Chrome 6+, Opera 12+, [run tests online](http://tomaslangkaas.github.io/backbutton.js/)*

## Quick demonstration

Fire up a text editor or somewhere else you can enter and preview some HTML and JavaScript (like [CodePen](https://codepen.io/), [JS Bin](https://jsbin.com/), [JSFidddle](https://jsfiddle.net/)). Then, copy and paste the following code in an HTML document and preview in a browser:

```html
<nav>
  <a href="#">Home</a>
  <a href="#services">Services</a>
  <a href="#about">About</a>
</nav>
<main id="view"></main>
<script src="https://cdn.jsdelivr.net/gh/tomaslangkaas/backbutton.js@1.0.0/backbutton.js"></script>
<script>
backbutton.routes([
  /^(services|about)$/, function(path){ // topic page route
    display('This is the ' + path + ' page.')
  },
  /.*/, function(){ // route anything else to the home page
    display('This is the home page');
  }
]);
function display(message){
  document.getElementById('view').innerHTML = message;
}
</script>
```

## How **backbutton.js** works

**backbutton.js** responds to changes in `location.hash`. App navigation is implemented by setting the value of `location.hash`, either from links, like `<a href="#applicationPath>`, or from code, like `backbutton.navigate('applicationPath')`.

Routes are set up by providing `backbutton.routes()` with a routing table&mdash;an array of regular expressions and route callbacks:

```javascript
backbutton.routes([
  /^$/, // triggered by blank path, like <a href="#">
  function(){
    /* home route callback for blank path */
  },
  
  /^search:(.*)/, // triggered by search:queryString, like <a href="#search:rabbits">
  function(queryString){
    /* search route callback */
  },
  
  /(.*)/, // catch-all, triggered by anything not captured by other routes
  function(path){
    /* anything else route callback */
  }
]);
```

Whenever `location.hash` changes, the routing table array works like a switch statement; **backbutton.js** loops through the routing table until it encounters the first regular expression that matches `location.hash`, then executes the corresponding callback function. Any captured sub-expressions are provided as arguments to the callback.

If the callback function provides a truthy return value, `backbutton.routes()` proceeds looping through the routing table until it encounters the next regular expression that matches. Otherwise, it stops. If no regular expression matches, nothing happens.

If a route callback returns a non-blank string, `backbutton.routes()` will match subsequent regular expressions against this string instead of `location.hash`, making it possible to implement route redirects or other types of conditional routing.

## Auto start and manual start

When `backbutton.routes()` is provided with a routing table, **backbutton.js** automatically loops through the array, attempting to match the current `location.hash` against the table. This behaviour is to automatically start routing on route setup. To prevent this behaviour, pass `false` as a second argument: `backbutton.routes(routingTable, false)`.

To manually trigger routing with the current value of `location.hash`, call `backbutton.refresh()`. This will notify all `backbutton` observers, including `backbutton.routes()`. Thus, these examples are equivalent, as they both immediately calls any route that corresponds to the current `location.hash`:

```javascript
// auto start
backbutton.routes(routingTable);

// or manual start
backbutton.routes(routingTable, false);
backbutton.refresh();
```

## The **backbutton.js** API

**backbutton.js** has a small, but versatile API:

* `backbutton.version` is a string containing the version number.
* `backbutton.navigate()` sets `location.hash` from code.
* `backbutton.current()` gets the current `location.hash`.
* `backbutton.refresh()` notifies all observers that `location.hash` has changed, while it has not. Calling this function does not create any new history entries.
* `backbutton.observe()` registers observers to monitor changes in `location.hash`.
* `backbutton.routes()` provides routing with regular expressions and callbacks.

#### `backbutton.navigate(newHashString)` and `backbutton.current()`

These two functions respectively sets and gets the value of `location.hash`. Use these functions to ensure cross-browser functionality, some old browsers have issues with setting and getting `location.hash` from code.

```javascript
// before: current url is http://somedomain.com/somedocument

backbutton.navigate('someApplicationPath');

// after: current url is now http://somedomain.com/somedocument#someApplicationPath
// all active observers and the router in `backbutton.routes()` are notified about the change

var currentHash = backbutton.current(); // 'someApplicationPath'

```

#### `backbutton.refresh()`

This function notifies all active observers and the router in `backbutton.routes()` that `location.hash` has changed, while it has not. This can be used to manually trigger routing or observers on document load. Note that each call to `backbutton.routes()` automatically calls `backbutton.refresh()`, unless it is specifically told not to.

#### `backbutton.observe(observerFunction)`

This function registers an observer function, to be called whenever `location.hash` changes. `backbutton.observe()` returns an unregister function, used to unregister the observer. Call `backbutton.observe()` multiple times to register multiple observers.

```javascript
var unobserve = backbutton.observe(function(currentLocationHashString){
  /* called whenever location.hash changes */
});

// remove the observer
unobserve();
```

Observers are notified after the router in `backbutton.routes()`. Observers are notified in the order they are registered. Observers are provided with the current value of `location.hash` as the only argument. In observer functions, the keyword `this` refers to `backbutton`.

#### `backbutton.routes(routingTableArray [,autoStartBoolean])`

`backbutton.routes()` is called to setup a routing table. A routing table is an array of regular expressions and route callbacks. When `location.hash` changes, the routing table is handled as a switch statement, for the first regular expression that matches the current value of `location.hash`, the corresponding route callback is called.

##### Auto start and manual start

Each time a routing table is set with `backbutton.routes()`, `backbutton.refresh()` is automatically called to call routes (and observers) that match the current value of `location.hash`. To prevent this behavior, pass `true` as the second argument to `backbutton.routes()`.

##### Route parameters

If a regular expression has sub-expressions that are captured, these are provided as arguments to the route handler.

```javascript
backbutton.routes([
  /(\w+)\/(\w+)/, // matches the pattern "someCategory/someSubcategory"
  function(category, subcategory){
    // the captured sub-expressions are provided as separate arguments
  }
]);
```

##### Catch-all route

To capture any value of `location.hash` not captured by other routes, add a catch-all regular expression and route callback at the end of the routing table. This mimics the `default:` label in switch statements, and could be used to implement 404 page functionality.

Note that if there is no catch-all route, no route callback will be called on document load if the first `location.hash` is unsupported.

```javascript
backbutton.routes([
  /(.*)/, // catch-all, triggered by anything not captured by other routes
  function(path){
    /* anything else route callback */
  }
]);
```

##### The `this` keyword

In route callbacks, `this` refers to `backbutton`.

```javascript
backbutton.routes([
  /(.*)/, function(path){
    /* this code */
    backbutton.current();
    /* is equivalent to this code */
    this.current();
  }
]);
```

##### Conditional routing

The routing table array works like a switch statement. When `location.hash` changes, **backbutton.js** loops through the table until it encounters the first regular expression that matches the current value of `location.hash`, then calls the corresponding route callback.

If a route callback returns a falsy value (functions return `undefined` by default), the loop stops. 

However, if the route callback returns a truthy value, like `true`, the loop continues until it encounters the next regular expression that matches, then calls the corresponding route callback.

If a route callback returns a non-blank string (that is, any string except `""`), subsequent regular expressions are matched against this string instead of `location.hash`, making it possible to do route redirects.

Utilizing these mechanisms, it is quite easy to create quite complex routing behaviour, with routes that checks for specific conditions, routes that are only accessible under specific conditions, and routes that redirect under specific conditions.

See the [source code of the **backbutton.js** tests](https://github.com/tomaslangkaas/backbutton.js/blob/gh-pages/tests/tests.js) for examples of conditional routing in action.

##### Change the routing table at runtime

The routing table array is passed by reference to `backbutton.routes()`. By keeping another reference elsewhere to the routing table array, it is possible to change routing by changing the array. Regular expressions and/or route callbacks can be replaced or removed at runtime by using the `.splice()` method of arrays.

The current routing table array could also be replaced at any time by calling `backbutton.routes()` with a new routing table array.

Internally, `backbutton.routes()` creates an observer function that loops through the provided routing table. When `backbutton.routes()` is provided with a routing table array, it returns the prior router, that is, the prior observer function. To reinstate the prior router, call `backbutton.routes` with the prior observer function as the first argument.

See the [source code of the **backbutton.js** tests](https://github.com/tomaslangkaas/backbutton.js/blob/gh-pages/tests/tests.js) for examples of routing table manipulation at runtime.
