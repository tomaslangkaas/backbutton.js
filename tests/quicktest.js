function quicktest(title, tests, onprogress) {
    var pending = tests.length / 3,
        obj = {
            'title': title,
            'tests': tests,
            'results': {},
            'last': -1,
            'passed': 0,
            'failed': 0,
            'completed': 0,
            'pending': pending,
            'total': pending,
            'failures': {}
        };

    function isFunc(f) {
        return typeof(f) == 'function';
    }

    function defer(fn) {
        setTimeout(fn, 0);
    }

    function run(index) {
        var actual = tests[index + 1];
        if (isFunc(actual)) {
            defer(function() {
                try {
                    actual(function(testoutput) {
                        //defer(function(){
                        report(testoutput, index);
                        //});
                    });
                } catch (err1) {
                    alert('err');
                    report(err1.message, index);
                }
            });
        } else {
            defer(function() {
                report(actual, index);
            });
        }
    }

    function report(output, index) {
        var expected = tests[index + 2],
            pass;
        pass = isFunc(expected) ? expected(output) : (output == expected);
        if (pass) {
            obj.passed++;
            obj.results[index] = 1;
        } else {
            obj.failed++;
            obj.failures[index] = output;
            obj.results[index] = -1;
        }
        obj.last = index;
        obj.pending--;
        obj.completed++;
        onprogress(obj);
        if (obj.pending) run(index + 3);
    }
    defer(function() { //run tests
        //for(i = 0; i < tests.length; i+=3){
        run(0);
        //}
    });
    onprogress(obj);
}

var testReporter = (function(prefix) {
    var instanceId = 0;
    return function(parentID) {
        var id = instanceId++,
            pre = prefix + id + '_';

        function elm(n, s) {
            (document.getElementById(n) || {}).innerHTML = s;
        }
        return function(obj) {
            if (obj.last < 0) { //init
                var s = '<h2>' + obj.title + '</h2><p><span id="' + pre + 'c">' + obj.completed + '</span>' +
                    ' of ' + obj.total + ' completed: ' +
                    '<span style="color:green" id="' + pre + 'p">' + obj.passed + '</span> passed, ' +
                    '<span style="color:red" id="' + pre + 'f">' + obj.failed + '</span> failed.</p><table>',
                    i, l, t = obj.tests;
                for (i = 0, l = t.length; i < l; i += 3) {
                    s += '<tr><td>' + (i / 3 + 1) + '.</td><td>' + t[i] + '</td><td id="' + pre + i + '"></td></tr>';
                }
                elm(parentID, s + '</table>');
            } else {
                var i = obj.last,
                    r = obj.results[i];
                r = r > 0 ? '<span style="color:green">Passed</span>' : '<span style="color:red">Failed:</span> ' + obj.failures[i];
                elm(pre + i, r);
                elm(pre + 'c', obj.completed);
                elm(pre + 'p', obj.passed);
                elm(pre + 'f', obj.failed);
            }
        }
    }
})('testReporter');
