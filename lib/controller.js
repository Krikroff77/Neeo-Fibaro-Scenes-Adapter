'use strict';

const adapter = require('./adapter');
const service = require('./service');

const onInitialised = function() { 
    console.log(`[CONTROLLER] Initalised`);
}

const onReady = function() {
    console.log(`[CONTROLLER] Ready`);
}

const onSubscribed = function() {
    console.log(`[CONTROLLER] Subscription registered`);
}

module.exports.initialize = function() {
    console.log('[CONTROLLER] Initialising device in progress...');
    onInitialised.apply(this);
}

module.exports.subscription = function (updateCallback, optionalCallbackFunctions) {
    console.log('[CONTROLLER] Register subscription');
    if (updateCallback) {

    }
    if (optionalCallbackFunctions) {
        
    }
    onSubscribed.apply(this);
}
  
module.exports.ready = function() {
    onReady.apply(this); 
}
  
module.exports.onButtonPressed = function (name, deviceId) {
    console.log(`[CONTROLLER] ${name} button pressed on device ${deviceId}`);

    service.hasMap(name).then((results) => {
        if (results === true) {
            service.startScene(name);
        } else {
            console.log(`[CONTROLLER] Unable to start scene ${name}`);
        }    
    });

    if (name === 'RESTART') {
        adapter.restart();
    }

};