const imageInteraction = require('../../modules/imageInteraction.js');

module.exports = {
	name: 'avatar',
	description: 'Sends your or the mentioned users avatar.',
	usage: '/avatar [user]',
	guildOnly: true,
	slashOptions: [
		{ name: 'user', description: 'user to get the avatar of', type: 6, required: false },
	],

	async execute(client, interaction) {
		const member = interaction.options.getMember('user') || interaction.member;
		// member.fetch();

		const avatarURL = await member.displayAvatarURL({ dynamic: true });

		imageInteraction(client, interaction, avatarURL);
	},
};