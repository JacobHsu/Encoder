var jobModel  = require('../models/job_model')();
var ProgressBar = require('progress');
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

    if(req.params.uuid) {
        params = {"uuid":req.params.uuid};
    } else {
        params = {};
    }

    jobModel.find(params, function(err, result) {
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

exports.progress = function(req, res) {
    var params = {"uuid":req.body.videouuid};
    jobModel.find(params, function(err, result) {
        if (err) {
            res.status(404).json({status:404, msg:err});
            return;
        }
        var bar = new ProgressBar(':bar :percent', { total: 100 });
        bar.tick(result[0]["progress"]);
        res.json(result[0]);
    });
};
