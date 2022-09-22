const got = require('got');

module.exports = {
	name: 'dadjoke',
	description: 'Tells a dad joke.',
	usage: 'dadjoke',
	args: false,
	aliases: ['joke', 'dad'],
	async execute(client, message) {
		const headers = {
			'Accept': 'text/plain',
		};
		const { body: joke } = await got('https://icanhazdadjoke.com/', { headers });
		return await message.reply(joke);
	},
};
