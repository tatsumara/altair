const { MessageEmbed } = require('discord.js');
const got = require('got');
const paginate = require('../../modules/paginate.js');

module.exports = {
	name: 'image',
	description: 'Searches on Google Images.',
	usage: '/image <search query>',
	cooldown: 30,
	slashOptions: [
		{ name: 'query', description: 'query to run', type: 3, required: true },
	],

	async execute(client, interaction, functions) {
		const query = interaction.options.getString('query');
		const safe = !interaction.channel.nsfw ? 'active' : 'off';
		const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_API_ID}&searchType=image&safe=${safe}&q=${query}`;

		const result = await got(url).json();

		if (result.searchInformation.totalResults == 0) {
			return interaction.editReply(functions.simpleEmbed('Nothing found!'));
		}
		const pages = [];
		result.items.forEach((res, i) => {
			const embed = new MessageEmbed()
				.setTitle('Image Search Results:')
				.setDescription(`"${query}"`)
				.setColor(client.colors.blue)
				.setImage(res.link)
				.setFooter({ text: `${i + 1}/${result.items.length} - using Google Images` });
			pages.push(embed);
		});
		paginate(interaction, pages);
	},
};
