const got = require('got');
const chalk = require('chalk');
const saucenaoParser = require('../../modules/saucenaoParser.js');
// saucenao is really cool but holy shit its api sucks (thankfully this npm module is good)
module.exports = {
	name: 'source',
	description: 'Finds the source of an image (artwork).',
	usage: 'source [image link or attachment] (If used without arguments, the last recently sent image will be used.)',
	cooldown: '30',
	aliases: ['sauce', 'saucenao'],
	async execute(client, message, args, functions) {
		if (!process.env.saucenaoAPIKey) return console.log(chalk.red('[cmnd] Please input your SauceNAO API key in the config.'));
		let image = '';
		// with v13.0 of discord.js i'll also implement message reply handling
		if (message.attachments.first()) {
			image = message.attachments.first().url;
		} else if (args[0] && args[0].startsWith('http')) {
			image = args[0];
		} else {
			const messages = await message.channel.messages.fetch({ limit: 15 });
			const found = messages.find(msg => msg.attachments.first());
			if (found) image = found.attachments.first().url;
			if (!image) return message.channel.send(functions.simpleEmbed('Please include an image with your message.', '', '#FFA500'));
		}

		const failEmbed = {
			title: 'Nothing found!',
		};

		const { body } = await got(`https://saucenao.com/search.php?api_key=${process.env.saucenaoAPIKey}&output_type=2&db=999&numres=10&url=${encodeURIComponent(image)}`, { responseType: 'json' });
		if (!body.results) return message.channel.send({ embed: failEmbed });
		const result = saucenaoParser(body.results[0]);

		if (result.confidence < 40.0) {
			return message.channel.send({ embed: failEmbed });
		}
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
		message.channel.send({ embed: embed });
	},
};