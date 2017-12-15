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
        }else{
            throw "Input data is Invalid!!!";
        }
    })
    .put(function(req, res) {
        var blooddonorNewModel = parseBlooddonorModel(req);
        mongoBlooddonor.update(_blooddonorCollection, blooddonorNewModel, function(err, result) {
            if (err) {
                res.send("Error", err);
                return;
            }
            res.send("1 document updated successfully!!");
        })
    });

app.route("/findBlooddonor/").get(function(req, res) {
    var fullName = req.query.fullname;
    var queryModel = {
        fullname: fullName
    };

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
        ID: req.body.id,
        FullName: req.body.fullName,
        Address: req.body.address,
        Phone: req.body.phone,
        Age: req.body.age,
        BloodType: req.body.bloodType,
        Height: !!req.body.height ? +req.body.height : 0,
        Weight: !!req.body.weight ? +req.body.weight : 0
    }
}


var server = app.listen(3000, function() {});