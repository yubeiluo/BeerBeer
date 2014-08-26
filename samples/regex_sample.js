/**
 * Created by davidyu on 8/26/14.
 */

// Match one d followed by one or more b's followed by one d
// Remember matched b's and the following d
// Ignore case
var re = /d(b+)(d)/ig;
var result = re.exec("cdbBdbsbz");

console.log(result);


var myRe = /ab*/g;
var str = "abbcdefabh";
var myArray;
while ((myArray = myRe.exec(str)) !== null) {
    var msg = "Found " + myArray[0] + ".  ";
    msg += "Next match starts at " + myRe.lastIndex;
    console.log(msg);
}

