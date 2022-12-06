const { MessageActionRow, MessageButton } = require('discord.js');
const got = require('got');
const anilistParser = require('../../modules/anilistParser.js');

module.exports = {
	name: 'anilist',
	description: 'Searches for an anime or a manga on AniList.',
	usage: 'anilist <search term>',
	cooldown: '15',
	args: true,
	aliases: ['ani', 'anime', 'man', 'manga'],
	async execute(client, message, args, functions) {
		const query = `
		query ($search: String, $isAdult: Boolean) {
			Page(page: 1, perPage: 10) {
			  media(search: $search, isAdult: $isAdult, sort: SEARCH_MATCH) {
				id
				siteUrl
				type
				format
				title {
				  romaji(stylised: true)
				  native
				}
				status(version: 2)
				nextAiringEpisode {
				  episode
				  timeUntilAiring
				}
				startDate {
				  day
				  month
				  year
				}
				endDate {
				  day
				  month
				  year
				}
				description(asHtml: false)
				genres
				isAdult
				episodes
				chapters
				volumes
				averageScore
				meanScore
				trending
				coverImage {
				  extraLarge
				  color
				}
				bannerImage
				studios(isMain: true) {
				  nodes {
					name
				  }
				}
				staff(sort: RELEVANCE) {
				  edges {
					node {
					  name {
						full
					  }
					}
					role
				  }
				}
			  }
			}
		  }					
		`;
		const variables = {
			search: args.join(' '),
		};
		if (!message.channel.nsfw) {
			variables.isAdult = false;
		}
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				query: query,
				variables: variables,
			}),
		};

		let result = await got('https://graphql.anilist.co', options);
		result = JSON.parse(result.body).data.Page.media;
		if (!result[0]) {
			return await message.reply(functions.simpleEmbed('Nothing found!'));
		}

		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton({ label: '◀', customId: 'previous', style: 'SECONDARY' }),
				new MessageButton({ label: '▶', customId: 'next', style: 'SECONDARY' }),
			);

		const msg = await message.reply({ embeds: [anilistParser(result[0])], components: [buttons] });
		const filter = i => {
			i.deferUpdate();
			return i.user.id === message.author.id;
		};

		const collector = msg.createMessageComponentCollector({ filter, idle: 60000 });
		let x = 0;
		collector.on('collect', i => {
			switch (i.customId) {
			case 'next':
				if (x < result.length - 1) x++;
				break;
			case 'previous':
				if (x > 0) x--;
				break;
			default:
				return;
			}
			msg.edit({ embeds: [anilistParser(result[x])] });
		});
		collector.on('end', (collected, reason) => {
			if (reason === 'idle') msg.edit({ components: [] });
		});
	},
};