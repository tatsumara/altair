const { MessageEmbed } = require('discord.js');
const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');
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
		const safe = !interaction.channel.nsfw;
		const { result } = await GOOGLE_IMG_SCRAP({
			search: query,
			safeSearch: safe,
			execute(i) {
				if (!i.url.match('gstatic.com')) return i;
			},
		});
		if (!result[0]) {
			return interaction.editReply(functions.simpleEmbed('Nothing found!'));
		}
		const pages = [];
		result.forEach((res, i) => {
			const embed = new MessageEmbed()
				.setTitle('Image Search Results:')
				.setDescription(`"${query}"`)
				.setColor(client.colors.blue)
				.setImage(res.url)
				.setFooter({ text: `${i + 1}/${result.length} - using Google Images` });
			pages.push(embed);
		});
		paginate(interaction, pages);
	},
};
