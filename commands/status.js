module.exports = {
	name: 'status',
	description: 'Changes or displays the bots current status.',
	execute(client, message, args) {
		if (!args[0]) {
			message.channel.send(`I am currently ${client.user.presence.status}.`);
			return;
		}
		if (args[0] === 'online') {
			client.user.setStatus('online');
			client.user.setAvatar('./resources/altair.png');
			return;
		}
		if (args[0] === 'idle') {
			client.user.setStatus('idle');
			client.user.setAvatar('./resources/altair_idle.png');
			return;
		}
		if (args[0] === 'dnd') {
			client.user.setStatus('dnd');
			client.user.setAvatar('./resources/altair_dnd.png');
			return;
		}
		if (args[0] === 'offline') {
			client.user.setStatus('invisible');
			client.user.setAvatar('./resources/altair_offline.png');
			return;
		}
	},
};