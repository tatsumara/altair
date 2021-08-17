const { MessageEmbed } = require('discord.js');
const got = require('got');

module.exports = {
	name: 'wolframalpha',
	description: 'Queries WolframAlpha.',
	usage: 'wolframalpha <query>',
	args: true,
	aliases: ['wolfram', 'walpha'],
	execute(client, message, args, functions) {
		got(`http://api.wolframalpha.com/v2/query?appid=${process.env.wolframAPIKey}&output=json&input=${encodeURIComponent(args.join(' '))}`, { responseType: 'json' }).then(res =>{
			const pods = res.body.queryresult.pods;
			if (!pods) return message.channel.send(functions.simpleEmbed('No result!', ''));

			const embeds = [];
			pods.forEach(pod => {
				const embed = new MessageEmbed()
					.setTitle(pod.title)
					.setDescription(pod.subpods[0].plaintext);
				if (!embed.description) return;
				embeds.push(embed);
			});
			message.channel.send({ embeds: embeds });
		});
	},
};