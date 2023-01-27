const got = require('got');
const anilistParser = require('../../modules/anilistParser.js');
const paginate = require('../../modules/paginate.js');

module.exports = {
	name: 'anilist',
	description: 'Searches for an anime or a manga on AniList.',
	usage: 'anilist <search term>',
	cooldown: 15,
	slashOptions: [
		{ name: 'query', description: 'search term', type: 3, required: true },
	],

	async execute(_client, interaction, functions) {
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

		const variables = { search: interaction.options.getString('query') };
		if (!interaction.channel.nsfw) variables.isAdult = false;

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
			return await interaction.editReply(functions.simpleEmbed('Nothing found!'));
		}

		const pages = [];
		result.forEach((res) => {
			pages.push(anilistParser(res));
		});
		paginate(interaction, pages);
	},
};