'use strict';

const FibaroApi = require('./fibaro/api');
const cache = require('./cache');
const utils = require('./utils');
const settings = require('./settings')();

let map = {};
let controllers = [];

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)){
            return false;
        }            
    }
    return JSON.stringify(obj) === JSON.stringify({});
}

module.exports.initialise = function() {
    return new Promise((resolve, reject) => {
        try {
            if (!settings.hasOwnProperty('controllers')) {
                reject('[SERVICE] Error', 'Missing controllers property in settings file');
            }
            settings.controllers.forEach((hc) => {
                var credentials = { username: hc.login , password: hc.password };
                controllers.push(new FibaroApi(hc.serial, hc.host, credentials));
                console.log(`[SERVICE] Adapter for ${hc.serial} successfully configured`);
            });
            resolve(controllers);
        }
        catch (err) {
            reject(err);
        }
    });
};

module.exports.hasMap = function(id) {
    return new Promise((resolve, reject) => {
        try {
            if (isEmpty(map)) {
                console.log(`[SERVICE] id ${id} not found in memory, trying to get from local cache`);
                cache.load().then((data) => { 
                    map = data;
                    resolve(map.hasOwnProperty(id));
                });
            } else {
                resolve(map.hasOwnProperty(id));
            } 
        }
        catch (err) {
            reject(err);
        }
    });   
};

module.exports.startScene = function(id) {
    var scene;
    if (map[id]) {
        scene = map[id];
        console.log(`[SERVICE] Start scene ${scene.name} with id ${scene.id} on ${scene.serial}`);
    
        var ctrl = controllers.find(c => c.serial === scene.serial);
        if (ctrl) {
            ctrl.startScene(scene.id);
        }
        return true;
    }
    console.log(`[SERVICE] Unable to start scene ${scene.name}, ${id} not found`);
};

module.exports.loadScenes = function () {

    console.log('[SERVICE] Try to retrieve scenes from gateway');

    if (controllers.length === 0) {
        console.error(`[SERVICE] Service controller not configured yet, please check configuration file`);
        process.exit(1);
    }

    var fn = function(hc) {
        var temp = [];
        return hc.getScenes().then((data) => {            
            var results = data;
            if (settings.loadHiddenScenes === null) {
                console.log(`[SERVICE] Missing parameter in settings file { settings.loadHiddenScenes }`);
            }
            else {
                if (!settings.loadHiddenScenes) {
                    results = data.filter(param => param.visible === true);
                    console.log('[SERVICE] Load only visible scenes');
                }
                results.forEach((item) => {
                    var _id = utils.getUniqueName(item.id, hc.host);
                    map[_id] = { serial: hc.serial, name: item.name, id: item.id };                    
                    temp.push({ id: _id, name: item.name });         
                });
                return Promise.resolve(temp);
            }
        }).then((data) => {
            console.log(`[SERVICE] Data successfully loaded from ${hc.host}`);
            return Promise.resolve(data);
        });
    };

    return Promise.all(controllers.map(fn)).then((data) => { 
        console.log(`[SERVICE] Finished`);
        cache.save(map);
        return Promise.resolve(data);
    });
    
};