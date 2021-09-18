const { MessageEmbed } = require('discord.js');
const genius = require('genius-lyrics-api');
const chalk = require('chalk');

module.exports = {
	name: 'lyrics',
	description: 'Fetches lyrics to a song.',
	usage: 'lyrics <song name>',
	args: true,
	async execute(client, message, args, functions) {
		if (!process.env.GENIUS_API_KEY) return console.log(chalk.red('[cmnd] Please input your WolframAlpha API key in the config.'));
		const result = await genius.getSong({
			apiKey: process.env.GENIUS_API_KEY,
			title: args.join(' '),
			artist: ' ',
		});
		if (!result) return message.channel.send(functions.simpleEmbed('Nothing found!'));
		const embed = new MessageEmbed()
			.setTitle(result.title)
			.setURL(result.url)
			.setDescription(result.lyrics.substring(0, 1021) + '...')
			.setColor('#0073E6')
			.setThumbnail(result.albumArt);
		return message.channel.send({ embeds: [embed] });
	},
};