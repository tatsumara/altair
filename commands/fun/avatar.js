module.exports = {
	name: 'avatar',
	description: 'Sends your or the mentioned users avatar.',
	usage: 'avatar [user]',
	cooldown: '5',
	guildOnly: true,
	aliases: ['av', 'pfp'],
	async execute(client, message, args, functions) {
		const userID = args[0]?.replace(/<@!|>/g, '') || message.author.id;
		if (!userID.match('\\d{17,18}')) return message.channel.send(functions.simpleEmbed('Not a valid mention or ID!', '', '#FFFF00'));
		let member = '';
		try {
			member = await message.guild.members.fetch(userID);
		} catch {
			return message.channel.send(functions.simpleEmbed('No user found!', 'This command can only show the avatar of users in the current server.'));
		}
		message.channel.send(member.user.avatarURL({ size: 2048, dynamic: true }));
	},
};