module.exports = {
	name: 'ping',
	description: 'Pong.',
	slashOptions: [],

	async execute(client, interaction) {
		await interaction.editReply('Pong.');
	},
};