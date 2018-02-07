backbutton.js is a small, versatile micro-libary for client-side routing

Setting up routes is easy, simply pass a routing table&mdash;an array of regular expressions and callback functions&mdash; to `backbutton.routes()`, and it works:

```javascript
backbutton.routes([
  /^$/, // matches empty fragment paths
  function(){/* home route callback */},
  
  /^search:(.*)$/, // search:query
  function(query){/* search route callback */},
  
  /(.*)/, // catch all other paths
  function(fragmentPath){/* 404 route callback */}
]);
```
