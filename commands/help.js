const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Lists all commands and basic usage.',
	aliases: ['commands'],
	usage: 'help [command name]',
	execute(client, message, args) {
		const content = new Discord.MessageEmbed()
			.setColor('#0073E6');
		if (!args.length) {
			content.setTitle('Altair Commands');
			client.commands.forEach(command => {
				content.addField(command.name, `\`${command.description}\``, true);
			});
		}
		else {
			const name = args[0].toLowerCase();
			const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {
				message.react('❌');
				return;
			}
			content.setTitle(`Command "${command.name}"`);
			if (command.aliases) content.addField('Aliases', `\`${command.aliases.join(', ')}\``, true);
			if (command.usage) content.addField('Usage', `\`${command.usage}\``, true);
			if (command.description) content.addField('Description', command.description);
		}

		message.channel.send(content);
	},
};