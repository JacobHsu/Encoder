global.config  = require('../config')();
var fs = require('fs');

module.exports  = VideoEncoder;

function VideoEncoder (job, module_callback) {
    privateInit();
    module_callback(null, '[jobs] video-encoder');
}

var privateInit = function () {
    config.jobVideoModules.forEach(function (appConfig) {
        this.videosPath = appConfig.options.videosPath;
        this.publicPath = appConfig.options.publicPath;
    });

    if (!fs.existsSync(this.videosPath)) {
        fs.mkdirSync(this.videosPath);
    }

    if (!fs.existsSync(this.publicPath)) {
        fs.mkdirSync(this.publicPath);
    }
};