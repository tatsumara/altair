module.exports = {
	name: 'say',
	description: 'Repeats anything you say',
	disabled: false,
	execute(client, message, args) {
		message.channel.send(args.join(' '));
		message.delete();
	},
};