const got = require('got');

module.exports = {
	name: 'wolframalpha',
	description: 'Queries WolframAlpha.',
	usage: 'wolframalpha <query>',
	args: true,
	disabled: false,
	aliases: ['wolfram', 'walpha', 'wa'],
	async execute(client, message, args) {
		if (!process.env.WOLFRAM_API_KEY) return client.log.info('Please input your WolframAlpha API key in the config.');
		try {
			const res = await got(`http://api.wolframalpha.com/v1/spoken?appid=${process.env.WOLFRAM_API_KEY}&i=${encodeURIComponent(args.join(' '))}`);
			message.reply(res.body + '.');
		} catch (err) {
			return message.reply('I can\'t answer this.');
		}
	},
};
