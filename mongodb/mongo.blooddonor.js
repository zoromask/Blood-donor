var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var bloddonor = "bloddonor";

module.exports = class MongoBlooddonor {
    constructor() {}

    // create Collection
    createCollection(collectionName, callback) {
        if (collectionName) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var database = db.db(bloddonor);

                database.createCollection(collectionName, function(err, res) {
                    if (err) throw err;
                    console.log("Collection created!");
                    db.close();
                    callback(res);
                });
            });
        }
    }

    // insert
    insert(collectionName, model = {}, callback) {
        if (!!collectionName && model != null) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var database = db.db(bloddonor);
                database.collection(collectionName).insertOne(model, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted!");
                    db.close();
                    callback(err, res);
                });
            });
        }
    }

    // update
    update(collectionName, newModel = {}, callback) {
        if (!!collectionName && newModel != null) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var userToUpdate = newModel._id;
                var database = db.db(bloddonor);
                database.collection(collectionName).update({ _id: userToUpdate }, newModel, function(err, res) {
                    if (err) throw err;
                    db.close();
                    callback(err, res);
                });
            });
        }
    }

    // delete
    delete(queryModel = {}, collectionName, callback) {
        if (queryModel != null && !!collectionName) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var database = db.db(bloddonor);
                var query = queryModel;
                database.collection(collectionName).deleteOne(query, function(err, res) {
                    if (err) throw err;
                    console.log("1 document deleted");
                    db.close();
                    callback(res);
                });
            });
        }
    }

    // find one
    getAllDocuments(collectionName, callback) {
        if (!!collectionName) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var database = db.db(bloddonor);
                database.collection(collectionName).find({}).toArray(function(err, res) {
                    if (err) throw err;
                    db.close();
                    callback(err, res);
                });
            });
        }
    }

    // find by name
    getByModel(collectionName, queryModel = {}, callback) {
        if (!!collectionName && queryModel != null) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var database = db.db(bloddonor);
                console.log(queryModel);
                database.collection(collectionName).find(queryModel).toArray(function(err, res) {
                    if (err) throw err;
                    db.close();
                    callback(err, res);
                });
            });
        }
    }

    // get by ID
    getByID(collectionName, objectID, callback) {
        if (!!collectionName && !!objectID) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var database = db.db(bloddonor);
                database.collection(collectionName).findOne({ _id: mongoose.Types.ObjectId(objectID) }, function(err, res) {
                    if (err) throw err;
                    db.close();
                    callback(err, res);
                });
            });
        }
    }
}