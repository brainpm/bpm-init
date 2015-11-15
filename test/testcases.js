#!/usr/bin/env node
var init = require('../index');

var testCases = {
    noBpmRc: function () {
        init({});
    }/*,
    existingBpmRc: function() {
        var bpmrc = {};
        init(bpmrc);
    }*/
};
var testCase = process.argv[2];
testCases[testCase]();
