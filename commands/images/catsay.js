const got = require('got');

module.exports = {
	name: 'catsay',
	description: 'Let a cat say something.',
	usage: 'catsay <message>',
	async execute(client, message, args, functions) {
		if (args.length < 1) {
			return message.channel.send(
				functions.simpleEmbed('You need to specify a message!'),
			);
		}

		const msg = args.join(' ');
		const url = `https://cataas.com/cat/says/${encodeURIComponent(msg)}`;
		const stream = got.stream(url);

		await message.reply({ files: [stream] });
	},
};
