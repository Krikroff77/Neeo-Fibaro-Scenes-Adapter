'use strict';

const neeoapi = require('neeo-sdk');
const adapter = require('./adapter');
const service = require('./service');
const controller = require('./controller');
const utils = require('./utils');

console.log('Fibaro Home-Center scenes drivers');

utils.diagnostics.log();

// first we set the device info, used to identify it on the Brain
var device = neeoapi.buildDevice('Fibaro Home Center scenes adapter')
  .setManufacturer('Fibar Group S.A.')
  .addAdditionalSearchToken('Home Center')
  .addAdditionalSearchToken('Scenes')
  .setType('ACCESSOIRE')
  .addButton({ name: 'RESTART', label: 'Restart driver' })
  .addButtonHander(controller.onButtonPressed)
  .registerInitialiseFunction(controller.initialize)
  .registerSubscriptionFunction(controller.subscription);


service.initialise().then(() => {

  console.log("[SERVICE] Successfully intialised");
  service.loadScenes().then((hc) => {
    console.log(`[SERVICE] Data retrieved from ${hc.length} controller(s)`);
    hc.forEach(item => {
      item.forEach(scene => {  
        //console.log(scene);
        device.addButton({ name: scene.id, label: scene.name })
      });
    });

    adapter.addDevice(device);
    adapter.start();

  })
    .catch((error) => {
      console.error('[SERVICE] Error:', error.message);
    });

}).catch((error) => {
  console.error('[SERVICE] Error:', error.message);
  process.exit(1);
});
