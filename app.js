var admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
var date = new Date();
var inception = date.toUTCString();
var mili = Date.now();
const dotenv = require('dotenv');
const path = require('path');

global.path = path;
global.dotenv = dotenv;

loadENV();

const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const client = require('twilio')(accountSid, authToken);

const serviceAccount = {
        "type":process.env.TYPE,
        "project_id":process.env.PROJECT_ID,
        "private_key_id":process.env.PRIVATE_KEY_ID,
        "private_key":JSON.parse(process.env.PRIVATE_KEY),
        "client_email":process.env.CLIENT_EMAIL,
        "client_id":process.env.CLIENT_ID,
        "auth_uri":process.env.AUTH_URI,
        "token_uri":process.env.TOKEN_URI,
        "auth_provider_x509_cert_url":process.env.AUTH_PROVIDER,
        "client_x509_cert_url":process.env.CLIENT_CERT
}

const port = process.env.PORT || 3000;

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
        new: true,
        totalLog: 0
    });
}

function updateUserData(name) {
    database.ref('users/' + name).update({
        new: false
    });
}

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public'));

app.get('/time', function (req, res, next) {
    res.json({
        mili: mili
    });
});

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/users', function (req, res) {
    database.ref('/users/' + req.body.name).once('value', function (data) {
        var value = data.val();
        if (value == null) {
            writeUserData(req.body.name, req.body.mobile);
            setTimeout(function () {
                database.ref('/users/' + req.body.name).once('value', function (data) {
                    res.json(data);
                });
            }, 500);
            var timeout = setInterval(function () {
                var hours = new Date().getHours();
                if(hours>5 && hours<20){
                    sendMessage(req.body.name,req.body.mobile,0);
                }else{
                    console.log('message not sent due to night.');
                }

            }, 3600000);
        } else {
            updateUserData(req.body.name);
            database.ref('/users/' + req.body.name).once('value', function (data) {
                res.json(data);
            });
        }
    });

});

app.get('/user', function (req, res) {
    database.ref('/users/' + req.query.name).once('value', function (data) {
        res.json(data);
    });
});

function sendMessage(name,mobile,failed){
    client.messages.create({
        to: mobile,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: "Hello There, Your name is " +name + "\nRegards,\nTeam Memento"
    },function (err, message) {
        if (err) {
            var failed;
            database.ref('/users/' + name).once('value', function (data) {
                failed = data.child('totalLog').val();
            });
            database.ref('/users/' + name).child('log').child(Date.now()).set(new Date().toString());
            failed++;
            database.ref('/users/' + name).update({
                totalLog: failed.toString()
            });
            failed++;
            if(failed>5) sendMessage(name,mobile,failed)
        } else {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
     
            console.log('Message sent on:');
            console.log(message.dateCreated);
        }
    });
}

app.listen(port,()=>{
    console.log('app running on port: ',port);
});

//function to load env variables

function loadENV() {
    const defaultConfig = dotenv.config({
        path: path.resolve(process.cwd(), '.env.default')
    });
    const config = dotenv.config();

    if (config.error && !defaultConfig.error) {
        console.log("Could not find .env file, using default env file..");
    }else if(config.error && defaultConfig.error) {
        console.log("Could not find any .env files, please set one up!", 1);
    }else {
        console.log("Successfully loaded .env variables..");
    }
}
