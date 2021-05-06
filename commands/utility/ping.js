module.exports = {
	name: 'ping',
	description: 'Ping! Sends a bit of running information.',
	usage: 'seriously? its just ping',
	execute(client, message) {
		message.channel.send('Pong.');
	},
};