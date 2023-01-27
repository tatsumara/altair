const { MessageEmbed } = require('discord.js');
const Genius = require('genius-lyrics');

module.exports = {
	name: 'lyrics',
	description: 'Fetches lyrics to a song.',
	usage: 'lyrics <song name>',
	disabled: true,
	slashOptions: [
		{ name: 'query', description: 'search term', type: 3, required: true },
	],

	async execute(client, interaction, functions) {
		if (!process.env.GENIUS_API_KEY) return client.log.error('Please input your Genius API key in the config.');
		const geniusClient = new Genius.Client(process.env.GENIUS_API_KEY);

		const query = interaction.options.getString('query');
		const results = await geniusClient.songs.search(query);
		if (!results[0]) return interaction.editReply(functions.simpleEmbed('Nothing found!'));

		const lyrics = await results[0].lyrics();
		const embed = new MessageEmbed()
			.setTitle(results[0].featuredTitle)
			.setURL(results[0].url)
			.setColor(client.colors.blue)
			.setAuthor(results[0].fullTitle, results[0].thumbnail, results[0].url);

		return interaction.editReply({ embeds: [embed], files: [{
			attachment: Buffer.from(lyrics),
			name: 'lyrics.txt',
		}] });
	},
};