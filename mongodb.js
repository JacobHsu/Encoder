var MongoClient = require('mongodb').MongoClient;

// Connection URL 
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {

    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        return;
    }
    console.log('Connection established to', url);

    db.close();
});