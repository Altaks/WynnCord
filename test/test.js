const fetch = require('node-fetch');

let url = `https://api.wynncraft.com/public_api.php?action=guildStats&command=Undergeared`;
let settings = { method: "GET" }

fetch(url, settings)
	.then(res => res.json())
	.then(guildData => {
		for(let member in guildData.members){
			console.log(guildData.members[member].name)
		}
	});