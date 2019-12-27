var Service = require('node-mac').Service;

// Create a new service object
var svc = new Service({
  name:'VoteBot',
  description: 'Vote bot for samyukta.ca (wedding photo booth)',
  script: './index.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();