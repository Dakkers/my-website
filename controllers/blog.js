var Post = require('./../app/models/post'),
    path = require('path');

exports.home = function(req,res) {
    res.sendFile(path.join(__dirname, '../public', 'blog.html'));
};

exports.api = function(req,res) {
    res.json(null);
};

exports.range = function(req,res) {
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
};

exports.topic = function(req,res) {
    Post.find()
        .elemMatch('topics', {tag: req.params.tag})
        .sort({number: -1}).select({_id: 0}).lean()
        .exec(function(err, data) {
            res.json(data);
        });
};

exports.archive = function(req,res) {
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
};

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

exports.sidebar = function(req, res) {
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
};

exports.wildcardapi = function(req,res) {
    res.json(null);
};

exports.wildcard = function(req,res) {
    res.sendFile('public/blog.html', {root: __dirname});
};