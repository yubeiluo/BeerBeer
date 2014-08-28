/**
 * Created by davidyu on 8/26/14.
 */

exports = module.exports = {};

exports.type = function (obj) {
    if (obj instanceof Object) {
        return obj.constructor.name;
    }
    var str = Object.prototype.toString.call(obj);
    str = str.split(/\s+/);
    str = str.pop();
    str = str.substr(0, str.indexOf(']'));
    return str;
}

exports.random = function (minIncluded, maxExcluded) {
    if (typeof maxExcluded === 'undefined') {
        maxExcluded = minIncluded;
        minIncluded = 0;
    }
    return Math.floor(Math.random() * (maxExcluded - minIncluded) + minIncluded);
}

exports.range = function (start, end) {
    var step = 1;
    var integers = [];
    for (; start <= end; start += step) {
        integers.push(start);
    }
    return integers;
}

exports.flatten = function (a, b) {
    var newArr = [];
    a.forEach(function (v) {
        newArr.push(v);
    });
    b.forEach(function (v) {
        newArr.push(v);
    });
    return newArr;
}

var extend = require('util')._extend;

exports.clone = function (obj, shadow) {
    shadow = shadow || true;
    if (shadow === 'deep') {
        shadow = false;
    }
    if (shadow) {
        return extend({}, obj);
    }
    return JSON.parse(JSON.stringify(obj));
}
