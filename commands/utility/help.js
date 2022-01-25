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
			embed.setTitle('Altair Commands');
			const structure = new Map();
			client.commands.filter(c => !c.owner).forEach(c => {
				if (!structure.has(c.category)) structure.set(c.category, []);
				structure.get(c.category).push(c);
			});
			structure.forEach((array, category) => {
				let commandList = '';
				array.forEach(c => commandList += c.name + ' ');
				embed.addField(category, `\`${commandList}\``, true);
			});
			embed.setFooter({ text: 'help <name> to view more about a particular command' });
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

		return message.channel.send({ embeds: [embed] });
	},
};