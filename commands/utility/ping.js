module.exports = {
	name: 'ping',
	description: 'Pong.',
	usage: 'seriously? its just ping',
	execute(client, message) {
		return message.channel.send('Pong.');
	},
};