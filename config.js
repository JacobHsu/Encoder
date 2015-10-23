module.exports = function() {
    return {
        server: {
            hostname :'localhost',
            host:'127.0.0.1',
            port: 8888
        },
        database: {
            mongodb : 'mongodb://localhost:27017/myproject',
            table: 'encoder'
        },
        supervisor :{
            milliseconds: 3000
        },
        forks: {
            max: 1
        }
    };
};