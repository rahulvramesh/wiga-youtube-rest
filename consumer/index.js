
var amqp = require('amqplib/callback_api');
var fs = require('fs');
var youtubedl = require('youtube-dl');
var ffmpeg = require('ffmpeg');

amqp.connect(process.env.MESSAGE_QUEUE, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'video';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {

      console.log(" [x] Received %s", msg.content.toString());

       var uUrl = msg.content.toString();
       var filePath = "";
       var fileID = "";

       //download the file
       var video = youtubedl(uUrl,
        // Optional arguments passed to youtube-dl.
        ['--format=18'],
        // Additional options can be given for calling `child_process.execFile()`.
        { cwd: __dirname });
    
        video.on('info', function(info) {
            video.pipe(fs.createWriteStream("data/temp/"+info["id"]+".mp4", { flags: 'a' }));
            filePath = "data/temp/"+info["id"];
            fileID = info["id"];
        });
    
        video.on('complete', function complete(info) {
            'use strict';
            console.log('filename: ' + info._filename + ' already downloaded.'); 
          });
    
        video.on('end', function() {
            console.log("starting conversion"); 
            
            try {
                var process = new ffmpeg(filePath+".mp4");
                process.then(function (video) {
                    // Callback mode
                    video.fnExtractSoundToMP3(filePath+'.mp3', function (error, file) {
                        if (!error) {
                            console.log('Audio file: ' + file);

                            //move file
                           // copy(file,"/var/www/localhost/htdocs/"+fileID+".mp3");

                           fs.unlink(filePath+".mp4", function (err) {
                            if (err) {
                                console.error(err);
                            }
                           console.log('File has been Deleted');
                           
                        });

                        }
                    });
                }, function (err) {
                    console.log('Error: ' + err);
                });
            } catch (e) {
                console.log(e.code);
                console.log(e.msg);
            }

        
        }); 

    }, {noAck: true});
  });
}); 


function copy(oldPath, newPath) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(oldPath);
      const writeStream = fs.createWriteStream(newPath);
  
      readStream.on('error', err => reject(err));
      writeStream.on('error', err => reject(err));
  
      writeStream.on('close', function() {
        resolve();
      });
  
      readStream.pipe(writeStream);
});
}