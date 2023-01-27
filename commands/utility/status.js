const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'status',
	description: 'Displays some running information about Altair.',
	slashOptions: [],

	async execute(client, interaction, functions) {
		let memberCount = 0;
		client.guilds.cache.forEach(guild => memberCount = memberCount + guild.memberCount);
		const embed = new MessageEmbed()
			.setColor(client.colors.blue)
			.setThumbnail(client.user.avatarURL())
			.setTitle('Altair - Watching the quadrant.')
			.addFields(
				{ name: 'Uptime', value: functions.convertMS(client.uptime), inline: true },
				{ name: 'Ping', value: `${client.ws.ping} ms`, inline: true },
				{ name: 'Architecture', value: process.arch.toString(), inline: true },
				{ name: 'Platform', value: process.platform.toString(), inline: true },
				{ name: 'Memory usage', value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} mb`, inline: true },
				{ name: 'Servers', value: client.guilds.cache.size.toString(), inline: true },
				{ name: 'Users', value: memberCount.toString(), inline: true },
				{ name: 'Commands ran', value: client.commandsRan.toString(), inline: true },
				{ name: 'Prefix', value: process.env.PREFIX, inline: true },
			);
		await interaction.editReply({ embeds: [embed] });
	},
};