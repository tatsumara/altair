module.exports = {
	name: 'banner',
	description: 'Sends your or the mentioned users banner.',
	usage: 'avatar [user]',
	cooldown: '5',
	guildOnly: true,
	async execute(client, message, args, functions) {
		let member = message.mentions.users.first() || args[0]?.match(/\d{17,18}/) || message.author;
		if (Array.isArray(member)) {
			member = await client.users.fetch(member[0]);
		}
		if (!member) return message.channel.send(functions.simpleEmbed('User not found or not a user!'));
		await member.fetch();

		const banner = await member.bannerURL({ size: 4096, dynamic: true });

		if (!banner) return message.channel.send(functions.simpleEmbed('User does not have a banner.'));

		message.channel.send(banner);
	},
};