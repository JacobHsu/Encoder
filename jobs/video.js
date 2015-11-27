global.config  = require('../config')();
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
        this.wget = appConfig.options.wget.exe;
    });

    var fileurl = job.config.file;
    var output = this.videosPath + '/' + job.uuid + path.extname(fileurl);

    async.waterfall([

        function(callback) {

            var args = [' --no-check-certificate', fileurl ,'-O', output];
            var spawn = require('child_process').spawn,
                wget = spawn(this.wget, args);

            wget.stderr.on('data', function(oData) {
                //process.stdout.write(oData);
                var sData = oData.toString();
                var iPercentage = sData.match(/ (.*?)%/g) == null ? '': parseInt(sData.match(/ (.*?)%/g) );
                var bar;
                if(iPercentage) {
                    bar = new ProgressBar('wget :bar :percent', { total: 100 });
                    bar.tick(iPercentage);
                }
            });

            var wgetLog = '';
            wget.on('exit', function(code) {
                if (code !== 0) {
                    callback('wget_error_msg '+ wgetLog);
                    return;
                } 

                var log = '========= wget end =========\n';
                    log += fileurl+'\n';

                db_log_func.set(log, function(result){
                    callback(null);
                }); 

            });

        },
        function(callback){

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