'use strict';

const ip = require('ip');

module.exports.log = function() {
    console.log('-----------------------------------------------------------');
    console.log('Diagnostics');
    console.log('-----------------------------------------------------------');
    console.log('Node version\t', process.version);
    console.log('Operating sys\t', process.platform, '(' + process.arch + ')');
    console.log('Ip address\t', ip.address());
    console.log('-----------------------------------------------------------');
};

module.exports.getNodeVersion = function() {
    return process.version;
};

module.exports.getOperatingSystem = function() {
    return process.platform, '(' + process.arch + ')';
};

module.exports.getPlatform = function() {
    return process.platform;
};

module.exports.getIpAddress = function() {
    return ip.address();
};