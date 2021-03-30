const youtubeNode = require('youtube-node');
const config = require('../config.json');
const chalk = require('chalk');

module.exports = {
	name: 'youtube',
	description: 'Searches for a video on YouTube.',
	cooldown: '15',
	args: true,
    aliases: ['yt', 'ytube'],
	execute(client, message, args, functions) {
		if (!config.youtubeAPIKey) return console.log(chalk.red('[cmnd] Please input your YouTube API key in the config.'))
		const youtube = new youtubeNode();
		youtube.setKey(config.youtubeAPIKey);
		youtube.search(args.join(' '), 5, (error, result) => {
			const video = result.items.find(item => item.id.kind === 'youtube#video');
			if (!video) {
                return message.channel.send(functions.simpleEmbed('Nothing found!', ''));
            }
			message.channel.send(`https://www.youtube.com/watch?v=${video.id.videoId}`)
		})
	},
};