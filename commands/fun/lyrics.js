const { MessageEmbed } = require('discord.js');
const Genius = require('genius-lyrics');
const chalk = require('chalk');

module.exports = {
	name: 'lyrics',
	description: 'Fetches lyrics to a song.',
	usage: 'lyrics <song name>',
	args: true,
	disabled: true,
	async execute(client, message, args, functions) {
		if (!process.env.GENIUS_API_KEY) return console.log(chalk.red('[cmnd] Please input your WolframAlpha API key in the config.'));
		const geniusClient = new Genius.SongsClient();

		const results = await geniusClient.search(args.join(' '));
		if (!results[0]) return message.channel.send(functions.simpleEmbed('Nothing found!'));

		const lyrics = await results[0].lyrics();

		const embed = new MessageEmbed()
			.setTitle(results[0].fullTitle)
			.setURL(results[0].url)
			.setColor('#0073E6')
			.setDescription(lyrics);
		return message.channel.send({ embeds: [embed] });
	},
};