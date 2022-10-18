const { MessageEmbed, MessageActionRow, MessageButton, Guild, GuildChannel, Channel, Message } = require('discord.js');
const got = require("got")
module.exports = {
	name: 'reddit',
	description: 'Shows images from a subreddit.',
	usage: 'reddit <search query>',
	cooldown: '10',
	args: true,
	aliases: ['red', 'reddit'],
	async execute(client, message, args, functions) {
		let subName = args.at(0);
		console.log(args, args.length);
		if (args.length > 1) {
			return message.reply(functions.simpleEmbed('Please provide a single subreddit!'));
		}
		let subredditUrl = await got(`https://www.reddit.com/r/${subName}.json`).json()
		let subreddit = subredditUrl.data.children
// stealing mara's code, hopefully works
// making x = 1 since most subreddits have a shitty pinned post. could i make it not show the pinned post? probably. do i care enough to do that? no
let x = 1;
		let imageLink = subreddit.at(x).data.url
		let postTitle = subreddit.at(x).data.title
		let nsfw = subreddit.at(x).data.over_18
		if (nsfw === true & message.channel.nsfw === false){
			return message.reply(functions.simpleEmbed('Cannot post nsfw content in sfw channel!'))
		}
		const embed = new MessageEmbed()
			.setTitle(subName)
			.setDescription(`"${subreddit.at(x).data.title}"`)
			.setColor(client.colors.blue)
			.setImage(subreddit.at(x).data.url)
			.setFooter({ text: `${x}/${subreddit.length}` });
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
				if (x < subreddit.length) x++;
				break;
			case 'previous':
				if (x > 0) x--;
				break;
			default:
				return;
			}
			imageMessage.edit({ embeds: [
				embed.setImage(subreddit.at(x).data.url)
					.setFooter({ text: `${x + 1}/${subreddit.length}` })
					.setDescription(`"${subreddit.at(x).data.title}"`),
			] });
		});
		collector.on('end', (collected, reason) => {
			if (reason === 'idle') imageMessage.edit({ components: [] });
			if (reason === 'user') {
				imageMessage.edit({ embeds: [embed.setImage().setDescription(`"${subName}"\nImage search closed.`)] });
				imageMessage.edit({ components: [] });
			}
		});
	},
}
