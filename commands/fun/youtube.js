const ytsr = require('ytsr');
const chalk = require('chalk');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name: 'youtube',
	description: 'Searches for a video on YouTube.',
	usage: 'youtube <search term>',
	cooldown: '15',
	args: true,
	aliases: ['yt', 'ytube'],
	async execute(client, message, args, functions) {
		const result = await ytsr(args.join(' '), { limit: 15 });
		if (!result.items[0]) {
			return message.channel.send(functions.simpleEmbed('Nothing found!'));
		}
		let x = 0;

		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton({ label: 'Previous', customId: 'previous', style: 'SECONDARY' }),
				new MessageButton({ label: 'Next', customId: 'next', style: 'SECONDARY' }),
			);

		const youtubeMessage = await message.reply({ content: result.items[x].url, components: [buttons] });
		const expiration = Date.now() + 60000;
		const filter = i => {
			i.deferUpdate();
			return i.user.id === message.author.id;
		};

		while (Date.now() < expiration) {
			await youtubeMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 }).then(i => {
				if (i.customId === 'next') x++;
				else if (x === 0 || x === 14) return;
				else if (i.customId === 'previous') x--;
				youtubeMessage.edit({ content: result.items[x].url });
			}).catch(err => youtubeMessage.edit({ components: [] }));
		}
	},
};