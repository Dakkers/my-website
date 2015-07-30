var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    projectData = require('./projects.json');

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');

// =====================================
// RENDERABLE ==========================
// =====================================
app.get('/', function(req,res) {
    res.render('home');
});

app.get('/projects', function(req, res) {
    res.render('projects', {'projects': projectData});
});

// =====================================
// ROOMSURFER ==========================
// =====================================
var roomsurferRouter = express.Router({mergeParams: true}),
    roomsurferController = require('./controllers/roomsurfer');
app.use('/roomsurfer', roomsurferRouter);

roomsurferRouter.route('/').get(roomsurferController.home);
roomsurferRouter.route("/api/usedrooms").get(roomsurferController.usedrooms);
roomsurferRouter.route("/api/usedrooms/:building").get(roomsurferController.usedroomsBuilding);
roomsurferRouter.route('/api/room/:building').get(roomsurferController.roomBuilding);
roomsurferRouter.route('/api/room/:building/:room').get(roomsurferController.roomNumber);
roomsurferRouter.route('/api/time/:day/:start?/:end?').get(roomsurferController.time);

// =====================================
// STATIC SHIT =========================
// =====================================
app.get('/collatz', function(req, res) {
    res.sendFile('public/collatz.html', {root: __dirname});
});

app.get('/lorenz', function(req, res) {
    res.sendFile('public/lorenz.html', {root: __dirname});
});

app.get('/AMATH231CourseNotes', function(req, res) {
    res.sendFile('public/AMATH231CourseNotes.pdf', {root: __dirname});
});

app.listen(4000);
console.log('started on 4000...');
