"use strict";
const db = require('../models');
exports = module.exports = function(io) { 
  // Set socket.io listeners.
  io.on('connection', (socket) => {
  	/* result listeners */
  	socket.on("get-results", async (cb) => {
  		let results = await db.Result.find({}).sort({"score.points": -1}).limit(15).populate("player");
  		if(!results) {
  			socket.emit("error", {
  				"type": "error",
  				"status": 404,
  				"message": "Couldn't find ny results from database."
  			});
  		} else {
  			socket.emit("all-results", results);
  		}
  	});
  	/* user listerners */
  	socket.on("username", async (data) => {
  		let existingUser =  await db.User.findOne({"username": data.username});
  		if(!existingUser) {
  			let user = new db.User();
  			user.username = data.username;
  			let newUser = await user.save();
  			if(!newUser) {
  				socket.emit("error", {
  					"type": "error",
  					"status": 500,
  					"message": "Couldn't create new user into database."
  				});
  			} else {
  				socket.emit("startgame", newUser);
  			}
  		} else {
  			socket.emit("startgame", existingUser);
  		}
  	});
  	socket.on("gameover", async(data) =>{
  		let user = await db.User.findOne({"username": data.user});
  		if(!user) {
  			return socket.emit("error", {
  				"type": "error",
  				"status": 404,
  				"message": "Couldn't find user from database."
  			});
  		}
  		let result = new db.Result();
  		result.player = user;
  		result.score.points = data.result;
  		result.score.time = 90000;
  		let newResult = await result.save();
  		console.log(newResult);
  		user.results.push(newResult);
  		let updatedUser = await user.save();
  		let foundUpdatedUser = await db.User.findById(updatedUser._id).populate("results");
  		socket.emit("results", foundUpdatedUser);
  	});
  });
}