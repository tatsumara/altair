const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const got = require('got');

module.exports = {
	name: 'reddit',
	description: 'Shows posts from a subreddit.',
	usage: 'reddit <search query> [sort type] [sorting timeframe]',
	cooldown: '10',
	args: true,
	slashOptions: [
		{ name: 'subreddit', description: 'subreddit to query', type: 3, required: true },
		{ name: 'sort', description: 'what to sort by', type: 3, choices: [
			{ name: 'hot', value: 'hot' },
			{ name: 'top', value: 'top' },
			{ name: 'new', value: 'new' },
		] },
		{ name: 'timeframe', description: 'timeframe', type: 3, choices: [
			{ name: 'hour', value: 'hour' },
			{ name: 'day', value: 'day' },
			{ name: 'week', value: 'week' },
			{ name: 'month', value: 'month' },
			{ name: 'year', value: 'year' },
			{ name: 'all', value: 'all' },
		] },
	],

	async execute(client, interaction, functions) {
		const subName = interaction.options.getString('subreddit');
		const sortType = interaction.options.getString('sort') ?? 'hot';
		const timeFrame = interaction.options.getString('timeframe') ?? 'all';

		const response = await got(`https://www.reddit.com/r/${subName}/${sortType}.json?t=${timeFrame}`).json();
		const posts = response.data.children;

		if (!response.data.after) {
			return interaction.editReply(functions.simpleEmbed('Subreddit does not exist!'));
		}
		if (posts[0].kind === 't5') {
			return interaction.editReply(functions.simpleEmbed(`Subreddit does not exist. Did you mean "${posts.at(0).data.url}"? `));
		}

		let x = 0;
		const post = posts[x].data;
		if (post.over_18 && !interaction.channel.nsfw) {
			return interaction.editReply(functions.simpleEmbed('Cannot post nsfw content in sfw channel!'));
		}

		const embed = new MessageEmbed()
			.setAuthor({ iconURL: 'https://www.redditinc.com/assets/images/site/reddit-logo.png', name: `r/${subName}` })
			.setDescription(`["${post.title}"](https://reddit.com${post.permalink})`)
			.setColor(client.colors.blue)
			.setImage(post.url)
			.setFooter({ text: `${x + 1}/${posts.length} - posted by ${post.author}, ${post.ups} upvotes.` });
		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton({ label: '◀', customId: 'previous', style: 'SECONDARY' }),
				new MessageButton({ label: '▶', customId: 'next', style: 'SECONDARY' }),
				new MessageButton({ label: '✕', customId: 'close', style: 'DANGER' }),
			);
		const imageMessage = await interaction.editReply({ embeds: [embed], components: [buttons] });

		const filter = i => {
			i.deferUpdate();
			return i.user.id === interaction.author_id;
		};

		const collector = imageMessage.createMessageComponentCollector({ filter, idle: 60000 });
		collector.on('collect', i => {
			switch (i.customId) {
			case 'close':
				collector.stop();
				return;
			case 'next':
				if (x < posts.length) x++;
				break;
			case 'previous':
				if (x > 0) x--;
				break;
			default:
				return;
			}
			interaction.editReply({ embeds: [
				embed.setImage(posts.at(x).data.url)
					.setFooter({ text: `${x + 1}/${posts.length} - posted by ${posts.at(x).data.author}, ${posts.at(x).data.ups} upvotes.` })
					.setDescription(`["${posts.at(x).data.title}"](https://reddit.com${posts.at(x).data.permalink})`),
			] });
		});
		collector.on('end', (collected, reason) => {
			if (reason === 'idle') interaction.editReply({ components: [] });
			if (reason === 'user') {
				interaction.editReply({ embeds: [embed.setImage().setDescription(`"${subName}"\nImage search closed.`)] });
				interaction.editReply({ components: [] });
			}
		});
	},
};
