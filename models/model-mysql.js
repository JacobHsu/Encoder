var async = require('async');
var uuid = require('node-uuid');
global.config  = require('../config')();
global.db = require('../libraries/database/mysql');

module.exports = function() {
    return new Job();
};

function Job () {
    db.start(config.mysql);
};

Job.prototype.push = function(task, myCallback) {

    if (!task.job) {
        myCallback('unknow task job type');
        return;
    }

    if (!task.config) {
        myCallback('no task job config');
        return;
    }

    async.waterfall([
        function(callback) {
            var find = true;
            var newUUID;
            var count = 0;
            async.doWhilst(
                function (whileCallback) {
                    newUUID = uuid.v4();
                    db.query('SELECT uuid FROM ' + config.mysql.table + ' WHERE uuid=?', [newUUID], function(err, rows) {
                        if (err) {
                            whileCallback(err);
                            return;
                        }
                        if (!rows[0]) {
                            find = false;
                        }
                        whileCallback();
                    });
                },
                function () {
                    return find;
                },
                function (err) {
                    if (err) {
                        callback(err);
                    }
                    callback(null, newUUID);
                }
            );
        },
        function(newUUID, callback) {
            var values = {
                    uuid: newUUID,
                    job: task.job,
                    config: JSON.stringify(task.config),
                    from: task.from,
                    agent: task.agent,
                    log: '{create}'
                };   
            db.query('INSERT INTO ' + config.mysql.table + ' SET enterdate=NOW(), ? ', values, function (err, result) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, {id: result.insertId, uuid: newUUID});
            });
        }        
    ], function (err, result) {
        if (err) {
            myCallback(err);
            return;
        }
        myCallback(null, result);
    });

};


Job.prototype.pop = function(myCallback) {

    db.query('SELECT * FROM ' + config.mysql.table + ' where state="wait" ORDER BY id limit 1', [], function(err, rows) {
        if (err) {
            myCallback(err);
            return;
        }
        myCallback(null, rows[0]);
    });
};

Job.prototype.setState = function (data, myCallback) {

    var value = {};
    if (!data.uuid) {
        myCallback('setState no uuid');
        return;
    }

    if (!data.state) {
        myCallback('setState no state');
        return;
    }

    if (data.log) {
        value.log = JSON.stringify(data.log) || {};
    }

    value.state = data.state;

    db.query('UPDATE ' + config.mysql.table + ' SET ? WHERE uuid=?', [value, data.uuid], function(err, result) {
        if (err) {
            myCallback(err);
            return;
        }

        myCallback(null, result );
    });
};

Job.prototype.updateProgress = function (data, myCallback) {
    var value = {};
    if (!data.uuid) {
        myCallback('no uuid');
        return;
    }

    value.progress = data.progress;

    db.query('UPDATE ' + config.mysql.table + ' SET ? WHERE uuid=?', [value, data.uuid], function(err, result) {
        if (err) {
            myCallback(err);
            return;
        }
        myCallback(null, result);
    });
};

Job.prototype.updateLog = function(log, qid, myCallback) {

    db.query('SELECT log FROM ' + config.mysql.table + ' WHERE uuid=?', [qid.uuid], function(err, rows) {
        if (err) {
            myCallback(err);
            return;
        }

        db.query('UPDATE ' + config.mysql.table + ' SET log = ? WHERE uuid=?', [rows[0].log + log, qid.uuid], function(err, rows) {
            if (err) {
                myCallback(err);
                return;
            }
        });

        myCallback(null, rows[0]);
    });
};