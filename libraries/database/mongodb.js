var mongoClient = require('mongodb').MongoClient;
var config  = require('../../config')();

exports.query = function(type, arg, callback) {

    if (!config.mongodb.url || !config.mongodb.collection) {
        callback('Unknow config data.');
        return;
    }
    if (!arg) {
        callback('Unknow input data.');
        return;
    }

    mongoClient.connect(config.mongodb.url, function(err, db) {

        if (err) {
            callback(err);
            return;
        }

        var collection = db.collection(config.mongodb.collection);

        switch(type) {
            case 'find':
                collection.find(arg).toArray(function (err, result) {
                    if (err) {
                        callback(err);
                        return;
                    } 
                    if (!result.length) {
                        callback(null);
                        return;
                    }
                    callback(null, result);
                    db.close();
                });
                break;
            case 'insert':
                collection.insert([arg], function (err, result) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(null, result);
                    db.close();
                });
                break;
            case 'remove':
                collection.remove(arg, function (err, result) {
                    if (err) {
                        callback(err);
                        return;
                    } 
                    callback(null, 'Removed all document');
                    db.close();
                });
                break;
            default:
                //default code block
                callback(null, 'default');
        }

    });
   
};


exports.update = function(find, arg, callback) {

    if (!config.mongodb.url || !config.mongodb.collection) {
        callback('Unknow config data.');
        return;
    }
    if (!find || !arg) {
        callback('Unknow input data.');
        return;
    }

    mongoClient.connect(config.mongodb.url, function(err, db) {

        if (err) {
            callback(err);
            return;
        }

        var collection = db.collection(config.mongodb.collection);

        collection.update(find, {$set: arg}, function (err, result) {
            if (err) {
                callback(err);
                return;
            } 
            if (!result) {
                callback('Update no document found');
                return;
            }
            callback(null, JSON.stringify(arg)+' updated Successfully');
            db.close();
        });

    });

};