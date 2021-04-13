const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Lists all commands and basic usage.',
	usage: 'help [command name]',
	aliases: ['commands'],
	execute(client, message, args) {
		const content = new Discord.MessageEmbed()
			.setColor('#0073E6');
		if (!args[0]) {
			// this help command is pretty cool but it looks like shit, and i would love to implement categories
			content.setTitle('Altair Commands');
			client.commands.filter(c => !c.owner).forEach(command => {
				content.addField(command.name, `${command.description}`, true);
			});
		}
		else {
			const name = args[0].toLowerCase();
			// this is probably the only time i'll ever use find(), although it is very nice
			const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {
				message.react('❌');
				return;
			}
			content.setTitle(`Command "${command.name}"`);
			// this looks ugly but it works, maybe i'll just loop over all available properties of the command and display them like that
			if (command.aliases) content.addField('Aliases', `\`${command.aliases.join(', ')}\``, true);
			if (command.usage) content.addField('Usage', `\`${command.usage}\``, true);
			if (command.cooldown) content.addField('Cooldown', `\`${command.cooldown}s\``, true);
			if (command.description) content.addField('Description', command.description);
		}

		message.channel.send(content);
	},
};