global.config  = require('../config')();
var url = require('url');
var http = require('http');
var fs = require('fs');
var path = require('path');
var async = require('async');
var ProgressBar = require('progress');

module.exports  = VideoEncoder;

function VideoEncoder (job, db_log_func, module_callback) {

    var isInit = privateInit();
    if(!isInit) {
         module_callback('[jobs] config not found');
         return
    }

    if(!job) {
        module_callback('[jobs] no input');
        return
    }

    var isValidate = dataValidate(job);
    if(!isValidate) {
         module_callback('[jobs] data validate fail');
         return
    }

    config.jobVideoModules.forEach(function (appConfig) {
        this.videosPath = appConfig.options.videosPath;
        this.wgetExe = appConfig.options.wget.exe;
        this.ffmpegExe = appConfig.options.ffmpeg.exe;
        this.ffImage = appConfig.options.ffmpeg.image;
        this.ffmp4 = appConfig.options.ffmpeg.mp4;
        this.ffwebm = appConfig.options.ffmpeg.webm;
        this.ff360p = appConfig.options.ffmpeg.ff360p;
        this.ff480p = appConfig.options.ffmpeg.ff480p;
        this.ff720p = appConfig.options.ffmpeg.ff720p;
        this.ff1080p = appConfig.options.ffmpeg.ff1080p;
    });

    var fileUrl = job.config.file;
    var fileName = job.uuid;
    var extname = path.extname(fileUrl);

    async.waterfall([

        function(http_callback){
            var parseUrl = url.parse(fileUrl, true);

            var req = http.request({
              host: parseUrl.host,
              port: 80,
              path: parseUrl.path
            });
             
            req.on('response', function(res){
                //console.log(res.headers); 
                if(res.headers['content-type'] !== 'video/mp4') {
                    http_callback('[jobs] data type err!');
                    return
                }
            });

            req.end();

            req.on('error', function(e) {
                console.error(e);
                return;
            });

            http_callback(null);
        },
        function(wget_callback) {

            var output = this.videosPath + '/' + fileName + extname;

            var args = ['--no-check-certificate', fileUrl ,'-O', output];
            var spawn = require('child_process').spawn,
                wget = spawn(this.wgetExe, args);

            wget.stderr.on('data', function(oData) {
                //process.stdout.write(oData);
                var sData = oData.toString();
                var iPercentage = sData.match(/ (.*?)%/g) == null ? '': parseInt(sData.match(/ (.*?)%/g) );
                var bar;
                if(iPercentage) {
                    bar = new ProgressBar('wget :bar :percent', { total: 100 });
                    bar.tick(iPercentage);
                    if (bar.complete) {
                        console.log('complete\n');
                    }
                }
            });

            wget.on('exit', function(code) {
                if (code !== 0) {
                    wget_callback('wget_error_msg '+ code);
                    return;
                } 

                var log = '========= wget end =========\n';
                    log += fileUrl+'\n';

                db_log_func.set(log, function(result){
                    wget_callback(null);
                }); 

            });

        },
        function(ffmpeg_callback){

            var inputVideo = this.videosPath + '/' + fileName + extname;
            var outputImg =  this.videosPath + '/' + fileName + '.jpg';

            var args = this.ffImage;
            args[1] = inputVideo; 
            args.push(outputImg);

            var spawn = require('child_process').spawn,
                ffmpeg = spawn(this.ffmpegExe, args);

            var ffmpegLog = '';

            ffmpeg.stdout.on('data', function(data) {
                console.log('stdout:', data);
            });

            ffmpeg.stderr.on('data', function(data) {
                ffmpegLog = ffmpegLog + data.toString();
            });
            ffmpeg.on('exit', function(code) {

                if (code !== 0) {
                    ffmpeg_callback('ffmpeg_check_video_fail');
                    return;
                }

                var videoBtype = 0;
                var videoDuration = 0;

                var size = (ffmpegLog) ? ffmpegLog.match(/Video: mjpeg, (.*?),(.*?)x(.*?),/g) : [];
                if (size) {
                    var btype = size[0].split("x");
                    var reg = /[^\d]/g;
                    videoBtype = btype[1].substr(0, 4).replace(reg, "");
                }

                var totalTime = (ffmpegLog) ? ffmpegLog.match(/Duration: (.*?), start:/) : [];
                if (!totalTime) { 
                    totalTime = (ffmpegLog) ? ffmpegLog.match(/Duration: (.*?), bitrate:/) : []; //.mpg
                }
                var rawDuration = totalTime[1];
                var arHMS = rawDuration.split(":").reverse();
                videoDuration = parseFloat(arHMS[0]);
                if (arHMS[1]) videoDuration += parseInt(arHMS[1]) * 60;
                if (arHMS[2]) videoDuration += parseInt(arHMS[2]) * 60 * 60;

                if (!videoBtype || !videoDuration) {
                    ffmpeg_callback({err_msg : 'ffmpeg_check_video_fail [size:' + size + ',videoBtype:' + videoBtype+ ',videoDuration:' + videoDuration + ',totalTime:' + totalTime + ']'});
                    return;
                }

                var ffmpegDebugLog = '{ffmpeg_check_video : [videoUuid:' + fileName + ', videoBtype:' + videoBtype + ',videoDuration:' + videoDuration + ']}\n';
                console.log(ffmpegDebugLog);

                db_log_func.set(ffmpegDebugLog, function(result){
                    ffmpeg_callback(null);
                });

            });

        }
    ], function (err, ret) {

        if(err){
            module_callback(err, ret);
            return;
        }

        module_callback(null, ret);

    });

}

var privateInit = function () {

    config.jobVideoModules.forEach(function (appConfig) {
        if (!appConfig.options) {
            return false;
        }
        this.videosPath = appConfig.options.videosPath;
        this.publicPath = appConfig.options.publicPath;
    });

    if (!fs.existsSync(this.videosPath)) {
        fs.mkdirSync(this.videosPath);
    }

    if (!fs.existsSync(this.publicPath)) {
        fs.mkdirSync(this.publicPath);
    }

    return true;
};

var dataValidate = function (job) {
    if (!job.uuid) {
        return false;
    }
    return true;
};