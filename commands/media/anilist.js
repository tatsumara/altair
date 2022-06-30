const got = require('got');

module.exports = {
	name: 'anilist',
	description: 'Searches for an anime or a manga on AniList.',
	usage: 'anilist <search term>',
	cooldown: '15',
	args: true,
	aliases: ['ani', 'anime', 'man', 'manga'],
	async execute(client, message, args) {
		const query = `
		query ($search: String) {
			Page(page: 1, perPage: 10) {
			  media(search: $search, sort: SEARCH_MATCH) {
				id
				siteUrl
				type
				format
				title {
				  romaji(stylised: true)
				  native
				}
				status(version: 2)
				startDate { day, month, year }
				endDate { day, month, year }
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
				staff (sort: RELEVANCE){
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
		result = JSON.parse(result.body).data.Page.media[0];

		const embed = require('../../modules/anilistParser.js')(result);
		message.reply({ embeds: [embed] });
	},
};