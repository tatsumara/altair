const wiki = require('wikijs').default;

module.exports = {
	name: 'wiki',
	description: 'Fetches an article from Wikipedia.',
	usage: '/wiki <search term>',
	slashOptions: [
		{ name: 'term', description: 'term to define', type: 3, required: true },
	],

	async execute(_client, interaction, functions) {
		const term = interaction.options.getString('term');
		const search = await wiki().search(term);

		if (!search.results[0]) return interaction.editReply(functions.simpleEmbed('Nothing found!'));

		const page = await wiki().page(search.results[0]);
		await interaction.editReply(page.url());
	},
};