'use strict';

const dgram = require('dgram');

const DISCOVER_TIMEOUT = 3000;

module.exports = function(callback) {
    return new Promise((resolve, reject) => {

        var server = dgram.createSocket('udp4');
        var re = /^ACK (HC[2|L]-[0-9]+) ([0-9a-f:]+)$/;
        let items = [];

        server.on('message', function (packet, rinfo) {
            var matches = re.exec(packet.toString()); 
            if (matches) {
                var item = {
                    ip: rinfo.address,
                    serial: matches[1],
                    mac: matches[2]
                }
                if (callback) {
                    callback(item);
                }
                items.push(item);
            }
        });
    
        server.on('error', (err) => {
            var message = `server error:\n${err.stack}`;
            console.log(message);
            server.close();
            reject( new Error(message))
        });
    
        server.on('listening', () => {
            const address = server.address();
            console.log(`[SERVICE] Discovery server listening ${address.address}:${address.port}`);
        });
    
        server.bind(44444, function () {
            var message = new Buffer("FIBARO");
            server.setBroadcast(true);
            server.send(message, 0, message.length, 44444, "255.255.255.255");
        });
    
        setTimeout(function () {
            server.close();
            resolve(items);
        }, DISCOVER_TIMEOUT);
    });
};