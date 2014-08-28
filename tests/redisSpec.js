/**
 * Created by davidyu on 8/26/14.
 */

var redis = require('redis');
var expect = require("chai").expect;
var assert = require("chai").assert;
var util = require("../lib/util");

var redisClient = redis.createClient();

describe("Built-in Redis Library", function () {

    it("should have redis client installed", function () {
        expect(redis).to.have.ownProperty("RedisClient");
    });

    it("should have get operation returned null for non-existent key", function (done) {
        var key = "key_" + Math.floor(Math.random() * 99 + 1);
        redisClient.get(key, function (err, reply) {
            expect(reply).to.be.null;
            done();
        });
    });

    it("should have get operation return correct value for existing key", function (done) {
        var key = "key_" + Math.floor(Math.random() * 99 + 1);
        var value = "value_" + Math.floor(Math.random() * 99 + 1);
        redisClient.set(key, value)
        redisClient.get(key, function (err, reply) {
            expect(reply).to.be.equal(value);
        });
        redisClient.del(key, function (err, reply) {
            expect(reply).to.be.equal(1);
            done();
        });
    });


});

var myRedis = require('../lib/redis');
var uuid = require('node-uuid');
var debug = require('debug')('redis:test');

describe("Redis", function () {


    beforeEach(function (done) {
        debug("beforeEach is being called");
        var redisClient = myRedis.createClient();
        redisClient.flush(function (err, reply) {
            done();
        });
    });

    describe("#client", function () {

        it("should have returned the same client singleton instance", function () {
            var redisClient = myRedis.createClient();
            var redisClient1 = myRedis.createClient();
            assert(redisClient === redisClient1);

        });

    })

    var _uuid = uuid.v4();

    describe("#set", function () {

        it("should have saved an object to redis", function (done) {
            var object = {
                id: 1,
                uuid: _uuid,
                os: "Android",
                model: "Nexus4"
            };
            var spec = {
                type: 'hash',
                value: object
            }
            var redisClient = myRedis.createClient();
            redisClient.set(spec, function (err, key) {
                expect(err).to.be.null;
                expect(key).to.be.equal("Object:" + 1);
                done();
            });
        });

        it("should have saved a simple key / value to redis", function (done) {
            var redisClient = myRedis.createClient();
            var key = "key:" + util.random(1000);
            var value = "value:" + util.random(1000);
            var spec = {
                key: key,
                value: value,
                type: 'string'
            }
            redisClient.set(spec, function (err) {
                expect(err).to.be.null;
                done();
            });
        });

        it("should have saved a list to redis", function (done) {
            var redisClient = myRedis.createClient();
            var key = "key:" + util.random(1000);
            var value = [];
            util.range(1, 10).forEach(function (v) {
                value.push("value_" + util.random(1000));
            });
            var spec = {
                key: key,
                value: value,
                type: 'list'
            }
            redisClient.set(spec, function (err) {
                expect(err).to.be.null;
                done();
            });
        })

    });

    describe("#get", function () {

        it("should have returned null from redis if the object does not exist", function (done) {
            var key = "Object:1";
            var spec = {
                key: key,
                type: 'hash'
            }
            var redisClient = myRedis.createClient();
            redisClient.get(spec, function (err, obj) {
                expect(err).to.be.null;
                expect(obj).to.be.null;
                done();
            });
        });

        it("should have retrieved an object from redis", function (done) {
            var object = {
                id: 1,
                uuid: _uuid,
                os: "Android",
                model: "Nexus4"
            };
            var spec = {
                type: 'hash',
                value: object
            };
            var redisClient = myRedis.createClient();

            redisClient.set(spec, function (err, key) {
                delete spec.value;
                spec.key = key;
                var expected = util.clone(object);
                expected.id = expected.id.toString();
                redisClient.get(spec, function (err, obj) {
                    expect(err).to.be.null;
                    expect(obj).to.be.deep.equal(expected);
                    done();
                });
            });

        });

        it("should have retrieved a simple string key from redis", function (done) {
            var key = "key:" + util.random(1000);
            var value = "value:" + util.random(1000);
            var spec = {
                key: key,
                type: "string",
                value: value
            };
            var redisClient = myRedis.createClient();
            redisClient.set(spec, function () {
            });
            redisClient.get(spec, function (err, redisValue) {
                expect(err).to.be.null;
                expect(value).to.be.deep.equal(redisValue);
                done();
            });
        });

        it("should have returned null if the string key does not exist in redis", function (done) {
            var key = "key:" + util.random(1000);
            var spec = {
                key: key,
                type: "string"
            };
            var redisClient = myRedis.createClient();
            redisClient.get(spec, function (err, value) {
                expect(err).to.be.null;
                expect(value).to.be.null;
                done();
            });
        });

        it("should have retrieved a list from redis", function (done) {
            var redisClient = myRedis.createClient();
            var key = "list:key:" + util.random(1000);
            var value = [];
            util.range(1, 10).forEach(function (v) {
                value.push("value_" + util.random(1000));
            });
            var spec = {
                key: key,
                value: value,
                type: 'list'
            }
            redisClient.set(spec, function (err) {
                expect(err).to.be.null;
                delete spec.value;
                redisClient.get(spec, function (err, redisValue) {
                    expect(err).to.be.null;
                    expect(redisValue).to.be.deep.equal(value);
                    done();
                });
            });
        });

        it("should have returned null if the list key does not exist in redis", function (done) {
            var redisClient = myRedis.createClient();
            var key = "list:key:" + util.random(1000);
            var spec = {
                key: key,
                type: 'list'
            }
            redisClient.get(spec, function (err, redisValue) {
                expect(err).to.be.null;
                expect(redisValue).to.be.null;
                done();
            });
        });

    });

    describe("#exists", function () {

        it("should return true for existent key", function (done) {
            var client = myRedis.createClient();
            var key = "key:" + util.random(1000);
            var value = "value:" + util.random(1000);
            var spec = {
                key: key,
                value: value,
                type: "string"
            };
            client.set(spec, function () {
                client.exists(key, function (err, flag) {
                    expect(flag).to.be.true;
                    done();
                })

            });

        });

        it("should return false for non-existent key", function (done) {
            var client = myRedis.createClient();
            var key = "key:" + util.random(100000);
            client.exists(key, function (err, flag) {
                expect(flag).to.be.false;
                done();
            })


        });

    });

    describe("#flush", function () {

        it("should flush out all keys", function (done) {
            var client = myRedis.createClient();
            client.flush(function (err, result) {
                expect(err).to.be.null;
                expect(result).to.be.true;
                redisClient.keys("*", function (err, reply) {
                    expect(err).to.be.null;
                    expect(reply).to.be.deep.equal([]);
                    done();
                })
            })
        });

    });

    describe("#misc", function () {

        it("should return the underlying redis client object", function (done) {
            var redisClient = myRedis.createClient();
            expect(redisClient.redis).to.be.not.null;
            expect(redisClient.redis).to.be.instanceof(redis.RedisClient);
            done();
        });

    });

    describe("#close", function () {

        it("should close the connection ", function (done) {
            var redisClient = myRedis.createClient();
            redisClient.close(function (err, success) {
                expect(err).to.be.null;
                expect(success).to.be.true;
                done();
            });
        });

    });


});
