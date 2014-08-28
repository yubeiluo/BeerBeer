/**
 * Created by davidyu on 8/26/14.
 */

var uuid = require('node-uuid');
var uuid1 = uuid.v1();
var uuid2 = uuid.v1({node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab]});
var uuid3 = uuid.v1({node: [0, 0, 0, 0, 0, 0]})
var uuid4 = uuid.v4();
var uuid5 = uuid.v4();

console.log(uuid1);
console.log(uuid2);
console.log(uuid3);
console.log(uuid4);
console.log(uuid5);
