var mongoClient = require('mongodb').MongoClient;

exports.query = function(url, table, arg, callback) {

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
        collection.find(arg).toArray(function (err, result) {
            if (err) {
                callback(err, err);
                return;
            } 
            if (!result.length) {
                callback(null, JSON.stringify(arg)+' no result.');
                return;
            }
            console.log('Found:', result);
            callback(null, result);
            db.close();
            
        });

    });
   
};
