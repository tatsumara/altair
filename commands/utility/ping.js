module.exports = {
	name: 'ping',
	description: 'Pong.',
	usage: 'seriously? its just ping',
	async execute(client, message) {
		return await message.channel.send('Pong.');
	},
};