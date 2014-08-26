/**
 * Created by davidyu on 8/26/14.
 */

// Overriding the default toString method

function Dog(name, breed, color, sex) {
    this.name = name;
    this.breed = breed;
    this.color = color;
    this.sex = sex;
}

theDog = new Dog("Gabby", "Lab", "chocolate", "female");

console.log(theDog.toString()); //returns [object Object]

Dog.prototype.toString = function dogToString() {
    var ret = "Dog " + this.name + " is a " + this.sex + " " + this.color + " " + this.breed;
    return ret;
}

console.log(theDog.toString());

// Using toString() to detect object class
var toString = Object.prototype.toString;

console.log(toString.call(new Date)); // [object Date]
console.log(toString.call(new String)); // [object String]
console.log(toString.call(Math)); // [object Math]

//Since JavaScript 1.8.5
console.log(toString.call(undefined)); // [object Undefined]
console.log(toString.call(null)); // [object Null]



