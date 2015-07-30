var path = require('path'),
    pg         = require('pg'),
    secrets    = require('./../secrets');

var conString = secrets.conString;
var client = new pg.Client(conString);
client.connect();

exports.home = function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'roomsurfer.html'));
};

exports.usedrooms = function(req, res) {
    client.query(
        "SELECT DISTINCT building, room FROM FreeRooms ORDER BY building, room",
        function(err, result) { 
            res.json(result.rows);
        }
    );
};

exports.usedroomsBuilding = function(req, res) {
    var building = req.params.building.toUpperCase();
    client.query(
        "SELECT DISTINCT room FROM FreeRooms WHERE building = ($1) ORDER BY room",
        [building], function(err, result) {
            res.json(result.rows);
        }
    );
};

exports.roomBuilding = function(req, res) {
    var building = req.params.building.toUpperCase();
    client.query(
        "SELECT room, day, starttime, endtime FROM FreeRooms WHERE building = ($1) ORDER BY room",
        [building], function(err, result) {
            res.json(result.rows);
        }
    );
};

exports.roomNumber = function(req, res) {
    var building = req.params.building.toUpperCase(),
        room     = req.params.room;
    client.query(
        "SELECT day, starttime, endtime FROM FreeRooms WHERE building = ($1) and room = ($2)",
        [building, room], function(err, result) {
            res.json(result.rows);
        }
    );
}

exports.time = function(req, res) {
    var day   = req.params.day.toUpperCase(),
    start = parseInt(req.params.start),
    end   = parseInt(req.params.end);

    if (!start)
        start = 0;
    if (!end)
        end = 1439;

    client.query(
        "SELECT building, room FROM FreeRooms WHERE day = ($1) and starttime <= ($2) and endtime <= ($3)",
        [day, start, end], function(err, result) {
            res.json(result.rows);
        }
    )
};