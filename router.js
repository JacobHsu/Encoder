var bodyParser = require('body-parser');

//Exporting an anonymous function
module.exports = function(app) {

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    app.post('/', function (req, res) {
      res.send('POST request to homepage');
      console.log(req.body);
    });

    var job = require('./controllers/job');
    app.post('/job', job.create);

    app.get('/jobs', job.query);
    app.get('*', notFound);

    var cp = require('child_process');
    var child = cp.fork('./system/supervisor');
    child.send({});
};

function notFound(req, res) {
    res.status('404').send('Page Not Found');
}



