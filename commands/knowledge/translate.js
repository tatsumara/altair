const { MessageEmbed } = require('discord.js');
const translate = require('deepl');
const chalk = require('chalk');

module.exports = {
	name: 'translate',
	description: 'Translates a string of text into English.',
	usage: 'translate <text>',
	args: true,
	aliases: ['tr'],
	execute(client, message, args, functions) {
		if (!process.env.DEEPL_API_KEY) return console.log(chalk.red('[cmnd] Please input your DeepL API key in the config.'));
		// perform length checks
		const text = args.join(' ');
		if (text.length >= 120) {
			return message.channel.send(functions.simpleEmbed('Text length exceeds 120 characters.'));
		}

		// query the API
		translate({
			text,
			target_lang: 'EN',
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
