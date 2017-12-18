var mongoose = require('mongoose');
var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded());

var _blooddonorRoute = "/blooddonor/";
var MongoBlooddonor = require("../mongodb/mongo.blooddonor.js");
var mongoBlooddonor = new MongoBlooddonor();
var _blooddonorCollection = "blooddonor";

app.route("/bloods/")
    .get(function(req, res) {
        mongoBlooddonor.getAllDocuments(_blooddonorCollection, function(err, result) {
            if (err) {
                res.send("Error", err);
                return;
            }
            res.send(result);
        })
    })
    .post(function(req, res) {
        if (!req.body) return res.sendStatus(400);
        var blooddonorModel = parseBlooddonorModel(req);
        if (blooddonorModel != null && !!blooddonorModel.FullName) {
            mongoBlooddonor.insert(_blooddonorCollection, blooddonorModel, function(err, result) {
                if (err) {
                    res.send("Error", err);
                    return;
                }
                res.send("1 document inserted successfully!!");
            })
        } else {
            throw "Input data is Invalid!!!";
        }
    })
    .put(function(req, res) {
        if (!req.body) return res.sendStatus(400);
        var blooddonorNewModel = parseBlooddonorModel(req);
        mongoBlooddonor.update(_blooddonorCollection, blooddonorNewModel, function(err, result) {
            if (err) {
                res.send("Error", err);
                return;
            }
            res.send("1 document updated successfully!!");
        })
    });

app.route("/bloods/getbyid/").get(function(req, res) {
    if (!req.query.id) return res.sendStatus(400);
    var objectID = mongoose.Types.ObjectId(req.query.id);
    mongoBlooddonor.getByID(_blooddonorCollection, objectID, function(err, result) {
        if (err) {
            res.send("Error", err);
            return;
        }
        res.send(result);
    })
});

app.route("/bloods/filter/").get(function(req, res) {
    var queryModel = parseBloodQueryModel(req);
    mongoBlooddonor.getByModel(_blooddonorCollection, queryModel, function(err, result) {
        if (err) {
            res.send("Error", err);
            return;
        }
        res.send(result);
    })
});

parseBlooddonorModel = function(req) {
    return {
        _id: mongoose.Types.ObjectId(req.body.id),
        FullName: req.body.fullName,
        Address: req.body.address,
        Longitude: !!req.body.longitude ? +req.body.longitude : 0,
        Latitude: !!req.body.latitude ? +req.body.latitude : 0,
        Phone: req.body.phone,
        Age: !!req.body.age ? +req.body.age : 0,
        BloodType: req.body.bloodType,
        Height: !!req.body.height ? +req.body.height : 0,
        Weight: !!req.body.weight ? +req.body.weight : 0
    }
}

parseBloodQueryModel = function(req) {
    return {
        BloodType: req.query.bloodType,
        Address: req.query.address,
        Longitude: { $gte: +req.query.minLongitude, $lte: +req.query.maxLongitude },
        Latitude: { $gte: +req.query.minLatitude, $lte: +req.query.maxLatitude },
        Age: { $gte: +req.query.ageFrom, $lte: +req.query.ageTo },
    }
}

var server = app.listen(3030, function() {});