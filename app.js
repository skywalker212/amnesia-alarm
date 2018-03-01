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
        lname: name.split(' ')[1],
        mobile: mobile,
        failed: false,
        totalLog: 0
    });
}

function updateUserData(name, mobile) {
    database.ref('users/' + name).update({
        mobile:mobile
    });
}

app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname+'/public'));

app.get('/time',function(req,res,next){
    res.json({
        mili: mili
    });
});

app.get('/',function(req,res){
    res.render('index');
});

app.post('/users', function (req, res) {
    var total = 0;
    database.ref('/users/' + req.body.name).once('value', function (data) {
        var value = data.val();
        if(value==null)  writeUserData(req.body.name, req.body.mobile);
        else updateUserData(req.body.name,req.body.mobile);
    });
    
    setTimeout(function(){
        database.ref('/users/' + req.body.name).once('value', function (data) {
            total = data.child('totalLog').val();
            res.json(data);
        });
    },500);

    var timeout = setInterval(function(){
        database.ref('/users/' + req.body.name).child('log').child(Date.now()).set(new Date().toString());
        total++;
        database.ref('/users/' +req.body.name).update({
            failed: true,
            totalLog: total.toString()
        });
    },10000);
});

app.get('/users',function(req,res){
    database.ref('/users/' + req.body.name).once('value', function (data) {
        res.json(data);
    });
});

app.listen(8080);

console.log('node app running on port 8080');