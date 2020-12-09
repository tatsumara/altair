const os = require('os');
const Discord = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Ping! Sends a bit of running information.',
	execute(client, message) {
		message.channel.send('Pong.');
		const content = new Discord.MessageEmbed()
			.setColor('#0073E6')
			.setTitle('Altair Environment')
			.setDescription(`Hostname: ${os.hostname()}
			Platform: ${os.platform()}
			Release: ${os.release()}
			Uptime: ${os.uptime()}s
			`);
		message.channel.send(content);
	},
};