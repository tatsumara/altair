const { MessageEmbed } = require('discord.js');
const Genius = require('genius-lyrics');

module.exports = {
	name: 'lyrics',
	description: 'Fetches lyrics to a song.',
	usage: 'lyrics <song name>',
	disabled: true,
	args: true,
	async execute(client, message, args, functions) {
		if (!process.env.GENIUS_API_KEY) return client.log.error('Please input your Genius API key in the config.');
		const geniusClient = new Genius.Client(process.env.GENIUS_API_KEY);

		const results = await geniusClient.songs.search(args.join(' '));
		if (!results[0]) return message.reply(functions.simpleEmbed('Nothing found!'));

		const lyrics = await results[0].lyrics();

		const embed = new MessageEmbed()
			// .setTitle(results[0].featuredTitle)
			.setURL(results[0].url)
			.setColor(client.colors.blue)
			.setAuthor(results[0].fullTitle, results[0].thumbnail, results[0].url);
		return message.reply({ embeds: [embed], files: [{
			attachment: Buffer.from(lyrics),
			name: 'lyrics.txt',
		}] });
	},
};