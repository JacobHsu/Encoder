var mongoClient = require('mongodb').MongoClient;

exports.query = function(type, url, table, arg, callback) {

    if (!url || !table || !arg) {
        callback(null, 'Unknow input data.');
        return;
    }

    mongoClient.connect(url, function(err, db) {

        if (err) {
            callback(err, 'Unable to connect to the mongoDB server. Error:'+ err);
            return;
        }

        var collection = db.collection(table);

        switch(type) {
            case 'find':
                collection.find(arg).toArray(function (err, result) {
                    if (err) {
                        callback(err, err);
                        return;
                    } 
                    if (!result.length) {
                        callback(null, result.length); //JSON.stringify(arg)+' no result.'
                        return;
                    }
                    console.log('Found:', result);
                    callback(null, result);
                    db.close();
                });
                break;
            case 'insert':
                collection.insert([arg], function (err, result) {
                    if (err) {
                        callback(err, err);
                        return;
                    } 
                    //console.log('The documents inserted with "_id" are:', result);

                    callback(null, result);
                    db.close();
                });
                break;
            case 'remove':
                collection.remove(arg, function (err, result) {
                    if (err) {
                        callback(err, err);
                        return;
                    } 
                    if (!result) {
                        callback(err, 'No document found');
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
