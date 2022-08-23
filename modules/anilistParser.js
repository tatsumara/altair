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
		// this is to remove some of the html entities left over from anilist
		description = require('he').decode(res.description.replace(/<\/?[^>]+(>|$)/g, '').split(' ').splice(0, 50).join(' ') + '...');
	} else {
		description = 'No description found.';
	}
	embed.setDescription(description);

	// .filter(Boolean) filters out parts of the date that don't exist
	const startDate = Object.values(res.startDate).filter(Boolean).join('.');
	const endDate = Object.values(res.endDate).filter(Boolean).join('.');
	let status;
	switch (res.status) {
	case 'FINISHED':
		status = `Finished: ${startDate}-${endDate}`;
		break;
	case 'RELEASING':
		status = `Releasing since ${startDate}`;
		break;
	case 'NOT_YET_RELEASED':
		if (!res.startDate.year) {
			status = 'Release date not yet known';
			break;
		}
		status = `Releasing: ${startDate}`;
		break;
	case 'CANCELLED':
		status = `Cancelled: ${startDate}-${endDate}`;
		break;
	case 'HIATUS':
		status = `On hiatus, releasing since: ${startDate}`;
		break;
	}
	embed.setAuthor({
		name: status,
		iconURL: 'https://anilist.co/img/icons/android-chrome-512x512.png',
	});

	let footer = '';
	if (res.isAdult) footer += '🔞• ';
	if (res.trending >= 20) footer += '🔥• ';
	if (res.averageScore) footer += `Average score: ${res.averageScore}/100 • `;
	if (res.meanScore) footer += `Mean score: ${res.meanScore}/100`;
	if (footer.endsWith('• ')) footer = footer.slice(0, -2);
	embed.setFooter({ text: footer });

	embed.addField('Genres', '`' + res.genres.join(', ') + '`');

	res.staff.edges.slice(0, 3).forEach(staff => {
		if (staff.role.match(/(Translator|Lettering)/)) return;
		embed.addField(staff.role, staff.node.name.full, true);
	});

	if (!res.format?.match(/^(MANGA|ONE_SHOT|NOVEL)$/) || res.studios.nodes[0]) {
		embed.addField('Studio', res.studios.nodes[0]?.name || 'Unknown', true);
		if (res.status === 'FINISHED' && res.format !== 'MOVIE') embed.addField('Episodes', res.episodes.toString(), true);
	} else if (res.status === 'FINISHED' && res?.format !== 'ONE_SHOT') {
		if (res.volumes) embed.addField('Volumes', res.volumes.toString(), true);
		embed.addField('Chapters', res.chapters?.toString() || 'Unknown', true);
	}
	return embed;
};