const { MessageEmbed } = require('discord.js');
const got = require('got');

module.exports = {
	name: 'urban',
	description: 'Searches a word on the UrbanDictionary.',
	usage: 'urban <search term>',
	args: true,
	aliases: ['urb'],
	execute(client, message, args, functions) {
		const term = encodeURIComponent(args.join(' '));
		got(`http://api.urbandictionary.com/v0/define?term=${term}`).then(res =>{
			const result = JSON.parse(res.body);
			// thankfully instead of responding with a 404 this api just sends back nothing, meaning i don't have to catch shit
			if (!result.list[0]) {
				return message.channel.send(functions.simpleEmbed('Nothing found!', ''));
			}
			// might add some more elements to the embed later
			const embed = new MessageEmbed()
				.setTitle(`UrbanDictionary: "${args.join(' ')}"`)
				.setColor('#0073E6')
				.setDescription(result.list[0].definition.replace(/\[/g, '').replace(/\]/g, '') + '\n');
			message.channel.send({ embeds: [embed] });
		});

	},
};