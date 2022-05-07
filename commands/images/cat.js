const got = require('got');

module.exports = {
	name: 'cat',
	description: 'Sends an image of a cat.',
	slashOptions: [],
	async execute(client, interaction) {
		const stream = got.stream('https://thiscatdoesnotexist.com/');
		await interaction.editReply({ files: [stream] });
	},
};