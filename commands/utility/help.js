const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Lists all commands and basic usage.',
	usage: 'help [command name]',
	aliases: ['commands'],
	execute(client, message, args, functions) {
		const embed = new MessageEmbed()
			.setColor('#0073E6');
		if (!args[0]) {
			// this help command is pretty cool but it looks like shit, and i would love to implement categories
			embed.setTitle('Altair Commands');
			client.commands.filter(c => !c.owner).forEach(command => {
				embed.addField(command.name, `${command.description}`, true);
			});
		} else {
			const name = args[0].toLowerCase();
			// this is probably the only time i'll ever use find(), although it is very nice
			const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {
				return message.channel.send(functions.simpleEmbed('This command doesn\'t exist!', '', '#FFA500'));
			}
			embed.setTitle(`Command "${command.name}"`);
			// this looks ugly but it works, maybe i'll just loop over all available properties of the command and display them like that
			if (command.aliases) embed.addField('Aliases', `\`${command.aliases.join(', ')}\``, true);
			if (command.usage) embed.addField('Usage', `\`${command.usage}\``, true);
			if (command.cooldown) embed.addField('Cooldown', `\`${command.cooldown}s\``, true);
			if (command.description) embed.addField('Description', command.description);
		}

		message.channel.send({ embeds: [embed] });
	},
};