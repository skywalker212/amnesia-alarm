# amnesia-alarm

[![build-status](https://travis-ci.com/skywalker212/amnesia-alarm.svg?branch=master)](https://travis-ci.com/skywalker212/amnesia-alarm)

    An SMS based alarm for people who forget their name every hour, to remind them who they are.

This is a very fundamental Node/Express app and you will be able to understand easily. This app was a screening-task but became a side project at a later stage. 

I have used firebase to store user data and twilio to send sms to the users. This twilio part may/may-not work. But other things are working fine. There are still some ~~major~~ bugs in the app, hope you find em (and collect a bounty). I am aware of those bugs but I don't have enought time right now to fix those, if your are interested, you can work on em.

If you are running it locally, make sure to rename ```.env.default``` to ```.env``` and setup necessary environment vairables in it, I have already added the names of required tokens in it.

![amnesia-screenshot](./screenshot.png)

## file structure

- app.js - main server file
- public/ - html client

## contribute

- clone this repo using ```git clone https://github.com/skywalker212/amnesia-alarm.git```
- ```cd amnesia-alarm```
- run ```npm install``` or ```yarn install``` to install the modules
- run ```npm start``` to start the application locally
- find bugs/ improve functionality
- report it in issues
- raise a PR