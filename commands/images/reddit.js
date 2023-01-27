const { MessageEmbed } = require('discord.js');
const got = require('got');
const paginate = require('../../modules/paginate');

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

		if (!response.data.after) {
			return interaction.editReply(functions.simpleEmbed('Subreddit does not exist!'));
		}
		const subredditUrl = await got(`https://www.reddit.com/r/${subName}/${sortType}.json?t=${timeFrame}`).json();
		const subreddit = subredditUrl.data.children;
		if (subredditUrl.data.after === null) {
			return interaction.reply(functions.simpleEmbed('Subreddit does not exist!'));
		}
		if (subreddit.at(0).kind === 't5') {
			return interaction.reply(functions.simpleEmbed(`Subreddit does not exist. Did you mean "${subreddit.at(0).data.url}"? `));
		}

		const nsfw = subreddit[0].data.over_18;
		if (nsfw === true & interaction.channel.nsfw === false) {
			return interaction.reply(functions.simpleEmbed('Cannot post nsfw content in sfw channel!'));
		}

		const pages = [];
		subreddit.forEach((res, i) => {
			const embed = new MessageEmbed()
				.setAuthor({ iconURL: 'https://www.redditinc.com/assets/images/site/reddit-logo.png', name: `r/${subName}` })
				.setDescription(`["${res.data.title}"](https://reddit.com${res.data.permalink})`)
				.setColor(client.colors.blue)
				.setImage(res.data.url)
				.setFooter({ text: `${i + 1}/${subreddit.length} - posted by ${res.data.author}, ${res.data.ups} upvotes.` });
			pages.push(embed);
		});
		paginate(interaction, pages);
	},
};
