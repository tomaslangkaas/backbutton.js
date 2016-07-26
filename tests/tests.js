// Test setup //
backbutton.navigate('');

var observedFrag = '';
backbutton.observe(function(frag) {
    observedFrag = frag;
});

var startFrag = backbutton.current() || '';
var routesCalled = [];

backbutton.routes([
    /^users\/(\w+)$/,
    function(section) {
        routesCalled.push('users/:' + section);
    },
    /^product\/(\d+)$/,
    function(productID) {
        routesCalled.push('product/:' + productID);
    }
]);

// Tests //

quicktest('backbutton.js tests', [
        'backbutton.navigate("users/home")',
        function(done) {
            backbutton.navigate("users/home");
            setTimeout(done, 100);
        },
        function() {
            return backbutton.current() == "users/home";
        },

        'backbutton.observe',
        '',
        function() {
            return observedFrag == "users/home";
        },

        'route :param',
        '',
        function() {
            return routesCalled.pop() == "users/:home";
        },

        'backbutton.navigate("product/1234")',
        function(done) {
            backbutton.navigate("product/1234");
            setTimeout(done, 100);
        },
        function() {
            return backbutton.current() == "product/1234";
        },

        'backbutton.observe',
        '',
        function() {
            return observedFrag == "product/1234";
        },

        'backbutton.back()',
        function(done) {
            backbutton.back();
            setTimeout(done, 100);
        },
        function() {
            return backbutton.current() == "users/home";
        },

        'backbutton.observe',
        function(done) {
            setTimeout(done, 100);
        },
        function() {
            return observedFrag == "users/home";
        },

        'window.history.forward()',
        function(done) {
            setTimeout(function() {
                window.history.forward();
                setTimeout(done, 100);
            }, 100);
        },
        function() {
            return backbutton.current() == "product/1234";
        },

        'observed frag',
        function(done) {
            setTimeout(done, 100);
        },
        function() {
            return observedFrag == "product/1234";
        },

        'backbutton.back()',
        function(done) {
            backbutton.back();
            setTimeout(done, 100);
        },
        function() {
            setTimeout(function() {
                backbutton.navigate('');
            }, 100);
            return backbutton.current() == "users/home";
        }
    ],
    testReporter('testlog')
);
