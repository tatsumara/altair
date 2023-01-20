const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');

module.exports = {
	name: 'image',
	description: 'Searches on Google Images.',
	usage: '/image <search query>',
	cooldown: 30,
	slashOptions: [
		{ name: 'query', description: 'query to run', type: 3, required: true },
	],

	async execute(client, interaction, functions) {
		const query = interaction.options.getString('query');
		const safe = !interaction.channel.nsfw;
		const { result } = await GOOGLE_IMG_SCRAP({
			search: query,
			safeSearch: safe,
			execute(i) {
				if (!i.url.match('gstatic.com')) return i;
			},
		});
		if (!result[0]) {
			return interaction.editReply(functions.simpleEmbed('Nothing found!'));
		}
		let x = 0;
		const embed = new MessageEmbed()
			.setTitle('Image Search Results:')
			.setDescription(`"${query}"`)
			.setColor(client.colors.blue)
			.setImage(result[x].url)
			.setFooter({ text: `${x + 1}/${result.length} - using Google Images` });

		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton({ label: '◀', customId: 'previous', style: 'SECONDARY' }),
				new MessageButton({ label: '▶', customId: 'next', style: 'SECONDARY' }),
				new MessageButton({ label: '✕', customId: 'close', style: 'DANGER' }),
			);

		const imageMessage = await interaction.editReply({ embeds: [embed], components: [buttons] });
		const filter = i => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		};

		const collector = imageMessage.createMessageComponentCollector({ filter, idle: 60000 });
		collector.on('collect', i => {
			if (i.customId === 'close') return collector.stop();
			else if (x + 1 === result.length) return;
			else if (i.customId === 'next') x++;
			else if (x === 0) return;
			else if (i.customId === 'previous') x--;
			imageMessage.edit({ embeds: [embed.setImage(result[x].url).setFooter({ text: `${x + 1}/${result.length} - using Google Images` })] });
		});
		collector.on('end', (collected, reason) => {
			if (reason === 'idle') imageMessage.edit({ components: [] });
			if (reason === 'user') {
				imageMessage.edit({ embeds: [embed.setImage().setDescription(`"${query}"\nImage search closed.`)] });
				imageMessage.edit({ components: [] });
			}
		});
	},
};
