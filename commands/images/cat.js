const got = require('got');

module.exports = {
	name: 'cat',
	description: 'Sends an image of a cat.',
	guildOnly: false,
	async execute(client, message) {
		const stream = got.stream('https://thiscatdoesnotexist.com/');
		await message.reply({ files: [stream] });
	},
};