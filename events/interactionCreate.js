const { Collection } = require('discord.js');
const functions = require('../modules/functions.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		// i don't like that this is almost a one-for-one copy of `messageCreate`
		// two options:
		//   - leave things as they are, eventually port all commands to slash,
		//     remove legacy code (incl. `messageCreate`)
		//   - if legacy commands are here to stay, it's a good idea to separate
		//     the check logic (timeouts and stuff) out

		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		async function error(title, desc, edit = false) {
			const func = interaction[edit ? 'editReply' : 'reply'].bind(interaction);
			await func({
				...functions.simpleEmbed(title, desc, client.colors.red),
				ephemeral: true,
			});
		}

		if (command.disabled) {
			await error('This command is currently disabled.', '');
			return;
		}
		if (command.owner && interaction.user.id !== process.env.OWNER_ID) {
			await error('You are not permitted to use this command.', '');
			return;
		}

		// cooldown logic
		if (!client.cooldowns.has(command.name)) {
			client.cooldowns.set(command.name, new Collection());
		}
		const timestamps = client.cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 5) * 1000;
		const userId = interaction.user.id;
		if (timestamps.has(userId) && userId !== process.env.OWNER_ID) {
			const expirationTime = timestamps.get(userId) + cooldownAmount;
			const remaining = (expirationTime - Date.now()) / 1000;
			if (remaining > 0) {
				await error('Cooldown', `You hit a rate limit. Retry in ${remaining.toFixed(1)}s`);
				return;
			}
		}
		timestamps.set(userId, Date.now());
		setTimeout(() => timestamps.delete(userId), cooldownAmount);

		try {
			client.log.info(`${interaction.user.tag} ran /${command.name}`);
			if (!command.dontDefer) await interaction.deferReply();
			await command.execute(client, interaction, functions);
			client.commandsRan++;
		} catch (err) {
			client.log.error('Error in \'' + interaction.commandName + '\':', err);
			await error('', `I'm sorry, something went wrong. Please contact <@${process.env.OWNER_ID}> if this issue persists!`, true);
		}
	},
};