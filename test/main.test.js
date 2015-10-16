const isThere = require("is-there"),
    assert = require("assert");

it("should show that secrets.js exists", function() {
    assert(isThere(__dirname + "/../secrets.js"));
});

it("should show that node_modules exists", function() {
    assert(isThere(__dirname + "/../node_modules"));
});

it("should show that public/bower_components exists", function() {
    assert(isThere(__dirname + "/../public/bower_components"));
});

it("should show that public/secrets.txt exists", function() {
    assert(isThere(__dirname + "/../public/secrets.txt"));
});
