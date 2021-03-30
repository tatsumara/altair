const anilistNode = require('anilist-node');

module.exports = {
	name: 'anime',
	description: 'Looks up an anime on AniList.',
	cooldown: '10',
	args: true,
    aliases: ['ani', 'anilist'],
	async execute(client, message, args, functions) {
        const anilist = new anilistNode();
        const data = await anilist.searchEntry.anime(args.join(' '));
        if (data.pageInfo.total === 0) return message.channel.send(functions.simpleEmbed('Nothing found!', ''));
        const anime = await anilist.media.anime(data.media[0].id)
        const embed = {
            color: anime.coverImage.color,
            title: `[${anime.format}] ${anime.title.userPreferred} (${anime.seasonYear})`,
            url: anime.siteUrl,
            fields: [
                {name: 'Alternate Spellings:', value: Object.values(anime.title).slice(0,-1).join(', '), inline: true},
                {name: 'Start date:', value: `${anime.startDate.day}.${anime.startDate.month}.${anime.startDate.year}`, inline: true},
                {name: 'End date:', value: `${anime.endDate.day || '' }.${anime.endDate.month || '' }.${anime.endDate.year || '' }`, inline: true},
                {name: 'Status:', value: `${anime.status} with ${anime.episodes || anime.nextAiringEpisode.episode - 1} episodes`, inline: true},
                // {name: 'Studio:', values: anime.studios[0].name, inline: true}
            ],
            description: `${anime.description.split(' ').splice(0,32).join(' ')}...`,
            footer: {
                text: `Score: ${anime.meanScore}/100`,
            },
            thumbnail: {
                url: anime.coverImage.large,
            },
        }
        message.channel.send({ embed: embed});
	},
};