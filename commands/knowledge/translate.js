const { MessageEmbed } = require('discord.js');
const translate = require('deepl');
const chalk = require('chalk');

// make sure we don't make salad pay money

const dailyLimit = Math.floor(500_000 / 31);
let usedToday = 0;

function invokeAtMidnight(fun) {
	const now = new Date();
	let millisLeft = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0) - now;
	// it's past midnight already, set timer to midnight of next day
	if (millisLeft <= 0) {
		millisLeft += 24 * 3600 * 1000;
	}
	setTimeout(fun, millisLeft);
	console.log(chalk.blue(`[trlt] running hook in ${millisLeft}ms`));
}

function resetUsage() {
	usedToday = 0;
	console.log(chalk.blue('[trlt] usage reset'));
	invokeAtMidnight(resetUsage);
}
invokeAtMidnight(resetUsage);

module.exports = {
	name: 'translate',
	description: 'Translates a string of text into English.',
	usage: 'translate <text>',
	args: true,
	aliases: ['tr'],
	execute(client, message, args, functions) {
		// perform length checks
		const text = args.join(' ');
		if (text.length >= 120) {
			return message.channel.send(functions.simpleEmbed('Text length exceeds 120 characters'));
		}
		if (text.length + usedToday >= dailyLimit) {
			return message.channel.send(functions.simpleEmbed('No characters left for today'));
		}

		// query the API
		translate({
			text,
			target_lang: 'EN',
			auth_key: process.env.DEEPL_API_KEY,
			free_api: true,
		}).then(({ data }) => {
			const { detected_source_language: lang, text: translated } = data.translations[0];
			usedToday += text.length;
			// send response
			const embed = new MessageEmbed()
				.setTitle(`Translated from '${lang}'`)
				.setColor('#0073E6')
				.setDescription(translated)
				.setFooter({ text: `${dailyLimit - usedToday}/${dailyLimit} characters left today` });
			return message.channel.reply({ embeds: [embed] });
		}).catch(err => {
			// send error message
			console.log(chalk.red(`[trlt] failed to translate string '${text}': ${err}'`));
			return message.channel.send(functions.simpleEmbed('Couldn\'t reach translation service.'));
		});
	},
};
