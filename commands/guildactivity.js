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
		await interaction.deferReply()

		let searchedGuild = interaction.options.getString("guild");

		let url = `https://api.wynncraft.com/public_api.php?action=guildStats&command=${searchedGuild}`;
		let settings = { method: "GET" };

		// fetch player offsets from last connection
		let playerOffsetsInDays = [];

		await fetch(url, settings)
			.then(res => res.json())
			.then(async guildData => {
				for (let member in guildData.members) {
					// query player information
					await fetch(`https://api.wynncraft.com/v2/player/${guildData.members[member].name}/stats`, settings)
						.then(res => res.json())
						.then(playerData => {
								playerOffsetsInDays.push({
									player: guildData.members[member].name,
									offset: convertDateOffset(playerData.data[0].meta.lastJoin),
								})
							}
						);
				}
			}
		);

		// after getting all offsets, reverse sort the playeroffsets to get the least connected players first
		playerOffsetsInDays = playerOffsetsInDays.sort((a,b) => a.offset - b.offset)
		playerOffsetsInDays = playerOffsetsInDays.reverse()

		// build bot response
		let messages = [];
		let msg = ""

		for(let index in playerOffsetsInDays){
			let temp = magnifyText(playerOffsetsInDays[0].offset.toString().length ,playerOffsetsInDays[index].offset, playerOffsetsInDays[index].player);

			if (msg.length + temp.length >= 2000) {
				messages.push(msg);
				msg = "";
			}
			msg += temp;
		}
		messages.push(msg)

		// send result
		await interaction.editReply({ content: messages[0], ephemeral: false });
		if(messages.length > 1) for(let i = 1; i < messages.length; i++) await interaction.channel.send({ content: messages[i], ephemeral: false });
	},
};

function convertDateOffset(date) {
	return Math.floor(Math.floor((new Date() - new Date(date).getTime()) / 1000) / 86400)
}

function magnifyText(firstOffsetLength, offset, pseudo){
	let msg = "\`" + offset;
	while(msg.length < firstOffsetLength) msg = " " + msg;
	return msg + " days | " + pseudo + "\`\n"
}