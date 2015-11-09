var config  = require('../config')();
var jobModel  = require('../models/job_model')();

process.on('message', loop);

function loop() {
    var that = this;
    var sv = new Supervisor(that.pid);
    sv.run();
}

function Supervisor (pid) {
    this.pid = pid;
    this.pollingInterval = config.supervisor.milliseconds;
    this.forks = [];
    this.maxForkNumber = config.forks.max || 1;
}

Supervisor.prototype.run = function () {
    var that = this;
    jobModel.pop(function(err, result){
        if (err) {
            console.log('[Supervisor] get job error: ' + err);
            return;
        }
        if (!result) {
            //console.log('[Supervisor] job is empty');
            that.polling();
            return;
        }
        if (that.forks.length >= config.forks.max) {
            console.log('[Supervisor] that.forks.length >= config.forks.max');
            that.polling();
            return; 
        }

        var job = result[0];
        if (!job) {
            console.log('[Supervisor] no job');
            that.polling();
            return; 
        }
        that.consumer(job);

        //that.polling(); temp closed
    });
};

Supervisor.prototype.consumer = function (job) {
    var cp = require('child_process');
    var consumer = cp.fork('./system/consumer');
    consumer.send(job);
};

Supervisor.prototype.polling = function () {
    var that = this;
    setTimeout(function(){
        that.run();
    }, that.pollingInterval);
};