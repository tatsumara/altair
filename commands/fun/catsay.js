const got = require('got');

module.exports = {
	name: 'catsay',
	description: 'Let a cat say something.',
	usage: 'catsay <message>',
	args: true,
	async execute(client, message, args, functions) {
		const msg = args.join(' ');
		const url = `https://cataas.com/cat/says/${encodeURIComponent(msg)}`;
		try {
			const stream = got.stream(url);
			await message.reply({ files: [stream] });
		} catch {
			message.reply(functions.simpleEmbed('`Cats as a service` is currently unavailable. Please try again later.'));
		}
	},
};
