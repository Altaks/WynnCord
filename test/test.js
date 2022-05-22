const fetch = require('node-fetch');

let url = `https://api.wynncraft.com/public_api.php?action=guildList`;

let settings = { method: "GET" };

fetch(url, settings)
	.then(res => res.json())
	.then((json) => {
		console.log(json);
	});