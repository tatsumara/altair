module.exports = {
	name: 'avatar',
	description: 'Sends your or the mentioned users avatar.',
    aliases: ['av', 'pfp'],
	execute(client, message) {
        const user = message.mentions.members.first().user || message.author;
        message.channel.send(user.avatarURL({ size: 2048, dynamic: true }));
	},
};