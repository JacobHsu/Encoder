var express = require('express');

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
