var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');
const express = require('express');
const bodyParser = require('body-parser');
var date = new Date();
var inception = date.toUTCString();
var mili = Date.now();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://amnesia-alarm.firebaseio.com"
});

var database = admin.database();

var app = express();

var user = database.ref('users/');

database.ref().child('onTime').set(inception);

function writeUserData(name, mobile) {
    database.ref('users/' + name).set({
        fname: name.split(' ')[0],
        mobile: mobile,
        failed: 0,
    });
}

function updateUserData(name, mobile) {
    database.ref('users/' + name).update({
        mobile:mobile
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/time',function(req,res,next){
    res.json({
        mili: mili
    });
});

app.use(function (req, res, next) {
    console.log(`${req.method} request for ${req.url} - ${JSON.stringify(req.body)}`);
    next();
});

app.use(express.static("./public"));

app.post('/users', function (req, res) {
    console.log(req.body.name);
    database.ref('/users/' + req.body.name).once('value', function (data) {
        var value = data.val();
        if(value==null)  writeUserData(req.body.name, req.body.mobile);
        else updateUserData(req.body.name,req.body.mobile);
    });
    
    setTimeout(function(){
        database.ref('/users/' + req.body.name).once('value', function (data) {
            res.json(data);
        });
    },500);

    var timeout = setInterval(function(){
        database.ref('/users/' + req.body.name).child('log').push(Math.random());
    },10000);
});

app.listen(8080);