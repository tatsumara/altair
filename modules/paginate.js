const { MessageActionRow, MessageButton } = require('discord.js');
const { simpleEmbed } = require('./functions.js');

module.exports = async (message, pages) => {
	const buttons = new MessageActionRow()
		.addComponents(
			new MessageButton({ label: '◀', customId: 'previous', style: 'SECONDARY' }),
			new MessageButton({ label: '▶', customId: 'next', style: 'SECONDARY' }),
			new MessageButton({ label: '✕', customId: 'close', style: 'DANGER' }),
		);
	const embedMessage = await message.reply({ embeds: [pages[0]], components: [buttons] });
	const filter = i => {
		i.deferUpdate();
		return i.user.id === message.author.id;
	};

	let x = 0;
	const collector = embedMessage.createMessageComponentCollector({ filter, idle: 60000 });
	collector.on('collect', i => {
		switch (i.customId) {
		case 'close':
			collector.stop();
			return;
		case 'next':
			if (x < pages.length - 1) x++;
			break;
		case 'previous':
			if (x > 0) x--;
			break;
		default:
			return;
		}
		embedMessage.edit({ embeds: [pages[x]] });
	});
	collector.on('end', (collected, reason) => {
		if (reason === 'idle') embedMessage.edit({ components: [] });
		if (reason === 'user') {
			embedMessage.edit(simpleEmbed('Closed.'), { components: [] });
		}
	});
};