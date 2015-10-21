var config  = require('../config')();
var jobModel  = require('../models/job')();

process.on('message', loop);

function loop() {
    var sv = new Supervisor();
    sv.run();
}

function Supervisor () {
    this.pollingInterval = config.supervisor.milliseconds;
}

Supervisor.prototype.run = function () {
    var that = this;
    jobModel.pop(function(err, result){
        console.log('supervisor loop run pop');
        that.polling();
    });
};

Supervisor.prototype.polling = function () {
    var that = this;
    setTimeout(function(){
        that.run();
    }, that.pollingInterval);
};