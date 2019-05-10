"use strict";
const db = require('../models');
let users = new Map();
function setUserToMap (user) {
  let obj = {};
  obj.user = user;
  obj.Tulos = 0;
  obj.Attemps = 3;
  obj.Status = 'Active';

  users.set(user.username, obj); 
  return;
} 
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
          await setUserToMap(newUser);
          socket.emit("startgame", newUser);
  			}
  		} else {
        await setUserToMap(existingUser);
        socket.emit("startgame", existingUser);
  		}
      socket.broadcast.emit('new-user', JSON.stringify(users.get(data.username)));
      return;
  	});
    socket.on('painallus', (data) => {
      console.log(data);
      let obj = JSON.parse(data.painallus);
      if (obj) {
        let user = users.get(obj.username); 
        user.Tulos = obj.Tulos;
        user.Attemps = parseFloat(obj.AttempsCount);  
        users = new Map([...users.entries()].sort((a, b) => {
          return b[1].Tulos - a[1].Tulos;
        }));
        // io.emit('results-users', JSON.stringify(users.get(obj.LoginName)) );
        socket.broadcast.emit('check-users', JSON.stringify(Array.from(users.entries())) );
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
  		user.results.push(newResult);
  		let updatedUser = await user.save();
  		let foundUpdatedUser = await db.User.findById(updatedUser._id).populate("results");
  		socket.emit("results", foundUpdatedUser);
  	});
  });
}