module.exports = async (client, slashCommands) => {
	for (const command of slashCommands) {
		command.options = await command.options;
	}
	client.log.info('Calculated slash options.');
	if (process.env.ENVIRONMENT === 'dev') {
		const guild = await client.guilds.fetch(process.env.ADD_SLASH_TO);
		const guildCommands = await guild.commands.fetch();
		if ([...guildCommands.values()].every((command, i) => command.equals(slashCommands[i]))) {
			return client.log.info('Slash commands in dev guild already up to date.');
		}
		guild.commands.set(slashCommands).then(async () => {
			client.log.info(`Registered ${slashCommands.length} slash commands for dev guild.`);
		}).catch(e => {
			client.log.error('Couldn\'t register slash commands for dev guild.', e);
		});
	} else {
		const clientCommands = await client.application.commands.fetch();
		if ([...clientCommands.values()].every((command, i) => command.equals(slashCommands[i]))) {
			return client.log.info('Global slash commands already up to date.');
		}
		client.application.commands.set(slashCommands).then(() => {
			client.log.info(`Registered ${slashCommands.length} slash commands globally.`);
		}).catch(e => {
			client.log.error('Couldn\'t register slash commands globally:', e);
		});
	}
};
