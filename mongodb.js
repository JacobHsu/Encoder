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

    var collection = db.collection('users');
    var user1 = {name: 'modulus admin', age: 32, roles: ['admin', 'moderator', 'user']};
    var user2 = {name: 'modulus user', age: 22, roles: ['user']};

    collection.insert([user1, user2], function (err, result) {
        if (err) {
            console.log(err);
            return;
        } 
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        db.close();
    });

});