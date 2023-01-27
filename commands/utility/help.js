const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Lists all commands and basic usage.',
	usage: '/help [command name]',
	slashOptions: [
		{ name: 'command', description: 'command to describe', type: 3, required: false },
	],
	dontDefer: true,

	async execute(client, interaction, functions) {
		const cmd = interaction.options.getString('command');
		const embed = new MessageEmbed()
			.setColor(client.colors.blue);
		if (!cmd) {
			embed.setTitle('Altair Commands');
			const structure = new Map();
			client.commands.filter(c => !c.owner).forEach(c => {
				if (!structure.has(c.category)) structure.set(c.category, []);
				structure.get(c.category).push(c);
			});
			structure.forEach((array, category) => {
				let commandList = '';
				array.forEach(c => commandList += c.name + ' ');
				embed.addFields({ name: category, value:`\`${commandList}\``, inline: true });
			});
			embed.setFooter({ text: 'help <name> to view more about a particular command' });
		} else {
			const name = cmd.toLowerCase();
			// this is probably the only time i'll ever use find(), although it is very nice
			const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {
				await interaction.reply({
					...functions.simpleEmbed('This command doesn\'t exist!', '', client.colors.yellow),
					ephemeral: true,
				});
				return;
			}
			embed.setTitle(`Command "${command.name}"`);

			// this looks ugly but it works, maybe i'll just loop over all available properties of the command and display them like that
			if (command.aliases) embed.addFields({ name: 'Aliases', value: `:1234: \`${command.aliases.join(', ')}\``, inline: true });
			if (command.usage) embed.addFields({ name: 'Usage', value: `:question: \`${command.usage}\``, inline: true });
			if (command.cooldown) embed.addFields({ name: 'Cooldown', value: `:stopwatch: \`${command.cooldown}s\``, inline: true });
			if (command.description) embed.addFields({ name: 'Description', value: ':scroll: ' + command.description });
			if (command.examples) {
				let title = ':interrobang: Usage example';
				if (command.examples.length > 1) title += 's';
				embed.addFields({ name: title, value: command.examples.map(x => `\`${x}\``).join('\n') });
			}
		}

		await interaction.reply({ embeds: [embed] });
	},
};