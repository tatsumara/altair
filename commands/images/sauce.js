const got = require('got');
const saucenaoParser = require('../../modules/saucenaoParser.js');
// saucenao is really cool but holy shit its api sucks (thankfully this npm module is good)
module.exports = {
	name: 'source',
	description: 'Finds the source of an image (artwork).',
	usage: 'source [image link, attachment or message reply] ',
	cooldown: '30',
	aliases: ['sauce', 'saucenao'],
	async execute(client, message, args, functions) {
		if (!process.env.SAUCENAO_API_KEY) return client.log.error('Please input your SauceNAO API key in the config.');
		let msg = message;
		if (message.type === 'REPLY') {
			msg = await message.fetchReference();
		}
		let image;
		if (msg.attachments.first()) {
			image = msg.attachments.first().url;
		} else if (args[0] && args[0].startsWith('http')) {
			image = args[0];
		} else if (msg.content.split(/ +/)[0] && msg.content.split(/ +/)[0].startsWith('http')) {
			image = msg.content.split(/ +/)[0];
		}
		if (!image) return message.channel.send(functions.simpleEmbed('Please include an image with your message.', '', client.colors.yellow));

		const { body } = await got(`https://saucenao.com/search.php?api_key=${process.env.SAUCENAO_API_KEY}&output_type=2&db=999&numres=1&url=${encodeURIComponent(image)}`, { responseType: 'json' });
		if (!body.results) return message.channel.send(functions.simpleEmbed('Nothing found!'));
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
		return message.channel.send({ embeds: [embed] });
	},
};