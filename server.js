var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

//Exporting a named function
//The exports variable that is available within a module starts as a reference to
exports.start = function(config) {

    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    require('./router')(app, io);

    http.listen(config.port, function(){
        console.log('[server] listening on *:'+config.port);
    });

}
