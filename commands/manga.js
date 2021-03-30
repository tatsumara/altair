const anilistNode = require('anilist-node');

module.exports = {
	name: 'manga',
	description: 'Looks up a manga on AniList.',
	cooldown: '10',
	args: true,
    aliases: ['ma'],
	async execute(client, message, args, functions) {
        const anilist = new anilistNode();
        const data = await anilist.searchEntry.manga(args.join(' '));
        if (data.pageInfo.total === 0) return message.channel.send(functions.simpleEmbed('Nothing found!', ''));
        const manga = await anilist.media.manga(data.media[0].id)
        const embed = {
            color: manga.coverImage.color,
            title: `[${manga.format}] ${manga.title.userPreferred}`,
            url: manga.siteUrl,
            fields: [
                {name: 'Alternate Spellings:', value: `${Object.values(manga.title).slice(0,-1).join(', ')}`, inline: true},
                {name: 'Start date:', value: `${manga.startDate.day}.${manga.startDate.month}.${manga.startDate.year}`, inline: true},
                {name: 'End date:', value: `${manga.endDate.day || '' }.${manga.endDate.month || '' }.${manga.endDate.year || '' }`, inline: true},
                {name: 'Status:', value: `${manga.status} with ${manga.volumes || 'unknown'} volumes`, inline: true},
            ],
            description: `${manga.description.split(' ').splice(0,32).join(' ')}...`,
            footer: {
                text: `Score: ${manga.meanScore}/100`,
            },
            thumbnail: {
                url: manga.coverImage.large,
            },
        }
        message.channel.send({ embed: embed});
	},
};