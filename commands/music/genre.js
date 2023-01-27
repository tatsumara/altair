const { MessageEmbed } = require('discord.js');
const got = require('got');

module.exports = {
	name: 'genre',
	description: 'Shows you information about a genre.',
	usage: 'genre <genre name>',
	slashOptions: [
		{ name: 'query', description: 'search term', type: 3, required: true },
	],

	async execute(client, interaction, functions) {
		if (!process.env.LASTFM_API_KEY) return client.log.error('Please input your Last.fm API key in the config.');

		const query = interaction.options.getString('query');
		const { body: { tag } } = await got(`https://ws.audioscrobbler.com/2.0/?method=tag.getinfo&tag=${encodeURIComponent(query)}&api_key=${process.env.LASTFM_API_KEY}&format=json`, { responseType: 'json' });

		if (tag.total === 0 && !tag.wiki.content) {
			return await interaction.editReply(functions.simpleEmbed('Nothing found!'));
		}

		const embed = new MessageEmbed()
			.setTitle(tag.name)
			.setURL(`http://www.last.fm/tag/${tag.name.replaceAll(' ', '+')}`)
			.setAuthor({ iconURL: 'https://www.last.fm/static/images/lastfm_avatar_twitter.52a5d69a85ac.png', name: 'Last.fm' })
			.setFooter({ text: `${tag.total} songs on Last.fm` })
			.setColor(client.colors.blue);

		let description;
		if (tag.wiki.content) {
			description = tag.wiki.summary.replace(` <a href="http://www.last.fm/tag/${tag.name.replaceAll(' ', '+')}">Read more on Last.fm</a>.`, '');
		} else {
			description = 'No description found.';
		}
		if (!description.endsWith('.')) description += '...';
		embed.setDescription(description);

		return await interaction.editReply({ embeds: [embed] });
	},
};