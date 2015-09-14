module.exports = function(app) {

    app.post('/', function (req, res) {
      res.send('POST request to homepage');
      console.log(req.body);
    });

    app.get('*', notFound);
};

function notFound(req, res) {
    res.status('404').send('Page Not Found');
}



