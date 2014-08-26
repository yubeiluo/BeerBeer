/**
 * Created by davidyu on 8/26/14.
 */

var url = require('url');

var urlStr = "http://user:pass@host.com:8080/p/a/t/h?query=string#hash";

var urlObj = url.parse(urlStr, true);

console.log(urlObj);

console.log(url.format(urlObj));

console.log(url.resolve('http://example.com/', '/one'));
