const express = require('express')
const bodyParser = require('body-parser');  
const url = require('url');  
const querystring = require('querystring'); 

var fs = require('fs');
var youtubedl = require('youtube-dl');

var amqp = require('amqplib/callback_api');

let app = express();  
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());

const port = 8080

app.get('/', (req, res) => res.send('Hello World!'))

// app.get('/file',function (req, res) {

// });

app.use('/static', express.static('/home/node/app/producer/data/temp'))

//queue
// amqp.connect(process.env.MESSAGE_QUEUE, function(err, conn) {
//     conn.createChannel(function(err, ch) {
//       var q = 'hello';

//       ch.assertQueue(q, {durable: false});
//       // Note: on Node 6 Buffer.from(msg) should be used
//       ch.sendToQueue(q, new Buffer('Hello World!'));
//       console.log(" [x] Sent 'Hello World!'");
//     });
//   });

//var rConnection = ""
var rChannel = ""
var q = 'video' 

amqp.connect(process.env.MESSAGE_QUEUE, function(err, conn) {
    conn.createChannel(function(err, ch) {
      ch.assertQueue(q, {durable: false});

      rChannel = ch
      // Note: on Node 6 Buffer.from(msg) should be used
     //ch.sendToQueue(q, new Buffer('Hello World!'));
      //console.log(" [x] Sent 'Hello World!'");
    });
});


app.post('/convert',function (req, res) {
  
    var video = youtubedl(req.query.url,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname });

    var responseJson = {"data" : {}}
    var fileUrl = "http://localhost:8080/static/";

    video.on('info', function(info) {
        console.log('Download started');
        console.log('filename: ' + info.filename);
        console.log('size: ' + info.size);

        //download mp3

        responseJson["data"]["full_title"] = info["fulltitle"];
        responseJson["data"]["thumbnail"] = info["thumbnail"];
        responseJson["data"]["thumbnail"] = info["thumbnail"];
        responseJson["data"]["duration"] = info["_duration_hms"];
        responseJson["data"]["file_name"] = fileUrl+info["id"]+'.mp3';

        //video.pipe(fs.createWriteStream("data/temp/"+responseJson["data"]["file_name"]+".mp4", { flags: 'a' }));

        //add to rabbitmq
        rChannel.sendToQueue(q, new Buffer(req.query.url));
        console.log(" [x] Sent "+req.query.url);

        res.send(responseJson)
    });

    // video.on('complete', function complete(info) {
    //     'use strict';
    //     console.log('filename: ' + info._filename + ' already downloaded.'); 
    //   });

    // video.on('end', function() {
    //     res.send(responseJson)
    // });  

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))