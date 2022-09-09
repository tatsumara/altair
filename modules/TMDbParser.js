const { MessageEmbed } = require('discord.js');
const got = require('got');

module.exports = async (client, media_type, id) => {
	const media = await got(`https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.TMDB_API_KEY}&language=en_DE&`).json();
	const embed = new MessageEmbed()
		.setTitle(`[${media_type.toUpperCase()}] ${media.title || media.name}`)
		.setDescription(media.overview.split(' ').splice(0, 50).join(' ') + '...')
		.setURL(`https://www.themoviedb.org/${media_type}/${id}`)
		.setColor(client.colors.blue)
		.setThumbnail('https://image.tmdb.org/t/p/original/' + media.poster_path)
		.setImage('https://image.tmdb.org/t/p/original/' + media.backdrop_path);

	const startDate = (new Date(media.first_air_date || media.release_date)).toLocaleDateString('de');
	const endDate = (new Date(media.last_air_date)).toLocaleDateString('de');
	let status;
	switch (media.status) {
	case 'Planned':
	case 'In Production':
	case 'Post Production':
		if (!startDate) {
			status = 'Release date not yet known';
			break;
		}
		status = `Releasing: ${startDate}`;
		break;
	case 'Ended':
	case 'Released':
		status = `${media.status}: ${startDate}`;
		if (media_type === 'tv' && startDate !== endDate) status += `-${endDate}`;
		break;
	case 'Returning Series':
		status = 'Returning series since ' + startDate;
		break;
	case 'Canceled':
		status = `Canceled: ${startDate}-${endDate}`;
		break;
	default:
		status = media.status;
	}

	embed.setAuthor({
		name: status,
		iconURL: 'https://i.imgur.com/8J1A2DH.png',
	});

	let footer = '';
	if (media.adult) footer += '🔞• ';
	if (media.popularity >= 1000) footer += '🔥• ';
	if (media.vote_count !== 0) footer += `Average score of ${media.vote_count} votes: ${media.vote_average}/10`;
	if (footer.endsWith('• ')) footer = footer.slice(0, -2);
	embed.setFooter({ text: footer });

	if (media.genres[0]) embed.addField('Genres', '`' + media.genres.map(g => g.name).join(', ') + '`');

	if (media.production_companies[0]) embed.addField('Studio', media.production_companies[0].name, true);

	if (media_type === 'tv') {
		if (media.number_of_seasons !== 1) embed.addField('Seasons', media.number_of_seasons.toString(), true);
		embed.addField('Episodes', media.number_of_episodes.toString(), true);
	} else if (media.runtime !== 0) {
		embed.addField('Runtime', media.runtime + 'm', true);
	}
	return embed;
};