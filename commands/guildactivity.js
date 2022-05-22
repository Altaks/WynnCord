const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
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
		if(interaction.replied) return;
		await interaction.deferReply()

		let url = `https://api.wynncraft.com/public_api.php?action=guildList`;

		let settings = { method: "GET" };

		fetch(url, settings)
			.then(res => res.json())
			.then((json) => {
				if(!json.guilds.contains(interaction.options.getString("guild"))){
					interaction.reply("Guild not found");
					return;
				}
			});

		// check if the guild exists
		if(interaction.replied) return;
		url = `https://api.wynncraft.com/public_api.php?action=guildStats&command=${interaction.options.getString("guild")}`;

		fetch(url, settings)
			.then(res => res.json())
			.then((guildData) => {
				const embed = new MessageEmbed()
					.setColor('#8d63d4')
					.setTitle('Guild Activity from ' + guildData.name)
					.setDescription("Prefix: " + guildData.prefix)
					.setFooter({text: "Developed by Altaks", iconURL: "https://login.vivaldi.net/profile/avatar/Altair61000/T4N7hL46wPy9DH3U.jpeg"})
				const playerConnections = [];
				guildData.members.forEach(member => {
					fetch("https://api.wynncraft.com/player/${member.uuid}/stats")
						.then(response => response.json())
						.then(results => playerConnections.push({"playerName": member.name, "lastjoin": results.meta.lastJoin})
					)
				})
				playerConnections.sort((a,b) => b.lastjoin.getTime() - a.lastjoin.getTime())
				for(let player in playerConnections){
					embed.addField(player["playerName"], player["lastjoin"], true)
				}
				embed.setTimestamp()
				interaction.reply(embed);
			});
	},
};