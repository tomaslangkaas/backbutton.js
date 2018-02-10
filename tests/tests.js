test("backbutton.navigate()", function(pass, fail) {
  var fragmentTest = randomString();
  backbutton.navigate(fragmentTest);
  location.href.indexOf(fragmentTest) > 0 ? pass() : fail();
});

test("backbutton.current()", function(pass, fail) {
  var fragmentTest = randomString();
  location.hash = "#" + fragmentTest;
  backbutton.current() == fragmentTest ? pass() : fail();
});

test("backbutton.observe()", function(pass, fail) {
  var fragmentTest = randomString(),
    unobserve = backbutton.observe(observe),
    timer = setTimeout(resolve, 500);

  function observe(fragmentString) {
    resolve(fragmentString == fragmentTest);
  }

  function resolve(passed) {
    clearTimeout(timer);
    unobserve();
    passed ? pass() : fail();
  }

  backbutton.navigate(fragmentTest);
});

test("backbutton.observe(), unregister", function(pass, fail) {
  var fragmentTest = randomString(),
    unobserve1 = backbutton.observe(observe1),
    unobserve2 = backbutton.observe(observe2),
    timer = setTimeout(resolve, 500),
    visit1 = 0,
    visit2 = 0;

  function observe1(fragmentString) {
    if (fragmentString == fragmentTest) {
      visit1++;
      unobserve1();
    }
  }

  function observe2(fragmentString) {
    if (fragmentString == fragmentTest) {
      visit2++;
      if (visit2 < 3) {
        backbutton.refresh();
      } else {
        resolve(visit1 === 1);
      }
    }
  }

  function resolve(passed) {
    clearTimeout(timer);
    unobserve1();
    unobserve2();
    passed ? pass() : fail();
  }

  backbutton.navigate(fragmentTest);
});

test("backbutton.observe(), this keyword", function(pass, fail) {
  var unobserve = backbutton.observe(observe),
    timer = setTimeout(resolve, 500);

  function observe() {
    resolve(this === backbutton);
  }

  function resolve(passed) {
    clearTimeout(timer);
    unobserve();
    passed ? pass() : fail();
  }

  backbutton.navigate(randomString());
});

test("backbutton.refresh()", function(pass, fail) {
  var fragmentTest = randomString(),
    unobserve = backbutton.observe(observe),
    timer = setTimeout(resolve, 500),
    visits = 0;

  function observe(fragmentString) {
    if (fragmentString == fragmentTest) {
      visits++;
      if (visits === 1) {
        backbutton.refresh();
      } else if (visits === 2) {
        resolve(true);
      }
    }
  }

  function resolve(passed) {
    clearTimeout(timer);
    unobserve();
    passed ? pass() : fail();
  }

  backbutton.navigate(fragmentTest);
});

test("backbutton.routes(), auto start", function(pass, fail) {
  var timer = setTimeout(resolve, 500),
    current = backbutton.current(),
    routes = [
      /(.*)/,
      function(path) {
        resolve(path === current);
      }
    ];

  function resolve(passed) {
    clearTimeout(timer);
    routes.length = 0;
    passed ? pass() : fail();
  }

  backbutton.routes(routes);
});

test("backbutton.routes(), manual start", function(pass, fail) {
  var timer = setTimeout(resolve, 500),
    fragmentTest = randomString(),
    routes = [
      /(.*)/,
      function(path) {
        resolve(path === fragmentTest);
      }
    ];

  function resolve(passed) {
    clearTimeout(timer);
    routes.length = 0;
    passed ? pass() : fail();
  }

  backbutton.routes(routes, false);
  backbutton.navigate(fragmentTest);
});

test("backbutton.routes(), basic route", function(pass, fail) {
  var timer = setTimeout(resolve, 500),
    routes = [/^(navigate)$/, resolve];

  function resolve(passed) {
    clearTimeout(timer);
    routes.length = 0;
    passed === "navigate" ? pass() : fail();
  }

  backbutton.routes(routes, false);
  backbutton.navigate("navigate");
});

test("backbutton.routes(), parameters", function(pass, fail) {
  var timer = setTimeout(resolve, 500),
    randomData = randomString(),
    randomDigits = randomData.replace(/\D/g, "").slice(-4),
    routes = [/^(\w+):(\d)/, resolve];

  function resolve(arg1, arg2) {
    clearTimeout(timer);
    routes.length = 0;
    arg1 === randomData && arg2 === randomDigits.charAt(0) ? pass() : fail();
  }

  backbutton.routes(routes, false);
  backbutton.navigate(randomData + ":" + randomDigits);
});

test("backbutton.routes(), this keyword", function(pass, fail) {
  var timer = setTimeout(resolve, 500),
    routes = [
      /(.*)/,
      function() {
        resolve(this === backbutton);
      }
    ];

  function resolve(passed) {
    clearTimeout(timer);
    routes.length = 0;
    passed ? pass() : fail();
  }

  backbutton.routes(routes, false);
  backbutton.navigate(randomString());
});

test("backbutton.routes(), catch-all", function(pass, fail) {
  var timer = setTimeout(resolve, 500),
    fragmentTest,
    routes = [
      /^navigateToThisFirst$/,
      function() {
        backbutton.navigate((fragmentTest = randomString()));
      },
      /(.*)/,
      function(fragmentString) {
        resolve(fragmentString === fragmentTest);
      }
    ];

  function resolve(passed) {
    clearTimeout(timer);
    routes.length = 0;
    passed ? pass() : fail();
  }

  backbutton.routes(routes, false);
  backbutton.navigate("navigateToThisFirst");
});

test("backbutton.routes(), return true", function(pass, fail) {
  var timer = setTimeout(resolve, 500),
    fragmentTest = randomString(),
    visited = 0,
    routes = [
      /(.+)/,
      function(fragmentString) {
        if (fragmentString != fragmentTest) resolve();
        visited++;
        return true;
      },
      /(.+)/,
      function(fragmentString) {
        resolve(fragmentString == fragmentTest && visited === 1);
      }
    ];

  function resolve(passed) {
    clearTimeout(timer);
    routes.length = 0;
    passed ? pass() : fail();
  }

  backbutton.routes(routes, false);
  backbutton.navigate(fragmentTest);
});

test("backbutton.routes(), redirect", function(pass, fail) {
  var timer = setTimeout(resolve, 500),
    visited = 0,
    routes = [
      /^hitThisFirst$/,
      function() {
        visited++;
        if (visited === 1) {
          backbutton.refresh();
        } else {
          return "hitThisLast";
        }
      },
      /^hitThisLast$/,
      function() {
        resolve(visited === 2);
      }
    ];

  function resolve(passed) {
    clearTimeout(timer);
    routes.length = 0;
    passed ? pass() : fail();
  }

  backbutton.routes(routes, false);
  backbutton.navigate("hitThisFirst");
});

test("backbutton.routes(), remove route", function(pass, fail) {
  var timer = setTimeout(resolve, 5000),
    visited = [],
    routes = [
      /^firstRoute$/,
      function() {
        return visited.push(1);
      },
      /(.*)/,
      function() {
        return visited.push(2);
      },
      /(.*)/,
      function() {
        visited.push(3);
        if (visited.length === 3) {
          routes.splice(2, 2);
          backbutton.refresh();
        } else {
          resolve("" + visited === "" + [1, 2, 3, 1, 3]);
        }
      }
    ];

  function resolve(passed) {
    clearTimeout(timer);
    routes.length = 0;
    passed ? pass() : fail();
  }

  backbutton.routes(routes, false);
  backbutton.navigate("firstRoute");
});

test("backbutton.routes(), conditional routing", function(pass, fail) {
  var timer = setTimeout(resolve, 500),
    log = [],
    activated = false,
    routes = [
      /^activate:(0|1)$/,
      function(value) {
        activated = +value;
        log.push(activated ? "activated" : "deactivated");
        backbutton.navigate("conditionalRoute");
      },

      /(.*)/,
      function(path) {
        log.push("access " + (activated ? "granted" : "denied"));
        return activated ? true : "404:" + path;
      },

      /^conditionalRoute$/,
      function(path) {
        log.push("conditionalRoute accessed");
        backbutton.navigate("activate:0");
      },

      /^404:(.*)/,
      function(path) {
        log.push(path + " cannot be accessed");
        if (path === "conditionalRoute") {
          if (log.length === 2) {
            backbutton.navigate("activate:1");
          } else {
            resolve(
              "" + log ===
                "access denied," +
                  "conditionalRoute cannot be accessed," +
                  "activated," +
                  "access granted," +
                  "conditionalRoute accessed," +
                  "deactivated," +
                  "access denied," +
                  "conditionalRoute cannot be accessed" && activated === 0
            );
          }
        }
      }
    ];

  function resolve(passed) {
    clearTimeout(timer);
    routes.length = 0;
    passed ? pass() : fail();
  }

  backbutton.routes(routes, false);
  backbutton.navigate("conditionalRoute");
});

test("backbutton.routes(), router swap", function(pass, fail) {
  var timer = setTimeout(resolve, 500),
      log = [],
   routes1 = [
      /(.*)/, function() {
        log.push(1);
        if(log.length === 1){
          previousRouter = backbutton.routes(routes2)
        }else{
          previousRouter = backbutton.routes(previousRouter)
        }
      }
    ],
    routes2 = [
      /(.*)/, function() {
        log.push(2);
        if(log.length < 4){
          previousRouter = backbutton.routes(previousRouter)
        }else{
          resolve('' + log === '' + [1, 2, 1, 2]);
        }
      }
    ],
      previousRouter;

  function resolve(passed) {
    clearTimeout(timer);
    routes1.length = routes2.length = 0;
    passed ? pass() : fail();
  }

  backbutton.routes(routes1);
});

test("respond to browser back button", function(pass, fail) {
  var timer,
    visits = 0,
    routes = [
      /^goingBackAgain$/,
      function() {
        visits++;
        if (visits === 1) {
          backbutton.navigate("goingForward");
        } else {
          resolve(true);
        }
      },
      /^goingForward$/,
      function() {
        alert(
          "Close this alert and click browser back button to complete testing."
        );
        timer = setTimeout(resolve, 6000);
      }
    ];

  function resolve(passed) {
    clearTimeout(timer);
    routes.length = 0;
    backbutton.navigate('');
    passed ? pass() : fail();
  }

  backbutton.routes(routes, false);
  backbutton.navigate("goingBackAgain");
});

/* helper functions */

function randomString() {
  return +new Date() + ((Math.random() * 0x100000000) >>> 0).toString(36);
}

/* test runner functions */

function test(name, fun) {
  var tests = (window["tests"] = window["tests"] || []);
  tests.push(name, fun);
}

function run(report) {
  var tests = (window["tests"] = window["tests"] || []);
  var results = [];
  var index = -2;
  function next() {
    index += 2;
    if (tests[index]) {
      results[index] = tests[index];
      tests[index + 1](callback(index, "passed"), callback(index, "failed"));
    } else {
      report(results);
    }
  }
  function callback(index, result) {
    return function() {
      results[index + 1] = result;
      setTimeout(next);
    };
  }
  next();
}

/* test control */

(function runTests(){
    run(function(results){
        var i, unobserve;
        showResults(results);
        for(i = 1; i < results.length; i += 2){
            if(results[i] !== 'passed'){
                break;
            }
        }
        if(results.length + 1 === i){
            history.go(-20);
        }
    });
})();

function showResults(results) {
  var str =
    "<p><cite>backbutton.js</cite>, version " + backbutton.version + "</p>";
  str += "<p><small>Tested in " + navigator.userAgent + "</small></p>";
  str += "<table>";
  for (var i = 0, p = 0; i < results.length; i += 2) {
    if (results[i + 1] === "passed") p++;
    str +=
      "<tr><td>" +
      results[i] +
      '</td><td class="' +
      results[i + 1] +
      '">' +
      results[i + 1] +
      "</td></tr>";
  }
  str += "</table>";
  document.getElementById("results").innerHTML =
    "<h1>Test results (" + p + "/" + (i >> 1) + ")</h1>" + str;
}
