module.exports = {
	name: 'avatar',
	description: 'Sends your or the mentioned users avatar.',
	usage: 'avatar [user]',
	cooldown: '5',
    aliases: ['av', 'pfp'],
	execute(client, message) {
		let user = '';
		if (message.mentions.members.first()) {
			user = message.mentions.members.first().user;
		} else {
			user = message.author;
		}
        message.channel.send(user.avatarURL({ size: 2048, dynamic: true }));
	},
};