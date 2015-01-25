var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    projectData = require('./projects.json');

var Post = require('./app/models/post'),
    Room = require('./app/models/room'),
    Time = require('./app/models/time'),
    Building = require('./app/models/building');
mongoose.connect('mongodb://localhost/stdako');

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
// BLOG STUFF ==========================
// =====================================
var blogRouter = express.Router({mergeParams: true}),
    blogController = require('./controllers/blog');
// app.use('/blog', blogRouter);

blogRouter.route('/').get(blogController.home);
blogRouter.route('/api').get(blogController.api);
blogRouter.route('/api/posts/:range').get(blogController.range);
blogRouter.route('/api/topic/:tag').get(blogController.topic);
blogRouter.route('/api/archive/:year/:month?').get(blogController.archive);
blogRouter.route('/api/sidebar').get(blogController.sidebar);
blogRouter.route('/api/*').get(blogController.wildcardapi);
blogRouter.route('/*').get(blogController.wildcard);

// =====================================
// ROOMSURFER ==========================
// =====================================
var roomsurferRouter = express.Router({mergeParams: true}),
    roomsurferController = require('./controllers/roomsurfer');
app.use('/roomsurfer', roomsurferRouter);

roomsurferRouter.route('/').get(roomsurferController.home);
roomsurferRouter.route("/api/usedrooms").get(roomsurferController.usedrooms);
roomsurferRouter.route("/api/usedrooms/:building").get(roomsurferController.building);
roomsurferRouter.route('/api/room/:room').get(roomsurferController.room);
roomsurferRouter.route('/api/time/:time').get(roomsurferController.time);

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
