module.exports = {
	name: 'say',
	description: 'Repeats anything you say.',
	args: true,
	aliases: ['speak', 'echo'],
	execute(client, message, args, functions) {
		message.channel.send(args.join(' '));
		message.delete();
	},
};