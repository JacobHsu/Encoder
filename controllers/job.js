var jobModel  = require('../models/job_model')();
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

    jobModel.push(data, function(err, result) {
        if (err) {
            res.status(404).json({status:404, msg:err});
            return;
        }
        res.json(result);
    });

};

exports.query = function(req, res) {
    jobModel.find({}, function(err, result) {
        if (err) {
            res.status(404).json({status:404, msg:err});
            return;
        }
        res.json(result);
    });
};

exports.delete = function(req, res) {
    jobModel.delete({}, function(err, result) {
        if (err) {
            res.status(404).json({status:404, msg:err});
            return;
        }
        res.json(result);
    });
};
