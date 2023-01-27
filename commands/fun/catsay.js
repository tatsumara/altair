const got = require('got');

module.exports = {
	name: 'catsay',
	description: 'Let a cat say something.',
	usage: '/catsay <message>',
	slashOptions: [
		{ name: 'message', description: 'what does the cat say??', type: 3, required: true },
	],

	async execute(_client, interaction, functions) {
		const msg = interaction.options.getString('message');
		const url = `https://cataas.com/cat/says/${encodeURIComponent(msg)}`;
		try {
			const stream = got.stream(url);
			await interaction.editReply({ files: [stream] });
		} catch {
			const embed = functions.simpleEmbed('`Cats as a service` is currently unavailable. Please try again later.');
			await interaction.editReply({ embeds: [embed] });
		}
	},
};
