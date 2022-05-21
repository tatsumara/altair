const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const images = require('free-google-images');
const rgb2hex = require('rgb2hex');

module.exports = {
	name: 'image',
	description: 'Searches on Google Images.',
	usage: 'image <search query>',
	cooldown: '30',
	args: true,
	aliases: ['im', 'img'],
	async execute(client, message, args, functions) {
		let result = await images.search(args.join(' '), !message.channel.nsfw).catch(() => []);
		if (!result[0]) {
			return message.channel.send(functions.simpleEmbed('Nothing found!'));
		}
		result = result.filter(r => !r.image.url.includes('.svg' || '.SVG'));
		let x = 0;
		const embed = new MessageEmbed()
			.setTitle('Image Search Results:')
			.setDescription(`"${args.join(' ')}"`)
			.setColor('0x' + rgb2hex(result[x].color).hex)
			.setImage(result[x].image.url)
			.setFooter({ text: `${x + 1}/${result.length} - using Google Images` });

		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton({ label: '◀', customId: 'previous', style: 'SECONDARY' }),
				new MessageButton({ label: '▶', customId: 'next', style: 'SECONDARY' }),
				new MessageButton({ label: '✕', customId: 'close', style: 'DANGER' }),
			);

		const imageMessage = await message.reply({ embeds: [embed], components: [buttons] });
		const filter = i => {
			i.deferUpdate();
			return i.user.id === message.author.id;
		};

		const collector = imageMessage.createMessageComponentCollector({ filter, idle: 60000 });
		collector.on('collect', i => {
			switch (i.customId) {
			case 'close':
				collector.stop();
				return;
			case 'next':
				if (x < result.length) x++;
				break;
			case 'previous':
				if (x > 0) x--;
				break;
			default:
				return;
			}
			imageMessage.edit({ embeds: [
				embed.setImage(result[x].image.url)
					.setFooter({ text: `${x + 1}/${result.length} - using Google Images` })
					.setColor('0x' + rgb2hex(result[x].color).hex),
			] });
		});
		collector.on('end', (collected, reason) => {
			if (reason === 'idle') imageMessage.edit({ components: [] });
			if (reason === 'user') {
				imageMessage.edit({ embeds: [embed.setImage().setDescription(`"${args.join(' ')}"\nImage search closed.`)] });
				imageMessage.edit({ components: [] });
			}
		});
	},
};
