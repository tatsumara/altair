const { MessageEmbed } = require('discord.js');
const Genius = require('genius-lyrics');
const chalk = require('chalk');

module.exports = {
	name: 'lyrics',
	description: 'Fetches lyrics to a song.',
	usage: 'lyrics <song name>',
	args: true,
	async execute(client, message, args, functions) {
		if (!process.env.GENIUS_API_KEY) return console.log(chalk.red('[cmnd] Please input your Genius API key in the config.'));
		const geniusClient = new Genius.Client(process.env.GENIUS_API_KEY);

		const results = await geniusClient.songs.search(args.join(' '));
		if (!results[0]) return message.channel.send(functions.simpleEmbed('Nothing found!'));

		const lyrics = await results[0].lyrics();

		const embed = new MessageEmbed()
			// .setTitle(results[0].featuredTitle)
			.setURL(results[0].url)
			.setColor('#0073E6')
			.setAuthor(results[0].fullTitle, results[0].thumbnail, results[0].url);
		return message.channel.send({ embeds: [embed], files: [{
			attachment: Buffer.from(lyrics),
			name: 'lyrics.txt',
		}] });
	},
};