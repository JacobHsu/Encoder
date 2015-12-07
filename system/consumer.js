var jobModel  = require('../models/job_model')();

process.on('message', function(job) {
    console.log('[consumer] job');
    console.log(job);

    var log_consumer = new log(job);
    var progress_consumer = new progress(job);

    jobModel.setState({uuid: job.uuid, state: 'start'}, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('[consumer] setState'+result);

        var req = {
            config: job.config,
            uuid:job.uuid
        };
        require('../jobs/'+job.job)(req, log_consumer, progress_consumer, function(err, ret) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('[consumer] require jobs');
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




