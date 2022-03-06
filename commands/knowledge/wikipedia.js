const wiki = require('wikijs').default;

module.exports = {
	name: 'wikipedia',
	description: 'Fetches an article from Wikipedia.',
	usage: 'wikipedia <search term>',
	args: true,
	aliases: ['wiki', 'wp'],
	async execute(client, message, args, functions) {
		const search = await wiki().search(args.join(' '));
		if (!search.results[0]) return message.channel.send(functions.simpleEmbed('Nothing found!'));
		const page = await wiki().page(search.results[0]);
		message.reply(page.url());
	},
};