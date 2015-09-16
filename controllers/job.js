/**
    {
        "job": "video",
        "config": "{file:http://yourdomain.mp4, backend:http://yourdomain/backend_api/type/:id}"   
    }
 */
exports.create = function(req, res) {

    var data =  {
                    job: req.body.job,
                    config: req.body.config,
                    from: req.connection.remoteAddress,
                    agent: req.headers['user-agent']
                };

    res.json(data);
};

