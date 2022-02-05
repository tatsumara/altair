const { MessageEmbed } = require('discord.js');
const got = require('got');
const chalk = require('chalk');

module.exports = {
	name: 'wolframalpha',
	description: 'Queries WolframAlpha.',
	usage: 'wolframalpha <query>',
	args: true,
	disabled: true,
	aliases: ['wolfram', 'walpha'],
	async execute(client, message, args, functions) {
		if (!process.env.WOLFRAM_API_KEY) return console.log(chalk.red('[cmnd] Please input your WolframAlpha API key in the config.'));
		try {
			const res = await got(`http://api.wolframalpha.com/v1/spoken?appid=${process.env.WOLFRAM_API_KEY}&i=${encodeURIComponent(args.join(' '))}`);
			const embed = new MessageEmbed()
				.setColor('#0073E6')
				.setDescription(res.body);
			message.reply({ embeds: [embed] });
		} catch (err) {
			return message.reply(functions.simpleEmbed('No result!'));
		}
	},
};