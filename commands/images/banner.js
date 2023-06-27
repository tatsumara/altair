const imageInteraction = require('../../modules/imageInteraction.js');

module.exports = {
	name: 'banner',
	description: 'Sends your or the mentioned users banner.',
	usage: '/banner [user]',
	guildOnly: true,
	slashOptions: [
		{ name: 'user', description: 'user to get the banner of', type: 6, required: false },
	],
	async execute(client, interaction, functions) {
		const user = interaction.options.getUser('user') || interaction.user;
		await user.fetch();

		const bannerURL = await user.bannerURL({ dynamic: true });
		if (!bannerURL) return interaction.editReply(functions.simpleEmbed('User does not have a banner.'));

		imageInteraction(client, interaction, bannerURL);
	},
};