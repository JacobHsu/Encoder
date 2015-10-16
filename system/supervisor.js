var config  = require('../config')();

process.on('message', loop);

function loop() {
    var sv = new Supervisor();
    sv.run();
}

function Supervisor () {
    this.pollingInterval = config.supervisor.milliseconds;
}

Supervisor.prototype.run = function () {
    console.log('supervisor loop run');

    var that = this;
    that.polling();
};

Supervisor.prototype.polling = function () {
    var that = this;
    setTimeout(function(){
        that.run();
    }, that.pollingInterval);
};