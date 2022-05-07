const functions = require('../modules/functions.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		await interaction.deferReply();

		const command = client.commands.get(interaction.commandName);

		try {
			await command.execute(client, interaction, functions);
		} catch (error) {
			client.log.error('Error in \'' + interaction.commandName + '\':', error);
		}
	},
};