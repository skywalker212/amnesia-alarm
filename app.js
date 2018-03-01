var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://amnesia-alarm.firebaseio.com"
});

var database = admin.database();

var app = express();

var user = database.ref('users/');

function writeUserData(name,mobile){
    database.ref('users/'+name).set({
        mobile: mobile,
        failed: 0
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
  console.log(`${req.method} request for ${req.url} - ${JSON.stringify(req.body)}`);
  next();
});

app.use(express.static("./public"));

app.post('/users',function(req,res){
    console.log(req.body.name);
    database.ref('/users/'+req.body.name).once('value',function(data){
        var value = data.val();
        if(value == null){
            console.log('the user does not exist!');
            writeUserData(req.body.name,req.body.mobile);
        }
    });
    res.json({
        success:true
    });
});

app.listen(8080);