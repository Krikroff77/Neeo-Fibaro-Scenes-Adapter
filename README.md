# Fibaro HomeCenter Scenes driver for NEEO Remote

[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/krikroff77/Neeo-Fibaro-Scenes-Adapter/blob/master/LICENSE)

[![Build Status](https://travis-ci.org/Krikroff77/Neeo-Fibaro-Scenes-Adapter.svg?branch=master)](https://travis-ci.org/Krikroff77/Neeo-Fibaro-Scenes-Adapter)

To find out more about Fibaro controller checkout http://www.fibaro.com

To find out more about NEEO, the Brain and "The Thinking Remote" checkout https://neeo.com/.

## Prerequisite

* You must have [node.js](http://nodejs.org) v8 installed, see http://nodejs.org

## Getting started

* Install via [npm](https://www.npmjs.org)

```
$ npm install neeo-fibaro-scenes-adapter -g
```

Platform-specific install note available from [`INSTALL.md`](https://github.com/krikroff77/Neeo-Fibaro-Scenes-Adapter/blob/master/INSTALL.md)


Example usage
-------------

Edit settings.json and update neeo, settings and controllers sections

### NEEO:

-   brainIp: You can fix here the ip of brain
-   driverPort: This is port used to establish communication between sdk server and the brain.
                Warning: the port cannot be shared between multiple device.

### SETTINGS:

-   loadHiddenScenes option (true|false): if setted to true all scenes (visible or not) will be available in device.

### CONTROLLERS:

__You can add as many controller you want here.__

-   serial is the serial of the home center
-   host is the ip address of the home center
-   login is the login used to log in the home center
-   password is the password used to log in the home center

Example "settings.json"

```json
{
    "neeo": {
        "brainIp" : "192.168.1.50",
        "driverPort" : 6337
    },
    "settings": {
        "loadHiddenScenes": false
    },
    "controllers": [
        {
            "serial": "HC2-008080",
            "host": "192.168.1.220",
            "login": "login@fibaro.com",
            "password": "password"
        },
        {
            "serial": "HCL-032600",
            "host": "192.168.1.222",
            "login": "login@fibaro.com",
            "password": "password"
        }
      ]
}
```

2. Start up the device via `npm run server:fibaro-scenes`
3. Connect to your NEEO Brain in the NEEO app
4. Go to add device
5. You should be able to find the adapter by searching for "fibaro scenes"
6. All scenes are now available as shortcuts in the recipes


Changelog
---------

See [`CHANGELOG.md`](https://github.com/krikroff77/Neeo-Fibaro-Scenes-Adapter/blob/master/CHANGELOG.md)


## Known Issues
For a list of known issues, please see the [issues page](https://github.com/krikroff77/Neeo-Fibaro-Scenes-Adapter/issues "GitHub issues page")
