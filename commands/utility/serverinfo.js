module.exports = {
	name: 'serverinfo',
	description: 'Shows info about the current server.',
	cooldown: '5',
	guildOnly: true,
	aliases: ['si', 'sinfo', 'server'],
	execute(client, message) {
		const embed = {
			color: '#0073E6',
			title: `${message.guild.name}`,
			thumbnail: {
				url: message.guild.iconURL({ size: 4096, dynamic: true }),
			},
			fields: [
				{ name: 'ID', value: message.guild.members.fetch(message.guild.ownerID), inline: true },
				{ name: 'Created at', value: message.guild.createdAt.toDateString(), inline: true },
				{ name: 'Owner', value: message.guild.owner, inline: true },
				{ name: 'Boosts', value: message.guild.premiumSubscriptionCount, inline: true },
				{ name: 'Members', value: message.guild.memberCount, inline: true },
				{ name: 'Features', value: message.guild.features.join(', ') || 'NONE' },
				{ name: 'Roles', value: message.guild.roles.cache.array().join(' '), inline: true },
			],
		};
		message.channel.send({ embed: embed });
	},
};