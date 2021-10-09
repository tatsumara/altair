module.exports = {
	name: 'avatar',
	description: 'Sends your or the mentioned users avatar.',
	usage: 'avatar [user]',
	cooldown: '5',
	guildOnly: true,
	aliases: ['av', 'pfp'],
	async execute(client, message, args, functions) {
		let member = message.mentions.members.first() || args[0]?.match(/\d{17,18}/) || message.member;
		if (Array.isArray(member)) {
			member = await message.guild.members.fetch(member[0]);
		}
		if (!member) return message.channel.send(functions.simpleEmbed('User not found or not a user!'));
		message.channel.send(member.displayAvatarURL({ size: 4096, dynamic: true }));
	},
};