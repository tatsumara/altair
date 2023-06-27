const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = async (client, interaction, baseURL) => {
	const sizeOptions = [
		{ label: '4096px', value: '4096', default: true },
		{ label: '2048px', value: '2048' },
		{ label: '1024px', value: '1024' },
		{ label: '512px', value: '512' },
		{ label: '256px', value: '256' },
		{ label: '128px', value: '128' },
		{ label: '64px', value: '64' },
		{ label: '32px', value: '32' },
		{ label: '16px', value: '16' },
	];

	const rows = [
		new MessageActionRow().setComponents([ new MessageSelectMenu().setCustomId('size').setOptions(sizeOptions) ]),
	];

	const embed = new MessageEmbed()
		.setColor(client.colors.blue)
		.setImage(`${baseURL}?size=${sizeOptions[0].value}`)
		.setTitle('Open original')
		.setURL(`${baseURL}?size=${sizeOptions[0].value}`);
	const msg = await interaction.editReply({
		embeds: [embed],
		components: rows,
	});

	const filter = i => {
		i.deferUpdate();
		return i.user.id === interaction.user.id;
	};

	const collector = msg.createMessageComponentCollector({ filter, idle: 30000 });
	collector.on('collect', i => {
		if (i.customId === 'size') {
			sizeOptions.find(option => option.default).default = false;
			sizeOptions.find(option => option.value === i.values[0]).default = true;
			rows[0].components[0].setOptions(sizeOptions);
			const url = `${baseURL}?size=${i.values[0]}`;
			msg.edit({ embeds: [embed.setImage(url).setTitle('Open original').setURL(url)], components: rows });
		}
	});
	collector.on('end', (collected, reason) => {
		if (reason === 'idle') msg.edit({ components: [] });
	});
};