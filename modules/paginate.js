const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = async (interaction, pages = [], contents = []) => {
	if (pages[0] && contents[0] && pages.length !== contents.length) {
		throw new Error('pages and contents must have the same amount of entries.');
	}

	const buttons = new MessageActionRow()
		.addComponents(
			new MessageButton({ label: '◀', customId: 'previous', style: 'SECONDARY' }),
			new MessageButton({ label: '▶', customId: 'next', style: 'SECONDARY' }),
			new MessageButton({ label: '✕', customId: 'close', style: 'DANGER' }),
		);
	const embedMessage = await interaction.editReply({ embeds: pages[0] ? [pages[0]] : [], content: contents[0] ? contents[0] : null, components: [buttons] });
	const filter = i => {
		i.deferUpdate();
		return i.user.id === interaction.user.id;
	};

	let x = 0;
	const collector = embedMessage.createMessageComponentCollector({ filter, idle: 60000 });
	collector.on('collect', i => {
		switch (i.customId) {
		case 'close':
			collector.stop();
			return;
		case 'next':
			if (x < pages.length - 1 && x < contents.length - 1) {
				x++;
			} else if (x < pages.length - 1) {
				x++;
			} else if (x < contents.length - 1) {
				x++;
			}
			break;
		case 'previous':
			if (x > 0) x--;
			break;
		default:
			return;
		}
		interaction.editReply({ embeds: pages[x] ? [pages[x]] : [], content: contents[x] ? contents[x] : null });
	});
	collector.on('end', (collected, reason) => {
		if (reason === 'idle') interaction.editReply({ components: [] });
		if (reason === 'user') {
			interaction.editReply({ embeds: [new MessageEmbed().setTitle('Closed.')], content: null, components: [] });
		}
	});
};