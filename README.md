# Encoder

## Installation

[git] (http://git-scm.com/)  
[node.js](http://nodejs.org/download/)  
[wget](https://eternallybored.org/misc/wget/)  
[ffmpeg] (http://ffmpeg.zeranoe.com/builds/)  

[![NPM](https://nodei.co/npm/express.png?downloads=true&stars=true)](https://www.npmjs.com/package/express)

###npm

[npm](https://www.npmjs.com)

`npm init`

`npm install express --save`  
`npm install body-parser --save`  
`npm install mongodb --save`  
`npm install async --save`  
`npm install node-uuid --save`  
`npm install progress --save`  


###MongoDB 

[mongodb](https://www.mongodb.org)

C:\Program Files\MongoDB\Server\3.0\bin\mongod.exe mongo


C:\Program Files\MongoDB\Server\3.0\bin>**mongo start**
```
MongoDB shell version: 3.0.6
connecting to: start
2015-08-25T20:52:46.152+0800 W NETWORK  Failed to connect to 127.0.0.1:27017, re
ason: errno:10061 No connection could be made because the target machine activel
y refused it.
2015-08-25T20:52:46.160+0800 E QUERY    Error: couldn't connect to server 127.0.
0.1:27017 (127.0.0.1), connection attempt failed
    at connect (src/mongo/shell/mongo.js:179:14)
    at (connect):1:6 at src/mongo/shell/mongo.js:179
exception: connect failed
```
**'C:\data\db\' 這個資料夾必須手動建立**，建立完成後再跑一次 mongod

Start: C:\Program Files\MongoDB\Server\3.0\bin>**mongod**
```
2015-08-25T20:53:31.889+0800 I JOURNAL  [initandlisten] journal dir=C:\data\db\j
ournal
2015-08-25T20:53:31.890+0800 I JOURNAL  [initandlisten] recover : no journal fil
es present, no recovery needed
```

###Web-based MongoDB admin

[mongo-express](http://andzdroid.github.io/mongo-express/)

Usage
-----

**To install:**

    npm install mongo-express

**To configure:**

Copy `config.default.js` into a new file called `config.js`.

```
  basicAuth: {
    username: process.env.ME_CONFIG_BASICAUTH_USERNAME || 'admin',
    password: process.env.ME_CONFIG_BASICAUTH_PASSWORD || 'pass'
  },

```

**To run:**

    node app.js

**To use:**

Visit `http://localhost:8081` or whatever URL/port you entered into your
config (if running standalone) or whatever `config.site.baseUrl` (if mounting
as a middleware).


###Test Files

>http://vjs.zencdn.net/v/oceans.mp4 400p 9.63KB
 http://www.html5videoplayer.net/videos/madagascar3.mp4 360p 28.7MB
 https://videos.pexels.com


Google Drive / 連結共用 / 開啟 - 公開在網路上  存取權任何人 (無需登入) 可以檢視
https://drive.google.com/file/d/0By2vNp-15I-UOGIydmZOOGtTV0U/view?usp=sharing
```
https://googledrive.com/host/0By2vNp-15I-UOGIydmZOOGtTV0U
```


###Tests

[JSON Editor Online](http://jsoneditoronline.org)
[Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop)

job
```
    http://localhost:8888/job POST Headers(1)
    Content-Type application/json
    raw
    {
        "job": "video",
        "config": {
          "file":"https://googledrive.com/host/0By2vNp-15I-UOGIydmZOOGtTV0U", 
          "backend":"http://yourdomain/backend_api/type/:id"
        }
    }
```

>JSON
{
    "id": "566e1c6777985e481adf8af3",
    "uuid": "fc5a5635-aeb5-426e-9e7b-c5184017c954"
}

progress
```
    http://localhost:8888/progress POST Headers(1)
    Content-Type application/json
    raw
    {
        "videouuid": "fc5a5635-aeb5-426e-9e7b-c5184017c954"
    }
```
>JSON
{
    "_id": "565270cffc08f8cc23b54518",
    "uuid": "fc5a5635-aeb5-426e-9e7b-c5184017c954",
    "job": "video",
    "config": {
        "file": "http://vjs.zencdn.net/v/oceans.mp4",
        "backend": "http://yourdomain/backend_api/type/:id"
    },
    "from": "127.0.0.1",
    "state": "start",
    "progress": 30,
    "log": "========= wget end =========\nhttp://vjs.zencdn.net/v/oceans.mp4\n",
    "time": "2015-11-23T01:50:07.483Z"
}