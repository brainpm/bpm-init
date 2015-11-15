#!/usr/bin/env node

var initPkg = require('init-package-json');
var path = require('path');
var npm = require('npm');
var rc = require('rc');


module.exports = init = function(config) {
    config = config || rc('bpm');
    var dir = process.cwd();
    npm.load(config, function (err, npm) {
        if (err) throw err;
        var initModule = require.resolve('./default-input');
        //console.log(init_module);

        initPkg(dir, initModule, npm.config, function (err, data) {
            if (err) throw err;
            console.log('written successfully');
        });
    });
};

// call init if run stand-alone rather than being required.
if (require.main === module) {
    init();
}
