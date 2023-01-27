module.exports = {
	name: 'userinfo',
	description: 'Shows info about a user.',
	usage: '/userinfo <user>',
	slashOptions: [
		{ name: 'user', description: 'user to get the avatar of', type: 6, required: false },
	],

	async execute(client, interaction) {
		const member = interaction.options.getMember('user') || interaction.member;
		member.fetch();

		const embed = {
			color: client.colors.blue,
			title: `${member.user.tag}`,
			thumbnail: {
				url: member.user.avatarURL({ size: 4096, dynamic: true }),
			},
			fields: [
				{ name: 'ID', value: member.id.toString(), inline: true },
				{ name: 'Created at', value: member.user.createdAt.toDateString(), inline: true },
				{ name: 'Joined at', value: member.joinedAt.toDateString(), inline: true },
			],
		};
		return interaction.editReply({ embeds: [embed] });
	},
};