const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ownersay',
	owner: true,
	execute(client, message, args, functions) {
		client.guilds.cache.forEach(guild => {
			const channel = guild.channels.cache.find(ch => ch.type === 'text' && ch.name.includes('general' || 'main' || 'lobby' || 'offtopic') || ch.permissionsFor(guild.client.user).has('SEND_MESSAGES'));
			if (!channel.id) return message.channel.send(functions.simpleEmbed(`Couldn't send message to server '${guild.name}'.`, '', '#FFFF00'));
			console.log(channel);
			const embed = new MessageEmbed()
				.setColor('#0073E6')
				.setTitle('Announcement')
				.setThumbnail(client.user.avatarURL())
				.setDescription(args.join(' '))
				.setAuthor(message.author.tag, message.author.displayAvatarURL());
			channel.send(embed);
		});
	},
};