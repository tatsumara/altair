const { MessageEmbed } = require('discord.js');

module.exports = (res) => {
	const embed = new MessageEmbed()
		.setTitle(`[${res.format?.replace('_', '') || 'UNKNOWN'}] ${res.title.romaji} (${res.title.native})`)
		.setURL(res.siteUrl)
		.setColor(res.coverImage.color)
		.setThumbnail(res.coverImage.extraLarge)
		.setImage(res.bannerImage);

	let description;
	if (res.description) {
		description = require('he').decode(res.description.replace(/<\/?[^>]+(>|$)/g, '').split(' ').splice(0, 50).join(' ') + '...');
	} else {
		description = 'No description found.';
	}
	embed.setDescription(description);
	let name;
	switch (res.status) {
	case 'FINISHED':
		name = `Finished: ${Object.values(res.startDate).filter(Boolean).join('.')}-${Object.values(res.endDate).filter(Boolean).join('.')}`;
		break;
	case 'RELEASING':
		name = `Releasing since ${Object.values(res.startDate).filter(Boolean).join('.')}`;
		break;
	case 'NOT_YET_RELEASED':
		name = `Releasing: ${Object.values(res.startDate).filter(Boolean).join('.')}`;
		break;
	case 'CANCELLED':
		name = `Cancelled: ${Object.values(res.startDate).filter(Boolean).join('.')}-${Object.values(res.endDate).filter(Boolean).join('.')}`;
		break;
	case 'HIATUS':
		name = `On hiatus, releasing since: ${Object.values(res.startDate).filter(Boolean).join('.')}`;
		break;
	}
	embed.setAuthor({
		name: name,
		iconURL: 'https://anilist.co/img/icons/android-chrome-512x512.png',
	});

	let footer = '';
	if (res.isAdult) footer += '🔞• ';
	if (res.trending >= 20) footer += '🔥• ';
	if (res.averageScore) {
		footer += `Average score: ${res.averageScore}/100 • Mean score: ${res.meanScore}/100`;
	}
	embed.setFooter({ text: footer });

	embed.addField('Genres', '`' + res.genres.join(', ') + '`');

	res.staff.edges.slice(0, 3).forEach(staff => {
		if (staff.role.match(/(Translator|Lettering)/)) return;
		embed.addField(staff.role, staff.node.name.full, true);
	});

	if (!res.format?.match(/^(MANGA|ONE_SHOT|NOVEL)$/) || res.studios.nodes[0]) {
		embed.addField('Studio', res.studios.nodes[0]?.name || 'Unknown', true);
		if (res.status === 'FINISHED') embed.addField('Episodes', res.episodes.toString(), true);
	} else if (res.status === 'FINISHED') {
		embed.addField('Volumes', res.volumes?.toString() || 'Unknown', true);
		embed.addField('Chapters', res.chapters?.toString() || 'Unknown', true);
	}
	return embed;
};