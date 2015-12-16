//Exporting an anonymous function
module.exports = function(app) {
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
        //res.sendFile(__dirname + '/public/third_party/videojs-resolution-selector/example.html');
    });

    app.get('*', notFound);

    var cp = require('child_process');
    var child = cp.fork('./system/supervisor');
    child.send({});
};

function notFound(req, res) {
    res.status('404').send('Page Not Found');
}



