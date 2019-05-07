/** This is reaction games server file the very main file that listens for requests and 
routes them to correct endpoints and serves public folder to the browser. */
"use strict";
/* Open Database connection */
require('./config/dbConnection');
/* Import packages */
const express = require('express');
// initialize express app
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer);
const socketEvents = require("./routes/socketEvents")(io, app);
const helmet = require('helmet');
const morgan = require('morgan');
const ejs = require('ejs');
const engine = require('ejs-mate');
const compression = require('compression');
const errorHandler = require("./config/errorHandler");
/* Routes are defined here */
const indexRoutes = require('./routes/game');
// Setup express apps middleware
app.set("port", process.env.PORT);
app.set("ip", process.env.IP);
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}));
app.use(express.static(path.join(__dirname, "/public")));
//set api Routes
app.use("/", indexRoutes);
//start the server, to listen for requests
//Not found 404 generic page
app.get("*", function(req, res, next) {
  res.sendFile(path.join(__dirname + "/public/404_notfound.html"));
});
app.use(errorHandler);
//Start server
let server = httpServer.listen(app.get("port"), app.get("ip"), err => {
  if (err) {
    res
      .status(500)
      .send(err + " Palvelinta ei voitu käynnistää, teknisen vian vuoksi!");
  } else {
    const port = server.address().port;
    console.log("Reaktio pelin palvelin on käynnistetty portilla: " + port);
  }
});
function cleanup() {
  server._connections = 0;
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
