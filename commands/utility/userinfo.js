module.exports = {
	name: 'userinfo',
	description: 'Shows info about a user.',
	usage: 'userinfo <mention or id>',
	cooldown: '5',
	args: true,
	guildOnly: true,
	aliases: ['ui', 'uinfo', 'user'],
	async execute(client, message, args, functions) {
		const userID = args[0].replace(/<@!|>/g, '');
		if (!userID.match('\\d{17,18}')) return message.channel.send(functions.simpleEmbed('Not a valid mention or ID!', '', '#FFFF00'));
		const member = message.guild.member(await client.users.fetch(userID));
		if (!member) return message.channel.send(functions.simpleEmbed('No user found!', 'This command can only look up users in the current server.'));
		const embed = {
			color: '#0073E6',
			title: `${member.user.tag}`,
			thumbnail: {
				url: member.user.avatarURL(),
			},
			fields: [
				{ name: 'ID', value: member.id, inline: true },
				{ name: 'Created at', value: member.user.createdAt.toDateString(), inline: true },
				{ name: 'Joined at', value: member.joinedAt.toDateString(), inline: true },
				{ name: 'Roles', value: member.roles.cache.array().toString(), inline: true },
			],
		};
		message.channel.send({ embed: embed });
	},
};