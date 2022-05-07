const anilistNode = require('anilist-node');

function formatDate(date) {
	return `${date.day || '--' }.${date.month || '--' }.${date.year || '----' }`;
}

module.exports = {
	name: 'anime',
	description: 'Looks up an anime on AniList.',
	usage: '/anime <anime name>',
	cooldown: 15,
	slashOptions: [
		{ name: 'anime', description: 'anime to look up', type: 3, required: true },
	],
	async execute(_client, interaction, functions) {
		const title = interaction.options.getString('anime');
		const anilist = new anilistNode();
		const filter = { isAdult: interaction.channel.nsfw };
		const data = await anilist.searchEntry.anime(title, filter);
		if (data.pageInfo.total === 0) return interaction.editReply(functions.simpleEmbed('Nothing found!'));

		const anime = await anilist.media.anime(data.media[0].id);
		const alternateSpellings = anime.title.english === null
			? anime.title.native
			: `${anime.title.english}, ${anime.title.native}`;

		const embed = {
			color: anime.coverImage.color,
			title: `[${anime.format}] ${anime.title.romaji} (${anime.seasonYear || 'TBA'})`,
			url: anime.siteUrl,
			fields: [
				{ name: 'Alternate Spellings:', value: alternateSpellings, inline: true },
				{ name: 'Start date:', value: formatDate(anime.startDate), inline: true },
				{ name: 'End date:', value: formatDate(anime.endDate), inline: true },
				{ name: 'Status:', inline: true, value:
					`${anime.status.replace('_', ' ')} ` +
					`with ${anime.episodes || 'unknown'} episodes` },
				{ name: 'Studio:', value: anime.studios.find(studio => studio.isAnimationStudio)?.name || 'unknown', inline: true },
				{ name: 'Source:', value: anime.source, inline: true },
			],
			description: `${anime.description?.replace(/<[^>]*>/gm, '').split(' ').splice(0, 32).join(' ') || 'No description'}...`,
			footer: {
				text: `Score: ${anime.meanScore || '--'}/100`,
			},
			thumbnail: {
				url: anime.coverImage.large,
			},
		};
		return interaction.editReply({ embeds: [embed] });
	},
};
