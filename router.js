//Exporting an anonymous function
module.exports = function(app, io) {
    app.post('/', function (req, res) {
      res.send('POST request to homepage');
      console.log(req.body);
    });

    var job = require('./controllers/job');
    app.post('/job', job.create);

    app.get('/job/:uuid', job.query);
    app.get('/jobs', job.query);
    app.get('/jobs/clear', job.delete);

    app.post('/progress', job.progress);

    app.get('/result', function(req, res){
        res.sendFile(__dirname + '/result.html');
    });

    app.get('/socket', function(req, res){
        res.sendFile(__dirname + '/test_helloworld/socket.html');
    });

    io.on('connection', function(socket){
        console.log('[router] a user connected');
        //io.emit('chat message show', '[router] io connection...');

        var fs = require('fs');
        if (!fs.existsSync('./public')) {
            console.log('target dir public no exists');
            return;
        }

        fs.readdir('./public', function (err, oData) {
            if (err) throw err;

            oData.pop();
            console.log(oData);
            io.emit('chat message show', oData);

        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
        socket.on('chat message', function(msg){
            console.log('message: ' + msg);
            // send and receive any events you want
            io.emit('chat message show', msg);
        });
    });


    app.get('*', notFound);

    var cp = require('child_process');
    var child = cp.fork('./system/supervisor');
    child.send({});
};

function notFound(req, res) {
    res.status('404').send('Page Not Found');
}



