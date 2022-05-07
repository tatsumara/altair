module.exports = {
	name: 'restart',
	description: 'Restarts the bot.',
	owner: true,
	slashOptions: [],
	async execute(client, interaction) {
		await interaction.editReply(':wave: bye bye!');
		client.log.success('Forcing restart of Altair.');
		client.destroy();
	},
};