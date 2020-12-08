module.exports = {
	name: 'say',
	aliases: ['speak', 'echo'],
	description: 'Repeats anything you say.',
	usage: 'say [message]',
	disabled: false,
	execute(client, message, args) {
		if (!args[0]) {
			message.react('❌');
			return;
		}
		message.channel.send(args.join(' '));
		message.delete();
	},
};