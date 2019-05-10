"use strict";
const showResults = document.querySelector("#show_results");
const startGameLink = document.querySelector("#start_game");
const form = document.querySelector("#authform");
let usersOl = document.querySelector("#users");
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
		let td3 = document.createElement("td");
		let username = document.createTextNode(result.player.username);
		let points = document.createTextNode(result.score.points);
		const css = "color: indigo; font-size: 22px; transform: scale(1.3);";
		let resultCreated = document.createTextNode(new Date(result.createdAt).toLocaleString("FI-fi"));
		console.log("%c"+result.createdAt, css);
		td.appendChild(username);
		td2.appendChild(points);
		td3.appendChild(resultCreated);
		tr.appendChild(td);
		tr.appendChild(td2);
		tr.appendChild(td3);
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
socket.on('new-user', (user) => {
  console.log(user);
  let obj = JSON.parse(user);
  let node = document.createElement('li'); 
  node.setAttribute('id', obj.user.username);
  let textnode = document.createTextNode('Player: ' + obj.user.username + ', Tulos: ' + obj.Tulos + ', Attemps: ' + obj.Attemps + ', Status: ' + obj.Status); 
  node.appendChild(textnode);  
  usersOl.appendChild(node); 
});
socket.on('check-users', (users) => {
  if (typeof users !== 'undefined') {
  	usersOl.innerHTML = "";
    let obj = new Map(JSON.parse(users));
    for (let user of obj) {
        console.log(user);
        let node = document.createElement('li'); 
        let who = user[1].user.username;
        let className = user[1].user.username;
        node.setAttribute('class', className);
        node.setAttribute('id', user.Loginname);
        let textnode = document.createTextNode(who + ': ' + user[1].user.username + ', Tulos: ' + user[1].Tulos + ', Attemps: ' + user[1].Attemps + ', Status: ' + user[1].Status); 
        node.appendChild(textnode);  
        usersOl.appendChild(node);
    }
  }
});
function sendClick(obj) {
	socket.emit('painallus', { painallus: JSON.stringify(obj) }); 
	return;
}
function sendPoints() {
	let data = {
		user: document.querySelector("#user-info").innerHTML,
		result: result  
	}
	socket.emit("gameover", data);
	return;
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