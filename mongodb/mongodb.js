var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var bloddonor = "bloddonor";

module.exports = class Mongo {

    constructor() {
    }
        // create Collection
    createCollection(collectionName) {
        if (collectionName) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var database = db.db(bloddonor);
                database.createCollection(collectionName, function(err, res) {
                    if (err) throw err;
                    console.log("Collection created!");
                    db.close();
                });
            });
        }
    }

    // insert
    insertOne(collectionName, model = { name: "Tai Nguyen", address: "Thai Nguyen" }) {
        if (collectionName && model != null) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var database = db.db(bloddonor);
                database.collection(collectionName).insertOne(model, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    db.close();
                });
            });
        }
    }

    // delete
    deleteByName(name, collectionName) {
        if (name && collectionName) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var database = db.db(bloddonor);
                var query = { name: name };
                database.collection(collectionName).deleteOne(query, function(err, obj) {
                    if (err) throw err;
                    console.log("1 document deleted");
                    db.close();
                });
            });
        }
    }

    // find one
    findOne(collectionName, callback) {
        var result;
        if (!!collectionName) {
            console.log(collectionName);
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var database = db.db(bloddonor);
                console.log()
                database.collection(collectionName).findOne({}, function(err, res) {
                    if (err) throw err;
                    db.close();
                    callback(result)
                });
            });
        }
        // return result;
    }

    // find by name
    findByName(name, collectionName) {
        if (name && collectionName) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var query = { name: name };
                var database = db.db(bloddonor);
                database.collection(collectionName).find(query).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    db.close();
                    return result;
                });
            });
        }
    }
}