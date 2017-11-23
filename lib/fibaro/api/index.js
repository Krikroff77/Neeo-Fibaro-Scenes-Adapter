'use strict';

const http = require('http');

class FibaroApi {
    constructor(serial, host, credentials) {
        this.serial = serial;
        this.host = host;
        this.port = 80;
        this.username = '';
        this.password = '';
        this.auth = '';
        if (credentials) {
            this.setCredentials(credentials);
        }
    }

    setPort(port) {
        if (typeof port !== 'undefined') {
            if (typeof port !== 'number' && typeof port !== 'string') {
                throw new TypeError('"port" option should be a number or string: ' + port);
            }
            if (!(port >= 0 && port < 65536)) {
                throw new RangeError('"port" option should be >= 0 and < 65536: ' + port);
            }
            this.port = port;
        }
    }

    setCredentials(credentials){
        if (credentials.hasOwnProperty('username')) {
            this.username = credentials.username;
        }
        if (credentials.hasOwnProperty('password')) {
            this.password = credentials.password;
        }
        this.auth = 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64');
    }

    startScene(id) {
        return new Promise( (resolve, reject) => {
            
            const postData = JSON.stringify({'args':[]});

            const options = {
                hostname: this.host,
                port: this.port,
                path: `/api/scenes/${id}/action/start`,
                method: 'POST',
                headers: {
                    'Authorization' : this.auth,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Content-Length': Buffer.byteLength(postData),
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Fibaro-Version': 2
                }
            };

            const req = http.request(options, (response) => {
                const { statusCode } = response;                
                //console.log(`STATUS: ${statusCode}`);
                //console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
                var error;
                if (statusCode !== 200 && statusCode !== 202) {
                    if (statusCode === 401) {
                        error = new Error('Bad credentials (username or password)');
                    } else {
                        error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
                    }                                    
                }
                if (error) {
                    console.log('[MIDDLEWARE]\tProblem with request: ' + error.message);
                    reject(error);
                } 

                var body = '';
                response.on('data', (chunk) => {
                  //console.log(`BODY: ${chunk}`);
                  body += chunk;
                });

                response.on('end', () => {
                    try {
                        if (body) {
                            resolve(JSON.parse(body));
                        }                        
                    } catch (error) {
                        resolve({});
                    }
                });
            });

            req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
            });

            req.write(postData);
            req.end();            
        });
    }

    getScenes() {
        return new Promise((resolve, reject) => {
            http.get({
                host: this.host,
                port: this.port,
                path: '/api/scenes',
                headers: { 
                    'Authorization' : this.auth,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Fibaro-Version': 2
                }
            }, function(response) {
    
                const { statusCode } = response;
                var error;

                if (statusCode !== 200 && statusCode !== 202) {
                    if (statusCode === 401) {
                        error = new Error('Bad credentials (username or password)');
                    } else {
                        error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
                    }                                    
                }
                if (error) {
                    console.log('[MIDDLEWARE]\tProblem with request: ' + error.message);
                    reject(error);
                } 
    
                var body = '';
                response.on('data', function(d) {
                    body += d;
                });
    
                response.on('end', function() {    
                    resolve(JSON.parse(body));
                });

            });               
        });
    }
}

module.exports = FibaroApi;