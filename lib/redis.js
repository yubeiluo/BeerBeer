/**
 * Created by davidyu on 8/26/14.
 */

var redis = require('redis');
var util = require('./util');
var format = require('util').format;
var inspect = require('util').inspect;
var config = require('config').get('redis');

exports = module.exports = {};

var debug = require("debug")("redis");

exports.createClient = function () {
    if (!Client.instance) {
        Client.instance = new Client();
    }
    return Client.instance;
}

function Client() {
    var server = config.server;
    var redisClient = redis.createClient(server.port, server.host, server.options);
    Object.defineProperty(this, 'redis', {
        value: redisClient,
        enumerable: true,
        writable: false
    });
    this.closed = false;
}

Client.prototype.set = function (spec, callback) {
    var key = (typeof spec.key === 'undefined' ? null : spec.key);
    debug("spec:%s", inspect(spec));
    var handle = this.constructor.KEY_TYPES[spec.type].set_handle;
    var value = spec.value;
    return handle.call(this, key, value, callback);
}

Client.prototype.setObject = function (key, obj, callback) {
    var redisKey = (key === null ? format("%s:%s", util.type(obj), obj.id) : key);
    debug("redis key:%s", redisKey);
    var _arguments = [redisKey];
    Object.keys(obj).forEach(function (key) {
        _arguments.push(key, obj[key]);
    });

    _arguments.push(function (err, reply) {
        if (err) {
            callback(err);
        } else {
            callback(null, redisKey);
        }
    });

    debug("arguments:%s", _arguments);

    this.redis.hmset.apply(this.redis, _arguments);
}

Client.prototype.getObject = function (key, callback) {
    var self = this;
    this.redis.hkeys(key, function (err, replies) {
        if (err) {
            return callback(err);
        }
        if (replies.length === 0) {
            return callback(null, null);
        }
        var fields = replies.slice();
        var _arguments = [key];
        fields.forEach(function (key) {
            _arguments.push(key);
        });
        debug("fields:%s", fields);
        var obj = {};
        _arguments.push(function (err, replies) {
            if (err) {
                callback(err);
            } else {
                for (var i = 0, len = replies.length; i < len; i++) {
                    obj[fields[i]] = replies[i];
                }
                callback(null, obj);
            }
        });
        debug("arguments:%s", _arguments);
        self.redis.hmget.apply(self.redis, _arguments);
    });
}

Client.prototype.setString = function (key, value, callback) {
    this.redis.set(key, value, function (err, reply) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

Client.prototype.getString = function (key, callback) {
    this.redis.get(key, function (err, reply) {
        if (err) {
            callback(err);
        } else {
            callback(null, reply);
        }
    });
}


Client.prototype.setList = function (key, value, callback) {
    var self = this;
    var _arguments = util.flatten([key], value);
    _arguments.push(function (err, replies) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
    this.redis.exists(key, function (err, reply) {
        if (err) {
            callback(err);
        } else {
            if (reply) {
                self.redis.del(key, function (err, reply) {
                    if (err) {
                        callback(err);
                    } else {
                        rpush.apply(self, _arguments);
                    }
                });
            } else {
                rpush.apply(self, _arguments);
            }
        }
    });

    function rpush() {
        this.redis.rpush.apply(this.redis, arguments);
    }
}

Client.prototype.getList = function (key, callback) {
    var self = this;
    this.redis.llen(key, function (err, reply) {
        if (err) {
            return callback(err);
        }
        var len = reply;
        if (len == 0) {
            return callback(null, null);
        } else if (len > 0) {
            self.redis.lrange(key, 0, len - 1, function (err, reply) {
                if (err) {
                    return callback(err);
                }
                return callback(null, reply);
            });
        }
    });
}


Client.prototype.get = function (spec, callback) {
    var handle = this.constructor.KEY_TYPES[spec.type].get_handle;
    var key = spec.key;
    return handle.call(this, key, callback);
}

Client.prototype.exists = function (key, callback) {
    this.redis.exists(key, function (err, reply) {
        if (err) {
            return callback(err);
        }
        return callback(null, reply === 1)
    });
}

Client.prototype.flush = function (callback) {
    this.redis.flushall(function (err, reply) {
        if (err) {
            return callback(err);
        }
        return callback(null, reply.toLowerCase() === 'ok');
    });
}

Client.prototype.close = function (callback) {
    this.redis.quit(function (err, reply) {
        if (err) {
            return callback(err);
        }
        this.closed = true;
        return callback(null, reply.toLowerCase() === 'ok');
    });
}


Client.KEY_TYPES = {

    hash: {
        get_handle: Client.prototype.getObject,
        set_handle: Client.prototype.setObject
    },

    string: {
        get_handle: Client.prototype.getString,
        set_handle: Client.prototype.setString
    },

    list: {
        set_handle: Client.prototype.setList,
        get_handle: Client.prototype.getList
    }
};