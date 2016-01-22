var config  = require('../config')();
var jobModel  = require('../models/model-'+ config.dataBackend)();

process.on('message', function(job) {
    //console.log('[consumer] job:',config.dataBackend,typeof job,job,job.uuid);

    var log_consumer = new log(job);
    var progress_consumer = new progress(job);

    jobModel.setState({uuid: job.uuid, state: 'start'}, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        var req = {
            config: JSON.parse(job.config),
            uuid:job.uuid
        };
        require('../jobs/'+job.job)(req, log_consumer, progress_consumer, function(err, ret) {
            if (err) {
                console.log(err);
                return;
            }
            jobModel.setState({uuid: job.uuid, state: 'complete'}, function(err, result) {
                if (err) {
                    console.log('setState complete fail');
                    return;
                }
                process.send(ret);
                process.exit();
            });

        });

    });
}); 


function progress(job) {
    function set(percent, callback) {
        jobModel.updateProgress({"uuid":job.uuid,"progress":percent}, function(err, result) {
            if (err) {
                callback('db updateProgress fail');
                return;
            }
            callback(null);
        });
    }
    return {set: set}
}



function log(job) {
    function set(log, callback) {
        jobModel.updateLog(log, {"uuid":job.uuid}, function(err, result) {
            if (err) {
                callback('db updateLog fail');
                return;
            }
            callback(null);
        });
    }
    return {set: set}
}


process.on('SIGHUP', function() {
    process.exit();
});




