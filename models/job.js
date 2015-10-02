var async = require('async');

//module.exports. As with any variable, if you assign a new value to it, it is no longer bound to the previous value.
module.exports = function() {
    return new Job();
};


var Job = function () {};
Job.prototype.push = function(task, myCallback) {
    console.log('push');
    if (!task.job) {
        callback('unknow task job');
        return;
    }

    if (!task.config) {
        callback('no task config');
        return;
    }

    async.waterfall([
        function(callback) {
            var fileId = 'newUUID';
            callback(null, fileId);
        },
        function(fileId, callback) {
            var insertId = 'result.insertId';
            callback(null, {id: insertId, uuid: fileId});
        }
    ], function (err, result) {
        if (err) {
            myCallback(err);
            return;
        }
        myCallback(null, result);
    });

};