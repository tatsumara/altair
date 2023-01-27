const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name: 'serverinfo',
	description: 'Shows info about the current server.',
	guildOnly: true,
	slashOptions: [],

	async execute(client, interaction) {
		const mainEmbed = new MessageEmbed()
			.setColor(client.colors.blue)
			.setTitle(interaction.guild.name)
			.setThumbnail(interaction.guild.iconURL({ size: 4096, dynamic: true }))
			.addFields([
				{ name: 'ID', value: interaction.guild.id.toString(), inline: true },
				{ name: 'Created at', value: interaction.guild.createdAt.toDateString(), inline: true },
				{ name: 'Owner', value: `${await interaction.guild.fetchOwner()}`, inline: true },
				{ name: 'Boosts', value: interaction.guild.premiumSubscriptionCount.toString(), inline: true },
				{ name: 'Members', value: interaction.guild.memberCount.toString(), inline: true },
				{ name: 'Features', value: interaction.guild.features?.join(', ') || 'NONE' },
			]);

		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton({ label: 'Server Icon', customId: 'icon', style: 'SECONDARY' }),
			);
		if (interaction.guild.banner) buttons.addComponents(new MessageButton({ label: 'Banner', customId: 'banner', style: 'SECONDARY' }));

		const msg = await interaction.editReply({ embeds: [mainEmbed], components: [buttons] });
		const filter = i => {
			i.deferUpdate();
			return i.user.id === interaction.author_id;
		};
		const collector = msg.createMessageComponentCollector({ filter, idle: 30000 });

		collector.on('collect', i => {
			if (i.customId === 'icon') {
				const iconURL = interaction.guild.iconURL({ size: 4096, dynamic: true });
				const iconEmbed = new MessageEmbed()
					.setColor(client.colors.blue)
					.setTitle('Open Original')
					.setURL(iconURL)
					.setImage(iconURL);
				msg.edit({ embeds: [iconEmbed] });
			} else {
				const bannerURL = interaction.guild.bannerURL({ size: 4096, dynamic: true });
				const bannerEmbed = new MessageEmbed()
					.setColor(client.colors.blue)
					.setTitle('Open Original')
					.setURL(bannerURL)
					.setImage(bannerURL);
				msg.edit({ embeds: [bannerEmbed] });
			}
		});
		collector.on('end', (collected, reason) => {
			if (reason === 'idle') msg.edit({ components: [] });
		});
	},
};