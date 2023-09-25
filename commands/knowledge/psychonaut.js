const { MessageEmbed } = require('discord.js');
const got = require('got');
const paginate = require('../../modules/paginate.js');

module.exports = {
	name: 'psychonaut',
	description: 'Searches up a drug on PsychonautWiki.',
	usage: 'psychonaut <name>',
	cooldown: 15,
	slashOptions: [
		{ name: 'query', description: 'search term', type: 3, required: true },
	],

	async execute(_client, interaction, functions) {
		const query = `
		query ($search: String) {
			substances (query: $search) {
				name
				url
				images {
					thumb
				}
			}
		}
		`;

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				query: query,
				variables: { search: interaction.options.getString('query') },
			}),
		};

		let result = await got ('https://api.psychonautwiki.org/', options);
		result = JSON.parse(result.body).data;
		if (!result.substances[0]) {
			return await interaction.editReply(functions.simpleEmbed('Nothing found!'));
		}

		const pages = [];
		result.substances.forEach((substance) => {
			const embed = new MessageEmbed()
				.setTitle(substance.name)
				.setURL(substance.url)
				.setThumbnail(substance.images[0].thumb);
			pages.push(embed);
		});
		paginate(interaction, pages);
	},
};