const { MessageEmbed } = require('discord.js');
const got = require('got');
const paginate = require('../../modules/paginate');

module.exports = {
	name: 'reddit',
	description: 'Shows posts from a subreddit.',
	usage: 'reddit <search query> [sort type] [sorting timeframe]',
	cooldown: '10',
	args: true,
	aliases: ['red', 'reddit'],
	async execute(client, message, args, functions) {
		const subName = args.at(0);
		let sortType = args.at(1);
		let timeFrame = args.at(2);
		if (!['hot', 'top', 'new'].includes(sortType)) {
			sortType = 'hot';
		}
		timeFrame ??= 'all';
		const subredditUrl = await got(`https://www.reddit.com/r/${subName}/${sortType}.json?t=${timeFrame}`).json();
		const subreddit = subredditUrl.data.children;
		if (subredditUrl.data.after === null) {
			return message.reply(functions.simpleEmbed('Subreddit does not exist!'));
		}
		if (subreddit.at(0).kind === 't5') {
			return message.reply(functions.simpleEmbed(`Subreddit does not exist. Did you mean "${subreddit.at(0).data.url}"? `));
		}

		const nsfw = subreddit[0].data.over_18;
		if (nsfw === true & message.channel.nsfw === false) {
			return message.reply(functions.simpleEmbed('Cannot post nsfw content in sfw channel!'));
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
		paginate(message, pages);
	},
};
