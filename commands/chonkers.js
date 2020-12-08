const ddgi = require('duckduckgo-images-api');

module.exports = {
	name: 'img',
	description: 'Searches for an image on DuckDuckGo.',
	execute(client, message, args) {
		ddgi.image_search({ query: args.join(' ') })
			.then(results=>{
				message.channel.send(results[0].image);
			});
	},
};