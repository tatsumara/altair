const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const gis = require('g-i-s');
// g-i-s is an awesome library!
module.exports = {
	name: 'image',
	description: 'Searches on Google Images.',
	usage: 'image <search query> (You can navigate the results by sending b/n for next and back respectively!)',
	cooldown: '15',
	args: true,
	aliases: ['im', 'img'],
	execute(client, message, args, functions) {
		const query = args.join(' ');
		let safe = '';
		if (!message.channel.nsfw) {
			safe = '&safe=active';
		}
		gis({ searchTerm: query, queryStringAddition: safe }, async (error, results) => {
			if (!results[0]) {
				return message.channel.send(functions.simpleEmbed('Nothing found!'));
			}
			results = results.filter(image => !image.url.endsWith('.svg'));
			let x = 0;
			const embed = new MessageEmbed()
				.setTitle('Image Search Results:')
				.setDescription(`"${query}"`)
				.setColor('#0073E6')
				.setImage(results[x].url)
				.setFooter(`Page ${x + 1}`);

			const buttons = new MessageActionRow()
				.addComponents(
					new MessageButton({ label: 'Previous', customId: 'previous', style: 'SECONDARY' }),
					new MessageButton({ label: 'Next', customId: 'next', style: 'SECONDARY' }),
				);

			const imageMessage = await message.reply({ embeds: [embed], components: [buttons] });
			const expiration = Date.now() + 60000;
			const filter = i => {
				i.deferUpdate();
				return i.user.id === message.author.id;
			};

			// async/await is actually super helpful, i should use it more
			while (Date.now() < expiration) {
				await imageMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 }).then(i => {
					if (i.customId === 'next') x++;
					else if (x === 0) return;
					else if (i.customId === 'previous') x--;
					imageMessage.edit({ embeds: [embed.setImage(results[x].url).setFooter(`Page ${x + 1}`)] });
				}).catch(err => imageMessage.edit({ components: [] }));
			}
		});
	},
};
