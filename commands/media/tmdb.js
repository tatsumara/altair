const got = require('got');
const paginate = require('../../modules/paginate.js');
const TMDbParser = require('../../modules/TMDbParser.js');

module.exports = {
	name: 'tmdb',
	description: 'Searches for a movie or show on The Movie Database.',
	usage: 'tmdb <search term>',
	cooldown: '15',
	args: true,
	aliases: ['movie', 'show', 'series'],
	async execute(client, message, args, functions) {
		if (!process.env.TMDB_API_KEY) return client.log.error('Please input your TMDb API key in the config.');
		let { results } = await got(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&language=en_US&include_adult=${message.channel.nsfw}&query=${encodeURIComponent(args.join(' '))}`).json();
		results = results.filter(entry => entry.media_type !== 'person');
		if (!results[0]) {
			return await message.reply(functions.simpleEmbed('Nothing found!'));
		}

		const promises = results.map(res => TMDbParser(client, res.media_type, res.id));
		paginate(message, await Promise.all(promises));
	},
};