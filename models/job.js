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

            var fileId;
            var find = true;
            async.doWhilst(
                function (whileCallback) {
                    //fn(whileCallback)
                    fileId = uuid.v4();
                    db.query( 'find', config.database.mongodb, config.database.table, {uuid: fileId} , function(err, rows) {
                        if (err) {
                            callback('err', 'db.query.fail!');
                            return;
                        }
                        if(rows == 0) {
                            //console.log('not found.');
                            find = false; //test fails
                        }
                        whileCallback();
                    });
                },
                function () { 
                    //test 
                    return find;
                },
                function (err) {
                    //called after the test fails
                    //console.log("not found mean there's no need to rebuild uuid.");
                    callback(null, fileId);
                }
            );
        },
        function(fileId, callback) {

            db.query( 'insert', config.database.mongodb, config.database.table, {uuid: fileId} , function(err, rows) {
                if (err) {
                    callback('err', 'db.insert.fail!');
                    return;
                }
                //console.log('ops Contains the documents inserted with added _id fields');
                //console.log(rows.ops.length);
                callback(null, {id: rows.ops[0]._id, uuid: fileId});
            });
        }
    ], function (err, result) {
        if (err) {
            myCallback('waterfall mongodb err');
            return;
        }
        myCallback(null, result);
    });

};
