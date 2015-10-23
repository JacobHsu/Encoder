global.config  = require('../config')();

module.exports  = VideoEncoder;

function VideoEncoder (job, module_callback) {

    module_callback(null, '[jobs] video-encoder');
}