const { MessageEmbed } = require('discord.js');
const translate = require('deepl');
const chalk = require('chalk');

module.exports = {
	name: 'translate',
	description: 'Translates a string of text into English.',
	usage: 'translate [!<target language>] <text>',
	cooldown: '10',
	args: true,
	aliases: ['tr'],
	execute(client, message, args, functions) {
		// check DEEPL_API_KEY
		if (!process.env.DEEPL_API_KEY) {
			return console.log(chalk.red('[cmnd] Please input your DeepL API key in the config.'));
		}

		// choose target language
		let target = 'EN';
		if (args[0].startsWith('!')) {
			target = args[0].slice(1).toUpperCase();
			[_, ...args] = args; // remove first element
		}

		// check length
		const text = args.join(' ');
		if (text.length >= 120) {
			return message.channel.send(functions.simpleEmbed('Text length exceeds 120 characters.'));
		}

		// query the API
		translate({
			text,
			target_lang: target,
			auth_key: process.env.DEEPL_API_KEY,
			free_api: true,
		}).then(({ data }) => {
			const { detected_source_language: lang, text: translated } = data.translations[0];
			// send response
			const embed = new MessageEmbed()
				.setTitle(`Translated from '${lang}'`)
				.setColor('#0073E6')
				.setDescription(translated);
			return message.reply({ embeds: [embed] });
		}).catch(err => {
			// send error message
			console.log(chalk.red(`[trlt] failed to translate string '${text}': ${err}'`));
			return message.channel.send(functions.simpleEmbed('Couldn\'t reach translation service.'));
		});
	},
};
