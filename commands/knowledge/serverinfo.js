const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name: 'serverinfo',
	description: 'Shows info about the current server.',
	guildOnly: true,
	aliases: ['si', 'sinfo', 'server'],
	async execute(client, message) {
		const mainEmbed = new MessageEmbed()
			.setColor(client.colors.blue)
			.setTitle(message.guild.name)
			.setThumbnail(message.guild.iconURL({ size: 4096, dynamic: true }))
			.addFields([
				{ name: 'ID', value: message.guild.id.toString(), inline: true },
				{ name: 'Created at', value: message.guild.createdAt.toDateString(), inline: true },
				{ name: 'Owner', value: `${await message.guild.fetchOwner()}`, inline: true },
				{ name: 'Boosts', value: message.guild.premiumSubscriptionCount.toString(), inline: true },
				{ name: 'Members', value: message.guild.memberCount.toString(), inline: true },
				{ name: 'Features', value: message.guild.features?.join(', ') || 'NONE' },
			]);

		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton({ label: 'Server Icon', customId: 'icon', style: 'SECONDARY' }),
			);
		if (message.guild.banner) buttons.addComponents(new MessageButton({ label: 'Banner', customId: 'banner', style: 'SECONDARY' }));

		const msg = await message.reply({ embeds: [mainEmbed], components: [buttons] });
		const filter = i => {
			i.deferUpdate();
			return i.user.id === message.author.id;
		};
		const collector = msg.createMessageComponentCollector({ filter, idle: 30000 });

		collector.on('collect', i => {
			if (i.customId === 'icon') {
				const iconURL = message.guild.iconURL({ size: 4096, dynamic: true });
				const iconEmbed = new MessageEmbed()
					.setColor(client.colors.blue)
					.setTitle('Open Original')
					.setURL(iconURL)
					.setImage(iconURL);
				msg.edit({ embeds: [iconEmbed] });
			} else {
				const bannerURL = message.guild.bannerURL({ size: 4096, dynamic: true });
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