# Encoder

###npm

[npm](https://www.npmjs.com)

`npm init`

`npm install express --save`  
`npm install body-parser --save`  
`npm install mongodb --save`  
`npm install async --save`  
`npm install node-uuid --save`  


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

###Tests

[Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop)

```
    http://localhost:8888/job POST Headers(1)
    Content-Type application/json
    raw
    {
        "job": "video",
        "config": "{file:http://yourdomain.mp4, backend:http://yourdomain/backend_api/type/:id}"   
    }
```

