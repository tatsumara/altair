module.exports = {
	name: 'banner',
	description: 'Sends your or the mentioned users banner.',
	usage: 'banner [user]',
	guildOnly: true,
	slashOptions: [
		{ name: 'user', description: 'user to get the banner of', type: 6, required: false },
	],
	async execute(_client, interaction, functions) {
		const user = interaction.options.getUser('user') || interaction.user;
		await user.fetch();

		const banner = await user.bannerURL({ size: 4096, dynamic: true });
		if (!banner) return interaction.editReply(functions.simpleEmbed('User does not have a banner.'));

		return interaction.editReply(banner);
	},
};