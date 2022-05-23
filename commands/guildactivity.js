const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guildactivity')
		.addStringOption(option => option
					.setName("guild")
					.setDescription("Name of the guild you're searching for")
					.setRequired(true)
		)
		.setDescription('Displays a guild activity'),
	async execute(interaction) {

		let searchedGuild = interaction.options.getString("guild");

		let url = `https://api.wynncraft.com/public_api.php?action=guildStats&command=${searchedGuild}`;
		let settings = { method: "GET" };

		// build response msg
		let messages = [];

		await fetch(url, settings)
			.then(res => res.json())
			.then(async guildData => {
				let msg = ""
				for (let member in guildData.members) {

					let state = ""

					// query player information
					await fetch(`https://api.wynncraft.com/v2/player/${guildData.members[member].name}/stats`, settings)
						.then(res => res.json())
						.then(playerData => {
								state = (playerData.data[0].meta.location.online) ? `[${playerData.data[0].meta.location.server}] \u00bb Connected !` : playerData.data[0].meta.lastJoin.toString();
								console.log(playerData.data[0].meta)
							}
						);

					let temp = guildData.members[member].name + " | " + state + "\n"

					if (msg.length + temp.length >= 2000) {
						messages.push(msg);
						msg = "";
					}
					msg += temp;
				}
				messages.push(msg)
			}
		);
		await interaction.reply({ content: messages[0], ephemeral: false });
		if(messages.length > 1) for(let i = 1; i < messages.length; i++) await interaction.channel.send({ content: messages[i], ephemeral: false });
	},
};