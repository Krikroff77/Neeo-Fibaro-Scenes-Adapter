'use strict';

const path = require('path');
const fs = require('fs');
const dirname = __dirname;
const baseDir = path.join(dirname, '../cache');


module.exports.save = function(config, callback) {
    if (!fs.existsSync(baseDir)){
        fs.mkdirSync(baseDir);
    }
    var content = JSON.stringify(config, null, 2);    
    fs.writeFile(path.join(baseDir, 'data.json'), content, 'utf8', function (err) {
        if (err) {
            throw err;
        }
        if (callback) {
            callback();
        }    
    }); 
}

module.exports.load = function() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(baseDir, 'data.json'), (err, data) => {  
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error('Error: Cache file not found');
                }
                return reject(err);
            }
            return resolve(JSON.parse(data));
        });
    });
};

module.exports.clean = function() {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(baseDir, 'data.json'), (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
          });
    });
};
/*
module.exports.get = function(key) {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
};

module.exports.set = function(key, value) {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
};
*/