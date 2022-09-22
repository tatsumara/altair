const { MessageEmbed } = require('discord.js');
const got = require('got');

module.exports = {
	name: 'definition',
	description: 'Queries definition of a word.',
	usage: 'definition <word>',
	args: true,
	aliases: ['def', 'define'],
	async execute(client, message, args, functions) {
		if (args.length > 1) {
			return await message.reply(functions.simpleEmbed('Please only run this command with one word.', '', client.colors.yellow));
		}

		try {
			const { body: result } = await got(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${encodeURIComponent(args[0])}`, { responseType: 'json' });
			const embed = new MessageEmbed()
				.setTitle(`Definition for '${args[0]}':`)
				.setColor(client.colors.blue);
			// this isn't the prettiest solution especially because i would like the noun definition to come first, but it works
			result[0].meanings.forEach(meaning => {
				meaning.definitions.slice(0, 3).forEach(definition => {
					embed.addFields(
						{ name: definition.definition, value: `*${definition.example || 'No example.'}*` },
					);
				});
			});
			return await message.reply({ embeds: [embed] });
		} catch {
			return await message.reply(functions.simpleEmbed('Nothing found!'));
		}

	},
};