const { MessageEmbed } = require('discord.js');
const got = require('got');
const chalk = require('chalk');

module.exports = {
	name: 'wolframalpha',
	description: 'Queries WolframAlpha.',
	usage: 'wolframalpha <query>',
	args: true,
	aliases: ['wolfram', 'walpha'],
	execute(client, message, args, functions) {
		if (!process.env.WOLFRAM_API_KEY) return console.log(chalk.red('[cmnd] Please input your WolframAlpha API key in the config.'));
		got(`http://api.wolframalpha.com/v2/query?appid=${process.env.WOLFRAM_API_KEY}&output=json&input=${encodeURIComponent(args.join(' '))}`, { responseType: 'json' }).then(res =>{
			const pods = res.body.queryresult.pods;
			if (!pods) return message.channel.send(functions.simpleEmbed('No result!', ''));

			const embed = new MessageEmbed()
				.setColor('#0073E6');

			pods.forEach(pod => {
				if (!pod.subpods[0].plaintext) return;
				if (pod.title.includes('Result')) {
					embed.addField(pod.title, pod.subpods[0].plaintext);
					return;
				}
				embed.addField(pod.title, pod.subpods[0].plaintext, true);
			});
			message.reply({ embeds: [embed] });
		});
	},
};