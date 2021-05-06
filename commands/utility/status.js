const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'status',
	owner: true,
	aliases: ['stats', 'stat'],
	execute(client, message, args, functions) {
		let memberCount = 0;
		client.guilds.cache.forEach(guild => memberCount = memberCount + guild.memberCount);
		const uptime = new Date(client.uptime).toString();
		const embed = new MessageEmbed()
			.setColor('#0073E6')
			.setThumbnail(client.user.avatarURL())
			.setTitle('Altair - Watching the quadrant.')
			.addFields(
				{ name: 'Uptime', value: functions.convertMS(client.uptime), inline: true },
				{ name: 'Ping', value: `${client.ws.ping} ms`, inline: true },
				{ name: 'Architecture', value: process.arch, inline: true },
				{ name: 'Platform', value: process.platform, inline: true },
				{ name: 'Memory usage', value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} mb`, inline: true },
				{ name: 'Servers', value: client.guilds.cache.size, inline: true },
				{ name: 'Users', value: memberCount, inline: true },
				{ name: 'Commands ran', value: client.commandsRan, inline: true },
				{ name: 'Prefix', value: process.env.prefix, inline: true },
			);
		message.channel.send(embed);
	},
};