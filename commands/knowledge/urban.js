const { MessageEmbed } = require('discord.js');
const got = require('got');
const paginate = require('../../modules/paginate');

module.exports = {
	name: 'urban',
	description: 'Searches a word on the UrbanDictionary.',
	usage: '/urban <term>',
	slashOptions: [
		{ name: 'term', description: 'term to define', type: 3, required: true },
	],

	execute(client, interaction, functions) {
		const term = interaction.options.getString('term');

		got(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`).then(res => {
			res = JSON.parse(res.body);
			// thankfully instead of responding with a 404 this api just sends back nothing, meaning i don't have to catch shit
			if (!res.list[0]) {
				return interaction.editReply(functions.simpleEmbed('Nothing found!'));
			}

			res.list.sort((a, b) => b.thumbs_up - a.thumbs_up);
			// might add some more elements to the embed later
			const pages = [];
			res.list.forEach((definition, i) => {
				const embed = new MessageEmbed()
					.setTitle(definition.name || term)
					.setURL(definition.permalink || `http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`)
					.setAuthor({ iconURL: 'https://pbs.twimg.com/profile_images/1149416858426081280/uvwDuyqS_400x400.png', name: 'Urban Dictionary' })
					.setColor(client.colors.blue)
					.setDescription(definition.definition.replace(/\[|\]/g, ''))
					.addFields({ name: 'Example', value: definition.example.replace(/\[|\]/g, '') })
					.setFooter({ text: `${i + 1}/${res.list.length} • ${definition.author} • ${definition.thumbs_up}👍 ` });
				pages.push(embed);
			});
			paginate(interaction, pages);
		});
	},
};