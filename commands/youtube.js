const youtubeNode = require('youtube-node');
const { youtubeAPIKey } = require('../config.json');
module.exports = {
	name: 'youtube',
	description: 'Searches for a video on YouTube.',
	cooldown: '15',
	args: true,
    aliases: ['yt', 'ytube'],
	execute(client, message, args, functions) {
		const youtube = new youtubeNode();
		youtube.setKey(youtubeAPIKey);
		youtube.search(args.join(' '), 5, (error, result) => {
			const video = result.items.find(item => item.id.kind === 'youtube#video');
			if (!video) {
                return message.channel.send(functions.simpleEmbed('Nothing found!', ''));
            }
			message.channel.send(`https://www.youtube.com/watch?v=${video.id.videoId}`)
		})
	},
};