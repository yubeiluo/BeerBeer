/**
 * Created by davidyu on 8/25/14.
 * A sample file search console app based on http://code.tutsplus.com/tutorials/testing-in-nodejs--net-35018
 */


var tags = require('./lib/tags');
var search = require('./lib/search');

var defaults = {
    path: ".",
    query: "",
    depth: 2
};

var replacements = {
    p: "path",
    q: "query",
    d: "depth",
    h: "help"
};

tags = tags.parse(process.argv, defaults, replacements);

if (tags.help) {
    console.log("Usage: ./app_search.js -q=query [-d=depth] [-p=path]");
} else {
    search.scan(tags.path, tags.depth, function (err, files) {
        search.match(tags.query, files).forEach(function (file) {
            console.log(file);
        });
    });
}