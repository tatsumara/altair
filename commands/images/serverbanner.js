module.exports = {
	name: 'serverbanner',
	description: 'Sends this servers banner.',
	guildOnly: true,
	async execute(client, message, args, functions) {
		const banner = await message.guild.bannerURL({ size: 4096, dynamic: true });

		if (!banner) return message.channel.send(functions.simpleEmbed('Server does not have a banner.'));

		return message.channel.send(banner);
	},
};