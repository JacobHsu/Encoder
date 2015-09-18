var express = require('express');

//Exporting a named function
//The exports variable that is available within a module starts as a reference to
exports.start = function(config) {
    var app = express();

    app.use(express.static(__dirname + '/public'));

    require('./router')(app);

    var server = app.listen(config.port, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log('[server] Listening at http://%s:%s', host, port); //http://localhost:8888
    });
}
