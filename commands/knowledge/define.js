const { MessageEmbed } = require('discord.js');
const got = require('got');

module.exports = {
	name: 'define',
	description: 'Queries definition of a word.',
	usage: '/define <word>',
	slashOptions: [
		{ name: 'term', description: 'term to define', type: 3, required: true },
	],
	dontDefer: true,

	async execute(client, interaction, functions) {
		const term = interaction.options.getString('term');
		if (term.search(' ') > -1) {
			return interaction.reply({
				...functions.simpleEmbed('Please only run this command with one word.', '', client.colors.yellow),
				ephemeral: true,
			});
		}

		await interaction.deferReply();
		try {
			await got(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${term}`).then(res => {
				const result = JSON.parse(res.body)[0];
				const embed = new MessageEmbed().setTitle(`Definition for '${term}':`).setColor(client.colors.blue);
				// this isn't the prettiest solution especially because i would like the noun definition to come first, but it works
				result.meanings.forEach(meaning => {
					meaning.definitions.slice(0, 3).forEach(definition => {
						embed.addFields(
							{ name: definition.definition, value: `*${definition.example || 'No example.'}*` },
						);
					});
				});
				interaction.editReply({ embeds: [embed] });
			});
		} catch {
			return interaction.editReply(functions.simpleEmbed('Nothing found!'));
		}

	},
};