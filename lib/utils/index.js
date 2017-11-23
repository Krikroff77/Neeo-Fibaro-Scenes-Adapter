'use strict';

const uniqueName = require('./uniqueName');
const diagnostics = require('./diagnostics');

module.exports.getUniqueName = function(string, _uniqueString) {
    return uniqueName(string, _uniqueString);
};

module.exports.diagnostics = diagnostics;