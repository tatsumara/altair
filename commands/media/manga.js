const anilistNode = require('anilist-node');

module.exports = {
	name: 'manga',
	description: 'Looks up a manga on AniList.',
	usage: '/manga <manga name>',
	cooldown: 15,
	slashOptions: [
		{ name: 'manga', description: 'manga to look up', type: 3, required: true },
	],
	async execute(client, interaction, functions) {
		const title = interaction.options.getString('manga');
		const anilist = new anilistNode();
		const filter = { isAdult: interaction.channel.nsfw };
		const data = await anilist.searchEntry.manga(title, filter);
		if (data.pageInfo.total === 0) return interaction.editReply(functions.simpleEmbed('Nothing found!'));

		const manga = await anilist.media.manga(data.media[0].id);
		const alternateSpellings = manga.title.english === null
			? manga.title.native
			: `${manga.title.english}, ${manga.title.native}`;

		const embed = {
			color: manga.coverImage.color,
			title: `[${manga.format}] ${manga.title.romaji}`,
			url: manga.siteUrl,
			fields: [
				{ name: 'Alternate Spellings:', value: alternateSpellings, inline: true },
				{ name: 'Start date:', value: `${manga.startDate.day || '--'}.${manga.startDate.month || '--'}.${manga.startDate.year || '----'}`, inline: true },
				{ name: 'End date:', value: `${manga.endDate.day || '--' }.${manga.endDate.month || '--' }.${manga.endDate.year || '----' }`, inline: true },
				{ name: 'Status:', inline: true, value:
					`${manga.status.replace('_', ' ')} ` +
					`with ${manga.volumes || 'unknown'} volumes` },
			],
			description: `${manga.description?.replace(/<[^>]*>/gm, '').split(' ').splice(0, 32).join(' ') || 'No description'}...`,
			footer: {
				text: `Score: ${manga.meanScore || '--'}/100`,
			},
			thumbnail: {
				url: manga.coverImage.large,
			},
		};
		return interaction.editReply({ embeds: [embed] });
	},
};