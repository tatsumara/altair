const os = require('os');
const Discord = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Ping! Sends a bit of running information.',
	execute(client, message) {
		message.channel.send('Pong.');
	},
};