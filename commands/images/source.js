const got = require('got');
const saucenaoParser = require('../../modules/saucenaoParser.js');
// saucenao is really cool but holy shit its api sucks (thankfully this npm module is good)

module.exports = {
	name: 'source',
	description: 'Finds the source of an image (artwork).',
	usage: 'source [image link or attachment] ',
	cooldown: 30,
	slashOptions: [
		{ name: 'link', description: 'link to find the source of', type: 3, required: false },
		{ name: 'file', description: 'file to find the source of', type: 11, required: false },
	],

	async execute(client, interaction, functions) {
		if (!process.env.SAUCENAO_API_KEY) return client.log.error('Please input your SauceNAO API key in the config.');

		const link = interaction.options.getString('link');
		const file = interaction.options.getAttachment('file');
		if ((!!link ^ !!file) === 0) { // XOR on both options casted to booleans
			return interaction.editReply('You must specify a link OR a file');
		}

		const url = link ?? file.url;
		const { body } = await got(`https://saucenao.com/search.php?api_key=${process.env.SAUCENAO_API_KEY}&output_type=2&db=999&numres=1&url=${encodeURIComponent(url)}`, { responseType: 'json' });
		if (!body.results) return interaction.editReply(functions.simpleEmbed('Nothing found!'));
		const result = saucenaoParser(client, body.results[0]);

		const embed = {
			color: result.color,
			title: result.embedTitle,
			url: result.source,
			thumbnail: {
				url: result.thumbnail,
			},
			description: `Title: ${result.title}\n Author: ${result.author}`,
			footer: {
				text: `Confidence: ${result.confidence}%`,
			},
		};

		return interaction.editReply({ embeds: [embed] });
	},
};