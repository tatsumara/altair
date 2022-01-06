const ytsr = require('ytsr');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name: 'youtube',
	description: 'Searches for a video on YouTube.',
	usage: 'youtube <search term>',
	cooldown: '15',
	args: true,
	aliases: ['yt', 'ytube'],
	async execute(client, message, args, functions) {
		const result = await ytsr(args.join(' '), { limit: 20 });
		if (!result.items[0]) {
			return message.channel.send(functions.simpleEmbed('Nothing found!'));
		}
		let x = 0;

		const results = result.items.filter(item => item.type === 'channel' | item.type === 'video' | item.type === 'playlist');

		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton({ label: 'Previous', customId: 'previous', style: 'SECONDARY' }),
				new MessageButton({ label: 'Next', customId: 'next', style: 'SECONDARY' }),
			);

		const youtubeMessage = await message.reply({ content: `#1/${results.length} | ${results[x].url}`, components: [buttons] });
		const filter = i => {
			i.deferUpdate();
			return i.user.id === message.author.id;
		};
		const collector = youtubeMessage.createMessageComponentCollector({ filter, time: 30000 });
		collector.on('collect', i => {
			if (i.customId === 'next') x++;
			else if (x === 0) return;
			else if (i.customId === 'previous') x--;
			if (x === results.length) {
				x--;
				return;
			}
			youtubeMessage.edit({ content: `#${x + 1}/${results.length} | ${results[x].url}` });
			collector.resetTimer();
		});
		collector.on('end', (collected, reason) => {
			if (reason !== 'messageDelete') youtubeMessage.edit({ components: [] });
		});
	},
};