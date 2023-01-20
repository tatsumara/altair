const { MessageActionRow, MessageButton } = require('discord.js');
const got = require('got');
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

		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton({ label: '◀', customId: 'previous', style: 'SECONDARY' }),
				new MessageButton({ label: '▶', customId: 'next', style: 'SECONDARY' }),
			);

		const msg = await interaction.editReply({ embeds: [await TMDbParser(client, results[0].media_type, results[0].id)], components: [buttons] });
		const filter = i => {
			i.deferUpdate();
			return i.user.id === interaction.author.id;
		};

		const collector = msg.createMessageComponentCollector({ filter, idle: 60000 });
		let x = 0;
		collector.on('collect', async i => {
			switch (i.customId) {
			case 'next':
				if (x < results.length - 1) x++;
				break;
			case 'previous':
				if (x > 0) x--;
				break;
			default:
				return;
			}
			interaction.editReply({ embeds: [await TMDbParser(client, results[x].media_type, results[x].id)] });
		});
		collector.on('end', (collected, reason) => {
			if (reason === 'idle') interaction.editReply({ components: [] });
		});
	},
};