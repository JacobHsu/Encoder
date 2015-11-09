var jobModel  = require('../models/job_model')();

process.on('message', function(job) {
    console.log('[consumer] job');
    console.log(job);

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
        require('../jobs/'+job.job)(req, function(err, result) {
            console.log('[consumer] require jobs');
        });

    });
}); 

process.on('SIGHUP', function() {
    process.exit();
});


