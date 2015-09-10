var server  = require('./server');
var config  = require('./config')();
console.log(config.server);

server.start(config.server);



