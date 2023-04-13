const ytsr = require('youtube-sr').default;
const paginate = require('../../modules/paginate.js');

module.exports = {
	name: 'youtube',
	description: 'Searches for a video on YouTube.',
	usage: '/youtube <search term>',
	cooldown: 15,
	slashOptions: [
		{ name: 'term', description: 'YouTube search term', type: 3, required: true },
	],

	async execute(_client, interaction, functions) {
		const term = interaction.options.getString('term');
		let result = await ytsr.search(term, { limit: 20 });
		if (!result[0]) {
			return interaction.editReply(functions.simpleEmbed('Nothing found!'));
		}
		result = result.map(r => r.url);

		const contents = [];
		result.forEach((res, i) => {
			contents.push(`${i + 1}/${result.length} | ${res}`);
		});
		paginate(interaction, undefined, contents);
	},
};