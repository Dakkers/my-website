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
var blogRouter = express.Router({mergeParams: true});
app.use('/blog', blogRouter);

blogRouter.route('/')
    .get(function(req,res) {
        res.sendFile('public/blog.html', {root: __dirname});
    });

blogRouter.route('/api')
    .get(function(req,res) {
        res.json(null);
    });

blogRouter.route('/api/posts/:range')
    .get(function(req,res) {
        var range = req.params.range.split('-'),
            start = parseInt(range[0]),
            end = (range[1]) ? range[1] : null;

        if (end) {
            Post.find()
                .where('number').gte(start).lte(end)
                .sort({number: -1}).select({_id: 0}).lean()
                .exec(function(err, data) {
                    res.json(data);
                });
        } else {
            Post.find({number: start})
                .select({_id: 0}).lean()
                .exec(function(err, data) {
                    res.json(data);
                });
        }
    });

blogRouter.route('/api/topic/:tag')
    .get(function(req,res) {
        Post.find()
            .elemMatch('topics', {tag: req.params.tag})
            .sort({number: -1}).select({_id: 0}).lean()
            .exec(function(err, data) {
                res.json(data);
            });
    });

blogRouter.route('/api/archive/:year/:month?')
    .get(function(req,res) {
        var year = req.params.year,
            month = req.params.month || '01',
            startDate = [year,month,'01'].join('-'),
            endDate = (req.params.month) ? [year,month,'31'].join('-') : 
                        [year,'12','31'].join('-');

        Post.find()
            .where('date').gte(startDate).lte(endDate)
            .sort({number: -1}).select({_id: 0}).lean()
            .exec(function(err, data) {
                res.json(data);
            });
    });

function Counter() {
    // like a python counter
    this.data = {};
}
Counter.prototype.increment = function(key) {
    if (this.data[key])
        this.data[key]++;
    else
        this.data[key] = 1;
};

blogRouter.route('/api/sidebar')
    .get(function(req, res) {
        var sendData = {dates: new Counter(), topics: new Counter()};

        Post.find({}, 'date topics')
            .select({_id: 0}).lean()
            .exec(function(err, data) {
                data.forEach(function(post) {
                    var date = post.date.slice(0,7),
                        tags = post.topics.map(function(o) {
                            return o.tag;
                        });
                    sendData.dates.increment(date);
                    tags.forEach(function(tag) {
                        sendData.topics.increment(tag);
                    });
                });
                res.json(sendData);
            });
    });

blogRouter.route('/api/*')
    .get(function(req,res) {
        res.json(null);
    });

// =====================================
// ROOMSURFER ==========================
// =====================================
var roomsurferRouter = express.Router({mergeParams: true});
app.use('/roomsurfer', roomsurferRouter);

roomsurferRouter.route('/')
    .get(function(req, res) {
        res.sendFile('public/roomsurfer.html', {root: __dirname});
    });

roomsurferRouter.route("/api/usedrooms")
    .get(function(req, res) {
        Building.find({})
        .select({_id: 0}).sort({building: 1}).lean()
        .exec(function(err, data) {
            res.json(data);
        });
    });

roomsurferRouter.route("/api/usedrooms/:building")
    .get(function(req, res) {
        Building.findOne({building: req.params.building.toUpperCase()})
        .select({_id: 0}).lean()
        .exec(function(err, data) {
            res.json(data);
        });
    });

roomsurferRouter.route('/api/room/:room')
    .get(function(req, res) {
        Room.findOne({room: req.params.room.replace("-"," ").toUpperCase()})
        .select({_id: 0}).lean()
        .exec(function(err, data) {
            res.json(data);
        });
    });

roomsurferRouter.route('/api/time/:time')
    .get(function(req, res) {
        Time.findOne({time: req.params.time.replace(/-/g,",")})
        .select({_id: 0}).lean()
        .exec(function(err, data) {
            res.json(data);
        });
    });

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
