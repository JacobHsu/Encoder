global.config  = require('../config')();
var url = require('url');
var http = require('http');
var fs = require('fs');
var path = require('path');
var async = require('async');
var ProgressBar = require('progress');

module.exports  = VideoEncoder;

function VideoEncoder (job, log_consumer, progress_consumer, module_callback) {

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
        this.publicPath = appConfig.options.publicPath;
        this.wgetExe = appConfig.options.wget.exe;
        this.ffmpegExe = appConfig.options.ffmpeg.exe;
        this.ffImage = appConfig.options.ffmpeg.image;
        this.ffmp4 = appConfig.options.ffmpeg.mp4;
        this.ff360p = appConfig.options.ffmpeg.ff360p;
        this.ff480p = appConfig.options.ffmpeg.ff480p;
        this.ff720p = appConfig.options.ffmpeg.ff720p;
        this.ff1080p = appConfig.options.ffmpeg.ff1080p;
        this.ffbtype = appConfig.options.ffmpeg.ffbtype;
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

                log_consumer.set(log, function(result){
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

                log_consumer.set(ffmpegDebugLog, function(result){
                    ffmpeg_callback(null, inputVideo, videoBtype, videoDuration);
                });

            });

        },
        function(inputVideo, videoBtype, videoDuration, ffmpeg_callback){

            //output max video btype
            var videosSize = this.ffbtype.replace(/[a-z]/g,'').split(','); //["360", "480", "720", "1080"]
            function funcVideoBtype(value) {
                return value <= parseInt(videoBtype);
            }
            var btypes = videosSize.filter(funcVideoBtype); //e.g. ["360", "480"]
            if(btypes.length == 0) {
                btypes = ['360'];
            }

            //ffmpeg command
            var mp4_cmd_args = this.ffmp4;
            var output_ffmpeg_args;
            for (var n in btypes) {
                var btype = btypes[n];
                var outputMp4 = this.publicPath + '/' + fileName +'-'+btype+'p.mp4';

                if(btype =='360'){
                    output_ffmpeg_args = this.ff360p;
                } else if (btype =='480') {
                    output_ffmpeg_args = this.ff480p;
                } else if (btype =='720') {
                    output_ffmpeg_args = this.ff720p;
                } else if (btype =='1080') {
                    output_ffmpeg_args = this.ff1080p;
                }
                output_ffmpeg_args.push(outputMp4);

                mp4_cmd_args = mp4_cmd_args.concat(output_ffmpeg_args);
            }

            var input_args = ['-i', inputVideo];
            var ffmpegArgs = input_args.concat(mp4_cmd_args);
            
            var str = ffmpegArgs.toString()
            var cmdstr = str.replace(/,/g, " ");
            console.log('ffmpeg command: ffmpeg '+cmdstr);

            ffmpeg_callback(null, ffmpegArgs, videoDuration);

        },
        function(aFFmpegArgs, sVideoDuration, ffmpeg_callback){

            var spawn = require('child_process').spawn,
                ffmpeg = spawn(this.ffmpegExe, aFFmpegArgs),
                start = new Date();

            ffmpeg.stdout.on('data', function(data) {
                console.log('stdout:', data);
            });

            var time = 0;
            var ffmpegLog ='';
            
            ffmpeg.stderr.on('data', function(data) {

                //ffmpegLog = ffmpegLog + data.toString(); 
                var content = data.toString();
                //process.stdout.write(content);
                var getTime = content.match(/time=(.*?) bitrate/g);
                var bar;
                if (getTime) {

                    var rawTime = getTime[0].replace('time=', '').replace(' bitrate', '');
                    arHMS = rawTime.split(":").reverse();
                    time = parseFloat(arHMS[0]);
                    if (arHMS[1]) time += parseInt(arHMS[1]) * 60;
                    if (arHMS[2]) time += parseInt(arHMS[2]) * 60 * 60;

                    var iPercentage = Math.round((time / sVideoDuration) * 100);
                    bar = new ProgressBar('ffmpeg :bar :percent', { total: 100 });
                    bar.tick(iPercentage);
                    if (bar.complete) {
                        console.log('complete\n');
                    }

                    progress_consumer.set(iPercentage, function(result){

                    }); 

                }


            });
            ffmpeg.on('exit', function(code) {

                if (code !== 0) {
                    ffmpeg_callback('[jobs] ffmpeg_video_encoder_fail!');
                    return;
                }

                var convert_time = (new Date() - start) / 1000;
                var ffmpegDebugLog ='{ffmpeg_video_encoder : [convert_time:'+convert_time+']}\n';

                var log = '========= ffmpeg end =========\n';
                    log += ffmpegDebugLog + ffmpegLog;
 
                log_consumer.set(log, function(result){
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