module.exports = {
	name: 'userinfo',
	description: 'Shows info about a user.',
	usage: 'userinfo <mention or id>',
	guildOnly: true,
	aliases: ['ui', 'uinfo', 'user'],
	async execute(client, message, args, functions) {
		let member = message.mentions.members.first() || args[0]?.match(/\d{17,18}/) || message.member;
		if (Array.isArray(member)) {
			try {
				member = await message.guild.members.fetch(member[0]);
			} catch {
				member = undefined;
			}
		}
		if (!member) return await message.reply(functions.simpleEmbed('User not found or not a user!'));
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
		return await message.reply({ embeds: [embed] });
	},
};