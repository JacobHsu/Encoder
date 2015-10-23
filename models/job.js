var async = require('async');
var uuid = require('node-uuid');
var mongoClient = require('mongodb').MongoClient;

//var config  = require('../config')();
global.db = require('../libraries/database/mongodb');

//module.exports. As with any variable, if you assign a new value to it, it is no longer bound to the previous value.
module.exports = function() {
    return new Job();
};

var Job = function () {};
Job.prototype.push = function(task, myCallback) {

    if (!task.job) {
        myCallback('[model] unknow task job');
        return;
    }

    if (!task.config) {
        myCallback('[model] no task config');
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

                    db.query( 'find', {uuid: fileId} , function(err, rows) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if(!rows) {
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

            var task_json = {
                uuid: fileId,
                job: task.job,
                config: task.config,
                from: task.from,
                state: 'wait',
                time: new Date()
            };

            db.query( 'insert', task_json , function(err, rows) {
                if (err) {
                    callback('[model] db.insert.fail!');
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

Job.prototype.pop = function(myCallback) {

    db.query( 'find', {state:"wait"} , function(err, rows) {
        if (err) {
            myCallback(err);
            return;
        }
        myCallback(null, rows);
    });
};


Job.prototype.find = function(task, myCallback) {

    db.query( 'find', {} , function(err, rows) {
        if (err) {
            myCallback(null, 'db.query.fail!');
            return;
        }
        myCallback(null, rows);

        // db.query( 'remove', {} , function(err, rows) {

        //     if (err) {
        //         myCallback(null, 'db.remove.fail!');
        //         return;
        //     }
        //     console.log('job.db.remove');
        //     myCallback(null, rows);
        // });

    });

};

/**
 * [consumer setState]
 * @param {[type]} data       [description]
 * @param {[type]} myCallback [description]
 */
Job.prototype.setState = function (data, myCallback) {

    if (!data.uuid) {
        myCallback('setState no uuid');
        return;
    }

    if (!data.state) {
        myCallback('setState no state');
        return;
    }

    var find = { uuid: data.uuid};
    var value = { state: data.state };

    db.update(find, value , function(err, rows) {

        if (err) {
            myCallback(null, '[model] db.update.fail!');
            return;
        }

        myCallback(null, rows);
    });

};