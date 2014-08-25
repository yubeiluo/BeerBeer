/**
 * Created by davidyu on 8/25/14.
 */

var amqp = require('amqp');

var connection = amqp.createConnection({host: 'localhost'});

connection.on('ready', function () {
    connection.exchange('new_device_events', {type: 'fanout',
        autoDelete: false}, function (exchange) {
        connection.queue('tmp-' + Math.random(), {exclusive: true},
            function (queue) {
                queue.bind('new_device_events', '');
                console.log(' [*] Waiting for logs. To exit press CTRL+C')

                queue.subscribe(function (msg) {
                    console.log(" [x] %s", msg.data.toString('utf-8'));
                    var objEvent = JSON.parse(msg.data);
                    var util = require('util');
                    console.log(util.inspect(objEvent, {'depth': null}));
                });
            })
    });
});

