var config  = require('../config')();
var jobModel  = require('../models/model-'+ config.dataBackend)();

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
    jobModel.pop(function(err, job){
        if (err) {
            console.log('[Supervisor] get job error: ' + err);
            return;
        }
        if (!job) {
            //console.log('[Supervisor] no job');
            that.polling();
            return;
        }
        if (that.forks.length >= config.forks.max) {
            console.log('[Supervisor] that.forks.length >= config.forks.max');
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

    consumer.on('message', function(m) {
        console.log('[Supervisor]',m);
    });

    consumer.on('error', function(err) {
        console.log('consumer error: ' + err);
    });

    consumer.on('exit', function (code, signal) {
        console.log('[Supervisor] consumer exit. pid: ' + this.pid + ' code: ' + code + ' signal: ' + signal);
    });
};

Supervisor.prototype.polling = function () {
    var that = this;
    setTimeout(function(){
        that.run();
    }, that.pollingInterval);
};