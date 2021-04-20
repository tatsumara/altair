const anilistNode = require('anilist-node');

module.exports = {
	name: 'anime',
	description: 'Looks up an anime on AniList.',
    usage: 'anime <anime name>',
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
            title: `[${anime.format}] ${anime.title.romaji} (${anime.seasonYear || 'TBA'})`,
            url: anime.siteUrl,
            fields: [
                {name: 'Alternate Spellings:', value: `${anime.title.english}, ${anime.title.native}`, inline: true},
                {name: 'Start date:', value: `${anime.startDate.day || '--' }.${anime.startDate.month || '--' }.${anime.startDate.year || '----' }`, inline: true},
                {name: 'End date:', value: `${anime.endDate.day || '--' }.${anime.endDate.month || '--' }.${anime.endDate.year || '----' }`, inline: true},
                {name: 'Status:', value: `${anime.status.replace('NOT_YET_RELEASED', 'Not yet released')} with ${anime.episodes || 'unknown'} episodes`, inline: true},
                {name: 'Studio:', value: anime.studios.find(studio => studio.isAnimationStudio).name, inline: true},
                {name: 'Source:', value: anime.source, inline: true},
            ],
            description: `${anime.description?.split(' ').splice(0,32).join(' ') || 'No description'}...`,
            footer: {
                text: `Score: ${anime.meanScore || '--'}/100`,
            },
            thumbnail: {
                url: anime.coverImage.large,
            },
        }
        message.channel.send({ embed: embed});
	},
};