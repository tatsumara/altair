module.exports = {
	name: 'serverbanner',
	description: 'Sends this servers banner.',
	slashOptions: [],
	async execute(_client, interaction, functions) {
		const banner = await interaction.guild.bannerURL({ size: 4096, dynamic: true });

		if (!banner) return interaction.editReply(functions.simpleEmbed('Server does not have a banner.'));

		return interaction.editReply(banner);
	},
};