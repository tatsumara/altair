module.exports = {
	name: 'ping',
	description: 'Pong.',
	usage: 'seriously? its just ping',
	execute(client, message) {
		message.channel.send('Pong.');
	},
};