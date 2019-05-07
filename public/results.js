"use strict";
const form = document.querySelector("#authform");
let submitBtn = document.querySelector("#submitBtn");
let gameoverH3 = document.querySelector("#gameoverh3");
let playerResults = document.querySelector("#player_results");
const socket = io();
socket.on("all-results", function() {
	
});
authform.addEventListener("submit", (event) => {
	event.preventDefault();
	let username = document.querySelector("#username").value;
	if(!/^[A-ZÅÄÖ]{1}?[a-zäöå0-9]{2,15}$/.test(username)) {
		return console.error("Käyttäjänimi "+ username+" ei kelpaa. Käyttäjänimen täytyy alkaa isolla kirjaimella ja se voi sisältää pieniä kirjaimia ja numeroita 0-9 välillä.");
	} else {
		let data = {
			username: username
		};
		socket.emit("username", data);
	}
});
socket.on("startgame", function(user) {
	startGame(user);
});
function sendPoints() {
	let data = {
		user: document.querySelector("#user-info").innerHTML,
		result: result  
	}
	socket.emit("gameover", data);
}
socket.on("results", function(user) {
	gameoverH3.innerHTML = user.username;
	console.log(gameoverH3);
	user.results.forEach(function(result) {
		console.log(result);
		let li = document.createElement("li");
		var text = document.createTextNode(result.score.points);
		li.appendChild(text);
		playerResults.appendChild(li);
	});
});