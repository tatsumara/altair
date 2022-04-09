module.exports = {
	name: 'serverinfo',
	description: 'Shows info about the current server.',
	guildOnly: true,
	aliases: ['si', 'sinfo', 'server'],
	async execute(client, message) {
		const embed = {
			color: '#0073E6',
			title: `${message.guild.name}`,
			thumbnail: {
				url: message.guild.iconURL({ size: 4096, dynamic: true }),
			},
			fields: [
				{ name: 'ID', value: message.guild.id.toString(), inline: true },
				{ name: 'Created at', value: message.guild.createdAt.toDateString(), inline: true },
				{ name: 'Owner', value: `${await message.guild.fetchOwner()}`, inline: true },
				{ name: 'Boosts', value: message.guild.premiumSubscriptionCount.toString(), inline: true },
				{ name: 'Members', value: message.guild.memberCount.toString(), inline: true },
				{ name: 'Features', value: message.guild.features.join(', ') || 'NONE', inline: true },
			],
		};
		return message.channel.send({ embeds: [embed] });
	},
};