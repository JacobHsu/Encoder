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

    app.get('*', notFound);
};

function notFound(req, res) {
    res.status('404').send('Page Not Found');
}



