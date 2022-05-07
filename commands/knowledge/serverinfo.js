module.exports = {
	name: 'serverinfo',
	description: 'Shows info about the current server.',
	slashOptions: [],
	async execute(client, interaction) {
		const guild = interaction.guild;
		const embed = {
			color: client.colors.blue,
			title: `${guild.name}`,
			thumbnail: {
				url: guild.iconURL({ size: 4096, dynamic: true }),
			},
			fields: [
				{ name: 'ID', value: guild.id.toString(), inline: true },
				{ name: 'Created at', value: guild.createdAt.toDateString(), inline: true },
				{ name: 'Owner', value: `${await guild.fetchOwner()}`, inline: true },
				{ name: 'Boosts', value: guild.premiumSubscriptionCount.toString(), inline: true },
				{ name: 'Members', value: guild.memberCount.toString(), inline: true },
				{ name: 'Features', value: guild.features.join(', ') || 'NONE', inline: true },
			],
		};
		return interaction.editReply({ embeds: [embed] });
	},
};