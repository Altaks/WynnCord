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

		let messages = [];

		await fetch(url, settings)
			.then(res => res.json())
			.then(guildData => {
				let msg = ""
				for(let member in guildData.members){
					let temp = guildData.members[member].name + " " + guildData.members[member].rank
					if(msg.length + temp.length >= 2000) {
						messages.push(msg);
						msg = "";
					}
					msg += temp;
				}
				messages.push(msg)
			}
		);
		console.log(messages)
		await interaction.reply({ content: messages[0], ephemeral: false });
		if(messages.length > 1) for(let i = 1; i < messages.length; i++) await interaction.channel.send({ content: messages[i], ephemeral: false });
	},
};