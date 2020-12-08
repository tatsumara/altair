module.exports = {
	name: 'say',
	aliases: ['speak', 'echo'],
	description: 'Repeats anything you say.',
	usage: 'say [message]',
	disabled: false,
	execute(client, message, args) {
		message.channel.send(args.join(' '));
		message.delete();
	},
};