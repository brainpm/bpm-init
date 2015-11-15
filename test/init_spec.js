// jshint -W083

var fs = require('fs');
var test = require('tape');
var expect = require('stream-expect');
var tmp = require('temporary');
var pw = require('pathway');
require('events').EventEmitter.defaultMaxListeners = 40;

// keys: prompt
// values: tuple [pathway,] value
// if no pathway is given pathway equals prompt
var database = {
  "name": ["intro"],
  "version": ["1.1.3"],
  "description": ["An introduction to she.codes content"],
  "keywords": [['a', 'b', 'c']],
  "entry point": ["main", "index.js"],
  "requires knowledge": ['brain.requires', ['x','y']],
  "provides knowledge": ['brain.provides', ["z"]],
  "track.*?": ['brain.track', "blue"],
  'test command': ["scripts.test", "echo \"Error: no test specified\" && exit 1"],
  //"author": ["me"],
  "license": ["CCBY"],
  "git repository": ["repository.url", "soeme_url"]
};

test('creates new package.json without any .bpmrc  ', function(t) {
    var tmpDir = new tmp.Dir();
    //var exp = expect.spawn('node', ['./testcases.js', 'noBpmRc'], {cwd: tmpDir.path});
    var exp = expect.spawn(__dirname + '/testcases.js', ['noBpmRc'], {cwd: tmpDir.path});

    for (var prompt in database) {
        var value = database[prompt];
        var answer = JSON.parse(JSON.stringify(value)).pop();
        (function(prompt, value, answer) {
            exp.expect(new RegExp(prompt+':'), function(err, output, match) {
                if (err) throw err;
                if (Array.isArray(answer)) {
                    answer = answer.join(',');
                }
                exp.send(answer + '\n');
            });
        })(prompt, value, answer);
    }
    
    exp.expect(/Is this ok/, function(err, output) {
        exp.send('yes\n');
    });
    exp.child.on('error', function(error) {
        console.log("ERROR", error);
    });

    exp.expect(/written successfully/, function() {
        var packageJson = require(tmpDir.path+'/package.json');
        for (var prompt in database) {
            var pathwayAndValue = database[prompt];
            var expectedValue = pathwayAndValue.pop();
            var pathway = pathwayAndValue[0] || prompt;
            var actualValue = pw(packageJson, pathway.split('.'))[0];
            t.deepEqual(actualValue, expectedValue);
        }
        fs.unlinkSync(tmpDir.path+'/package.json');
        tmpDir.rmdir();
        t.end();
        exp.child.kill();
    });
    
});
