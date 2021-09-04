const { DiscordBanners } = require('discord-banners');

module.exports = {
	name: 'banner',
	description: 'Sends your or the mentioned users banner.',
	usage: 'avatar [user]',
	cooldown: '5',
	guildOnly: true,
	async execute(client, message, args, functions) {
		const b = new DiscordBanners(client);
		let member = message.mentions.users.first() || args[0]?.match(/\d{17,18}/) || message.author;
		if (Array.isArray(member)) {
			member = await client.users.cache.get(member[0]);
		}
		if (!member) return message.channel.send(functions.simpleEmbed('User not found or not a user!'));
		if (member.bot) return message.channel.send(functions.simpleEmbed('This command does not work for bots yet!'));
		let banner = await b.getBanner(member.id, { size: 4096, dynamic: true });
		if (banner.startsWith('#')) banner = functions.simpleEmbed(`Color: ${banner}`, '', banner);
		if (!banner) return message.channel.send(functions.simpleEmbed('No banner available!'));
		message.channel.send(banner);
	},
};