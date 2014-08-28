/**
 * Created by davidyu on 8/26/14.
 */

var util = require("../lib/util");
var expect = require("chai").expect;
var assert = require("chai").assert;


describe("util", function () {

    describe("#type", function () {

        it("should return String for string input", function () {
            var type = util.type("ddd");
            expect(type).to.be.equal("String");
        });

        it("should return Number for number input", function () {
            var type = util.type(11);
            expect(type).to.be.equal("Number");
        });

        it("should return Number for object input", function () {
            var type = util.type({});
            expect(type).to.be.equal("Object");
        });

        it("should return Boolean for Boolean input", function () {
            var type = util.type(true);
            expect(type).to.be.equal("Boolean");
        });

        it("should return Null for null input", function () {
            var type = util.type(null);
            expect(type).to.be.equal("Null");
        });

        it("should return Undefined for undefined input", function () {
            var type = util.type(undefined);
            expect(type).to.be.equal("Undefined");
        });

        it("should return Custom for Custom input", function () {
            function Custom() {
            }

            var type = util.type(new Custom());
            expect(type).to.be.equal("Custom");
        });

    });

    describe("#random", function () {

        it("should return a random value between 1 (inclusive) and 10(exclusive)", function () {

            var value = util.random(1, 10);
            expect(value).to.be.a('number');
            expect(value).to.be.at.least(1);
            expect(value).to.be.below(10);
        });

        it("should return a random value less than 10 ", function () {

            var value = util.random(10);
            expect(value).to.be.a('number');
            expect(value).to.be.at.least(0);
            expect(value).to.be.below(10);
        })

    });

    describe("#range", function () {

        it("should generate an integer array [1,10]", function () {
            expect(util.range(1, 10)).to.be.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });

    });

    describe("#flatten", function () {

        it("should return a flattened array [1,2,3,4] for flatten([1,2],[3,4]) operation", function () {
            var a = [1, 2];
            var b = [3, 4];
            var expected = [1, 2, 3, 4];
            expect(util.flatten(a, b)).to.be.deep.equal(expected);
        });
    });

    describe("#clone", function () {

        it("should return a shadow copy of object by default", function () {
            var ori = {
                name: "David Yu",
                age: 18,
                wives: ["YL", "Victoria Beckham"]
            };
            var clone = util.clone(ori);
            expect(clone).to.be.deep.equal(ori);
            expect(clone.wives).to.be.equal(ori.wives);
        });

        it("should return a deep copy of object", function () {
            var ori = {
                name: "David Yu",
                age: 18,
                wives: ["YL", "Victoria Beckham"]
            };
            var clone = util.clone(ori, 'deep');
            expect(clone).to.be.deep.equal(ori);
            expect(clone.wives).to.be.not.equal(ori.wives);
        });

    })

});
