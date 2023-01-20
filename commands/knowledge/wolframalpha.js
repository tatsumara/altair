const got = require('got');

module.exports = {
	name: 'wolfram',
	description: 'Queries WolframAlpha.',
	usage: '/wolfram <query>',
	slashOptions: [
		{ name: 'term', description: 'term to define', type: 3, required: true },
	],

	async execute(client, interaction) {
		const term = interaction.options.getString('term');
		if (!process.env.WOLFRAM_API_KEY) return client.log.error('Please input your WolframAlpha API key in the config.');
		try {
			const res = await got(`http://api.wolframalpha.com/v1/spoken?appid=${process.env.WOLFRAM_API_KEY}&i=${encodeURIComponent(term)}`);
			interaction.editReply(res.body + '.');
		} catch (err) {
			return interaction.editReply('I can\'t answer this.');
		}
	},
};
