'use strict';

const http = require('http');
const util = require('util');
const neeoapi = require('neeo-sdk');
const settings = require('./settings')();
const controller = require('./controller');

const name = 'fibaro-scenes-adapter';
const brainIp = process.env.BRAINIP;

let _device = null;

function setAdapterDeviceId(adapterName) {
    console.log(`[BRAIN] Adapter name is ${adapterName}`);
  
    return new Promise((resolve, reject) => {
          http.get({
              host: settings.neeo.brainIp,
              port: 3000,
              path: '/v1/projects/home/devices',
              headers: {
                  'Content-Type': 'application/json'                
              }
          }, function(response) {
  
              const { statusCode } = response;
                
              var error;            
              if (statusCode !== 200) {
                  error = new Error('[HTTP REQUEST] Request Failed.\n' + `Status Code: ${statusCode}`);                    
              }
              if (error) {
                  console.log('[HTTP REQUEST] Problem with request: ' + error.message);
                  response.resume();
                  reject(error);
              } 
              var body = '';
              response.on('data', function(d) {
                  body += d;
              });
  
              response.on('end', function() {    
                  var parsed = JSON.parse(body);
                  var selected = parsed.find(x => x.details.adapterName === adapterName);
                  if (selected) {
                    var adapterDeviceId = selected.adapterDeviceId;
                    console.log(`[BRAIN] Adapter device id is ${adapterDeviceId}`);
                    controller.ready();
                    resolve(adapterDeviceId);
                  }
                  else{
                    console.log(`[BRAIN] Driver not installed yet, please use the NEEO app to search for "${_device.devicename}"`);
                  }
                  return;                
              });
          });               
      });
  }

const startServer = function(brain) {
    console.log('[ADAPTER] Start server');
    neeoapi.startServer({
      brain,
      port: settings.neeo.driverPort,
      name: name,
      devices: [_device]
    })
    .then(() => {
      setAdapterDeviceId(_device.deviceidentifier)
    })
    .catch((error) => {
      console.error('[ADAPTER] Error:', error.message);
      process.exit(1);
    });
};

const stopServer = function(brain) {
    neeoapi.stopServer({ brain: brain, name: name });
};

const dealWithBrainIp = function(callback) {
    if (!callback) {
        throw '[ADAPTER] Callback missing!';
    }
    if (brainIp) {
        console.log('[ADAPTER] use NEEO Brain IP from env variable', brainIp);
        callback(brainIp);
      } else {
        if (settings.neeo.brainIp) {
          console.log('[ADAPTER] use NEEO Brain IP from settings variable', settings.neeo.brainIp);
          callback(settings.neeo.brainIp);
          return;
        }
        console.log('[ADAPTER] discover one NEEO Brain...');
        neeoapi.discoverOneBrain()
          .then((brain) => {
            console.log('[ADAPTER] Brain discovered:', brain.name);
            callback(brain);
        });
    }
};

module.exports.addDevice = function(device) {
    _device = device;
};

module.exports.restart = function() {
    const delay = util.promisify(setTimeout);
    module.exports.stop();
    delay(2000).then(() => {
        console.log('[ADAPTER] Restarting...');
        module.exports.start();
    }).catch( console.error );
};

module.exports.start = function() {
    console.log('[ADAPTER] Start adapter');
    dealWithBrainIp(startServer);
 }

 module.exports.stop = function() {
    console.log('[ADAPTER] Stop adapter');
    dealWithBrainIp(stopServer);
 }