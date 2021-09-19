const { MessageEmbed } = require('discord.js');
const { getLyrics } = require('simple-genius-lyrics-scraper');
const chalk = require('chalk');

module.exports = {
	name: 'lyrics',
	description: 'Fetches lyrics to a song.',
	usage: 'lyrics <song name>',
	args: true,
	async execute(client, message, args, functions) {
		const result = await getLyrics(args.join(' '));

		const embed = new MessageEmbed()
			.setTitle(`${result.title} by ${result.artist}`)
			.setURL(result.url)
			.setColor('#0073E6')
			.setThumbnail(result.cover)
			.setDescription(result.lyrics);
		return message.channel.send({ embeds: [embed] });
	},
};