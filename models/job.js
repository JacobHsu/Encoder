//module.exports. As with any variable, if you assign a new value to it, it is no longer bound to the previous value.
module.exports = function() {
    return new Job();
};

var Job = function () {};
Job.prototype.push = function(task, callback) {
    console.log('push');
    if (!task.job) {
        callback('unknow task job');
        return;
    }

    if (!task.config) {
        callback('no task config');
        return;
    }

    callback(null);
};