const fetch = require('node-fetch');

let url = `https://api.wynncraft.com/public_api.php?action=onlinePlayers`;
let settings = { method: "GET" }

let connectedPlayers = []

fetch(url, settings)
	.then(res => res.json())
	.then(data => {
		
	});

console.log(connectedPlayers)