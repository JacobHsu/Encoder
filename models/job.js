var async = require('async');
var uuid = require('node-uuid');
var mongoClient = require('mongodb').MongoClient;

var config  = require('../config')();
global.db = require('../libraries/database/mongodb');

//module.exports. As with any variable, if you assign a new value to it, it is no longer bound to the previous value.
module.exports = function() {
    return new Job();
};

var Job = function () {};
Job.prototype.push = function(task, myCallback) {

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
            var fileId = uuid.v4();
            db.query( config.database.mongodb, config.database.table, {uuid: fileId} , function(err, rows) {
                if (err) {
                    callback('err', 'db.query.fail!');
                    return;
                }
                console.log('rows:');
                console.log(rows);
                callback(null, fileId);
            });
           
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
