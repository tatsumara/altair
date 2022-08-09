module.exports = {
	name: 'banner',
	description: 'Sends your or the mentioned users banner.',
	usage: 'avatar [user]',
	guildOnly: true,
	async execute(client, message, args, functions) {
		let member = message.mentions.users.first() || args[0]?.match(/\d{17,18}/) || message.author;
		if (Array.isArray(member)) {
			member = await client.users.fetch(member[0]);
		}
		if (!member) return message.reply(functions.simpleEmbed('User not found or not a user!'));
		await member.fetch();

		const banner = await member.bannerURL({ size: 4096, dynamic: true });

		if (!banner) return message.reply(functions.simpleEmbed('User does not have a banner.'));

		return message.reply(banner);
	},
};