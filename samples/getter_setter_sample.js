/**
 * Created by davidyu on 8/28/14.
 */

var sys = require('sys');

function Person(age) {

    this.__defineGetter__('age', function () {
        return age;
    })

    this.__defineSetter__('age', function (arg) {
        age = arg;
    })
}


var dude = new Person(18);

sys.puts(dude.age);
dude.age = 32;

sys.puts(dude.age);
