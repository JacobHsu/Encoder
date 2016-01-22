module.exports = function() {
    return {
        server: {
            hostname :'localhost',
            host:'127.0.0.1',
            port: 8888
        },
        // dataBackend can be 'mysql' or 'mongodb'. 
        dataBackend: 'mysql',
        mongodb: {
            url: 'mongodb://localhost:27017/myproject',
            collection: 'encoder'
        },
        mysql: {
            user: 'root',
            password: 'yourpwd',
            host: '127.0.0.1',
            port: '3306',
            database : 'test',
            table: 'encoder',
            connectionLimit : 10
        },
        supervisor :{
            milliseconds: 3000
        },
        forks: {
            max: 1
        },
        jobVideoModules: [
                {
                    app: 'video',
                    options: {
                        wget: { 
                            exe: './bin/wget'
                        },
                        ffmpeg: { //https://www.ffmpeg.org/ffmpeg.html
                            exe  : './bin/ffmpeg',
                            image: ['-i', 'inputVideo', '-y', '-ss', '00:00:01', '-f', 'image2', '-vframes', '1'],
                            mp4: ['-y','-pass', '1', '-vcodec', 'libx264', '-b:v', '100' , '-bt', '100', '-threads', '0', '-qmin', '10', '-qmax', '31', '-g', '30'],
                            ff360p: ['-s', '640x360', '-b', '300k', '-ab', '128k', '-ac', '2'],
                            ff480p: ['-s', '854x480', '-b', '500k', '-ab', '128k', '-ac', '2'],
                            ff720p: ['-s', '1280x720', '-b', '1000k', '-ab', '384k', '-ac', '2'],
                            ff1080p: ['-s', '1920x1080', '-b', '1500k', '-ab', '384k', '-ac', '2'],
                            ffbtype: '360p,480p,720p,1080p'
                        }, 
                        publicPath: './public',
                        videosPath: './videos'
                    }
                }
            ]
    };
};