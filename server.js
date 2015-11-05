var express = require('express');
var bodyParser = require('body-parser');

//Exporting a named function
//The exports variable that is available within a module starts as a reference to
exports.start = function(config) {
    var app = express();
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    require('./router')(app);

    var server = app.listen(config.port, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log('[server] Listening at http://%s:%s', host, port); //http://localhost:8888
    });
}
