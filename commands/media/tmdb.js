const got = require('got');
const paginate = require('../../modules/paginate.js');
const TMDbParser = require('../../modules/TMDbParser.js');

module.exports = {
	name: 'tmdb',
	description: 'Searches for a movie or show on The Movie Database.',
	usage: 'tmdb <search term>',
	cooldown: 15,
	slashOptions: [
		{ name: 'query', description: 'search term', type: 3, required: true },
	],

	async execute(client, interaction, functions) {
		if (!process.env.TMDB_API_KEY) return client.log.error('Please input your TMDb API key in the config.');

		const query = interaction.options.getString('query');
		const res = await got(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&language=en_US&include_adult=${interaction.channel.nsfw}&query=${encodeURIComponent(query)}`).json();
		const results = res.results.filter(entry => entry.media_type !== 'person');

		if (!results[0]) {
			return await interaction.editReply(functions.simpleEmbed('Nothing found!'));
		}

		const promises = results.map(r => TMDbParser(client, r.media_type, r.id));
		paginate(interaction, await Promise.all(promises));
	},
};