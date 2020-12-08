module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(client, message) {
		message.channel.send('Pong.');
	},
};