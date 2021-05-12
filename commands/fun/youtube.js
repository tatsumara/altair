const ytsr = require('ytsr');
const chalk = require('chalk');

module.exports = {
	name: 'youtube',
	description: 'Searches for a video on YouTube.',
	usage: 'youtube <search term>',
	cooldown: '15',
	args: true,
	aliases: ['yt', 'ytube'],
	async execute(client, message, args, functions) {
		const result = await ytsr(args.join(' '), { limit: 1 });
		message.channel.send(result.items[0].url);
	},
};