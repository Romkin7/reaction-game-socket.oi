# reaction-game-socket.oi
NodeJS and socket io app with mongoDB

Hi All, 
Thanks for viewing this repo. In this into file I will cover in detail, how this app works with websockets and mongoose
plus mongoDB.
so you can understand the concept and implement it in your own express app.
I tart by going through server.js file and how it is structured. I tell mostly about configuring websockets in this app. 
I do think that by this point you guys already know how to setup express ap and how it works so i won't go into that. 
First of all I will show you why we don't need to do 

const socket = io("http://localhost:3000");

in browser to connect to websockets on server.

by Doing right configuration in server.js file we can just include this

<script src="/socket.io/socket.io.js"></script>

script tag in t he bottom of html file 
and connect to websockets on node server in no time.
 
then in js file in browser mine is results.js in there i simply do

const socket = io();
socket.on("connection", function() {});

it's that simple to do just these steps if you configure server.js file main node app file right way.
So how we should configure it and what is important?

let's start by installing express and socket.io
from npm, by running

npm install socket.io express --save

then initialize express app in server.js file

const express = require('express');
const app = express();
const httpServer = require('http').Server(app);

here we call .Server method from http module and pass to it initialized express app as argument.

next we require socket.io

const io = require("socket.io")(httpServer);
and pass it httpServer we just created as argument.

then we create socketEvents file in in rootfolder of app we are building and require it also and pass to it 
io and app as arguments.

const socketEvents = require('socketEvents')(io, app); 

next we configure express app to serve public folder to browser





