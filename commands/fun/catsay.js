const got = require('got');

module.exports = {
	name: 'catsay',
	description: 'Let a cat say something.',
	usage: 'catsay <message>',
	args: true,
	async execute(client, message, args) {
		const msg = args.join(' ');
		const url = `https://cataas.com/cat/says/${encodeURIComponent(msg)}`;
		const stream = got.stream(url);

		await message.reply({ files: [stream] });
	},
};
