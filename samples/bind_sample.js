/**
 * Created by davidyu on 8/22/14.
 */

// Enforcing Function Context

Function.prototype.bind = function () {
    var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift();
    return function () {
        return fn.apply(object,
            args.concat(Array.prototype.slice.call(arguments)));
    };
};

var Button = {
    click: function (value) {
        this.clicked = value;
    }
};

var elem = document.createElement("li");
elem.innerHTML = "Click me!";
elem.onclick = Button.click.bind(Button, false);
document.getElementById("results").appendChild(elem);

elem.onclick();
assert(Button.clicked === false, "The clicked property was correctly set on the object");

