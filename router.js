var bodyParser = require('body-parser');

module.exports = function(app) {

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    app.post('/', function (req, res) {
      res.send('POST request to homepage');
      console.log(req.body);
    });

    app.get('*', notFound);
};

function notFound(req, res) {
    res.status('404').send('Page Not Found');
}



