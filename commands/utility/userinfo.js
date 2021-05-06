module.exports = {
	name: 'userinfo',
	description: 'Shows info about a user.',
	usage: 'userinfo <mention or id>',
	cooldown: '5',
	args: true,
	aliases: ['ui', 'uinfo', 'user'],
	async execute(client, message, args, functions) {
		const user = message.mentions.members.first().user || await client.users.fetch(args[0]);
		const member = message.guild.member(user);
		const embed = {
			color: '#0073E6',
			title: `${user.tag}`,
			thumbnail: {
				url: user.avatarURL(),
			},
			fields: [
				{ name: 'ID', value: user.id, inline: true },
				{ name: 'Created at', value: user.createdAt.toDateString(), inline: true },
				{ name: 'Joined at', value: member.joinedAt.toDateString(), inline: true },
				{ name: 'Roles', value: member.roles.cache.array().toString(), inline: true },
			],
		};
		message.channel.send({ embed: embed });
	},
};