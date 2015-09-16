var server  = require('./server');
var config  = require('./config')();

server.start(config.server);



