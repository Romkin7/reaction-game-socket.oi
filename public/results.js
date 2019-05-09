"use strict";
const showResults = document.querySelector("#show_results");
const startGameLink = document.querySelector("#start_game");
const form = document.querySelector("#authform");
let submitBtn = document.querySelector("#submitBtn");
let gameoverH3 = document.querySelector("#gameoverh3");
let playerResults = document.querySelector("#player_results");
let resultsTable = document.querySelector("#resultsTable");
const socket = io();
startGameLink.addEventListener("click", function(event) {
	resultsSection.classList.add("display-none");
	startScreenSection.classList.remove("display-none");
	gameOverSection.classList.add("display-none");
	gameSection.classList.add("display-none");
});
showResults.addEventListener("click", function(event) {
	socket.emit("get-results");
});
socket.on("all-results", function(results) {
	resultsSection.classList.remove("display-none");
	startScreenSection.classList.add("display-none");
	gameOverSection.classList.add("display-none");
	gameSection.classList.add("display-none");
	resultsTable.innerHTML = "";
	results.forEach(function(result) {
		let tr = document.createElement("tr");
		let td = document.createElement("td");
		let td2 = document.createElement("td");
		let username = document.createTextNode(result.player.username);
		let points = document.createTextNode(result.score.points);
		td.appendChild(username);
		td2.appendChild(points);
		tr.appendChild(td);
		tr.appendChild(td2);
		resultsTable.appendChild(tr);
	});
});
authform.addEventListener("submit", (event) => {
	event.preventDefault();
	let username = document.querySelector("#username").value;
	if(!/^[A-ZÅÄÖ]{1}?[a-zäöå0-9]{2,15}$/.test(username)) {
		document.querySelector("#messageContainer").classList.remove("display-none");
		return document.querySelector("#usernameValidationError").innerHTML = "Käyttäjänimi "+ username+" ei kelpaa. Käyttäjänimen täytyy alkaa isolla kirjaimella ja se voi sisältää pieniä kirjaimia ja numeroita 0-9 välillä.";
	} else {
		document.querySelector("#messageContainer").classList.add("display-none");
		document.querySelector("#usernameValidationError").innerHTML = "";
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
	playerResults.innerHTML = "";
	user.results.forEach(function(result) {
		let li = document.createElement("li");
		var text = document.createTextNode(result.score.points);
		li.appendChild(text);
		playerResults.appendChild(li);
	});
});