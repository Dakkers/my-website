var Room = require('./../app/models/room'),
    Time = require('./../app/models/time'),
    Building = require('./../app/models/building'),

    path = require('path');


exports.home = function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'roomsurfer.html'));
};

exports.usedrooms = function(req, res) {
    Building.find({})
    .select({_id: 0}).sort({building: 1}).lean()
    .exec(function(err, data) {
        res.json(data);
    });
};

exports.building = function(req, res) {
    Building.findOne({building: req.params.building.toUpperCase()})
    .select({_id: 0}).lean()
    .exec(function(err, data) {
        res.json(data);
    });
};

exports.room = function(req, res) {
    Room.findOne({room: req.params.room.replace("-"," ").toUpperCase()})
    .select({_id: 0}).lean()
    .exec(function(err, data) {
        res.json(data);
    });
};

exports.time = function(req, res) {
    Time.findOne({time: req.params.time.replace(/-/g,",")})
    .select({_id: 0}).lean()
    .exec(function(err, data) {
        res.json(data);
    });
};