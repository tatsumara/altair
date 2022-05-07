const { MessageEmbed } = require('discord.js');
const got = require('got');

module.exports = {
	name: 'urban',
	description: 'Searches a word on the UrbanDictionary.',
	usage: '/urban <term>',
	slashOptions: [
		{ name: 'term', description: 'term to define', type: 3, required: true },
	],
	execute(client, interaction, functions) {
		const term = interaction.options.getString('term');

		got(`http://api.urbandictionary.com/v0/define?term=${term}`).then(res => {
			const result = JSON.parse(res.body);
			// thankfully instead of responding with a 404 this api just sends back nothing, meaning i don't have to catch shit
			if (!result.list[0]) {
				return interaction.editReply(functions.simpleEmbed('Nothing found!'));
			}
			// might add some more elements to the embed later
			const embed = new MessageEmbed()
				.setTitle(`UrbanDictionary: "${term}"`)
				.setColor(client.colors.blue)
				.setDescription(result.list[0].definition.replace(/\[/g, '').replace(/\]/g, '') + '\n');
			return interaction.editReply({ embeds: [embed] });
		});

	},
};